import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const inputDatePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const timerDisplay = document.querySelector(".timer");
const daysLeft = document.querySelector('[data-days]');
const hoursLeft = document.querySelector('[data-hours]');
const minutesLeft = document.querySelector('[data-minutes]');
const secondsLeft = document.querySelector('[data-seconds]');

let userSelecteDate = null;
let intervalBack = null;
startBtn.disabled = true;

flatpickr(inputDatePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelecteDate = selectedDates[0];
  
    if (userSelecteDate <= new Date()) {
     
      startBtn.disabled = true;
        iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
    }
    else {
      startBtn.disabled = false;
      iziToast.success({
        title: 'Success',
        message: 'Valid date selected!',
      });
    }
  },
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) { 
  return String(value).padStart(2, "0");
}

  
function startCountDown(userSelecteDate) {
  const intervalId = setInterval(() => {
    const now = new Date();
    const timeLeft = userSelecteDate - now;

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      inputDatePicker.disabled = false;
      iziToast.info({
        title: "Timer Finished",
        message: "The coundown has ended.",
      });
      return;
    }
    const timeComponents = convertMs(timeLeft);
    
    
    daysLeft.textContent = addLeadingZero(timeComponents.days);
    hoursLeft.textContent = addLeadingZero(timeComponents.hours);
    minutesLeft.textContent = addLeadingZero(timeComponents.minutes);
    secondsLeft.textContent = addLeadingZero(timeComponents.seconds);
  }
    , 1000);
}
    
startBtn.addEventListener('click', () => {
  if (!userSelecteDate) return; 
  startBtn.disabled = true;
  inputDatePicker.disabled = true;
  startCountDown(userSelecteDate);
})
