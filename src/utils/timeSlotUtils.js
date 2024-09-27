export const generateTimeSlots = (start, end, slotLength) => {
  const slots = [];
  let currentTime = new Date(`2000-01-01T${start}:00`);
  const endTime = new Date(`2000-01-01T${end}:00`);

  while (currentTime < endTime) {
    slots.push(currentTime.toTimeString().slice(0, 5));
    currentTime.setMinutes(currentTime.getMinutes() + slotLength);
  }

  return slots;
};

export const generateDailyTimeSlots = (availability, timeSlotLength) => {
  const dailySlots = {};

  Object.entries(availability).forEach(([day, times]) => {
    const morningSlots = generateTimeSlots(times.start, times.lunchBreak.start, timeSlotLength);
    const afternoonSlots = generateTimeSlots(times.lunchBreak.end, times.end, timeSlotLength);
    dailySlots[day] = [...morningSlots, ...afternoonSlots];
  });

  return dailySlots;
};
