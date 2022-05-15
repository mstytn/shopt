// jshint ignore: start
const ppp = 12
// produtcs : DB : js/db/products
// productor: Veri tabanı kontrol katmanı
const productor = new Producs([...products].reverse())
// Sepet değişimlerini izleyen gözlemci sınıfı
const cartCounter = new ElementObserver('.menu-cart-button > span')
// Bu böyle olmaması lazımdı ama Önce hata göstermek için yazmıştım sonra toast
// bildirimi olarak kullanmaya kara verdim.
const errorCatcher = new ElementErrorObserver('.toaster', 'SHOPT')
const menuCartPreview = new MenuCartPreview(
  '.cart-preview__product-list', 
  '.gotocart', 
  '.emptycard',
  '.cart-preview__summary p')
// Slider içeriğini kontorl eden ve kaydıran sınıf
const slider = new Slider('.sliders', 10000, showDetails)
const sliderProducts = productor.filterSliderProducts()
if (sliderProducts.success)
  slider.feedSlider(sliderProducts.result)
// Yeni PaginatedList sınıfı döndüren
// Ürünleri sayfa sayfa gruplamaya yarayan OBSEVABLE sınıf
const pageList = productor.getPaginatedList(ppp)
// Ürünü listeleten DOM elementinin bağlantılatını yapan OBSERVER sınıf
const productLister = new ProductList('.product-list', showDetails)
// Sayfalama elementini DOM'a ekleyen OBSERVER sınıf
const listPaginator = new ListPaginator(pageList)
// Sayfa değişimlerini tetikleyen Gözlemci Bağlanıtları
pageList.addOberver(listPaginator).addOberver(productLister)
// İlk çalışmada tetiklenmeyeceğinden, Ürünleri DOM'a listeye eklediğimiz sınıf
productLister.update(pageList, false)
// Öne Çıkan Ürünler Kısmının içini dolduran sınıf
const featured = new Featured('.featured', showDetails)
const featuredProducts = productor.filterFeatured()
if (featuredProducts.success)
  featured.feedFeatured(featuredProducts.result)
// İsim çok doğru değil aslında users olsa daha iyi olurdu
// Kullanıcı işlemlerini deneteleyen sınıf
const currentUser = new CurrentUser('random-guest')
// Kullanıcı giriş Çıkış Butonu Denetleyicisi
const userNav = new UsersNav('#user')
// *******************(Ana Sınıf)*****************************************
// Bütün kayıtlatın yazıldığı. Kullanıcı ve Sepet işlemlerinin
// Bağlı olduğu OBSERVABLE Sınıf
// Gözlemcilere herhangi bir kullanıcı ya da sepet değişimi
// Olduğunda bildirim yapan sınıf.
// Debug modu ekledim. Hala developmen sürümü olduğndan bu modu kaldırmadım.
// localStorage'ta BASE64 encoding ile tutuluyor.
// debugmode kapalıyken bilinen hatalar stack dökümünü vermiyor.
const shop = new Shop(debugmode = false)
// Ana Gözlemci Bağlantı Moktası
shop.addObserver(cartCounter, menuCartPreview)
    .addErrorObserver(errorCatcher)
    .showDiscalimer(() => {console.log('Legal Metin')})
// Kullanıcı gişi ilemlerini için Modal Dialog Kontrolcüsü
const sign = new SigForms()
// Ürün Detaylarıqnın gösterilmesi için Modal Dilog Kontolcüsü
const detailsModal = new DetailsModal()
// Son Sepet Görüntülenmesi için Modal Dialog Kontrolcüsü
const cartModal = new CartSummary()
// Bu gözümün önünde dursun diye buraya koymuştum
// Sonra burada kaldı çok yerde kullandığımdan
// Olamsı gereken yere taşımak zaman alacaktı.
// Burada bıraktım.
function showDetails(id) {
  detailsModal.showModal(id)
}