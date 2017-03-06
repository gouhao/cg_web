/**
 * Created by gouhao on 2017/3/6 0006.
 */
(function () {
    var TAG = 'EditNumberController';
    var buyNumberListDiv;
    var inputCount = 0;
    var applyId;
    var numberArray = [];

    mui.plusReady(onPlusReady);

    function onPlusReady() {
        initData();
        initAction();
        initUi();
    };

    function initData() {
        var self = plus.webview.currentWebview();
        applyId = self.extras.applyId;
        if(self.extras.buyNumber){
            numberArray = self.extras.buyNumber;
        }
    };

    function initAction() {
        document.getElementById('addBuyNumber').addEventListener('click', addBuyNumber);
        document.getElementById('send').addEventListener('click', send);
    };

    function addBuyNumber(number, index) {
        var pos = index ? index : inputCount;

        var div = document.createElement('div');
        div.className = 'input-content';

        var titleDiv = document.createElement('div');
        var label = document.createElement('label');
        label.className = 'number-label';
        label.innerText = '采购编号' + (parseInt(pos) + 1);
        titleDiv.appendChild(label);

        var deleteLabel = document.createElement('button');
        deleteLabel.innerText = '删除';
        deleteLabel.id = pos + '';
        deleteLabel.addEventListener('click', deleteItem);
        titleDiv.appendChild(deleteLabel);

        var input = document.createElement('input');
        input.className = 'number-input';
        input.type = 'number';
        input.placeholder = '请填写采购编号';
        input.value = number ? number : '';
        input.id = 'buyNumber' + inputCount;
        input.maxLength = '20';

        div.appendChild(titleDiv);
        div.appendChild(input);

        buyNumberListDiv.appendChild(div);
        inputCount++;
    };

    function deleteItem() {
        numberArray.splice(this.id, 1);
        consoleLog(TAG, JSON.stringify(numberArray));
        removeElementNode(buyNumberListDiv);
        inputCount--;

        var tLength = inputCount;
        inputCount = 0;
        for(var i = 0; i < tLength; i++){
            if(i < numberArray.length) {
                addBuyNumber(numberArray[i]);
            } else {
                addBuyNumber();
            }
        }
    };
    function send() {
        initNumberArray();
        sendToLastPage();

        mui.back();
        // var info = {
        //     applyId : applyId,
        //     outApplyId : numberArray
        // };
        // muiPostDataWithAuthorization(HTTP_ADD_BUY_NUMBER, info, sendSuccess);
    };

    function sendToLastPage() {
        var target = plus.webview.getWebviewById('apply-details.html');
        mui.fire(target, 'editNumber', {data:numberArray});
    };
    function initNumberArray() {
        numberArray.splice(0, numberArray.length);
      for(var i = 0; i < inputCount; i++){
          var input = document.getElementById('buyNumber' + i);
          if(input.value.trim()) {
              numberArray.push(input.value);
          }
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

        initBuyNumberUi();
    };

    function initBuyNumberUi() {
        if(numberArray.length == 0) {
            addBuyNumber();
        } else {
            for(var i in numberArray) {
                addBuyNumber(numberArray[i], i);
            }
        }
    };
})();
