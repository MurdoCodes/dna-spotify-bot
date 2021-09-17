const config = require(`config`)
const db = require('../../utils/dbConnect')

module.exports = class Users{

    static fetchAllUsers(){
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM ds_spotify_bot.users'
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
            const query = `SELECT * FROM ds_spotify_bot.users WHERE idusers = ?`
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
            const query = `INSERT INTO ds_spotify_bot.users (users_first_name, users_last_name, users_email, users_password, users_uuid, users_api_key) VALUES (?, ?, ?, ?, ?, ?)`
            db.query(query, [data.fname, data.lname, data.email, data.password, data.uuid, data.apiKey], (err, result) => {
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

    static updateUser(id, fname, lname, email){
        return new Promise((resolve, reject) => {
            const query = `UPDATE ds_spotify_bot.users SET users_first_name = ?, users_last_name = ?, users_email = ? WHERE idusers = ?`
            db.query(query, [fname, lname, email, id], (err, result) => {
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
            const query = `DELETE FROM ds_spotify_bot.users WHERE idusers NOT IN (?)`
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