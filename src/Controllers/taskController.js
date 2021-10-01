const Task = require('../Models/taskModel')
const spotifyUsers = require('../Models/spotifyUsersModel')

exports.createTask = async (req, res, next) => { // Create Task
    const {spotify_user_id, musicTitle, taskSchedule} = req.body
    
    try{
        const userId = req.user.id
        if(!spotify_user_id){
            res.status(200).json({message: `Please associate a spotify user for this task...`, status: false})
        }else{
            const ifExistTask = await Task.ifExistTask(musicTitle, taskSchedule, userId, spotify_user_id)

            if(!ifExistTask[0]){
                const data = {
                    "musicTitle": musicTitle,
                    "taskSchedule": taskSchedule,
                    "status": `PENDING`,
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
                        affectedRows: result.affectedRows,
                        status: true
                    })
                }
            }else{
                res.status(200).json({message: `Task Already Exist...`, status: false})            
            }
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
        const allUsers = await Task.fetchAllTask(req.user.id)
        if(!allUsers[0]){
            res.status(200).json({message: `No task associated with this user...`, status: false})
        }else{
            res.status(200).json({message: `List of Users`, result: allUsers, status: true})
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
        const result = await Task.fetchSingleTask(req.user.id, id)
        if(!result[0]){
            res.status(200).json({message: `TASK ID: ${id} not found. Task does not exist..`, result: result[0], status: false})
        }else{
            res.status(200).json({message: `TASK ID: ${id} found.`, result: result[0], status: true})
        }
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).json()
    }
}

exports.updateTask = async (req, res, next) => { // Update Single Task
    const {taskId, musicTitle, taskSchedule, spotify_users_id} = req.body
    try{
        const result = await Task.updateTask(musicTitle, taskSchedule, spotify_users_id, taskId)
        if(result.changedRows == 0){
            res.status(200).json({message: `TASK ID: ${taskId} not found. Update Failed.`, changedRows: result.changedRows, status: false})
        }else{
            res.status(200).json({message: `TASK ID: ${taskId} found. Successfully updated task.`, changedRows: result.changedRows, status: true})
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
        const result = await Task.deleteTask(req.user.id, id)
        if(result.affectedRows == 0){
            res.status(200).json({message: `TASK ID: ${id} not found. Delete Failed.`, affectedRows: result.affectedRows, status: false})
        }else{
            res.status(200).json({message: `TASK ID: ${id} found. Successfully deleted User.`, affectedRows: result.affectedRows, status: true})
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
        const result = await Task.deleteAllTask(req.user.id)
        if(result.affectedRows == 0){
            res.status(200).json({message: `No more users to delete`, affectedRows: result.affectedRows})
        }else{
            res.status(200).json({message: `Successfully deleted all users`, affectedRows: result.affectedRows})
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
        
        const result = Task.deleteMultipleUsers(arrayRes)
        if(result.affectedRows == 0){
            res.status(200).json({message: `No more Task to delete`, affectedRows: result.affectedRows, status: true})
        }else{
            res.status(200).json({message: `Successfully deleted all Task`, affectedRows: result.affectedRows, status: true})
        }        
    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        res.status(err.statusCode).send(err.message)
    }
}