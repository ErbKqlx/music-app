
export default function(sequelize, DataTypes) {
  return sequelize.define('SongsGenres', {
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
    id_genre: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'genres',
        key: 'id'
      }
    }
  }, {
    tableName: 'songs_genres',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_songs_genres_id",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
