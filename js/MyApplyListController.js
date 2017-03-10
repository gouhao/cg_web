/**
 * Created by gouhao on 2017/3/10 0010.
 */
(function () {
    var contentDiv;
    var contentList = new Array();
    mui.init({
        pullRefresh: {
            container: '#applyList',
            down: {
                height: 50,
                contentrefresh: '正在刷新',
                contentnomore: '没有更多数据了',
                callback: refresh
            },
            up: {
                height: 50,
                contentrefresh: '正在加载',
                contentnomore: '没有更多数据了',
                callback: loadMore
            }
        },
    });

    function refresh() {
        setTimeout(function() {
            mui('#applyList').pullRefresh().endPulldownToRefresh();
        }, 2000);
    };

    function loadMore() {
        setTimeout(function() {
            mui('#applyList').pullRefresh().endPullupToRefresh();
        }, 2000);
    };
    mui.plusReady(function() {
        mui('.mui-table-view').on('tap', '.mui-table-view-cell', function() {
            var viewId = this.getAttribute("id");
            mui.openWindow({
                url: 'apply-details.html',
                waiting: {
                    autoShow: false,
                },
                extras: {
                    listId: viewId
                }
            });
        });
        initData();
        initUi();
    });

    function initData() {
        for (var i = 0; i < 10; i++) {
            var message = new ApplyMessage();
            message.applyStatus = '审批通过';
            message.applyDetail = '急缺电脑';
            message.applyTitle = '部六急缺电脑用'
            message.applyTime = '12:00';
            contentList.push(message);
        }
    };

    function initUi() {
        contentDiv = document.getElementById('content');
        createContentList();
    };

    function createContentList() {
        for(var i in contentList) {
            var li = createLiItem(contentList[i]);
            contentDiv.appendChild(li);
        }
    };

    function createLiItem(item) {
        var li = document.createElement('li');
        li.className = 'mui-table-view-cell';

        var div = document.createElement('div');
        div.className = 'apply-item';

        var img = document.createElement('img');
        img.src = 'qq.png';
        div.appendChild(img);

        var div1 = document.createElement('div');
        div1.className = 'apply-content';

        var titleP = document.createElement('p');
        titleP.innerText = item.applyTitle;

        var typeP = document.createElement('p');
        typeP.innerText = item.applyDetail;

        div1.appendChild(titleP);
        div1.appendChild(typeP);
        div.appendChild(div1);

        var timeP = document.createElement('p');
        timeP.className = 'apply-time';
        timeP.innerText = item.applyTime;
        div.appendChild(timeP);

        li.appendChild(div);
        return li;

    }
})();

