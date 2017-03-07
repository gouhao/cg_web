/**
 * Created by gouhao on 2017/3/6 0006.
 */

function AddDetailNumberStrategy(listDiv, list) {
    this.tag = 'AddDetailNumberStrategy';
    AddDetailBase.call(this, this.tag, listDiv, list);
};

AddDetailNumberStrategy.prototype = new AddDetailBase();


AddDetailNumberStrategy.prototype.createItem = function (number, index) {

    var pos = index ? index : this.itemCount;

    var div = document.createElement('div');
    div.className = 'input-content';

    var titleDiv = document.createElement('div');
    var label = document.createElement('label');
    label.className = 'item-title';
    label.innerText = '采购编号' + (parseInt(pos) + 1);
    titleDiv.appendChild(label);

    var deleteLabel = document.createElement('button');
    deleteLabel.innerText = '删除';
    deleteLabel.id = pos + '';
    deleteLabel.addEventListener('click', this.deleteItem.bind(this));
    titleDiv.appendChild(deleteLabel);

    var input = document.createElement('input');
    input.className = 'item-input';
    input.type = 'number';
    input.placeholder = '请填写采购编号';
    input.value = number ? number : '';
    input.id = 'buyNumber' + this.itemCount;
    input.maxLength = '20';

    div.appendChild(titleDiv);
    div.appendChild(input);
    return div;
};

AddDetailNumberStrategy.prototype.getHttpUrl = function () {
    return HTTP_ADD_BUY_NUMBER;
};

AddDetailNumberStrategy.prototype.getHttpRequestData = function () {
    this.contentList.splice(0, this.contentList.length);
    for(var i = 0; i < this.itemCount; i++){
        var input = document.getElementById('buyNumber' + i);
        if(input.value.trim()) {
            this.contentList.push(input.value);
        }
    }
};