(function () {
if (window.__AVIA_TITLEBAR_LOADED__) return;
window.__AVIA_TITLEBAR_LOADED__ = true;

const TITLEBAR_HEIGHT = 29;

function createTitlebar() {
if (document.getElementById("avia-titlebar")) return;

const bar = document.createElement("div");
bar.id = "avia-titlebar";
bar.style.position = "fixed";
bar.style.top = "0";
bar.style.left = "0";
bar.style.right = "0";
bar.style.height = TITLEBAR_HEIGHT + "px";
bar.style.zIndex = "999999";
bar.style.webkitAppRegion = "drag";

bar.innerHTML = `
<div style="height:29px;display:flex;align-items:center;background:var(--md-sys-color-surface-container-high);color:var(--md-sys-color-on-surface);">
<div style="flex:1;display:flex;align-items:center;padding-left:10px;-webkit-app-region:drag">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1076 307" style="height:18px;margin-top:1px">
<path d="M49.249 265.73C19.266 237.782.504 197.948.504 153.767.504 69.295 69.084.716 153.555.716c84.472 0 153.051 68.58 153.051 153.05 0 70.3-47.498 129.592-112.124 147.508"></path>
</svg>
</div>

<div style="display:flex;-webkit-app-region:no-drag">

<button id="avia-min" style="width:45px;height:29px;border:none;background:transparent;color:inherit;cursor:pointer">
─
</button>

<button id="avia-max" style="width:45px;height:29px;border:none;background:transparent;color:inherit;cursor:pointer">
□
</button>

<button id="avia-close" style="width:45px;height:29px;border:none;background:transparent;color:inherit;cursor:pointer">
✕
</button>

</div>
</div>
`;

document.body.appendChild(bar);

document.body.style.paddingTop = TITLEBAR_HEIGHT + "px";

bindButtons();
}

function bindButtons() {

const electron = window.require?.("electron");

const ipc =
electron?.ipcRenderer ||
window.ipcRenderer ||
window.avia ||
null;

if (!ipc) return;

document.getElementById("avia-min").onclick = () => {
ipc.send?.("window-minimize") || ipc.minimize?.();
};

document.getElementById("avia-max").onclick = () => {
ipc.send?.("window-maximize") || ipc.maximize?.();
};

document.getElementById("avia-close").onclick = () => {
ipc.send?.("window-close") || ipc.close?.();
};

}

function observeDOM() {

const observer = new MutationObserver(() => {

if (!document.getElementById("avia-titlebar")) {
createTitlebar();
}

});

observer.observe(document.documentElement, {
childList: true,
subtree: true
});

}

function init() {

createTitlebar();
observeDOM();

}

if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", init);
} else {
init();
}

})();
