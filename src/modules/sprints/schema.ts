import { z } from 'zod';
import type { Sprint } from '../../database';

// validation schema
type Record = Sprint;
const schema = z.object({
  id: z.coerce.number().positive(),
  sprintCode: z.string().min(1),
  title: z.string().min(1).max(500),

});

const insertable = schema.omit({id: true});
const partial = insertable.partial();

export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parsePartial = (record: unknown) => partial.parse(record);

// matches database and validation schema keys
export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
