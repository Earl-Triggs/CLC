/**
 * CLC Fragrances &mdash; Sign Up Page Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('clcSignupForm');
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const countryCodeSelect = document.getElementById('countryCode');
  const phoneInput = document.getElementById('phoneNumber');
  const birthMonthSelect = document.getElementById('birthMonth');
  const birthDaySelect = document.getElementById('birthDay');
  const birthYearSelect = document.getElementById('birthYear');
  const emailInput = document.getElementById('signupEmail');
  const passwordInput = document.getElementById('signupPassword');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const submitBtn = document.getElementById('signupSubmitBtn');
  const statusAlert = document.getElementById('signupStatusAlert');
  const toastContainer = document.getElementById('toastContainer');

  // --- Populate Days & Years ---
  function populateDays(numDays = 31) {
    const currentVal = birthDaySelect.value;
    birthDaySelect.innerHTML = '<option value="" disabled selected>Day</option>';
    for (let d = 1; d <= numDays; d++) {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d < 10 ? `0${d}` : d;
      birthDaySelect.appendChild(opt);
    }
    if (currentVal && currentVal <= numDays) {
      birthDaySelect.value = currentVal;
    }
  }

  function populateYears() {
    birthYearSelect.innerHTML = '<option value="" disabled selected>Year</option>';
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear - 12; // At least 12 years old
    const minYear = currentYear - 100;
    for (let y = maxYear; y >= minYear; y--) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      birthYearSelect.appendChild(opt);
    }
  }

  // Adjust days based on selected month & leap year
  function updateDaysInMonth() {
    const month = parseInt(birthMonthSelect.value, 10);
    const year = parseInt(birthYearSelect.value, 10) || 2000;
    if (!month) {
      populateDays(31);
      return;
    }
    const daysInMonth = new Date(year, month, 0).getDate();
    populateDays(daysInMonth);
  }

  populateDays(31);
  populateYears();

  birthMonthSelect.addEventListener('change', updateDaysInMonth);
  birthYearSelect.addEventListener('change', updateDaysInMonth);

  // --- Password Toggle ---
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';

      const openIcon = togglePasswordBtn.querySelector('.eye-open');
      const closedIcon = togglePasswordBtn.querySelector('.eye-closed');

      if (isPassword) {
        openIcon.classList.add('hidden');
        closedIcon.classList.remove('hidden');
        togglePasswordBtn.setAttribute('aria-label', 'Hide password');
      } else {
        openIcon.classList.remove('hidden');
        closedIcon.classList.add('hidden');
        togglePasswordBtn.setAttribute('aria-label', 'Show password');
      }
    });
  }

  // --- Validation Helpers ---
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function setFieldError(elementId, errorId, message) {
    const el = document.getElementById(elementId);
    const errorEl = document.getElementById(errorId);
    if (el) el.classList.add('input-error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearAllErrors() {
    document.querySelectorAll('.form-input, .form-select').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.error-message').forEach(err => err.textContent = '');
  }

  // Clear errors dynamically on input or change
  form.querySelectorAll('.form-input, .form-select').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('input-error');
      const err = el.closest('.form-group')?.querySelector('.error-message');
      if (err) err.textContent = '';
    });
    el.addEventListener('change', () => {
      el.classList.remove('input-error');
      const err = el.closest('.form-group')?.querySelector('.error-message');
      if (err) err.textContent = '';
    });
  });

  // --- Handle Form Submission ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();
    clearStatusAlert();

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const phone = phoneInput.value.trim();
    const birthMonth = birthMonthSelect.value;
    const birthDay = birthDaySelect.value;
    const birthYear = birthYearSelect.value;
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let hasError = false;

    if (!firstName) {
      setFieldError('firstName', 'firstNameError', 'Please enter your first name.');
      hasError = true;
    }

    if (!lastName) {
      setFieldError('lastName', 'lastNameError', 'Please enter your last name.');
      hasError = true;
    }

    if (!phone) {
      setFieldError('phoneNumber', 'phoneError', 'Please enter your phone number.');
      hasError = true;
    } else if (!/^[0-9+\s\-()]{7,18}$/.test(phone)) {
      setFieldError('phoneNumber', 'phoneError', 'Please enter a valid phone number.');
      hasError = true;
    }

    if (!birthMonth || !birthDay || !birthYear) {
      setFieldError('birthMonth', 'birthdayError', 'Please complete your birthday (Month, Day, and Year).');
      if (!birthMonth) birthMonthSelect.classList.add('input-error');
      if (!birthDay) birthDaySelect.classList.add('input-error');
      if (!birthYear) birthYearSelect.classList.add('input-error');
      hasError = true;
    }

    if (!email) {
      setFieldError('signupEmail', 'emailError', 'Please enter your email address.');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setFieldError('signupEmail', 'emailError', 'Please enter a valid email address.');
      hasError = true;
    }

    if (!password) {
      setFieldError('signupPassword', 'passwordError', 'Please choose a password.');
      hasError = true;
    } else if (password.length < 8) {
      setFieldError('signupPassword', 'passwordError', 'Password must be at least 8 characters.');
      hasError = true;
    }

    if (hasError) return;

    // Loading State
    setButtonLoading(submitBtn, true);

    try {
      // Simulate account registration
      await new Promise(resolve => setTimeout(resolve, 1000));

      showToast(`Welcome to CLC, ${firstName}! Your account has been created.`, 'success');
      showStatusAlert('Account successfully registered! Redirecting to login...', 'success');

      form.reset();

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1600);
    } catch (err) {
      showStatusAlert('Registration failed. Please try again.', 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });

  // --- Social Logins ---
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.getAttribute('aria-label') || 'Social Login';
      showToast(`Connecting via ${label.replace('Sign up with ', '')}...`, 'success');
    });
  });

  // --- Button Loading State Helper ---
  function setButtonLoading(btn, isLoading) {
    if (!btn) return;
    const btnText = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.spinner');
    btn.disabled = isLoading;
    if (isLoading) {
      if (spinner) spinner.classList.remove('hidden');
      btn.style.opacity = '0.85';
      btn.style.cursor = 'wait';
    } else {
      if (spinner) spinner.classList.add('hidden');
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
    }
  }

  // --- Status Alert Helper ---
  function showStatusAlert(message, type = 'success') {
    statusAlert.textContent = message;
    statusAlert.className = `status-alert alert-${type}`;
  }

  function clearStatusAlert() {
    statusAlert.textContent = '';
    statusAlert.className = 'status-alert';
  }

  // --- Toast Notification Helper ---
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }
});

