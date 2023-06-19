function backToTop() {
  const btn = document.getElementById("btn-back-to-top");

  function scroll() {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -50);
      setTimeout(scroll, 10);
    }
  }

  scroll();

  btn.style.position = "fixed";
  btn.style.bottom = "20px";
  btn.style.left = "20px";
}
