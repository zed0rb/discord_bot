import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Messages {
  createdAt: Generated<string>;
  gifUrl: string;
  id: Generated<number | null>;
  message: string;
  sprintCode: string;
  username: string;
}

export interface Sprint {
  id: Generated<number | null>;
  sprintCode: string;
  title: string;
}

export interface Template {
  id: Generated<number | null>;
  message: string;
}

export interface DB {
  messages: Messages;
  sprint: Sprint;
  template: Template;
}
