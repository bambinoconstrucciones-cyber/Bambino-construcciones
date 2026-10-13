const loader = document.getElementById('loader');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const closeModalButton = document.getElementById('closeModal');
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

const initialImages = [
  { src: 'assets/obra-1.svg', alt: 'Obra residencial en proceso' },
  { src: 'assets/obra-2.svg', alt: 'Remodelación de fachada' },
  { src: 'assets/obra-3.svg', alt: 'Proyecto comercial' },
  { src: 'assets/obra-4.svg', alt: 'Espacio terminado' }
];

const images = [...initialImages];

function renderGallery() {
  gallery.innerHTML = '';

  images.forEach((image) => {
    const item = document.createElement('article');
    item.className = 'gallery__item';

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.loading = 'lazy';
    img.addEventListener('click', () => openModal(image.src, image.alt));

    const caption = document.createElement('div');
    caption.className = 'gallery__caption';
    caption.textContent = image.alt;

    item.appendChild(img);
    item.appendChild(caption);
    gallery.appendChild(item);
  });
}

function openModal(src, alt) {
  modalImage.src = src;
  modalImage.alt = alt;
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
  modalImage.removeAttribute('src');
}

closeModalButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menú');
    });
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
    if (siteNav?.classList.contains('is-open')) {
      siteNav.classList.remove('is-open');
      navToggle?.classList.remove('is-active');
      navToggle?.setAttribute('aria-expanded', 'false');
      navToggle?.setAttribute('aria-label', 'Abrir menú');
    }
  }
});

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('is-hidden');
    setTimeout(() => loader.remove(), 700);
  }, 1400);
});

renderGallery();
