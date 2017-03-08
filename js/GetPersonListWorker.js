/**
 * Created by gouhao on 2017/3/7 0007.
 */
function GetPersonListWorker() {
    Database.call(this);
};

GetPersonListWorker.prototype = new Database();

GetPersonListWorker.prototype.getDataFromTable = function(tableName, callback) {
    this.openDatabase(function (db) {
        var store = db.transaction(tableName, this.READ_WRITE).objectStore(tableName);
        var request = store.openCursor();
        request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (callback) {
                    callback(cursor.value);
                }
            }
        };
        request.onerror = this.defaultDatabaseError.bind(this);
    });
}
GetPersonListWorker.prototype.getAreaList = function (callback) {
    this.getDataFromTable(this.TABLE_DATA, callback);
};