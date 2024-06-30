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

  static fromString(base64: string): NoteContent {
    return NoteContent.fromObject(JSON.parse(atob(base64)));
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

  toString(): string {
    return btoa(JSON.stringify(this.toObject()));
  }
}
