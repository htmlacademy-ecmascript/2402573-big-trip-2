import { FilterTypes } from '../const.js';
import { render } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import ListView from '../view/list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';

export default class BoardPresenter {
  #listComponent = new ListView();
  #container = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];
  #pointPresenters = new Map();

  constructor({ container, pointsModel, destinationsModel, offersModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#points = this.#pointsModel.points;
    this.#renderList();
  }

  #getPointData(point) {
    return {
      destination: this.#destinationsModel.getById(point.destination),
      checkedOffers: this.#offersModel.getByIds(point.offers),
      allOffers: this.#offersModel.getByType(point.type),
      allDestinations: this.#destinationsModel.destinations,
    };
  }

  #renderPoint(point) {
    const { destination, checkedOffers, allOffers, allDestinations } = this.#getPointData(point);

    const pointPresenter = new PointPresenter({
      container: this.#listComponent.element,
      onDataChange: this.#handlePointChange,
    });
    pointPresenter.init(point, destination, checkedOffers, allOffers, allDestinations);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderList() {
    if (this.#points.length === 0) {
      const emptyList = new EmptyListView({ filterType: FilterTypes.EVERYTHING });
      render(emptyList, this.#container);
      return;
    }
    render(new SortView(), this.#container);
    render(this.#listComponent, this.#container);

    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    const { destination, checkedOffers, allOffers, allDestinations } = this.#getPointData(updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, destination, checkedOffers, allOffers, allDestinations);
  };

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });
    this.#pointPresenters.clear();
  }
}
