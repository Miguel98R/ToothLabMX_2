const mongoose = require('mongoose')
let Schema = mongoose.Schema



let dentistaSchema = new Schema ({

    name_dentista:{
        type:String,
        required:true
    },
    domicilio_dentista:{
        type:String,
        required:false

    },
    email_dentista:{
        type:String,
        required:false
    },
    tel_dentista:{
        type:String,
        required:false

    },
    tel_consultorio:{
        type:String,
        required:false

    },
    distintivo_color:{
        type: String,
        required: false,
       

    },
    status:{
        type:Boolean,
        required:true,
        default:1 //activo 1 , inactivo 0
    }
},{timestamps: true})



module.exports = new mongoose.model('dentistas', dentistaSchema)
