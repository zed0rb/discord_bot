import { Router } from 'express';
import {ZodError} from "zod";
import { StatusCodes } from 'http-status-codes';
import * as sprint from "./repository";
import * as schema from'./schema'



const router = Router();

router
    .route('/')
    .get(async (req, res) => {
        const sprints = await sprint.getAllSprints()
        res.send(sprints)
    })
    .post(async (req, res ) => {
            try {
                const {sprintCode, title} = schema.parseInsertable(req.body)
                await sprint.create({sprintCode, title})
                res.json( `Sprint was created with sprint code: ${sprintCode} and title: ${title}`)
            } catch (error ) {
              if (error instanceof ZodError) {
                res.status(422).json('Missing sprintCode or title message')
              }
            }
        }
    );

router
    .route('/:id(\\d+)')
    .get(async (req, res) => {
            const id = schema.parseId(req.params.id)
            const record = await sprint.getById(id)

            if (!record) {
                return res.status(StatusCodes.NOT_FOUND).json(`No sprint in database with id: ${id}`)
            }

            return res.json(record)
        }
    )
    .patch(async (req, res) => {
            const id = schema.parseId(req.params.id);
            const bodyPatch = schema.parsePartial(req.body)
            const record = await sprint.update(id, bodyPatch)

            if (!record) {
                return res.status(404).json('Sprint not found')
            }
            return res.status(200).json(record)
        }
    )
    .delete(async (req, res) => {
            const id = schema.parseId(req.params.id)
            const message = await sprint.getById(id)
            if (!message) {
                return res.status(404).json(`Sprint by id ${id} not found`)
            }
            await sprint.deleteRow(id)
            return res.status(200).json('Sprint was deleted')
        }
    )

export default router;
