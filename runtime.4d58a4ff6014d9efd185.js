(()=>{"use strict";var e,r,t,n,o,a={},i={};function l(e){var r=i[e];if(void 0!==r)return r.exports;var t=i[e]={exports:{}};return a[e](t,t.exports,l),t.exports}l.m=a,e=[],l.O=(r,t,n,o)=>{if(!t){var a=1/0;for(d=0;d<e.length;d++){for(var[t,n,o]=e[d],i=!0,s=0;s<t.length;s++)(!1&o||a>=o)&&Object.keys(l.O).every((e=>l.O[e](t[s])))?t.splice(s--,1):(i=!1,o<a&&(a=o));if(i){e.splice(d--,1);var u=n();void 0!==u&&(r=u)}}return r}o=o||0;for(var d=e.length;d>0&&e[d-1][2]>o;d--)e[d]=e[d-1];e[d]=[t,n,o]},l.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return l.d(r,{a:r}),r},l.d=(e,r)=>{for(var t in r)l.o(r,t)&&!l.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},l.f={},l.e=e=>Promise.all(Object.keys(l.f).reduce(((r,t)=>(l.f[t](e,r),r)),[])),l.u=e=>e+".05e02ae9548bb2de03cf.js",l.miniCssF=e=>e+".css",l.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),l.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),r={},t="kostki:",l.l=(e,n,o,a)=>{if(r[e])r[e].push(n);else{var i,s;if(void 0!==o)for(var u=document.getElementsByTagName("script"),d=0;d<u.length;d++){var c=u[d];if(c.getAttribute("src")==e||c.getAttribute("data-webpack")==t+o){i=c;break}}i||(s=!0,(i=document.createElement("script")).charset="utf-8",i.timeout=120,l.nc&&i.setAttribute("nonce",l.nc),i.setAttribute("data-webpack",t+o),i.src=e),r[e]=[n];var p=(t,n)=>{i.onerror=i.onload=null,clearTimeout(f);var o=r[e];if(delete r[e],i.parentNode&&i.parentNode.removeChild(i),o&&o.forEach((e=>e(n))),t)return t(n)},f=setTimeout(p.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=p.bind(null,i.onerror),i.onload=p.bind(null,i.onload),s&&document.head.appendChild(i)}},l.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;l.g.importScripts&&(e=l.g.location+"");var r=l.g.document;if(!e&&r&&(r.currentScript&&(e=r.currentScript.src),!e)){var t=r.getElementsByTagName("script");t.length&&(e=t[t.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),l.p=e})(),n=e=>new Promise(((r,t)=>{var n=l.miniCssF(e),o=l.p+n;if(((e,r)=>{for(var t=document.getElementsByTagName("link"),n=0;n<t.length;n++){var o=(i=t[n]).getAttribute("data-href")||i.getAttribute("href");if("stylesheet"===i.rel&&(o===e||o===r))return i}var a=document.getElementsByTagName("style");for(n=0;n<a.length;n++){var i;if((o=(i=a[n]).getAttribute("data-href"))===e||o===r)return i}})(n,o))return r();((e,r,t,n)=>{var o=document.createElement("link");o.rel="stylesheet",o.type="text/css",o.onerror=o.onload=a=>{if(o.onerror=o.onload=null,"load"===a.type)t();else{var i=a&&("load"===a.type?"missing":a.type),l=a&&a.target&&a.target.href||r,s=new Error("Loading CSS chunk "+e+" failed.\n("+l+")");s.code="CSS_CHUNK_LOAD_FAILED",s.type=i,s.request=l,o.parentNode.removeChild(o),n(s)}},o.href=r,document.head.appendChild(o)})(e,o,r,t)})),o={666:0},l.f.miniCss=(e,r)=>{o[e]?r.push(o[e]):0!==o[e]&&{26:1}[e]&&r.push(o[e]=n(e).then((()=>{o[e]=0}),(r=>{throw delete o[e],r})))},(()=>{var e={666:0};l.f.j=(r,t)=>{var n=l.o(e,r)?e[r]:void 0;if(0!==n)if(n)t.push(n[2]);else if(666!=r){var o=new Promise(((t,o)=>n=e[r]=[t,o]));t.push(n[2]=o);var a=l.p+l.u(r),i=new Error;l.l(a,(t=>{if(l.o(e,r)&&(0!==(n=e[r])&&(e[r]=void 0),n)){var o=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;i.message="Loading chunk "+r+" failed.\n("+o+": "+a+")",i.name="ChunkLoadError",i.type=o,i.request=a,n[1](i)}}),"chunk-"+r,r)}else e[r]=0},l.O.j=r=>0===e[r];var r=(r,t)=>{var n,o,[a,i,s]=t,u=0;for(n in i)l.o(i,n)&&(l.m[n]=i[n]);if(s)var d=s(l);for(r&&r(t);u<a.length;u++)o=a[u],l.o(e,o)&&e[o]&&e[o][0](),e[a[u]]=0;return l.O(d)},t=self.webpackChunkkostki=self.webpackChunkkostki||[];t.forEach(r.bind(null,0)),t.push=r.bind(null,t.push.bind(t))})()})();