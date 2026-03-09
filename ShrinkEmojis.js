(function () {
  if (window.__SHRINK_EMOJIS__) return;
  window.__SHRINK_EMOJIS__ = true;

  function apply() {
    const list = document.querySelectorAll('img[alt]')
    list.forEach(item=>{
      if(item.parentElement.parentElement.className!='fs_12px ov_hidden word-wrap_break-word'&&item.parentElement.parentElement.className&&item.parentElement.className.includes('--emoji-size-large')||item.parentElement.className==='d_inline-block'){
        item.style.setProperty('height','40px')
        item.style.setProperty('width','40px')
      }
    })
  }

  const observer = new MutationObserver(() => {
    apply();
  });

  function init() {
    apply();
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  if (document.body) {
    init();
  } else {
    requestAnimationFrame(init);
  }
})();
