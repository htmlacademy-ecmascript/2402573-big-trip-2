import dayjs from 'dayjs';

const sortByDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sortByTime = (pointA, pointB) => {
  const pointADuration = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const pointBDuration = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return pointBDuration - pointADuration;
};

export { sortByDay, sortByPrice, sortByTime };
