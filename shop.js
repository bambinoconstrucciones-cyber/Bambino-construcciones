const products = [
  {
    id: 'taladro-percutor',
    name: 'Taladro Percutor 850W',
    tags: ['Herramientas'],
    price: 12999,
    image: 'images/herramienta-taladro.svg',
    short: 'Potencia para obra y mantenimiento',
    description: 'Taladro percutor de 850W con 2 velocidades, mandril de 13 mm y diseño ergonómico ideal para perforar concreto, madera y metal.',
    features: ['850W de potencia', '2 velocidades', 'Mandril de 13 mm']
  },
  {
    id: 'serrucho-manual',
    name: 'Serrucho Manual Profesional',
    tags: ['Herramientas'],
    price: 8499,
    image: 'images/herramienta-serrucho.svg',
    short: 'Corte limpio y preciso',
    description: 'Serrucho para trabajos de carpintería con hoja de acero templado y mango ergonómico para un agarre seguro.',
    features: ['Hoja de acero templado', 'Mango ergonómico', 'Ideal para madera']
  },
  {
    id: 'llave-combinada',
    name: 'Llave Combinada 24 mm',
    tags: ['Herramientas'],
    price: 5699,
    image: 'images/herramienta-llave.svg',
    short: 'Herramienta esencial para ajustes',
    description: 'Llave de acero endurecido con acabado resistente, pensada para ajustes rápidos en tareas de obra y mantenimiento.',
    features: ['Acero endurecido', 'Diseño ergonómico', 'Uso versátil']
  },
  {
    id: 'cinta-metrica',
    name: 'Cinta Métrica 5 m',
    tags: ['Herramientas'],
    price: 3899,
    image: 'images/herramienta-cinta.svg',
    short: 'Medición práctica y confiable',
    description: 'Cinta métrica de 5 metros con sistema de bloqueo y carcasa resistente para mediciones rápidas en obra y hogar.',
    features: ['5 metros de longitud', 'Bloqueo seguro', 'Carcasa resistente']
  },
  {
    id: 'plano-vivienda-60m2',
    name: 'Plano base de vivienda 60 m²',
    tags: ['Planos'],
    price: 35000,
    image: 'images/plano-vivienda.svg',
    short: 'Propuesta inicial para una vivienda compacta',
    description: 'Plano de referencia para una vivienda compacta con dos dormitorios, baño, cocina y estar-comedor. Requiere adaptación al terreno y revisión profesional antes de construir.',
    features: ['Distribución de 60 m²', 'Dos dormitorios', 'Diseño adaptable al terreno']
  },
  {
    id: 'mueble-bajo-mesada',
    name: 'Mueble bajo mesada',
    tags: ['Muebles'],
    price: 85000,
    image: 'images/galeria/Carpinteria/Muebe final.JPG',
    short: 'Mueble de carpintería para cocina',
    description: 'Mueble bajo mesada de referencia para cocina. Consultá medidas, materiales, terminaciones y disponibilidad antes de realizar el pedido.',
    features: ['Fabricación a medida', 'Terminación a consultar', 'Instalación a coordinar']
  }
];

const productsGrid = document.getElementById('productsGrid');
const categoryFilter = document.getElementById('categoryFilter');
const priceSort = document.getElementById('priceSort');
const cartItems = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartCount = document.getElementById('cartCount');
const checkoutButton = document.getElementById('checkoutButton');
const productModal = document.getElementById('productModal');
const closeModalButton = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDescription = document.getElementById('modalDescription');
const modalFeatures = document.getElementById('modalFeatures');
const modalQuantity = document.getElementById('modalQuantity');
const addToCartButton = document.getElementById('addToCartButton');

let cart = [];
let selectedProductId = null;

function formatCurrency(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(value);
}

function renderProducts() {
  productsGrid.innerHTML = '';
  const selectedCategory = categoryFilter.value;
  const visibleProducts = products
    .filter((product) => selectedCategory === 'all' || product.tags.includes(selectedCategory))
    .sort((first, second) => priceSort.value === 'price-asc' ? first.price - second.price : 0);

  if (visibleProducts.length === 0) {
    productsGrid.innerHTML = '<p class="empty-state">No hay productos en esta categoría.</p>';
    return;
  }

  visibleProducts.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-card__body">
        <p class="product-card__eyebrow">${product.tags.join(' · ')}</p>
        <h4>${product.name}</h4>
        <p>${product.short}</p>
        <div class="product-card__footer">
          <strong>${formatCurrency(product.price)}</strong>
          <div class="product-card__actions">
            <button class="button button--secondary" data-action="detail" data-id="${product.id}">Ver producto</button>
            <button class="button button--primary" data-action="add" data-id="${product.id}">Agregar</button>
          </div>
        </div>
      </div>
    `;

    card.querySelector('[data-action="detail"]').addEventListener('click', () => openModal(product.id));
    card.querySelector('[data-action="add"]').addEventListener('click', () => addToCart(product.id, 1));

    productsGrid.appendChild(card);
  });
}

categoryFilter.addEventListener('change', renderProducts);
priceSort.addEventListener('change', renderProducts);

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-state">Tu carrito está vacío. Agregá herramientas para comenzar.</p>';
    cartSubtotal.textContent = formatCurrency(0);
    cartCount.textContent = '0';
    return;
  }

  cartItems.innerHTML = '';
  let subtotal = 0;

  cart.forEach((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) return;

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    const row = document.createElement('div');
    row.className = 'cart-item';

    row.innerHTML = `
      <div>
        <h4>${product.name}</h4>
        <p>${formatCurrency(product.price)} c/u</p>
      </div>
      <div class="cart-item__actions">
        <div class="quantity-pill">
          <button data-action="decrease" data-id="${product.id}">−</button>
          <span>${item.quantity}</span>
          <button data-action="increase" data-id="${product.id}">+</button>
        </div>
        <strong>${formatCurrency(itemTotal)}</strong>
        <button class="cart-item__remove" data-action="remove" data-id="${product.id}">Eliminar</button>
      </div>
    `;

    row.querySelector('[data-action="decrease"]').addEventListener('click', () => updateQuantity(product.id, -1));
    row.querySelector('[data-action="increase"]').addEventListener('click', () => updateQuantity(product.id, 1));
    row.querySelector('[data-action="remove"]').addEventListener('click', () => removeFromCart(product.id));

    cartItems.appendChild(row);
  });

  cartSubtotal.textContent = formatCurrency(subtotal);
  cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0).toString();
}

function addToCart(productId, quantity = 1) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }

  renderCart();
  if (productModal.hidden === false) {
    productModal.hidden = true;
  }
}

function updateQuantity(productId, change) {
  const existingItem = cart.find((item) => item.id === productId);
  if (!existingItem) return;

  existingItem.quantity += change;

  if (existingItem.quantity <= 0) {
    cart = cart.filter((item) => item.id !== productId);
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
}

function openModal(productId) {
  const product = products.find((entry) => entry.id === productId);
  if (!product) return;

  selectedProductId = product.id;
  modalImage.src = product.image;
  modalImage.alt = product.name;
  modalTitle.textContent = product.name;
  modalPrice.textContent = formatCurrency(product.price);
  modalDescription.textContent = product.description;
  modalFeatures.innerHTML = '';
  product.features.forEach((feature) => {
    const item = document.createElement('li');
    item.textContent = feature;
    modalFeatures.appendChild(item);
  });
  modalQuantity.value = '1';
  productModal.hidden = false;
}

function closeModal() {
  productModal.hidden = true;
  selectedProductId = null;
}

addToCartButton.addEventListener('click', () => {
  if (!selectedProductId) return;
  addToCart(selectedProductId, Number(modalQuantity.value) || 1);
});

closeModalButton.addEventListener('click', closeModal);
productModal.addEventListener('click', (event) => {
  if (event.target === productModal) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && productModal.hidden === false) {
    closeModal();
  }
});

checkoutButton.addEventListener('click', () => {
  if (cart.length === 0) {
    window.alert('Agregá al menos un producto para finalizar la compra.');
    return;
  }

  const lines = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) return '';
    const subtotal = product.price * item.quantity;
    return `- ${product.name} x${item.quantity}: ${formatCurrency(subtotal)}`;
  }).filter(Boolean);

  const total = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const message = encodeURIComponent(
    `Hola, quiero finalizar este pedido de Bambino Construcciones:\n\n${lines.join('\n')}\n\nTotal: ${formatCurrency(total)}\n\nGracias.`
  );

  window.open(`https://wa.me/542281323926?text=${message}`, '_blank', 'noopener');
});

renderProducts();
renderCart();
