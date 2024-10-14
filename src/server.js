import express, { json } from 'express';
import router from './routes/route.js';

const app = express();
app.use(json());

app.use(router);

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});
