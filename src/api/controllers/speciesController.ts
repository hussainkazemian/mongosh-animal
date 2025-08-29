import {NextFunction, Request, Response} from 'express';
import {Species} from '../../types/Species';
import {MessageResponse} from '../../types/Messages';
import speciesModel from '../models/speciesModel';
import CustomError from '../../classes/CustomError';

type DBMessageResponse = MessageResponse & {
  data: Species;
};

const postSpecies = async (
  req: Request<{}, {}, Species>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const newSpecies = new speciesModel(req.body);
    const savedSpecies = await newSpecies.save();

    res.status(201).json({
      message: 'Species created',
      data: savedSpecies,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getSpecies = async (
  req: Request,
  res: Response<Species[]>,
  next: NextFunction,
) => {
  try {
    res.json(
      await speciesModel.find().select('-__v').populate({
        path: 'category',
        select: '-__v',
      }),
    );
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getSpeciesById = async (
  req: Request<{id: string}>,
  res: Response<Species>,
  next: NextFunction,
) => {
  try {
    const species = await speciesModel
      .findById(req.params.id)
      .select('-__v')
      .populate({
        path: 'category',
        select: '-__v',
      });
    if (!species) {
      return next(new CustomError('Species not found', 404));
    }
    res.json(species);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const putSpecies = async (
  req: Request<{id: string}, {}, Species>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const species = await speciesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true},
    );
    if (!species) {
      return next(new CustomError('Species not found', 404));
    }
    res.status(200).json({
      message: 'Species updated',
      data: species,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const deleteSpecies = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const species = await speciesModel.findByIdAndDelete(req.params.id);
    if (!species) {
      return next(new CustomError('Species not found', 404));
    }
    res.status(200).json({
      message: 'Species deleted',
      data: species,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {postSpecies, getSpecies, getSpeciesById, putSpecies, deleteSpecies};
