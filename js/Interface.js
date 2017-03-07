var Interface = function(name, methods){
    var argLen = arguments.length;
    if(argLen != 2){
        throw new Error("Interface类的构造函数需要至少两个参数！");            
    }
    
    this.name = name;      //     用来保存接口名称
    this.methods = [];     //     用来保存要实现的方法名称
    
    var i = 0, methodLen = methods.length;
    for(; i<methodLen; i++){
        var method = methods[i];
        if(typeof method ){
            throw new Error("Interface类构造函数中的methods参数应该是string[]类型");
        }
        methods.push(method);
    }
};

Interface.ensureImpelements = function(object){
    var len = arguments.length;
    if(len < 2){
        throw new Error("方法Interface.ensureImplements需要至少两个参数!");
    }

    var i = 1;
    for(; i<len; i++){
        var interface = arguments[i];
        if(interface.constructor  != Interface){
            throw new Error("方法Interface.ensureImplements参数需要Interface的实例对象!");		}
        var	j = 0,
            methodsLen = interface.methods.length;
        for(; j<methodsLen; j++){
            var method = interface.methods[j];
            if(!object[method] || typeof object[method] != "function"){
                throw new Error("方法Interface.ensureImplements : object 没有实现" + interface.name + " 接口. 方法" + method + " 没有被找到!");
            }
        }
    }
};