import { Router } from "express";
import * as message from './repository'
import * as schema from './schema'

import { getRandomMessage} from "../templates/repository";
import {getRandomGif} from "../../utils/gifService";
import {sendCongratulatoryMessage} from "../../utils/discordBot";
import {getTitle} from "../sprints/repository";



const router = Router()

router
    .route('/')
    .get(async (req, res) => {
            const { username, sprint } = req.query;

            if (username && sprint ) {
                const records = await message.findByUserAndSprint(username as string, sprint as string);

                if (!records || records.length === 0) {
                    res.status(404).json('No messages found for the specified user');
                } else {
                    res.json(records)
                }
            }
            else if (username) {
                const records = await message.findByUsername(username as string);

                if (!records || records.length === 0) {
                    res.status(404).json('No messages found for the specified user');
                } else {
                    res.json(records)
                }

            }
             else if (sprint) {
                const records = await message.findBySprint(sprint as string);

                if (!records || records.length === 0) {
                     res.status(404).json('No messages found for the specified sprint');
                } else {
                    res.json(records)
                }
            } else {
                 res.json( await message.getAllMessages())}
        }
    )
    // eslint-disable-next-line consistent-return
    .post(async (req, res) => {
            const { username, sprintCode } = schema.parseForDcBot(req.body);

            const gifUrl = await getRandomGif();
            if (!gifUrl) {
                return res.status(500).json('Failed to fetch celebration GIF');
            }
            const congrats = await getRandomMessage();
            const title = await getTitle(sprintCode)

            await sendCongratulatoryMessage(username, title, gifUrl, congrats)
            await message.create({ username, sprintCode, gifUrl, message: congrats })
            res.json('Message was send to discord and saved info saved to database')
        }
    );

export default router;