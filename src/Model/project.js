import mongoose from 'mongoose';
import validator from 'validator';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    identifier: {
      type: String,
      unique: true,
      required: true,
      validate(value) {
        if (!validator.isLength(value, { min: 3, max: 3 })) {
          throw new Error('Identifier must have exactly 3 characters');
        }
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
