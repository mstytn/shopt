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
      // TODO
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
      //TODO 
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
      // alert(e.target.getAttribute('data-id'))
      // console.dir()
      const id = e.target.getAttribute('data-id')
      if (id) {
        if (e.target.tagName === 'BUTTON') {
          shop.addToCart(id)
        } else {
          openDetails(id)
        }
      } else {
        let parent = e.target
        let id
        while (!id) {
          parent = parent.parentElement
          id = parent.getAttribute('data-id')
        }
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
}

class SigForms {
  constructor() {
    this.signinpage = document.querySelector('div.sign-in')
    this.signuppage = document.querySelector('div.sign-up')
    this.gotoSigninLink = document.querySelector('#gotosignin')
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
    console.log('signin')
  }

  showSignUp() {
    console.log('signup')
  }

  #hook() {
    this.gotoSigninLink.addEventListener('click', e => {
      e.preventDefault()
      this.signinpage.classList.remove('transit-in')
      this.signuppage.classList.remove('transit-up')
    })
    this.gotoSignupLink.addEventListener('click', e => {
      e.preventDefault()
      this.signinpage.classList.add('transit-in')
      this.signuppage.classList.add('transit-up')
    })
    this.signInButton.addEventListener('click', e => {
      alert('sining in')
    })
    this.signUpButton.addEventListener('click', e => {
      alert('sining up')
    })
    this.modalCloseButtons.forEach(b => {
      b.addEventListener('click', e => {
        this.hideModal()
      })
    })
    this.modal.addEventListener('click', e => {
      console.log()
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
    }
  }
}
