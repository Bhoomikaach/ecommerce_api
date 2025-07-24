const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    createdAt : {type: DataTypes.DATE, field: 'created_at'},
    updatedAt : {type: DataTypes.DATE, field: 'created_at'}
  },{
    tableName: 'categories',
    timestamps: true,
  });


  return Category;
};