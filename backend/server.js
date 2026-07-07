const app = require('./app');
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/db.config');

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});