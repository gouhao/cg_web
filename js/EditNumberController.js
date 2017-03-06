/**
 * Created by gouhao on 2017/3/6 0006.
 */
(function () {
    var TAG = 'EditNumberController';
    var buyNumberListDiv;
    var buyNumberListIndex = 1;
    var applyId;
    var numberArray = [];

    mui.init({
        beforeback:onBack
    });

    function onBack() {
        var target = plus.webview.getWebviewById('apply-details.html');
        mui.fire(target, 'editNumber', {data:numberArray});
    };

    mui.plusReady(onPlusReady);

    function onPlusReady() {
        initData();
        initAction();
        initUi();
    };

    function initData() {
        var self = plus.webview.currentWebview();
        applyId = self.extras.applyId;
    };

    function initAction() {
        document.getElementById('addBuyNumber').addEventListener('click', addBuyNumber);
        document.getElementById('send').addEventListener('click', send);
    };

    function addBuyNumber() {
        var div = document.createElement('div');
        div.className = 'input-content';

        buyNumberListIndex++;
        var label = document.createElement('label');
        label.className = 'number-label';
        label.innerText = '采购编号' + buyNumberListIndex;

        var input = document.createElement('input');
        input.className = 'number-input';
        input.type = 'number';
        input.placeholder = '请填写采购编号';

        input.id = 'buyNumber' + buyNumberListIndex;
        input.maxLength = '20';

        div.appendChild(label);
        div.appendChild(input);

        buyNumberListDiv.appendChild(div);
    };

    function send() {
        mui.toast('send');
        initNumberArray();
        mui.back();
        // var info = {
        //     applyId : applyId,
        //     outApplyId : numberArray
        // };
        // muiPostDataWithAuthorization(HTTP_ADD_BUY_NUMBER, info, sendSuccess);
    };

    function initNumberArray() {
      for(var i = 1; i <= buyNumberListIndex; i++){
          var input = document.getElementById('buyNumber' + i);
          numberArray.push(input.value);
        }
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
        buyNumberListDiv = document.getElementById('buyNumberList');
    };
})();
