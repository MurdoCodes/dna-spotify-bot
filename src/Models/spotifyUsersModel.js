const config = require(`config`)
const db = require('../../utils/dbConnect')

module.exports = class Users{
    // constructor(data) {        
    //     this.fname = data.first_name
    //     this.lname = data.last_name
    //     this.email = data.email
    //     this.password = data.password
    // }

    static fetchAllUsers(user_id){
        const query = 'SELECT * FROM dns_spotify.spotify_users WHERE users_idusers = ?'
        return db.execute(query, [user_id])
    }

    static fetchSingleUser(user_id, spotify_id){
        const query = `SELECT * FROM dns_spotify.spotify_users WHERE users_idusers = ? && spotify_user_id = ?`
        return db.execute(query, [user_id, spotify_id])
    }

    static createNewUser(data){
        const query = `INSERT INTO dns_spotify.spotify_users (spotify_user_email, spotify_user_password, users_idusers) VALUES (?, ?, ?)`
        return db.execute(query, [data.email, data.password, data.users_id])
    }

    static ifExistUser(email, user_id){        
        const query = `SELECT * FROM dns_spotify.spotify_users WHERE spotify_user_email = ? && users_idusers = ?`
        return db.query(query, [email, user_id])
    }

    // static updateUser(id, fname, lname, email){
    //     const query = `UPDATE dns_spotify.spotify_users SET users_first_name = ?, users_last_name = ?, users_email = ? WHERE idusers = ?`
    //     return db.query(query, [fname, lname, email, id])
    // }

    static deleteUser(user_id, spotify_id){
        const query = `DELETE FROM dns_spotify.spotify_users WHERE users_idusers = ? && spotify_user_id = ?`
        return db.query(query, [user_id, spotify_id])
    }

    static deleteAllUsers(user_id){
        const query = `DELETE FROM dns_spotify.spotify_users WHERE users_idusers = ?`
        return db.query(query, [user_id])
    }
    
}