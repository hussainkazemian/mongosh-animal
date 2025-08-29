import express from 'express';
import {
  deleteAnimal,
  getAnimals,
  getAnimal,
  postAnimal,
  putAnimal,
  getAnimalsByBox,
  getBySpeciesName,
} from '../controllers/animalController';

const router = express.Router();

router.route('/').post(postAnimal).get(getAnimals);

router.route('/location').get(getAnimalsByBox);

router.route('/species/:species_name').get(getBySpeciesName);

router.route('/:id').get(getAnimal).put(putAnimal).delete(deleteAnimal);

export default router;
