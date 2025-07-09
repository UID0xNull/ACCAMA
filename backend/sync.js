const { sequelize } = require('./models');

(async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
  } catch (err) {
    console.error('Error syncing database:', err);
  } finally {
    await sequelize.close();
  }
})();
