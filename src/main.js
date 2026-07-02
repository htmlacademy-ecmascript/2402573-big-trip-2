import {render} from './render.js';
import FilterView from './view/filter.js';
import BoardPresenter from './presenter/board-presenter.js';

const filterContainer = document.querySelector('.trip-controls__filters');

const mainElement = document.querySelector('.trip-events');

const boardPresenter = new BoardPresenter({
  container: mainElement,
});

render(new FilterView(), filterContainer);

boardPresenter.init();
