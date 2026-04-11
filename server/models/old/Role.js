import { DataTypes } from "sequelize";

export default (sequelize, DataTypes) => {
    const Role = sequelize.define(
        'Role',
        {
            id: {
                type: DataTypes.SMALLINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING
            }
        },
        {
            timestamps: false,
            tableName: 'roles',
        }
    )
}