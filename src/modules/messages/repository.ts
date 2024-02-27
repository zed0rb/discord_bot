import type {Insertable, Selectable} from 'kysely';
import { keys } from "./schema";
import db, { type Messages } from '../../database';


const TABLE = 'messages';
type Row = Messages;


type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export function getAllMessages(): Promise<RowSelect[]> {
  return db.selectFrom(TABLE).select(keys).execute();
}

export function create(record: RowInsert): Promise<RowSelect | undefined> {
  return db.insertInto(TABLE).values(record).returning(keys).executeTakeFirst();
}

export function findByUsername(user: string): Promise<any> {
  return db
    .selectFrom(TABLE)
    .select(keys)
    .where('username', '=', user)
    .execute();
}

export function findBySprint(sprint: string): Promise<any> {
  return db
    .selectFrom(TABLE)
    .select(keys)
    .where('sprintCode', '=', sprint)
    .execute();
}

export function findByUserAndSprint(username: string, sprint: string): Promise<any> {
  return db
      .selectFrom(TABLE)
      .select(keys)
      .where((eb) =>eb.and({
        sprintCode: sprint,
        username}))
      .execute()
}