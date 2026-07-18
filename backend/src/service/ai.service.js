const {GoogleGenAI} = require("@google/genai")

const ai = new GoogleGenAI({});

async function generateResponse(content){
    const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: content,
    config:{
      systemInstruction:`You are a helpful AI assistant. Generate responses precisely and in simple words. 
      response in such language in which it is questioned ( like if question is in hinglish then reply in hinglish , if in english then in english)
      Content should be brief of max 2 lines. `
    }
  });

  return response.text
}

async function generateVector(content){
   const response = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: content,
        config: {
          outputDimensionality: 768
        }
    });

    return response.embeddings[0].values
}

module.exports = {generateResponse , generateVector}