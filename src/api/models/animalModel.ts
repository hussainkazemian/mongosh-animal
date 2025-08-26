import mongoose from 'mongoose';
import { Animal } from '../../types/Animal';

const animalSchema = new mongoose.Schema<Animal>({
  animal_name: {
    type: String,
    required: true,
    unique: true,
    minLength: 2,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  species: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Species',
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere',
    },
  },
});

export default mongoose.model<Animal>('Animal', animalSchema);
