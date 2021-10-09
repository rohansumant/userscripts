// ==UserScript==
// @name         Hulu Enhancement
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.hulu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

const api_key = "insert API key here";
var timer;

function init() {
    window.addEventListener('wheel', (e)=> {
        console.log('Scrolling');
        //delay timer by another second
        clearTimeout(timer);
        timer = setTimeout(tagImages,1000);
    });
}

(function() {
  'use strict';
   window.onload = init;
})();

function tagImages() {
  let imgs = document.getElementsByTagName('img');
  for(let i=0;i<imgs.length;i++) {
    let img = imgs[i];
    let fallbackString = img.alt;
    let prefix = "Cover art for ";
    if(fallbackString && fallbackString.startsWith(prefix)) {
      let title_name = fallbackString.substr(prefix.length-1);
      console.log('Found ',title_name);
    }
  }
}
