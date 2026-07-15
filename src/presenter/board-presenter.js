import { FilterTypes, SortTypes } from '../const.js';
import { render } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import {sortByDay, sortByPrice, sortByTime} from '../utils/sort.js';
import ListView from '../view/list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';

export default class BoardPresenter {
  #listComponent = new ListView();
  #sortComponent = null;
  #currentSortType = SortTypes.DEFAULT;
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
    this.#points = [...this.#pointsModel.points].sort(sortByDay);
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
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point, destination, checkedOffers, allOffers, allDestinations);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #renderList() {
    if (this.#points.length === 0) {
      const emptyList = new EmptyListView({ filterType: FilterTypes.EVERYTHING });
      render(emptyList, this.#container);
      return;
    }

    this.#renderSort();
    render(this.#listComponent, this.#container);

    this.#renderPoints();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#container);
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortTypes.TIME:
        this.#points.sort(sortByTime);
        break;
      case SortTypes.PRICE:
        this.#points.sort(sortByPrice);
        break;
      default:
        this.#points.sort(sortByDay);
    }

    this.#currentSortType = sortType;
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });
    this.#pointPresenters.clear();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    const { destination, checkedOffers, allOffers, allDestinations } = this.#getPointData(updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, destination, checkedOffers, allOffers, allDestinations);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPoints();
  };
}
