
export default function(sequelize, DataTypes) {
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
      allowNull: true,
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
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_report_status: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'report_statuses',
        key: 'id'
      }
    }
  }, {
    tableName: 'reports',
    schema: 'public',
    timestamps: false,
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
