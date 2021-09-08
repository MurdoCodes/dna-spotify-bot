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
    try{
        const result = await Users.fetchSingleUser(req.params.id)
        if(!result[0][0]){
            res.status(200).json({message: `Cant find ID: ${req.params.id}. User doest not exist..`, result: result[0][0]})
        }else{
            res.status(200).json({message: `ID:  ${req.params.id} found.`, result: result[0][0]})
        }
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).json()
    }
}

exports.createUser = async (req, res, next) => {

    try{
        const ifExistEmail = await Users.ifExistUser(req.body.email)
        if(!ifExistEmail[0][0]){
            const hashPassword = bcrypt.hashSync(req.body.password, salt)
            const key = uuidAPIKey.create()
            const uuid = key.uuid
            const apiKey = key.apiKey

            const data = {
                "fname": req.body.first_name,
                "lname": req.body.last_name,
                "email": req.body.email,
                "password": hashPassword,
                "uuid": uuid,
                "apiKey": apiKey
            }        
            const result = await Users.createNewUser(data)
            if(result){
                res.status(200).json({message: `Email: ${data.email} does not exist Registraion Successful...`, affectedRows: result[0].affectedRows})
            }
        }else{
            res.status(200).json({message: `Email already exist...`, result: ifExistEmail[0][0]})            
        }
        
               

        
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
}

exports.updateUser = async (req, res, next) => {
    try{
       const result = await Users.updateUser(req.body.id, req.body.fname, req.body.lname, req.body.email)
       if(result[0].changedRows == 0){
        res.status(200).json({message: `User id: ${req.body.id} not found. Update Failed.`, changedRows: result[0].changedRows})
       }else{
        res.status(200).json({message: `User id: ${req.body.id} found. Successfully updated User.`, changedRows: result[0].changedRows})
       }       
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
}

exports.deleteUser = async (req, res, next) => {
    try{
        const result = await Users.deleteUser(req.params.id)
        if(result[0].affectedRows == 0){
            res.status(200).json({message: `User id: ${req.params.id} not found. Delete Failed.`, affectedRows: result[0].affectedRows})
           }else{
            res.status(200).json({message: `User id: ${req.params.id} found. Successfully deleted User.`, affectedRows: result[0].affectedRows})
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