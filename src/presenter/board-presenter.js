import { FilterType, SortType, UpdateType, UserAction, TimeLimit } from '../const.js';
import { filter } from '../utils/filter.js';
import { render, remove } from '../framework/render.js';
import { sortByDay, sortByPrice, sortByTime } from '../utils/sort.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import ListView from '../view/list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import FailedToLoadView from '../view/failed-to-load-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';

export default class BoardPresenter {
  #listComponent = new ListView();
  #sortComponent = null;
  #emptyListComponent = null;
  #failedToLoadComponent = new FailedToLoadView();
  #loadingComponent = new LoadingView();
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #container = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filtersModel = null;
  #newPointPresenter = null;
  #pointPresenters = new Map();
  #isLoading = true;
  #isLoadFailed = false;
  #newPointButtonComponent = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ container, pointsModel, destinationsModel, offersModel, filtersModel, newPointButtonContainer }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#modelChangeHandler);
    this.#filtersModel.addObserver(this.#modelChangeHandler);

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#listComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#viewActionHandler,
      onFormClose: this.#newPointFormCloseHandler,
    });
    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#newPointButtonClickHandler,
    });
    render(this.#newPointButtonComponent, newPointButtonContainer);
  }

  get points() {
    const filteredPoints = filter[this.#filterType](this.#pointsModel.points);
    return [...filteredPoints].sort(this.#getSorter());
  }

  init() {
    this.#renderList();
  }

  showLoadError() {
    this.#isLoadFailed = true;
    this.#isLoading = false;
    remove(this.#loadingComponent);
    this.#renderList();
  }

  enableNewPointButton() {
    this.#newPointButtonComponent.setDisabled(false);
  }

  #getPointData(point) {
    return {
      destination: this.#destinationsModel.getById(point.destination),
      checkedOffers: this.#offersModel.getByIds(point.offers),
      allOffers: this.#offersModel.offers,
      allDestinations: this.#destinationsModel.destinations,
    };
  }

  #getSorter() {
    switch (this.#currentSortType) {
      case SortType.TIME:
        return sortByTime;
      case SortType.PRICE:
        return sortByPrice;
      default:
        return sortByDay;
    }
  }

  #renderPoint(point) {
    const { destination, checkedOffers, allOffers, allDestinations } = this.#getPointData(point);

    const pointPresenter = new PointPresenter({
      container: this.#listComponent.element,
      onDataChange: this.#viewActionHandler,
      onModeChange: this.#modeChangeHandler,
    });
    pointPresenter.init(point, destination, checkedOffers, allOffers, allDestinations);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

  #renderFailedToLoad() {
    render(this.#failedToLoadComponent, this.#container);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#sortTypeChangeHandler,
      currentSortType: this.#currentSortType
    });
    render(this.#sortComponent, this.#container);
  }

  #renderList() {
    if (this.#isLoadFailed) {
      this.#renderFailedToLoad();
      return;
    }

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.points.length === 0) {
      this.#emptyListComponent = new EmptyListView({ filterType: this.#filterType });
      render(this.#emptyListComponent, this.#container);
      return;
    }

    this.#renderSort();
    render(this.#listComponent, this.#container);

    this.#renderPoints();
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });
    this.#pointPresenters.clear();
    this.#newPointPresenter.destroy();
    remove(this.#sortComponent);
    remove(this.#emptyListComponent);
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #modeChangeHandler = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #viewActionHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #modelChangeHandler = (updateType, updatedPoint) => {
    this.#filterType = this.#filtersModel.filter;
    switch (updateType) {
      case UpdateType.PATCH: {
        const { destination, checkedOffers, allOffers, allDestinations } = this.#getPointData(updatedPoint);
        this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, destination, checkedOffers, allOffers, allDestinations);
      }
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderList();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderList();
        break;
      case UpdateType.ERROR:
        this.#isLoadFailed = true;
    }
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderList();
  };

  #newPointButtonClickHandler = () => {
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#modeChangeHandler();
    remove(this.#emptyListComponent);
    render(this.#listComponent, this.#container);
    this.#newPointPresenter.init();
    this.#newPointButtonComponent.setDisabled(true);
  };

  #newPointFormCloseHandler = () => {
    this.#newPointButtonComponent.setDisabled(false);
    if (this.points.length === 0) {
      remove(this.#listComponent);
      this.#emptyListComponent = new EmptyListView({ filterType: this.#filterType });
      render(this.#emptyListComponent, this.#container);
    }
  };
}
