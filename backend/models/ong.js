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
    phone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    statute: {
      type: DataTypes.STRING,
    },
    documents: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'),
      defaultValue: 'pendiente',
    },
  });

  ONG.associate = models => {
    ONG.hasMany(models.Withdrawal, { foreignKey: 'ongId' });
    ONG.hasMany(models.User, { foreignKey: 'ongId' });
    ONG.hasMany(models.Document, { foreignKey: 'ongId' });
    ONG.hasMany(models.MedicalDoc, { foreignKey: 'ongId' });
    ONG.hasMany(models.LegalRecord, { foreignKey: 'ongId' });
    ONG.hasMany(models.DoctorPatient, { foreignKey: 'ongId' });
  };

  return ONG;
};
