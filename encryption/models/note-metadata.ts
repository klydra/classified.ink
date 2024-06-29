export default class NoteMetadata {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(
    title: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  ) {
    this.title = title;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static fromObject(object: {
    title: string;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
  }): NoteMetadata {
    return new NoteMetadata(
      object.title,
      new Date(object.createdAt * 1000),
      new Date(object.updatedAt * 1000),
      new Date(object.deletedAt * 1000),
    );
  }

  toObject(): {
    title: string;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
  } {
    return {
      title: this.title,
      createdAt: this.createdAt.getTime() / 1000,
      updatedAt: this.updatedAt.getTime() / 1000,
      deletedAt: this.deletedAt.getTime() / 1000,
    };
  }
}
