const classCart = '.cart__items';

const saveCart = () => {
  const cartList = document.querySelector(classCart).innerHTML;
  localStorage.setItem('cartList', cartList);
};

async function calcTotal() {
  const liCart = document.getElementsByTagName('li');
  let soma = 0;
  for (let index = 0; index < liCart.length; index += 1) {
    const price = parseFloat(liCart[index].innerText.split('$')[1], 10);
    soma += price;
  }
let total = document.querySelector('.intro-total');
if (total !== null) total.parentElement.removeChild(total);
if (soma > 0) {
  const intro = document.createElement('p');
  intro.innerText = 'Preço Total: $';
  intro.className = 'intro-total';
  total = document.createElement('span');
  total.innerText = soma;
  total.className = 'total-price';
  intro.appendChild(total);
  document.querySelector('.cart').appendChild(intro);
  }
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function custElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Remover item do carrinho ao clicar nele
function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
  saveCart();
  calcTotal();
 }

 function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cartItem';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function apiSku(event) {
  const sku = getSkuFromProductItem(event.target.parentElement);
  const product = await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((result) => result.json());
  const cartProduct = { sku, name: product.title, salePrice: product.price };
  const itemCart = createCartItemElement(cartProduct);
  document.querySelector(classCart).appendChild(itemCart);
  saveCart();
  calcTotal();
}

// Criar listagem - adicionar ao carrinho com as informações do produto
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(custElement('span', 'item__sku', sku));
  section.appendChild(custElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = section.appendChild(custElement('button', 'item__add', 'Adicionar ao carrinho!'));
  button.addEventListener('click', apiSku);
  section.appendChild(button);
return section; 
}

// Texto loading durante requisição à API, listagem de produtos
async function loadStorage() {
  const loadText = document.createElement('section');
  loadText.innerText = 'Por favor, aguarde. Carregando...';
  loadText.className = 'loading';
  document.querySelector('.items').appendChild(loadText);
  const request = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((result) => result.json())
    .then((result) => result.results);
  loadText.parentElement.removeChild(loadText);
  request.forEach((computer) => {
    const computerObject = { sku: computer.id, name: computer.title, image: computer.thumbnail };
    document.querySelector('.items').appendChild(createProductItemElement(computerObject));
  });
}

const clearCart = () => {
  document.querySelector(classCart).innerHTML = '';
  calcTotal();
  saveCart();
};

  window.onload = function onload() {
  loadStorage();
  const listCart = document.querySelector(classCart);
    const listContent = localStorage.getItem('cartList');
    if (listContent !== null) listCart.innerHTML = listContent;
    const liCart = document.getElementsByTagName('li');
    for (let index = 0; index < liCart.length; index += 1) {
      liCart[index].addEventListener('click', cartItemClickListener);
    }
  calcTotal();
  saveCart();
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
  }; 