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

(function() {
  'use strict';
  //document.body.remove()
  setTimeout(cb,10000);
  // Your code here...
})();

function cb() {
  let imgs = document.getElementsByTagName('img');
  for(let i=0;i<imgs.length;i++) {
    console.log(imgs[i].alt);
  }
}
