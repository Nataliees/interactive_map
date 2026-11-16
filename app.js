'use strict';
(() => {
  const KEY = 'dolce-reservations-v1';
  const originalCapacities = [2,2,4,4,2,6,4,6];
  const tables = Array.from({length:32}, (_,i)=> {
    const id=i+1, side=id>20, capacity=originalCapacities[i] || (side?4: i%4===0?6:2);
    return {id,capacity,rate:capacity===2?500:capacity===4?800:1200,
      zone:side?(id<=26?'Лаунж у окна':'Мягкие диваны'):id<=8?'У сцены':'В центре зала',
      x:side?(id<=26?8:92):26+(i%4)*16,
      y:side?24+((id-21)%6)*12:27+Math.floor(i/4)*13,
      shape:side?'booth':capacity===6?'long':'round'};
  });
  let orderTable=null, category=2, activeDish=10;
  const categories=['Закуски','Первые блюда','Вторые блюда','Напитки б/а','Десерты','Алкоголь'];
  const $ = id => document.getElementById(id);
  const money = value => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
  const screens = {booking:document.querySelector('.booking-panel'),menu:$('menu')};
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const viewRoutes = new Set(['#booking','#my-bookings','#menu','#menu-cart']);
  let currentView = null, transitionNumber = 0, viewAnimations = [], transitionDone = Promise.resolve();

  function scrollPanelTo(panel, element, smooth = false) {
    const top = element === panel ? 0 : panel.scrollTop + element.getBoundingClientRect().top - panel.getBoundingClientRect().top - 18;
    panel.scrollTo({top:Math.max(0,top),behavior:smooth && !reducedMotion.matches?'smooth':'instant'});
  }
  async function navigateView(route, {push=true, animate=true, focus=true, focusElement=null, preserveScroll=false} = {}) {
    if(!viewRoutes.has(route)) return false;
    const next = route === '#menu' || route === '#menu-cart' ? 'menu' : 'booking';
    const destination = screens[next], previous = currentView && screens[currentView];
    if(push && location.hash !== route) history.pushState(null,'',route);
    if(next !== currentView) {
      const number = ++transitionNumber;
      viewAnimations.forEach(animation=>animation.cancel());
      viewAnimations=[];
      document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());
      Object.entries(screens).forEach(([name,panel])=>{
        const active=name===next;
        panel.hidden=!active && panel!==previous;
        panel.inert=!active;
        panel.setAttribute('aria-hidden',String(!active));
        panel.classList.toggle('is-active',active);
      });
      currentView=next;
      const direction=next==='menu'?1:-1;
      if(previous && animate && !reducedMotion.matches && typeof destination.animate==='function') {
        viewAnimations=[
          previous.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:`translateX(${-direction*5}%)`}],{duration:280,easing:'ease-out'}),
          destination.animate([{opacity:0,transform:`translateX(${direction*8}%)`},{opacity:1,transform:'translateX(0)'}],{duration:360,easing:'cubic-bezier(.22,.7,.2,1)'})
        ];
      }
      transitionDone=Promise.allSettled(viewAnimations.map(animation=>animation.finished)).then(()=>{
        if(number!==transitionNumber)return;
        Object.entries(screens).forEach(([name,panel])=>{panel.hidden=name!==currentView;});
        viewAnimations=[];
      });
    }
    const number=transitionNumber;
    document.querySelectorAll('header nav a').forEach(link=>{
      if(link.getAttribute('href')===route)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    });
    // Reveal a routed subsection before moving focus; other view positions stay intact.
    if(route==='#menu-cart')$('menu-cart').open=true;
    if(!preserveScroll)scrollPanelTo(destination,document.querySelector(route));
    else if(focusElement)scrollPanelTo(destination,focusElement);
    await transitionDone;
    if(number!==transitionNumber)return false;
    if(focus){
      const target=focusElement || (route==='#my-bookings'?$('my-title'):route==='#menu-cart'?$('menu-cart').querySelector('summary'):next==='menu'?$('menu-title'):$('booking-title'));
      if(!target.matches('a,button,input,select,summary,[tabindex]'))target.tabIndex=-1;
      target.focus({preventScroll:true});
    }
    return true;
  }
  document.addEventListener('click',event=>{
    if(event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)return;
    const switchButton=event.target.closest('button[data-screen]');
    if(switchButton){event.preventDefault();navigateView('#'+switchButton.dataset.screen,{preserveScroll:true});return;}
    const link=event.target.closest('a[href^="#"]');
    if(link && viewRoutes.has(link.getAttribute('href'))){event.preventDefault();navigateView(link.getAttribute('href'));}
  });
  const restoreView=()=>navigateView(viewRoutes.has(location.hash)?location.hash:'#booking',{push:false});
  window.addEventListener('popstate',restoreView);
  window.addEventListener('hashchange',restoreView);

  const initial = () => ({version:1, bookings:[]});
  let state = initial(), selected = null, storageOK = true;
  function storageError(text) { storageOK = false; $('storage-error').hidden = false; $('storage-error').textContent = text; }
  function validate(value) {
    if (!value || value.version !== 1 || !Array.isArray(value.bookings)) throw Error('format');
    const ids = new Set();
    for (const b of value.bookings) {
      const t = tables.find(t => t.id === b.tableId);
      if (!t || [2,6].includes(t.id) || ids.has(t.id) || !Number.isInteger(b.guests) || b.guests < 1 || b.guests > t.capacity || !Number.isInteger(b.hours) || b.hours < 1 || b.hours > 6) throw Error('booking');
      ids.add(t.id);
    }
    const cleanItems = items => {
      if(!Array.isArray(items)) throw Error('items');
      const seen=new Set();
      return items.map(item=> {
        if(!item || !DOLCE_MENU.some(d=>d.id===item.dishId) || seen.has(item.dishId) || !Number.isInteger(item.quantity) || item.quantity<1 || item.quantity>99) throw Error('item');
        seen.add(item.dishId); return {dishId:item.dishId,quantity:item.quantity};
      });
    };
    return {version:1,bookings:value.bookings.map(({tableId,guests,hours,cart=[],orders=[]})=> {
      if(!Array.isArray(orders)) throw Error('orders');
      const seen=new Set();
      const cleanOrders=orders.map(o=> {
        if(!o || typeof o.id!=='string' || seen.has(o.id) || !o.items?.length) throw Error('order');
        seen.add(o.id);return {id:o.id,items:cleanItems(o.items)};
      });
      return {tableId,guests,hours,cart:cleanItems(cart),orders:cleanOrders};
    })};
  }
  function read() {
    try { const raw = localStorage.getItem(KEY); return raw === null ? initial() : validate(JSON.parse(raw)); }
    catch { storageError('Не удалось прочитать сохранённые брони. Работа продолжается в памяти вкладки; после перезагрузки изменения могут пропасть. Сброс броней позволяет восстановить сохранение.'); return null; }
  }
  state = read() || initial();
  function persist(next) {
    state = next;
    try { localStorage.setItem(KEY, JSON.stringify(state)); storageOK = true; $('storage-error').hidden = true; }
    catch { storageError('Бронь изменена только в памяти вкладки: браузер не разрешил сохранение. После перезагрузки изменения могут пропасть.'); }
  }
  function sync() { if (storageOK) { const latest = read(); if (latest) state = latest; } }
  const occupied = id => [2,6].includes(id) || state.bookings.some(b=>b.tableId===id);
  const matches = t => t.capacity >= Number($('capacity').value) && (!Number($('rate').value) || t.rate === Number($('rate').value));
  function say(text) { $('message').textContent = text; }
  function tableButton(t, list) {
    const busy = occupied(t.id), button = document.createElement('button');
    button.type = 'button'; button.className = list ? 'list-button' : `table-button ${t.shape}`; button.disabled = busy;
    if(!list){button.style.left=t.x+'%';button.style.top=t.y+'%';button.classList.toggle('filtered',!matches(t));if(!matches(t)){button.disabled=true;button.setAttribute('aria-hidden','true');}}
    button.dataset.tableId=t.id;
    button.setAttribute('aria-pressed', String(selected === t.id));
    button.setAttribute('aria-label', `Столик №${t.id}, ${t.capacity} места, ${t.rate} рублей в час, ${t.zone}, ${busy?'занят':'свободен'}`);
    button.innerHTML = list ? `<span>Столик №${t.id}<small>${t.zone} · до ${t.capacity} гостей · ${money(t.rate)}/ч</small></span><span>${busy?'Занят':selected===t.id?'Выбран':'Выбрать'}</span>` : `<strong>${String(t.id).padStart(2,'0')}</strong><small>${t.capacity} места</small><small class=map-status>${busy?'Занят':selected===t.id?'Выбран':''}</small>`;
    button.addEventListener('click',()=> { sync(); if(occupied(t.id)){selected=null;render();say('Этот столик уже занят. Выберите другой.');return;} selected=t.id;render();(list ? $('table-list') : $('map')).querySelector('[aria-pressed="true"]').focus();say(`Выбран столик №${t.id}. Укажите гостей и часы.`);if(matchMedia('(max-width:1050px)').matches)scrollPanelTo(screens.booking,document.querySelector('.reservation'),true); });
    return button;
  }
  function render() {
    if(selected && occupied(selected)) selected = null;
    const visible = tables.filter(matches);
    if(selected && !visible.some(t=>t.id===selected)) selected=null;
    $('map').replaceChildren(...tables.map(t=>tableButton(t,false)));
    $('table-list').replaceChildren(...visible.map(t=>tableButton(t,true)));
    $('no-results').hidden=visible.length>0;
    $('available').textContent=`${tables.filter(t=>!occupied(t.id)).length} из ${tables.length} свободны`;
    $('count').textContent=state.bookings.length;
    $('to-menu').hidden=!state.bookings.length;
    const t=tables.find(t=>t.id===selected), previous=Number($('guests').value)||1;
    $('guests').replaceChildren(...Array.from({length:t?t.capacity:6},(_,i)=>new Option(String(i+1),String(i+1))));
    $('guests').value=String(Math.min(previous,t?t.capacity:6));
    $('guests').disabled=!t;
    $('confirm').disabled=!t;
    $('selection').textContent=t?`Столик №${t.id} · ${t.zone} · до ${t.capacity} гостей`:'Выберите свободное место на схеме или в списке.';
    updateTotal();
    $('bookings').replaceChildren();
    if(!state.bookings.length){const p=document.createElement('p');p.className='empty';p.textContent='Здесь появятся ваши встречи. Выберите первый столик.';$('bookings').append(p);}
    state.bookings.forEach(b=> {
      const table=tables.find(t=>t.id===b.tableId), card=document.createElement('article');card.className='booking-card';
      card.innerHTML=`<div><h3>Столик №${table.id} · ${table.zone}</h3><p>Гостей: ${b.guests} · Часов: ${b.hours} · ${money(table.rate*b.hours)}</p><p>Активна до отмены</p><div class="booking-orders">${(b.orders||[]).map((o,i)=>`<p><b>Заказ ${i+1} · ${money(itemsTotal(o.items))}</b><br>${o.items.map(item=>`${DOLCE_MENU.find(d=>d.id===item.dishId).name} × ${item.quantity}`).join(' · ')}</p>`).join('')}</div></div>`;
      const order=document.createElement('button');order.textContent='Заказать к столу ↗';order.className='order-link';order.addEventListener('click',()=>{orderTable=table.id;renderMenu();navigateView('#menu',{focusElement:$('order-table'),preserveScroll:true});});card.append(order);
      const cancel=document.createElement('button');cancel.textContent='Отменить бронь';cancel.setAttribute('aria-label',`Отменить бронь столика №${table.id}`);
      cancel.addEventListener('click',()=>{sync();persist({...state,bookings:state.bookings.filter(x=>x.tableId!==table.id)});render();say(`Бронь столика №${table.id} отменена. Столик свободен.`);$('my-title').tabIndex=-1;$('my-title').focus();});card.append(cancel);$('bookings').append(card);
    });
    renderMenu();
  }
  function updateTotal(){const t=tables.find(t=>t.id===selected), hours=Number($('hours').value);$('total').textContent=t?money(t.rate*hours):'—';$('formula').textContent=t?`${money(t.rate)} × ${hours} ч`:'Тариф × часы';}
  ['capacity','rate'].forEach(id=>$(id).addEventListener('change',()=>{render();say('Фильтры применены.');}));
  $('hours').addEventListener('change',updateTotal);
  $('reservation-form').addEventListener('submit', async event=> {
    event.preventDefault(); $('confirm').disabled=true;
    const book=()=> {
      sync();const t=tables.find(t=>t.id===selected),guests=Number($('guests').value),hours=Number($('hours').value);
      if(!t || occupied(t.id)){selected=null;render();say('Выберите свободный столик. Повторная бронь не создана.');return;}
      if(!Number.isInteger(guests)||guests<1||guests>t.capacity||!Number.isInteger(hours)||hours<1||hours>6){render();say('Проверьте количество гостей и часов.');return;}
      persist({...state,bookings:[...state.bookings,{tableId:t.id,guests,hours,cart:[],orders:[]}]});orderTable=t.id;selected=null;render();say(`Готово! Столик №${t.id} забронирован за ${money(t.rate*hours)}. Можно выбрать блюда в меню.`);
    };
    try { if(navigator.locks) await navigator.locks.request(KEY,book); else book(); } catch {render();say('Не удалось подтвердить бронь. Попробуйте ещё раз.');}
  });
  $('reset').addEventListener('click',()=>$('reset-dialog').showModal());
  $('keep').addEventListener('click',()=>$('reset-dialog').close());
  $('reset-confirm').addEventListener('click',()=>{persist(initial());selected=null;$('capacity').value='0';$('rate').value='0';$('hours').value='2';render();$('reset-dialog').close();say('Брони сброшены. Столики №2 и №6 заняты, остальные свободны.');});
  window.addEventListener('storage',event=>{if(event.key===KEY||event.key===null){const latest=read();if(latest){state=latest;render();say('Брони обновлены из другой вкладки.');}}});
  function itemsTotal(items){return items.reduce((sum,item)=>sum+DOLCE_MENU.find(d=>d.id===item.dishId).price*item.quantity,0);}
  function currentBooking(){return state.bookings.find(b=>b.tableId===orderTable);}
  function changeCart(dishId,delta){
    sync(); const b=currentBooking();
    if(!b){render();$('order-message').textContent='Сначала забронируйте столик.';return;}
    const cart=(b.cart||[]).map(item=>({...item})), item=cart.find(x=>x.dishId===dishId);
    if(item) item.quantity=Math.min(99,item.quantity+delta);else if(delta>0)cart.push({dishId,quantity:1});
    persist({...state,bookings:state.bookings.map(x=>x.tableId===b.tableId?{...x,cart:cart.filter(x=>x.quantity>0)}:x)});
    renderMenu();$('order-message').textContent=delta>0?'Добавлено к заказу.':'Количество обновлено.';
  }
  function dishArt(category){
    const art=[
      '<ellipse cx="145" cy="100" rx="35" ry="14" transform="rotate(-30 145 100)"/><ellipse cx="190" cy="91" rx="30" ry="13" transform="rotate(30 190 91)"/><ellipse cx="173" cy="130" rx="35" ry="14" transform="rotate(-10 173 130)"/><circle cx="139" cy="131" r="11" fill="#ad9c78"/><circle cx="204" cy="118" r="10" fill="#ad9c78"/>',
      '<ellipse cx="170" cy="113" rx="63" ry="40" fill="#c2cba8"/><ellipse cx="170" cy="110" rx="51" ry="30" fill="#b2bf92"/><path d="M137 110 Q170 88 202 110 M146 123 Q172 105 194 123" fill="none" stroke="#f7f2ec" stroke-width="4"/><path d="M155 60 Q146 45 157 32 M180 58 Q168 45 183 29" fill="none" stroke="#9eac83" stroke-width="2"/>',
      '<g fill="none" stroke="#b6aa80" stroke-width="5"><path d="M125 96 Q170 62 211 100 Q171 145 128 116 Q157 74 199 113 Q172 151 140 126"/><path d="M133 90 Q176 121 205 91 M142 135 Q186 100 210 120"/></g><path d="M178 88 Q203 62 212 80 Q196 100 178 88"/>',
      '<path d="M140 55 H205 L194 151 H151 Z" fill="#c2cba8" stroke="#9eac83" stroke-width="2"/><path d="M148 86 H199 L192 143 H155 Z" fill="#adb98c"/><path d="M179 110 L192 39" stroke="#7c8b60" stroke-width="4"/><circle cx="148" cy="70" r="22" fill="#ded8ab" stroke="#b9ae77" stroke-width="2"/>',
      '<path d="M130 91 L182 66 L216 97 L162 122 Z" fill="#ded7bc"/><path d="M130 91 V130 L162 151 V122 Z" fill="#c1b18c"/><path d="M162 122 L216 97 V131 L162 151 Z" fill="#e7dec4"/><path d="M131 112 L161 134 L215 114" fill="none" stroke="#b0a07a" stroke-width="5"/><circle cx="178" cy="84" r="10" fill="#9c8d76"/>',
      '<path d="M144 43 H198 L192 98 Q171 128 150 98 Z" fill="#e4e4d3" stroke="#9eac83" stroke-width="2"/><path d="M147 75 H195 L190 97 Q171 118 152 97 Z" fill="#a4ad87"/><path d="M171 113 V152 M148 154 H195" fill="none" stroke="#9eac83" stroke-width="3"/>'
    ][category];
    return `<svg class="dish-art" width="340" height="200" viewBox="0 0 340 200" aria-hidden="true"><ellipse cx="170" cy="124" rx="90" ry="56" fill="#c7cfb7" opacity=".4"/><ellipse cx="170" cy="111" rx="91" ry="59" fill="#f7f2ec"/><ellipse cx="170" cy="111" rx="77" ry="48" fill="none" stroke="#d5d9c7"/><g fill="#87986b">${art}</g><path d="M53 67 V144 M47 67 V89 Q53 101 59 89 V67 M286 67 V144 M280 68 V108 H286" fill="none" stroke="#9eac83" stroke-width="3" stroke-linecap="round"/></svg>`;
  }
  function renderFeature(d,canOrder){
    const feature=$('dish-feature');feature.replaceChildren();
    if(!d){feature.innerHTML=`<div class="feature-empty">${dishArt(category<0?2:category)}<h3>Найдите свой вкус</h3><p>Выберите блюдо в списке ниже.</p></div>`;return;}
    feature.innerHTML=`<div class="feature-photo">${dishArt(d.category)}<img src="${d.image}" alt="${d.name}"></div><article class="feature-copy"><span class="feature-tag">${categories[d.category]}</span><button type="button" class="feature-close" aria-label="Закрыть карточку блюда">×</button><h3>${d.name}</h3><p class="feature-description">${d.description}</p><p class="feature-ingredients">${d.ingredients.join(', ')}.</p><span class="feature-weight">${d.weight}</span><strong class="feature-price">${money(d.price)}</strong><div class="feature-actions"></div></article>`;
    const photo=feature.querySelector('img');photo.addEventListener('load',()=>photo.classList.add('loaded'));photo.addEventListener('error',()=>photo.remove());
    feature.querySelector('.feature-close').addEventListener('click',()=>{activeDish=null;renderMenu();$('dishes').querySelector(`[data-dish="${d.id}"]`)?.focus({preventScroll:true});});
    const add=document.createElement('button');add.className='primary feature-add';add.dataset.add=d.id;add.textContent=canOrder?'Заказать к столику →':'Сначала выберите столик';add.disabled=!canOrder;add.addEventListener('click',()=>{changeCart(d.id,1);$('dish-feature').querySelector('.feature-add')?.focus({preventScroll:true});});
    feature.querySelector('.feature-actions').append(add);
    if(!canOrder){const link=document.createElement('a');link.href='#booking';link.className='feature-book';link.textContent='Забронировать столик →';feature.querySelector('.feature-actions').append(link);}
    const details=document.createElement('button');details.className='dish-more';details.textContent='Состав и аллергены';details.addEventListener('click',()=>{$('dish-detail').innerHTML=`<p class="eyebrow">${categories[d.category]}</p><h2 id="dish-title">${d.name}</h2><p>${d.description}</p><p><b>Состав:</b> ${d.ingredients.join(', ')}.</p><p>${d.weight} · ${money(d.price)}</p><p class="fine">При аллергии уточните состав у администратора.</p>`;$('dish-dialog').showModal();});feature.querySelector('.feature-actions').append(details);
  }
  function renderMenu(){
    if(!currentBooking()) orderTable=state.bookings[0]?.tableId||null;
    $('order-table').replaceChildren(...(state.bookings.length?state.bookings.map(b=>new Option(`Столик №${b.tableId}`,String(b.tableId))):[new Option('Сначала забронируйте столик','')]));
    $('order-table').value=orderTable?String(orderTable):'';
    $('order-table').disabled=!state.bookings.length;
    const b=currentBooking();
    $('menu-notice').textContent=b?`Выбирайте блюда для столика №${b.tableId}. Стоимость брони оплачивается отдельно.`:'Меню открыто для просмотра. Чтобы добавить блюда к заказу, сначала забронируйте столик.';
    const icons=[
      '<path d="M8 26 Q5 8 28 5 Q30 25 8 26 Z M8 26 L25 9 M15 19 L14 12 M20 15 L26 16"/>',
      '<path d="M5 18 H31 Q30 29 18 29 Q6 29 5 18 Z M3 18 H33 M11 32 H25 M13 12 Q9 9 13 5 M21 12 Q17 9 21 5"/>',
      '<path d="M5 24 Q5 11 18 11 Q31 11 31 24 M3 24 H33 M8 28 H28 M18 11 V7 M15 7 H21 M12 18 L15 15 M20 17 L23 20"/>',
      '<path d="M9 9 H27 L24 31 H12 Z M18 25 L22 3 M11 16 H25 M11 6 H25"/>',
      '<path d="M6 17 L21 10 L30 17 V29 H6 Z M6 17 H30 M6 23 H30 M18 10 V5 M16 5 Q18 1 20 5"/>',
      '<path d="M10 4 H26 L25 14 Q18 25 11 14 Z M18 21 V32 M11 32 H25"/>'
    ];
    $('menu-categories').replaceChildren(...categories.map((name,index)=>{
      const button=document.createElement('button');button.className='route-stop';button.innerHTML=`<span class="route-icon"><svg width="27" height="27" viewBox="0 0 36 36" aria-hidden="true">${icons[index]}</svg></span><span class="route-name">${name}</span>`;
      button.setAttribute('aria-pressed',String(category===index));button.addEventListener('click',()=>{category=index;activeDish=DOLCE_MENU.find(d=>d.category===index)?.id??null;renderMenu();$('menu-categories').children[index].focus({preventScroll:true});});return button;
    }));
    const all=document.createElement('button');all.className='all-menu';all.textContent='Всё меню';all.setAttribute('aria-pressed',String(category===-1));all.addEventListener('click',()=>{category=-1;renderMenu();$('menu-categories').lastElementChild.focus({preventScroll:true});});$('menu-categories').append(all);
    const query=$('dish-search').value.trim().toLocaleLowerCase('ru');
    const dishes=DOLCE_MENU.filter(d=>(category===-1||d.category===category)&&[d.name,d.description,...d.ingredients].join(' ').toLocaleLowerCase('ru').includes(query));
    if(activeDish!==null && !dishes.some(d=>d.id===activeDish))activeDish=dishes[0]?.id??null;
    $('dish-result-count').textContent=`${dishes.length} из 30 блюд`;
    $('dishes').replaceChildren(...dishes.map(d=>{
      const button=document.createElement('button');button.className='dish-choice';button.dataset.dish=d.id;button.setAttribute('aria-pressed',String(activeDish===d.id));
      button.innerHTML=`<span>${d.name}<small>${d.weight}</small></span><strong>${money(d.price)}</strong>`;
      button.addEventListener('click',()=>{activeDish=d.id;renderMenu();$('dishes').querySelector(`[data-dish="${d.id}"]`).focus({preventScroll:true});});return button;
    }));
    renderFeature(dishes.find(d=>d.id===activeDish),!!b);
    if(!dishes.length){const p=document.createElement('p');p.className='empty';p.textContent='Ничего не нашли. Попробуйте другое название или категорию.';$('dishes').append(p);}
    $('cart-table').textContent=b?`Для столика №${b.tableId}`:'Выберите забронированный столик';
    $('cart-items').replaceChildren();
    for(const item of b?.cart||[]){
      const dish=DOLCE_MENU.find(d=>d.id===item.dishId), row=document.createElement('div');row.className='cart-row';
      row.innerHTML=`<p>${dish.name}<small>${money(dish.price*item.quantity)}</small></p>`;
      const controls=document.createElement('div');controls.className='quantity';
      for(const delta of [-1,1]){const button=document.createElement('button');button.textContent=delta<0?'−':'+';button.setAttribute('aria-label',`${delta<0?'Уменьшить':'Увеличить'}: ${dish.name}`);button.disabled=delta>0&&item.quantity===99;button.addEventListener('click',()=>{changeCart(dish.id,delta);$('cart-items').querySelector(`[data-control="${dish.id}:${delta}"]`)?.focus({preventScroll:true});});button.dataset.control=`${dish.id}:${delta}`;controls.append(button);if(delta<0){const number=document.createElement('span');number.textContent=item.quantity;controls.append(number);}}
      row.append(controls);$('cart-items').append(row);
    }
    if(!b?.cart?.length){const p=document.createElement('p');p.className='cart-empty';p.textContent='Немного пасты, бокал лимонада? Добавьте что-нибудь из меню.';$('cart-items').append(p);}
    $('cart-summary').textContent=money(itemsTotal(b?.cart||[]));$('cart-quantity').textContent=(b?.cart||[]).reduce((sum,item)=>sum+item.quantity,0);
    $('cart-total').textContent=money(itemsTotal(b?.cart||[]));$('place-order').disabled=!b?.cart?.length;
  }
  $('dish-search').addEventListener('input',()=>{if(activeDish===null)activeDish=-1;renderMenu();});
  $('order-table').addEventListener('change',()=>{orderTable=Number($('order-table').value)||null;renderMenu();$('order-message').textContent='';});
  $('dish-close').addEventListener('click',()=>$('dish-dialog').close());
  $('place-order').addEventListener('click',async()=>{
    $('place-order').disabled=true;
    const submit=()=>{
      sync();const b=currentBooking();
      if(!b?.cart?.length){render();$('order-message').textContent='Нет блюд для заказа или бронь уже отменена.';return;}
      const total=itemsTotal(b.cart), tableId=b.tableId;
      persist({...state,bookings:state.bookings.map(x=>x.tableId===tableId?{...x,cart:[],orders:[...(x.orders||[]),{id:crypto.randomUUID(),items:b.cart.map(item=>({...item}))}]}:x)});
      render();$('order-message').textContent=`Заказ на ${money(total)} сохранён для столика №${tableId}.`;
    };
    try{if(navigator.locks)await navigator.locks.request(KEY,submit);else submit();}catch{render();$('order-message').textContent='Не удалось сохранить заказ. Попробуйте ещё раз.';}
  });
  render();
  document.body.classList.add('screen-app');
  navigateView(viewRoutes.has(location.hash)?location.hash:'#booking',{push:false,animate:false,focus:false,preserveScroll:location.hash!=='#my-bookings' && location.hash!=='#menu-cart'});
})();
