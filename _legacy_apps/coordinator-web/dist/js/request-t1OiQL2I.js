function o(t,n){let e=null;return function(...u){const c=()=>{e=null,t(...u)};e&&clearTimeout(e),e=setTimeout(c,n)}}function r(t,n=300){return o(t,n)}export{r as c};
