/**
 * Created by gouhao on 2017/3/10 0010.
 */
(function () {
    var TAG = 'SelectUnitController';

    var selectUnit;
    var contentListDiv;
    var contentList = [];

    var FLAG_HAS_CHILDREN = 'Y';
    mui.plusReady(onPlusReady);
	
    function onPlusReady() {
        initData();
        initUi();
    };

    function initData() {
        var self = plus.webview.currentWebview();
        selectUnit = self.selectUnit;

        getUnit();
    };



    function getUnit() {
        muiPostDataWithAuthorization(HTTP_QUERY_UNIT, '', getUnitSuccess);
    };



    function getUnitSuccess(response) {
        consoleLog(TAG, 'get unit:' + JSON.stringify(response));
        if(response.result == HTTP_RESULT_SUCCESS) {
            dealUnitData(response.data);

        } else {
            consoleLog(TAG, 'get unit error');
        }
    };

    function dealUnitData(data) {
        data.sort(unitCompare);
        for(var j in data) {
            var levelList = [];
            if(data[j].hasChildren == FLAG_HAS_CHILDREN) {
                for(var i in data) {
                    if(data[i].parentCode && data[i].parentCode == data[j].code) {
                        levelList.push(data[i]);
                    }
                }
                data[j].sonList = levelList;
                contentList.push(data[j]);
            }
        }
        updateUi();
    };

    function updateUi() {
        for(var i in contentList) {
            var li = document.createElement('li');
            li.className = 'mui-table-view-cell mui-radio mui-input-row';

            var label = document.createElement('label');
            label.innerText = contentList[i].description;

            var inputRadio = document.createElement('input');
            inputRadio.type = 'radio';

            li.appendChild(label);
            li.appendChild(inputRadio);

            var sonList = contentList[i].sonList;
            var ul = document.createElement('ul');
            ul.className = 'mui-table-view mui-table-view-chevron';

            // for(var j in sonList) {
            //     var sonLi = document.createElement('li');
            //     sonLi.className = 'mui-table-view-cell mui-radio';
            //
            //     var sonLabel = document.createElement('label');
            //     sonLabel.innerText = sonList[j].description;
            //
            //     var sonInput = document.createElement('input');
            //     sonInput.type = 'radio';
            //
            //     sonLi.appendChild(sonLabel);
            //     sonLi.appendChild(sonInput);
            //     ul.appendChild(sonLi);
            // }
            li.appendChild(ul);
            contentListDiv.appendChild(li);
        }
    };

    function unitCompare(obj1, obj2) {
        return obj1.displaySort - obj2.displaySort;
    };

    function initUi() {
    	 mui('.mui-scroll-wrapper').scroll({indicators: true});
        contentListDiv = document.getElementById('contentList');
    };

})();
