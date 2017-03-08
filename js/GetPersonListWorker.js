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
        var store = db.transaction(tableName, this.READ_WRITE).objectStore(tableName);
        var request = store.openCursor();
        request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                resultList.push(cursor.value);
                cursor.continue();
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
    this.getDataFromTable(this.TABLE_DATA, callback);
};