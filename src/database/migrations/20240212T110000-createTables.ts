import { Kysely, SqliteDatabase, sql } from "kysely";

export async function up(db: Kysely<SqliteDatabase>): Promise<void> {
  await db.schema
      .createTable('messages')
      .addColumn('id', "integer", (col) => col.primaryKey().autoIncrement())
      .addColumn('username', 'text', (col) => col.notNull())
      .addColumn('sprint_code', 'text', (col) => col.notNull())
      .addColumn('gif_url', 'text', (col) => col.notNull())
      .addColumn('message', 'text', (col) => col.notNull())
      .addColumn('created_at', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
      .execute();

  await db.schema
      .createTable('sprint')
      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
      .addColumn('sprint_code', 'text', (col) => col.notNull().unique())
      .addColumn('title', "text", (col) => col.notNull())
      .execute()

  await db.schema
      .createTable('template')
      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
      .addColumn('message', 'text', (col) => col.notNull())
      .execute()
}



export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('messages').execute();
  await db.schema.dropTable('sprint').execute();
  await db.schema.dropTable('template').execute()
}