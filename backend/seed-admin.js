require('dotenv').config();
const bcrypt = require('bcrypt');
const { User, Role, sequelize } = require('./models');

(async () => {
  try {
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      console.error("Rol 'admin' no encontrado. Ejecuta primero seed-roles.");
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const [user, created] = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        name: 'Admin',
        password: hashedPassword,
        roleId: adminRole.id,
      },
    });

    if (created) {
      console.log("Usuario administrador creado: admin@example.com / admin123");
    } else {
      console.log('El usuario administrador ya existe');
    }
  } catch (err) {
    console.error('Error al crear usuario administrador:', err);
  } finally {
    await sequelize.close();
  }
})();
