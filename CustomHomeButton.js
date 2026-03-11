(function () {
  if (window.__CUSTOM_HOME_BUTTON__) return;
  window.__CUSTOM_HOME_BUTTON__ = true;

  function apply() {
    if(!document.getElementsByClassName('homebutton').item(0)){
        const homebuttonelement = document.getElementsByClassName('w_100% h_100% d_flex ai_center jc_center fw_600 fs_0.75rem fill_var(--md-sys-color-on-surface) c_var(--md-sys-color-on-surface) bg_var(--md-sys-color-surface-container-low)')
        .item(0)
        if(homebuttonelement){
            homebuttonelement.removeChild(homebuttonelement.firstChild)
            homebuttonelement.setAttribute('class','homebutton')  
        } 
    }
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
})()