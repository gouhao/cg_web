/**
 * Created by gouhao on 2017/3/6 0006.
 */
(function () {
    var TAG = 'EditNumberController';
    var contentListDiv;
    var applyId;
    var contentList = [];
    var from;

    var strategy;

    mui.plusReady(onPlusReady);

    function onPlusReady() {
        initData();
        initUi();
        initAction();
    };

    function initData() {
        var extras = plus.webview.currentWebview().extras;
        applyId = extras.applyId;
        // if(extras.contentList){
        //     contentList = extras.contentList;
        // }
        from = extras.from;

    };

    function addContent() {
        strategy.addContent();
    };

    function initAction() {
        document.getElementById('addMenuDiv').addEventListener('click', addContent);
        document.getElementById('send').addEventListener('click', send);
    };


    function send() {
        strategy.initContentArray();
        sendToLastPage();

        mui.back();
        // var info = {
        //     applyId : applyId,
        //     outApplyId : contentList
        // };
        // muiPostDataWithAuthorization(HTTP_ADD_BUY_NUMBER, info, sendSuccess);
    };

    function sendToLastPage() {
        var target = plus.webview.getWebviewById('apply-details.html');
        mui.fire(target, 'editNumber', {data:contentList});
    };

    function sendSuccess(response) {
        consoleLog(TAG, JSON.stringify(response));
        if(response.result == HTTP_RESULT_SUCCESS) {
            mui.toast('发送成功');
            mui.back();
        } else {
            consoleLog(TAG, 'send buy number error');
        }
    };

    function initUi() {
        mui('.mui-scroll-wrapper').scroll({ indicators: false });
        contentListDiv = document.getElementById('contentListDiv');
        if(from == FROM_ADD_CONTRACT) {;
            document.getElementById('title').innerText = '填写采购编号';
            document.getElementById('addContent').innerText = '增加采购编号';
            strategy = new AddDetailContractStrategy(contentListDiv, contentList);
        } else {
            document.getElementById('title').innerText = '合同备案内容';
            document.getElementById('addContent').innerText = '增加合同备案';
            strategy = new AddDetailNumberStrategy(contentListDiv, contentList);
        }
        initBuyNumberUi();
    };

    function initBuyNumberUi() {
        if(contentList.length == 0) {
            strategy.addContent();
        } else {
            for(var i in contentList) {
                strategy.addContent(contentList[i], i);
            }
        }
    };
    
    function onDeleteHaha(){
    	strategy.deleteItem();
    }
})();
