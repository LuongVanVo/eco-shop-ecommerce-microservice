import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env'});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
console.log(PORT + " and " + process.env.PORT);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from EcoShop of Luong Van Vo Shop bán các sản phẩm thân thiện với môi trường !!!');
});

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});