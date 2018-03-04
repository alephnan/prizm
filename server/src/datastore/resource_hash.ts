import * as Hashids from 'hashids';

type Kind = 'Project' | 'SourceFile';

/**
 * @description Two-way hash to scramble database resource IDs from public API.
 */
export class ResourceHash {
  private readonly hashers: Map<Kind, Hashids>;

  constructor(Hashids) {
    this.hashers = new Map();
    this.hashers.set('Project', new Hashids('Project'))
    this.hashers.set('SourceFile', new Hashids('SourceFile'))
  }

  encodeProjectId(projectId) {
    return this.hashers.get('Project').encode(projectId);
  }

  decodeProjectId(projectId) {
    return this.hashers.get('Project').decode(projectId);
  }

  encodeSourceFileId(sourceFileId) {
    return this.hashers.get('SourceFile').encode(sourceFileId);
  }

  decodeSourceFileId(sourceFileId) {
    return this.hashers.get('SourceFile').decode(sourceFileId);
  }
}

export const resourceHash = new ResourceHash(Hashids)