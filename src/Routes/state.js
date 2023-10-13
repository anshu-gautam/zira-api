import express from 'express';
import State from '../Model/state.js';
import { auth } from '../middleware/auth.js';
import Project from '../Model/project.js';

const stateRouter = new express.Router();

stateRouter.post('/states', auth, async (req, res) => {
  try {
    const { name, description, color, project } = req.body;

    const foundProject = await Project.findOne({
      owner: req.user._id,
      _id: project,
    });

    if (!foundProject) {
      throw new Error('Unauthorized access');
    }
    const state = new State({ name, description, color, project });
    await state.save();
    res.status(200).send(state);
  } catch (e) {
    res.status(422).send(e.message);
  }
});

stateRouter.put('/states/:stateId', auth, async (req, res) => {
  const stateId = req.params.stateId;

  try {
    const projects = await Project.find({
      owner: req.user._id,
    });

    const projectIds = projects.map((project) => project._id);

    const state = await State.findOne({
      _id: stateId,
      project: { $in: projectIds },
    });

    if (!state) {
      throw new Error('Unauthorized Access');
    }

    state.name = req.body.name;
    state.description = req.body.description;
    state.color = req.body.color;
    await state.save();
    
    res.status(200).send(state);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default stateRouter;
