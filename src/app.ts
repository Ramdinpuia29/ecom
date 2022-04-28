import * as express from "express";

import Controller from "./common/interfaces/controller.interface";
import errorMiddleware from "./common/middlewares/error.middleware";
import { AppDataSource } from "./data-source";

export default class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectDb();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandler();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`Server listening on port ${process.env.PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private initializeErrorHandler() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private connectDb() {
    AppDataSource.initialize()
      .then(() => {
        console.log("Data Source has been initialized!");
      })
      .catch((err: any) => {
        console.error("Error during Data Source initialization: ", err);
      });
  }
}
