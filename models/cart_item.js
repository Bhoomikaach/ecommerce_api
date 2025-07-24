const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CartItem = sequelize.define('CartItem', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    image_url: { type: DataTypes.STRING},
    createdAt : {type: DataTypes.DATE, field: 'created_at'},
    updatedAt : {type: DataTypes.DATE, field: 'created_at'}
  },{
    tableName: 'cart_items',
    timestamps: true,
  });

  CartItem.associate = (models) => {
        CartItem.belongsTo(models.User, {foreignKey: 'user_id'});
        CartItem.belongsTo(models.Product, { foreignKey: 'product_id' });
    };


  return CartItem;
};