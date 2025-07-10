require('dotenv').config();
const { Role, sequelize } = require('./models');

(async () => {
  try {
    const basicRoles = ['admin', 'doctor', 'legal', 'paciente', 'admin_ong'];
    for (const name of basicRoles) {
      const [role, created] = await Role.findOrCreate({ where: { name } });
      if (created) {
        console.log(`Rol '${name}' creado`);
      }
    }
    console.log('Seed de roles completo');
  } catch (err) {
    console.error('Error al crear roles:', err);
  } finally {
    await sequelize.close();
  }
})();
