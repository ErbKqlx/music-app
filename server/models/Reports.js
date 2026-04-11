const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Reports', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_report_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'report_types',
        key: 'id'
      }
    },
    id_comment: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'comments',
        key: 'id'
      }
    },
    id_user: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'reports',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "pk_reports_id",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
