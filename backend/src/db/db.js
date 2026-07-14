const mongoose = require('mongoose')

async function connectdB(){
    try{
    await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected')
    } catch(error){
        console.log(error)
    }
}


module.exports = connectdB