const { Server } = require('socket.io');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const aiService = require('../services/ai');
const userModel = require('../models/user');
const messageModel = require('../models/message');
const { createMemory, queryMemory } = require('../services/vector');

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || '');
    if (!cookies.token) {
      next(new Error("Authentication error: No token provided"));
      return;
    }
    
    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.email}`);

    socket.on('ai-message', async (message) => {
      try {
        // Save user message and generate vector
        const [message1, vectors] = await Promise.all([
          messageModel.create({
            user: socket.user._id,
            chat: message.chat,
            content: message.message,
            role: 'user'
          }),
          aiService.generateVector(message.message)
        ]);

        // Store message in vector database
        await createMemory({
          vectors,
          messageId: message1._id,
          metadata: {
            chat: message.chat,
            user: socket.user._id.toString(),
            text: message.message
          }
        });

        // Get relevant memories and chat history in parallel
        const [memory, chatHistory] = await Promise.all([
          queryMemory({
            queryVector: vectors,
            limit: 3,
            metadata: {
              user: socket.user._id.toString()
            }
          }),
          messageModel
            .find({ chat: message.chat })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean()
            .then(messages => messages.reverse())
        ]);

        // Build conversation history for Gemini
        const stm = chatHistory.map(item => ({
          role: item.role,
          parts: [{ text: item.content }]
        }));

        // Add long-term memory context
        const ltm = memory.length > 0 ? [{
          role: 'user',
          parts: [{
            text: `Previous relevant context from our conversation:
${memory.map(item => `- ${item.metadata.text}`).join('\n')}`
          }]
        }] : [];

        // Emit "typing" indicator
        socket.emit('ai-typing', { chat: message.chat });

        // Generate AI response with tool support
        const response = await aiService.generateResponse([...ltm, ...stm], {
          enableTools: true // Enable weather, news, datetime tools
        });

        // Emit AI response
        socket.emit('ai-response', {
          content: response,
          chat: message.chat
        });

        // Save AI response and generate vector
        const [responseMessage, responseVectors] = await Promise.all([
          messageModel.create({
            user: socket.user._id,
            chat: message.chat,
            content: response,
            role: 'model'
          }),
          aiService.generateVector(response)
        ]);

        // Store AI response in vector database
        await createMemory({
          vectors: responseVectors,
          messageId: responseMessage._id,
          metadata: {
            chat: message.chat,
            user: socket.user._id.toString(),
            text: response
          }
        });

      } catch (error) {
        console.error('Error processing AI message:', error);
        
        socket.emit('ai-error', {
          chat: message.chat,
          error: 'Failed to generate response. Please try again.'
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.email}`);
    });
  });

  return io;
}

module.exports = initSocketServer;