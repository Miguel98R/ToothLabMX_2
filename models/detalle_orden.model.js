const mongoose = require('mongoose')
let Schema = mongoose.Schema

let producto = require('./productos.model')


let detalleSchema = new Schema ({

    cantidad:{
        type: Number,
        required: true,
        default: 0
    },
    color:{
        type:String,
        required:false
    },
    tooths:[{
        type: String,
        required: true,
       
    }],
    producto:{
        type:Schema.Types.ObjectId,
        required:false,
        ref:producto
    },
    
   
},{timestamps: true})



module.exports = new mongoose.model('detalle_ordenes', detalleSchema)
