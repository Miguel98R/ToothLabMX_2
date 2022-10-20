
let usersModel = require('../models/users.model')
const { encrypt, compare } = require('../helpers/handleBcrypt')

let login_user = async function (req,res){

    let {user,password} = req.body

        console.log(user)
        console.log(password)

    try {

        let user_data = await usersModel.findOne({ user })

        if(!user_data){
            return   res.status(400).json({
                success:false,
                message:"Usuario incorrecto"
            })

            
        }

        
        console.log(user_data.password)

        let checkPassword = await compare(password , user_data.password)
 

        if(checkPassword){

            res.status(200).json({
                success:true,
                data:user_data
                
            })

        }else{

            return   res.status(400).json({
                success:false,
                message:"Contraseña incorrecta"
            })

            


        }
    
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success:false,
            error:e
        })
        
    }

}

let registrer_user = async function (req, res) {

    let { user, password } = req.body

    try {

        let passwordHash = await encrypt(password)


        let new_user = new usersModel({

            user: user,
            password: passwordHash

        })

        console.log(" new_user>>", new_user)

        new_user = await new_user.save()



        res.status(200).json({
            success: true,
            data: new_user
        })

    } catch (error) {

        console.log(e)
        res.status(500).json({
            success: false,
            error: e
        })

    }


}

module.exports = { registrer_user , login_user}