const mongoose = require('mongoose')
let Schema = mongoose.Schema

let dentista = require('./dentisas.model')
let detalle = require('./detalle_orden.model')


let ordenSchema = new Schema ({

    name_paciente:{
        type:String,
        required:true
    },
    detalle:[{
        type:Schema.Types.ObjectId,
        required:false,
        ref:detalle

    }],

    dentista:{
        type:Schema.Types.ObjectId,
        required:false,
        ref:dentista
    },
    fecha_entrante:{
        type: Date,
        required: false,
    },
    fecha_saliente:{
        type: Date,
        required: false,
    },
    comentario:{
        type:String,
        required:false
    },   
    status:{
        type:Number,
        required:true,
        default:1 //activo 1 , inactivo 0
    }
},{timestamps: true})



module.exports = new mongoose.model('ordenes', ordenSchema)
