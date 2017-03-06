function ShareMeList(parentDiv){
	ApplyListTemplate.call(this, parentDiv);
}
ShareMeList.prototype = new ApplyListTemplate();
ShareMeList.prototype.constructor = ShareMeList;
ShareMeList.prototype.getContentData = initContentList; 

var contentDiv;
var shareMeTemplate;
mui.init();
mui.plusReady(function() {
	mui('.mui-scroll-wrapper').scroll({
		indicators: true
	});
	initUi();
	shareMeTemplate = new ShareMeList(contentDiv);
	shareMeTemplate.getContentData();
});

function initContentList() {
	for (var i = 0; i < 20; i++) {
		var message = new ApplyMessage();
		message.id = i + 100;
		message.applyStatus = '审批通过';
		message.applyDetail = '急缺电脑';
		message.applyTitle = '部六急缺电脑用'
		message.applyTime = '12:00';
		message.applyAuthor = '高飞';
		shareMeTemplate.contentList.push(message);
	}
	shareMeTemplate.createListUi();
};

function initUi(){
	contentDiv = document.getElementById('contentDiv');
};