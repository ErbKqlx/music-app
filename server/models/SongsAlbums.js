
export default function(sequelize, DataTypes) {
  return sequelize.define('SongsAlbums', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_song: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'songs',
        key: 'id'
      }
    },
    id_album: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'albums',
        key: 'id'
      }
    }
  }, {
    tableName: 'songs_albums',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "pk_songs_albums_id",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
