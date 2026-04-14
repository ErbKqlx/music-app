// import Response from "../configs/response.js"
// import User from "../models/User.js"
import db from "../models/index.js"

// const User = db.user
const Playlist = db.playlist

class PlaylistController{
    static async getPlaylists(req, res){
        const playlists = await Playlist.findAll({ where: {
            id_user: req.params.id
        }}).catch((err) => {
            console.log(err)
        })

        // console.log(playlists)

        playlists.forEach(function(playlist){
            playlist.image = `http://localhost:8080/${playlist.image}`
            console.log(playlist.image)
        })

        return res.status(200).json({
            playlists
        })
        // return Response.success(res, 'Плейлисты')
    }
}

export default PlaylistController