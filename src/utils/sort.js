import dayjs from 'dayjs';

export const sortByDay = (eventA, eventB) => dayjs(eventA.dateFrom).diff(dayjs(eventB.dateFrom));

export const sortByPrice = (itemA, itemB) => itemB.basePrice - itemA.basePrice;

export const sortByTime = (eventA, eventB) => {
  const eventADuration = dayjs(eventA.dateTo).diff(dayjs(eventA.dateFrom));
  const eventBDuration = dayjs(eventB.dateTo).diff(dayjs(eventB.dateFrom));

  return eventBDuration - eventADuration;
};
