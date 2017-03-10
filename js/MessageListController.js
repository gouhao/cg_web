/**
 * Created by gouhao on 2017/3/10 0010.
 */
(function () {
    var contentUl;
    var contentList = new Array();
    mui.init({
        pullRefresh: {
            container: '#messageRefresh', //待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                height: 50,
                contentrefresh: "正在加载...",
                contentnomore: '没有更多数据了',
                callback: refreshMessageList
            },
            up : {
                height: 50,
                contentrefresh: "正在加载...",
                contentnomore: '没有更多数据了',
                callback: loadMoreMessage
            }
        }
    });

    function refreshMessageList() {
        setTimeout(function(){
            mui('#messageRefresh').pullRefresh().endPulldownToRefresh();
        }, 2000);

    };

    function loadMoreMessage() {
        setTimeout(function(){
            mui('#messageRefresh').pullRefresh().endPullupToRefresh();
        }, 2000);
    };

    mui.plusReady(function() {
        initData();
        initUi();
    });

    function initData() {
        for(var i = 0; i < 10; i++) {
            var message = new ApplyMessage();
            message.applyStatus = '审批通过';
            message.applyDetail = '急缺电脑';
            message.applyTime = '12:00';
            contentList.push(message);
        }
    };

    function initUi(){
        contentUl = document.getElementById('content');
        createContentList();
    };

    function createContentList() {
        for(var i in contentList) {
            var item = contentList[i];
            var li = createLiItem(item);
            contentUl.appendChild(li);
        }
    };

    function createLiItem(item) {
        var div = document.createElement('div');
        div.className = 'item';

        var contentDiv = document.createElement('div');
        contentDiv.className = 'item-content';

        var title = document.createElement('p');
        title.innerText = '你提交的采购申请';
        var span = document.createElement('span');
        span.className = 'item-apply-status';
        span.innerText = item.applyStatus;
        title.appendChild(span);
        var label = document.createTextNode(',请知晓');
        title.appendChild(label);
        contentDiv.appendChild(title);

        var p = document.createElement('p');
        p.innerText = '采购事由:';
        var span1 = document.createElement('span');
        span1.innerText = item.applyDetail;
        p.appendChild(span1);
        contentDiv.appendChild(p);

        div.appendChild(contentDiv);

        var timeP = document.createElement('p');
        timeP.innerText = item.applyTime;
        timeP.className = 'item-time';
        div.appendChild(timeP);

        var li = document.createElement('li');
        li.className = 'mui-table-view-cell';
        li.appendChild(div);
        return li;
    }
})();
