import { addMinutes, format } from 'date-fns';

export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  let currentTime = new Date();
  currentTime.setHours(6, 0, 0, 0);
  
  const endTime = new Date();
  endTime.setHours(21, 0, 0, 0);

  while (currentTime < endTime) {
    slots.push(format(currentTime, 'HH:mm'));
    currentTime = addMinutes(currentTime, 15);
  }

  return slots;
}