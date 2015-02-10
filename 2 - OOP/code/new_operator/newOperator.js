(function (global) {
	if (!global.rule) {
		global.rule = {};
	}

	//Implement function that will work like a new operator;
	global.rule.createClassInstance = function (ClassFunction) {
        if (!global.rule) {
            global.rule = {};
        }

        var obj, ret, proto;
        // Check if `ClassFunction.prototype` is an object, not a primitive
        proto = Object(ClassFunction.prototype) === ClassFunction.prototype ? ClassFunction.prototype : Object.prototype;

        // Create an object that inherits from `proto`
        obj = Object.create(proto);

        // Apply the function setting `obj` as the `this` value
        ret = ClassFunction.apply(obj, Array.prototype.slice.call(arguments, 1));

        if (Object(ret) === ret) { // the result is an object?
            return ret;
        }
        return obj;
	};


	//Example usage:
	/*
	var inst = global.rule.createClassInstance(MyClass, arg1, arg2, arg3);
	*/

}(window));
