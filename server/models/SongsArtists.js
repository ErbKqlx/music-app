
export default function(sequelize, DataTypes) {
  return sequelize.define('SongsArtists', {
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
    id_artist: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'artists',
        key: 'id'
      }
    }
  }, {
    tableName: 'songs_artists',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_songs_artists_id",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
