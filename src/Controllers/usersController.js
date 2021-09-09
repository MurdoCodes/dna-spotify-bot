const bcrypt = require('bcrypt')
const uuidAPIKey = require('uuid-apikey')
const Users = require('../Models/usersModel')

const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)

// Export function
exports.fetchAllUsers = async (req, res, next) => {
    try{
       const [allUsers] = await Users.fetchAllUsers()
       res.status(200).json(allUsers)
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).json()
    }
}

exports.fetchSingleUser = async (req, res, next) => {
    const id = req.params.id
    try{
        const result = await Users.fetchSingleUser(id)
        if(!result[0][0]){
            res.status(200).json({message: `Cant find ID: ${id}. User doest not exist..`, result: result[0][0]})
        }else{
            res.status(200).json({message: `ID:  ${id} found.`, result: result[0][0]})
        }
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).json()
    }
}

exports.createUser = async (req, res, next) => {
    const {first_name, last_name, email, password} = req.body
    try{
        const ifExistEmail = await Users.ifExistUser(email)
        if(!ifExistEmail[0][0]){
            const hashPassword = bcrypt.hashSync(password, salt)
            const key = uuidAPIKey.create()
            const uuid = key.uuid
            const apiKey = key.apiKey

            const data = {
                "fname": first_name,
                "lname": last_name,
                "email": email,
                "password": hashPassword,
                "uuid": uuid,
                "apiKey": apiKey
            }        
            const result = await Users.createNewUser(data)
            if(result){
                res.status(200).json({message: `Email: ${email} available. Registraion Successful...`, affectedRows: result[0].affectedRows})
            }
        }else{
            res.status(200).json({message: `Email already exist...`})            
        }
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
}

exports.updateUser = async (req, res, next) => {
    const {id, fname, lname, email} = req.body
    try{
       const result = await Users.updateUser(id, fname, lname, email)
       if(result[0].changedRows == 0){
        res.status(200).json({message: `User id: ${id} not found. Update Failed.`, changedRows: result[0].changedRows})
       }else{
        res.status(200).json({message: `User id: ${id} found. Successfully updated User.`, changedRows: result[0].changedRows})
       }       
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
}

exports.deleteSingleUser = async (req, res, next) => {
    const id = req.params.id
    try{
        const result = await Users.deleteUser(id)
        if(result[0].affectedRows == 0){
            res.status(200).json({message: `User id: ${id} not found. Delete Failed.`, affectedRows: result[0].affectedRows})
           }else{
            res.status(200).json({message: `User id: ${id} found. Successfully deleted User.`, affectedRows: result[0].affectedRows})
           }    
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
}

exports.deleteAllUser = async (req, res, next) => {
    try{
        const result = await Users.deleteAllUsers()
        if(result[0].affectedRows == 0){
            res.status(200).json({message: `No more users to delete`, affectedRows: result[0].affectedRows})
           }else{
            res.status(200).json({message: `Successfully deleted all users`, affectedRows: result[0].affectedRows})
           }    
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
}

exports.loginUser = async (req, res, next) => {
    const {email, password} = req.body
    try{
        const ifExistEmail = await Users.ifExistUser(email)
        if(!ifExistEmail[0][0]){            
            res.status(200).json({message: `Email: ${email} does not exist...`})
        }else{
            const hashPassword = ifExistEmail[0][0].users_password
            console.log(hashPassword)
            bcrypt.compare(password, hashPassword, (err, response) => {
                if(response){
                    res.status(200).json({message: `Successfully Logged In...`, result: response})
                }else{
                    res.status(200).json({message: `Wrong email/password combination...`, result: response})
                }
            })                      
        }
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
    
}