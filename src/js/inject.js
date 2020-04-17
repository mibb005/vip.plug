
console.log('this is inject.js')
// var b = document.getElementsByClassName("txp_btn_submit");
document.getElementsByClassName("search_btn")[0].style.backgroundColor='blue';

window.postMessage({"path": document.URL}, '*');

console.log(document.URL)