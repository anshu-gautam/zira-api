import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRouter from './Routes/user.js';
import projectRouter from './Routes/project.js';
import ticketRouter from './Routes/ticket.js';
import stateRouter from './Routes/state.js';
import estimateRouter from './Routes/estimate.js';

const db =
  'mongodb+srv://anshu:gKscxobB3iwbSelf@cluster0.rawebl3.mongodb.net/?retryWrites=true&w=majority';

const connectionParams = {
  useUnifiedTopology: true,
};

mongoose
  .connect(db, connectionParams)
  .then(() => {
    console.info('connected to DB');
  })
  .catch((e) => {
    console.log('e', e);
  });

const app = express();

app.use(cors());
app.options('*', cors());
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(projectRouter);
app.use(ticketRouter);
app.use(stateRouter);
app.use(estimateRouter);

app.listen(port, () => {
  console.log('server is running on port ' + port);
});
