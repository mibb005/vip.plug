// (function() {
// 	console.log('这是 simple-chrome-plugin-demo 的content-script！mibb11');
// 	// document.getElementById('kw').style.backgroundColor='red';
	
// })();
// console.log('this is content.js11')

// document.getElementsByClassName('txp_btn_submit').style.backgroundColor='red';

// injectCustomJs('inject.js')

// 向页面注入JS
// function injectCustomJs(jsPath)
// {
// 	jsPath = jsPath || 'js/inject.js';
// 	var temp = document.createElement('script');
// 	temp.setAttribute('type', 'text/javascript');
// 	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
// 	temp.src = chrome.extension.getURL(jsPath);
// 	temp.onload = function()
// 	{
// 		// 放在页面不好看，执行完后移除掉
// 		this.parentNode.removeChild(this);
// 	};
// 	document.head.appendChild(temp);
// }

console.log('content:'+document.URL)

chrome.runtime.sendMessage({url: document.URL}, function(response) {
	console.log('收到来自后台的回复：' + response);
});

// window.addEventListener("message", function(e)
// {
// 	console.log(e.data.path);
// 	chrome.runtime.sendMessage({url: e.data.path}, function(response) {
// 		console.log('收到来自后台的回复：' + response);
// 	});
// }, false);