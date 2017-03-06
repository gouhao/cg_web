function ProductDetail() {
	this.title = '';
	this.name = '';
	this.type = '';
	this.number = 0;
	this.guessPrice = 0;
};

ProductDetail.prototype.cloneObject = function(obj){
	this.title = obj.title;
	this.name = obj.name;
	this.type = obj.type;
	this.number = obj.number;
	this.guessPrice = obj.guessPrice;
};

ProductDetail.prototype.toString = function() {
	return this.title + '-' + this.name + '-' + 
		this.type + '-' + this.number + '-' + this.guessPrice;
};

ProductDetail.prototype.getName = function() {
	return this.name;
};
