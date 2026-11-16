'use strict';
(() => {
  const KEY = 'dolce-reservations-v1';
  const tables = [
    {id:1,capacity:2,rate:500,zone:'У окна'}, {id:2,capacity:2,rate:500,zone:'У окна'},
    {id:3,capacity:4,rate:800,zone:'У окна'}, {id:4,capacity:4,rate:800,zone:'Тихий уголок'},
    {id:5,capacity:2,rate:500,zone:'В центре зала'}, {id:6,capacity:6,rate:1200,zone:'Большая компания'},
    {id:7,capacity:4,rate:800,zone:'Тихий уголок'}, {id:8,capacity:6,rate:1200,zone:'Большая компания'}
  ];
  const $ = id => document.getElementById(id);
  const money = value => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
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
    return {version:1,bookings:value.bookings.map(({tableId,guests,hours})=>({tableId,guests,hours}))};
  }
  function read() {
    try { const raw = localStorage.getItem(KEY); return raw === null ? initial() : validate(JSON.parse(raw)); }
    catch { storageError('Не удалось прочитать сохранённые брони. Работа продолжается в памяти вкладки; после перезагрузки изменения могут пропасть. Сброс демо позволяет восстановить сохранение.'); return null; }
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
    button.type = 'button'; button.className = list ? 'list-button' : 'table-button'; button.disabled = busy;
    button.setAttribute('aria-pressed', String(selected === t.id));
    button.setAttribute('aria-label', `Столик №${t.id}, ${t.capacity} места, ${t.rate} рублей в час, ${t.zone}, ${busy?'занят':'свободен'}`);
    button.innerHTML = list ? `<span>Столик №${t.id}<small>${t.zone} · до ${t.capacity} гостей · ${money(t.rate)}/ч</small></span><span>${busy?'Занят':selected===t.id?'Выбран':'Выбрать'}</span>` : `<strong>${String(t.id).padStart(2,'0')}</strong><small>${t.capacity} места · ${money(t.rate)}/ч</small><small>${busy?'Занят':selected===t.id?'Выбран':'Свободен'}</small>`;
    button.addEventListener('click',()=> { sync(); if(occupied(t.id)){selected=null;render();say('Этот столик уже занят. Выберите другой.');return;} selected=t.id;render();(list ? $('table-list') : $('map')).querySelector('[aria-pressed="true"]').focus();say(`Выбран столик №${t.id}. Укажите гостей и часы.`); });
    return button;
  }
  function render() {
    if(selected && occupied(selected)) selected = null;
    const visible = tables.filter(matches);
    if(selected && !visible.some(t=>t.id===selected)) selected=null;
    $('map').replaceChildren(...visible.map(t=>tableButton(t,false)));
    $('table-list').replaceChildren(...visible.map(t=>tableButton(t,true)));
    $('no-results').hidden=visible.length>0;
    $('available').textContent=`${tables.filter(t=>!occupied(t.id)).length} из 8 свободны`;
    $('count').textContent=state.bookings.length;
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
      card.innerHTML=`<div><h3>Столик №${table.id} · ${table.zone}</h3><p>Гостей: ${b.guests} · Часов: ${b.hours} · ${money(table.rate*b.hours)}</p><p>Активна до отмены</p></div>`;
      const cancel=document.createElement('button');cancel.textContent='Отменить бронь';cancel.setAttribute('aria-label',`Отменить бронь столика №${table.id}`);
      cancel.addEventListener('click',()=>{sync();persist({...state,bookings:state.bookings.filter(x=>x.tableId!==table.id)});render();say(`Бронь столика №${table.id} отменена. Столик свободен.`);$('my-title').tabIndex=-1;$('my-title').focus();});card.append(cancel);$('bookings').append(card);
    });
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
      persist({...state,bookings:[...state.bookings,{tableId:t.id,guests,hours}]});selected=null;render();say(`Готово! Столик №${t.id} забронирован за ${money(t.rate*hours)}. Это учебная бронь.`);
    };
    try { if(navigator.locks) await navigator.locks.request(KEY,book); else book(); } catch {render();say('Не удалось подтвердить бронь. Попробуйте ещё раз.');}
  });
  $('reset').addEventListener('click',()=>$('reset-dialog').showModal());
  $('keep').addEventListener('click',()=>$('reset-dialog').close());
  $('reset-confirm').addEventListener('click',()=>{persist(initial());selected=null;$('capacity').value='0';$('rate').value='0';$('hours').value='2';render();$('reset-dialog').close();say('Демо сброшено. Столики №2 и №6 заняты, остальные свободны.');});
  window.addEventListener('storage',event=>{if(event.key===KEY||event.key===null){const latest=read();if(latest){state=latest;render();say('Брони обновлены из другой вкладки.');}}});
  render();
})();
