const Users = require('../Models/spotifyUsersModel')

exports.createUser = async (req, res, next) => { // Create User/Register
    const {email, password} = req.body
    try{
        if(req.session.user){
            const ifExistEmail = await Users.ifExistUser(email, req.session.user.idusers)
            if(!ifExistEmail[0][0]){

                const data = {
                    "email": email,
                    "password": password,
                    "users_id": req.session.user.idusers
                }        
                const result = await Users.createNewUser(data)
                if(result){
                    res.status(200).json({message: `Email: ${email} available. Registraion Successful...`, affectedRows: result[0].affectedRows})
                }
            }else{
                res.status(200).json({message: `Email already exist...`})            
            }
        }else{
            res.send({
                LoggedIn: false
            })
        }
        
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
}

// Export function
exports.fetchAllUsers = async (req, res, next) => { // Fetch All Users
    try{
        if(req.session.user){
            const [allUsers] = await Users.fetchAllUsers(req.session.user.idusers)
            res.status(200).json(allUsers)
        }else{
            res.send({
                LoggedIn: false
            })
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
        if(req.session.user){
            const result = await Users.fetchSingleUser(req.session.user.idusers, id )
            if(!result[0][0]){
                res.status(200).json({message: `Cant find ID: ${id}. User doest not exist..`, result: result[0][0]})
            }else{
                res.status(200).json({message: `ID:  ${id} found.`, result: result[0][0]})
            }
        }else{
            res.send({
                LoggedIn: false
            })
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
        if(req.session.user){
            const result = await Users.deleteUser(req.session.user.idusers, id)
            if(result[0].affectedRows == 0){
                res.status(200).json({message: `User id: ${id} not found. Delete Failed.`, affectedRows: result[0].affectedRows})
            }else{
                res.status(200).json({message: `User id: ${id} found. Successfully deleted User.`, affectedRows: result[0].affectedRows})
            }
        }else{
            res.send({
                LoggedIn: false
            })
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
        if(req.session.user){
            const result = await Users.deleteAllUsers(req.session.user.idusers)
            if(result[0].affectedRows == 0){
                res.status(200).json({message: `No more users to delete`, affectedRows: result[0].affectedRows})
            }else{
                res.status(200).json({message: `Successfully deleted all users`, affectedRows: result[0].affectedRows})
            }
        }else{
            res.send({
                LoggedIn: false
            })
        }
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
}