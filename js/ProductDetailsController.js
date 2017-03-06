/**
 * Created by gouhao on 2017/3/2 0002.
 */
(function(mui) {
    var title, typeInput, nameInput, numberInput, guessPriceInput;
    var addNewMenu, modifyMenu;
    var productDetail = new Object();

    mui.plusReady(onPlusReady);
    function onPlusReady() {
        initViews();
        initContent();
        initAction();
    }



    function initViews() {
        title = document.getElementById('title');
        typeInput = document.getElementById('productType');
        nameInput = document.getElementById('name');
        numberInput = document.getElementById('number');
        guessPriceInput = document.getElementById('guessPrice');

        addNewMenu = document.getElementById('addNewMenu');
        modifyMenu = document.getElementById('modifyMenu');
    };

    function initContent() {
        var self = plus.webview.currentWebview();
        if (self.content != '') {
            productDetail = self.content;
            console.log('product-details->' + JSON.stringify(productDetail));
            title.innerText = productDetail.title;
            nameInput.value = productDetail.productName;
            typeInput.value = productDetail.type;
            numberInput.value = productDetail.planNum;
            guessPriceInput.value = productDetail.price;
            addNewMenu.style.display = 'none';
            modifyMenu.style.display = 'block';
        } else {
            title.innerText = '采购物品明细';
            addNewMenu.style.display = 'block';
            modifyMenu.style.display = 'none';
        }
    };


    function initAction() {
        document.getElementById('selectType').addEventListener('click', selectType);
        window.addEventListener('selectType', selectTypeFinished);
        document.getElementById('submit').addEventListener('click', submit);
        document.getElementById('submitAndAdd').addEventListener('click', submitAndAddMore);
    };

    function selectTypeFinished(event) {
        typeInput.value = event.detail.type;
    };

    function selectType() {
        muiOpenWindowWithoutWaiting('select-type.html', {type: typeInput.value});
    };

    function submit() {
        productDetail.productName = nameInput.value;
        productDetail.type = typeInput.value;
        productDetail.planNum = numberInput.value;
        productDetail.price = guessPriceInput.value;

        if (productDetail.productName == '' || productDetail.type == '' ||
            productDetail.planNum == '' || productDetail.price == '') {
            return mui.alert('请填写必填信息', '信息不完整');
        }

        var webView = plus.webview.getWebviewById('start-apply.html');
        mui.fire(webView, 'addNewDetail', {data: productDetail});
        mui.back();
    };

    function submitAndAddMore() {


    }
})(mui);