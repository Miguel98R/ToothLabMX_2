
let usersModel = require('../models/users.model')
const { encrypt, compare } = require('../helpers/handleBcrypt')
const { tokenSign } = require('../helpers/generateToken')


let login_user = async function (req,res){

    let {user,password} = req.body


        console.log(user)
        console.log(password)

    try {

        let user_data = await usersModel.findOne({ user })

        if (!user_data) {
            res.status(404).json({
                code:404,
                success: false,
                message:  'Usuario incorrecto'
            })
            return 0
        }

        
        console.log(user_data.password)

        let checkPassword = await compare(password , user_data.password)
        let tokenSession = await tokenSign(user_data)

        
        if(checkPassword){

            res.status(200).json({
                code:200,
                success:true,
                data:user_data,
                tokenSession
                
            })
            
            


        }else{

            res.status(403).json({
                code:403,
                success: false,
                message:  'Contraseña incorrecta'
            })
            return 0

      


        }
    
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success:false,
            error:e
        })
        return 0
    }

}

let registrer_user = async function (req, res) {

    let { user, password, rol } = req.body

    try {

        let passwordHash = await encrypt(password)


        let new_user = new usersModel({

            user: user,
            password: passwordHash,
            rol:rol

        })

        console.log(" new_user>>", new_user)

        new_user = await new_user.save()



        res.status(200).json({
            success: true,
            data: new_user
        })

    } catch (e) {

        console.log(e)
        res.status(500).json({
            success: false,
            error: e
        })

        return 0

    }


}

module.exports = { registrer_user , login_user}