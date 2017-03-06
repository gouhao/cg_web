var STATUS_APPLYING_COLOR = '#7cc0f8';
var STATUS_REFUSE_COLOR = '#ff847b';
var STATUS_PASS_COLOR = '#28d8a5';
var STATUS_READY_COLOR = '#ffc926';
var STATUS_FINISH_COLOR = '#4fc3ff';
var STATUS_GIVE_UP_COLOR = '#f989c0';
var STATUS_FINANCE_CHECKING_COLOR = '#f989c0';


var STATUS_APPLYING_TEXT = '审批中';
var STATUS_REFUSE_TEXT = '已拒绝';
var STATUS_PASS_TEXT = '已通过';
var STATUS_READY_TEXT = '备案中';
var STATUS_FINISH_TEXT = '已完结';
var STATUS_GIVE_UP_TEXT = '已撤销';

function ApplyListCreator(parent, list, from) {
	this.contentDiv = parent;
	this.contentList = list;
	this.lastTail = 0;
	this.from = from;
}


ApplyListCreator.prototype.setParent = function(parent) {
	this.contentDiv = parent;
};


ApplyListCreator.prototype.insertHead = function() {
	this.lastTail = 0;
	this.appendDiv();
};

ApplyListCreator.prototype.appendDiv =  function() {
	this.createUi(this.lastTail, this.contentList.length);
};

ApplyListCreator.prototype.createUi = function(startIndex, endIndex){
	for(var i = startIndex; i < endIndex; i++) {
		var li = this.createLiItem(this.contentList[i]);
		this.contentDiv.appendChild(li);
	}
	this.lastTail = endIndex;
};

ApplyListCreator.prototype.createLiItem = function(item) {
	var li = document.createElement('li');
	li.id = item.applyId;
	li.className = 'mui-table-view-cell';
	var div = document.createElement('div');
	div.className = 'apply-item';
	
	var statusDiv = document.createElement('div');
	statusDiv.className = 'apply-status';
	
	var statusTextSpan = document.createElement('span');
	statusTextSpan.className = 'apply-status-text';

	statusTextSpan.innerText = getStatusText(item.applyStatus);
	statusDiv.appendChild(statusTextSpan);
	statusDiv.style.backgroundColor = getStatusColor(item.applyStatus);
	div.appendChild(statusDiv);
	
	var div1 = document.createElement('div');
	div1.className = 'apply-content';

	var titleP = document.createElement('p');
	titleP.innerText = item.title;
	titleP.className = 'apply-title';

	var typeP = document.createElement('p');
	typeP.innerText = item.remark;
	typeP.className = 'apply-time';

	div1.appendChild(titleP);
	div1.appendChild(typeP);
	div.appendChild(div1);

	var div2 = document.createElement('div');
	div2.className = 'apply-time';
	if(item.isApplied) {
		var appliedStatus = document.createElement('div');
		appliedStatus.innerText = item.applyStatus;
		div2.appendChild(appliedStatus);
	}
	var timeP = document.createElement('p');
	timeP.innerText = item.applyTime;
	div2.appendChild(timeP);
	
	div.appendChild(div2);
	
	li.appendChild(div);
	return li;

};