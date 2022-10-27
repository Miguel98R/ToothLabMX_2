const {verifyToken} = require('../helpers/generateToken')

const checkout = async (req, res, next) => {
    console.log("entro primero")

    console.log(req.headers)

    try {

        const token = req.headers.authorization.split(' ').pop()
        console.log(token)
        const tokenData = await verifyToken(token)


        /** TODO: verificar en DB que el usuario EXISTA y este activo */

     
        if (tokenData._id) {
            delete tokenData.password
            req.user = tokenData
            next()
        } else {
            res.status(409).json({
                success:false,
                message:'Sin autorizacion para entrar'
            })
            
        }

    } catch (e) {
        console.log(e)
        res.status(409).json({
            success:false,
            message:'Sin autorizacion para entrar'
        })
    }

}

module.exports = checkout
