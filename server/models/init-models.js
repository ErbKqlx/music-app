import { DataTypes } from "sequelize";
import _Albums from "./Albums.js";
import _Artists from "./Artists.js";
import _Comments from "./Comments.js";
import _Genres from "./Genres.js";
import _Playlists from "./Playlists.js";
import _PlaylistsSongs from "./PlaylistsSongs.js";
import _ReportTypes from "./ReportTypes.js";
import _Reports from "./Reports.js";
import _Roles from "./Roles.js";
import _Songs from "./Songs.js";
import _SongsAlbums from "./SongsAlbums.js";
import _SongsArtists from "./SongsArtists.js";
import _SongsSubgenres from "./SongsSubgenres.js";
import _Subgenres from "./Subgenres.js";
import _Users from "./Users.js";

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

  SongsAlbums.belongsTo(Albums, { as: "album", foreignKey: "id_album"});
  Albums.hasMany(SongsAlbums, { as: "songsAlbums", foreignKey: "id_album"});
  Albums.belongsTo(Artists, { as: "artist", foreignKey: "id_artist"});
  Artists.hasMany(Albums, { as: "albums", foreignKey: "id_artist"});
  SongsArtists.belongsTo(Artists, { as: "artist", foreignKey: "id_artist"});
  Artists.hasMany(SongsArtists, { as: "songsArtists", foreignKey: "id_artist"});
  Reports.belongsTo(Comments, { as: "comment", foreignKey: "id_comment"});
  Comments.hasMany(Reports, { as: "reports", foreignKey: "id_comment"});
  Subgenres.belongsTo(Genres, { as: "genre", foreignKey: "id_genre"});
  Genres.hasMany(Subgenres, { as: "subgenres", foreignKey: "id_genre"});
  PlaylistsSongs.belongsTo(Playlists, { as: "playlist", foreignKey: "id_playlist"});
  Playlists.hasMany(PlaylistsSongs, { as: "playlistsSongs", foreignKey: "id_playlist"});
  Reports.belongsTo(ReportTypes, { as: "reportType", foreignKey: "id_report_type"});
  ReportTypes.hasMany(Reports, { as: "reports", foreignKey: "id_report_type"});
  Users.belongsTo(Roles, { as: "role", foreignKey: "id_role"});
  Roles.hasMany(Users, { as: "users", foreignKey: "id_role"});
  Comments.belongsTo(Songs, { as: "song", foreignKey: "id_song"});
  Songs.hasMany(Comments, { as: "comments", foreignKey: "id_song"});
  PlaylistsSongs.belongsTo(Songs, { as: "song", foreignKey: "id_song"});
  Songs.hasMany(PlaylistsSongs, { as: "playlistsSongs", foreignKey: "id_song"});
  SongsAlbums.belongsTo(Songs, { as: "song", foreignKey: "id_song"});
  Songs.hasMany(SongsAlbums, { as: "songsAlbums", foreignKey: "id_song"});
  SongsArtists.belongsTo(Songs, { as: "song", foreignKey: "id_song"});
  Songs.hasMany(SongsArtists, { as: "songsArtists", foreignKey: "id_song"});
  SongsSubgenres.belongsTo(Songs, { as: "song", foreignKey: "id_song"});
  Songs.hasMany(SongsSubgenres, { as: "songsSubgenres", foreignKey: "id_song"});
  SongsSubgenres.belongsTo(Subgenres, { as: "subgenre", foreignKey: "id_subgenre"});
  Subgenres.hasMany(SongsSubgenres, { as: "songsSubgenres", foreignKey: "id_subgenre"});
  Artists.belongsTo(Users, { as: "user", foreignKey: "id_user"});
  Users.hasMany(Artists, { as: "artists", foreignKey: "id_user"});
  Comments.belongsTo(Users, { as: "user", foreignKey: "id_user"});
  Users.hasMany(Comments, { as: "comments", foreignKey: "id_user"});
  Playlists.belongsTo(Users, { as: "user", foreignKey: "id_user"});
  Users.hasMany(Playlists, { as: "playlists", foreignKey: "id_user"});
  Reports.belongsTo(Users, { as: "user", foreignKey: "id_user"});
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
