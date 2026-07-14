const {GoogleGenAI} = require("@google/genai")

const ai = new GoogleGenAI({});

async function generateResponse(content){
    const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: content,
  });

  return response.text
}

module.exports = {generateResponse}