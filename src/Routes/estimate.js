import express from 'express';
import Estimate from '../Model/estimate.js';
import { auth } from '../middleware/auth.js';
import Project from '../Model/project.js';

const estimateRouter = new express.Router();

estimateRouter.post('/estimates', auth, async (req, res) => {
  try {
    const { value, project } = req.body;

    const foundProject = await Project.findOne({
      owner: req.user._id,
      _id: project,
    });
    
    if (!foundProject) {
      throw new Error('Unauthorized access');
    }

    const estimate = new Estimate({ value, project });
    await estimate.save();
    res.status(200).send(estimate);
  } catch (e) {
    res.status(422).send(e.message);
  }
});

estimateRouter.put('/estimates/:estimateId', auth, async (req, res) => {
  const estimateId = req.params.estimateId;
  try {
    const projects = await Project.find({
      owner: req.user._id,
    });
    const projectIds = projects.map((project) => project._id);
    const estimate = await Estimate.findOne({
      _id: estimateId,
      project: { $in: projectIds },
    });
    if (!estimate) {
      throw new Error('Unauthorized Access');
    }
    estimate.value = req.body.value;
    await estimate.save();
    res.status(200).send(estimate);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default estimateRouter;
