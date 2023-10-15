import express from 'express';
import Ticket from '../Model/ticket.js';
import { auth } from '../middleware/auth.js';
import Project from '../Model/project.js';
import State from '../Model/state.js';
import ProjectUser from '../Model/projectUser.js';

const ticketRouter = new express.Router();

ticketRouter.post('/tickets', auth, async (req, res) => {
  try {
    const { title, description, state, estimates, project, priority } =
      req.body;

    const foundProject = await Project.findOne({
      _id: project,
      owner: req.user._id,
    });

    const projectUser = await ProjectUser.findOne({
      user: req.user._id,
      project: project,
    });

    if (!foundProject && !projectUser) {
      throw new Error('Unauthorized access');
    }

    const foundState = await State.findOne({ _id: state, project: project });

    if (!foundState) {
      throw new Error('Unauthorized access');
    }

    const ticket = new Ticket({
      title,
      description,
      state,
      estimates,
      project,
      priority,
      owner: req.user._id,
    });

    await ticket.save();
    res.status(201).send(ticket);
  } catch (e) {
    res.status(422).send(e.message);
  }
});

// moved to projectRouter
// ticketRouter.get('/tickets', auth, async (req, res) => {
//   try {
//     const tickets = await Ticket.find({ owner: req.user._id })
//       .populate('state')
//       .populate('owner');
//     res.status(200).send(tickets);
//   } catch (e) {
//     res.status(500).send(e.message);
//   }
// });

ticketRouter.get('/tickets/:ticketId', auth, async (req, res) => {
  try {
    const ticketId = req.params.ticketId;

    const ticket = await Ticket.findOne({
      _id: ticketId,
    });

    if (!ticket) {
      throw new Error('Unauthorized access');
    }
    const projectId = ticket.project;

    const isAdmin = req.user.role === 'admin';

    if (isAdmin) {
      const project = await Project.findOne({
        _id: projectId,
        owner: req.user._id,
      });
      if (!project) {
        throw new Error('Unauthorized access');
      }
    } else {
      const projectUser = await ProjectUser.findOne({
        project: projectId,
        user: req.user._id,
      });
      if (!projectUser) {
        throw new Error('Unauthorized access');
      }
    }

    res.status(200).send(ticket);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

ticketRouter.put('/tickets/:ticketId', auth, async (req, res) => {
  const ticketId = req.params.ticketId;
  try {
    const ticket = await Ticket.findOneAndUpdate(
      {
        owner: req.user._id,
        _id: ticketId,
      },
      { ...req.body }
    );

    if (!ticket) {
      throw new Error('Unauthorized access');
    }

    res.status(200).send(ticket);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default ticketRouter;
