import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors'; // CORS import
import connectDB from './config/db';
import eventRoutes from './routes/eventRoutes';
dotenv.config();

// App Initialization
const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// CORS Setup

app.use(cors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Cookies and headers allow 
}));

// Test Route
app.get('/', (req, res) => {
    res.send(`Event Manager API Running on Port ${port}`);
});

app.use('/api/events' , eventRoutes)
// Server Start
const startApp = async () => {
    // Database connection
    await connectDB(); 
    
    // Start listening
    app.listen(port, () => {
        console.log(`Server is running in ${process.env.PORT} mode at http://localhost:${port}`);
    });
};

startApp();
