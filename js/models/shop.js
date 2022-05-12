// jshint ignore: start
/**
 * STATEMENT:
 * This script was written by Mustafa Yatagan as a presentation for ISMEK 
 * This script uses browser localstorage. In order to run,
 * security settings of the client browser must allow javascript.
 * Browser with javascript disabled will break the script chain.
 * Other scripts like app.js, elementobserver.js are strictly tied to
 * this script. (see PREREQUISITES)
 * 
 * ERROR CATCHING:
 * This script has a limited capability of error catching due to its nature
 * of being client side script. 
 * 
 * SECURITY:
 * There is no secure way to implement this script to productions or 
 * real world applications. This script helps front-end prensentation to run 
 * without an active(back-end) server. 
 * 
 * PREREQUISITES:
 * A modern, updated browser with ECMAScript 12 
 *  (due to private fields of the Shop Class)
 * Default browser security settings that allow client side javascript to run
 * 
 * EXTRA:
 * Error messages are in Turkish. Because it's a helper class for Turkish Web 
 * site (*fictional* shopping page called shopingo, for electronics).
 */

class ShopError extends Error {
  constructor(message) {
    super(message)
  }
}
class Shop {
  userCarts
  #settingsname
  #guestname
  constructor(debugmode = false) {
    this.#settingsname = 'shopingo'
    this.#guestname = 'random-guest'
    this.observers = []
    this.errorObservers = []
    this.debugmode = debugmode
    const ls = localStorage.getItem(this.#settingsname)
    this.userCarts = {
      lastLoggedInUser: 0, 
      showInfo: true,
      carts: [
        {user: this.#guestname, cart: []}
      ]}
    if (ls)
    {
      try {
        if (!this.debugmode) {
          const shop = JSON.parse(decodeURIComponent(atob(ls)))
        }
        this.userCarts = (this.debugmode) ? JSON.parse(ls) : shop
      } catch (e) {
        localStorage.removeItem(this.#settingsname)
        this.notifyErrorObservers(new ShopError('Kayıtlar tutarsız, tüm veriler silindi'))
      }
    }
    this.saveCart()
  }


  addObserver(/**/) {
    const args = Array.prototype.slice.call(arguments)
    for (let o of args)
    {
      if (o instanceof ElementObserver) {
        this.observers.push(o)
      }
    }
    return this
  }

  addErrorObserver(/**/) {
    const args = Array.prototype.slice.call(arguments)
    for (let o of args)
    {
      if (o instanceof ElementErrorObserver) {
        this.errorObservers.push(o)
      }
    }
    return this
  }

  notifyObservers() {
    for (let o of this.observers) {
      o.update(this.userCarts.carts[this.userCarts.lastLoggedInUser])
    }
  }

  notifyErrorObservers(e) {
    // && !(e instanceof ShopError)
    if (this.debugmode)
      console.error(e)
    for (let o of this.errorObservers) {
      if (!(e instanceof ShopError))
        o.update(new ShopError(e.message))
      else
        o.update(e)
    }
  }

  getCurrentUserName() {
    return this.userCarts.carts[this.userCarts.lastLoggedInUser].user
  }

  getuserCart() {
    return this.userCarts.carts[this.getCurrentUserIndex()].cart
  }

  getCurrentUserIndex() {
    const user = this.getCurrentUserName()
    const index = this.userCarts.carts.findIndex(v => v.user === user)
    return index
  }

  addToCart(productId) {
    this.getuserCart()
      .push(productId)
    this.saveCart()
  }

  removeFromCart(productId) {
    const theCart = this.getuserCart()
    if (!theCart.includes(productId)) {
      this.notifyErrorObservers(new ShopError('Ürün Bulunamadı'))
      return
    }
    theCart.splice(theCart.indexOf(productId), 1)
    this.saveCart()
  }

  empyCart(saveChart = true) {
    const theCart = this.getuserCart()
    theCart.splice(0, theCart.length)
    if (saveChart)
      this.saveCart()
  }

  moveUser(username) {
    if (this.getCurrentUserName() !== this.#guestname) {
      
      this.notifyErrorObservers(new ShopError('Misafir olmayan kullanıcıyı taşıyamazsınız'))
      return
    }
    const cartToCopy = [...this.getuserCart()]
    this.userCarts.carts.push({user: username, cart: cartToCopy})
    this.empyCart(false)
    this.userCarts.lastLoggedInUser = this.userCarts.carts.length - 1
    this.saveCart()
  }

  addUser(username) {
    const isUserExists = this.userCarts.carts.some(v => v.user === username)
    if (isUserExists) {
      this.notifyErrorObservers(new ShopError('Kullanıcı adı zaten mevcut. Başka bir kullanıcı adı giriniz.'))
    }
    this.userCarts.carts.push({user: username, cart: []})
    this.userCarts.lastLoggedInUser = this.userCarts.carts.length - 1
    this.saveCart()
  }

  changeUser(username) {
    const index = this.userCarts.carts.findIndex(v => v.user === username)
    if (index === -1) {
      this.notifyErrorObservers(new ShopError('Kullanıcı Bulunamadı'))
      return
    }
    this.userCarts.lastLoggedInUser = index
    this.saveCart()
  }

  deleteUser() {
    if (this.userCarts.lastLoggedInUser === 0) {
      this.notifyErrorObservers(new ShopError('Misafir Kullanıcıyı Silemezsiniz'))
      return
    }
    this.userCarts.carts.splice(this.getCurrentUserIndex(), 1)
    this.logoutUser()
  }

  logoutUser() {
    this.userCarts.lastLoggedInUser = 0
    this.saveCart()
  }

  showDiscalimer(infoFunction) {
    if (!infoFunction || this.userCarts.showInfo)
      return
    infoFunction()
    this.userCarts.showInfo = false
    this.saveCart(false)
  }

  saveCart(observerNotification = true) {
    const updater = (this.debugmode) ? JSON.stringify(this.userCarts) : btoa(encodeURIComponent(JSON.stringify(this.userCarts)))
    localStorage.setItem(this.#settingsname, 
      updater
      )
    if (observerNotification)
      this.notifyObservers()
  }
}

