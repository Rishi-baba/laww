import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoute.js';
import dossierRoutes from './routes/dossierRoute.js';

const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dossiers", dossierRoutes);
app.get('/', (req, res) => {
  res.send('Hello, World');
});

export default app;