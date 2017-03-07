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
    var buyNumberList, contractList = [];
    var buyNumberListDiv, contractListDiv;
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
        contractListDiv = document.getElementById('contractListDiv');

        buyNumber = document.getElementById('buyNumber');
        checkBuyNumberList();
        if (from == FROM_APPLY_DEAL_PERSON) {
            document.getElementById('dealPersonMenu').style.display = 'block';

        } else if (from == FROM_APPLY_BUY_PERSON) {
            document.getElementById('buyPersonMenu').style.display = 'block';
        } else {
            //这里用于测试，先把它显示出来，等功能全了，就必须等审批通过了才显示
            document.getElementById('contractDiv').style.display = 'block';
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
        window.addEventListener(FROM_ADD_NUMBER, onEditNumber);
        window.addEventListener(FROM_ADD_CONTRACT, onAddContract);
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
                muiOpenWindowWithoutWaiting('add-detail.html', {applyId:applyDetail.applyId,
                    from:FROM_ADD_NUMBER});
                break;
            case 'editBuyNumber':
                muiOpenWindowWithoutWaiting('add-detail.html', {applyId:applyDetail.applyId, contentList:buyNumberList,
                    from:FROM_ADD_NUMBER});
                break;
            case 'addContract':
                muiOpenWindowWithoutWaiting('add-detail.html', {applyId:applyDetail.applyId, contentList:contractList,
                    from:FROM_ADD_CONTRACT});
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

    function onAddContract() {
      if(event.detail.data){
          contractList = event.detail.data;
          createContractUi();
          checkContractList();
      }
    };

    function createContractUi() {
        removeElementNode(contractListDiv);
        var length = contractList.length;
        for(var i = 0; i < length; i++) {
            contractListDiv.appendChild(createItem(contractList[i], i));
        }
    };

    function checkContractList() {

    };

    function createItem(contractItem, index) {
        consoleLog(TAG, JSON.stringify(contractItem));
        var parentDiv = document.createElement('div');
        parentDiv.className = 'input-content';

        var titleDiv = document.createElement('div');
        var label = document.createElement('label');
        label.className = 'item-title';
        label.innerText = '合同备案' + (parseInt(index) + 1);
        titleDiv.appendChild(label);

        parentDiv.appendChild(titleDiv);

        var companyDiv = document.createElement('div');

        var companyLabel = document.createElement('label');
        companyLabel.innerText = '中标单位';

        var companyInput = document.createElement('label');
        companyInput.className = 'item-input';
        companyInput.type = 'text';
        companyInput.innerText = contractItem ? contractItem.company : '';
        companyInput.id = 'company' + this.itemCount;
        companyInput.maxLength = '20';
        companyDiv.appendChild(companyLabel);
        companyDiv.appendChild(companyInput);

        var priceDiv = document.createElement('div');

        var priceLabel = document.createElement('label');
        priceLabel.innerText = '合同金额';

        var priceInput = document.createElement('label');
        priceInput.className = 'item-input';
        priceInput.innerText = contractItem ? contractItem.price : '';
        priceInput.id = 'price' + this.itemCount;
        priceInput.maxLength = '20';

        priceDiv.appendChild(priceLabel);
        priceDiv.appendChild(priceInput);

        var dateDiv = document.createElement('div');

        var dateLabel = document.createElement('label');
        dateLabel.innerText = '合同日期';

        var dateInput = document.createElement('label');
        dateInput.className = 'item-input';
        dateInput.innerText = contractItem ? contractItem.date : '';
        dateInput.id = 'date' + this.itemCount;
        dateInput.maxLength = '20';

        dateDiv.appendChild(dateLabel);
        dateDiv.appendChild(dateInput);

        parentDiv.appendChild(companyDiv);
        parentDiv.appendChild(priceDiv);
        parentDiv.appendChild(dateDiv);

        return parentDiv;
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
