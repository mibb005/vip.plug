var url = '';

var baseurl = 'https://jx.lache.me/cc/?url=';

function geturl() {
	return baseurl + url;
}

function init() {
	chrome.storage.sync.get('baseurl', function (result) {
		if (result['baseurl']) {
			baseurl = result['baseurl']
		}
		else {
			baseurl = 'https://jx.lache.me/cc/?url=';
		}
	})
}

function setbase(u) {
	baseurl = u;
	chrome.storage.sync.get({ 'baseurl': u }, function (result) {
		console.log('set baseurl success：' + baseurl)
	})
}

$(function () {

})

//判断字符是否为空的方法
function isEmpty(obj) {
	if (typeof obj == "undefined" || obj == null || obj == "") {
		return true;
	} else {
		return false;
	}
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log('收到来自content-script的消息：');
	if (request.url) {
		url = request.url
		console.log(request.url);
		chrome.notifications.create(null, {
			type: 'basic',
			iconUrl: 'icon.png',
			title: '解析成功',
			message: '右键视频解析开始vip播放'
		});

		chrome.browserAction.setBadgeText({ text: 'New' });
		chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
	} else {
		url = '';
	}
	sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request.url));
});


chrome.contextMenus.create({
	title: "解析视频",
	onclick: function () {
		if (!isEmpty(url)) {
			chrome.tabs.create({ url: baseurl + url });
		}
		else {
			chrome.notifications.create(null, {
				type: 'basic',
				iconUrl: 'icon.png',
				title: '解析失败',
				message: '未发现视频'
			});
		}
		chrome.browserAction.setBadgeText({ text: '' });
		chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
	}
});

chrome.contextMenus.create({
	title: '使用度娘搜索：%s', // %s表示选中的文字
	contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
	onclick: function (params) {
		chrome.tabs.create({ url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText) });
	}
});

chrome.contextMenus.create({
	title: '使用有道翻译：%s', // %s表示选中的文字
	contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
	onclick: function (params) {
		$.get("http://fy.iciba.com/ajax.php?a=fy&f=auto&t=auto&w=" + params.selectionText, function (data) {
			var result = JSON.parse(data)
			alert(result.content.out)
		})
	}
});

// web请求监听，最后一个参数表示阻塞式，需单独声明权限：webRequestBlocking
chrome.webRequest.onBeforeRequest.addListener(details => {
	// cancel 表示取消本次请求
	// if (details.sstype == 'image') return { cancel: true };
	// 简单的音视频检测
	// 大部分网站视频的type并不是media，且视频做了防下载处理，所以这里仅仅是为了演示效果，无实际意义
	// if(details.type == 'media') {
	// chrome.notifications.create(null, {
	// 	type: 'basic',
	// 	iconUrl: 'icon.png',
	// 	title: '检测到音视频',
	// 	message: '音视频地址：' + details.type,
	// });
	// }
}, { urls: ["<all_urls>"] }, ["blocking"]);


// 获取当前选项卡ID
function getCurrentTabId(callback) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if (callback) callback(tabs.length ? tabs[0].id : null);
	});
}

// 当前标签打开某个链接
function openUrlCurrentTab(url) {
	getCurrentTabId(tabId => {
		chrome.tabs.update(tabId, { url: url });
	})
}

// 新标签打开某个链接
function openUrlNewTab(url) {
	chrome.tabs.create({ url: url });
}


// omnibox 演示
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
	console.log('inputChanged: ' + text);
	if (!text) return;
	if (text == '美女') {
		suggest([
			{ content: '中国' + text, description: '你要找“中国美女”吗？' },
			{ content: '日本' + text, description: '你要找“日本美女”吗？' },
			{ content: '泰国' + text, description: '你要找“泰国美女或人妖”吗？' },
			{ content: '韩国' + text, description: '你要找“韩国美女”吗？' }
		]);
	}
	else if (text == '微博') {
		suggest([
			{ content: '新浪' + text, description: '新浪' + text },
			{ content: '腾讯' + text, description: '腾讯' + text },
			{ content: '搜狐' + text, description: '搜索' + text },
		]);
	}
	else {
		suggest([
			{ content: '百度搜索 ' + text, description: '百度搜索 ' + text },
			{ content: '谷歌搜索 ' + text, description: '谷歌搜索 ' + text },
		]);
	}
});

// 当用户接收关键字建议时触发
chrome.omnibox.onInputEntered.addListener((text) => {
	console.log('inputEntered: ' + text);
	if (!text) return;
	var href = '';
	if (text.endsWith('美女')) href = 'http://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=' + text;
	else if (text.startsWith('百度搜索')) href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text.replace('百度搜索 ', '');
	else if (text.startsWith('谷歌搜索')) href = 'https://www.google.com.tw/search?q=' + text.replace('谷歌搜索 ', '');
	else href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text;
	openUrlCurrentTab(href);
});

// chrome.contextMenus.create({
// 	type: 'normal'， // 类型，可选：["normal", "checkbox", "radio", "separator"]，默认 normal
// 	title: '菜单的名字', // 显示的文字，除非为“separator”类型否则此参数必需，如果类型为“selection”，可以使用%s显示选定的文本
// 	contexts: ['page'], // 上下文环境，可选：["all", "page", "frame", "selection", "link", "editable", "image", "video", "audio"]，默认page
// 	onclick: function(){}, // 单击时触发的方法
// 	parentId: 1, // 右键菜单项的父菜单项ID。指定父菜单项将会使此菜单项成为父菜单项的子菜单
// 	documentUrlPatterns: 'https://*.baidu.com/*' // 只在某些页面显示此右键菜单
// });
// // 删除某一个菜单项
// chrome.contextMenus.remove(menuItemId)；
// // 删除所有自定义右键菜单
// chrome.contextMenus.removeAll();
// // 更新某一个菜单项
// chrome.contextMenus.update(menuItemId, updateProperties);

// badge
// chrome.browserAction.setTitle({text: 'new'});
// chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});

// chrome.pageAction.show(tabId) //显示图标；
// chrome.pageAction.hide(tabId) //隐藏图标；


// var showBadge = false;
// var menuId = chrome.contextMenus.create({
// 	title: '显示图标上的Badge',
// 	type: 'checkbox',
// 	checked: false,
// 	onclick: function () {
// 		if (!showBadge) {
// 			chrome.browserAction.setBadgeText({ text: 'New' });
// 			chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
// 			chrome.contextMenus.update(menuId, { title: '隐藏图标上的Badge', checked: true });
// 		}
// 		else {
// 			chrome.browserAction.setBadgeText({ text: '' });
// 			chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
// 			chrome.contextMenus.update(menuId, { title: '显示图标上的Badge', checked: false });
// 		}
// 		showBadge = !showBadge;
// 	}
// });

