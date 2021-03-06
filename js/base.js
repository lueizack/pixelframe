//(c) 2007 Nikhil Marathe (http://22bits.exofire.net). GNU GPL license.
//@version 0.1

/**
 * Adds a method to easily add properties to an objects prototype.
 * To extend Class with properties of AnotherClass just do
 * <code>Object.extend(Class.prototype, AnotherClass)</code>
*/
Object.extend = function(dest, src) {
    //alert("Copying properties of " + src + " to " + dest);
    for(property in src)
        dest[property] = src[property];
    return dest;
}

Class = {
    create:function() {
        return function() {
            this.initialize.apply(this, arguments);
        }
    }
}

/**
 * Binds the function to the passed object.
 * @param {Object} The object to bind to
*/
Function.prototype.bind = function(obj) {
    var __method = this;
    return function() {
        __method.apply(obj, arguments);
    }
}

function debug(data) {
    alert(data);
}

/**
 * Converts an array type object to an array.
 * Eg. arguments array
 * @param {Object} The array like object
 * @returns An array
*/
function $A(iterable) {
    var ret = [];
    for(var i = 0; i < iterable.length; i++)
        ret.push(iterable[i]);
    return ret;
}

