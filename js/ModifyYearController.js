var selectedTime;

mui.init();
mui.plusReady(onPlusReady);

function onPlusReady() {
	initUi();
	initAction();
	
};

function initUi(){
	selectedTime = document.getElementById('selectTime');
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
	var optionsJson = this.getAttribute('data-options') || '{}';
	var options = JSON.parse(optionsJson);
	var picker = new mui.DtPicker(options);
	picker.show(function(rs){
		selectedTime.innerText = rs.text;
	});
};
