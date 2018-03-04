import * as express from 'express';
import {
  datastoreService,
  DatastoreService,
} from './datastore/service';
import {
  resourceHash,
  ResourceHash,
} from './datastore/resource_hash';

class App {
  public readonly router

  constructor(
      private readonly datastoreService: DatastoreService,
      readonly expressInstance,
      private readonly resourceHash: ResourceHash,
  ) {
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

    this.router.get('/project', (req, res) => {
      this.datastoreService
        .list(['Project'])
        .then(entities => {
          const encodedEntities = entities.map(entity => {
            return {
              ...entity,
              // TODO: There should be interceptor between the datastore service to do this
              // encoding
              id: this.resourceHash.encodeProjectId(entity.id),
            }
          });
          res.json({ projects: encodedEntities })
        })
        .catch(error => {
          res.json({ error })
        })
    })
    this.router.get('/project/:projectId/source', (req, res) => {
      const projectId = parseInt(this.resourceHash.decodeProjectId(req.params.projectId));
      this.datastoreService
        .list(['Project', projectId, 'SourceFile'])
        .then(data => {
          res.json({ sources: data })
        })
        .catch(error => {
          res.json({ error })
        })
    })
  }
}

const app = new App(
  datastoreService,
  express(),
  resourceHash,
);

export const instance = app.expressInstance;
