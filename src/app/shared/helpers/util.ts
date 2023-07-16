export const calculateMonthsRemaining = (year: number): number => {
  const currentDate = new Date();
  let monthsRemaining = 0;
  if (year === currentDate.getFullYear()) {
    const currentMonth = currentDate.getMonth();
    monthsRemaining = 11 - currentMonth;
  }

  return monthsRemaining;
};

export const calculateDaysRemainingInMonth = (year: number, month: number): number => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
  
    if (year > currentYear || (year === currentYear && month > currentMonth)) {
      const nextMonthDate = new Date(year, month, 1);
      const lastDayCurrentMonth = new Date(+nextMonthDate - 1);
      const daysRemaining = lastDayCurrentMonth.getDate() - currentDate.getDate();
      return daysRemaining;
    }
  
    return 0; 
}
