import { updateItem } from '../utils/common.js';
import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #tripApiService = null;
  #points = [];

  constructor({ tripApiService }) {
    super();
    this.#tripApiService = tripApiService;
  }

  get points() {
    return [...this.#points];
  }

  async init() {
    try {
      const points = await this.#tripApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch {
      this.#points = [];
      this._notify(UpdateType.ERROR);
    }

    this._notify(UpdateType.INIT);
  }

  async addPoint(updateType, pointToAdd) {
    try {
      const response = await this.#tripApiService.addPoint(pointToAdd);
      const newPoint = this.#adaptToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch {
      throw new Error('Cannot add point');
    }
  }

  async updatePoint(updateType, updated) {
    const index = this.#points.findIndex((point) => point.id === updated.id);

    if (index === -1) {
      throw new Error('Cannot update unexisting point');
    }

    try {
      const response = await this.#tripApiService.updatePoint(updated);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = updateItem(this.#points, updatedPoint);
      this._notify(updateType, updatedPoint);
    } catch {
      throw new Error('Cannot update point');
    }
  }

  async deletePoint(updateType, pointToDelete) {
    const index = this.#points.findIndex((point) => point.id === pointToDelete.id);

    if (index === -1) {
      throw new Error('Cannot delete unexisting point');
    }
    try {
      await this.#tripApiService.deletePoint(pointToDelete);
      this.#points = this.#points.filter((item) => item.id !== pointToDelete.id);
      this._notify(updateType);
    } catch {
      throw new Error('Cannot delete point');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
