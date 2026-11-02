// Shared JavaScript for the multi-page clinic website.
(() => {
  const menuButton = document.querySelector('.menu');
  const nav = document.getElementById('nav');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation menu');
      });
    });
  }

  // Highlight the current page in the shared navigation.
  const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const currentPage = currentFile === 'index.html' || currentFile === 'clinic.html'
    ? 'home'
    : currentFile.replace(/\.html$/, '').replace(/^appointment$/, 'appointment');
  document.querySelectorAll('.nav-link').forEach(link => {
    const active = link.dataset.page === currentPage;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  // Live clinic status is only shown on the Home page.
  function updateClinicStatus() {
    const statusText = document.getElementById('statusText');
    const badge = document.getElementById('clinicStatus');
    if (!statusText || !badge) return;

    const now = new Date();
    const day = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();
    let message = '';
    let isOpen = false;

    if (day === 0) {
      message = 'By appointment';
    } else if (minutes >= 540 && minutes < 870) {
      message = 'Open now · Closes at 2:30 pm'; isOpen = true;
    } else if (minutes >= 870 && minutes < 960) {
      message = 'Closed now · Opens at 4:00 pm';
    } else if (minutes >= 960 && minutes < 1230) {
      message = 'Open now · Closes at 8:30 pm'; isOpen = true;
    } else if (minutes < 540) {
      message = 'Closed now · Opens at 9:00 am';
    } else {
      message = 'Closed now · Opens tomorrow at 9:00 am';
    }

    statusText.textContent = message;
    badge.classList.toggle('open', isOpen);
    badge.classList.toggle('closed', !isOpen);
  }
  updateClinicStatus();
  if (document.getElementById('clinicStatus')) window.setInterval(updateClinicStatus, 60000);

  // Demo-only form behavior: this displays a message but does not send or book an appointment.
  const form = document.getElementById('appointmentForm');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const phone = document.getElementById('phone');
      if (!phone || !phone.value.trim()) return;
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = 'Thank you. The clinic can contact you to confirm the appointment.';
        toast.classList.add('show');
        window.setTimeout(() => toast.classList.remove('show'), 4200);
      }
      form.reset();
    });
  }
})();
