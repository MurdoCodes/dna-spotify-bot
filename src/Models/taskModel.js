const config = require(`config`)
const db = require('../../utils/dbConnect')

module.exports = class Task{
    
    static fetchAllTask(user_id){
        const query = 'SELECT * FROM dns_spotify.spotify_task WHERE users_idusers = ?'
        return db.execute(query, [user_id])
    }

    static fetchSingleTask(user_id, spotify_task_id){
        const query = `SELECT * FROM dns_spotify.spotify_task WHERE users_idusers = ? && spotify_task_id = ?`
        return db.execute(query, [user_id, spotify_task_id])
    }

    static createNewTask(data){
        const query = `INSERT INTO dns_spotify.spotify_task (spotify_task_music_title, spotify_task_schedule, users_idusers, spotify_users_id) VALUES (?, ?, ?, ?)`
        return db.execute(query, [data.musicTitle, data.taskSchedule, data.users_id, data.spotify_user_id])
    }

    static ifExistTask(musicTitle, taskSchedule, userId, spotify_user_id){        
        const query = `SELECT * FROM dns_spotify.spotify_task WHERE spotify_task_music_title = ? && spotify_task_schedule = ? && users_idusers = ? && spotify_users_id = ?`
        return db.query(query, [musicTitle, taskSchedule, userId, spotify_user_id])
    }

    static updateTask(musicTitle, taskSchedule, taskId){
        const query = `UPDATE dns_spotify.spotify_task SET spotify_task_music_title = ?, spotify_task_schedule = ? WHERE spotify_task_id = ?`
        return db.query(query, [musicTitle, taskSchedule, taskId])
    }

    static deleteTask(user_id, spotify_id){
        const query = `DELETE FROM dns_spotify.spotify_task WHERE users_idusers = ? && spotify_task_id = ?`
        return db.query(query, [user_id, spotify_id])
    }

    static deleteAllTask(user_id){
        const query = `DELETE FROM dns_spotify.spotify_task WHERE users_idusers = ?`
        return db.query(query, [user_id])
    }
}