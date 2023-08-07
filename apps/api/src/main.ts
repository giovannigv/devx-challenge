import express from 'express';
import AuthController from './controller/auth.controller';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.get('/auth', AuthController.getUserSession);
app.put('/auth', AuthController.createPassword);
app.post('auth/otp', AuthController.validateOTP);

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
