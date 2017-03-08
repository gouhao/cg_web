
function Department(obj) {
	if(obj) {
        this.id = obj.id;
        this.codeName = obj.codeName;
        this.category = obj.category;
        this.description = obj.description;
        this.parentCode = obj.parentCode;
        this.displaySort = obj.displaySort;
        this.levelNum = obj.levelNum;
	}
	this.sonDepartmentList = [];
	this.personList = [];
};