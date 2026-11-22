// Pixel Futures Co. - apps.js
// App 1: Trade-In Value Calculator   App 2: Order Total Calculator
// App 3: Form Validation (used on the Applications and Contact pages)

function money(n) { return '$' + n.toFixed(2); }

function setError(field, message) {
  const input = field.querySelector('input, select, textarea');
  const err = field.querySelector('.error');
  if (err) err.textContent = message;
  if (input) input.classList.toggle('invalid', message !== '');
}

/* ---------- Course app: Game Collection Value Calculator ---------- */
// Two inputs, one function: collection value = number of games * average price
function calculateCollectionValue(numGames, avgPrice) {
  return numGames * avgPrice;
}

const gameValueForm = document.getElementById('gameValueForm');
if (gameValueForm) {
  gameValueForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const countIn = document.getElementById('gv-count');
    const priceIn = document.getElementById('gv-price');
    const out = document.getElementById('gameValueResult');
    const count = Number(countIn.value);
    const price = parseFloat(priceIn.value.replace(/[$,]/g, ''));
    const countBad = countIn.value.trim() === '' || !Number.isInteger(count) || count < 1;
    const priceBad = isNaN(price) || price <= 0;
    setError(countIn.parentElement, countBad ? 'Enter a whole number of games, 1 or more.' : '');
    setError(priceIn.parentElement, priceBad ? 'Enter an average price greater than 0.' : '');
    if (countBad || priceBad) { out.hidden = true; return; }
    const total = calculateCollectionValue(count, price);
    out.innerHTML = '<p class="big">' + money(total) + ' total value</p>' +
      '<p>' + count + ' game' + (count === 1 ? '' : 's') + ' x ' + money(price) + ' each</p>';
    out.hidden = false;
  });
}

/* ---------- Course app: Mortgage Calculator ---------- */
function calculateMortgage(amount, annualRatePct, years) {
  const n = years * 12;
  const r = annualRatePct / 100 / 12;
  const payment = r === 0 ? amount / n : amount * r / (1 - Math.pow(1 + r, -n));
  return { payment: payment, total: payment * n, interest: payment * n - amount };
}

const mortgageForm = document.getElementById('mortgageForm');
if (mortgageForm) {
  mortgageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const amtIn = document.getElementById('mg-amount');
    const rateIn = document.getElementById('mg-rate');
    const yrsIn = document.getElementById('mg-years');
    const out = document.getElementById('mortgageResult');
    const amount = parseFloat(amtIn.value.replace(/[$,]/g, ''));
    const rate = parseFloat(rateIn.value);
    const years = Number(yrsIn.value);
    const amtBad = isNaN(amount) || amount <= 0;
    const rateBad = isNaN(rate) || rate < 0 || rate > 100;
    const yrsBad = !Number.isInteger(years) || years < 1 || years > 50;
    setError(amtIn.parentElement, amtBad ? 'Enter a loan amount greater than 0.' : '');
    setError(rateIn.parentElement, rateBad ? 'Enter a rate from 0 to 100.' : '');
    setError(yrsIn.parentElement, yrsBad ? 'Enter a whole number of years from 1 to 50.' : '');
    if (amtBad || rateBad || yrsBad) { out.hidden = true; return; }
    const r = calculateMortgage(amount, rate, years);
    out.innerHTML = '<p class="big">' + money(r.payment) + ' per month</p>' +
      '<table><tr><td>Total of ' + (years * 12) + ' payments</td><td>' + money(r.total) + '</td></tr>' +
      '<tr><td>Total interest</td><td>' + money(r.interest) + '</td></tr></table>';
    out.hidden = false;
  });
}

/* ---------- App 1: Trade-In Value Calculator ---------- */
const tradeInForm = document.getElementById('tradeInForm');
if (tradeInForm) {
  tradeInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const consoleSel = document.getElementById('ti-console');
    const condSel = document.getElementById('ti-condition');
    const out = document.getElementById('tradeInResult');
    let ok = true;

    setError(consoleSel.parentElement, consoleSel.value === '' ? 'Please choose a console.' : '');
    setError(condSel.parentElement, condSel.value === '' ? 'Please choose a condition.' : '');
    if (consoleSel.value === '' || condSel.value === '') ok = false;
    if (!ok) { out.hidden = true; return; }

    const base = parseFloat(consoleSel.value);
    const multiplier = parseFloat(condSel.value);
    let extras = 0;
    if (document.getElementById('ti-box').checked) extras += 10;
    if (document.getElementById('ti-controller').checked) extras += 8;
    if (document.getElementById('ti-tested').checked) extras += 5;

    const offer = base * multiplier + extras;
    const name = consoleSel.options[consoleSel.selectedIndex].text;
    const cond = condSel.options[condSel.selectedIndex].text;
    out.innerHTML = '<p>' + name + ' (' + cond + ')</p>' +
      '<p class="big">Estimated offer: ' + money(offer) + '</p>' +
      '<p>Final offers are confirmed after we test the item in the shop.</p>';
    out.hidden = false;
  });
}

/* ---------- App 2: Order Total Calculator ---------- */
const orderForm = document.getElementById('orderForm');
if (orderForm) {
  const TAX_RATE = 0.08875;
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const priceIn = document.getElementById('or-price');
    const qtyIn = document.getElementById('or-qty');
    const ship = document.getElementById('or-ship').value;
    const out = document.getElementById('orderResult');

    const price = parseFloat(priceIn.value.replace('$', ''));
    const qty = Number(qtyIn.value);
    const priceBad = isNaN(price) || price <= 0;
    const qtyBad = !Number.isInteger(qty) || qty < 1 || qty > 99;
    setError(priceIn.parentElement, priceBad ? 'Enter a price greater than 0, like 34.99.' : '');
    setError(qtyIn.parentElement, qtyBad ? 'Enter a whole number from 1 to 99.' : '');
    if (priceBad || qtyBad) { out.hidden = true; return; }

    const subtotal = price * qty;
    const tax = subtotal * TAX_RATE;
    let shipping = { pickup: 0, standard: 6.99, express: 14.99 }[ship];
    if (ship === 'standard' && subtotal > 75) shipping = 0;
    const total = subtotal + tax + shipping;

    out.innerHTML = '<table>' +
      '<tr><td>Subtotal (' + qty + ' x ' + money(price) + ')</td><td>' + money(subtotal) + '</td></tr>' +
      '<tr><td>Tax (8.875%)</td><td>' + money(tax) + '</td></tr>' +
      '<tr><td>Shipping</td><td>' + (shipping === 0 ? 'FREE' : money(shipping)) + '</td></tr>' +
      '<tr class="total"><td>Total</td><td>' + money(total) + '</td></tr></table>';
    out.hidden = false;
  });
}

/* ---------- App 3: Form Validation ---------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

function validateField(input) {
  const value = input.value.trim();
  let message = '';
  if (input.name === 'name') {
    if (value.length < 2) message = 'Please enter your name (at least 2 characters).';
  } else if (input.name === 'email') {
    if (value === '') message = 'Email is required.';
    else if (!EMAIL_RE.test(value)) message = 'Enter a valid email, like name@example.com.';
  } else if (input.name === 'phone') {
    if (value !== '' && !PHONE_RE.test(value)) message = 'Use a 10-digit phone number, like 555-123-4567.';
  } else if (input.name === 'topic') {
    if (value === '') message = 'Please choose a topic.';
  } else if (input.name === 'message') {
    if (value.length < 10) message = 'Please write at least 10 characters.';
  }
  setError(input.parentElement, message);
  return message === '';
}

document.querySelectorAll('form[data-validate]').forEach((form) => {
  const fields = form.querySelectorAll('input[name], textarea[name], select[name]');
  const status = form.querySelector('.form-status');

  fields.forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('change', () => { if (input.tagName === 'SELECT') validateField(input); });
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validateField(input);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let allGood = true;
    fields.forEach((input) => { if (!validateField(input)) allGood = false; });
    if (allGood) {
      status.textContent = 'Thanks! Your form passed validation. (Prototype: nothing is sent yet.)';
      status.classList.add('ok');
      form.reset();
    } else {
      status.textContent = 'Please fix the highlighted fields.';
      status.classList.remove('ok');
    }
  });
});
