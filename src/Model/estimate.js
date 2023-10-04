import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const estimateSchema = new Schema({
  value: { type: Number, required: true, unique: true },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project',
  },
});

const Estimate = mongoose.model('Estimate', estimateSchema);

export default Estimate;
