(function () {
    var TAG = 'WaitApplyController';
    var waitApplyDiv, appliedDiv;
    var waitApplyList = new Array(),
        appliedList = new Array();
    var waitApplyCreator, appliedCreator;
    var from = FROM_APPLY_DEAL_PERSON;

    mui.init({swipeBack: false,});

    mui.plusReady(onPlusReady);


    function onPlusReady() {
        initData();
        initUi();
        initAction();
    };

    function initAction() {
        document.querySelector('.mui-slider').addEventListener('slide', tabSlide);
        document.getElementById('search-apply').addEventListener('click', searchApply);
        mui('#waitApplyList').on('tap', '.mui-table-view-cell', onWaitItemClick);
        mui('#appliedList').on('tap', '.mui-table-view-cell', onAppliedItemClick);
    };

    function onAppliedItemClick() {
        consoleLog(TAG, 'on applied item click');
    };
    function onWaitItemClick(event) {
        consoleLog(TAG, 'on wait deal item click');
        muiOpenWindowWithoutWaiting('apply-details.html', {data:this.id, from:from});
    };
    function searchApply() {
        mui.toast('search');
    };

    var isShowItem2 = false;
    function tabSlide(event) {
        if(event.detail.slideNumber == 1 && !isShowItem2) {
            isShowItem2 = true;
            setTimeout(function(){
            	appliedCreator.insertHead();
                var scroll = document.getElementById('appliedScroll');
                removeElementNodeBeforeIndex(scroll, 1);
            }, 1000);

        }
    };

    function initData() {
        var self = plus.webview.currentWebview();
        if(self.extras){
            from = self.extras.from;
        }

        initWaitApplyList();
        initAppliedList();
    };

    function initAppliedList() {
        for (var i = 0; i < 20; i++) {
            var message = new Object();
            message.applyId = i + 100;
            message.applyStatus = '1';
            message.title = '急缺电脑';
            message.remark = '部六急缺电脑用'
            message.applyTime = '12:00';
            message.pesUserName = '高飞';
            appliedList.push(message);
        }
    };
    function initWaitApplyList() {
        for (var i = 0; i < 20; i++) {
            var message = new Object();
            message.applyId = i;
            message.applyStatus = '1';
            message.title = '急缺电脑';
            message.remark = '部六急缺电脑用'
            message.applyTime = '12:00';
            message.pesUserName = '高飞';
            waitApplyList.push(message);
        }
    };

    function initUi() {
        mui('.mui-scroll-wrapper').scroll({
            indicators: true
        });

        

        waitApplyDiv = document.getElementById('waitApplyList');
        appliedDiv = document.getElementById('appliedList');
        
		if(from == FROM_APPLY_BUY_PERSON) {
            document.getElementById('title').innerText = '我的采购单';
            document.getElementById('tab1').innerText = '待采购';
            document.getElementById('tab2').innerText = '已完结';
        }
        waitApplyCreator = new ApplyListCreator(waitApplyDiv, waitApplyList, from);
        appliedCreator = new ApplyListCreator(appliedDiv, appliedList, from);

        waitApplyCreator.insertHead();
    };
})();
