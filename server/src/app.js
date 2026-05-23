import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoute.js';
import dossierRoutes from './routes/dossierRoute.js';

const app = express();


app.use(
  cors({
    origin: [
      "https://laww-flame.vercel.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dossiers", dossierRoutes);
app.get('/', (req, res) => {
  res.send('Hello, World');
});

export default app;