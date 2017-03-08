/**
 * Created by gouhao on 2017/3/7 0007.
 */
function CreatePersonListWorker(callback) {
    this.TAG = 'CreatePersonListWorker';
    Database.call(this);
    this.callback = callback;
    this.areaList;
    this.personList;
    this.parentDepartment = new Department();
    this.parentDepartment.id = '1';
    this.parentDepartment.description = '组织架构';
};

CreatePersonListWorker.prototype = new Database();

CreatePersonListWorker.prototype.start = function () {
    this.initDatabase(function () {
        this.getArea();
    });

};

CreatePersonListWorker.prototype.getArea = function () {
    var t = this.getAreaSuccess.bind(this);
    muiPostDataWithAuthorization(HTTP_GET_AREA_LIST, '', t);
};

CreatePersonListWorker.prototype.getAreaSuccess = function (response) {
    consoleLog(this.TAG, JSON.stringify(response));
    if (response.result == HTTP_RESULT_SUCCESS) {
        // this.saveToDb(this.TABLE_DATA, response.data);
        this.areaList = response.data;
        function compare(obj1, obj2) {
            return obj1.displaySort - obj2.displaySort;
        };
        this.areaList.sort(compare);
        this.getPerson();
    } else {
        consoleLog(this.TAG, 'get area error');
        this.notifyCaller(HTTP_RESULT_ERROR);
    }
};

CreatePersonListWorker.prototype.saveToDb = function (tableName, list) {
    this.openDatabase(function (db) {
        var transaction=db.transaction(tableName,this.READ_WRITE);
        var store=transaction.objectStore(tableName);
        var request;
            request = store.put(list);
            request.onerror = this.defaultDatabaseError;
            function success() {
                this.notifyCaller(HTTP_RESULT_SUCCESS);
            };
            var fs = success.bind(this);
            request.onsuccess = fs;
    });

};

CreatePersonListWorker.prototype.getPerson = function () {
    var successFun = this.getPersonSuccess.bind(this);
    muiPostDataWithAuthorization(HTTP_GET_PERSON_LIST, new Object(), successFun);
};

CreatePersonListWorker.prototype.getPersonSuccess = function (response) {
    consoleLog(this.TAG, JSON.stringify(response));
    if (response.result == HTTP_RESULT_SUCCESS) {
        this.personList = response.data;
        this.dealPerson();
    } else {
        consoleLog(this.TAG, 'get person error');
        this.notifyCaller(HTTP_RESULT_ERROR);
    }
};

CreatePersonListWorker.prototype.notifyCaller = function (result) {
    if (this.callback) {
        this.callback(result);
    }
};

CreatePersonListWorker.prototype.dealPerson = function() {
    var dataList = [];
    for(var i in this.areaList) {
        var item = this.areaList[i];
        var department = new Department(item);
        for(var j = 0; j < this.personList.length; j++) {
            var subItem = this.personList[j];
            if(subItem.orgStructure == item.codeName) {
                department.personList.push(subItem);
            }
        };
        dataList.push(department);
    }
    this.dealArea(dataList)
};

CreatePersonListWorker.prototype.dealArea = function(dataList) {
    for(var i in dataList) {
        var item = dataList[i];
        for(var j in dataList) {
            if(dataList[j].parentCode == item.codeName) {
                item.sonDepartmentList.push(dataList[j]);
            }
        }
    }

    for(var k in dataList) {
        if(!dataList[k].parentCode) {
            this.parentDepartment.sonDepartmentList.push(dataList[k]);
            this.saveToDb(this.TABLE_DATA, this.parentDepartment);
        }
    }
};
