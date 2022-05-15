// jshint ignore: start
gsap.from(".sliders", {
  opacity: 0,
  translateY: '-10px', 
  duration: 1, 
  ease: "ease"
});

gsap.from(".featured__card", {
  opacity: 0,
  translateY: '100px', 
  duration: 1,
  stagger: 0.1, 
  ease: "ease"
});

ScrollTrigger.create({
  trigger: "#urunler",
  start: "top top-=150",
  end: "top bottom-=100px",
  scrub: true,
  onEnter: () => menuActivator('#urunler'),
  onRefresh: () => menuActivator('#urunler'),
  onEnterBack: () => menuActivator('#urunler')
});

ScrollTrigger.create({
  trigger: "#iletisim",
  start: "top bottom-=100",

  scrub: true,
  onEnter: () => menuActivator('#iletisim'),
  onRefresh: () => menuActivator('#iletisim'),
  onEnterBack: () => menuActivator('#iletisim'),
});


ScrollTrigger.create({
  trigger: ".featured",
  start: "top bottom-=100",
  end: "bottom top",
  scrub: true,
  onEnter: () => menuActivator('#'),
  onRefresh: () => menuActivator('#'),
  onEnterBack: () => menuActivator('#'),
  onLeave: () => menuActivator('#urunler'),
});


function menuActivator(menutoactivate) {
  const menus = document.querySelectorAll('.menu-link')
  menus.forEach(m => {m.classList.remove('active')})
  const selector = `.menu-link[href="${menutoactivate}"]`
  const theMenu = document.querySelector(selector)
  theMenu.classList.add('active')
}

// BUG: Menü Tetiklenmiyor > Sayfa Yüksekliği fazla olduğunda 