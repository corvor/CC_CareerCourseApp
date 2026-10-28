/* Course-to-Career Pathfinder app logic. Data lives in data-courses.js and data-occupations.js. */
/* ---------- state ---------- */
const SAMPLE = {sel:{eng1:{},eng2:{},ap_lang:{},alg1:{},geom:{},alg2:{},bio:{},chem:{},wgeo:{},whist:{},ap_psych:{score:4},hs_prin:{},medterm:{},lote:{},job:{}},occ:"29-1141.00",sample:true};
let S;
try{ S = JSON.parse(localStorage.getItem("pathfinder-v1")) || null; }catch(e){ S=null; }
if(!S || !S.sel) S = JSON.parse(JSON.stringify(SAMPLE));
function save(){ try{ localStorage.setItem("pathfinder-v1", JSON.stringify(S)); }catch(e){} }

// Drop saved courses or occupations that no longer exist in the data files
for(const id of Object.keys(S.sel)){ if(!byId[id]) delete S.sel[id]; }
if(!O.some(o=>o.soc===S.occ)) S.occ = O[0].soc;

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- logo fallback: show the text wordmark if assets/logo.svg is missing ---------- */
(function(){
  const img=$("brandLogo"); if(!img) return;
  const fallback=()=>{ img.hidden=true; img.nextElementSibling.hidden=false; };
  if(img.complete && img.naturalWidth===0) fallback();
  else img.addEventListener("error",fallback);
})();

/* ---------- paste matching ---------- */
function norm(s){
  return (" "+s.toLowerCase().replace(/[^a-z0-9&+ ]/g," ")+" ")
    .replace(/\biv\b/g,"4").replace(/\biii\b/g,"3").replace(/\bii\b/g,"2").replace(/\bi\b/g,"1")
    .replace(/\s+/g," ").trim();
}
const MATCH_ORDER = [...C.filter(c=>c.t), ...C.filter(c=>!c.t)];
function matchPaste(){
  const lines = $("paste").value.split(/[\n;|\t]+|,(?=\s*[A-Za-z])/).map(l=>l.trim()).filter(l=>/[a-z]{2}/i.test(l));
  const missed=[]; let added=0;
  for(const line of lines){
    const s = norm(line);
    const hit = MATCH_ORDER.find(c=>c.re.test(s));
    if(hit){ if(!S.sel[hit.id]){ S.sel[hit.id]={}; added++; } }
    else missed.push(line);
  }
  if(S.sample){ S.sample=false; }
  const um=$("unmatched");
  if(lines.length===0){ um.hidden=false; um.textContent="Paste at least one course name, one per line."; }
  else{
    um.hidden=false;
    um.innerHTML = `Added ${added} course${added===1?"":"s"}.` + (missed.length? ` Couldn't match: ${missed.map(m=>`<code>${esc(m)}</code>`).join(", ")}. Pick these from the lists below if they fit.`:"");
  }
  save(); renderAll();
}

/* ---------- left pane ---------- */
function renderGroups(){
  const open = new Set([...document.querySelectorAll("details.group[open]")].map(d=>d.dataset.g));
  const first = document.querySelectorAll("details.group").length===0;
  $("groups").innerHTML = GROUPS.map((g,gi)=>{
    const items=C.filter(c=>c.g===gi);
    const n=items.filter(c=>S.sel[c.id]).length;
    const isOpen = first ? (gi<3) : open.has(String(gi));
    return `<details class="group" data-g="${gi}" ${isOpen?"open":""}><summary>${esc(g)}<span class="count">${n?n+" selected":""}</span></summary>
      <div class="chips">${items.map(c=>`<button type="button" class="chip" id="c-${c.id}" data-id="${c.id}" aria-pressed="${!!S.sel[c.id]}">${esc(c.n)}</button>`).join("")}</div></details>`;
  }).join("");
  const n=Object.keys(S.sel).length;
  $("selCount").textContent = n ? `${n} selected` : "Nothing selected yet";
  $("sampleBanner").hidden = !S.sample;
  const aps = Object.keys(S.sel).filter(id=>byId[id] && byId[id].t==="AP");
  $("apPanel").hidden = aps.length===0;
  $("scores").innerHTML = aps.map(id=>`<label for="sc-${id}">${esc(byId[id].n)}</label>
    <select id="sc-${id}" data-id="${id}"><option value="">No score yet</option>${[5,4,3,2,1].map(v=>`<option value="${v}" ${S.sel[id].score==v?"selected":""}>${v}</option>`).join("")}</select>`).join("");
}
$("groups").addEventListener("click",e=>{
  const b=e.target.closest(".chip"); if(!b) return;
  const id=b.dataset.id;
  if(S.sel[id]) delete S.sel[id]; else S.sel[id]={};
  S.sample=false; save(); renderAll();
  const nb=$("c-"+id); if(nb) nb.focus();
});
$("scores").addEventListener("change",e=>{
  const id=e.target.dataset.id; if(!id) return;
  S.sel[id].score = e.target.value ? +e.target.value : undefined;
  S.sample=false; save(); renderReport();
});
$("matchBtn").addEventListener("click",matchPaste);
$("clearBtn").addEventListener("click",()=>{ S.sel={}; S.sample=false; $("paste").value=""; $("unmatched").hidden=true; save(); renderAll(); });
$("startOwn").addEventListener("click",()=>{ S.sel={}; S.sample=false; save(); renderAll(); $("paste").focus(); });

/* ---------- report ---------- */
function occKnow(o){ return o.k.map(x=>Array.isArray(x)?{c:x[0],imp:x[1]}:{c:x,imp:null}); }
function strengthFor(code){
  let sum=0; const from=[];
  for(const id of Object.keys(S.sel)){ const c=byId[id]; if(c && c.kn[code]){ sum+=c.kn[code]; from.push(c.n); } }
  return {sum,from,status: sum>=3?"ok":sum>=1?"mid":"gap"};
}
function creditStatus(id){
  const c=byId[id];
  if(c.t==="DC") return {st:"have",label:"Earned (dual credit)"};
  const sc=S.sel[id].score;
  if(sc==null) return {st:"maybe",label:"Possible with a 3+"};
  if(sc>=3) return {st:"have",label:`Likely (AP score ${sc})`};
  return {st:"no",label:`Not likely (AP score ${sc})`};
}
function credits(){
  return Object.keys(S.sel).filter(id=>byId[id] && byId[id].cr).map(id=>({id,c:byId[id],...creditStatus(id)}));
}
function tagCoverage(tag){
  const cs=credits().filter(x=>x.c.cr.tags.includes(tag));
  const have=cs.find(x=>x.st==="have"); if(have) return {st:"have",by:have};
  const maybe=cs.find(x=>x.st==="maybe"); if(maybe) return {st:"maybe",by:maybe};
  return null;
}

function renderOccSelect(){
  const zones=[[2,"Job Zone 1–2 · little to some preparation"],[3,"Job Zone 3 · medium preparation"],[4,"Job Zone 4 · considerable preparation"],[5,"Job Zone 5 · extensive preparation"]];
  $("occ").innerHTML = zones.map(([z,l])=>`<optgroup label="${l}">${O.filter(o=>o.zn===z).map(o=>`<option value="${o.soc}" ${o.soc===S.occ?"selected":""}>${esc(o.n)}</option>`).join("")}</optgroup>`).join("");
}
$("occ").addEventListener("change",e=>{ S.occ=e.target.value; save(); renderReport(); });

function renderReport(){
  const o = O.find(x=>x.soc===S.occ) || O[0];
  const url = `https://www.onetonline.org/link/summary/${o.soc}`;

  // occupation card
  const eduHtml = o.edu.length
    ? o.edu.map(([lvl,p])=>`<div class="edu-row"><span>${esc(lvl)}</span><span class="pct">${p!=null?p+"%":"some jobs"}</span><div class="edu-bar"><i style="width:${p!=null?p:30}%"></i></div></div>`).join("") +
      (o.edu.some(e=>e[1]!=null)?`<p class="hint">Share of O*NET survey respondents saying new hires need this level.</p>`:`<p class="hint">O*NET lists these levels without percentages for this job.</p>`)
    : `<p class="hint">O*NET does not publish an education breakdown on this profile. See the Job Zone description.</p>`;
  $("occCard").innerHTML = `
    <div class="occ-title"><h2>${esc(o.n)}</h2><span class="soc">O*NET-SOC ${o.soc}</span></div>
    <p>${esc(o.d)}</p>
    <div class="zone">
      <span class="eyebrow">Job Zone ${o.z} of 5</span>
      <div class="zone-meter" aria-hidden="true">${[1,2,3,4,5].map(i=>`<span class="${i<=o.zn?"on":""}"></span>`).join("")}</div>
      <div class="zone-scale" aria-hidden="true"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>
      <p class="hint">${esc(ZONE_TEXT[o.zn])}</p>
    </div>
    <div class="facts">
      <div class="fact"><h3>Education new hires need</h3>${eduHtml}</div>
      <div class="fact"><h3>Licenses & credentials</h3><p style="font-size:14px">${esc(o.cred)}</p></div>
    </div>
    <a href="${url}" target="_blank" rel="noopener">Open the full O*NET profile</a>`;

  // knowledge match
  const ks = occKnow(o).map(k=>({...k,...strengthFor(k.c)}));
  const cnt = {ok:ks.filter(k=>k.status==="ok").length, mid:ks.filter(k=>k.status==="mid").length, gap:ks.filter(k=>k.status==="gap").length};
  const pillTxt={ok:"Strong start",mid:"Started",gap:"Not yet"};
  $("knowCard").innerHTML = `
    <div class="panel-head"><h2>How your courses line up</h2><span class="hint">O*NET knowledge areas, most important first</span></div>
    <div class="strip" role="img" aria-label="${cnt.ok} strong, ${cnt.mid} started, ${cnt.gap} not yet">${ks.map(k=>`<span class="s-${k.status}" title="${esc(K[k.c])}"></span>`).join("")}</div>
    <div class="tally"><span><b>${cnt.ok}</b> strong start</span><span><b>${cnt.mid}</b> started</span><span><b>${cnt.gap}</b> not yet</span></div>
    <div class="k-list">${ks.map(k=>{
      let detail;
      if(k.status!=="gap") detail = `<strong>From:</strong> ${k.from.map(esc).join(", ")}`;
      else {
        const sug = C.filter(c=>c.kn[k.c] && !S.sel[c.id]).sort((a,b)=>b.kn[k.c]-a.kn[k.c]).slice(0,3).map(c=>c.n);
        detail = sug.length? `<strong>Builds it in high school:</strong> ${sug.map(esc).join(", ")}. You'd also pick it up in training after graduation.` : `Usually learned in training after high school.`;
      }
      if(k.status==="mid"){
        const more = C.filter(c=>c.kn[k.c] && !S.sel[c.id]).sort((a,b)=>b.kn[k.c]-a.kn[k.c]).slice(0,2).map(c=>c.n);
        if(more.length) detail += `<br><strong>To go further:</strong> ${more.map(esc).join(", ")}`;
      }
      return `<div class="k"><div class="k-name">${esc(K[k.c])}${k.imp!=null?`<span class="k-imp">importance ${k.imp}/100</span>`:""}</div><span class="pill p-${k.status}">${pillTxt[k.status]}</span><div class="k-detail">${detail}</div></div>`;
    }).join("")}</div>`;

  // path
  const p=o.path;
  $("pathCard").innerHTML = `
    <div class="panel-head"><h2>What you'd take after high school</h2></div>
    <div class="path-head"><h3>${esc(p.type)}</h3><span class="path-len">${esc(p.len)}</span></div>
    <ol class="steps">${p.items.map(([name,tag])=>{
      let pill=`<span class="pill p-na">Ahead</span>`;
      if(tag){ const cv=tagCoverage(tag);
        if(cv && cv.st==="have") pill=`<span class="pill p-ok">Covered: ${esc(cv.by.c.n.replace(/^Dual Credit /,"DC "))}</span>`;
        else if(cv) pill=`<span class="pill p-mid">If ${esc(cv.by.c.n)} ≥ 3</span>`;
      }
      return `<li><span>${esc(name)}</span>${pill}</li>`;
    }).join("")}</ol>
    <p class="note">Typical coursework for this path, not an official degree plan. Programs differ, so check the specific school or apprenticeship.</p>`;

  // credit
  const cr = credits();
  let creditHtml = `<div class="panel-head"><h2>College credit you may already have</h2></div>`;
  if(!cr.length){
    creditHtml += `<p class="empty">No AP or dual credit courses selected. If you take them later, they can count toward college requirements${p.deg?" for this path":" if you ever go for a degree"}.</p>`;
  } else {
    // core meter
    const have={}, maybe={};
    for(const x of cr){ const core=x.c.cr.core; if(!core) continue;
      if(x.st==="have") have[core]=(have[core]||0)+x.c.cr.hrs;
      else if(x.st==="maybe") maybe[core]=(maybe[core]||0)+x.c.cr.hrs; }
    let tHave=0,tMaybe=0;
    const rows = CORE.map(([name,hrs])=>{
      const h=Math.min(hrs,have[name]||0), m=Math.min(hrs-h,maybe[name]||0); tHave+=h; tMaybe+=m;
      return `<div class="core-row"><span>${esc(name)}</span><span class="pct">${h}${m?"+"+m:""} / ${hrs}</span><div class="core-bar"><i class="have" style="width:${h/hrs*100}%"></i><i class="maybe" style="width:${m/hrs*100}%"></i></div></div>`;
    }).join("");
    creditHtml += `
      <div class="row" style="gap:16px;align-items:baseline"><span class="core-total">${tHave}${tMaybe?`<span style="color:var(--mid)"> +${tMaybe}</span>`:""}</span><span class="hint">of 42 Texas Core Curriculum hours. The core transfers as a block between Texas public colleges.</span></div>
      <div class="legend"><span><i style="background:var(--ok)"></i>Earned or likely</span><span><i style="background:var(--mid);opacity:.55"></i>Possible with an AP score of 3+</span></div>
      <div class="core">${rows}</div>
      ${p.deg?"":`<p class="note">This path doesn't require a degree, so core hours won't speed it up. They still count if you go back for an associate or bachelor's later.</p>`}
      <div class="tbl-wrap"><table><thead><tr><th>Your course</th><th>Typical college equivalent</th><th>Status</th></tr></thead><tbody>
      ${cr.map(x=>`<tr><td>${esc(x.c.n)}</td><td class="mono">${esc(x.c.cr.col)}</td><td><span class="pill ${x.st==="have"?"p-ok":x.st==="maybe"?"p-mid":"p-gap"}">${esc(x.label)}</span></td></tr>`).join("")}
      </tbody></table></div>
      <p class="hint">Course numbers follow the Texas Common Course Numbering System. Each college decides what an AP score or dual credit course counts for.</p>`;
  }
  $("creditCard").innerHTML = creditHtml;

  // next steps
  const steps=[];
  const gaps = ks.filter(k=>k.status==="gap");
  if(gaps.length) steps.push(`Look for classes that build <strong>${gaps.slice(0,3).map(k=>esc(K[k.c])).join(", ")}</strong> in your remaining years.`);
  if(o.zn>=4 && !S.sel.alg2) steps.push(`Plan to take <strong>Algebra II</strong>. It's required for the Distinguished Level of Achievement, which Texas public universities use for automatic admission.`);
  const unscored = cr.filter(x=>x.st==="maybe");
  if(unscored.length) steps.push(`Add your AP scores when you get them. ${unscored.length===1?"That course":"Those courses"} could cover college requirements.`);
  const wantTags = p.items.map(i=>i[1]).filter(Boolean).filter(t=>!tagCoverage(t));
  const dcIdeas = {comp:"Dual Credit English",math:"Dual Credit College Algebra",calc:"AP Calculus",psych:"AP Psychology",chem:"AP Chemistry",bio:"AP Biology",phys:"AP Physics",ushist:"Dual Credit US History",gov:"Dual Credit Government",stats:"AP Statistics",econ:"AP Macroeconomics",cs:"AP Computer Science A",cs0:"AP Computer Science Principles",soc:"AP Human Geography"};
  const ideas=[...new Set(wantTags.map(t=>dcIdeas[t]).filter(Boolean))].slice(0,3);
  if(ideas.length) steps.push(`To get ahead on this path, ask your counselor about <strong>${ideas.map(esc).join(", ")}</strong>.`);
  if(o.zn<=3 && !p.deg) steps.push(`Ask whether your high school's CTE program offers an industry certification or a pre-apprenticeship for this field.`);
  steps.push(`Questions for the program or admissions office: Which of my AP or dual credit courses will you accept? What prerequisites do I need before applying? Is there a waitlist or a competitive application?`);
  $("nextCard").innerHTML = `<div class="panel-head"><h2>Next steps</h2></div><ul class="plain">${steps.map(s=>`<li>${s}</li>`).join("")}</ul>`;
  renderPrintCourses();
}

function renderSources(){
  $("sources").innerHTML = O.map(o=>`<li><a href="https://www.onetonline.org/link/summary/${o.soc}" target="_blank" rel="noopener">O*NET ${o.soc} · ${esc(o.n)}</a></li>`).join("") +
   `<li><a href="https://capitol.texas.gov/tlodocs/84R/analysis/html/HB01992H.htm" target="_blank" rel="noopener">Texas HB 1992 (2015): AP credit at a score of 3</a></li>
    <li><a href="https://catalog.tccd.edu/academics/corecurriculum" target="_blank" rel="noopener">Texas Core Curriculum component areas</a></li>`;
}

/* Course list that only shows on the printed report */
function renderPrintCourses(){
  const names = Object.keys(S.sel).filter(id=>byId[id]).map(id=>{
    const c=byId[id], sc=S.sel[id].score;
    return esc(c.n) + (c.t==="AP" && sc ? ` (score ${sc})` : "");
  });
  const today = new Date().toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"});
  $("printCourses").innerHTML = `<div class="panel-head"><h2>Coursework used for this report</h2><span class="hint">${esc(today)}</span></div>
    <p>${names.length ? names.join(", ") : "No courses selected."}</p>`;
}
$("printBtn").addEventListener("click",()=>window.print());

function renderAll(){ renderGroups(); renderReport(); }
renderOccSelect(); renderSources(); renderAll();
