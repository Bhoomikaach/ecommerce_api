const { DataTypes } = require('sequelize');
const { sequelize } = require('.');

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: { type: DataTypes.STRING },
        price: { type: DataTypes.FLOAT, allowNull: false },
        stock: { type: DataTypes.INTEGER, allowNull: false },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        category_id: { type: DataTypes.INTEGER, allowNull: false },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at'
        }
    }, {
        tableName: 'products',
        timestamps: true
    });

    Product.associate = (models) => {
        Product.belongsTo(models.Category, { foreignKey: 'category_id' });
        Product.hasMany(models.CartItem, { foreignKey: 'product_id' });
        Product.hasMany(models.OrderItem, { foreignKey: 'product_id' });
    };

    return Product;
}