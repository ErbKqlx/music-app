
export default function(sequelize, DataTypes) {
  return sequelize.define('ReportTypes', {
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
    tableName: 'report_types',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "pk_report_types_id",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
