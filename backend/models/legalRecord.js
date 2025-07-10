module.exports = (sequelize, DataTypes) => {
  const LegalRecord = sequelize.define('LegalRecord', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ongId: {
      type: DataTypes.INTEGER,
    },
  });

  LegalRecord.associate = models => {
    LegalRecord.belongsTo(models.User, { as: 'Patient', foreignKey: 'patientId' });
    LegalRecord.belongsTo(models.ONG, { foreignKey: 'ongId' });
  };

  return LegalRecord;
};
