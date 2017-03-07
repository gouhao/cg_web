/**
 * Created by gouhao on 2017/3/6 0006.
 */
(function () {
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
        if(extras.contentList){
            contentList = extras.contentList;
        }
        from = extras.from;

    };

    function addContentProxy(){
    	strategy.addContent();	
    };
    
    function sendProxy(){
    	strategy.send();
    };
    
    function initAction() {
        document.getElementById('addMenuDiv').addEventListener('click', addContentProxy);
        document.getElementById('send').addEventListener('click', sendProxy);
    };

    function initUi() {
        mui('.mui-scroll-wrapper').scroll({ indicators: false });
        contentListDiv = document.getElementById('contentListDiv');
        if(from == FROM_ADD_NUMBER) {
            document.getElementById('title').innerText = '填写采购编号';
            document.getElementById('addContent').innerText = '增加采购编号';
            strategy = new AddDetailNumberStrategy(contentListDiv, contentList);

        } else {
            document.getElementById('title').innerText = '合同备案内容';
            document.getElementById('addContent').innerText = '增加合同备案';
            strategy = new AddDetailContractStrategy(contentListDiv, contentList);
        }
        initContentUi();
    };

    function initContentUi() {
        if(contentList.length == 0) {
            strategy.addContent();
        } else {
            for(var i in contentList) {
                strategy.addContent(contentList[i], i);
            }
        }
    };
})();
