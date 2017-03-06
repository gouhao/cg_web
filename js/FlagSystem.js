//标志系统，index从0开始
function FlagSystem(){
	this.flag = 0;
};

FlagSystem.prototype.set = function(b, index) {
	if(b) {
		this.flag |= (1 << index);
	} else {
		this.flag &= ~(1 << index);
	}
};

FlagSystem.prototype.get = function(index) {
	return (this.flag >> index) & 1;
};


