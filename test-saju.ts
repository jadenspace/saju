import { Solar } from 'lunar-javascript';

const date = Solar.fromYmdHms(2024, 2, 4, 16, 30, 0); // Feb 4, 2024 is around Ipchun
const lunar = date.getLunar();

console.log('Date: 2024-02-04 16:30:00');
console.log('Standard Year GanZhi:', lunar.getYearInGanZhi());
console.log('Year GanZhi by LiChun:', lunar.getYearInGanZhiByLiChun());
console.log('Standard Month GanZhi:', lunar.getMonthInGanZhi());
console.log('Month GanZhi Exact:', lunar.getMonthInGanZhiExact());
console.log('Day GanZhi:', lunar.getDayInGanZhi());
console.log('Day GanZhi Exact:', lunar.getDayInGanZhiExact());
console.log('Time GanZhi:', lunar.getTimeInGanZhi());

const date2 = Solar.fromYmdHms(2024, 1, 1, 12, 0, 0);
const lunar2 = date2.getLunar();
console.log('\nDate: 2024-01-01 12:00:00');
console.log('Year GanZhi by LiChun:', lunar2.getYearInGanZhiByLiChun());
