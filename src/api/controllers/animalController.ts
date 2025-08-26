import { NextFunction, Request, Response } from 'express';
import { Animal } from '../../types/Animal';
import { MessageResponse } from '../../types/Messages';
import animalModel from '../models/animalModel';
import CustomError from '../../classes/CustomError';

type DBMessageResponse = MessageResponse & {
  data: Animal;
};

const postAnimal = async (
  req: Request<{}, {}, Animal>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const newAnimal = new animalModel(req.body);
    const savedAnimal = await newAnimal.save();

    res.status(201).json({
      message: 'Animal created',
      data: savedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimals = async (
  req: Request,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    res.json(await animalModel.find());
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimalById = async (
  req: Request<{ id: string }>,
  res: Response<Animal>,
  next: NextFunction,
) => {
  try {
    const animal = await animalModel.findById(req.params.id);

    if (!animal) {
      next(new CustomError('Animal not found', 404));
      return;
    }
    res.json(animal);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const putAnimal = async (
  req: Request<{ id: string }, {}, Animal>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const updatedAnimal = await animalModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    if (!updatedAnimal) {
      next(new CustomError('Animal not found', 404));
      return;
    }

    res.json({
      message: 'Animal updated',
      data: updatedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const deleteAnimal = async (
  req: Request<{ id: string }>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const deletedAnimal = await animalModel.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedAnimal) {
      next(new CustomError('Animal not found', 404));
      return;
    }
    res.json({
      message: 'Animal deleted',
      data: deletedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimalsByLocation = async (
  req: Request<{}, {}, {}, { topRight: string; bottomLeft: string }>,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const [topRightLat, topRightLon] = req.query.topRight.split(',').map(Number);
    const [bottomLeftLat, bottomLeftLon] = req.query.bottomLeft.split(',').map(Number);

    const animals = await animalModel.find({
      location: {
        $geoWithin: {
          $box: [
            [bottomLeftLon, bottomLeftLat],
            [topRightLon, topRightLat],
          ],
        },
      },
    });

    res.json(animals);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {
  postAnimal,
  getAnimals,
  getAnimalById,
  putAnimal,
  deleteAnimal,
  getAnimalsByLocation,
};
