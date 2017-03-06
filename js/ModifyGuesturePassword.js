var record = new Array();
var alert;
var commitButton;
mui.init();

mui.plusReady(onPlusReady);

function onPlusReady() {
	initUi();
	initAction();
};

function initUi(){
	alert = document.getElementById('alert');
	commitButton = document.getElementById('commit');
};

function initAction(){
	document.getElementById('locker').addEventListener('done', drawFinish);
	document.getElementById('cancel').addEventListener('click', cancel);
	commitButton.addEventListener('click', commit);
};

function cancel(){
	mui.back();
};

function commit(){
	if(record.length == 2) {
		mui.toast('手势修改成功');
		mui.back();
	}
};

function drawFinish(event){
	var res = event.detail;
	if(res.points.length <= 4) {
		alert.innerText = '必须要4个点以上';
		return res.sender.clear();
	}
	record.push(res.points.join(''));
	console.log(res.points.join(''));
	if(record.length == 2) {
		if(record[0] == record[1]) {
			alert.innerText = '设置成功';
			commitButton.innerText = '确定';
		} else {
			alert.innerText = '两次手势不一致';
			record = [];
		}
		
		res.sender.clear();
	} else {
		alert.innerText = '请确认手势设定';
		res.sender.clear();
	}
};
