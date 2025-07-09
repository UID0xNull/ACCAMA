module.exports = (sequelize, DataTypes) => {
  const DoctorPatient = sequelize.define('DoctorPatient', {
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, { timestamps: false });

  DoctorPatient.associate = models => {
    DoctorPatient.belongsTo(models.User, { as: 'Doctor', foreignKey: 'doctorId' });
    DoctorPatient.belongsTo(models.User, { as: 'Patient', foreignKey: 'patientId' });
  };

  return DoctorPatient;
};
