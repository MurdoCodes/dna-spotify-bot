const Task = require('../Models/taskModel')
const spotifyUsers = require('../Models/spotifyUsersModel')

exports.createTask = async (req, res, next) => { // Create Task
    const {musicTitle, taskSchedule} = req.body
    
    try{
        if(req.session.user){
            const userId = req.session.user.idusers
            const spotifyUser = await spotifyUsers.fetchSpotifyUserId(userId)
            const spotify_user_id = spotifyUser[0][0].spotify_user_id
            const ifExistTask = await Task.ifExistTask(musicTitle, taskSchedule, userId, spotify_user_id)

            if(!ifExistTask[0][0]){
                console.log("Create Task")
                const data = {
                    "musicTitle": musicTitle,
                    "taskSchedule": taskSchedule,
                    "users_id": userId,
                    "spotify_user_id": spotify_user_id
                }        
                const result = await Task.createNewTask(data)
                if(result){
                    res.status(200).json({
                        message: `Task succefully created..`,
                        data: {
                            "musicTitle": musicTitle,
                            "taskSchedule": taskSchedule,
                        },
                        affectedRows: result[0].affectedRows
                    })
                }
            }else{
                res.status(200).json({message: `Task Already Exist...`})            
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

exports.fetchAllTask = async (req, res, next) => { // Fetch All Task
    try{
        if(req.session.user){
            const [allUsers] = await Task.fetchAllTask(req.session.user.idusers)
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

exports.fetchSingleTask = async (req, res, next) => { // Fetch Single Task
    const id = req.params.id
    try{
        if(req.session.user){
            const result = await Task.fetchSingleTask(req.session.user.idusers, id )
            if(!result[0][0]){
                res.status(200).json({message: `TASK ID: ${id} not found. Task does not exist..`, result: result[0][0]})
            }else{
                res.status(200).json({message: `TASK ID: ${id} found.`, result: result[0][0]})
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

exports.updateTask = async (req, res, next) => { // Update Single Task
    const {taskId, musicTitle, taskSchedule} = req.body
    try{
        if(req.session.user){
            const result = await Task.updateTask(musicTitle, taskSchedule, taskId)
            if(result[0].changedRows == 0){
                res.status(200).json({message: `TASK ID: ${taskId} not found. Update Failed.`, changedRows: result[0].changedRows})
            }else{
                res.status(200).json({message: `TASK ID: ${taskId} found. Successfully updated task.`, changedRows: result[0].changedRows})
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

exports.deleteSingleTask = async (req, res, next) => { // Delete Single Task
    const id = req.params.id
    try{
        if(req.session.user){
            const result = await Task.deleteTask(req.session.user.idusers, id)
            if(result[0].affectedRows == 0){
                res.status(200).json({message: `TASK ID: ${id} not found. Delete Failed.`, affectedRows: result[0].affectedRows})
            }else{
                res.status(200).json({message: `TASK ID: ${id} found. Successfully deleted User.`, affectedRows: result[0].affectedRows})
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

exports.deleteAllTask = async (req, res, next) => { // Delete All Tasks
    try{
        if(req.session.user){
            const result = await Task.deleteAllTask(req.session.user.idusers)
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