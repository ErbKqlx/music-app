
export default function(sequelize, DataTypes) {
  return sequelize.define('Artists', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_user: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'artists',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_artists_id",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
