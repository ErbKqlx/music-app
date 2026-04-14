
export default function(sequelize, DataTypes) {
  return sequelize.define('Playlists', {
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
    public: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(255),
    }
  }, {
    tableName: 'playlists',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "pk_playlists_id",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
