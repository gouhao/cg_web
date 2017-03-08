/**
 * Created by gouhao on 2017/3/7 0007.
 */
function CreatePersonListWorker(callback) {
    this.TAG = 'CreatePersonListWorker';
    Database.call(this);
    this.callback = callback;
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
        this.saveToDb(this.TABLE_DATA, response.data);
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
            request.onsuccess = this.defaultDatabaseSuccess;
    });

};

CreatePersonListWorker.prototype.getPerson = function () {
    var successFun = this.getPersonSuccess.bind(this);
    muiPostDataWithAuthorization(HTTP_GET_PERSON_LIST, new Object(), successFun);
};

CreatePersonListWorker.prototype.getPersonSuccess = function (response) {
    consoleLog(this.TAG, JSON.stringify(response));
    if (response.result == HTTP_RESULT_SUCCESS) {
        this.saveToDb(this.TABLE_DATA, response.data);
        this.notifyCaller(HTTP_RESULT_SUCCESS);
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

