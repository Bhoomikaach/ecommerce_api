const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'customer'),
      defaultValue: 'customer'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at' 
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at' 
    }
    
  }, {
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  });

  User.prototype.validPassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  User.associate = (models) => {
    User.hasMany(models.CartItem, { foreignKey: 'user_id' });
    User.hasMany(models.Order, { foreignKey: 'user_id' });
  };

  return User;
};
