import { NextFunction, Request, Response } from 'express';
import { Species } from '../../types/Species';
import { MessageResponse } from '../../types/Messages';
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
    res.json(await speciesModel.find());
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getSpeciesById = async (
  req: Request<{ id: string }>,
  res: Response<Species>,
  next: NextFunction,
) => {
  try {
    const species = await speciesModel.findById(req.params.id);

    if (!species) {
      next(new CustomError('Species not found', 404));
      return;
    }
    res.json(species);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const putSpecies = async (
  req: Request<{ id: string }, {}, Species>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const updatedSpecies = await speciesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    if (!updatedSpecies) {
      next(new CustomError('Species not found', 404));
      return;
    }

    res.json({
      message: 'Species updated',
      data: updatedSpecies,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const deleteSpecies = async (
  req: Request<{ id: string }>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const deletedSpecies = await speciesModel.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedSpecies) {
      next(new CustomError('Species not found', 404));
      return;
    }
    res.json({
      message: 'Species deleted',
      data: deletedSpecies,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export { postSpecies, getSpecies, getSpeciesById, putSpecies, deleteSpecies };
