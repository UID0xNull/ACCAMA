require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const ongRoutes = require('./routes/ong');
const withdrawalRoutes = require('./routes/withdrawal');
const patientRoutes = require('./routes/patient');
const legalRecordRoutes = require('./routes/legalRecord');
const userRoutes = require('./routes/user');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('backend/uploads'));

app.use('/auth', authRoutes);
app.use('/ongs', ongRoutes);
app.use('/withdrawals', withdrawalRoutes);
app.use('/patients', patientRoutes);
app.use('/legal-records', legalRecordRoutes);
app.use('/users', userRoutes);
app.use('/stats', statsRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

sequelize
  .authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
