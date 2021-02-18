module.exports = (sequelize, DataTypes) => {
    sequelize.define('auction', {
        bid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        msg: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    }, {
        timestamps: true,
        paranoid: true,
    })
};
