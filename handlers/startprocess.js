const axios = require(`axios`)

const Task = require(`../src/Models/taskModel`)
const Users = require('../src/Models/spotifyUsersModel')
const processController = require(`../src/Controllers/processController2`)

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
            const data = {
                id: spotify_task_id,
                email: spotify_user_email,
                password: spotify_user_password,
                musicTitle: spotify_task_music_title
            }

            console.log('"""""" DATA TO BE PROCESSED ########')
            console.log(data)
            console.log('"""""" DATA TO BE PROCESSED ########')
            await processController.login(data)
        }       
        
    })
}
