import mongoose from 'mongoose';

interface Weight {
  userId: mongoose.Schema.Types.ObjectId;
  value: number;
  date: Date;
}

const weightSchema = new mongoose.Schema<Weight>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    required: true,
  },
});

export default mongoose.models.Weight || mongoose.model<Weight>('Weight', weightSchema);