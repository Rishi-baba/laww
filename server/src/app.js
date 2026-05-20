import express from 'express';
import cors from 'cors';
import cookiesParser from 'cookie-parser';

const app = express();


app.use(cors());
app.use(cookiesParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World');
});

export default app;