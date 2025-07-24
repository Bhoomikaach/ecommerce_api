module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        total_price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at'
        }
    },{
        tableName: 'orders',
        timestamps: true
    });

    Order.associate = (models) => {
        Order.belongsTo(models.User, { foreignKey: 'user_id' });
        Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
    };

    return Order;
};
