
const { verifyToken } = require('../helpers/generateToken')

const checkout = async (req, res, next) => {
    console.log("entro primero")

    console.log(req.headers)

    try {

        const token = req.headers.authorization.split(' ').pop() 
        console.log(token)


        const tokenData = await verifyToken(token)
        console.log("data>>",tokenData)
        if (tokenData._id) {
            next()
        } else {
            res.status(409)
            res.send({ error: 'Tu por aqui no pasas!' })
        }

    } catch (e) {
        console.log(e)
        res.status(409)
        res.send({ error: 'Tu por aqui no pasas!' })
    }

}

module.exports = checkout