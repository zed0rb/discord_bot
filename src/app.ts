import express from 'express';
import templateRouter from './modules/templates/controller'
import messageRouter from './modules/messages/controller'
import sprintRouter from './modules/sprints/controller'



const app = express();

app.use(express.json());

app.use('/messages', messageRouter)
app.use('/templates', templateRouter)
app.use('/sprints', sprintRouter)

export default app;
