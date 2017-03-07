/**
 * Created by gouhao on 2017/3/6 0006.
 */
function AddDetailContractStrategy(listDiv, list) {
    this.tag = 'AddDetailContractStrategy';
    AddDetailBase.call(this, this.tag, listDiv, list);
};


AddDetailContractStrategy.prototype = new AddDetailBase();

AddDetailContractStrategy.prototype.createItem = function (contractItem, index) {

    var pos = index ? index : this.itemCount;

    var parentDiv = document.createElement('div');
    parentDiv.className = 'input-content';

    var titleDiv = document.createElement('div');
    var label = document.createElement('label');
    label.className = 'item-title';
    label.innerText = '合同备案' + (parseInt(pos) + 1);
    titleDiv.appendChild(label);

    var deleteLabel = document.createElement('button');
    deleteLabel.innerText = '删除';
    deleteLabel.id = pos + '';
    deleteLabel.addEventListener('click', this.deleteItem.bind(this));
    titleDiv.appendChild(deleteLabel);
    parentDiv.appendChild(titleDiv);

    var companyDiv = document.createElement('div');

    var companyLabel = document.createElement('label');
    companyLabel.innerText = '中标单位';

    var companyInput = document.createElement('input');
    companyInput.className = 'item-input';
    companyInput.type = 'text';
    companyInput.placeholder = '请输入中标单位(必填)';
    companyInput.value = contractItem ? contractItem.company : '';
    companyInput.id = 'company' + this.itemCount;
    companyInput.maxLength = '20';
    companyDiv.appendChild(companyLabel);
    companyDiv.appendChild(companyInput);

    var priceDiv = document.createElement('div');

    var priceLabel = document.createElement('label');
    priceLabel.innerText = '合同金额';

    var priceInput = document.createElement('input');
    priceInput.className = 'item-input';
    priceInput.type = 'text';
    priceInput.placeholder = '请输入合同金额(必填)';
    priceInput.value = contractItem ? contractItem.price : '';
    priceInput.id = 'price' + this.itemCount;
    priceInput.maxLength = '20';

    priceDiv.appendChild(priceLabel);
    priceDiv.appendChild(priceInput);

    var dateDiv = document.createElement('div');

    var dateLabel = document.createElement('label');
    dateLabel.innerText = '合同日期';

    var dateInput = document.createElement('input');
    dateInput.className = 'item-input';
    dateInput.type = 'date';
    dateInput.placeholder = '请输入合同日期(必填)';
    dateInput.value = contractItem ? contractItem.date : '';
    dateInput.id = 'date' + this.itemCount;
    dateInput.maxLength = '20';

    dateDiv.appendChild(dateLabel);
    dateDiv.appendChild(dateInput);

    parentDiv.appendChild(companyDiv);
    parentDiv.appendChild(priceDiv);
    parentDiv.appendChild(dateDiv);

    return parentDiv;
};

AddDetailContractStrategy.prototype.getHttpUrl = function () {
    return HTTP_ADD_CONTRACT;
};

AddDetailContractStrategy.prototype.getHttpRequestData = function () {
    this.contentList.splice(0, this.contentList.length);
    for(var i = 0; i < this.itemCount; i++){
        var contractItem = new Object();
        var companyInput = document.getElementById('company' + i);
        if(companyInput.value.trim()) {
            contractItem.company = companyInput.value;
        } else {
            continue;
        }

        var priceInput = document.getElementById('price' + i);
        if(priceInput.value.trim()) {
            contractItem.price = priceInput.value;
        }
        var dateInput = document.getElementById('date' + i);
        if(dateInput.value.trim()) {
            contractItem.date = dateInput.value;
        }

        this.contentList.push(contractItem);
    }
};

