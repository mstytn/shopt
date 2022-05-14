// jshint ignore: start
class Producs {
  constructor(db) {
    this.db = db;
    this.filtered = db;
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
}

class QueryResult {
  constructor(success, object) {
    this.success = success
    this.result = object
  }
}

