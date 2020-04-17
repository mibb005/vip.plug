
var baselist = ['https://cdn.yangju.vip/k/?url='
    , 'https://jx.lache.me/cc/?url='
    , 'https://api.653520.top/vip/?url='
    , 'https://jx.ab33.top/vip/?url='
    , 'https://vip.mpos.ren/v/?url='
    , 'https://jx.000180.top/jx/?url='
    , 'https://jx.km58.top/jx/?url='];


$(function () {
    chrome.storage.sync.get('list', function (result) {
        let list = [];
        if (result['list']) {
            list = result['list'];
        }
        else {
            list = baselist;
        }
        addli(list);
    });
})

function addli(urllist) {
    var i = 1;
    $('ul').empty();
    urllist.forEach(function (item) {
        var li = $('<li></li>');
        var lable = $('<label for="male' + i + '">线路' + i + '</label>');
        var input = $('<input id="male' + i + '" name="male" class="male" accesskey="m" type="radio" name="Sex" value="' + item + '" />');
        li.append(lable).append(input);
        $('ul').append(li);
        i++;
    })
}

//解析
$('#button1').click(function () {
    var bg = chrome.extension.getBackgroundPage();
    var url = bg.geturl();
    // chrome.tabs.create({url: url});
    // window.open(url)
    chrome.tabs.create({ url: url });
    // chrome.windows.create({state: 'maximized',url: url});
})

//清除
$("#button3").click(function () {
    chrome.storage.sync.remove('list', function () {
        addli();
    });
})

//设置
$('ul').on('click', '.male', function () {
    var bg = chrome.extension.getBackgroundPage();
    bg.setbase($(this).val());
});

//新增
$("#button2").click(function () {

    var url = $("#jiexi").val();
    var list = [];
    // 从存储中读取数据
    chrome.storage.sync.get('list', function (result) {
        if (result['list']) {
            list = result['list'];
            list.push(url);
        }
        else {
            list = baselist;
            list.push(url);
        }
        chrome.storage.sync.set({ 'list': list }, function () {
            console.log('保存成功');
            addli(list);
        });
    });
})


