import express from 'express';
import Ticket from '../Model/ticket.js';
import { auth } from '../middleware/auth.js';
import Project from '../Model/project.js';
import State from '../Model/state.js';

const ticketRouter = new express.Router();

ticketRouter.post('/tickets', auth, async (req, res) => {
  try {
    const { title, description, state, estimates, project, priority } =
      req.body;

    const foundProject = await Project.findOne({
      _id: project,
      owner: req.user._id,
    });

    if (!foundProject) {
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

ticketRouter.get('/tickets', auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ owner: req.user._id })
      .populate('state')
      .populate('owner');
    res.status(200).send(tickets);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

ticketRouter.get('/tickets/:ticketId', auth, async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const ticket = await Ticket.findOne({
      owner: req.user._id,
      _id: ticketId,
    });

    if (!ticket) {
      throw new Error('Unauthorized access');
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
