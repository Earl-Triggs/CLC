/**
 * CLC Fragrances &mdash; Authentication Page Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const authTitle = document.getElementById('authTitle');
  const authSubtitle = document.getElementById('authSubtitle');
  
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const showSignupBtn = document.getElementById('showSignupBtn');
  const showLoginBtn = document.getElementById('showLoginBtn');
  
  const loginEmailInput = document.getElementById('loginEmail');
  const loginPasswordInput = document.getElementById('loginPassword');
  const rememberMeCheckbox = document.getElementById('rememberMe');
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');
  
  const toggleLoginPassword = document.getElementById('toggleLoginPassword');
  const toggleSignupPassword = document.getElementById('toggleSignupPassword');
  const signupPasswordInput = document.getElementById('signupPassword');
  
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  const forgotModal = document.getElementById('forgotModal');
  const closeForgotModal = document.getElementById('closeForgotModal');
  const forgotForm = document.getElementById('forgotForm');
  const resetEmailInput = document.getElementById('resetEmail');
  
  const statusAlert = document.getElementById('statusAlert');
  const toastContainer = document.getElementById('toastContainer');

  // Load remembered email if present
  const savedEmail = localStorage.getItem('clc_remembered_email');
  if (savedEmail) {
    loginEmailInput.value = savedEmail;
    rememberMeCheckbox.checked = true;
  }

  // --- Toggle Password Visibility ---
  function setupPasswordToggle(btn, input) {
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      
      const openIcon = btn.querySelector('.eye-open');
      const closedIcon = btn.querySelector('.eye-closed');
      
      if (isPassword) {
        openIcon.classList.add('hidden');
        closedIcon.classList.remove('hidden');
        btn.setAttribute('aria-label', 'Hide password');
      } else {
        openIcon.classList.remove('hidden');
        closedIcon.classList.add('hidden');
        btn.setAttribute('aria-label', 'Show password');
      }
    });
  }

  setupPasswordToggle(toggleLoginPassword, loginPasswordInput);
  setupPasswordToggle(toggleSignupPassword, signupPasswordInput);

  // --- Switch Between Login and Sign Up ---
  if (showSignupBtn) {
    showSignupBtn.addEventListener('click', (e) => {
      window.location.href = 'signup.html';
    });
  }

  showLoginBtn.addEventListener('click', () => {
    switchMode('login');
  });

  function switchMode(mode) {
    clearErrors();
    clearStatusAlert();
    
    if (mode === 'signup') {
      loginForm.classList.add('hidden');
      signupForm.classList.remove('hidden');
      authTitle.textContent = 'Create an Account';
      authSubtitle.textContent = 'Join CLC for exclusive releases & bespoke scents';
      const firstInput = signupForm.querySelector('input');
      if (firstInput) firstInput.focus();
    } else {
      signupForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      authTitle.textContent = 'Welcome to CLC';
      authSubtitle.textContent = 'Where luxury lingers in every spray';
      loginEmailInput.focus();
    }
  }

  // --- Input Validation Helpers ---
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function setFieldError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (input) input.classList.add('input-error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearFieldError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (input) input.classList.remove('input-error');
    if (errorEl) errorEl.textContent = '';
  }

  function clearErrors() {
    document.querySelectorAll('.form-input').forEach(input => input.classList.remove('input-error'));
    document.querySelectorAll('.error-message').forEach(err => err.textContent = '');
  }

  // Clear error on input typing
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('input-error');
      const err = input.closest('.form-group')?.querySelector('.error-message');
      if (err) err.textContent = '';
    });
  });

  // --- Handle Login Submission ---
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    clearStatusAlert();

    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value;
    let hasError = false;

    if (!email) {
      setFieldError('loginEmail', 'loginEmailError', 'Please enter your email address.');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setFieldError('loginEmail', 'loginEmailError', 'Please enter a valid email address.');
      hasError = true;
    }

    if (!password) {
      setFieldError('loginPassword', 'loginPasswordError', 'Please enter your password.');
      hasError = true;
    }

    if (hasError) return;

    // Handle "Remember Me"
    if (rememberMeCheckbox.checked) {
      localStorage.setItem('clc_remembered_email', email);
    } else {
      localStorage.removeItem('clc_remembered_email');
    }

    // Set Loading State
    setButtonLoading(loginSubmitBtn, true);

    try {
      // Simulate authentication request
      await new Promise(resolve => setTimeout(resolve, 900));

      showToast('Welcome back! You have successfully logged in.', 'success');
      showStatusAlert('Login successful. Redirecting to your CLC collection...', 'success');

      // Clear password field
      loginPasswordInput.value = '';
    } catch (err) {
      showStatusAlert('Authentication failed. Please check your credentials.', 'error');
    } finally {
      setButtonLoading(loginSubmitBtn, false);
    }
  });

  // --- Handle Sign Up Submission ---
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    clearStatusAlert();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = signupPasswordInput.value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    let hasError = false;

    if (!name) {
      setFieldError('signupName', 'signupNameError', 'Please enter your full name.');
      hasError = true;
    }

    if (!email) {
      setFieldError('signupEmail', 'signupEmailError', 'Please enter your email address.');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setFieldError('signupEmail', 'signupEmailError', 'Please enter a valid email address.');
      hasError = true;
    }

    if (!password) {
      setFieldError('signupPassword', 'signupPasswordError', 'Please choose a password.');
      hasError = true;
    } else if (password.length < 8) {
      setFieldError('signupPassword', 'signupPasswordError', 'Password must be at least 8 characters long.');
      hasError = true;
    }

    if (!agreeTerms) {
      showToast('Please agree to the Terms & Privacy policy to continue.', 'error');
      hasError = true;
    }

    if (hasError) return;

    const signupSubmitBtn = document.getElementById('signupSubmitBtn');
    setButtonLoading(signupSubmitBtn, true);

    try {
      await new Promise(resolve => setTimeout(resolve, 900));
      showToast(`Welcome to CLC, ${name}! Your account was created.`, 'success');
      showStatusAlert('Account created successfully! Switching to login...', 'success');
      signupForm.reset();
      setTimeout(() => {
        switchMode('login');
        loginEmailInput.value = email;
      }, 1400);
    } catch (err) {
      showStatusAlert('Registration encountered an error. Please try again.', 'error');
    } finally {
      setButtonLoading(signupSubmitBtn, false);
    }
  });

  // --- Forgot Password Modal ---
  forgotPasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    forgotModal.classList.remove('hidden');
    resetEmailInput.value = loginEmailInput.value || '';
    resetEmailInput.focus();
  });

  closeForgotModal.addEventListener('click', () => {
    forgotModal.classList.add('hidden');
    clearFieldError('resetEmail', 'resetEmailError');
  });

  forgotModal.addEventListener('click', (e) => {
    if (e.target === forgotModal) {
      forgotModal.classList.add('hidden');
      clearFieldError('resetEmail', 'resetEmailError');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !forgotModal.classList.contains('hidden')) {
      forgotModal.classList.add('hidden');
      clearFieldError('resetEmail', 'resetEmailError');
    }
  });

  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = resetEmailInput.value.trim();
    if (!email) {
      setFieldError('resetEmail', 'resetEmailError', 'Please enter your email.');
      return;
    }
    if (!isValidEmail(email)) {
      setFieldError('resetEmail', 'resetEmailError', 'Please enter a valid email.');
      return;
    }

    forgotModal.classList.add('hidden');
    showToast(`Password reset link sent to ${email}`, 'success');
    showStatusAlert(`We've sent a password reset link to ${email}.`, 'success');
    forgotForm.reset();
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

