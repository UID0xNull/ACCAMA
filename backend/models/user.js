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
    authorizedUse: {
      type: DataTypes.STRING,
    },
    legalStatus: {
      type: DataTypes.STRING,
    },
    ongId: {
      type: DataTypes.INTEGER,
    },
  });

  User.associate = models => {
    User.belongsTo(models.Role, { foreignKey: 'roleId' });
    User.belongsTo(models.ONG, { foreignKey: 'ongId' });
    User.hasMany(models.Document, { foreignKey: 'userId' });
    User.hasMany(models.Withdrawal, { foreignKey: 'userId' });
    User.belongsToMany(models.User, {
      as: 'Patients',
      through: models.DoctorPatient,
      foreignKey: 'doctorId',
      otherKey: 'patientId',
    });
    User.belongsToMany(models.User, {
      as: 'Doctors',
      through: models.DoctorPatient,
      foreignKey: 'patientId',
      otherKey: 'doctorId',
    });
    User.hasMany(models.MedicalDoc, { as: 'DoctorDocs', foreignKey: 'doctorId' });
    User.hasMany(models.MedicalDoc, { as: 'PatientDocs', foreignKey: 'patientId' });
  };

  return User;
};
