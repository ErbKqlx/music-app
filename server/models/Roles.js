
export default function(sequelize, DataTypes) {
  return sequelize.define('Roles', {
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
    tableName: 'roles',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "pk_roles_id",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
