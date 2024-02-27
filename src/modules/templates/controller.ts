import { Router } from 'express'
import {ZodError} from "zod"
import * as template from "./repository"
import * as schema from'./schema'


const router = Router();

router
    .route('/')
    .get(async (req, res) => {
        const templates = await template.getAll()
        res.send(templates)
    })
    .post((async (req, res ) => {
            try {
                const body = schema.parseInsertable(req.body)
                await template.create(body)
                res.json(body)
            } catch (error ) {
              if (error instanceof ZodError) {
                res.status(422).json('Missing congratulation message')
              }
            }
        })
    );

router
    .route('/:id(\\d+)')
    .get(async (req, res) => {
            const id = schema.parseId(req.params.id)
            const record = await template.getById(id)

            if (!record) {
                return res.status(404).json('Template not found')
            }

            return res.json(record)
        }
    )
    .patch(async (req, res) => {
            const id = schema.parseId(req.params.id);
            const bodyPatch = schema.parsePartial(req.body)
            const record = await template.update(id, bodyPatch)

            if (!record) {
                return res.status(404).json('Template not found')
            }
            return res.status(200).json(record)
        }
    )
    .delete(async (req, res) => {
            const id = schema.parseId(req.params.id)
            const message = await template.getById(id)
            if (!message) {
                return res.status(404).json(`Template by id ${id} not found`)
            }
            await template.deleteRow(id)
            return res.status(200).json('Template was deleted')
        }
    )

export default router;
