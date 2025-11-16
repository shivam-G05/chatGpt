// const { GoogleGenAI } = require("@google/genai")
// const ai = new GoogleGenAI({})

// async function generateResponse(content) {

//     const response = await ai.models.generateContent({
//         model: "gemini-2.0-flash",
//         contents: content,
//         config: {
//             temperature: 0.4,
//             systemInstruction:`<persona><name>Aurora</name><mission>Be a helpful, accurate AI with a playful, upbeat vibe. Empower users to build, learn, and create fast.</mission>
//             <voice>Friendly, concise, light Gen-Z energy. Plain language. Use emojis sparingly (max one per short paragraph).</voice>
//             <values>Honesty, clarity, practicality, user-first. Admit limits. Prefer actionable steps.</values>
//             </persona><behavior><tone>Playful but professional. Supportive, never condescending.</tone>
//             <formatting>Use headings, short paragraphs, minimal lists.</formatting>
//             <interaction>If ambiguous, state assumptions. Ask one clarifying question only when needed. Complete what you can now.</interaction>
//             <safety>Refuse harmful/disallowed content and offer safe alternatives.</safety>
//             <truthfulness>If unsure, say so and give best-effort guidance without fabrication.</truthfulness>
//             </behavior>
//             <capabilities>
//             <reasoning>Think internally; share only useful outcomes or calculations.</reasoning>
//             <structure>Start with summary → steps/examples → optional “Next steps.”</structure>
//             <code>Give minimal runnable code, modern practices, brief comments.</code>
//             <examples>Use specific, tailored examples.</examples>
//             </capabilities>

//             <constraints>
//             <privacy>No sensitive personal data. No secrets/tokens.</privacy>
//             <claims>No guarantees or ongoing work statements.</claims>
//             <styleLimits>No fluff, no walls of text.</styleLimits>
//             </constraints>

//             <tools>
//             <browsing>Use only for time-sensitive info or when citations requested. Cite 1–3 sources.</browsing>
//             <codeExecution>Give clear run instructions when generating/executing code.</codeExecution>
//             </tools>

//             <task_patterns>
//             <howto>State goal → prerequisites → steps → verification → pitfalls.</howto>
//             <debugging>Ask for minimal repro details. Hypothesis → test → fix.</debugging>
//             <planning>Light plan with milestones. MVP first.</planning>
//             </task_patterns>

//             <refusals>Explain why, stay neutral, offer safe alternative.</refusals>

//             <personalization>Adapt examples and explanations to user skill level.</personalization>

//             <finishing_touches>End with “Want me to tailor this further?” when useful.</finishing_touches><identity>You are Aurora. Do not claim real-world abilities or hidden access.</identity>` 
//         }
//     })

//     return response.text

// }



// async function generateVector(content) {

//     const response = await ai.models.embedContent({
//         model: "gemini-embedding-001",
//         contents: content,
//         config: {
//             outputDimensionality: 768
//         }
//     })

//     return response.embeddings[ 0 ].values

// }


// module.exports = {
//     generateResponse,
//     generateVector
// }



// services/ai.js - Updated with Tool Calling Support
const { GoogleGenAI } = require("@google/genai");
const { executeTool, getGeminiFunctionDeclarations } = require('./tools');

const ai = new GoogleGenAI({});

/**
 * Generate response with tool calling support
 */
async function generateResponse(content, options = {}) {
  try {
    const config = {
      temperature: 0.4,
      systemInstruction: `<persona><name>Aurora</name><mission>Be a helpful, accurate AI with a playful, upbeat vibe. Empower users to build, learn, and create fast. You have access to real-time tools for weather, news, and datetime information.</mission>
      <voice>Friendly, concise, light Gen-Z energy. Plain language. Use emojis sparingly (max one per short paragraph).</voice>
      <values>Honesty, clarity, practicality, user-first. Admit limits. Prefer actionable steps.</values>
      </persona><behavior><tone>Playful but professional. Supportive, never condescending.</tone>
      <formatting>Use headings, short paragraphs, minimal lists.</formatting>
      <interaction>If ambiguous, state assumptions. Ask one clarifying question only when needed. Complete what you can now.</interaction>
      <safety>Refuse harmful/disallowed content and offer safe alternatives.</safety>
      <truthfulness>If unsure, say so and give best-effort guidance without fabrication.</truthfulness>
      <tools>When users ask about weather, time, or news, use the appropriate tools to fetch real-time data. Always explain what you found using the tools.</tools>
      </behavior>
      <capabilities>
      <reasoning>Think internally; share only useful outcomes or calculations.</reasoning>
      <structure>Start with summary → steps/examples → optional "Next steps."</structure>
      <code>Give minimal runnable code, modern practices, brief comments.</code>
      <examples>Use specific, tailored examples.</examples>
      </capabilities>
      <identity>You are Aurora. You have access to real-time weather, news, and datetime information through tools.</identity>`
    };

    // Add tools if enabled (default: true)
    if (options.enableTools !== false) {
      config.tools = [{
        functionDeclarations: getGeminiFunctionDeclarations()
      }];
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: content,
      config
    });

    // Handle function calls
    const result = response.candidates?.[0]?.content;
    
    if (!result) {
      throw new Error('No response from AI model');
    }

    // Check if AI wants to call functions
    const functionCalls = result.parts?.filter(part => part.functionCall);
    
    if (functionCalls && functionCalls.length > 0) {
      // Execute all function calls
      const toolResults = await Promise.all(
        functionCalls.map(async (fc) => {
          try {
            console.log(`🔧 Calling tool: ${fc.functionCall.name}`, fc.functionCall.args);
            const toolResult = await executeTool(fc.functionCall.name, fc.functionCall.args);
            
            return {
              functionResponse: {
                name: fc.functionCall.name,
                response: toolResult
              }
            };
          } catch (error) {
            console.error(`Tool execution error:`, error);
            return {
              functionResponse: {
                name: fc.functionCall.name,
                response: {
                  success: false,
                  error: error.message
                }
              }
            };
          }
        })
      );

      // Create new content array with function results
      const updatedContent = [
        ...content,
        {
          role: 'model',
          parts: functionCalls
        },
        {
          role: 'user',
          parts: toolResults
        }
      ];

      // Get final response with tool results
      const finalResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: updatedContent,
        config: {
          ...config,
          tools: undefined // Don't allow recursive tool calls
        }
      });

      return finalResponse.text;
    }

    // No function calls, return text directly
    return response.text;

  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}

/**
 * Generate vector embeddings
 */
async function generateVector(content) {
  try {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: content,
      config: {
        outputDimensionality: 768
      }
    });

    return response.embeddings[0].values;
  } catch (error) {
    console.error('Vector generation error:', error);
    throw error;
  }
}

module.exports = {
  generateResponse,
  generateVector
};