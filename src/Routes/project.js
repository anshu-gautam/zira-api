import express from 'express';

import { auth } from '../middleware/auth.js';
import Project from '../Model/project.js';
import State from '../Model/state.js';
import Estimate from '../Model/estimate.js';
const projectRouter = new express.Router();

projectRouter.post('/projects', auth, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      identifier: req.body.identifier.toLowerCase(),
      owner: req.user._id,
    });
    await project.save();
    res.status(201).send(project);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

projectRouter.get('/projects', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).populate(
      'owner'
    );
    res.status(200).send(projects);
  } catch (e) {
    res.status(500).send();
  }
});

projectRouter.get('/projects/:projectId', auth, async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const project = await Project.findOne({
      owner: req.user._id,
      _id: projectId,
    });

    if (!project) {
      throw new Error('Unauthorized access');
    }

    const states = await State.find({ project: projectId });
    const estimates = await Estimate.find({ project: projectId });

    res.status(200).send({ project, states, estimates });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

projectRouter.put('/projects/:projectId', auth, async (req, res) => {
  const projectId = req.params.projectId;

  try {
    const project = await Project.findOne({
      owner: req.user._id,
      _id: projectId,
    });

    if (!project) {
      throw new Error('Unauthorized access');
    }

    project.name = req.body.name;
    project.desc = req.body.desc;
    project.identifier = req.body.identifier.toLowerCase();

    await project.save();

    res.status(200).send(project);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default projectRouter;
