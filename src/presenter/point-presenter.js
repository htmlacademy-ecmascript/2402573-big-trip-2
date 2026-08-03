import { render, replace, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import PointFormView from '../view/point-form-view.js';
import PointView from '../view/point-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #container = null;
  #pointComponent = null;
  #editPointComponent = null;
  #point = null;
  #destination = null;
  #checkedOffers = [];
  #allOffers = [];
  #allDestinations = [];
  #dataChangeHandler = null;
  #modeChangeHandler = null;
  #mode = Mode.DEFAULT;

  constructor({ container, onDataChange, onModeChange }) {
    this.#container = container;
    this.#dataChangeHandler = onDataChange;
    this.#modeChangeHandler = onModeChange;
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
        onFavoriteClick: this.#favoriteClickHandler,
      });

    this.#editPointComponent = new PointFormView({
      point, destination, allOffers, allDestinations, checkedOffers,
      isEditMode: true,
      onRollupClick: this.#replaceFormToPoint,
      onFormSubmit: this.#formSubmitHandler,
      onDeleteClick: this.#deleteClickHandler
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevPointEditComponent);
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editPointComponent.updateElement({
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editPointComponent.updateElement({
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    this.#editPointComponent.updateElement({
      isSaving: false,
      isDeleting: false,
    });
    this.#editPointComponent.shake();
  }

  #replacePointToForm = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#modeChangeHandler();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    this.#editPointComponent.reset(this.#point, this.#destination);
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #favoriteClickHandler = () => {
    this.#dataChangeHandler(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  #formSubmitHandler = (point) => {
    this.#dataChangeHandler(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #deleteClickHandler = () => {
    this.#dataChangeHandler(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      this.#point
    );
  };
}
