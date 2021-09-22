const config = require(`config`)
const db = require('../../utils/dbConnect')

module.exports = class Users{

    static fetchAllUsers(){
        return new Promise((resolve, reject) => {
            const query = 'SELECT idusers, users_first_name, users_last_name, users_email, user_date_time_created, users_role FROM ds_spotify_bot.users'
            db.query(query, (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static fetchSingleUser(id){       
        return new Promise((resolve, reject) => {
            const query = `SELECT idusers, users_first_name, users_last_name, users_email, user_date_time_created, users_role FROM ds_spotify_bot.users WHERE idusers = ?`
            db.query(query, [id], (err, result) => {
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
            const query = `INSERT INTO ds_spotify_bot.users (users_first_name, users_last_name, users_email, users_password, users_role, users_uuid, users_api_key) VALUES (?, ?, ?, ?, ?, ?, ?)`
            db.query(query, [data.fname, data.lname, data.email, data.password, data.role, data.uuid, data.apiKey], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static ifExistUser(email){        
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ds_spotify_bot.users WHERE users_email = ( ? )`
            db.query(query, email, (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static updateUser(id, fname, lname){
        return new Promise((resolve, reject) => {
            const query = `UPDATE ds_spotify_bot.users SET users_first_name = ?, users_last_name = ? WHERE idusers = ?`
            db.query(query, [fname, lname, id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static deleteUser(id){        
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM ds_spotify_bot.users WHERE idusers = ?"
            db.query(query, [id, id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    return resolve(result)
                }            
            })
        })
    }

    static deleteAllUsers(id){        
        return new Promise((resolve, reject) => {
            const query1 = `DELETE FROM ds_spotify_bot.spotify_task WHERE ds_spotify_bot.spotify_task.users_idusers NOT IN (?)`
            db.query(query1, [id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    const query2 = `DELETE FROM ds_spotify_bot.spotify_users WHERE ds_spotify_bot.spotify_users.users_idusers NOT IN (?)`           
                    db.query(query2, [id], (err, result) => {
                        if(err){
                            return reject(err)
                        }else{
                            const query3 = `DELETE FROM ds_spotify_bot.users WHERE idusers NOT IN (?)`
                            db.query(query3, [id], (err, result) => {
                                if(err){
                                    return reject(err)
                                }else{
                                    return resolve(result)
                                }
                            })
                        }
                    })                    
                }            
            })
        })
    }

    static deleteMultipleUsers(id){
        return new Promise((resolve, reject) => {
            const query1 = `DELETE FROM ds_spotify_bot.spotify_task WHERE ds_spotify_bot.spotify_task.users_idusers IN (?)`
            db.query(query1, [id], (err, result) => {
                if(err){
                    return reject(err)
                }else{
                    const query2 = `DELETE FROM ds_spotify_bot.spotify_users WHERE ds_spotify_bot.spotify_users.users_idusers IN (?)`           
                    db.query(query2, [id], (err, result) => {
                        if(err){
                            return reject(err)
                        }else{
                            const query3 = `DELETE FROM ds_spotify_bot.users WHERE idusers IN (?)`
                            db.query(query3, [id], (err, result) => {
                                if(err){
                                    return reject(err)
                                }else{
                                    return resolve(result)
                                }
                            })
                        }
                    })                    
                }            
            })
        })
    }
    
}