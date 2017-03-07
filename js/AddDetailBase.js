/**
 * Created by gouhao on 2017/3/6 0006.
 */
function AddDetailBase(tag, listDiv, list) {
    this.tag = tag;
    this.itemCount = 0;
    this.listParentDiv = listDiv;
    this.contentList = list;
};

AddDetailBase.prototype.addContent = function (number, index) {
    var div = this.createItem(index, number);
    this.listParentDiv.appendChild(div);
    this.itemCount++;
};

AddDetailBase.prototype.createItem = function(index, number) {};

AddDetailBase.prototype.send = function () {
  var url = this.getHttpUrl();
  var data = this.getHttpRequestData();
  mui.toast('send request');
  // muiPostDataWithAuthorization(url, data, this.requestSuccess);
};

AddDetailBase.prototype.getHttpUrl = function () {

};

AddDetailBase.prototype.getHttpRequestData = function () {

};

AddDetailBase.prototype.requestSuccess = function (response) {
  consoleLog(this.tag, JSON.stringify(response));
  if(response.result == HTTP_RESULT_SUCCESS) {
      mui.back();
      this.sendToTarget();
  } else {
      consoleLog(this.tag, 'send error');
  }
};

AddDetailBase.prototype.sendToTarget = function () {
  var target = plus.webview.currentWebview();
  mui.fire(target, this.tag, this.contentList);
};

AddDetailBase.prototype.initContentArray = function () {
    this.contentList.splice(0, this.contentList.length);
    for(var i = 0; i < this.itemCount; i++){
        var input = document.getElementById('buyNumber' + i);
        if(input.value.trim()) {
            this.contentList.push(input.value);
        }
    }
};

AddDetailBase.prototype.deleteItem = function() {
	consoleLog(this.tag, JSON.stringify(this.contentList));
    this.contentList.splice(this.id, 1);
    
    removeElementNode(this.listParentDiv);
    this.itemCount--;

    var tLength = this.itemCount;
    this.itemCount = 0;
    for(var i = 0; i < tLength; i++){
        if(i < this.contentList.length) {
            this.addContent(this.contentList[i]);
        } else {
            this.addContent();
        }
    }
};
