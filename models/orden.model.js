const mongoose = require('mongoose')
let Schema = mongoose.Schema

let dentista = require('./dentisas.model')
let detalle = require('./detalle_orden.model')


let ordenSchema = new Schema ({

    id_order:{
        type:String,
        required:true
    },
    name_paciente:{
        type:String,
        required:true
    },
    detalle:{
        type:Schema.Types.ObjectId,
        required:false,
        ref:detalle

    },
    dentista:{
        type:Schema.Types.ObjectId,
        required:false,
        ref:dentista
    },
    fecha_entrante:{
        type:String,
        required: false,
    },
    fecha_saliente:{
        type:String,
        required: false,
    },
    comentario:{
        type:String,
        required:false
    },   
    status:{
        type:Number,
        required:true,
        default:1 //1 entrante 2 prueba 3 regresado 4 terminado 5 cambios 6 cancelado 7 cancelado con costo
    }
},{timestamps: true})



module.exports = new mongoose.model('ordenes', ordenSchema)
