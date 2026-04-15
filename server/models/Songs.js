
export default function(sequelize, DataTypes) {
  return sequelize.define('Songs', {
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
    length: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    release_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    explicit_content: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    lyrics: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'songs',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_songs_id",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
