import express from 'express';
import AuthController from './controller/auth.controller';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.get('/auth', AuthController.getUserSession);
app.post('/auth/otp', AuthController.validateOTP);
app.post('/login', AuthController.login);
app.put('/login/create', AuthController.createPassword);

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
