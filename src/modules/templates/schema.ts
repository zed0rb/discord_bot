import { z } from 'zod';
import type { Template } from '../../database';

type Record = Template;
const schema = z.object({

  id: z.coerce.number().int().positive(),
  message: z.string().min(1).max(500),

});

// parsers for validating and coercing data
const insertable = schema.omit({
  id: true,
});
const partial = insertable.partial();

export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parsePartial = (record: unknown) => partial.parse(record);

// matches database and validation schema keys
export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
