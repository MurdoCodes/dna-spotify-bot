const Users = require('../Models/spotifyUsersModel')

exports.createUser = async (req, res, next) => { // Create User/Register
    const {email, password} = req.body
    try{
        const ifExistEmail = await Users.ifExistUser(email, req.user.id)
        if(!ifExistEmail[0]){
            const data = {
                "email": email,
                "password": password,
                "users_id": req.user.id
            }        
            const result = await Users.createNewUser(data)
            if(result){
                res.status(200).json({message: `Email: ${email} available. Registraion Successful...`, affectedRows: result.affectedRows, status: true})
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

exports.fetchAllUsers = async (req, res, next) => { // Fetch All Users
    try{
        const allUsers = await Users.fetchAllUsers(req.user.id)
        if(!allUsers[0]){
            res.status(200).json({message: `No available spotify users for user ${req.user.first_name}.`, results: allUsers.length, status: true})
        }else{
            res.status(200).json({message: `Spotify users available for user ${req.user.first_name}.`, results: allUsers, status: true})
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
        const result = await Users.fetchSingleUser( req.user.id, id )
        if(!result[0]){
            res.status(200).json({message: `Cant find ID: ${req.user.id}. User doest not exist..`, result: result[0], status: false})
        }else{
            res.status(200).json({message: `ID: ${req.user.id} found.`, result: result[0], status: true})
        }
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).json()
    }
}

// exports.updateUser = async (req, res, next) => { // Update Single User
//     const {id, fname, lname, email} = req.body
//     try{
//         if(req.session.user){
//             const result = await Users.updateUser(id, fname, lname, email)
//             if(result[0].changedRows == 0){
//                 res.status(200).json({message: `User id: ${id} not found. Update Failed.`, changedRows: result[0].changedRows})
//             }else{
//                 res.status(200).json({message: `User id: ${id} found. Successfully updated User.`, changedRows: result[0].changedRows})
//             }
//         }else{
//             res.send({
//                 LoggedIn: false
//             })
//         }       
//     }catch (err){
//         if(!err.statusCode){
//             err.statusCode = 500
//         }
//         res.status(err.statusCode).send(err.message)
//     }
// }

exports.deleteSingleUser = async (req, res, next) => { // Delete Single User
    const id = req.params.id
    try{
        const result = await Users.deleteUser(req.user.id, id)
        if(result.affectedRows == 0){
            res.status(200).json({message: `User ID: ${id} not found. Delete Failed.`, affectedRows: result.affectedRows, status: false})
        }else{
            res.status(200).json({message: `User ID: ${id} found. Successfully deleted User.`, affectedRows: result.affectedRows, status: true})
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
        const result = await Users.deleteAllUsers(req.user.id)
        if(result.affectedRows == 0){
            res.status(200).json({message: `No more users to delete`, affectedRows: result.affectedRows, result: false})
        }else{
            res.status(200).json({message: `Successfully deleted all users`, affectedRows: result.affectedRows, result: true})
        }
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
}

exports.deleteSelected = async (req, res, next) => { // Delete Multiple Users
    try{
        const obj = req.body
        const arrayRes = []
        Object.keys(obj).forEach(function(k){
            arrayRes.push(obj[k])
        })
        
        const result = Users.deleteMultipleUsers(arrayRes)
        if(result.affectedRows == 0){
            res.status(200).json({message: `No more profiles to delete`, affectedRows: result.affectedRows, status: true})
        }else{
            res.status(200).json({message: `Successfully deleted all profiles`, affectedRows: result.affectedRows, status: true})
        }        
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
}