
export default function(sequelize, DataTypes) {
  return sequelize.define('Comments', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_user: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    id_song: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'songs',
        key: 'id'
      }
    }
  }, {
    tableName: 'comments',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "pk_comments_id",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
