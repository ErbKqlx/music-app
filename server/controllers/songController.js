import db from "../models/index.js"

// const Playlist = db.playlist
// const PlaylistsSongs = db.playlists_songs
const Song = db.song
// const Artist = db.artist

class SongController{
    static async getOneSong(req, res){
        const song = await Song.findOne({ where: {
            id: req.params.id
        }}).catch((err) => {
            console.log(err)
        })

        song.image = `http://localhost:8080/${song.image}`
        
        const artist = await song.getArtists()

        // const songData = await Promise.all(
        //     songs.map(async song => {
        //         song.image = `http://localhost:8080/${song.image}`
        //         const artists = await song.getArtists()
            
        //         const artistsData = artists.map(artist => {
        //             return {
        //                 id: artist.id,
        //                 name: artist.name,
        //             }
        //         })
        //         return {
        //             id: song.id,
        //             name: song.name,
        //             length: song.length,
        //             artists: artistsData,
        //             image: song.image,
        //         }
        //     })
        // )

        return res.status(200).json({
            data: {
                id: song.id,
                name: song.name,
                artists: {
                    // id: user.id,
                    // username: user.username,
                },
                release_date: song.release_date,
                image: song.image
            }
        })
    }
}

export default SongController