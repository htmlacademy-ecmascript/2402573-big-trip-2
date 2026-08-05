import DestinationsModel from './model/destinations-model.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import FiltersModel from './model/filters-model.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripApiService from './trip-api-service.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';

const AUTHORIZATION = `Basic ${Math.random().toString(36).slice(2)}`;
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const filterContainerElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-events');
const tripMainElement = document.querySelector('.trip-main');

const tripApiService = new TripApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({ tripApiService });
const destinationsModel = new DestinationsModel({ tripApiService });
const offersModel = new OffersModel({ tripApiService });
const filtersModel = new FiltersModel();

const filterPresenter = new FilterPresenter({
  filterContainerElement,
  filtersModel,
  pointsModel
});

const boardPresenter = new BoardPresenter({
  container: mainElement,
  newPointButtonContainer: tripMainElement,
  pointsModel,
  destinationsModel,
  offersModel,
  filtersModel,
});

const tripInfoPresenter = new TripInfoPresenter({
  container: tripMainElement,
  pointsModel,
  destinationsModel,
  offersModel,
});

filterPresenter.init();
boardPresenter.init();
tripInfoPresenter.init();

// Справочники (пункты назначения и офферы) загружаются до точек,
// так как точки ссылаются на них по id
Promise.all([
  destinationsModel.init(),
  offersModel.init(),
])
  .then(() => pointsModel.init())
  .catch(() => {
    boardPresenter.showLoadError();
  })
  .finally(() => {
    boardPresenter.enableNewPointButton();
  });
