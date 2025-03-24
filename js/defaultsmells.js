const langAvailableGame =["da", "de", "en", "es", "fi","fr","sv", "zh"];
const langAvailableUI =["da", "en"];
const langDefaultUI="da";//use this language if no language in browser settings og no user choise in menu
const langDefaultGame="en";//use this language if no language in browser settings og no user choise in menu

const defaultsmells3 = [
  {
    id: 0,
    name: "Hindbær",
    languages: {
      "da": "Hindbær",
      "sv": "Hallon",
      "fi": "Vadelma",
      "en": "Raspberry",
      "es": "Frambuesa",
      "zh": "树莓",
      "fr": "Framboise",
      "de": "Himbeere",
      "la": "Rubus idaeus"
    }
  },
  {
    id: 1,
    name: "Lime",
    languages: {
      "da": "Lime",
      "sv": "Lime",
      "fi": "Lime",
      "en": "Lime",
      "es": "Lima",
      "zh": "酸橙",
      "fr": "Citron vert",
      "de": "Limette"
    }
  },
  {
    id: 2,
    name: "Timian",
    languages: {
      "da": "Timian",
      "sv": "Timjansläktet",
      "fi": "Ajuruohot",
      "en": "Thymus",
      "es": "Tomillo",
      "zh": "百里香",
      "fr": "Thym",
      "de": "Thymian"
    }
  },
  {
    id: 3,
    name: "Eddike",
    languages: {
      "da": "Eddike",
      "sv": "Vinäger",
      "fi": "Etikka",
      "en": "Vinegar",
      "es": "Vinagre",
      "zh": "醋",
      "fr": "Vinaigre",
      "de": "Essig"
    }
  },
  {
    id: 4,
    name: "Karry",
    languages: {
      "da": "Karry",
      "sv": "Curry",
      "fi": "Curry",
      "en": "Curry",
      "es": "Curry",
      "zh": "咖喱",
      "fr": "Curry",
      "de": "Curry"
    }
  },
  {
    id: 5,
    name: "Karamel",
    languages: {
      "da": "Karamel",
      "sv": "Karamell",
      "fi": "Karamelli",
      "en": "Caramel",
      "es": "Caramelo",
      "zh": "焦糖",
      "fr": "Caramel",
      "de": "Karamell"
    }
  },
  {
    id: 6,
    name: "Ananas",
    languages: {
      "da": "Ananas",
      "sv": "Ananas",
      "fi": "Ananas",
      "en": "Pineapple",
      "es": "Piña",
      "zh": "菠萝",
      "fr": "Ananas",
      "de": "Ananas"
    }
  },
  {
    id: 7,
    name: "Pebermynte",
    languages: {
      "da": "Pebermynte",
      "sv": "Pepparmynta",
      "fi": "Piparminttu",
      "en": "Peppermint",
      "es": "Menta",
      "zh": "薄荷",
      "fr": "Menthe poivrée",
      "de": "Pfefferminze"
    }
  },
  {
    id: 8,
    name: "Kamille",
    languages: {
      "da": "Kamille",
      "sv": "Kamomill",
      "fi": "Kamomilla",
      "en": "Camomile",
      "es": "Manzanilla",
      "zh": "洋甘菊",
      "fr": "Camomille",
      "de": "Kamille"
    }
  },
  {
    id: 9,
    name: "Kirsebær",
    languages: {
      "da": "Kirsebær",
      "sv": "Körsbär",
      "fi": "Kirsikka",
      "en": "Cherry",
      "es": "Cereza",
      "zh": "樱桃",
      "fr": "Cerise",
      "de": "Kirsche"
    }
  },
  {
    id: 10,
    name: "Abrikos",
    languages: {
      "da": "Abrikos",
      "sv": "Aprikos",
      "fi": "Aprikoosi",
      "en": "Apricot",
      "es": "Albaricoque",
      "zh": "杏",
      "fr": "Abricot",
      "de": "Aprikose"
    }
  },
  {
    id: 11,
    name: "Kardemomme",
    languages: {
      "da": "Kardemomme",
      "sv": "Kardemumma",
      "fi": "Kardemumma",
      "en": "Cardamom",
      "es": "Cardamomo",
      "zh": "豆蔻",
      "fr": "Cardamome",
      "de": "Kardamom"
    }
  },
  {
    id: 12,
    name: "Allehånde",
    languages: {
      "da": "Allehånde",
      "sv": "Kryddpeppar",
      "fi": "Maustepippuri",
      "en": "Allspice",
      "es": "Pimienta de Jamaica",
      "zh": "多香果",
      "fr": "Piment de la Jamaïque",
      "de": "Piment",
      "la": "Pimenta dioica"
    }
  },
  {
    id: 13,
    name: "Koriander",
    languages: {
      "da": "Koriander",
      "sv": "Koriander",
      "fi": "Korianteri",
      "en": "Coriander",
      "es": "Cilantro",
      "zh": "香菜",
      "fr": "Coriandre",
      "de": "Koriander"
    }
  },
  {
    id: 14,
    name: "Spidskommen",
    languages: {
      "da": "Spidskommen",
      "sv": "Spiskummin",
      "fi": "Roomankumina",
      "en": "Cumin",
      "es": "Comino",
      "zh": "孜然",
      "fr": "Cumin",
      "de": "Kreuzkümmel"
    }
  },
  {
    id: 15,
    name: "Kaffe",
    languages: {
      "da": "Kaffe",
      "sv": "Kaffe",
      "fi": "Kahvi",
      "en": "Coffee",
      "es": "Café",
      "zh": "咖啡",
      "fr": "Café",
      "de": "Kaffee"
    }
  },
  {
    id: 16,
    name: "Kanel",
    languages: {
      "da": "Kanel",
      "sv": "Kanel",
      "fi": "Kaneli",
      "en": "Cinnamon",
      "es": "Canela",
      "zh": "肉桂",
      "fr": "Cannelle",
      "de": "Zimt"
    }
  },
  {
    id: 17,
    name: "Mandel",
    languages: {
      "da": "Mandel",
      "sv": "Mandel",
      "fi": "Manteli",
      "en": "Almond",
      "es": "Almendra",
      "zh": "杏仁",
      "fr": "Amande",
      "de": "Mandel"
    }
  },
{
    id: 18,
    name: "Vanilje",
    languages: {
      "da": "Vanilje",
      "sv": "Vanilj",
      "fi": "Vaniljat",
      "en": "Vanilla",
      "es": "Vainilla",
      "zh": "香草",
      "fr": "Vanille",
      "de": "Vanille"
    }
  },
  {
    id: 19,
    name: "Nellike",
    languages: {
      "da": "Nellike",
      "sv": "Nejlika",
      "fi": "Neilikka",
      "en": "Clove",
      "es": "Clavo",
      "zh": "丁香",
      "fr": "Clou de girofle",
      "de": "Nelke"
    }
  },
  {
    id: 20,
    name: "Rosmarin",
    languages: {
      "da": "Rosmarin",
      "sv": "Rosmarin",
      "fi": "Rosmariini",
      "en": "Rosemary",
      "es": "Romero",
      "zh": "迷迭香",
      "fr": "Romarin",
      "de": "Rosmarin"
    }
  },
  {
    id: 21,
    name: "Muskatnød",
    languages: {
      "da": "Muskatnød",
      "sv": "Muskot",
      "fi": "Muskottipähkinä",
      "en": "Nutmeg",
      "es": "Nuez Moscada",
      "zh": "肉豆蔻",
      "fr": "Muscade",
      "de": "Muskatnuss"
    }
  },
  {
    id: 22,
    name: "Ingefær",
    languages: {
      "da": "Ingefær",
      "sv": "Ingefära",
      "fi": "Inkivääri",
      "en": "Ginger",
      "es": "Jengibre",
      "zh": "生姜",
      "fr": "Gingembre",
      "de": "Ingwer"
    }
  },
  {
    id: 23,
    name: "Cayennepeber",
    languages: {
      "da": "Cayennepeber",
      "sv": "Cayennepeppar",
      "fi": "Cayennepippuri",
      "en": "Cayenne pepper",
      "es": "Pimienta de Cayena",
      "zh": "辣椒粉",
      "fr": "Poivre de Cayenne",
      "de": "Cayennepfeffer"
    }
  },
  {
    id: 24,
    name: "Anis",
    languages: {
      "da": "Anis",
      "sv": "Anis",
      "fi": "Anis",
      "en": "Anise",
      "es": "Anís",
      "zh": "茴香",
      "fr": "Anis",
      "de": "Anis"
    }
  },
  {
    id: 25,
    name: "Banan",
    languages: {
      "da": "Banan",
      "sv": "Banan",
      "fi": "Banaani",
      "en": "Banana",
      "es": "Plátano",
      "zh": "香蕉",
      "fr": "Banane",
      "de": "Banane"
    }
  },
  {
    id: 26,
    name: "Kokos",
    languages: {
      "da": "Kokos",
      "sv": "Kokos",
      "fi": "Kookos",
      "en": "Coconut",
      "es": "Coco",
      "zh": "椰子",
      "fr": "Noix de coco",
      "de": "Kokosnuss"
    }
  },
  {
    id: 27,
    name: "Peanuts",
    languages: {
      "da": "Peanuts",
      "sv": "Jordnötter",
      "fi": "Maapähkinät",
      "en": "Peanuts",
      "es": "Cacahuetes",
      "zh": "花生",
      "fr": "Cacahuètes",
      "de": "Erdnüsse"
    }
  },
  {
    id: 28,
    name: "Mandarin",
    languages: {
      "da": "Mandarin",
      "sv": "Mandarin",
      "fi": "Mandariini",
      "en": "Mandarin",
      "es": "Mandarina",
      "zh": "柑橘",
      "fr": "Mandarine",
      "de": "Mandarine"
    }
  },
  {
    id: 29,
    name: "Jordbær",
    languages: {
      "da": "Jordbær",
      "sv": "Jordgubbe",
      "fi": "Mansikka",
      "en": "Strawberry",
      "es": "Fresa",
      "zh": "草莓",
      "fr": "Fraise",
      "de": "Erdbeere"
    }
  },
  {
    id: 30,
    name: "Estragon",
    languages: {
      "da": "Estragon",
      "sv": "Dragon",
      "fi": "Rakuuna",
      "en": "Tarragon",
      "es": "Estragón",
      "zh": "龙蒿",
      "fr": "Estragon",
      "de": "Estragon"
    }
  },
  {
    id: 31,
    name: "Peber",
    languages: {
      "da": "Peber",
      "sv": "Peppar",
      "fi": "Pippuri",
      "en": "Pepper",
      "es": "Pimienta",
      "zh": "胡椒",
      "fr": "Poivre",
      "de": "Pfeffer"
    }
  },
  {
    id: 32,
    name: "Basilikum",
    languages: {
      "da": "Basilikum",
      "sv": "Basilika",
      "fi": "Maustebasilika",
      "en": "Basil",
      "es": "Albahaca",
      "zh": "罗勒",
      "fr": "Basilic",
      "de": "Basilikum"
    }
  },
  {
    id: 33,
    name: "Enebær",
    languages: {
      "da": "Enebær",
      "sv": "Enbär",
      "fi": "Kataja",
      "en": "Juniper",
      "es": "Enebro",
      "zh": "杜松子",
      "fr": "Genièvre",
      "de": "Wacholder"
    }
  },
  {
    id: 34,
    name: "Citron",
    languages: {
      "da": "Citron",
      "sv": "Citron",
      "fi": "Sitruuna",
      "en": "Lemon",
      "es": "Limón",
      "zh": "柠檬",
      "fr": "Citron",
      "de": "Zitrone"
    }
  },
  {
    id: 35,
    name: "Eucalyptus",
    languages: {
      "da": "Eucalyptus",
      "sv": "Eukalyptus",
      "fi": "Eukalyptus",
      "en": "Eucalyptus",
      "es": "Eucalipto",
      "zh": "桉树",
      "fr": "Eucalyptus",
      "de": "Eukalyptus"
    }
  },
  {
    id: 36,
    name: "Appelsin",
    languages: {
      "da": "Appelsin",
      "sv": "Apelsin",
      "fi": "Appelsiini",
      "en": "Orange",
      "es": "Naranja",
      "zh": "橙子",
      "fr": "Orange",
      "de": "Orange"
    }
  },
  {
    id: 37,
    name: "Lavendel",
    languages: {
      "da": "Lavendel",
      "sv": "Lavendel",
      "fi": "Laventeli",
      "en": "Lavender",
      "es": "Lavanda",
      "zh": "薰衣草",
      "fr": "Lavande",
      "de": "Lavendel"
    }
  },
  {
    id: 38,
    name: "Grape",
    languages: {
      "da": "Grape",
      "sv": "Grapefrukt",
      "fi": "Greippi",
      "en": "Grapefruit",
      "es": "Pomelo",
      "zh": "柚子",
      "fr": "Pamplemousse",
      "de": "Grapefruit"
    }
  },
  {
    id: 39,
    name: "Rose",
    languages: {
      "da": "Rose",
      "sv": "Ros",
      "fi": "Ruusut",
      "en": "Rose",
      "es": "Rosa",
      "zh": "玫瑰",
      "fr": "Rose",
      "de": "Rose"
    }
  },
  {
    id: 40,
    name: "Kamfer",
    languages: {
      "da": "Kamfer",
      "sv": "Kamfer",
      "fi": "Kamferi",
      "en": "Camphor",
      "es": "Alcanfor",
      "zh": "樟脑",
      "fr": "Camphre",
      "de": "Kampfer"
    }
  },
  {
    id: 41,
    name: "Cedertræ",
    languages: {
      "da": "Cedertræ",
      "sv": "Cederträ",
      "fi": "Setri",
      "en": "Cedarwood",
      "es": "Cedro",
      "zh": "雪松",
      "fr": "Bois de cèdre",
      "de": "Zedernholz"
    }
  },
  {
    id: 42,
    name: "Gran",
    languages: {
      "da": "Gran",
      "sv": "Gran",
      "fi": "Kuusi",
      "en": "Spruce",
      "es": "Abeto",
      "zh": "云杉",
      "fr": "Épinette",
      "de": "Fichte"
    }
  }
];


const defaultsmellsOLD = [
  {
    id: 0, name: "Hindbær",
    languages: {
      "da": "Hindbær",
      "sv": "Hallon",
      "fi": "Vadelma",
      "en": "Raspberry",
      "es": "Frambuesa",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 1, name: "Lime",
    languages: {
      "da": "Lime",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 2, name: "Timian",
    languages: {
      "da": "Timian",
      "sv": "Timjansläktet",
      "fi": "Ajuruohot",
      "en": "Thymus",
      "es": "Tomillo",
      "zh": "百里香",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 3, name: "Eddike",
    languages: {
      "da": "Eddike",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 4, name: "Karry",
    languages: {
      "da": "Karry",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "咖喱",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 5, name: "Karamel",
    languages: {
      "da": "Karamel",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 6, name: "Ananas",
    languages: {
      "da": "Ananas",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 7, name: "Pebermynte",
    languages: {
      "da": "Pebermynte",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "薄荷",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 8, name: "Kamille",
    languages: {
      "da": "Kamille",
      "sv": "Kamomill",
      "fi": "Kamomilla",
      "en": "Camomile",
      "es": "Manzanilla",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 9, name: "Kirsebær",
    languages: {
      "da": "Kirsebær",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 10, name: "Abrikos",
    languages: {
      "da": "Abrikos",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 11, name: "Kardemomme",
    languages: {
      "da": "Kardemomme",
      "sv": "Kardemumma",
      "fi": "Kardemumma",
      "en": "Cardamom",
      "es": "Cardamomo",
      "zh": "豆蔻",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 12, name: "Allehånde",
    languages: {
      "da": "Allehånde",
      "sv": "Kryddpeppar",
      "fi": "Maustepippuri",
      "en": "Allspice",
      "es": "Pimienta de Jamaica",
      "zh": "多香果",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 13, name: "Koriander",
    languages: {
      "da": "Koriander",
      "sv": "Koriander",
      "fi": "Korianteri",
      "en": "Coriander",
      "es": "Cilantro",
      "zh": "香菜",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 14, name: "Spidskommen",
    languages: {
      "da": "Spidskommen",
      "sv": "Spiskummin",
      "fi": "Roomankumina",
      "en": "Cumin",
      "es": "Comino",
      "zh": "孜然",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 15, name: "Kaffe",
    languages: {
      "da": "Kaffe",
      "sv": "Kaffe",
      "fi": "Kahvi",
      "en": "Coffee",
      "es": "Café",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 16, name: "Kanel",
    languages: {
      "da": "Kanel",
      "sv": "Kanel",
      "fi": "Kaneli",
      "en": "Cinnamon",
      "es": "Canela",
      "zh": "肉桂",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 17, name: "Mandel",
    languages: {
      "da": "Mandel",
      "sv": "Mandel",
      "fi": "Manteli",
      "en": "Almond",
      "es": "Almendra",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 18, name: "Vanilje",
    languages: {
      "da": "Vanilje",
      "sv": "Vanilj",
      "fi": "Vaniljat",
      "en": "Vanilla",
      "es": "Vainilla",
      "zh": "香草",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 19, name: "Nellike",
    languages: {
      "da": "Nellike",
      "sv": "Nejlika",
      "fi": "Neilikka",
      "en": "Clove ",
      "es": "Clavel",
      "zh": "丁香",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 20, name: "Rosmarin",
    languages: {
      "da": "Rosmarin",
      "sv": "Rosmarin",
      "fi": "Rosmariini",
      "en": "Rosemary",
      "es": "Romero",
      "zh": "迷迭香",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 21, name: "Muskatnød",
    languages: {
      "da": "Muskatnød",
      "sv": "Muskot",
      "fi": "Muskottipähkinä",
      "en": "Nutmeg ",
      "es": "Nuez Moscada",
      "zh": "肉豆蔻",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 22, name: "Ingefær",
    languages: {
      "da": "Ingefær",
      "sv": "Ingefära",
      "fi": "Inkivääri",
      "en": "Ginger",
      "es": "Jengibre",
      "zh": "生姜",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 23, name: "Cayennepeber",
    languages: {
      "da": "Cayennepeber",
      "sv": "Cayennepeppar",
      "fi": "Cayennepippuri",
      "en": "Cayenne pepper",
      "es": "Pimienta de Cayena",
      "zh": "辣椒粉",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 24, name: "Anis", languages: {
      "da": "Anis",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 25, name: "Banan",
    languages: {
      "da": "Banan",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 26, name: "Kokos",
    languages: {
      "da": "Kokos",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 27, name: "Peanuts",
    languages: {
      "da": "Peanuts",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 28, name: "Mandarin",
    languages: {
      "da": "Mandarin",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 29, name: "Jordbær",
    languages: {
      "da": "Jordbær",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 30, name: "Estragon",
    languages: {
      "da": "Estragon",
      "sv": "Dragon",
      "fi": "Rakuuna",
      "en": "Tarragon",
      "es": "Estragón",
      "zh": "龙蒿",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 31, name: "Peber",
    languages: {
      "da": "Peber",
      "sv": "Peppar",
      "fi": "Pippuri",
      "en": "Pepper",
      "es": "Pimienta",
      "zh": "胡椒",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 32, name: "Basilikum",
    languages: {
      "da": "Basilikum",
      "sv": "Basilika",
      "fi": "Maustebasilika",
      "en": "Basil",
      "es": "Albahaca",
      "zh": "罗勒",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 33, name: "Enebær",
    languages: {
      "da": "Enebær",
      "sv": "Juniper",
      "fi": "Kataja",
      "en": "Juniper",
      "es": "Enebro",
      "zh": "杜松子",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 34, name: "Citron",
    languages: {
      "da": "Citron",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 35, name: "Eucalyptus",
    languages: {
      "da": "Eucalyptus",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 36, name: "Appelsin",
    languages: {
      "da": "Appelsin",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 37, name: "Lavendel",
    languages: {
      "da": "Lavendel",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 38, name: "Grape",
    languages: {
      "da": "Grape",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 39, name: "Rose",
    languages: {
      "da": "Rose",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 40, name: "Kamfer",
    languages: {
      "da": "Kamfer",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 41, name: "Cedertræ",
    languages: {
      "da": "Cedertræ",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
  {
    id: 42, name: "Gran",
    languages: {
      "da": "Gran",
      "sv": "",
      "fi": "",
      "en": "",
      "es": "",
      "zh": "",
      "fr": "",
      "de": ""
    }
  },
];



