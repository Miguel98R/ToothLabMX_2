const jwt = require('jsonwebtoken')

const tokenSign = async (user_data) => {


    return jwt.sign({_id:user_data._id, role:user_data.rol}, process.env.JWT_SECRET, {expiresIn: '1m' })

}


const verifyToken = async (token) => {

    try {

        return jwt.verify( token , process.env.JWT_SECRET)
        
    } catch (error) {
        return null
    }

}


const decodeSign  = async (token) => {

    

    return jwt.decode(token, null)

}

module.exports={ tokenSign , verifyToken , decodeSign }