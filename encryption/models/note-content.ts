import NoteMetadata from "./note-metadata.ts";

export default class NoteContent {
  metadata: NoteMetadata;
  content: string;

  constructor(metadata: NoteMetadata, content: string) {
    this.metadata = metadata;
    this.content = content;
  }

  static fromObject(object: {
    metadata: {
      title: string;
      createdAt: number;
      updatedAt: number;
      deletedAt: number;
    };
    content: string;
  }): NoteContent {
    return new NoteContent(
      NoteMetadata.fromObject(object.metadata),
      object.content,
    );
  }

  static fromJSON(json: string): NoteContent {
    return NoteContent.fromObject(JSON.parse(json));
  }

  toObject(): {
    metadata: {
      title: string;
      createdAt: number;
      updatedAt: number;
      deletedAt: number;
    };
    content: string;
  } {
    return {
      metadata: this.metadata.toObject(),
      content: this.content,
    };
  }

  toJSON(): string {
    return JSON.stringify(this.toObject());
  }
}
