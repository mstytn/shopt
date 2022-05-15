// jshint esversion: 11
// jshint -W033
// jshint ignore: start
class Slider {
  #sliderElementQuery
  constructor(sliderElementQuery, sliderDuration = 5000, showFunc) {
    this.#sliderElementQuery = sliderElementQuery
    this.slidersElement = document.querySelector(this.#sliderElementQuery)
    this.sliderElements = undefined
    this.sliderCount = this.sliderElements?.length
    this.currentSlider = 0
    this.sliderDuration = sliderDuration
    this.timer = undefined
    this.isPaused = false
    this.#domHook(showFunc)
  }

  #startSliders() {
    this.sliderElements = document.querySelectorAll(this.#sliderElementQuery + ' .slider')
    if (this.sliderElements.length === 1)
      return
    this.timer = setInterval(() => {
      this.currentSlider = (this.currentSlider < this.sliderElements.length - 1) ? this.currentSlider + 1 : 0
      if (!this.isPaused)
      {
        this.sliderElements.forEach(sliderel => {
          const pos = (100 * this.currentSlider) 
          sliderel.style.transform = `translateX(-${pos}%)`
        })
      }
    }, this.sliderDuration)
  }


  #domHook(openDetails) {
    const parent = this.slidersElement
    parent.addEventListener('mouseover', () => {
      this.pause()
    })
    parent.addEventListener('mouseout', () => {
      this.continue()
    })
    parent.addEventListener('click', e => {
      e.stopPropagation()
      const gatheredId = e.target.getAttribute('data-id')
      if (gatheredId)
        openDetails(gatheredId)
    })
  }
  pause() {
    if (!this.isPaused)
      this.isPaused = true
  }

  continue() {
    if (this.isPaused)
      this.isPaused = false
  }

  feedSlider(sliderProducts) {
    sliderProducts.forEach(p => {
      const parent = this.slidersElement
      parent.insertAdjacentHTML('afterbegin', this.#createSlide(p))
    })
    if (this.timer) {
      delete(this.timer)
      this.currentSlider = 0
      this.sliderElements = document.querySelectorAll(this.#sliderElementQuery)
    }
    this.#startSliders()
  }

  #createSlide(sliderProduct) {
    const {id, brand, name, category, images, details} = sliderProduct
    return `
      <div class="slider">
        <div class="slider-content">
          <div class="slider-header">
            <h3>${brand}</h3>
            <h4>${name}</h4>
            <h2>${category}</h2>
            <button data-id="${id}" tabindex="-1">İncele</button>
          </div>
          <img src="images/${images[0]}" alt="${brand} ${name}" tabindex="-1">
          <div class="slider-explain">
          <svg xmlns="http://www.w3.org/2000/svg" fill="gray" width="24" height="24" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16" tabindex="-1">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
        </svg>
            <p>${details}</p>
            </div>
        </div>
      </div>
    `
  }
  // <h5>Açıklama</h5>
}

class Featured {
  constructor(featuredQuery, showFunc) {
    this.featured = document.querySelector(featuredQuery)
    this.showFunc = showFunc
  }

  feedFeatured(featuredProducts) {
    featuredProducts.splice(6, 100)
    featuredProducts.forEach(fp => {
      this.featured.insertAdjacentHTML('beforeend', this.#createFeaturedCard(fp))
    })
    this.#hook(this.showFunc)
  }
  #createFeaturedCard(feturedProduct) {
    const {id, brand, name, category, images, featuredbg} = feturedProduct
    return `
      <div class="featured__card" data-id="${id}" style="background-color: ${featuredbg}">
        <img src="images/${images[0]}" alt="${brand} ${name}">
        <h5>${category}</h5>
        <h3>${brand}</h3>
        <h4>${name}</h4>
      </div>
    `
  }
  #hook(openDetails) {
    this.featured.addEventListener('click', e => {
      let id;
      if (!e.target.classList.contains('featured__card')) {
        id = e.target.parentElement.getAttribute('data-id')
      } else {
        id = e.target.getAttribute('data-id')
      }
      openDetails(id)
    })
  }
}

class ProductList {
  constructor(productListQuery, clickFunc) {
    this.productList = document.querySelector(productListQuery)
    this.#hookClick(clickFunc)
  }

  addToList(products) {
    this.productList.innerHTML = ''
    products.forEach(p => {
      this.productList.insertAdjacentHTML('beforeend', this.#createProduct(p))
    })
  }
  #hookClick(openDetails) {
    this.productList.addEventListener('click', e => {
      e.stopPropagation()
      const id = e.target.getAttribute('data-id')
      if (id) {
        if (e.target.tagName === 'BUTTON') {
          shop.addToCart(id)
          errorCatcher.update({message: 'Ürün Sepetie Eklendi'}, 'info')
        } else {
          openDetails(id)
        }
      } else {
        let parent = e.target
        let id
        while (id === undefined) {
          parent = parent.parentElement
          try {
            id = parent.getAttribute('data-id') 
          }
          catch (e) {
              id = false
          }
        }
        if (id)
          openDetails(id)
      }
    })
  }

  #createProduct(product) {
    const {id, brand, name, images, price, discount} = product
    let discountBadge = ''
    if (discount > 0)
      discountBadge = `
      <div class="discount-badge">
        <p>%${discount} &darr;</p>
      </div>`
    return `
        <div class="product" data-id="${id}">
          <div class="product__image" data-id="${id}">
            ${discountBadge}
            <img src="images/${images[0]}" alt="">
          </div>
          <div class="product__details">
            <div class="product__info">
              <h3>${brand}</h3>
              <p>${name}</p>
              <p class="price">${(price - ((price / 100) * discount)).toFixed(2)}₺</p>
            </div>
            <div class="product__buttons">
              <button class="product__button" data-id="${id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-bag-plus" viewbox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"/>
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
    `
  }

  update(o, scroll = true ) {
    this.addToList(o.activePageObjects)
    if (scroll)
      gsap.to(window, {duration: .2, scrollTo:"#urunler", ease: "power2"});
  }
}

class DetailsModal {
  constructor() {
    this.modal = document.querySelector('#detailsModal')
    this.modalCloseButton = document.querySelector('#detailsModal .close-btn')
    this.detailPageElement = document.querySelector('#detailsModal .product-details')
    this.addToCartButton = document.querySelector('#detailsModal button.btn')
    this.productId = undefined
    this.modalVisible = false
    this.tabDisable = false
    this.#hook()
  }

  tabDisabler = (event) => {
    if (event.key === 'Tab')
      event.preventDefault()
    if (event.key === 'Escape')
      this.hideModal()
  }

  enableInteractions() {
    window.removeEventListener('keyup', this.tabDisabler)
    window.removeEventListener('keydown', this.tabDisabler)
    document.removeEventListener('scroll', this.tabDisabler)
    document.querySelector('body').style.overflow = 'auto'
  }
  disableInteractions() {
    window.addEventListener('keyup', this.tabDisabler)
    window.addEventListener('keydown', this.tabDisabler)
    document.addEventListener('scroll', this.tabDisabler)
    document.querySelector('body').style.overflow = 'hidden'
  }

  showModal(productId) {
    if (!productId)
      return
    this.productId = productId
    if (this.modalVisible)
      return
    this.#feedView()
    setTimeout(() => {
      this.modal.style.opacity = 1
      this.detailPageElement.classList.add('visible')
    }, 50)
    this.modal.style.display = 'flex'
    this.modalVisible = true
    this.detailPageElement.addEventListener('click', this.#imageClicks)
    this.addToCartButton.addEventListener('click', this.#addToCart)
    this.disableInteractions()
  }

  hideModal() {
    this.productId = undefined
    this.detailPageElement.classList.remove('visible')
    this.modal.style.opacity = 0
    this.modalVisible = false
    setTimeout(() => {
      this.modal.style.display = 'none'
    }, 300)
    document.querySelectorAll('#detailsModal .discount-badge').forEach(d => {
      d.remove()
    })
    document.querySelectorAll('#detailsModal .product-details__imagebox-selector').forEach(d => {
      d.remove()
    })
    document.querySelector('#detailsModal .product-details__details__text').innerHTML = ''
    this.detailPageElement.removeEventListener('click', this.#imageClicks)
    this.addToCartButton.removeEventListener('click', this.#addToCart)
    this.enableInteractions()
  }

  #hook() {
    this.modal.addEventListener('click', e => {
      e.stopPropagation()
      if (e.target.id === 'detailsModal')
        this.hideModal()
    })
    this.modalCloseButton.addEventListener('click', () => {this.hideModal()})
  }

  #imageClicks(event) {
    event.stopPropagation()
    if (event.target.id === 'detailsPageAddToCart') 
      return
    if(event.target.getAttribute('data-type') && event.target.getAttribute('data-type') !== 'image-selector' )
      return
    
    const baseImage = document.querySelector('#detailsModal .product-details__imagebox > img:nth-of-type(1)')
    const imageSelectors = document.querySelectorAll('#detailsModal .image-selector')
    try {
      const clickType = event.target.getAttribute('data-type')
      if (clickType === 'image-selector')
      {
        imageSelectors.forEach(element => element.classList.remove('active'))
        event.target.classList.add('active')
        baseImage.src = event.target.src
      }
    } catch (e) {
      return
    }
  }

  #addToCart = (e) => {
    if (this.productId)
    {
      shop.addToCart(this.productId)
      errorCatcher.update({message: 'Ürün Sepetie Eklendi'}, 'info')
      this.hideModal()
    }
    else {
      errorCatcher.update(new ShopError())
    }

  }

  #feedView() {
    if (!this.productId)
      return undefined
    const theProduct = productor.findProductById(this.productId)
    if (!theProduct.success)
      return undefined
    const {category, subcategory, brand, name, exp, details, color, detailedlist, price, discount, images} = theProduct.result
    
    const bread = document.querySelector('.product-details__breadcrumbs > p')
    bread.innerHTML = `SHOPT &gt; ${category}`

    const baseImage = document.querySelector('#detailsModal .product-details__imagebox > img:nth-of-type(1)')
    baseImage.src = `images/${images[0]}`

    let imageSelectors = '<div class="product-details__imagebox-selector">'
    imageSelectors += `<img class="image-selector active" src="images/${images[0]}" alt="" data-type="image-selector">`
    images.forEach((p, i) => {
      if (i > 0)
        imageSelectors += `<img class="image-selector" src="images/${p}" alt="" data-type="image-selector">`
    })
    imageSelectors += '</div>'
    if (images.length > 1)
      baseImage.insertAdjacentHTML('afterend', imageSelectors)
    const colorThemes = document.querySelector('#detailsModal .color-theme')
    colorThemes.innerHTML = ''
    color.forEach(c => colorThemes.innerHTML += `<div class="color" style="background-color: ${c}"></div>`)

    const oPrice = document.querySelector('#detailsModal .original-price')
    const dPrice = document.querySelector('#detailsModal .price-with-discount')
    if (discount > 0)
      oPrice.innerText = price.toFixed(2) + '₺'
    dPrice.innerText = (price - ((price/100)*discount)).toFixed(2) + '₺'

    const detailed = document.querySelector('#detailsModal .product-details__details__text')

    let detailedProd = `
      <h2>${brand}</h2>
      <h3>${name}</h3>
      <h4>${subcategory}</h4>
      <p>${details}</p>
      <h5>Özellikler</h5>
      <ul>
    `
    detailedlist.forEach(d => {
      detailedProd += `<li>${d}</li>`
    })
    detailedProd += `</ul>`

    detailed.insertAdjacentHTML('afterbegin', detailedProd)

    const discountBadge = (discount > 0) ? `
    <div class="discount-badge">
      %${discount}&darr;
      <span>indirim</span>
    </div>`: ''
    this.detailPageElement.insertAdjacentHTML('afterbegin', discountBadge)
  }
}

class CartSummary {
  constructor() {
    this.modal = document.querySelector('#cartModal')
    this.modalCloseButton = document.querySelector('#cartModal .close-btn')
    this.cartPageElement = document.querySelector('#cartModal .cart')
    this.removeFromCartButtons = document.querySelectorAll('.remove-product')
    this.cLister = document.querySelector('#cLister')
    this.modalVisible = false
    this.#hook()
  }

  tabDisabler = (event) => {
    if (event.key === 'Tab')
      event.preventDefault()
    if (event.key === 'Escape')
      this.hideModal()
  }

  enableInteractions() {
    window.removeEventListener('keyup', this.tabDisabler)
    window.removeEventListener('keydown', this.tabDisabler)
    document.removeEventListener('scroll', this.tabDisabler)
    document.querySelector('body').style.overflow = 'auto'
  }
  disableInteractions() {
    window.addEventListener('keyup', this.tabDisabler)
    window.addEventListener('keydown', this.tabDisabler)
    document.addEventListener('scroll', this.tabDisabler)
    document.querySelector('body').style.overflow = 'hidden'
  }

  showModal() {
    if (this.modalVisible)
      return
    setTimeout(() => {
      this.modal.style.opacity = 1
      this.cartPageElement.classList.add('visible')
      this.modalVisible = true
    }, 50)
    this.modal.style.display = 'flex'
    this.modalVisible = true
    this.disableInteractions()
    this.cLister.addEventListener('click', this.#removeProduct)
  }
  #removeProduct = (e) => {
    if (e.target.tagName !== 'BUTTON')
      return
    const itemId = e.target.getAttribute('data-id')
    if (itemId) {
      const res = shop.removeFromCart(itemId)
      if (!res)
        errorCatcher.update(new ShopError())
      else
        errorCatcher.update(new ShopError('Ürün Sepetinizden Silindi'), 'info')
    }
  }

  hideModal() {
    if (!this.modalVisible)
      return
    this.cartPageElement.classList.remove('visible')
    this.modal.style.opacity = 0
    this.modalVisible = false
    setTimeout(() => {
      this.modal.style.display = 'none'
      this.modalVisible = false
    }, 300)
    this.enableInteractions()
  }

  #hook() {
    this.modal.addEventListener('click', e => {
      e.stopPropagation()
      if (e.target.id === 'cartModal')
        this.hideModal()
    })
    this.modalCloseButton.addEventListener('click', () => {this.hideModal()})
  }

  updateCartList(uniqueCartList) {
    const lister = document.querySelector('#cLister')
    lister.innerHTML = ''
    const cartCount = document.querySelector('#cartModal p.cart__pricer__info > span')
    const cartPrice = document.querySelector('#cartModal p.cart__pricer__price > strong')
    const cartDiscount = document.querySelector('#cartModal p.cart__pricer__discount > strong')
    const cartTotal = document.querySelector('#cartModal p.cart__pricer__total > strong')
    lister.insertAdjacentHTML('afterbegin', this.#getLiterItems(uniqueCartList))
    const {price, discount, total, count } = this.#getCartTotals(uniqueCartList)
    cartCount.innerText = count
    cartPrice.innerText = price.toFixed(2) +  '₺'
    cartDiscount.innerText = '-' + discount.toFixed(2) + '₺'
    cartTotal.innerText = total.toFixed(2) + '₺'
  }

  #getCartTotals(uniqueCartList) {
    const cartObj = {
      price: 0,
      discount: 0,
      total: 0,
      count: 0
    }
    for (let item of uniqueCartList) {
      const p = productor.findProductById(item.id)
      if (p.success) {
        cartObj.count += item.quantity
        cartObj.price += p.result.price * item.quantity
        cartObj.discount += ((p.result.price / 100) * p.result.discount)
      }
      
    }
    cartObj.total = cartObj.price - cartObj.discount 
    return cartObj
  }

  #getLiterItems(uniqueCartList) {
    let items = ''
    for (let item of uniqueCartList) {
      const p = productor.findProductById(item.id)
      if (p.success) {
        const i = p.result
        const discounter = (i.discount > 0) ? `<span><strong>%${i.discount} &darr;</strong></span>`: ''
        items += `
        <div class="cart__lister__product">
          <div class="cart__lister__product-info">
            <img src="images/${i.images[0]}" alt="">
            <div class="cart__lister__product__text">
              <p>${i.brand}</p>
              <p>${i.name}</p>
            </div>
          </div>
          <div class="cart__lister__product-price">

            <div class="cart__lister__product__price">${discounter} ${i.price.toFixed(2)}₺
            </div>
            <div class="cart__lister__product__count">
            x${item.quantity}
            </div>
            <div class="class__lister__product__remove">
              <button class="remove-product" data-id="${i.id}" title="Bu üründen 1 adet sepetten kaldır">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bag-dash" viewbox="0 0 16 16">
                  <path fill-rule="evenodd" d="M5.5 10a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        `
      }
    }
    return items
  }
}

class SigForms {
  constructor() {
    this.signinpage = document.querySelector('div.sign-in')
    this.signuppage = document.querySelector('div.sign-up')
    this.gotoSigninLink = document.querySelector('#gotosignin')
    this.signInInput = document.querySelector('div.sign-in input')
    this.signUpInput = document.querySelector('div.sign-up input')
    this.gotoSignupLink = document.querySelector('#gotosignup')
    this.signInButton = document.querySelector('#signin')
    this.signUpButton = document.querySelector('#signup')
    this.modalCloseButtons = document.querySelectorAll('.modal-close')
    this.modal = document.querySelector('.sign-modal')
    this.modalVisible = false
    this.tabDisable = false
    this.#hook()
  }

  showSignIn() {
    this.signinpage.classList.remove('transit-in')
    this.signuppage.classList.remove('transit-up')
  }

  showSignUp() {
    this.signinpage.classList.add('transit-in')
    this.signuppage.classList.add('transit-up')
  }

  #hook() {
    this.gotoSigninLink.addEventListener('click', e => {
      e.preventDefault()
      this.showSignIn()
      this.#clearInputs()
    })
    this.gotoSignupLink.addEventListener('click', e => {
      e.preventDefault()
      this.showSignUp()
      this.#clearInputs()
    })
    this.signInButton.addEventListener('click', e => {
        const result = currentUser.switchUser(this.signInInput.value)
        if (!result.success)
          if (result.code != -2)
            errorCatcher.update(new ShopError(result.message))
          else {
            errorCatcher.update(new ShopError(result.message))
            this.showSignUp()
          }
        else {
          const res = shop.changeUser(result.message)
          errorCatcher.update({message: 'sayın ' + result.message + ' hesabınıza giriş yaptınız.'}, 'info')
          if (res)
            this.hideModal()
        }
    })
    
    this.signUpButton.addEventListener('click', e => {
      const inputVal = this.signUpInput.value
      const result = currentUser.createUser(inputVal)
      if (!result.success)
        if (result.code != -2)
          errorCatcher.update(new ShopError(result.message))
        else 
          errorCatcher.update(new ShopError(result.message), 'warning')
      else {
        this.hideModal()
        errorCatcher.update({message: 'sayın ' + result.message + 'hesabınız oluşturuldu ve giriş yapıldı'}, 'info')
      }
  })
    this.modalCloseButtons.forEach(b => {
      b.addEventListener('click', e => {
        this.hideModal()
      })
    })
    this.modal.addEventListener('click', e => {
      e.stopPropagation()
      if (e.target.id === 'signModal')
        this.hideModal()
    })
  }

  showModal() {
    if (!this.modalVisible) {
      setTimeout(() => {
        this.modal.style.opacity = 1
      }, 50)
      this.modal.style.display = 'flex'
      this.modalVisible = true
      window.addEventListener('keyup', this.disableTab)
      window.addEventListener('keydown', this.disableTab)
      document.querySelector('body').style.overflow = 'hidden'
    }
  }

  disableTab = (event) => {
    if (event.key === 'Tab')
      event.preventDefault()
    if (event.key === 'Escape')
      this.hideModal()
  }

  hideModal() {
    if (this.modalVisible) {
      setTimeout(() => {
        this.modal.style.display = 'none'
      }, 300)
      this.modal.style.opacity = 0
      this.modalVisible = false
      window.removeEventListener('keyup', this.disableTab)
      window.removeEventListener('keydown', this.disableTab)
      document.removeEventListener('scroll', this.disableScroll)
      document.querySelector('body').style.overflow = 'auto'
    }
    this.#clearInputs()
  }

  #clearInputs() {
    this.signInInput.value = ''
    this.signUpInput.value = ''
  }
}


class UsersNav {
  constructor(usersNavButtonQuery) {
    this.usersNavButton = document.querySelector(usersNavButtonQuery)
    this.#hook()
  }

  #hook() {
    this.usersNavButton.addEventListener('click', e => {
      e.preventDefault()
      if (currentUser.isUserAnonymous()) {
        sign.showSignIn()
        sign.showModal()
      } else {
        errorCatcher.update({message: `${shop.getCurrentUserName()} Oturumundan Çıkış Yapıldı`}, 'info')
        shop.logoutUser()
      }
    })
  }

  updateButton(cart) {
    if (currentUser.isUserAnonymous()) {
      this.usersNavButton.innerHTML = 'üye ol / giriş yap'
      this.usersNavButton.title = 'Giriş yap ya da Üye Ol'
    }
    else
    {
      this.usersNavButton.innerHTML = `Merhaba ${shop.getCurrentUserName()} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
      <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
      </svg>`
      this.usersNavButton.title = "Çıkış Yap"
    }
  }
}

class ListPaginator {
  constructor(pageList) {
    this.pageList = pageList
    this.paginatorElement = document.querySelector('#paginator')
    this.paginatorElement.addEventListener('click', this.#btnClick)
    this.#createButtons()
  }

  #createButtons() {
    if (this.pageList === 1)
      return false
    this.paginatorElement.innerHTML = ''
    const prevDisabled = (this.pageList.currentPage === 1) ? ' disabled' : ''
    const nextDisabled = (this.pageList.currentPage === this.pageList.totalPage) ? ' disabled' : ''
    let buttons = `<button class="paginator-button" id="prev"${prevDisabled}>&laquo;</button>`
    for (let index = 1; index <= this.pageList.totalPage; index++) {
      const ad = (index === this.pageList.currentPage) ? {a: ' active', d: ' disabled'} : {a: '', d: ''}
      buttons += `<button class="paginator-button${ad.a}" data-page="${index}"${ad.d}>${index}</button>`
    }
    buttons += `<button class="paginator-button" id="next"${nextDisabled}>&raquo;</button>`
    this.paginatorElement.insertAdjacentHTML('beforeend', buttons)
    return true
  }

  #btnClick = (event) => {
    if (event.target.tagName !== 'BUTTON')
      return
    switch (event.target.id) {
      case 'next':
        this.pageList.next()
        break
      case 'prev':
        this.pageList.prev()
        break
      default:
        const dPage = +event.target.getAttribute('data-page')
        const test = this.pageList.page(dPage)
        break
    } 
  }

  update(o) {
    this.#createButtons()
  }
}