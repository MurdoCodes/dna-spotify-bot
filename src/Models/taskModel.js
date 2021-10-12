const config = require(`config`)
const db = require('../../utils/dbConnect')

module.exports = class Task{
    
    static fetchAllTask(user_id){
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM ds_spotify_bot.spotify_task INNER JOIN ds_spotify_bot.spotify_users ON ds_spotify_bot.spotify_users.spotify_user_id = ds_spotify_bot.spotify_task.spotify_users_id WHERE ds_spotify_bot.spotify_task.users_idusers = ?'

            db.query(query, [user_id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static fetchSingleTask(user_id, spotify_task_id){
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ds_spotify_bot.spotify_task INNER JOIN ds_spotify_bot.spotify_users ON ds_spotify_bot.spotify_users.spotify_user_id = ds_spotify_bot.spotify_task.spotify_users_id WHERE ds_spotify_bot.spotify_task.users_idusers = ? && spotify_task_id = ?`
            db.query(query, [user_id, spotify_task_id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static fetchPendingTasks(){
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ds_spotify_bot.spotify_task WHERE spotify_task_status = 'PENDING'`
            db.query(query, (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static fetchAllPendingUserTaskData(id){
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ds_spotify_bot.spotify_users 
            INNER JOIN ds_spotify_bot.spotify_task 
            ON ds_spotify_bot.spotify_users.spotify_user_id = ds_spotify_bot.spotify_task.spotify_users_id 
            WHERE ds_spotify_bot.spotify_users.spotify_user_id = (?) && ds_spotify_bot.spotify_task.spotify_task_status <> 'COMPLETED'`
            db.query(query, [id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static createNewTask(data){
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO ds_spotify_bot.spotify_task (spotify_task_music_title, spotify_task_schedule, spotify_task_status, users_idusers, spotify_users_id) VALUES (?, ?, ?, ?, ?)`
            db.query(query, [data.musicTitle, data.taskSchedule, data.status, data.users_id, data.spotify_user_id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static ifExistTask(musicTitle, taskSchedule, userId, spotify_user_id){
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ds_spotify_bot.spotify_task WHERE spotify_task_music_title = ? && spotify_task_schedule = ? && users_idusers = ? && spotify_users_id = ?`
            db.query(query, [musicTitle, taskSchedule, userId, spotify_user_id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static updateTask(musicTitle, taskSchedule, spotify_users_id, taskId){
        return new Promise((resolve, reject) => {
            const query = `UPDATE ds_spotify_bot.spotify_task SET spotify_task_music_title = ?, spotify_task_schedule = ?, spotify_users_id = ? WHERE spotify_task_id = ?`
            
            db.query(query, [musicTitle, taskSchedule, spotify_users_id, taskId], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static updateSingleTask(status, taskId){
        
        return new Promise((resolve, reject) => {
            const query = `UPDATE ds_spotify_bot.spotify_task SET ds_spotify_bot.spotify_task.spotify_task_status = ? WHERE ds_spotify_bot.spotify_task.spotify_task_id = ?`
            db.query(query, [status, taskId], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static deleteTask(user_id, spotify_id){
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM ds_spotify_bot.spotify_task WHERE users_idusers = ? && spotify_task_id = ?`
            db.query(query, [user_id, spotify_id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static deleteAllTask(user_id){
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM ds_spotify_bot.spotify_task WHERE users_idusers = ?`
            db.query(query, [user_id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static deleteMultipleUsers(id){
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM ds_spotify_bot.spotify_task WHERE ds_spotify_bot.spotify_task.spotify_task_id IN ( ${id} )`
            db.query(query, [id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }     
            })
        })
    }
}