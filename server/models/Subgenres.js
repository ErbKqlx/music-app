const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Subgenres', {
    id: {
      autoIncrement: true,
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    tableName: 'subgenres',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "pk_subgenres_id",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
