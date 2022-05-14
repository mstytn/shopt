// jshint ignore: start
class CurrentUser {
  #attempt
  #maxAttempt
  constructor(anonymousUserName) {
    this.anonymousUSerName = anonymousUserName
    this.#attempt = 0
    this.#maxAttempt = 5
  }

  isUserAnonymous() {
    return (shop.getCurrentUserName() === this.anonymousUSerName) ? true : false
  }

  switchUser(username) {
    if (this.#attempt > this.#maxAttempt) {
      this.#attempt = 0
      return new ActionResult('Çok falzla yanlış deneme yaptınız. Üye Olmaya ne dersiniz', -2)
    }
    if (!username)
      return new ActionResult('Kullanıcı isminiz boş olamaz')
    if (username.match(/\W+/g)) {
      this.#attempt++
      return new ActionResult('Kullanıcı adı özel karakter içeremez. Sadece harf rakam ve _ kullanabilirsiniz.')
    }
    if (!shop.isUserExists(username)) {
      this.#attempt++
      return new ActionResult('Kullanıcı Bulunamadı.')
    }
    return new ActionResult(username, 0, true)
  }

  createUser(username) {
    if (!username)
      return new ActionResult('Kullanıcı isminiz boş olamaz')
    if (username.match(/\W+/g)) 
      return new ActionResult('Kullanıcı adı özel karakter içeremez. Sadece harf rakam ve _ kullanabilirsiniz.')
    if (username.length < 3 || username.length > 8)
      return new ActionResult('Kullanıcı adınız en az 3, en fazla 8 karakter uzunluğunda olmaıdır.')
    if (shop.findUserIndex(username) !== -1)
      return new ActionResult('Bu kullanıcı ismi zaten kayıtlı. Başka bir tane deyein.', -2)
    if (currentUser.isUserAnonymous()) {
      const userres = shop.moveUser(username)
      if (userres)
        return new ActionResult(username, 0, true)
      else
        return new ActionResult()
    } else {
      const userres = shop.addUSer(username)
      if (userres)
        return new ActionResult(username, 0, true)
      else
        return new ActionResult()
    }
  }
}

class ActionResult {
  success
  message
  code
  constructor(message, code = -1, success = false) {
    this.success = success
    this.message = message ?? 'Beklenmeyen Hata Oluştu'
    this.code = code
  }
}