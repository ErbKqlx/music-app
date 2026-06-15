
export default function(sequelize, DataTypes) {
  return sequelize.define('ReportStatuses', {
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
    tableName: 'report_statuses',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_report_statuses_id",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
