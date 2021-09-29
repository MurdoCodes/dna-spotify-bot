const config = require(`config`)
const db = require('../../utils/dbConnect')

module.exports = class Users{

    static fetchAllUsers(user_id){
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM ds_spotify_bot.spotify_users WHERE users_idusers = ?'
            db.query(query, [user_id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static fetchSingleUser(user_id, spotify_id){
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ds_spotify_bot.spotify_users WHERE users_idusers = ? && spotify_user_id = ?`
            db.query(query, [user_id, spotify_id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static fetchSpotifyUserId(user_id){
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ds_spotify_bot.spotify_users WHERE users_idusers = ?`
            db.query(query, [user_id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static createNewUser(data){
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO ds_spotify_bot.spotify_users (spotify_user_email, spotify_user_password, users_idusers) VALUES (?, ?, ?)`
            db.query(query, [data.email, data.password, data.users_id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static ifExistUser(email, user_id){  
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ds_spotify_bot.spotify_users WHERE spotify_user_email = ? && users_idusers = ?`
            db.query(query, [email, user_id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    // static updateUser(id, fname, lname, email){
    //     const query = `UPDATE ds_spotify_bot.spotify_users SET users_first_name = ?, users_last_name = ?, users_email = ? WHERE idusers = ?`
    //     return db.query(query, [fname, lname, email, id])
    // }

    static deleteUser(user_id, spotify_id){
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM ds_spotify_bot.spotify_users WHERE users_idusers = ? && spotify_user_id = ?`
            db.query(query, [user_id, spotify_id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static deleteAllUsers(user_id){
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM ds_spotify_bot.spotify_users WHERE users_idusers = ?`
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
            const query = `DELETE FROM ds_spotify_bot.spotify_users WHERE ds_spotify_bot.spotify_users.spotify_user_id IN ( ? )`           
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