module.exports = (sequelize, DataTypes) => {
  const ONG = sequelize.define('ONG', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  });

  ONG.associate = models => {
    ONG.hasMany(models.Withdrawal, { foreignKey: 'ongId' });
  };

  return ONG;
};
