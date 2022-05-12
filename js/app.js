// jshint ignore: start
const elObserver = new ElementObserver()
const errorCatcher = new ElementErrorObserver('.toaster', 'Shopingo')

const shop = new Shop(debugmode = false)
  
shop.addObserver(elObserver)
    .addErrorObserver(errorCatcher)
    .showDiscalimer(() => {console.log('Legal Metin')})




