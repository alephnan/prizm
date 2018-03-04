import * as Datastore from '@google-cloud/datastore';

const {projectId} = require('../../gcp_credentials.json');

/** @description Service to interact with Datastore. */
export class DatastoreService {
  constructor(private readonly datastore: Datastore) {}

  list(path: (string|number)[]) {
    const [kind, ...ancestorsReversed] = path.slice().reverse();
    let query = this.datastore.createQuery(kind);
    // Add ancestor query.
    if(ancestorsReversed.length) {
      const ancestors = ancestorsReversed.reverse();
      const ancestorKey = this.datastore.key(ancestors);
      query = query.hasAncestor(ancestorKey);
    }
    return this.datastore.runQuery(query)
      .then(response => {
        const entities = response[0]
        return entities.map(entity => {
          const entityKey = entity[this.datastore.KEY];
          return {
            ...entity,
            id: entityKey.id
          };
        })
      });
  }
}

export const datastoreService = new DatastoreService(
  new Datastore({projectId})
)