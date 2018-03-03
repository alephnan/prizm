import * as express from 'express';

class App {
  public readonly expressInstance
  public readonly router

  constructor(express) {
    this.expressInstance = express()
    this.router = express.Router()
    this.mountRoutes()
    this.expressInstance.use('/', this.router)
  }

  private mountRoutes (): void {
    this.router.get('/', (req, res) => {
      res.json({
        message: 'Hello World5'
      })
    })
  }
}

export const instance = (new App(express)).expressInstance;
