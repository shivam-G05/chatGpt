const {Server}=require('socket.io');
const cookie=require('cookie');
const jwt=require('jsonwebtoken');
const aiService=require('../services/ai');
const userModel=require('../models/user');
const messageModel=require('../models/message');
const {createMemory,queryMemory}=require('../services/vector');
function initSocketServer(httpServer){
    const io=new Server (httpServer,{
        cors:{
            origin:'http://localhost:5173',
            credentials:true
        }
    })
    io.use(async(socket,next)=>{
        const cookies=cookie.parse(socket.handshake.headers?.cookie || '');
        if(!cookies.token){
            next(new Error("Authentication error:No token provided"));
        };
        try{
            const decoded=jwt.verify(cookies.token,process.env.JWT_SECRET);
            const user=await userModel.findById(decoded.id);
            socket.user=user;
            next();
        }catch(err){
            next (new Error("Authentication error:Invalid token"));
        };

    })
    io.on ('connection',(socket)=>{
        // console.log('New user connected',socket.user);  
        socket.on('ai-message',async(message)=>{
            /*
            const message1=await messageModel.create({
                user:socket.user._id,
                chat:message.chat,
                content:message.message,
                role:'user'
            }) 

            const vectors=await aiService.generateVector(message.message);
            */
            // console.log(vectors);

            const[message1,vectors]=await Promise.all([
                await messageModel.create({
                user:socket.user._id,
                chat:message.chat,
                content:message.message,
                role:'user'
            }) ,
            await aiService.generateVector(message.message)

            ])


            await createMemory({
                vectors,
                messageId:message1._id,
                metadata:{
                    chat:message.chat,
                    user:socket.user._id,
                    text:message.message
                }
            });

            const [memory,chatHistory]=await Promise.all([
                queryMemory({
                queryVector:vectors,
                limit:3,
                metadata:{
                    user:socket.user._id, 
                }
            }),
            messageModel
                    .find({ chat: message.chat })
                    .sort({ createdAt: -1 })
                    .limit(20)
                    .lean().then(messages=>messages.reverse())
                    

            ])

            // const memory=await queryMemory({
            //     queryVector:vectors,
            //     limit:3,
            //     metadata:{
            //         user:socket.user._id, 
            //     }
            // });
            

            
            // console.log(message);

            // console.log('Retrieved memory:',memory);


            

            // const chatHistory = (
            //     await messageModel
            //         .find({ chat: message.chat })
            //         .sort({ createdAt: -1 })
            //         .limit(20)
            //         .lean()
            //     ).reverse(); // ✅ works now

            

            const stm=chatHistory.map(item=>{
                return{
                    role:item.role,
                    parts:[{text:item.content}]
                }
            })

            const ltm=[
                {
                    role:'user',
                    parts:[{
                        text:` You are a helpful assistant. Use the following pieces of context to answer the question at the end.
                        ${memory.map(item=>item.metadata.text).join('\n')}`
                    }]
                }
            ]
            // console.log('Long-term memory for context:',ltm[0]);
            // console.log('Short-term memory for context:',stm);

            const response=await aiService.generateResponse([...ltm,...stm]);
            socket.emit('ai-response',{
                content:response,
                chat:message.chat}
            );

            const[responseMessage,responseVectors]=await Promise.all([
                messageModel.create({
                user:socket.user._id,
                chat:message.chat,
                content:response,
                role:'model'
            }),
            aiService.generateVector(response)
            ]);
            /*
            // const responseMessage=await messageModel.create({
            //     user:socket.user._id,
            //     chat:message.chat,
            //     content:response,
            //     role:'model'
            // });

            // const responseVectors=await aiService.generateVector(response);
            */
            
            await createMemory({
                vectors:responseVectors,
                messageId:responseMessage._id,
                metadata:{
                    chat:message.chat,
                    user:socket.user._id,
                    text:response
                }
            })
            
            
            
        });
    });
};
module.exports=initSocketServer;
