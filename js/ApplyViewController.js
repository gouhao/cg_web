(function () {
	var TYPE_1 = '协议供货';
    var TYPE_2 = '部门集中采购';
    var TYPE_3 = '分散采购';
    var TYPE_4 = '公开招标';
    var TYPE_5 = '竞争性谈判';
    var TYPE_6 = '询价采购';
    var TYPE_7 = '单一来源';

    var FLAG_INDEX_IS_EDIT_REASON = 0;
    var FLAG_INDEX_IS_SELECT_TYPE = 1;

    var selectType = TYPE_1;
	var selectTypeLabel, reasonInput, sendButton;

	var flag;
	var info = new Object();
    mui.plusReady(onPlusReady);

    function onPlusReady() {
    	initData();
    	initUi();
        initAction();
    };

    function initData() {
    	flag = new FlagSystem();
		flag.set(false, FLAG_INDEX_IS_EDIT_REASON);
		flag.set(false, FLAG_INDEX_IS_SELECT_TYPE);

		var self = plus.webview.currentWebview();
		info.applyId = self.applyId;
		info.id = self.id;
		info.auditUserAccount = self.auditUserAccount;
    };

    function initUi() {
		selectTypeLabel = document.getElementById('selectTypeValue');
		reasonInput = document.getElementById('viewInput');
    };
    function initAction() {
        sendButton = document.getElementById('send');
        sendButton.addEventListener('click', send);
        document.getElementById('selectType').addEventListener('click', showSelectTypeDialog);
        reasonInput.addEventListener('input', onTextChange);
    };

    function onTextChange(event) {
        var hasChar = reasonInput.value.trim().length > 0;
        console.log('on text change hasChar:' + hasChar);
        flag.set(hasChar, FLAG_INDEX_IS_EDIT_REASON);
        checkEditStatus();
    };

    function showSelectTypeDialog(){
        var picker = new mui.PopPicker();
        var array = [
            {value:TYPE_1, text:TYPE_1},
            {value:TYPE_2, text:TYPE_2},
            {value:TYPE_3, text:TYPE_3},
            {value:TYPE_4, text:TYPE_4},
            {value:TYPE_5, text:TYPE_5},
            {value:TYPE_6, text:TYPE_6},
            {value:TYPE_7, text:TYPE_7}];
        picker.setData(array);
        picker.pickers[0].setSelectedValue(selectType);
        picker.show(selectTypeResult);
    };

    function selectTypeResult(selectItems) {
		selectType = selectItems[0].value;
		selectTypeLabel.innerText = selectType;
		flag.set(true, FLAG_INDEX_IS_SELECT_TYPE);
		checkEditStatus();
    };

	function checkEditStatus(){
        var b = flag.get(FLAG_INDEX_IS_EDIT_REASON) && flag.get(FLAG_INDEX_IS_SELECT_TYPE);
        var s = b ? 'true' : 'false';
        if(b) {
            sendButton.removeAttribute('disabled');
		} else {
        	sendButton.setAttribute('disabled', 'disabled');
		}

        console.log(s);
	};
    function send() {
		info.reason = reasonInput.value;
		info.applyStatus = APPLY_STATUS_PASS;
		info.auditTime = new Date().now();
		console.log('send pass data:' + JSON.stringify(info));
        // muiPostDataWithAuthorization(HTTP_DEAL_APPLY, info, passSuccess);
    };

    function passSuccess(response) {
		console.log('pass success:' + JSON.stringify(response));
		if(response.result == HTTP_RESULT_SUCCESS) {
			mui.back();
		} else {
			console.log('pass error');
		}
    }
})();
