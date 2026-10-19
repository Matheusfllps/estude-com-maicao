// ===== CONFIGURAÇÃO: troque pelo seu número e pelo vídeo =====
const CFG={wa:'https://wa.me/5500000000000?text=Quero%20fazer%20parte%20da%20tropa',video:'' /* ex.: 'https://www.youtube.com/embed/ID_DO_VIDEO' */};
// ===== utilitários e armazenamento (localStorage + IndexedDB para arquivos) =====
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const L=(k,d)=>JSON.parse(localStorage.getItem(k))??d,S=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const uid=()=>Math.random().toString(36).slice(2,10);
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const sha=async t=>crypto.subtle?[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)))].map(b=>b.toString(16).padStart(2,'0')).join(''):'p:'+t;
const idb=()=>new Promise(r=>{const q=indexedDB.open('plataforma',1);q.onupgradeneeded=()=>q.result.createObjectStore('f');q.onsuccess=()=>r(q.result)});
const fput=async(k,b)=>{const d=await idb();return new Promise(r=>{const t=d.transaction('f','readwrite');t.objectStore('f').put(b,k);t.oncomplete=r})};
const fget=async k=>{const d=await idb();return new Promise(r=>{const q=d.transaction('f').objectStore('f').get(k);q.onsuccess=()=>r(q.result)})};
const fdel=async k=>(await idb()).transaction('f','readwrite').objectStore('f').delete(k);
const ses=()=>JSON.parse(sessionStorage.getItem('s')||'null');
const sair=()=>{sessionStorage.removeItem('s');location.href='index.html'};
const guard=r=>{const s=ses();if(!s||s.role!==r){location.href='index.html';throw 0}return s};
async function seed(){
 if(!L('users'))S('users',[{id:'adm',nome:'Administrador',login:'admin',senha:await sha('admin123'),role:'admin',ativo:1}]);
 if(!L('pastas'))S('pastas',['Português','Inglês','RLM','Simulados','Noções de Direito'].map(n=>({id:uid(),nome:n})));
 if(!L('itens'))S('itens',[]);
}
const P={};
// ===== Página 1: login =====
P.login=()=>{let r='aluno';const er=m=>$('#e').textContent=m;
 $$('.tab').forEach(t=>t.onclick=()=>{r=t.dataset.r;$$('.tab').forEach(x=>x.classList.toggle('on',x==t))});
 $('#f').onsubmit=async e=>{e.preventDefault();const h=await sha($('#s').value),u=L('users',[]).find(x=>x.login==$('#l').value.trim().toLowerCase()&&x.senha==h&&x.role==r);
  if(!u)return er('Login ou senha incorretos. Confira os dados e o perfil escolhido.');
  if(!u.ativo)return er('Seu acesso está bloqueado. Fale com a mentoria.');
  sessionStorage.setItem('s',JSON.stringify({id:u.id,role:r}));location.href=r=='admin'?'admin.html':'aluno.html'}};
// ===== Página 2: landing =====
P.landing=()=>{$$('.wa').forEach(a=>a.href=CFG.wa);
 $('#video').innerHTML=CFG.video?`<iframe src="${CFG.video}" title="Como funciona a mentoria" allowfullscreen></iframe>`:'<p>▶ Vídeo explicando como funciona a mentoria<br><small>Defina CFG.video em app.js</small></p>'};
// ===== Página 3: área do aluno =====
P.aluno=()=>{const s=guard('aluno'),u=L('users',[]).find(x=>x.id==s.id);if(!u||!u.ativo)return sair();
 $('#nome').textContent=u.nome.split(' ')[0];$('#sair').onclick=sair;
 const ps=L('pastas',[]),it=L('itens',[]),g=$('#grid'),v=$('#lista');
 g.innerHTML=ps.map(p=>`<button class="pasta" data-id="${p.id}"><b>${esc(p.nome)}</b><small>${it.filter(i=>i.pasta==p.id).length} itens</small></button>`).join('');
 g.onclick=e=>{const b=e.target.closest('.pasta');if(!b)return;const p=ps.find(x=>x.id==b.dataset.id),xs=it.filter(i=>i.pasta==p.id);
  g.hidden=true;v.hidden=false;
  v.innerHTML=`<button class="btn ln" id="vo">VOLTAR</button><h2 style="margin-top:20px">${esc(p.nome)}</h2>`+(xs.length?xs.map(i=>`<button class="item" data-id="${i.id}">${esc(i.titulo)}</button>`).join(''):'<p>Esta pasta ainda não tem conteúdo.</p>');
  $('#vo').onclick=()=>{v.hidden=true;g.hidden=false}};
 v.onclick=e=>{const b=e.target.closest('.item');if(!b)return;const i=it.find(x=>x.id==b.dataset.id);
  if(i.url)return window.open(i.url,'_blank','noopener');
  const w=window.open('','_blank');fget(i.fid).then(f=>w.location=URL.createObjectURL(f))}};
// ===== Admin: alunos e conteúdo =====
P.admin=()=>{guard('admin');$('#sair').onclick=sair;
 $$('.tab').forEach(t=>t.onclick=()=>{$$('.tab').forEach(x=>x.classList.toggle('on',x==t));$('#t-a').hidden=t.dataset.t!='a';$('#t-c').hidden=t.dataset.t!='c'});
 const R=()=>{const us=L('users',[]).filter(u=>u.role=='aluno'),ps=L('pastas',[]),it=L('itens',[]);
  $('#ta').innerHTML=us.length?us.map(u=>`<tr><td>${esc(u.nome)}</td><td>${esc(u.login)}</td><td>${u.ativo?'Ativo':'Bloqueado'}</td><td><button data-a="blk" data-id="${u.id}">${u.ativo?'Bloquear':'Liberar'}</button><button data-a="pw" data-id="${u.id}">Nova senha</button><button data-a="del" data-id="${u.id}">Excluir</button></td></tr>`).join(''):'<tr><td colspan="4">Nenhum aluno cadastrado. Use o formulário acima.</td></tr>';
  $('#cp').innerHTML=ps.map(p=>`<option value="${p.id}">${esc(p.nome)}</option>`).join('');
  $('#pl').innerHTML=ps.map(p=>`<span class="chip">${esc(p.nome)} <button data-a="dp" data-id="${p.id}" aria-label="Excluir pasta ${esc(p.nome)}">×</button></span>`).join('');
  $('#il').innerHTML=it.length?it.map(i=>`<li>${esc(i.titulo)} <small>${esc(ps.find(p=>p.id==i.pasta)?.nome||'')}</small><button data-a="di" data-id="${i.id}">Excluir</button></li>`).join(''):'<li>Nenhum conteúdo publicado. Envie o primeiro acima.</li>'};
 document.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,id=b.dataset.id,us=L('users',[]);
  if(a=='blk'){const u=us.find(x=>x.id==id);u.ativo=u.ativo?0:1;S('users',us)}
  if(a=='pw'){const n=prompt('Nova senha (mín. 6 caracteres):');if(!n||n.length<6)return;us.find(x=>x.id==id).senha=await sha(n);S('users',us)}
  if(a=='del'&&confirm('Excluir este aluno?'))S('users',us.filter(x=>x.id!=id));
  if(a=='dp'&&confirm('Excluir a pasta e todo o conteúdo dela?')){L('itens',[]).filter(i=>i.pasta==id&&i.fid).forEach(i=>fdel(i.fid));S('itens',L('itens',[]).filter(i=>i.pasta!=id));S('pastas',L('pastas',[]).filter(p=>p.id!=id))}
  if(a=='di'){const i=L('itens',[]).find(x=>x.id==id);if(i.fid)fdel(i.fid);S('itens',L('itens',[]).filter(x=>x.id!=id))}
  R()};
 $('#fa').onsubmit=async e=>{e.preventDefault();const l=$('#al').value.trim().toLowerCase(),us=L('users',[]);
  if(us.some(u=>u.login==l))return alert('Esse login já existe. Escolha outro.');
  us.push({id:uid(),nome:$('#an').value.trim(),login:l,senha:await sha($('#as').value),role:'aluno',ativo:1});S('users',us);e.target.reset();R()};
 $('#fp').onsubmit=e=>{e.preventDefault();S('pastas',[...L('pastas',[]),{id:uid(),nome:$('#pn').value.trim()}]);e.target.reset();R()};
 $('#fc').onsubmit=async e=>{e.preventDefault();const f=$('#cf').files[0],url=$('#cu').value.trim();
  if(!f&&!url)return alert('Informe um link ou escolha um arquivo.');
  const i={id:uid(),pasta:$('#cp').value,titulo:$('#ct').value.trim()};if(f){i.fid=uid();await fput(i.fid,f)}else i.url=url;
  S('itens',[...L('itens',[]),i]);e.target.reset();R()};
 $('#pwa').onclick=async()=>{const n=prompt('Nova senha do administrador (mín. 6 caracteres):');if(!n||n.length<6)return;const us=L('users',[]);us.find(u=>u.role=='admin').senha=await sha(n);S('users',us);alert('Senha alterada.')};
 R()};
seed().then(()=>P[document.body.dataset.p]?.());
