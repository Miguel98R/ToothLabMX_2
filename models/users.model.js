const mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema ({

    user:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

},{timestamps: true})



module.exports = new mongoose.model('users', userSchema)
