(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}})();class U{currentUser=null}const x="";async function C(r){const e=await r.text();if(!e)return null;try{return JSON.parse(e)}catch{return{raw:e}}}class A{constructor(e=x){this.baseUrl=String(e||"").replace(/\/$/,"")}_url(e){const t=e.startsWith("/")?e:`/${e}`;return`${this.baseUrl}${t}`}async _request(e,{method:t="GET",body:s}={}){const n={method:t,headers:{Accept:"application/json"}};s!==void 0&&(n.headers["Content-Type"]="application/json",n.body=JSON.stringify(s));const a=await fetch(this._url(e),n),i=await C(a);if(!a.ok){const c=i?.message||i?.error||a.statusText||"Request failed",l=new Error(c);throw l.status=a.status,l.body=i,l}return i}health(){return this._request("/health")}signIn({name:e,role:t}){return this._request("/api/users",{method:"POST",body:{name:e,role:t}})}listUsers(){return this._request("/api/users")}getUser(e){return this._request(`/api/users/${encodeURIComponent(e)}`)}listTickets({userId:e,role:t}={}){const s=new URLSearchParams;e&&s.set("userId",e),t&&s.set("role",t);const n=s.toString();return this._request(`/api/tickets${n?`?${n}`:""}`)}getTicket(e){return this._request(`/api/tickets/${encodeURIComponent(e)}`)}createTicket({type:e,formData:t,createdBy:s}){return this._request("/api/tickets",{method:"POST",body:{type:e,formData:t,createdBy:s}})}submitTicket(e,t){return this._request(`/api/tickets/${encodeURIComponent(e)}/submit`,{method:"POST",body:t})}forwardTicket(e,t){return this._request(`/api/tickets/${encodeURIComponent(e)}/forward`,{method:"POST",body:t})}reworkTicket(e,t){return this._request(`/api/tickets/${encodeURIComponent(e)}/rework`,{method:"POST",body:t})}approveTicket(e,t){return this._request(`/api/tickets/${encodeURIComponent(e)}/approve`,{method:"POST",body:t})}rejectTicket(e,t){return this._request(`/api/tickets/${encodeURIComponent(e)}/reject`,{method:"POST",body:t})}}function p(r,e){r&&(e?(r.textContent=e,r.hidden=!1):(r.textContent="",r.hidden=!0))}async function $(r,e){const t=r?.querySelector('button[type="submit"]');t&&(t.disabled=!0);try{return await e()}finally{t&&(t.disabled=!1)}}const D=`
<h1>Вход по роли</h1>
<p class="muted">Один логин — одна учётная запись. Смена роли: снова «Войти» с тем же именем и другой ролью (тот же пользователь и заявки). Backend на порту 3000.</p>
<p id="login-error" class="error" hidden></p>
<form id="login-form" class="card form">
  <label>Логин <input name="name" required placeholder="Например, артур" autocomplete="username" /></label>
  <label>Роль
    <select name="role" required>
      <option value="requester">Заявитель</option>
      <option value="operator">Оператор</option>
      <option value="manager">Руководитель</option>
    </select>
  </label>
  <button type="submit">Войти</button>
</form>
`;function O({target:r,onLogin:e,initialName:t=""}){r.innerHTML=D;const s=r.querySelector("#login-form"),n=r.querySelector("#login-error"),a=s?.querySelector('input[name="name"]');a&&t&&(a.value=t),s?.addEventListener("submit",async i=>{i.preventDefault(),p(n,"");const c=new FormData(s),l={name:String(c.get("name")),role:String(c.get("role"))};await $(s,async()=>{try{await e(l)}catch(d){p(n,d.message||"Не удалось войти")}})})}function o(r){return String(r??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const R={requester:"Заявитель",operator:"Оператор",manager:"Руководитель"},I={purchase:"Закупка",vacation:"Отпуск"},N={draft:"Черновик",pending_operator:"У оператора",pending_manager:"У руководителя",rework:"На доработке",approved:"Согласовано",rejected:"Отклонено"},F={create:"Создание",submit:"Подача на рассмотрение",approve:"Согласование",reject:"Отклонение",rework:"Возврат на доработку",forward:"Передача руководителю"};function M(r){return R[r]||r}function _(r){return I[r]||r}function S(r){return N[r]||r}function H(r){return F[r]||r}function P({target:r,user:e,tickets:t}){const s=t.map(c=>{const l=o(c.id),d=o(_(c.type)),g=o(S(c.status));return`
        <li class="card ticket-row">
          <div>
            <b>${l}</b> · ${d}
            <div class="muted">Статус: ${g}</div>
          </div>
          <a href="#/ticket?id=${encodeURIComponent(c.id)}">Открыть</a>
        </li>
      `}).join(""),n=o(e.name),a=o(M(e.role)),i=s||'<li class="muted">Пока нет заявок</li>';r.innerHTML=`
    <h1>Заявки</h1>
    <p class="muted">Текущий пользователь: ${n} (${a})</p>
    <div class="actions">
      <a class="button-link" href="#/tickets/new">Создать новую</a>
    </div>
    <ul class="list">${i}</ul>
  `}const h="create-ticket-form";function j(){return{type:"purchase"}}function B(r){return r==="vacation"?`
      <label>Дата начала <input name="startDate" type="date" required /></label>
      <label>Дата окончания <input name="endDate" type="date" required /></label>
      <label>Причина / комментарий <textarea name="reason" required placeholder="Комментарий к отпуску"></textarea></label>
    `:`
    <label>Наименование товара <input name="itemName" autocomplete="off" required /></label>
    <label>Количество <input name="quantity" inputmode="numeric" autocomplete="off" required /></label>
    <label>Цена <input name="price" inputmode="decimal" autocomplete="off" required /></label>
    <label>Причина / обоснование <textarea name="reason" required placeholder="Зачем нужна закупка"></textarea></label>
  `}function Y(r,e){const t=new FormData(e);return r==="vacation"?{startDate:String(t.get("startDate")||"").trim(),endDate:String(t.get("endDate")||"").trim(),reason:String(t.get("reason")||"").trim()}:{itemName:String(t.get("itemName")||"").trim(),quantity:String(t.get("quantity")||"").trim(),price:String(t.get("price")||"").trim(),reason:String(t.get("reason")||"").trim()}}class J extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.state=j(),this.onCreateTicket=null}connectedCallback(){this.render()}render(){if(!this.shadowRoot)return;this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
        }

        .form {
          display: grid;
          gap: 10px;
          max-width: 520px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          padding: 14px;
        }

        label {
          display: grid;
          gap: 6px;
        }

        input,
        textarea,
        select,
        button {
          font: inherit;
        }

        input,
        textarea,
        select {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 8px 10px;
        }

        button {
          border: 1px solid #222;
          border-radius: 8px;
          background: #222;
          color: #fff;
          padding: 8px 12px;
          cursor: pointer;
          width: fit-content;
        }

        .field-group {
          display: grid;
          gap: 10px;
        }

        .error {
          color: #b00020;
          margin: 0 0 8px;
        }
      </style>

      <h1>Создание заявки</h1>
      <form id="ticket-form" class="form">
        <label>Тип
          <select name="type" id="ticket-type" required>
            <option value="purchase" ${this.state.type==="purchase"?"selected":""}>Закупка</option>
            <option value="vacation" ${this.state.type==="vacation"?"selected":""}>Отпуск</option>
          </select>
        </label>

        <div class="field-group" id="dynamic-fields">
          ${B(this.state.type)}
        </div>

        <button type="submit">Создать</button>
        <p id="create-error" class="error" hidden></p>
      </form>
      <p><a href="#/tickets">Назад к списку</a></p>
    `;const e=this.shadowRoot.querySelector("#ticket-type"),t=this.shadowRoot.querySelector("#ticket-form"),s=this.shadowRoot.querySelector("#create-error");e?.addEventListener("change",n=>{this.state={...this.state,type:String(n.target.value||"purchase")},this.render()}),t?.addEventListener("submit",async n=>{n.preventDefault(),p(s,"");const a=this.state.type,i=Y(a,t);await $(t,async()=>{try{await this.onCreateTicket?.({type:a,formData:i})}catch(c){p(s,c.message||"Не удалось создать заявку")}})})}}customElements.get(h)||customElements.define(h,J);function G({target:r,onCreateTicket:e}){r.innerHTML=`<${h}></${h}>`;const t=r.querySelector(h);t&&(t.onCreateTicket=e)}const L={purchase:["itemName","quantity","price","reason"],vacation:["startDate","endDate","reason"]},K={itemName:"Наименование товара",quantity:"Количество",price:"Цена",reason:"Причина / обоснование",startDate:"Дата начала",endDate:"Дата окончания"};function W(r){return K[r]||r}const z=new Set(["approved","rejected"]);function k(r){if(!r)return"—";const e=new Date(r);return Number.isNaN(e.getTime())?String(r):e.toLocaleString()}function Q(r,e){const t=r||{},n=(e&&L[e]?L[e]:Object.keys(t)).map(a=>{const i=t[a];return i==null||i===""?null:`<tr><th scope="row">${o(W(a))}</th><td>${o(String(i))}</td></tr>`}).filter(Boolean);return n.length?n.join(""):'<tr><td colspan="2" class="muted">Нет данных формы</td></tr>'}function V(r){const e=Array.isArray(r)?r:[];return e.length?`<ul class="history-list">${e.map(t=>{const s=H(t.action),n=k(t.at),a=t.comment?o(t.comment):"—",i=t.toStatus?S(t.toStatus):"—";return`<li class="card history-item"><b>${o(s)}</b> · ${o(n)}<br/>
        <span class="muted">Актор:</span> ${o(t.actorId||"—")}<br/>
        <span class="muted">Комментарий:</span> ${a}<br/>
        <span class="muted">Статус:</span> ${o(i)}</li>`}).join("")}</ul>`:'<p class="muted">История пуста</p>'}function X(r,e){const{status:t}=r,{role:s}=e,n=[];return z.has(t)||((t==="draft"||t==="rework")&&s==="requester"&&n.push({key:"submit",label:"Подать на рассмотрение",requiresComment:!1}),t==="pending_operator"&&s==="operator"&&(n.push({key:"forward",label:"Передать руководителю",requiresComment:!1}),n.push({key:"rework",label:"Вернуть на доработку",requiresComment:!0})),t==="pending_manager"&&s==="manager"&&(n.push({key:"approve",label:"Согласовать",requiresComment:!1}),n.push({key:"reject",label:"Отклонить",requiresComment:!0}))),n}function Z(r,e,t,s){const a={submit:()=>r.submitTicket(t,s),forward:()=>r.forwardTicket(t,s),rework:()=>r.reworkTicket(t,s),approve:()=>r.approveTicket(t,s),reject:()=>r.rejectTicket(t,s)}[e];return a?a():Promise.reject(new Error("Неизвестное действие"))}function v({target:r,ticket:e,currentUser:t,api:s,onUpdated:n}){const a=X(e,t),i=a.some(u=>u.requiresComment),c=a.length===0?'<p class="muted">Нет доступных действий для этой роли и статуса.</p>':`<div class="actions-row">${a.map(u=>`<button type="button" class="action-btn" data-action="${o(u.key)}">${o(u.label)}</button>`).join("")}</div>`,l=a.length>0&&i?`<label>Комментарий (обязателен для «Вернуть на доработку» и «Отклонить»)
        <textarea id="ticket-action-comment" rows="3" placeholder="Комментарий"></textarea>
      </label>`:"";r.innerHTML=`
    <h1>Заявка ${o(e.id)}</h1>
    <div class="card ticket-meta">
      <p><b>Тип:</b> ${o(_(e.type))}</p>
      <p><b>Статус:</b> ${o(S(e.status))}</p>
      <p><b>Автор (id):</b> ${o(e.createdBy)}</p>
      <p><b>Создана:</b> ${o(k(e.createdAt))}</p>
      <p><b>Обновлена:</b> ${o(k(e.updatedAt))}</p>
    </div>
    <h2>Данные формы</h2>
    <div class="card">
      <table>
        <tbody>${Q(e.formData,e.type)}</tbody>
      </table>
    </div>
    <h2>История</h2>
    ${V(e.history)}
    <h2>Действия</h2>
    <div class="card actions-panel">
      ${c}
      ${l}
      <p id="ticket-action-error" class="error" hidden></p>
    </div>
    <p><a href="#/tickets">Назад к списку</a></p>
  `;const d=r.querySelector("#ticket-action-error"),g=r.querySelector("#ticket-action-comment");r.querySelectorAll(".action-btn").forEach(u=>{u.addEventListener("click",async()=>{const w=u.getAttribute("data-action"),E=a.find(y=>y.key===w),b=(g?.value||"").trim();if(E?.requiresComment&&!b){p(d,"Для этого действия нужен комментарий.");return}p(d,"");const q={actorId:t.id,actorRole:t.role};b&&(q.comment=b),u.disabled=!0;try{await Z(s,w,e.id,q),await n()}catch(y){p(d,y.message||"Ошибка")}finally{u.disabled=!1}})})}function T({target:r}){r.innerHTML='<h1>Заявка не найдена</h1><p><a href="#/tickets">Назад к списку</a></p>'}function ee({target:r}){r.innerHTML=`
    <h1>404</h1>
    <p>Страница не найдена</p>
    <a href="#/login">На главную</a>
  `}const f="tfm_current_user",te=`
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
`;function re(){const r=window.location.hash||"#/login",[e,t]=r.slice(1).split("?");return{path:e||"/login",query:new URLSearchParams(t||"")}}function m(r){window.location.hash=r}class ne{constructor(e){this.root=e,this.state=new U;const t="";this.api=new A(t),this._restoreSession()}_restoreSession(){try{const e=sessionStorage.getItem(f);if(!e)return;const t=JSON.parse(e);t?.id&&t?.role&&(this.state.currentUser=t)}catch{sessionStorage.removeItem(f)}}_persistUser(e){this.state.currentUser=e,sessionStorage.setItem(f,JSON.stringify(e))}_clearSession(){this.state.currentUser=null,sessionStorage.removeItem(f)}init(){window.addEventListener("hashchange",()=>this.render()),this.render()}render(){if(!this.root)return;const{path:e,query:t}=re();if(e==="/logout"){this._clearSession(),m("#/login");return}this.root.innerHTML=te;const s=document.getElementById("view");if(e==="/login"){O({target:s,initialName:this.state.currentUser?.name??"",onLogin:async n=>{const a=await this.api.signIn(n);this._persistUser(a),m("#/tickets")}});return}if(e==="/tickets"){if(!this.state.currentUser){m("#/login");return}this._renderTicketsLoading(s);return}if(e==="/tickets/new"){if(!this.state.currentUser){m("#/login");return}G({target:s,onCreateTicket:async({type:n,formData:a})=>{await this.api.createTicket({type:n,formData:a,createdBy:this.state.currentUser.id}),m("#/tickets")}});return}if(e==="/ticket"){const n=t.get("id");if(!n){T({target:s});return}if(!this.state.currentUser){m("#/login");return}this._renderTicketDetailsLoading(s,n);return}ee({target:s})}_renderTicketsLoading(e){e.innerHTML='<p class="muted">Загрузка…</p>',this.api.listTickets({userId:this.state.currentUser.id,role:this.state.currentUser.role}).then(({items:t})=>{P({target:e,user:this.state.currentUser,tickets:t})}).catch(t=>{e.innerHTML=`<p class="error">${o(t.message)}</p><p><a href="#/tickets">Обновить</a></p>`})}_renderTicketDetailsLoading(e,t){const s=async()=>{e.innerHTML='<p class="muted">Загрузка…</p>';try{const n=await this.api.getTicket(t);v({target:e,ticket:n,currentUser:this.state.currentUser,api:this.api,onUpdated:s})}catch{T({target:e})}};e.innerHTML='<p class="muted">Загрузка…</p>',this.api.getTicket(t).then(n=>{v({target:e,ticket:n,currentUser:this.state.currentUser,api:this.api,onUpdated:s})}).catch(()=>{T({target:e})})}}const se=new ne(document.getElementById("app"));se.init();
