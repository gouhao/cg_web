/**
 * Created by gouhao on 2017/3/7 0007.
 */
function GetPersonListWorker() {
    Database.call(this);
};

GetPersonListWorker.prototype = new Database();

GetPersonListWorker.prototype.getDataFromTable = function(tableName, callback) {
    var resultList = [];
    this.openDatabase(function (db) {
        var store = db.transaction(tableName, this.READ_WRITE);
        var request = store.openCursor();
        request.onsuccess = function (event) {
            if (event.target.result) {
                resultList.push(event.target.result);
            } else {
                if (callback) {
                    callback(resultList);
                }
            }
        };
        request.onerror = this.defaultDatabaseError.bind(this);
    });
}
GetPersonListWorker.prototype.getAreaList = function (callback) {
    this.getDataFromTable(this.TABLE_AREA, callback);
};

GetPersonListWorker.prototype.getPersonList = function (callback) {
    this.getDataFromTable(this.TABLE_PERSON, callback);
};