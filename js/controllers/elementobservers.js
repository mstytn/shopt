// jshint ignore: start
class ElementObserver {
  constructor() {
  }

  update(userCart) {
    console.log(userCart.user)
    console.log(userCart.cart)
  }
}


/**
 * This class written for to observe shop errors
 * Error messages come from Shop Class are observed and 
 * displayed as toast notifications on the page.
 * Class takes 3 arguments:
 * element: The element contains toast notification. It is a querystring
 * header: Toast Notification Header (Default 'Toast')
 * notificationDisplayDuration: Number, Notification Display Duration in miliseconds
 * Display style is set by scss with name of toaster class selector.
 * Mustafa Yatağan
  */
class ElementErrorObserver {
  constructor(element, header = 'Toast', notificationDisplayDuration = 5000) {
    this.toaster = document.querySelector(element)
    this.header = header
    this.notificationDisplayDuration = notificationDisplayDuration
  }

  #createToastEelement(title, message) {
    return `
      <div class="toast">
      <div class="toast__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-exclamation-triangle" viewbox="0 0 16 16">
          <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
          <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
        </svg>
      </div>
      <div class="toast__info">
        <h6 class="toast__header">${title}</h6>
        <p class="toast__text">${message}</p>
      </div>
    </div>
    `
  }

  async update(e) {
    this.toaster.insertAdjacentHTML('afterbegin', this.#createToastEelement(this.header, e.message))
    const thistoast = this.toaster.querySelector(':first-child')
    await this.#showToast(thistoast)
    await this.#removeToast(thistoast)
  }

  #showToast(theToast) {
    return new Promise((resolve, reject) => {
      
      setTimeout(
        () => {
          theToast.style.opacity = 1
          resolve()
        },
        100
      )
    })
  }

  #removeToast(theToast) {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          theToast.style.opacity = 0
          setTimeout(() => {
            this.toaster.removeChild(theToast)
            resolve() 
          }, 100)
        },
        this.notificationDisplayDuration
      )
    })
  }
}