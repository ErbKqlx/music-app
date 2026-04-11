const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Albums', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    release_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    tableName: 'albums',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_albums_id",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
