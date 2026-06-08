
export default function(sequelize, DataTypes) {
  return sequelize.define('Genres', {
    id: {
      autoIncrement: true,
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'genres',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_genres_id",
        unique: false,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
