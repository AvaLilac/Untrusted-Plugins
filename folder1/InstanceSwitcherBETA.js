(function(){

if(window.__AVIA_INSTANCE_SWITCHER__) return;
window.__AVIA_INSTANCE_SWITCHER__ = true;

const STORAGE_KEY = "avia_instances";

const OFFICIAL_INSTANCE = {
    name: "Official Stoat",
    url: "https://stoat.chat/app/"
};

function getInstances(){
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveInstances(data){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function normalizeURL(url){
    let u = url.trim();
    if(!u.startsWith("http")) u = "https://" + u;
    if(!u.endsWith("/")) u += "/";
    if(!u.endsWith("app/")) u += "app/";
    return u;
}

function switchInstance(url){
    const parsed = new URL(url);
    const target = parsed.origin + "/app/";
    window.location.href = target;
}

function makeDraggable(panel, handle){
    let dragging=false, offsetX=0, offsetY=0;
    handle.addEventListener("mousedown", e=>{
        dragging=true;
        offsetX=e.clientX-panel.offsetLeft;
        offsetY=e.clientY-panel.offsetTop;
        document.body.style.userSelect="none";
    });
    document.addEventListener("mouseup", ()=>{
        dragging=false;
        document.body.style.userSelect="";
    });
    document.addEventListener("mousemove", e=>{
        if(!dragging) return;
        panel.style.left=(e.clientX-offsetX)+"px";
        panel.style.top=(e.clientY-offsetY)+"px";
        panel.style.right="auto";
        panel.style.bottom="auto";
    });
}

function togglePanel(){
    let panel=document.getElementById("avia-instance-panel");
    if(panel){
        panel.style.display = panel.style.display==="none" ? "flex" : "none";
        return;
    }

    panel=document.createElement("div");
    panel.id="avia-instance-panel";

    Object.assign(panel.style,{
        position:"fixed",
        bottom:"40px",
        right:"40px",
        width:"500px",
        height:"380px",
        background:"#1e1e1e",
        color:"#fff",
        borderRadius:"16px",
        boxShadow:"0 12px 35px rgba(0,0,0,0.45)",
        zIndex:999999,
        display:"flex",
        flexDirection:"column",
        overflow:"hidden",
        border:"1px solid rgba(255,255,255,0.08)"
    });

    const header=document.createElement("div");
    header.textContent="Instances";
    Object.assign(header.style,{
        padding:"14px 16px",
        fontWeight:"600",
        fontSize:"14px",
        background:"rgba(255,255,255,0.04)",
        borderBottom:"1px solid rgba(255,255,255,0.08)",
        cursor:"move"
    });
    makeDraggable(panel, header);

    const close=document.createElement("div");
    close.textContent="✕";
    Object.assign(close.style,{
        position:"absolute",
        right:"16px",
        top:"12px",
        cursor:"pointer"
    });
    close.onclick=()=>panel.style.display="none";

    const addButton=document.createElement("button");
    addButton.textContent="Add Instance";
    Object.assign(addButton.style,{
        margin:"10px",
        padding:"10px",
        borderRadius:"8px",
        border:"1px solid rgba(255,255,255,0.1)",
        background:"rgba(255,255,255,0.06)",
        color:"#fff",
        fontWeight:"500",
        cursor:"pointer",
        transition:"all .15s ease"
    });
    addButton.onmouseenter=()=>{ addButton.style.background="rgba(255,255,255,0.12)"; };
    addButton.onmouseleave=()=>{ addButton.style.background="rgba(255,255,255,0.06)"; };

    const addForm=document.createElement("div");
    Object.assign(addForm.style,{
        display:"none",
        flexDirection:"column",
        gap:"6px",
        padding:"10px"
    });

    const nameInput=document.createElement("input");
    nameInput.placeholder="Instance Name";
    Object.assign(nameInput.style,{
        padding:"8px",
        borderRadius:"6px",
        border:"1px solid rgba(255,255,255,0.1)",
        background:"rgba(255,255,255,0.05)",
        color:"#fff"
    });

    const urlInput=document.createElement("input");
    urlInput.placeholder="https://example.com/";
    Object.assign(urlInput.style,{
        padding:"8px",
        borderRadius:"6px",
        border:"1px solid rgba(255,255,255,0.1)",
        background:"rgba(255,255,255,0.05)",
        color:"#fff"
    });

    const saveButton=document.createElement("button");
    saveButton.textContent="Save";
    Object.assign(saveButton.style,{
        padding:"8px",
        borderRadius:"6px",
        border:"none",
        background:"rgba(255,255,255,0.12)",
        color:"#fff",
        cursor:"pointer"
    });

    addForm.appendChild(nameInput);
    addForm.appendChild(urlInput);
    addForm.appendChild(saveButton);

    const list=document.createElement("div");
    Object.assign(list.style,{
        flex:"1",
        overflowY:"auto",
        padding:"12px",
        display:"flex",
        flexDirection:"column",
        gap:"8px"
    });

    panel.appendChild(header);
    panel.appendChild(close);
    panel.appendChild(addButton);
    panel.appendChild(addForm);
    panel.appendChild(list);

    document.body.appendChild(panel);

    function render(){
        list.innerHTML="";
        const instances=[OFFICIAL_INSTANCE,...getInstances()];
        instances.forEach((inst,index)=>{
            const card=document.createElement("div");
            Object.assign(card.style,{
                padding:"10px",
                borderRadius:"10px",
                background:"rgba(255,255,255,0.05)",
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center"
            });

            const info=document.createElement("div");
            info.innerHTML=
            `<div style="font-weight:600">${inst.name}</div>
            <div style="font-size:11px;opacity:.6">${inst.url}</div>`;

            const controls=document.createElement("div");

            const openButton=document.createElement("button");
            openButton.textContent="Open";
            Object.assign(openButton.style,{
                marginLeft:"6px",
                padding:"4px 8px",
                borderRadius:"6px",
                border:"none",
                cursor:"pointer"
            });
            openButton.onclick=()=>switchInstance(inst.url);
            controls.appendChild(openButton);

            if(index!==0){
                const deleteButton=document.createElement("button");
                deleteButton.textContent="Delete";
                Object.assign(deleteButton.style,{
                    marginLeft:"6px",
                    padding:"4px 8px",
                    borderRadius:"6px",
                    border:"none",
                    cursor:"pointer"
                });
                deleteButton.onclick=()=>{
                    const data=getInstances();
                    data.splice(index-1,1);
                    saveInstances(data);
                    render();
                };
                controls.appendChild(deleteButton);
            }

            card.appendChild(info);
            card.appendChild(controls);
            list.appendChild(card);
        });
    }

    addButton.onclick=()=>{
        addForm.style.display = addForm.style.display==="none" ? "flex" : "none";
    };

    saveButton.onclick=()=>{
        const name=nameInput.value.trim();
        const url=urlInput.value.trim();
        if(!name || !url) return;
        const data=getInstances();
        data.push({name:name,url:normalizeURL(url)});
        saveInstances(data);
        nameInput.value="";
        urlInput.value="";
        addForm.style.display="none";
        render();
    };

    render();
}

function injectButton(){
    if(document.getElementById("avia-instance-btn")) return;

    const appearanceBtn=[...document.querySelectorAll("a")]
        .find(a=>a.textContent.trim()==="Appearance");
    const themesBtn=document.getElementById("avia-themes-btn");
    if(!appearanceBtn || !themesBtn) return;

    const clone=appearanceBtn.cloneNode(true);
    clone.id="avia-instance-btn";

    const text=[...clone.querySelectorAll("div")]
        .find(d=>d.children.length===0);
    if(text) text.textContent="(Avia) Instances";

    // remove old SVG icon
    const oldSvg = clone.querySelector("svg");
    if(oldSvg) oldSvg.remove();

    // add switch icon
    const svgNS="http://www.w3.org/2000/svg";
    const svg=document.createElementNS(svgNS,"svg");
    svg.setAttribute("viewBox","0 0 24 24");
    svg.setAttribute("width","20");
    svg.setAttribute("height","20");
    svg.setAttribute("fill","currentColor");
    svg.style.marginRight="8px";
    const path=document.createElementNS(svgNS,"path");
    path.setAttribute("d","M16 7v2H8V7h8zm0 4v2H8v-2h8zm0 4v2H8v-2h8z");
    svg.appendChild(path);
    clone.insertBefore(svg, clone.firstChild);

    clone.onclick=togglePanel;

    themesBtn.parentElement.insertBefore(clone,themesBtn.nextSibling);
}

new MutationObserver(injectButton)
.observe(document.body,{childList:true,subtree:true});

injectButton();

})();
