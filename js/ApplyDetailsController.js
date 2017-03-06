/**
 * Created by gouhao on 2017/3/2 0002.
 */
(function () {

    var TAG = 'ApplyDetailsController';
    var applyId;
    var isShowMoreDetails;
    var hideImg;
    var applyIdSpan, applyTitleSpan, applyDateSpan, applyTotalMoneySpan, applyRemarkSpan;
    var applyStatusDiv, applyStatusSpan, productDetailDiv;
    var applyDetail = {};
    var from, editBuyNumber, buyNumber;
    var buyNumberList;
    var buyNumberListDiv;
    mui.plusReady(onPlusReady);

    function onPlusReady() {
        initData();
        initUi();
        initAction();
    };

    function initData() {
        var self = plus.webview.currentWebview();
        applyId = self.extras.data;
        from = self.extras.from;
        muiPostDataWithAuthorization(HTTP_GET_APPLY_DETAIL, {applyId: applyId}, getDetailSuccess)
    };


    function getDetailSuccess(response) {
        console.log('get detail:' + JSON.stringify(response));
        if (response.result == HTTP_RESULT_SUCCESS) {
            applyDetail = response.data.jsonObjectApply;
            if (applyDetail) {
                refreshUi();
            }

        } else {
            console.log('get detail error');
        }
    };

    function refreshUi() {
        applyIdSpan.innerText = applyDetail.applyId;
        applyDateSpan.innerText = applyDetail.applyTime;
        applyTitleSpan.innerText = applyDetail.title;
        applyRemarkSpan.innerText = applyDetail.remark;
        applyTotalMoneySpan.innerText = applyDetail.total;

        applyStatusDiv.style.backgroundColor = getStatusColor(applyDetail.applyStatus);
        applyStatusSpan.innerText = getStatusText(applyDetail.applyStatus);

        productDetailDiv = document.getElementById('buyDetail');
        createProductDetailHtml()
    };



    function initUi() {
        applyIdSpan = document.getElementById('applyId');
        applyTitleSpan = document.getElementById('applyTitle');
        applyDateSpan = document.getElementById('applyDate');
        applyTotalMoneySpan = document.getElementById('applyTotalMoney');
        applyRemarkSpan = document.getElementById('applyRemark');
        editBuyNumber = document.getElementById('editBuyNumber');
        applyStatusDiv = document.getElementById('applyStatusDiv');
        applyStatusSpan = document.getElementById('applyStatus');
        buyNumberListDiv = document.getElementById('buyNumberList');

        buyNumber = document.getElementById('buyNumber');
        checkBuyNumberList();
        if (from == FROM_APPLY_DEAL_PERSON) {
            document.getElementById('dealPersonMenu').style.display = 'block';
        } else if (from == FROM_APPLY_BUY_PERSON) {
            document.getElementById('buyPersonMenu').style.display = 'block';
        }

    };

    function checkBuyNumberList() {
        var buyNumberEmpty = buyNumberList && buyNumberList.length > 0;
        editBuyNumber.style.display = buyNumberEmpty ? 'block' : 'none';
        buyNumber.style.display = buyNumberEmpty ? 'none' : 'block';
    };

    function initAction() {
        document.getElementById('hideImg').addEventListener('click', clickHide);
        document.getElementById('bottomMenu').addEventListener('click', onButtonClick);
        window.addEventListener('editNumber', onEditNumber);

        editBuyNumber.addEventListener('click', onButtonClick);
    };

    function clickHide() {
        var detail2 = document.getElementById('detail2');
        var detail3 = document.getElementById('detail3');
        isShowMoreDetails = !isShowMoreDetails;
        if (isShowMoreDetails) {
            detail2.style.display = 'block';
            detail3.style.display = 'block';
        } else {
            detail2.style.display = 'none';
            detail3.style.display = 'none';
        }
    };

    function createProductDetailHtml() {
        var productList = applyDetail.jsonArrayApplyItem;
        var total = productList.length;
        for (var i = 0; i < total; i++) {
            var div = document.createElement('div');
            div.id = 'detail' + (i + 1);
            var h = document.createElement('h4');
            var ht = document.createTextNode('采购明细' + (i + 1));
            h.appendChild(ht);
            div.appendChild(h);
            var name = createPSpan('名称', '主机箱');
            var type = createPSpan('采购类型', '办公用品');
            var number = createPSpan('数量', '3');
            var guessPrice = createPSpan('预算单价', '500元');
            var guessTotalPrice = createPSpan('预算总金额', '1500元');

            div.appendChild(name);
            div.appendChild(type);
            div.appendChild(number);
            div.appendChild(guessPrice);
            div.appendChild(guessTotalPrice);
            parent.appendChild(div);
        }
    }

    function createPSpan(key, value) {
        var nameP = document.createElement('p');
        var keyText = document.createTextNode(key);
        nameP.appendChild(keyText);

        var span = document.createElement('span');
        var t = document.createTextNode(value)
        span.appendChild(t);
        nameP.appendChild(span);
        return nameP;
    }


    function onButtonClick(event) {
        //test data
        applyDetail = {};
        applyDetail.id = 10;
        applyDetail.pesUserAccount = 10;
        switch (event.target.id) {
            case 'refuse':
                showRefuseDialog();
                break;
            case 'agree':

                muiOpenWindowWithoutWaiting('apply-view.html', {
                    applyId: applyId,
                    id: applyDetail.id,
                    auditUserAccount: applyDetail.pesUserAccount
                });
                break;
            case 'buyNumber':
                muiOpenWindowWithoutWaiting('edit-number.html', {applyId:applyDetail.applyId});
                break;
            case 'editBuyNumber':
                muiOpenWindowWithoutWaiting('edit-number.html', {applyId:applyDetail.applyId, buyNumber:buyNumberList});
                break;
        }
    };

    function showRefuseDialog() {
        mui.prompt('请输入拒绝原因', '', '', ['发送', '取消'], clickRefuseDialog);
    };

    function clickRefuseDialog(e) {
        if (e.index == 0) {
            var data = {
                id: applyDetail.id,
                applyId: applyDetail.applyId,
                auditUserAccount: applyDetail.pesUserAccount,
                reason: e.value,
                applyStatus: APPLY_STATUS_REFUSE,
                auditTime: new Date().now()
            };
            console.log('refuse:' + JSON.stringify(data));
            // muiPostDataWithAuthorization(HTTP_DEAL_APPLY, data, refuseSuccess);
        }
    };

    function refuseSuccess(response) {
        console.log('refuse:' + JSON.stringify(response));
        if (response.result == HTTP_RESULT_SUCCESS) {
            mui.back();
        } else {
            console.log('refuse error');
        }
    };

    function onEditNumber(event) {
        if (event.detail.data) {
            buyNumberList = event.detail.data;
            consoleLog(TAG, JSON.stringify(buyNumberList));
            createBuyNumberUi();
            checkBuyNumberList();
        }
    };

    function createBuyNumberUi() {
        var length = buyNumberList.length;
        removeElementNode(buyNumberListDiv);
        for (var i = 1; i <= length; i++) {
            var div = document.createElement('div');
            var label = document.createElement('label');
            label.innerText = '采购编号' + i;

            var numberLabel = document.createElement('label');
            numberLabel.innerText = buyNumberList[i - 1];
            div.appendChild(label);
            div.appendChild(numberLabel);

            buyNumberListDiv.appendChild(div);
        }
    };
})();
