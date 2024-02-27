import { z } from 'zod';
import type { Messages } from '../../database';

// validation schema
type Record = Messages;
const schema = z.object({

    id: z.coerce.number().int().positive(),
    username: z.string().min(1),
    sprintCode: z.string().min(1),
    gifUrl: z.string(),
    message: z.string().min(1)
});

const forDcBot = schema.omit({
    id: true,
    createdAT: true,
    gifUrl: true,
    message: true,
});

export const parseForDcBot = (record: unknown) => forDcBot.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
