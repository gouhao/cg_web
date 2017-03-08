/**
 * Created by gouhao on 2017/3/7 0007.
 */

function Database() {
    this.TAG = 'Database';
    this.TABLE_AREA = 'table_area';
    this.TABLE_PERSON = 'table_person';
    this.version = 3;
    this.dbName = 'cg';
    this.READ_WRITE = 'readwrite';
    this.READ_ONLY = 'readonly';
    this.indexedDb = window.indexedDB || window.msIndexedDB || window.mozIndexedDB || window.webkitIndexedDB;
};

Database.prototype.initDatabase = function () {
    this.openDatabase(function (db) {
        if(!db.objectStoreNames.contains(this.TABLE_AREA)){
            var request = db.version = parseInt(db.version) + 1;

            var up = function(e) {
                var newDb =  e.target.result;
                newDb.createObjectStore(this.TABLE_AREA, {keyPath: 'id'});
                newDb.createObjectStore(this.TABLE_PERSON, {keyPath: 'id'});
            };
            var uT = up.bind(this);
            request.onupgradeneeded = uT;
        }
    });
};

Database.prototype.openDatabase = function (callback) {
    var request = this.indexedDb.open(this.dbName, this.version);
    var fError = this.defaultDatabaseError.bind(this);

    request.onerror = fError;

    var suc = function(event) {
         callback.call(this, event.target.result);
    };
    var fSuc = suc.bind(this);
    request.onsuccess = fSuc;
};

Database.prototype.defaultDatabaseError = function (event) {
    consoleLog(this.TAG, 'database request error');
};

Database.prototype.defaultDatabaseSuccess = function (event) {
    consoleLog(this.TAG, 'database request success');
};


