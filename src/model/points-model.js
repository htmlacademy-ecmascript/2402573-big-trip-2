import {points as pointsMocks} from '../mock/points.js';

export default class PointsModel {
  #points = pointsMocks;

  get points() {
    return [...this.#points];
  }

  getById(id) {
    return this.#points.find((point) => point.id === id);
  }
}
