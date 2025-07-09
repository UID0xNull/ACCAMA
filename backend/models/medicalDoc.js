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
  });

  MedicalDoc.associate = models => {
    MedicalDoc.belongsTo(models.User, { as: 'Doctor', foreignKey: 'doctorId' });
    MedicalDoc.belongsTo(models.User, { as: 'Patient', foreignKey: 'patientId' });
  };

  return MedicalDoc;
};
