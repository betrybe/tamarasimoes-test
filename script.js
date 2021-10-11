const classCart = '.cart__items';
const arrayEmpty = [];

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event) {
  const { target } = event;
  const childens = target.parentNode.children;
  const rest = [...childens];
  rest.forEach((item, index) => {
    if (target === item) {
      target.parentNode.removeChild(target);
      arrayEmpty.splice(index, 1);
      const sum = arrayEmpty.reduce((prev, curr) => prev + curr, 0);
      arrayEmpty.push(sum);
      document.querySelector('.total-price').innerText = sum;
    }
  });
 }

 const apiSku = async (id) => {
  const request = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const resolve = await request.json();
  return resolve;
  };

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cartItem';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//Adicionar ao carrinho com as informações do produto
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', async ({ target }) => {
    const getSku = target.parentNode.firstChild.innerText;
    const returnResolve = await apiSku(getSku);
    arrayEmpty.push(returnResolve.price);
    const ValueTotal = arrayEmpty.reduce((prev, curr) => prev + curr, 0);
    document.querySelector('.total-price').innerText = ValueTotal;
    document.querySelector(classCart).appendChild(createCartItemElement(returnResolve));
    const cartItem = document.querySelector('.cart__items');
    localStorage.setItem('getSku', cartItem.innerHTML);
    });
return section; 
}

// Carregamento do carrinho de compras
const loadStorage = () => {
const getSku = localStorage.getItem('getSku'); 
document.querySelector(classCart).innerHTML = getSku;
};

// Esvaziar carrinho
const clearCart = () => {
  const emptyngCart = document.querySelector('.empty-cart');
  emptyngCart.addEventListener('click', () => {
    document.querySelector('ol.cart__items').innerHTML = '';
    localStorage.removeItem('getSku');
  });
};

// Texto loading durante requisição à API, listagem de produtos
const getApi = async () => {
  const loadText = document.querySelector('.loading');
  loadText.innerText = 'Por favor, aguarde. Carregando...';
const request = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
const resolve = await request.json();
    const resolved = await resolve.results;
    resolved.forEach((item) => {
      const returnValue = createProductItemElement(item);
      const raiseChild = document.querySelector('.items');
      raiseChild.appendChild(returnValue);
    });
    loadText.remove();
  };

  window.onload = function onload() {
  getApi();
  loadStorage();
  clearCart();
  }; 
