
// The locale our app first shows
const defaultLocale = "en";

const supportedLocales = ["da", "en"];

const fullyQualifiedLocaleDefaults = {
  en: "en-US",
  ar: "ar-EG",
  da: "da-DK",
};

// The active locale
let locale;

// Gets filled with active locale translations


const translationsDa = {
    "help":"Hjælp",
    "showtotalscore":"Vis det samlede resultat",
    "cleargame": "Nulstil spillet",
    "scanstart": "Start QR skanner",
    "scanstop": "Stop QR skanner",
    "setup": "Opsætning",
    "setupplayers": "Opsæt spillere",
    "setupsmells": "Opsæt lugte",
    "nextplayer": "Næste spiller",
    "newplayer": "Ny spiller", 
    "language": "Sprog",
    "numberofregistratesmells":"Antal registrede lugte",
    "add":"Tilføj",
    "gameisresetiftheplayersarechanged":"NB: Spillet nulstilles hvis der ændres på spillerne.",
    "butthissmellisnotactivatedinthisgame":"men denne lugt er ikke aktiveret i dette spil",
    "everyonehasgiventheirguesses":"Alle har givet deres gæt på denne lugt",
    "thecorrectanswerwas":"Det korrekte svar var",
    
    "round-plural": {
      "one": "{count} runde",
      "other": "{count} runder"
    },
    "correct-plural": {
      "one": "{count} rigtig",
      "other": "{count} rigtige"
    },    
    "nyan-cat-price": "Nyan Cat (Official) NFT: {price}",
    "publish-date": "Publiseret {publishDate}"
};
const translationsEn = {
  "help":"Help",
  "showtotalscore":"Show the total result",
  "cleargame": "Reset the game",
  "scanstart": "EN Start QR skanner",
  "scanstop": "EN Stop QR skanner",
  "setup": "Setup",
  "setupplayers": "Setup players",
  "setupsmells": "Setup smells",
  "nextplayer": "Next player",
  "newplayer": "New player",  
  "language": "Language",
  "numberofregistratesmells":"Number of registrated smells",
  "add":"Add",
  "gameisresetiftheplayersarechanged":"NB: The game is reset if the players are changed.",
  "everyonehasgiventheirguesses": "Everyone has given their guesses on this smell",
  "butthissmellisnotactivatedinthisgame":"but this smell is not activated in this game",
  "thecorrectanswerwas":"The correct answer was",
  "round-plural": {
    "one": "{count} round",
    "other": "{count} rounds"
  },
  "correct-plural": {
    "one": "{count} correct",
    "other": "{count} correct"
  }, 

  "nyan-cat-price": "Nyan Cat (Official) NFT: {price}",
  "publish-date": "Publiseret {publishDate}"
};

 let translations=translationsEn;

// When the page content is ready...
document.addEventListener("DOMContentLoaded",  () => {
  const initialLocale = supportedOrDefault(
    browserLocales(true),
  );


  //Check if user has changed to another language than browser default
  const langLocalstorage = localStorage.getItem("lang3");
  
  if (langLocalstorage !== null) {    
    const _langLocalstorage=JSON.parse(langLocalstorage);
   // const _langLocalstorage="en";
     setLocale(_langLocalstorage);
    bindLocaleSwitcher(_langLocalstorage);
  }
  else {
     setLocale(initialLocale);
    bindLocaleSwitcher(initialLocale);
  }

});

// Load translations for the given locale and translate
// the page to this locale
//async function setLocale(newLocale) {
  function setLocale(newLocale) {
  //alert("newLocale",newLocale)
  //if (newLocale === locale) return;

  //const newTranslations = await fetchTranslationsFor(newLocale,);
  //translations = newTranslations;
  locale = newLocale;
  //alert(locale)

  if(newLocale=="en"){
    translations=translationsEn
  }
  else {
    translations=translationsDa;
  }
  

  document.documentElement.lang = newLocale;
  document.documentElement.dir = dir(newLocale);
   console.log("translations",translations)

  translatePage();
}

// Retrieves translations JSON object for the given
// locale over the network
async function fetchTranslationsFor(newLocale) {
  const response = await fetch(`/lang/${newLocale}.json`);
  return await response.json();
}

// Replace the inner text of all elements with the
// data-i18n attribute to translations corresponding
// to their data-i18n
function translatePage() {
  document
    .querySelectorAll("[data-i18n]")
    .forEach((el) => translateElement(el));
}

// Replace the inner text of the given HTML element
// with the translation in the active locale,
// corresponding to the element's data-i18n
function translateElement(element) {
  const key = element.getAttribute("data-i18n");

  const options = JSON.parse(element.getAttribute("data-i18n-opt")) || {};
  element.innerText = translate(key, options);
}

function translate(key, interpolations = {}) {
  
  const message = translations[key];

  if (key.endsWith("-plural")) {
    return interpolate(
      pluralFormFor(message, interpolations.count),
      interpolations,
    );
  }
 // console.log("WWW",key,translations)
  return interpolate(message, interpolations);
}

// Convert a message like "Hello, {name}" to "Hello, Chad"
// where the given interpolations object is {name: "Chad"}
function interpolate(message, interpolations) {
  return Object.keys(interpolations).reduce(
    (interpolated, key) => {
      const value = formatDate(
        formatNumber(interpolations[key]),
      );

      return interpolated.replace(
        new RegExp(`{\s*${key}\s*}`, "g"),
        value,
      );
    },
    message,
  );
}

/*
  Given a value object like
  {
    "number" : 300000,
    "style": "currency",
    "currency": "EUR"
  } and that the current locale is en, returns "€300,000.00"
*/
function formatNumber(value) {
  if (typeof value === "object" && value.number) {
    const { number, ...options } = value;

    return new Intl.NumberFormat(
      fullyQualifiedLocaleDefaults[locale],
      options,
    ).format(number);
  } else {
    return value;
  }
}

/*
  Given a value object like
  {
    "date": "2021-12-05 15:29:00",
    "dateStyle": "long",
    "timeStyle": "short"
  } and that the current locale is en,
  returns "December 5, 2021 at 3:29 PM"
*/
function formatDate(value) {
  if (typeof value === "object" && value.date) {
    const { date, ...options } = value;

    const parsedDate =
      typeof date === "string" ? Date.parse(date) : date;

    return new Intl.DateTimeFormat(
      fullyQualifiedLocaleDefaults[locale],
      options,
    ).format(parsedDate);
  } else {
    return value;
  }
}

/*
  Given a forms object like
  {
    "zero": "No articles",
    "one": "One article",
    "other": "{count} articles"
  } and a count of 1, returns "One article"
*/
function pluralFormFor(forms, count) {
  const matchingForm = new Intl.PluralRules(locale).select(count,);
  return forms[matchingForm];
}

function isSupported(locale) {
  return supportedLocales.indexOf(locale) > -1;
}

// Retrieve the first locale we support from the given
// array, or return our default locale
function supportedOrDefault(locales) {
  return locales.find(isSupported) || defaultLocale;
}

function dir(locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

function bindLocaleSwitcher(initialValue) {
  // const switcher = document.querySelector("[data-i18n-switcher]",);
  // switcher.value = initialValue;

  imgselectedlang.src = `images/flagslanguage/${initialValue}.png`




  // switcher.onchange = (e) => {
  //   setLocale(e.target.value);
  //   //Save user's language selection to localStorage
  //   localStorage.setItem("lang2", JSON.stringify(e.target.value));    
  // };
}

/**
 * Retrieve user-preferred locales from browser
 *
 * @param {boolean} languageCodeOnly - when true, returns
 * ["en", "fr"] instead of ["en-US", "fr-FR"]
 * @returns array | undefined
 */
function browserLocales(languageCodeOnly = false) {
  return navigator.languages.map((locale) =>
    languageCodeOnly ? locale.split("-")[0] : locale,
  );
}



