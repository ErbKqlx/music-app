
export default function(sequelize, DataTypes) {
  return sequelize.define('Users', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "uq_users_email"
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_role: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    registration_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'users',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "pk_users_id",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "uq_users_email",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
};
