const DOLCE_MENU = [
  {
    "id": 0,
    "category": 0,
    "name": "Брускетта с томатами и страчателлой",
    "description": "Хрустящая чиабатта, нежный сыр и летние томаты",
    "price": 490,
    "weight": "180 г",
    "ingredients": [
      "Чиабатта",
      "Страчателла",
      "Томаты черри",
      "Базилик",
      "Песто"
    ],
    "image": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 1,
    "category": 0,
    "name": "Тартар из лосося с авокадо",
    "description": "Свежий лосось с цитрусовой заправкой",
    "price": 790,
    "weight": "160 г",
    "ingredients": [
      "Лосось",
      "Авокадо",
      "Лайм",
      "Каперсы",
      "Кунжут"
    ],
    "image": "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 2,
    "category": 0,
    "name": "Капрезе с соусом песто",
    "description": "Итальянская классика в нашем прочтении",
    "price": 590,
    "weight": "220 г",
    "ingredients": [
      "Моцарелла",
      "Томаты",
      "Базилик",
      "Песто"
    ],
    "image": "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 3,
    "category": 0,
    "name": "Антипасти по-итальянски",
    "description": "Коллекция вкусов для неспешного вечера",
    "price": 890,
    "weight": "280 г",
    "ingredients": [
      "Прошутто",
      "Салями",
      "Оливки",
      "Пармезан",
      "Артишоки"
    ],
    "image": "https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 4,
    "category": 0,
    "name": "Запечённый камамбер",
    "description": "С ягодным соусом и хрустящим багетом",
    "price": 690,
    "weight": "200 г",
    "ingredients": [
      "Камамбер",
      "Клюква",
      "Мёд",
      "Багет",
      "Розмарин"
    ],
    "image": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 5,
    "category": 1,
    "name": "Крем-суп из шампиньонов",
    "description": "Бархатный грибной суп со сливками",
    "price": 450,
    "weight": "300 г",
    "ingredients": [
      "Шампиньоны",
      "Сливки",
      "Лук",
      "Гренки"
    ],
    "image": "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 6,
    "category": 1,
    "name": "Тыквенный крем-суп",
    "description": "Сладкая тыква, семечки и аромат трав",
    "price": 420,
    "weight": "300 г",
    "ingredients": [
      "Тыква",
      "Сливки",
      "Семечки",
      "Тимьян"
    ],
    "image": "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 7,
    "category": 1,
    "name": "Том-ям с креветками",
    "description": "Пряный бульон с кокосовым молоком",
    "price": 750,
    "weight": "350 г",
    "ingredients": [
      "Креветки",
      "Кокосовое молоко",
      "Лемонграсс",
      "Грибы"
    ],
    "image": "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 8,
    "category": 1,
    "name": "Сливочный суп с лососем",
    "description": "Нежный лосось и овощи в сливочном бульоне",
    "price": 650,
    "weight": "320 г",
    "ingredients": [
      "Лосось",
      "Картофель",
      "Сливки",
      "Укроп"
    ],
    "image": "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 9,
    "category": 1,
    "name": "Французский луковый суп",
    "description": "С сырной корочкой и золотистым тостом",
    "price": 490,
    "weight": "300 г",
    "ingredients": [
      "Лук",
      "Бульон",
      "Грюйер",
      "Багет"
    ],
    "image": "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 10,
    "category": 2,
    "name": "Паста с креветками",
    "description": "Лингвини, тигровые креветки и сливочный соус",
    "price": 890,
    "weight": "320 г",
    "ingredients": [
      "Лингвини",
      "Креветки",
      "Сливки",
      "Пармезан",
      "Томаты"
    ],
    "image": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 11,
    "category": 2,
    "name": "Ризотто с грибами",
    "description": "Рис арборио с белыми грибами и трюфельным маслом",
    "price": 790,
    "weight": "280 г",
    "ingredients": [
      "Арборио",
      "Белые грибы",
      "Пармезан",
      "Трюфельное масло"
    ],
    "image": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 12,
    "category": 2,
    "name": "Лосось с овощами",
    "description": "Филе на гриле с сезонными овощами",
    "price": 1190,
    "weight": "300 г",
    "ingredients": [
      "Лосось",
      "Цукини",
      "Брокколи",
      "Лимон"
    ],
    "image": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 13,
    "category": 2,
    "name": "Куриное филе с картофельным пюре",
    "description": "Сочное филе с нежным пюре и соусом",
    "price": 690,
    "weight": "340 г",
    "ingredients": [
      "Курица",
      "Картофель",
      "Масло",
      "Сливки"
    ],
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 14,
    "category": 2,
    "name": "Стейк с овощами гриль",
    "description": "Говяжий стейк с перцем и розмарином",
    "price": 1590,
    "weight": "350 г",
    "ingredients": [
      "Говядина",
      "Перец",
      "Цукини",
      "Розмарин"
    ],
    "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 15,
    "category": 3,
    "name": "Лимонад маракуйя",
    "description": "Тропическая свежесть с лёгкой кислинкой",
    "price": 350,
    "weight": "400 мл",
    "ingredients": [
      "Маракуйя",
      "Лимон",
      "Содовая",
      "Мята"
    ],
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 16,
    "category": 3,
    "name": "Домашний ягодный морс",
    "description": "Северные ягоды по домашнему рецепту",
    "price": 250,
    "weight": "300 мл",
    "ingredients": [
      "Клюква",
      "Брусника",
      "Вода",
      "Сахар"
    ],
    "image": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 17,
    "category": 3,
    "name": "Матча-латте",
    "description": "Японская матча и воздушное молоко",
    "price": 390,
    "weight": "300 мл",
    "ingredients": [
      "Матча",
      "Молоко"
    ],
    "image": "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 18,
    "category": 3,
    "name": "Цитрусовый лимонад",
    "description": "Апельсин, лимон и пузырьки лета",
    "price": 320,
    "weight": "400 мл",
    "ingredients": [
      "Апельсин",
      "Лимон",
      "Содовая"
    ],
    "image": "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 19,
    "category": 3,
    "name": "Холодный чай с персиком",
    "description": "Чёрный чай с сочным персиком",
    "price": 290,
    "weight": "400 мл",
    "ingredients": [
      "Чёрный чай",
      "Персик",
      "Лёд"
    ],
    "image": "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 20,
    "category": 4,
    "name": "Чизкейк с ягодами",
    "description": "Нежная сырная текстура на песочной основе",
    "price": 490,
    "weight": "160 г",
    "ingredients": [
      "Сливочный сыр",
      "Печенье",
      "Сливки",
      "Ягоды"
    ],
    "image": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 21,
    "category": 4,
    "name": "Шоколадный фондан",
    "description": "Тёплый шоколадный десерт с жидким центром",
    "price": 550,
    "weight": "180 г",
    "ingredients": [
      "Шоколад",
      "Масло",
      "Яйцо",
      "Мука"
    ],
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 22,
    "category": 4,
    "name": "Тирамису",
    "description": "Маскарпоне, крепкий кофе и какао",
    "price": 490,
    "weight": "170 г",
    "ingredients": [
      "Маскарпоне",
      "Савоярди",
      "Кофе",
      "Какао"
    ],
    "image": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 23,
    "category": 4,
    "name": "Панна-котта",
    "description": "Сливочная классика с ягодным кули",
    "price": 420,
    "weight": "150 г",
    "ingredients": [
      "Сливки",
      "Ваниль",
      "Желатин",
      "Малина"
    ],
    "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 24,
    "category": 4,
    "name": "Макаронс",
    "description": "Три маленьких повода для радости",
    "price": 390,
    "weight": "90 г",
    "ingredients": [
      "Миндаль",
      "Белок",
      "Сахар",
      "Ганаш"
    ],
    "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 25,
    "category": 5,
    "name": "Апероль Шприц",
    "description": "Солнечный итальянский аперитив",
    "price": 650,
    "weight": "250 мл",
    "ingredients": [
      "Апероль",
      "Просекко",
      "Содовая",
      "Апельсин"
    ],
    "image": "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 26,
    "category": 5,
    "name": "Негрони",
    "description": "Выразительный баланс горечи и сладости",
    "price": 690,
    "weight": "120 мл",
    "ingredients": [
      "Джин",
      "Кампари",
      "Красный вермут"
    ],
    "image": "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 27,
    "category": 5,
    "name": "Белое сухое вино",
    "description": "Пино Гриджо, Италия. Цветочное и свежее",
    "price": 590,
    "weight": "150 мл",
    "ingredients": [
      "Виноград Пино Гриджо"
    ],
    "image": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 28,
    "category": 5,
    "name": "Красное сухое вино",
    "description": "Кьянти, Италия. Ягоды и пряные оттенки",
    "price": 650,
    "weight": "150 мл",
    "ingredients": [
      "Виноград Санджовезе"
    ],
    "image": "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 29,
    "category": 5,
    "name": "Просекко",
    "description": "Деликатные пузырьки и ноты зелёного яблока",
    "price": 650,
    "weight": "150 мл",
    "ingredients": [
      "Виноград Глера"
    ],
    "image": "https://images.unsplash.com/photo-1594980087087-a7c1030c834a?auto=format&fit=crop&w=600&q=80"
  }
];
