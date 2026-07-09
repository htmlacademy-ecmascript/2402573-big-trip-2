import {render} from './framework/render.js';
import DestinationsModel from './model/destinations-model.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import { generateFilter } from './mock/filter.js';

const filterContainer = document.querySelector('.trip-controls__filters');

const mainElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const boardPresenter = new BoardPresenter({
  container: mainElement,
  pointsModel,
  destinationsModel,
  offersModel
});

const filters = generateFilter(pointsModel.points);

render(new FilterView({ filters }), filterContainer);

boardPresenter.init();
