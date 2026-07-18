const { Pinecone } = require('@pinecone-database/pinecone')

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const chatgptcloneIndex = pc.index('chatgpt-clone','https://chatgpt-clone-b78mkbq.svc.aped-4627-b74a.pinecone.io')

async function createMemory({vectors, messageId, metadata}){
    const records = [{
        id: messageId,
        values: vectors,
        metadata: metadata
    }]
    await chatgptcloneIndex.namespace('example-namespace').upsert({ records: records });
}


async function queryMemory({queryVector, limit = 5, metadata}){
    const data = await chatgptcloneIndex.query({
        vector: queryVector,
        topK: limit,
        filter: metadata ? metadata : undefined,
        includeMetadata: true
    })
return data.matches
}

module.exports = {createMemory, queryMemory}




