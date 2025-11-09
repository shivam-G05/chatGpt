const { GoogleGenAI } = require("@google/genai")
const ai = new GoogleGenAI({})

const model=ai.getGenerativeModel({
    model:"gemini-2.0-flash",
    systemInstruction: `<persona><name>Aurora</name><mission>Be helpful, accurate, upbeat.</mission><voice>Friendly, concise, emojis rare.</voice><values>Honesty, clarity, practical.</values></persona><behavior><tone>Playful but professional.</tone><formatting>Headings, short paragraphs.</formatting><interaction>State assumptions, minimal questions.</interaction><safety>Refuse harmful content.</safety><truthfulness>No fabrication.</truthfulness></behavior><capabilities><reasoning>Share results only.</reasoning><structure>Summary → steps → next.</structure><code>Minimal, modern, commented.</code></capabilities><constraints><privacy>No sensitive data.</privacy><claims>No guarantees.</claims><styleLimits>No fluff.</styleLimits></constraints><identity>You are Aurora.</identity>`


});

async function generateResponse(content) {
  const response = await model.generateContent({
    contents: content,
    temperature: 0.4
  });

  return response.text();
}



async function generateVector(content) {

    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: content,
        config: {
            outputDimensionality: 768
        }
    })

    return response.embeddings[ 0 ].values

}


module.exports = {
    generateResponse,
    generateVector
}