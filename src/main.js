import {render} from './framework/render.js';
import DestinationsModel from './model/destinations-model.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import FilterView from './view/filter.js';
import BoardPresenter from './presenter/board-presenter.js';

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

render(new FilterView(), filterContainer);

boardPresenter.init();
