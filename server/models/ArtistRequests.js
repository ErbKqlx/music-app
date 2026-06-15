
export default function(sequelize, DataTypes) {
  return sequelize.define('ArtistRequests', {
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
    id_request_status: { 
        type: DataTypes.SMALLINT,
        allowNull: false,
        references: {
            model: 'request_statuses',
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'artist_requests',
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
