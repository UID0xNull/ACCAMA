const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const models = {
  Role: require('./role')(sequelize, DataTypes),
  User: require('./user')(sequelize, DataTypes),
  ONG: require('./ong')(sequelize, DataTypes),
  Withdrawal: require('./withdrawal')(sequelize, DataTypes),
  Stock: require('./stock')(sequelize, DataTypes),
  Document: require('./document')(sequelize, DataTypes),
  DoctorPatient: require('./doctorPatient')(sequelize, DataTypes),
  MedicalDoc: require('./medicalDoc')(sequelize, DataTypes),
  LegalRecord: require('./legalRecord')(sequelize, DataTypes),
};

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

module.exports = { sequelize, ...models };
