(function () {
    var FLAG_INDEX_IS_FIRST = 0;
    var FLAG_INDEX_IS_REFRESH = 1;
    var FLAG_INDEX_IS_LOAD_MORE = 2;

    var selectType = 'all';
    var subpages = ['my-apply-list.html', 'drafts.html'];
    var subStyle = {
        top: '45px',
        bottom: '0px'
    };
    var aniShow = {};

    var applyListCreator, draftsListCreator;
    var applyList = [], draftsList = [];

    var getPageInfo = {
        currentPage:1,
        pageSize:DEFAULT_PAGE_SIZE
    };

    var runTarget;

    var applyScroller;
    var flag = new FlagSystem();

    mui.plusReady(onPlusReady);

    function onPlusReady() {
        initUi();
        initAction();
    };

    function initUi() {
        applyListCreator = new ApplyListCreator(document.getElementById('appliedList'), applyList, FROM_APPLY_START_PERSON);
        draftsListCreator = new ApplyListCreator(document.getElementById('draftsList'), draftsList, FROM_APPLY_START_PERSON);
        var deceleration = mui.os.ios ? 0.003 : 0.0009;
        mui('.mui-scroll-wrapper').scroll({
            bounce: false,
            indicators: true, //是否显示滚动条
            deceleration: deceleration
        });

        setRefreshUi();
        flag.set(true, FLAG_INDEX_IS_FIRST);
        applyRefresh();
    };

    function setRefreshUi() {
        mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, e) {
            if(index == 0){
                mui(e).pullToRefresh({
                    down: {
                        callback: applyRefresh
                    },
                    up: {
                        callback: applyLoadMore
                    }
                });
            }

        });

    };

    function applyRefresh() {
        if(flag.get(FLAG_INDEX_IS_REFRESH)) return;
        flag.set(true, FLAG_INDEX_IS_REFRESH);
        runTarget = this;
        getPageInfo.currentPage = 0;
        muiPostDataWithAuthorization(HTTP_GET_APPLY_LIST, getPageInfo, applyRefreshSuccess);
    };

    function applyRefreshSuccess(response) {
        console.log(JSON.stringify(response));
        if(!flag.get(FLAG_INDEX_IS_FIRST)) {
            runTarget.endPullDownToRefresh();
        }
        if(response.result == HTTP_RESULT_SUCCESS) {
            var data = response.data.list;
            for(var i in data) {
                applyList.push(data[i]);
            }
            applyListCreator.insertHead();
        } else {
            console.log("request error!")
        }
        if(flag.get(FLAG_INDEX_IS_FIRST)) {
            flag.set(false, FLAG_INDEX_IS_FIRST);
        }
        flag.set(false, FLAG_INDEX_IS_REFRESH);
    };

    function applyLoadMore() {
        if(flag.get(FLAG_INDEX_IS_LOAD_MORE)) return;
        flag.set(true, FLAG_INDEX_IS_LOAD_MORE);
        runTarget = this;
        getPageInfo.currentPage++;
        muiPostDataWithAuthorization(HTTP_GET_APPLY_LIST, getPageInfo, applyLoadMoreSuccess);
    };

    function applyLoadMoreSuccess(response) {
        console.log(JSON.stringify(response));
        runTarget.endPullUpToRefresh();
        if(response.result == HTTP_RESULT_SUCCESS) {
            console.log('apply load more success:' + JSON.stringify(response.data));
        } else {
            console.log('load more apply list error');
        }
        flag.set(false, FLAG_INDEX_IS_LOAD_MORE);
    };

    function draftsRefresh() {
        console.log('draftsRefresh');
        var self = this;
        setTimeout(function(){
            self.endPullDownToRefresh()
        }, 1000);
    };

    function draftsLoadMore() {
        console.log('draftsLoadMore');
        var self = this;
        setTimeout(function(){
            self.endPullUpToRefresh()
        }, 1000);
    };

    function createSubpages() {
        var self = plus.webview.currentWebview();
        var len = subpages.length;
        for(var i = 0; i < len; i++) {
            var temp = {};
            var sub = plus.webview.create(subpages[i], subpages[i], subStyle);
            if(i > 0) {
                sub.hide();
            } else {
                temp[subpages[i]] = "true";
                mui.extend(aniShow, temp);
            }
            self.append(sub);
        }
    };

    function initAction() {
        document.querySelector('.mui-pull-right').addEventListener('click', buttonClick, false);
    };

    function buttonClick(event) {
        var extras;
        console.log(event.target.id);
        if(event.target.id == 'filter-apply') {
            extras = { data: selectType };
        }
        muiOpenWindowWithoutWaiting(event.target.id + '.html', extras);
    };

    window.addEventListener('selectedType', selectedType);

    function selectedType(data) {
        selectType = data.detail.data;

    };
})();