import type {Selectable, Updateable, DeleteResult, Insertable} from 'kysely';
import { keys } from './schema';
import db, { type Sprint } from '../../database';


const TABLE = 'sprint';
type Row = Sprint;
type RowWithoutId = Omit<Row, 'id'>;

type RowInsert = Insertable<RowWithoutId>;
type RowUpdate = Updateable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export function getAllSprints(): Promise<RowSelect[]> {
  return db.selectFrom(TABLE).select(keys).execute();
}

export async function getTitle(sprintCode: string): Promise<string> {

  const result = await db.selectFrom(TABLE)
      .select(`title`)
      .where('sprintCode', '=', sprintCode)
      .executeTakeFirst();

  // Check if result is not null and has the 'title' property
  return result && result.title ? result.title : sprintCode;
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