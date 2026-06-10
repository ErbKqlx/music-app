// Модель SongHistories (История прослушиваний)
export default function(sequelize, DataTypes) {
  return sequelize.define('SongsHistories', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_song: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: 'songs', key: 'id' }
    },
    id_user: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: { model: 'users', key: 'id' }
    },
    listened_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'songs_histories',
    timestamps: false
  });
};