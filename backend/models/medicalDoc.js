module.exports = (sequelize, DataTypes) => {
  const MedicalDoc = sequelize.define('MedicalDoc', {
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

  MedicalDoc.associate = models => {
    MedicalDoc.belongsTo(models.User, { as: 'Doctor', foreignKey: 'doctorId' });
    MedicalDoc.belongsTo(models.User, { as: 'Patient', foreignKey: 'patientId' });
    MedicalDoc.belongsTo(models.ONG, { foreignKey: 'ongId' });
  };

  return MedicalDoc;
};
