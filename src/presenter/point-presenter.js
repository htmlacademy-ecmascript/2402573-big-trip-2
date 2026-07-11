import { render, replace, remove } from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';

export default class PointPresenter {
  #container = null;
  #pointComponent = null;
  #editPointComponent = null;
  #point = null;
  #destination = null;
  #checkedOffers = [];
  #allOffers = [];
  #allDestinations = [];
  #handleDataChange = null;

  constructor({ container, onDataChange }) {
    this.#container = container;
    this.#handleDataChange = onDataChange;
  }

  init(point, destination, checkedOffers, allOffers, allDestinations) {
    this.#point = point;
    this.#destination = destination;
    this.#checkedOffers = checkedOffers;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(
      { point,
        destination,
        checkedOffers,
        onRollupClick: this.#replacePointToForm,
        onFavoriteClick: this.#onFavoriteClick,
      });

    this.#editPointComponent = new EditFormView({
      point, destination, allOffers, allDestinations, checkedOffers,
      onRollupClick: this.#replaceFormToPoint,
      onFormSubmit: this.#onFormSubmit,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#container.contains(prevPointEditComponent.element)) {
      replace(this.#editPointComponent, prevPointEditComponent);
    }

    if (this.#container.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  #replacePointToForm = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #onFavoriteClick = () => {
    const updatedPoint = {...this.#point, isFavorite: !this.#point.isFavorite};
    this.#handleDataChange(updatedPoint);
  };

  #onFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceFormToPoint();
  };
}
