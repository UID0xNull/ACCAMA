module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ongId: {
      type: DataTypes.INTEGER,
    },
  });

  Document.associate = models => {
    Document.belongsTo(models.User, { foreignKey: 'userId' });
    Document.belongsTo(models.ONG, { foreignKey: 'ongId' });
  };

  return Document;
};
