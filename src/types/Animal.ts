import types from 'mongoose';
import { Point } from 'geojson';

type Animal = {
  animal_name: string;
  birthdate: Date;
  species: types.ObjectId;
  location: Point;
}
export { Animal };
