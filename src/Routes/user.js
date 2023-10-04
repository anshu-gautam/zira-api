import express from 'express';
import User from '../Model/user.js';
import { auth } from '../middleware/auth.js';

const userRouter = new express.Router();

userRouter.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    console.log({ e });
    res.status(400).send({ error: e });
  }
});

userRouter.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.status(200).send({ token, name: user.name });
  } catch (e) {
    res.status(400).send(e.message);
  }
});
userRouter.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((tokenObj) => {
      return tokenObj.token !== req.token;
    });
    await req.user.save();
    res.status(200).send();
  } catch (e) {}
});

userRouter.get('/users/profile', auth, (req, res) => {
  res.send(req.user);
});

userRouter.patch('/users/edit', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const updatesAllowed = ['name', 'email', 'password'];
  const isvalidOperation = updates.every((update) =>
    updatesAllowed.includes.includes(update)
  );
  if (!isvalidOperation) {
    return res.status(404).send({ error: 'Invalid ipdates' });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    if (!req.user) {
      return res.status(400).send();
    }
  } catch {
    res.send(400).send(e);
  }
});
userRouter.delete('/users/delete', auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req._id)
    // if(!user){
    //  res.status(404).send()
    // }
    // res.send(user)
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(404).send();
  }
});

export default userRouter;
