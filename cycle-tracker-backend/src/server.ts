import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from  './config/db'
import cycleRoutes from './routes/cycleRoutes';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cycle-data', cycleRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});