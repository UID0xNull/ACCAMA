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
    ongId: {
      type: DataTypes.INTEGER,
    },
  }, { timestamps: false });

  DoctorPatient.associate = models => {
    DoctorPatient.belongsTo(models.User, { as: 'Doctor', foreignKey: 'doctorId' });
    DoctorPatient.belongsTo(models.User, { as: 'Patient', foreignKey: 'patientId' });
    DoctorPatient.belongsTo(models.ONG, { foreignKey: 'ongId' });
  };

  return DoctorPatient;
};
