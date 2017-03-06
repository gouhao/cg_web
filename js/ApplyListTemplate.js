var tag = 'ApplyListTemplate';
function ApplyListTemplate(listParentDiv) {
	this.contentDiv = listParentDiv;
	this.contentList = new Array();
};

ApplyListTemplate.prototype.getContentData = function(){
};

ApplyListTemplate.prototype.createListUi = function(){
	console.log(tag + '->createListUi');
	for (var i in this.contentList) {
		var li = createLiItem(this.contentList[i]);
		this.contentDiv.appendChild(li);
	}
};

function createLiItem(item) {
	var li = document.createElement('li');
	li.id = item.id;
	li.className = 'mui-table-view-cell';
	li.addEventListener('click', openApplyDetail);
	var div = document.createElement('div');
	div.className = 'apply-item';
	
	var img = document.createElement('img');
	img.src = 'qq.png';
	img.style.width = '30px';
	div.appendChild(img);

	var div1 = document.createElement('div');
	div1.className = 'apply-content';

	var titleP = document.createElement('p');
	titleP.innerText = item.applyAuthor;

	var typeP = document.createElement('p');
	typeP.innerText = item.applyDetail;

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

function openApplyDetail() {
	mui.openWindow({
		url:'apply-details.html', 
		waiting:{
			autoShow:false
		}, 
		extras:{
			listId:this.id
		}
	});
};
