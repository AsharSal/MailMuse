const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database');
const emailRoutes = require('./routes/emailRoutes');
const templateRoutes = require('./routes/templateRoutes');


dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/api/email', emailRoutes);
app.use('/api/templates', templateRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
});
