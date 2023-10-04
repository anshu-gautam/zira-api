import jwt from 'jsonwebtoken';
import User from '../Model/user.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decode = jwt.verify(token, 'secretkey');
    const user = await User.findOne({ _id: decode._id, 'tokens.token': token });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log({ e });
    res.status(401).send({ error: 'Unauthorized access' });
  }
};
