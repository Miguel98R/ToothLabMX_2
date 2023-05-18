const mongoose = require('mongoose')
let Schema = mongoose.Schema

let dentista = require('./dentisas.model')


let pagosSchema = new Schema ({


    fecha_pago:{
        type:Date,
        required:false
    },
    cantidad:{
        type:Number,
        required:false,
        default:0
    },

    dentista:{
        type:Schema.Types.ObjectId,
        required:false,
        ref:dentista
    },


},{timestamps: true})



module.exports = new mongoose.model('pagos', pagosSchema)
