import express, { Application, Request, Response } from 'express';
import AppConfig from './config/app.config';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import './config/app.server';
import helmet from 'helmet';

//Router Modules
import routerModule from './routes';
import userRoute from './routes/user.routes';
import productRoute from './routes/product.routes';
import orderRoute from './routes/order.routes';
import logger from './middlewares/logger.middleware';
import Loggr from './middlewares/loggr.middleware';

// Load environmental variables only when on development environment
if (process.env.NODE_ENV !== 'production')
    configDotenv();

// Initializing server application
const app: Application = express();
const logr = new Loggr();

// Application
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: '["3.134.238.10","3.129.111.220","52.15.118.168", "127.0.0.1:5120"]' }));
app.use(helmet());
app.use(`${AppConfig.server.url}`, logr.log, routerModule) // API base route

// Routes
app.use(`${AppConfig.server.url}/user`, userRoute);
app.use(`${AppConfig.server.url}/product`, productRoute);
app.use(`${AppConfig.server.url}/orders`, orderRoute);

app.get('/', (req: Request, res: Response) => {
    res.redirect(`${AppConfig.server.url}`);
});

// Starting server
app.listen(AppConfig.server.port, () => logger.log('info',`API service running on ${AppConfig.server.port}`));