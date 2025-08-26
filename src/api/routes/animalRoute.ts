import express from 'express';
import {
  deleteAnimal,
  getAnimals,
  getAnimalById,
  postAnimal,
  putAnimal,
  getAnimalsByLocation,
} from '../controllers/animalController';

const router = express.Router();

router.route('/').post(postAnimal).get(getAnimals);
router.route('/location').get(getAnimalsByLocation);
router.route('/:id').get(getAnimalById).put(putAnimal).delete(deleteAnimal);

export default router;
