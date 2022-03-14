const roundTo = (num, interval) => {
  return Math.round(num / interval) * interval;
};

// for interval = 12 hours
// 2022-03-05 00:00:00 -> 2022-03-05 00:00:00 (no change needed)
// 2022-03-05 12:00:00 -> 2022-03-05 12:00:00 (no change needed)
// 2022-03-05 11:50:57 -> 2022-03-05 12:00:00 (rounded up)
// 2022-03-05 12:01:00 -> 2022-03-05 12:00:00 (rounded down)
// 2022-03-05 22:15:48 -> 2022-03-06 00:00:00 (rounded up)
export const roundHours = (date, interval = 12) => {
  const newDate = new Date(date);
  const h = newDate.getHours() + newDate.getMinutes() / 60 + newDate.getSeconds() / 3600 + newDate.getMilliseconds() / 3600000;

  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  newDate.setHours(roundTo(h, interval));

  return newDate;
};
