const axios = require(`axios`)

const Task = require(`../src/Models/taskModel`)
const Users = require('../src/Models/spotifyUsersModel')

module.exports = async () => {    
    const pendingTask = await Task.fetchPendingTasks()

    Object.keys(pendingTask).forEach(async (k) => {
        let result = pendingTask[k];
        let spotifyId = result.spotify_users_id

        let singleUserData = await Task.fetchAllPendingUserTaskData(spotifyId)
        let data =  singleUserData[0]
        let spotify_user_email = data.spotify_user_email
        let spotify_user_password = data.spotify_user_password
        let spotify_task_id = data.spotify_task_id
        let spotify_task_music_title = data.spotify_task_music_title
        let spotify_task_schedule = new Date(data.spotify_task_schedule)
        let today = new Date()

        if(spotify_task_schedule < today){
            let webApiUrl = `http://localhost:5000/api/spotify/process/?id=${spotify_task_id}&email=${spotify_user_email}&password=${spotify_user_password}&musicTitle=${spotify_task_music_title}`
            const tokenStr = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsImZpcnN0X25hbWUiOiJ0ZXN0IiwibGFzdF9uYW1lIjoidGVzdEB0ZXN0LmNvbSIsImRhdGVDcmVhdGUiOiIyMDIxLTA5LTE1VDAwOjA2OjA2LjAwMFoiLCJpYXQiOjE2MzE4NTQwNjJ9.94W3gcuoZF4pmw4QDgUKoljFHRy8b8TVXunYZhd7CYo'
            axios.get(webApiUrl, { headers: {"Authorization" : `Bearer ${tokenStr}`} });
        }        
    })
}
