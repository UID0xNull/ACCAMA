module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.associate = models => {
    User.belongsTo(models.Role, { foreignKey: 'roleId' });
    User.hasMany(models.Document, { foreignKey: 'userId' });
    User.hasMany(models.Withdrawal, { foreignKey: 'userId' });
  };

  return User;
};
