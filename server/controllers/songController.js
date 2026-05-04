import db from "../models/index.js"

// const Playlist = db.playlist
// const PlaylistsSongs = db.playlists_songs
const Song = db.song
// const Artist = db.artist

const host = 'http://localhost:8080/'

class SongController{
    static async getOneSong(req, res){
        const song = await Song.findOne({ where: {
            id: req.params.id
        }}).catch((err) => {
            console.log(err)
        })

        song.image = `${host}${song.image}`
        song.song_url = `${host}${song.song_url}`
        
        const artists = await song.getArtists()
        const artistsData = artists.map(artist => {
            artist.image = `${host}${artist.image}`

            return {
                id: artist.id,
                name: artist.name,
                image: artist.image,
                bio: artist.bio,
            }
        })

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
                length: song.length,
                artists: artistsData,
                image: song.image,
                song_url: song.song_url,
                release_date: song.release_date,
                lyrics: song.lyrics,
            }
        })
    }
}

export default SongController