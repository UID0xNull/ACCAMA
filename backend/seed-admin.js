require('dotenv').config();
const bcrypt = require('bcrypt');
const { User, Role, sequelize } = require('./models');

(async () => {
  try {
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    const adminOngRole = await Role.findOne({ where: { name: 'admin_ong' } });
    if (!adminRole || !adminOngRole) {
      console.error("Roles requeridos no encontrados. Ejecuta primero seed-roles.");
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

    const hashedAdminOngPassword = await bcrypt.hash('adminong123', 10);
    const [adminOng, adminOngCreated] = await User.findOrCreate({
      where: { email: 'admin_ong@example.com' },
      defaults: {
        name: 'Admin ONG',
        password: hashedAdminOngPassword,
        roleId: adminOngRole.id,
        ongId: 1,
      },
    });

    if (adminOngCreated) {
      console.log(
        "Usuario admin_ong creado: admin_ong@example.com / adminong123"
      );
    } else {
      console.log('El usuario admin_ong ya existe');
    }
  } catch (err) {
    console.error('Error al crear usuario administrador:', err);
  } finally {
    await sequelize.close();
  }
})();
