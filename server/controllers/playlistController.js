import Response from "../configs/response.js"
import User from "../models/User.js"

class PlaylistController{
    static async getPlaylists(req, res){
        return Response.success(res, 'Плейлисты')
    }
}

export default PlaylistController