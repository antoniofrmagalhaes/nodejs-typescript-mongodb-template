import mongoose from 'mongoose';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import routes from './routes';
import AppError from '../errors/AppError';

class App {
  public server: express.Application;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.globalErrorHandler();
    this.mongoDB();
  }

  private middlewares(): void {
    this.server.use(express.json());
  }

  private routes(): void {
    this.server.use(routes);
  }

  private globalErrorHandler(): void {
    this.server.use(
      (e: Error, request: Request, response: Response, _: NextFunction) => {
        if (e instanceof AppError) {
          return response.status(e.statusCode).json({
            status: 'error',
            message: e.message,
          });
        }
        return response.status(500).json({
          status: 'error',
          message: e.message,
        });
      },
    );
  }

  private mongoDB(): void {
    mongoose.connect(`mongodb://localhost:27017/`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  }
}

export default new App().server;
