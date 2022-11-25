const {verifyToken} = require('../helpers/generateToken')
const userModel = require('../models/users.model')

const checkRoleAuth = (roles) => async (req, res, next) => {
   
    try {

   
          const token = req.headers.authorization.split(' ').pop()
          const tokenData = await verifyToken(token)
          const userData = await userModel.findById(tokenData._id)
       
          if ([].concat(roles).includes(userData.rol)) {
              next()
          } else {
              res.status(409).json({
                succes:false,
                message:'No tienes permisos'
              })
             
          }

    } catch (e) {
        console.error(e)
        res.status(409).json({
            succes:false,
            message:'No tienes permisos'
          })
    }

}

module.exports = checkRoleAuth
