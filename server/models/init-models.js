import { DataTypes } from "sequelize";
import _Albums from "./Albums";
import _Artists from "./Artists";
import _Comments from "./Comments";
import _Genres from "./Genres";
import _Playlists from "./Playlists";
import _PlaylistsSongs from "./PlaylistsSongs";
import _ReportTypes from "./ReportTypes";
import _Reports from "./Reports";
import _Roles from "./Roles";
import _Songs from "./Songs";
import _SongsAlbums from "./SongsAlbums";
import _SongsArtists from "./SongsArtists";
import _SongsSubgenres from "./SongsSubgenres";
import _Subgenres from "./Subgenres";
import _Users from "./Users";

function initModels(sequelize) {
  var Albums = _Albums(sequelize, DataTypes);
  var Artists = _Artists(sequelize, DataTypes);
  var Comments = _Comments(sequelize, DataTypes);
  var Genres = _Genres(sequelize, DataTypes);
  var Playlists = _Playlists(sequelize, DataTypes);
  var PlaylistsSongs = _PlaylistsSongs(sequelize, DataTypes);
  var ReportTypes = _ReportTypes(sequelize, DataTypes);
  var Reports = _Reports(sequelize, DataTypes);
  var Roles = _Roles(sequelize, DataTypes);
  var Songs = _Songs(sequelize, DataTypes);
  var SongsAlbums = _SongsAlbums(sequelize, DataTypes);
  var SongsArtists = _SongsArtists(sequelize, DataTypes);
  var SongsSubgenres = _SongsSubgenres(sequelize, DataTypes);
  var Subgenres = _Subgenres(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);

  SongsAlbums.belongsTo(Albums, { as: "id_album_album", foreignKey: "id_album"});
  Albums.hasMany(SongsAlbums, { as: "songs_albums", foreignKey: "id_album"});
  Albums.belongsTo(Artists, { as: "id_artist_artist", foreignKey: "id_artist"});
  Artists.hasMany(Albums, { as: "albums", foreignKey: "id_artist"});
  SongsArtists.belongsTo(Artists, { as: "id_artist_artist", foreignKey: "id_artist"});
  Artists.hasMany(SongsArtists, { as: "songs_artists", foreignKey: "id_artist"});
  Reports.belongsTo(Comments, { as: "id_comment_comment", foreignKey: "id_comment"});
  Comments.hasMany(Reports, { as: "reports", foreignKey: "id_comment"});
  Subgenres.belongsTo(Genres, { as: "id_genre_genre", foreignKey: "id_genre"});
  Genres.hasMany(Subgenres, { as: "subgenres", foreignKey: "id_genre"});
  PlaylistsSongs.belongsTo(Playlists, { as: "id_playlist_playlist", foreignKey: "id_playlist"});
  Playlists.hasMany(PlaylistsSongs, { as: "playlists_songs", foreignKey: "id_playlist"});
  Reports.belongsTo(ReportTypes, { as: "id_report_type_report_type", foreignKey: "id_report_type"});
  ReportTypes.hasMany(Reports, { as: "reports", foreignKey: "id_report_type"});
  Users.belongsTo(Roles, { as: "id_role_role", foreignKey: "id_role"});
  Roles.hasMany(Users, { as: "users", foreignKey: "id_role"});
  Comments.belongsTo(Songs, { as: "id_song_song", foreignKey: "id_song"});
  Songs.hasMany(Comments, { as: "comments", foreignKey: "id_song"});
  PlaylistsSongs.belongsTo(Songs, { as: "id_song_song", foreignKey: "id_song"});
  Songs.hasMany(PlaylistsSongs, { as: "playlists_songs", foreignKey: "id_song"});
  SongsAlbums.belongsTo(Songs, { as: "id_song_song", foreignKey: "id_song"});
  Songs.hasMany(SongsAlbums, { as: "songs_albums", foreignKey: "id_song"});
  SongsArtists.belongsTo(Songs, { as: "id_song_song", foreignKey: "id_song"});
  Songs.hasMany(SongsArtists, { as: "songs_artists", foreignKey: "id_song"});
  SongsSubgenres.belongsTo(Songs, { as: "id_song_song", foreignKey: "id_song"});
  Songs.hasMany(SongsSubgenres, { as: "songs_subgenres", foreignKey: "id_song"});
  SongsSubgenres.belongsTo(Subgenres, { as: "id_subgenre_subgenre", foreignKey: "id_subgenre"});
  Subgenres.hasMany(SongsSubgenres, { as: "songs_subgenres", foreignKey: "id_subgenre"});
  Artists.belongsTo(Users, { as: "id_user_user", foreignKey: "id_user"});
  Users.hasMany(Artists, { as: "artists", foreignKey: "id_user"});
  Comments.belongsTo(Users, { as: "id_user_user", foreignKey: "id_user"});
  Users.hasMany(Comments, { as: "comments", foreignKey: "id_user"});
  Playlists.belongsTo(Users, { as: "id_user_user", foreignKey: "id_user"});
  Users.hasMany(Playlists, { as: "playlists", foreignKey: "id_user"});
  Reports.belongsTo(Users, { as: "id_user_user", foreignKey: "id_user"});
  Users.hasMany(Reports, { as: "reports", foreignKey: "id_user"});

  return {
    Albums,
    Artists,
    Comments,
    Genres,
    Playlists,
    PlaylistsSongs,
    ReportTypes,
    Reports,
    Roles,
    Songs,
    SongsAlbums,
    SongsArtists,
    SongsSubgenres,
    Subgenres,
    Users,
  };
}
export default initModels;
// const _initModels = initModels;
// export { _initModels as initModels };
// const _default = initModels;
// export { _default as default };
