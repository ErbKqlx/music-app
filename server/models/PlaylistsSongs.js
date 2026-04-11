const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PlaylistsSongs', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_playlist: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'playlists',
        key: 'id'
      }
    },
    id_song: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'songs',
        key: 'id'
      }
    }
  }, {
    tableName: 'playlists_songs',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "pk_playlists_users_id",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
