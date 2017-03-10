(function () {
	var TAG = 'ModifyYearController';
    var selectedTimeLabel;
	var yearsList = [];
    mui.plusReady(onPlusReady);

    function onPlusReady() {
        getEnableYears();
        initUi();
        initAction();
    };

    function getEnableYears() {
        muiPostDataWithAuthorization(HTTP_SET_YEAR, '', getEnableYearsSuccess);
    };

    function getEnableYearsSuccess(response) {
        consoleLog(TAG, 'get enable years:' + JSON.stringify(response));
        if(response.result == HTTP_RESULT_SUCCESS) {
			dealYearData(response.data);
		} else {
        	consoleLog(TAG, 'get enable years error');
		}
    };

    function dealYearData(years) {
        var length = years.length;
        if(length > 0) {
			for(var i = 0; i < length; i++) {
                var year = years[i].description;
                var o = {
					value:year,
					text: year
				};
				yearsList.push(o);
			}
			document.getElementById('setLayout').style.display = 'block';
		}
    }
    function initUi(){
        selectedTimeLabel = document.getElementById('selectTime');
        selectedTimeLabel.innerText = localStorage.getItem(KEY_YEAR);
    };

    function initAction(){
        var div = document.getElementById('setYear');
        div.addEventListener('click', setYearClick);
        div.addEventListener('touchstart', handleClick);
        div.addEventListener('touchend', handleClick);
    };

    function handleClick(event) {
        switch(event.type){
            case 'touchstart':
                this.style.backgroundColor = '#999';
                break;
            case 'touchend':
                this.style.backgroundColor = '#fff';
                break;
        }

    };

    function setYearClick() {
        var picker = new mui.PopPicker();
        picker.setData(yearsList);
        picker.pickers[0].setSelectedValue(selectedTimeLabel.innerText);
        picker.show(function(rs){
            var selectYear = rs[0].text;
            localStorage.setItem(KEY_YEAR, selectYear);
            selectedTimeLabel.innerText = selectYear;
        });
    };

})();
