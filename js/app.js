// jshint ignore: start
const cartCounter = new ElementObserver('.menu-cart-button > span')
const errorCatcher = new ElementErrorObserver('.toaster', 'SHOPT')
const menuCartPreview = new MenuCartPreview(
  '.cart-preview__product-list', 
  '.gotocart', 
  '.emptycard',
  '.cart-preview__summary p')
const slider = new Slider('.sliders', 10000, showDetails)
slider.feedSlider(products)

const pList = new ProductList('.product-list', showDetails)
pList.addToList(products)

const featured = new Featured('.featured', showDetails)
featured.feedFeatured(products)

const shop = new Shop(debugmode = false)
  
shop.addObserver(cartCounter, menuCartPreview)
    .addErrorObserver(errorCatcher)
    .showDiscalimer(() => {console.log('Legal Metin')})

const sign = new SigForms()



// TEMPORARY:
function showDetails(id) {
  console.log(id, 'sayfası açılıyor...')
}