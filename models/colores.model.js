const mongoose = require('mongoose')
let Schema = mongoose.Schema

let colorSchema = new Schema ({

    name_color:{
        type:String,
        required:true
    }

},{timestamps: true})



module.exports = new mongoose.model('colores', colorSchema)
