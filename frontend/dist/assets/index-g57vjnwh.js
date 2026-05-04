(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}})();class _{currentUser=null}const $="";async function A(r){const e=await r.text();if(!e)return null;try{return JSON.parse(e)}catch{return{raw:e}}}class U{constructor(e=$){this.baseUrl=String(e||"").replace(/\/$/,"")}_url(e){const t=e.startsWith("/")?e:`/${e}`;return`${this.baseUrl}${t}`}async _request(e,{method:t="GET",body:s}={}){const n={method:t,headers:{Accept:"application/json"}};s!==void 0&&(n.headers["Content-Type"]="application/json",n.body=JSON.stringify(s));const a=await fetch(this._url(e),n),i=await A(a);if(!a.ok){const c=i?.message||i?.error||a.statusText||"Request failed",l=new Error(c);throw l.status=a.status,l.body=i,l}return i}health(){return this._request("/health")}createUser({name:e,role:t}){return this._request("/api/users",{method:"POST",body:{name:e,role:t}})}listUsers(){return this._request("/api/users")}getUser(e){return this._request(`/api/users/${encodeURIComponent(e)}`)}listTickets({userId:e,role:t}={}){const s=new URLSearchParams;e&&s.set("userId",e),t&&s.set("role",t);const n=s.toString();return this._request(`/api/tickets${n?`?${n}`:""}`)}getTicket(e){return this._request(`/api/tickets/${encodeURIComponent(e)}`)}createTicket({type:e,formData:t,createdBy:s}){return this._request("/api/tickets",{method:"POST",body:{type:e,formData:t,createdBy:s}})}submitTicket(e,t){return this._request(`/api/tickets/${encodeURIComponent(e)}/submit`,{method:"POST",body:t})}forwardTicket(e,t){return this._request(`/api/tickets/${encodeURIComponent(e)}/forward`,{method:"POST",body:t})}reworkTicket(e,t){return this._request(`/api/tickets/${encodeURIComponent(e)}/rework`,{method:"POST",body:t})}approveTicket(e,t){return this._request(`/api/tickets/${encodeURIComponent(e)}/approve`,{method:"POST",body:t})}rejectTicket(e,t){return this._request(`/api/tickets/${encodeURIComponent(e)}/reject`,{method:"POST",body:t})}}function d(r,e){r&&(e?(r.textContent=e,r.hidden=!1):(r.textContent="",r.hidden=!0))}async function w(r,e){const t=r?.querySelector('button[type="submit"]');t&&(t.disabled=!0);try{return await e()}finally{t&&(t.disabled=!1)}}const E=`
<h1>Вход по роли</h1>
<p class="muted">Создаётся пользователь на сервере (POST /api/users). Запусти backend на порту 3000.</p>
<p id="login-error" class="error" hidden></p>
<form id="login-form" class="card form">
  <label>Имя <input name="name" required placeholder="Например, Артур" /></label>
  <label>Роль
    <select name="role" required>
      <option value="requester">Заявитель</option>
      <option value="operator">Оператор</option>
      <option value="manager">Руководитель</option>
    </select>
  </label>
  <button type="submit">Войти</button>
</form>
`;function O({target:r,onLogin:e}){r.innerHTML=E;const t=r.querySelector("#login-form"),s=r.querySelector("#login-error");t?.addEventListener("submit",async n=>{n.preventDefault(),d(s,"");const a=new FormData(t),i={name:String(a.get("name")),role:String(a.get("role"))};await w(t,async()=>{try{await e(i)}catch(c){d(s,c.message||"Не удалось войти")}})})}function o(r){return String(r??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const C={requester:"Заявитель",operator:"Оператор",manager:"Руководитель"},D={purchase:"Закупка",vacation:"Отпуск"},N={draft:"Черновик",pending_operator:"У оператора",pending_manager:"У руководителя",rework:"На доработке",approved:"Согласовано",rejected:"Отклонено"},P={create:"Создание",submit:"Подача на рассмотрение",approve:"Согласование",reject:"Отклонение",rework:"Возврат на доработку",forward:"Передача руководителю"};function R(r){return C[r]||r}function v(r){return D[r]||r}function S(r){return N[r]||r}function I(r){return P[r]||r}function H({target:r,user:e,tickets:t}){const s=t.map(c=>{const l=o(c.id),u=o(v(c.type)),m=o(S(c.status));return`
        <li class="card ticket-row">
          <div>
            <b>${l}</b> · ${u}
            <div class="muted">Статус: ${m}</div>
          </div>
          <a href="#/ticket?id=${encodeURIComponent(c.id)}">Открыть</a>
        </li>
      `}).join(""),n=o(e.name),a=o(R(e.role)),i=s||'<li class="muted">Пока нет заявок</li>';r.innerHTML=`
    <h1>Заявки</h1>
    <p class="muted">Текущий пользователь: ${n} (${a})</p>
    <div class="actions">
      <a class="button-link" href="#/tickets/new">Создать новую</a>
    </div>
    <ul class="list">${i}</ul>
  `}const M=`
<h1>Создание заявки</h1>
<form id="ticket-form" class="card form">
  <label>Тип
    <select name="type" id="ticket-type" required>
      <option value="purchase">Закупка</option>
      <option value="vacation">Отпуск</option>
    </select>
  </label>

  <div id="fields-purchase" class="field-group">
    <label>Наименование товара <input name="itemName" autocomplete="off" /></label>
    <label>Количество <input name="quantity" inputmode="numeric" autocomplete="off" /></label>
    <label>Цена <input name="price" inputmode="decimal" autocomplete="off" /></label>
    <label>Причина / обоснование <textarea name="reasonPurchase" required placeholder="Зачем нужна закупка"></textarea></label>
  </div>

  <div id="fields-vacation" class="field-group" hidden>
    <label>Дата начала <input name="startDate" type="date" /></label>
    <label>Дата окончания <input name="endDate" type="date" /></label>
    <label>Причина / комментарий <textarea name="reasonVacation" placeholder="Комментарий к отпуску"></textarea></label>
  </div>

  <button type="submit">Создать</button>
  <p id="create-error" class="error" hidden></p>
</form>
<p><a href="#/tickets">Назад к списку</a></p>
`;function T(r){const e=r.querySelector("#ticket-type"),t=r.querySelector("#fields-purchase"),s=r.querySelector("#fields-vacation");e?.value==="vacation"?(t?.setAttribute("hidden",""),s?.removeAttribute("hidden"),t?.querySelectorAll("input, textarea").forEach(a=>{(a.name==="itemName"||a.name==="quantity"||a.name==="price")&&(a.required=!1)}),s?.querySelector('[name="startDate"]')?.setAttribute("required",""),s?.querySelector('[name="endDate"]')?.setAttribute("required",""),s?.querySelector('[name="reasonVacation"]')?.setAttribute("required",""),t?.querySelector('[name="reasonPurchase"]')?.removeAttribute("required")):(s?.setAttribute("hidden",""),t?.removeAttribute("hidden"),t?.querySelector('[name="itemName"]')?.setAttribute("required",""),t?.querySelector('[name="quantity"]')?.setAttribute("required",""),t?.querySelector('[name="price"]')?.setAttribute("required",""),t?.querySelector('[name="reasonPurchase"]')?.setAttribute("required",""),s?.querySelectorAll("input, textarea").forEach(a=>a.removeAttribute("required")))}function j({target:r,onCreateTicket:e}){r.innerHTML=M,T(r),r.querySelector("#ticket-type")?.addEventListener("change",()=>T(r));const s=r.querySelector("#ticket-form"),n=r.querySelector("#create-error");s?.addEventListener("submit",async a=>{a.preventDefault(),d(n,"");const i=new FormData(s),c=String(i.get("type")),l=c==="purchase"?{itemName:String(i.get("itemName")||"").trim(),quantity:String(i.get("quantity")||"").trim(),price:String(i.get("price")||"").trim(),reason:String(i.get("reasonPurchase")||"").trim()}:{startDate:String(i.get("startDate")||"").trim(),endDate:String(i.get("endDate")||"").trim(),reason:String(i.get("reasonVacation")||"").trim()};await w(s,async()=>{try{await e({type:c,formData:l})}catch(u){d(n,u.message||"Не удалось создать заявку")}})})}const x=new Set(["approved","rejected"]);function g(r){if(!r)return"—";const e=new Date(r);return Number.isNaN(e.getTime())?String(r):e.toLocaleString()}function F(r){const e=Object.entries(r||{});return e.length?e.map(([t,s])=>`<tr><th scope="row">${o(t)}</th><td>${o(s)}</td></tr>`).join(""):'<tr><td colspan="2" class="muted">Нет данных формы</td></tr>'}function B(r){const e=Array.isArray(r)?r:[];return e.length?`<ul class="history-list">${e.map(t=>{const s=I(t.action),n=g(t.at),a=t.comment?o(t.comment):"—",i=t.toStatus?S(t.toStatus):"—";return`<li class="card history-item"><b>${o(s)}</b> · ${o(n)}<br/>
        <span class="muted">Актор:</span> ${o(t.actorId||"—")}<br/>
        <span class="muted">Комментарий:</span> ${a}<br/>
        <span class="muted">Статус:</span> ${o(i)}</li>`}).join("")}</ul>`:'<p class="muted">История пуста</p>'}function J(r,e){const{status:t}=r,{role:s}=e,n=[];return x.has(t)||((t==="draft"||t==="rework")&&s==="requester"&&n.push({key:"submit",label:"Подать на рассмотрение",requiresComment:!1}),t==="pending_operator"&&s==="operator"&&(n.push({key:"forward",label:"Передать руководителю",requiresComment:!1}),n.push({key:"rework",label:"Вернуть на доработку",requiresComment:!0})),t==="pending_manager"&&s==="manager"&&(n.push({key:"approve",label:"Согласовать",requiresComment:!1}),n.push({key:"reject",label:"Отклонить",requiresComment:!0}))),n}function K(r,e,t,s){const a={submit:()=>r.submitTicket(t,s),forward:()=>r.forwardTicket(t,s),rework:()=>r.reworkTicket(t,s),approve:()=>r.approveTicket(t,s),reject:()=>r.rejectTicket(t,s)}[e];return a?a():Promise.reject(new Error("Неизвестное действие"))}function k({target:r,ticket:e,currentUser:t,api:s,onUpdated:n}){const a=J(e,t),i=a.length===0?'<p class="muted">Нет доступных действий для этой роли и статуса.</p>':`<div class="actions-row">${a.map(u=>`<button type="button" class="action-btn" data-action="${o(u.key)}">${o(u.label)}</button>`).join("")}</div>`;r.innerHTML=`
    <h1>Заявка ${o(e.id)}</h1>
    <div class="card ticket-meta">
      <p><b>Тип:</b> ${o(v(e.type))}</p>
      <p><b>Статус:</b> ${o(S(e.status))}</p>
      <p><b>Автор (id):</b> ${o(e.createdBy)}</p>
      <p><b>Создана:</b> ${o(g(e.createdAt))}</p>
      <p><b>Обновлена:</b> ${o(g(e.updatedAt))}</p>
    </div>
    <h2>Данные формы</h2>
    <div class="card">
      <table>
        <tbody>${F(e.formData)}</tbody>
      </table>
    </div>
    <h2>История</h2>
    ${B(e.history)}
    <h2>Действия</h2>
    <div class="card actions-panel">
      ${i}
      <label>Комментарий (обязателен для «Вернуть на доработку» и «Отклонить»)
        <textarea id="ticket-action-comment" rows="3" placeholder="Комментарий"></textarea>
      </label>
      <p id="ticket-action-error" class="error" hidden></p>
    </div>
    <p><a href="#/tickets">Назад к списку</a></p>
  `;const c=r.querySelector("#ticket-action-error"),l=r.querySelector("#ticket-action-comment");r.querySelectorAll(".action-btn").forEach(u=>{u.addEventListener("click",async()=>{const m=u.getAttribute("data-action"),L=a.find(b=>b.key===m),f=(l?.value||"").trim();if(L?.requiresComment&&!f){d(c,"Для этого действия нужен комментарий.");return}d(c,"");const q={actorId:t.id,actorRole:t.role};f&&(q.comment=f),u.disabled=!0;try{await K(s,m,e.id,q),await n()}catch(b){d(c,b.message||"Ошибка")}finally{u.disabled=!1}})})}function y({target:r}){r.innerHTML='<h1>Заявка не найдена</h1><p><a href="#/tickets">Назад к списку</a></p>'}function V({target:r}){r.innerHTML=`
    <h1>404</h1>
    <p>Страница не найдена</p>
    <a href="#/login">На главную</a>
  `}const h="tfm_current_user",Y=`
<header class="topbar">
  <div class="brand">Task Flow Manager</div>
  <nav class="nav">
    <a href="#/login">Вход</a>
    <a href="#/tickets">Заявки</a>
    <a href="#/tickets/new">Создать</a>
    <a href="#/logout">Выйти</a>
  </nav>
</header>
<section class="container" id="view"></section>
`;function G(){const r=window.location.hash||"#/login",[e,t]=r.slice(1).split("?");return{path:e||"/login",query:new URLSearchParams(t||"")}}function p(r){window.location.hash=r}class W{constructor(e){this.root=e,this.state=new _;const t="";this.api=new U(t),this._restoreSession()}_restoreSession(){try{const e=sessionStorage.getItem(h);if(!e)return;const t=JSON.parse(e);t?.id&&t?.role&&(this.state.currentUser=t)}catch{sessionStorage.removeItem(h)}}_persistUser(e){this.state.currentUser=e,sessionStorage.setItem(h,JSON.stringify(e))}_clearSession(){this.state.currentUser=null,sessionStorage.removeItem(h)}init(){window.addEventListener("hashchange",()=>this.render()),this.render()}render(){if(!this.root)return;const{path:e,query:t}=G();if(e==="/logout"){this._clearSession(),p("#/login");return}this.root.innerHTML=Y;const s=document.getElementById("view");if(e==="/login"){O({target:s,onLogin:async n=>{const a=await this.api.createUser(n);this._persistUser(a),p("#/tickets")}});return}if(e==="/tickets"){if(!this.state.currentUser){p("#/login");return}this._renderTicketsLoading(s);return}if(e==="/tickets/new"){if(!this.state.currentUser){p("#/login");return}j({target:s,onCreateTicket:async({type:n,formData:a})=>{await this.api.createTicket({type:n,formData:a,createdBy:this.state.currentUser.id}),p("#/tickets")}});return}if(e==="/ticket"){const n=t.get("id");if(!n){y({target:s});return}if(!this.state.currentUser){p("#/login");return}this._renderTicketDetailsLoading(s,n);return}V({target:s})}_renderTicketsLoading(e){e.innerHTML='<p class="muted">Загрузка…</p>',this.api.listTickets({userId:this.state.currentUser.id,role:this.state.currentUser.role}).then(({items:t})=>{H({target:e,user:this.state.currentUser,tickets:t})}).catch(t=>{e.innerHTML=`<p class="error">${o(t.message)}</p><p><a href="#/tickets">Обновить</a></p>`})}_renderTicketDetailsLoading(e,t){const s=async()=>{e.innerHTML='<p class="muted">Загрузка…</p>';try{const n=await this.api.getTicket(t);k({target:e,ticket:n,currentUser:this.state.currentUser,api:this.api,onUpdated:s})}catch{y({target:e})}};e.innerHTML='<p class="muted">Загрузка…</p>',this.api.getTicket(t).then(n=>{k({target:e,ticket:n,currentUser:this.state.currentUser,api:this.api,onUpdated:s})}).catch(()=>{y({target:e})})}}const z=new W(document.getElementById("app"));z.init();
