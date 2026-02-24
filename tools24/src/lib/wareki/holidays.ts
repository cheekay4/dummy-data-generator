export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function fmt(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

// Get the date of the Nth occurrence of a weekday in a month
// weekday: 0=Sun, 1=Mon, ..., 6=Sat
function getNthWeekday(year: number, month: number, weekday: number, n: number): number {
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const offset = (weekday - firstDayOfMonth + 7) % 7;
  return 1 + offset + (n - 1) * 7;
}

// Vernal equinox (春分の日) approximation for 1980-2099
function vernalEquinox(year: number): number {
  if (year < 1980) return 21;
  return Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
}

// Autumnal equinox (秋分の日) approximation for 1980-2099
function autumnalEquinox(year: number): number {
  if (year < 1980) return 23;
  return Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
}

export function getHolidays(year: number): Holiday[] {
  const list: Holiday[] = [];

  const add = (month: number, day: number, name: string) => {
    list.push({ date: fmt(year, month, day), name });
  };

  // Fixed holidays
  add(1, 1, '元日');
  add(2, 11, '建国記念の日');
  if (year >= 2020) {
    add(2, 23, '天皇誕生日');
  } else if (year >= 2019) {
    // 2019-02-23 was still Heisei (天皇誕生日 was 12/23 until 2018)
    // 天皇誕生日 moved to 2/23 from 2020
  }
  add(4, 29, '昭和の日');
  add(5, 3, '憲法記念日');
  add(5, 4, 'みどりの日');
  add(5, 5, 'こどもの日');
  add(8, 11, '山の日');
  add(11, 3, '文化の日');
  add(11, 23, '勤労感謝の日');

  // Variable holidays (Nth weekday)
  add(1, getNthWeekday(year, 1, 1, 2), '成人の日');   // 2nd Monday of January
  add(7, getNthWeekday(year, 7, 1, 3), '海の日');     // 3rd Monday of July
  add(9, getNthWeekday(year, 9, 1, 3), '敬老の日');   // 3rd Monday of September
  add(10, getNthWeekday(year, 10, 1, 2), 'スポーツの日'); // 2nd Monday of October

  // Equinox
  add(3, vernalEquinox(year), '春分の日');
  add(9, autumnalEquinox(year), '秋分の日');

  // 2019 special: 即位の礼正殿の儀 (10/22)
  if (year === 2019) {
    add(5, 1, '即位の日');
    add(5, 2, '休日（祝日に挟まれた日）');
    add(10, 22, '即位礼正殿の儀');
  }

  // Sort
  list.sort((a, b) => a.date.localeCompare(b.date));

  // Build a set for fast lookup
  const dateSet = new Set(list.map((h) => h.date));

  // Substitute holidays (振替休日): when a holiday falls on Sunday, the next Monday is substitute
  const substitutes: Holiday[] = [];
  for (const h of [...list]) {
    const [y, m, d] = h.date.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (date.getDay() === 0) {
      // Find the next weekday that is not already a holiday
      let next = new Date(y, m - 1, d + 1);
      while (dateSet.has(fmt(next.getFullYear(), next.getMonth() + 1, next.getDate()))) {
        next = new Date(next.getTime() + 86400000);
      }
      const subDate = fmt(next.getFullYear(), next.getMonth() + 1, next.getDate());
      if (!dateSet.has(subDate)) {
        substitutes.push({ date: subDate, name: '振替休日' });
        dateSet.add(subDate);
      }
    }
  }

  return [...list, ...substitutes].sort((a, b) => a.date.localeCompare(b.date));
}

export function isHoliday(dateStr: string): boolean {
  const year = parseInt(dateStr.slice(0, 4), 10);
  return getHolidays(year).some((h) => h.date === dateStr);
}

export function getHolidayName(dateStr: string): string | null {
  const year = parseInt(dateStr.slice(0, 4), 10);
  const h = getHolidays(year).find((h) => h.date === dateStr);
  return h ? h.name : null;
}
