// ========================================
// Storytelling Retreat — Script
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Retreats modal
  const modal = document.getElementById('comingSoonModal');
  const retreatsLinks = document.querySelectorAll('.retreats-link');
  const modalClose = modal ? modal.querySelector('.modal-close') : null;

  retreatsLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('active');
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
    });
  }

});
