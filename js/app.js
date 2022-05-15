// jshint ignore: start
const productor = new Producs(products)
const cartCounter = new ElementObserver('.menu-cart-button > span')
const errorCatcher = new ElementErrorObserver('.toaster', 'SHOPT')
const menuCartPreview = new MenuCartPreview(
  '.cart-preview__product-list', 
  '.gotocart', 
  '.emptycard',
  '.cart-preview__summary p')
const slider = new Slider('.sliders', 10000, showDetails)
const sliderProducts = productor.filterSliderProducts()
if (sliderProducts.success)
  slider.feedSlider(sliderProducts.result)

const pList = new ProductList('.product-list', showDetails)
pList.addToList(products.reverse())

const featured = new Featured('.featured', showDetails)
const featuredProducts = productor.filterFeatured()
if (featuredProducts.success)
  featured.feedFeatured(featuredProducts.result)

const currentUser = new CurrentUser('random-guest')

const userNav = new UsersNav('#user')


const shop = new Shop(debugmode = false)
  
shop.addObserver(cartCounter, menuCartPreview)
    .addErrorObserver(errorCatcher)
    .showDiscalimer(() => {console.log('Legal Metin')})

const sign = new SigForms()

const detailsModal = new DetailsModal()
const cartModal = new CartSummary()

// TEMPORARY:
function showDetails(id) {
  detailsModal.showModal(id)
}

