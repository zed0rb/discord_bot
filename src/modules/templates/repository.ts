import type { Insertable, Selectable, Updateable, DeleteResult } from 'kysely';
import { keys } from './schema';
import db, { type Template } from '../../database';



const TABLE = 'template';
type Row = Template;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowUpdate = Updateable<RowWithoutId>;
type RowSelect = Selectable<Row>;



export function getAll(): Promise<RowSelect[]> {
  return db.selectFrom(TABLE).select(keys).execute();
}

export async function getRandomMessage(): Promise<string> {
  const allRows = await getAll()

  // Select a random row from the fetched rows
  const randomRowIndex = Math.floor(Math.random() * allRows.length);
  return allRows[randomRowIndex].message;
}

export function getById(id: number): Promise<RowSelect | undefined> {
  return db
    .selectFrom(TABLE)
    .select(keys)
    .where('id', '=', id)
    .executeTakeFirst();
}


export function create(record: RowInsert): Promise<RowSelect | undefined> {
  return db.insertInto(TABLE).values(record).returning(keys).executeTakeFirst();
}

export function update(
  id: number,
  partial: RowUpdate
): Promise<RowSelect | undefined> {
  if (Object.keys(partial).length === 0) {
    return getById(id);
  }

  return db
    .updateTable(TABLE)
    .set(partial)
    .where('id', '=', id)
    .returning(keys)
    .executeTakeFirst();
}

export function deleteRow(id: number): Promise<DeleteResult> {
  return db
    .deleteFrom(TABLE)
    .where('id', '=', id)
    .executeTakeFirst();
}