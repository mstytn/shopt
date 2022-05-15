// jshint ignore: start
class Producs {
  constructor(db) {
    this.db = db;
    this.filtered = [...db];
    this.isFiltered = false
  }

  findProductById(product_id) {
    const res = this.db.find(p => p.id === product_id)
    if (!res)
      return new QueryResult(false)
    else 
      return new QueryResult(true, res)
  }

  filterFeatured() {
    const res = this.db.filter(p => p.featured)
    if (res.length < 6)
      return new QueryResult(false)
    return new QueryResult(true, res.filter((_r, i) => i < 6))
  }

  filterSliderProducts(limitSlider) {
    const res = this.db.filter(p => p.slider)
    if (res.length === 0)
      return new QueryResult(false)
    else {
      if (limitSlider) {
        if (res.length > limitSlider) {
          return new QueryResult(true, res.filter((_r, i) => i < limitSlider))
        }
      }
    }
    return new QueryResult(true, res)
  }

  getPaginatedList(itemsPerPage) {
    return new PaginatedList(this.filtered, itemsPerPage)
  }
}

class PaginatedList {
  constructor(db, itemsPerPage) {
    this.lists = []
    this.db = db
    this.totalPage = 1
    this.itemsPerPage = itemsPerPage
    this.currentPage = 1
    this.activePageObjects = []
    if (this.db.length < this.itemsPerPage)
      this.lists.push(this.db)
    else {
      let l = []
      for (let f = 1; f <= this.db.length; f++) {
        l.push(this.db[f-1])
        if ((f % this.itemsPerPage) === 0) {
          this.lists.push(l)
          l = []
        }
      }
      if (l.length > 0)
        this.lists.push(l)
      l = []
    }
    this.totalPage = this.lists.length
    this.activePageObjects = this.lists[0]
    this.observers = []
  }
  
  addOberver(o) {
    this.observers.push(o)
    return this
  }

  next() {
    if (this.currentPage >= this.totalPage) 
      return undefined
    this.currentPage++
    this.activePageObjects = this.lists[this.currentPage - 1]
    this.notifyObservers()
    return this.activePageObjects
  }

  prev() {
    if (this.currentPage <= 1) 
      return undefined
    this.currentPage--
    this.activePageObjects = this.lists[this.currentPage - 1]
    this.notifyObservers()
    return this.activePageObjects
  }
  current() {
    this.notifyObservers()
    return this.activePageObjects
  }

  page(pageNumber) {
    
    try {
      this.activePageObjects = this.lists[pageNumber - 1]
      this.currentPage = pageNumber
      this.notifyObservers()
      return this.activePageObjects
    } catch (e) {
      return undefined
    }
  }

  notifyObservers() {
    for (let o of this.observers) {
      o.update(this)
    }
  }
}

class QueryResult {
  constructor(success, object) {
    this.success = success
    this.result = object
  }
}

