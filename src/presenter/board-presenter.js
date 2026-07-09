import EditFormView from '../view/edit-point.js';
import ListView from '../view/list.js';
import PointView from '../view/point.js';
import SortView from '../view/sort.js';
import {render, replace} from '../framework/render.js';
import EmptyListView from '../view/empty-list-view.js';
import { FilterTypes } from '../const.js';

export default class BoardPresenter {
  #listComponent = new ListView();
  #container = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];

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

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
      }
    };

    const destination = this.#destinationsModel.getById(point.destination);
    const checkedOffers = this.#offersModel.getByIds(point.offers);
    const newPoint = new PointView({ point, destination, checkedOffers, onRollupClick: replacePointToForm });

    const allOffers = this.#offersModel.getByType(point.type);
    const allDestinations = this.#destinationsModel.destinations;
    const editPoint = new EditFormView({
      point, destination, allOffers, allDestinations, checkedOffers,
      onRollupClick: replaceFormToPoint,
      onFormSubmit: replaceFormToPoint
    });

    function replacePointToForm() {
      replace(editPoint, newPoint);
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function replaceFormToPoint() {
      replace(newPoint, editPoint);
      document.removeEventListener('keydown', escKeyDownHandler);
    }
    render(newPoint, this.#listComponent.element);
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
}
