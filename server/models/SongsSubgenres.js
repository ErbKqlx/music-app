
export default function(sequelize, DataTypes) {
  return sequelize.define('SongsSubgenres', {
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
    id_subgenre: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'subgenres',
        key: 'id'
      }
    }
  }, {
    tableName: 'songs_subgenres',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "pk_songs_subgenres_id",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
