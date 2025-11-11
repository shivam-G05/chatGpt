// Import the Pinecone library
const { Pinecone } = require('@pinecone-database/pinecone');

// Initialize a Pinecone client
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const cohortChatgpt = pc.index('chatgpt'); // ✅ use .index() instead of .Index()

// ✅ Create (Upsert) memory
async function createMemory({ vectors, metadata, messageId }) {
  if (!vectors || !Array.isArray(vectors)) {
    throw new Error("Invalid vector data provided to createMemory.");
  }

  await cohortChatgpt.upsert([
    {
      id: messageId,
      values: vectors,
      metadata, // must be an object like { chat: '123', message: 'hi' }
    },
  ]);
}

// ✅ Query memory safely
async function queryMemory({ queryVector, limit = 5, metadata }) {
  if (!queryVector || !Array.isArray(queryVector)) {
    throw new Error("Invalid or missing queryVector for Pinecone query.");
  }

  const filter =
    metadata && Object.keys(metadata).length > 0 ? metadata : undefined;

  const data = await cohortChatgpt.query({
    vector: queryVector,
    topK: limit,
    filter, // ✅ only include filter if not empty
    includeMetadata: true,
  });

  return data.matches;
}

module.exports = { createMemory, queryMemory };

