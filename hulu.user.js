// ==UserScript==
// @name         Hulu Enhancement
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.hulu.com/*
// @require      https://unpkg.com/axios/dist/axios.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

const APIDomain = "https://www.omdbapi.com" // http://www.omdbapi.com/?apikey=[yourkey]&
let globalMovieDB;
let apiKey;
let timer;

function loadMovieDB() {
  let currentTimeInEpochSeconds = Math.floor(Date.now()/1000);
  let emptyMovieDB = {
    'timestamp': currentTimeInEpochSeconds,
    'movies' : {}
  };
  let movieDBString = localStorage.getItem('movieDB');
  if(!movieDBString) { // First time
    movieDBString = JSON.stringify(emptyMovieDB);
  }
  let movieDB = JSON.parse(movieDBString);
  const weekInSeconds = 7 * 24 * 60 * 60;
  if(currentTimeInEpochSeconds - movieDB.timestamp > weekInSeconds) {
    // flush the old version
    movieDB = emptyMovieDB;
  }
  globalMovieDB = movieDB;
}


function fetchTitles() {
  let imgs = $('img');
  let titles = [];
  for(let i=0;i<imgs.length;i++) {
    let img = imgs[i];
    let fallbackString = img.alt;
    let prefix = "Cover art for ";
    if(fallbackString && fallbackString.startsWith(prefix)) {
      let title_name = fallbackString.substr(prefix.length-1);
      // console.log('Found ',title_name);
      titles.push({'title': title_name, 'elem': img});
    }
  }
  return titles;
}

function onScrollStop() {
  let titles = fetchTitles();
  let promises = [];
  for(let i=0;i<titles.length;i++) {
    let title = titles[i].title;
    let elem = titles[i].elem;
    if(!(title in globalMovieDB.movies)) {
      let pr = axios.get(APIDomain, {params: {'apikey': apiKey, 't': title }});
      promises.push(pr);
      pr.then(value => {
        // console.log('Fetched rating for ',title);
        globalMovieDB.movies[title] = value.data.imdbRating;
      }).catch(err => {
        console.log('Failed to get ratings for ',title);
      });
    }
  }

  // When everything is done, print out ratings on console.
  Promise.allSettled(promises)
    .then(v => {
      printRatings(titles);
      console.log(promises.length,'OMDP API requests');
    })
    .catch(e => {console.log("Error ",e)});
}

function printRatings(titles) {
  for(let i=0;i<titles.length;i++) {
    let title = titles[i].title;
    let rating = undefined;
    if(title in globalMovieDB.movies) {
      rating = globalMovieDB.movies[title];
      console.log(title,' ', rating);
    }
    let elem = titles[i].elem;
    let parentDiv = elem.closest('div');

    let childDiv = $('<div></div>')[0];
    let cssAttributes = {
      'color': 'red',
      'position': 'absolute',
      'height': '30px',
      'width': '30px',
      'background-color': '#555',
      'border-radius': '50%',
      'top': '0px',
      'left': '0px',
      'text-align': 'center'
    };
    for(const key in cssAttributes) {
      childDiv.style[key] = cssAttributes[key];
    }
    //childDiv.style = cssAttributes;
    childDiv.innerHTML= rating;
    parentDiv.appendChild(childDiv);
  }
}

function main() {
  // Fetch API key
  apiKey = localStorage.getItem('apiKey');
  if(!apiKey) {
    apiKey = window.prompt('Please enter your OMDB API key.');
    if(apiKey) {
      localStorage.setItem('apiKey',apiKey);
    }
  }

  // Load Movie DB
  loadMovieDB();

  // On every scroll, fetch titles currently in view.
  window.addEventListener('wheel', (e)=> {
    // console.log('Scrolling');
    // delay timer by another second
    clearTimeout(timer);
    timer = setTimeout(onScrollStop,1000);
  });

  // Dump DB on exit
  window.addEventListener('beforeunload', () => {
    let globalMovieDBString = JSON.stringify(globalMovieDB);
    localStorage.setItem('movieDB',globalMovieDBString);
  });
}


(function() {
  'use strict';
  window.onload = main;
})();

