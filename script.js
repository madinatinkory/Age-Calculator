const form = document.getElementById('ageForm');
const themeBtn = document.getElementById('themeToggle');

// Theme Toggle with LocalStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);
themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeBtn.addEventListener('click', () => {
  const current = document.body.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
});

// Age Calculation Logic
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const dayIn = document.getElementById('day');
  const monthIn = document.getElementById('month');
  const yearIn = document.getElementById('year');
  
  if (!validateForm(dayIn, monthIn, yearIn)) return;

  const birthDate = new Date(yearIn.value, monthIn.value - 1, dayIn.value);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  animateValue('resYears', years);
  animateValue('resMonths', months);
  animateValue('resDays', days);
});

function validateForm(day, month, year) {
  let valid = true;
  const now = new Date();

  [day, month, year].forEach(input => setError(input, ''));

  if (!day.value) { setError(day, 'Required'); valid = false; }
  if (!month.value) { setError(month, 'Required'); valid = false; }
  if (!year.value) { setError(year, 'Required'); valid = false; }

  if (valid) {
    const d = parseInt(day.value), m = parseInt(month.value), y = parseInt(year.value);
    const testDate = new Date(y, m - 1, d);

    if (m < 1 || m > 12) { setError(month, 'Invalid month'); valid = false; }
    else if (testDate.getMonth() !== m - 1) { setError(day, 'Must be a valid date'); valid = false; }
    else if (testDate > now) { setError(year, 'Must be in the past'); valid = false; }
  }
  return valid;
}

function setError(input, msg) {
  const parent = input.parentElement;
  const err = parent.querySelector('.error-msg');
  if (msg) {
    parent.classList.add('invalid');
    err.textContent = msg;
  } else {
    parent.classList.remove('invalid');
    err.textContent = '';
  }
}

function animateValue(id, target) {
  let start = 0;
  const duration = 500;
  const stepTime = Math.abs(Math.floor(duration / (target || 1)));
  const obj = document.getElementById(id);
  
  if (target === 0) { obj.textContent = 0; return; }

  const timer = setInterval(() => {
    start++;
    obj.textContent = start;
    if (start >= target) clearInterval(timer);
  }, stepTime);
}