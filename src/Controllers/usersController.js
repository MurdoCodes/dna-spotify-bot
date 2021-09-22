const bcrypt = require('bcrypt')
const uuidAPIKey = require('uuid-apikey')
const jwt = require(`jsonwebtoken`)

const config = require(`config`)
const Users = require('../Models/usersModel')

const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)

// Export function
exports.fetchAllUsers = async (req, res, next) => { // Fetch All Users
    try{
        const allUsers = await Users.fetchAllUsers()
        if(!allUsers[0]){
            res.status(200).json({message: `No users available.`, results: allUsers.length, status: true})
        }else{
            res.status(200).json({message: `List of users...`, results: allUsers, status: true})
        }        
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).json()
    }
}

exports.fetchSingleUser = async (req, res, next) => { // Fetch Single User
    const id = req.params.id
    try{
        const result = await Users.fetchSingleUser(id)
        if(!result[0]){
            res.status(200).json({message: `Cant find ID: ${id}. User doest not exist..`, result: result[0]})
        }else{
            res.status(200).json({message: `ID: ${id} found.`, result: result[0]})
        }
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).json()
    }
}

exports.createUser = async (req, res, next) => { // Create User/Register
    const {first_name, last_name, email, password} = req.body
    try{
        const ifExistEmail = await Users.ifExistUser(email)
        if(!ifExistEmail[0]){
            const hashPassword = bcrypt.hashSync(password, salt)
            const key = uuidAPIKey.create()
            const uuid = key.uuid
            const apiKey = key.apiKey

            if(req.path === `/registerAdmin`){
                role = "admin"
            }else{
                role = "basic"
            }
            const data = {
                "fname"   : first_name,
                "lname"   : last_name,
                "email"   : email,
                "password": hashPassword,
                "role"    : role,
                "uuid"    : uuid,
                "apiKey"  : apiKey
            }
            const result = await Users.createNewUser(data)
            if(result){
                res.status(200).json({message: `Email: ${email} available. Registraion Successful...`, userRole: role, affectedRows: result.affectedRows, status: true})
            }
        }else{
            res.status(200).json({message: `Email already exist...`, status: false})
        }
        
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
}

exports.loginUser = async (req, res) => { // Login User
    const {email, password} = req.body
    try{
        const result = await Users.ifExistUser(email)
        if(!result[0]){            
            res.status(200).json({message: `Email: ${email} doesn't exist...`, status: false})
        }else{
            const tokenData = {
                "id"        : result[0].idusers,
                "first_name": result[0].users_first_name,
                "last_name" : result[0].users_email,
                "dateCreate": result[0].user_date_time_created,
                "userRole"  : result[0].users_role
            }
            const hashPassword = result[0].users_password
            bcrypt.compare(password, hashPassword, (err, response) => {
                if(response){
                    const accessToken = jwt.sign(tokenData, config.ACCESS_TOKEN_SECRET)
                    res.status(200).json({message: `Successfully Logged In...`, accessToken: accessToken, data:tokenData,  status: response})
                }else{
                    res.status(200).json({message: `Wrong email/password combination...`, status: response})
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

exports.updateUser = async (req, res, next) => { // Update Single User
    const {id, fname, lname, email} = req.body
    try{
        const result = await Users.updateUser(id, fname, lname, email)
        if(result.changedRows == 0){
            res.status(200).json({message: `User ID: ${id} not found. Update Failed.`, changedRows: result.changedRows, status: false})
        }else{
            res.status(200).json({message: `User ID: ${id} found. Successfully updated User.`, changedRows: result.changedRows, status: true})
        }  
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
}

exports.deleteSingleUser = async (req, res, next) => { // Delete Single User
    const id = req.params.id
    try{
        if(req.user.id == id){
            res.status(200).json({message: `Unable to delete currently used account.`, status: false})
        }else{
            const result = await Users.deleteUser(id)
            if(result.affectedRows == 0){
                res.status(200).json({message: `User ID: ${id} not found. Delete Failed.`, affectedRows: result.affectedRows, status: false})
            }else{
                res.status(200).json({message: `User ID: ${id} found. Successfully deleted User.`, affectedRows: result.affectedRows, status: true})
            }
        }    
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
}

exports.deleteAllUser = async (req, res, next) => { // Delete All Users
    try{
        if(req.user.userRole === `basic`){
            res.status(200).json({message: `Not allowed to delete users`, status: false})
        }else{
            const result = await Users.deleteAllUsers(req.user.id)
            if(result.affectedRows == 0){
                res.status(200).json({message: `No more users to delete`, affectedRows: result.affectedRows, status: true})
            }else{
                res.status(200).json({message: `Successfully deleted all users`, affectedRows: result.affectedRows, status: true})
            }
        }
        
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
}

exports.deleteSelected = async (req, res, next) => {
    try{
        if(req.user.userRole === `basic`){
            res.status(200).json({message: `Not allowed to delete users`, status: false})
        }else{
            console.log(req.body)
            // const result = await Users.deleteAllUsers(req.user.id)
            // if(result.affectedRows == 0){
            //     res.status(200).json({message: `No more users to delete`, affectedRows: result.affectedRows, status: true})
            // }else{
            //     res.status(200).json({message: `Successfully deleted all users`, affectedRows: result.affectedRows, status: true})
            // }
        }
        
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
}