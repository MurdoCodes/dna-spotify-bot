const config = require(`config`)
const db = require('../../utils/dbConnect')

module.exports = class Users{
    // constructor(data) {        
    //     this.fname = data.first_name
    //     this.lname = data.last_name
    //     this.email = data.email
    //     this.password = data.password
    // }

    static fetchAllUsers(){
        const query = 'SELECT * FROM dns_spotify.users'
        return db.execute(query)
    }

    static fetchSingleUser(id){
        const query = `SELECT * FROM dns_spotify.users WHERE idusers = ?`
        return db.execute(query, [id])
    }

    static createNewUser(data){
        const query = `INSERT INTO dns_spotify.users (users_first_name, users_last_name, users_email, users_password, users_uuid, users_api_key) VALUES (?, ?, ?, ?, ?, ?)`
        return db.execute(query, [data.fname, data.lname, data.email, data.password, data.uuid, data.apiKey])
    }

    static ifExistUser(email){        
        const query = `SELECT users_email FROM dns_spotify.users WHERE users_email = ( ? )`
        return db.query(query, [email])
    }

    static updateUser(id, fname, lname, email){
        const query = `UPDATE dns_spotify.users SET users_first_name = ?, users_last_name = ?, users_email = ? WHERE idusers = ?`
        return db.query(query, [fname, lname, email, id])
    }

    static deleteUser(id){
        const query = `DELETE FROM dns_spotify.users WHERE idusers = ?`
        return db.query(query, [id])
    }

    static deleteAllUsers(){
        const query = `DELETE FROM dns_spotify.users`
        return db.query(query)
    }
    
}