//(c) 2007 Nikhil Marathe (http://22bits.exofire.net). GNU GPL license.
//@version 0.1
// Implements utility functions for the DOM
// Extends Element
//
// REQUIRES base.js


/**************
 *   DOM   *
 *************/


/**
 * Returns all elements which have the class cName.
 * @param {String} The class name to search for
 * @returns An array of all elements.
*/
function getElementsByClassName(cName) {
    elements = document.getElementsByTagName("*");
    var ret = [];
    $A(elements).each(function(el) { if($(el).hasClassName(cName)) ret.push(el); });
    return ret;
}

if (!window.Element) Element = Class.create();
/**
 * Extends the Element class to add certain features.
 * @version 0.1
*/

//store here for use in $()
CustomElement = Class.create();

Object.extend(CustomElement.prototype, {
    /**
     * Removes an element from the DOM.
    */
    remove:function() {
        this.parentNode.removeChild(this);
    },
    /**
     * Returns an array of all the class names of an element.
     * @returns An array of all class names as Strings.
    */
    getClassNames:function() {
        return this.className.split(' ');
    },
    /**
     * Returns the class name if the element has one of its classes as that, otherwise null.
     * @param {String} The class name to check.
     * @returns The class name or null.
    */
    hasClassName:function(cName) {
        return this.getClassNames().join(' ').match("\\b"+cName+"\\b");
    },
    /**
     * Adds a class to the element.
     * @param {String} The class name to add.
    */
    addClass:function(cName) {
        if(!this.hasClassName(cName))
            this.className += ' ' + cName;
        return this;
    },
    /**
     * Removes a class from the element.
     * @param {String} The class name to remove
    */
    removeClass:function(cName) {
        classNm = this.hasClassName(cName);
        if(classNm)
            this.className =this.getClassNames().join(' ').replace(classNm, '');
        return this;
    },
    
    /**
     * Add nodes as child nodes to this Element
    */
    addNodes:function(nodes) {
        __realThis = this;
        nodes.each(function(el) {
            __realThis.appendChild(el);
        });
        return this;
    },
    
    /**
     * Remove all nodes from the element
    */
    removeNodes:function() {
        if(this.hasChildNodes())
            while(this.hasChildNodes())
                this.removeChild(this.firstChild);
        return this;
    },
    /**
     * Sets the CSS style of an element to all values defined in the object
     * @param {Object} The object containing the style information.
     * Example:element.setStyle({height:500, color:'#00ff00'});
    */
    setStyle:function(style) {
        for(property in style) {
            //alert("Setting "+this.id+"'s style "+property+" = "+style[property]);
            this.style[property.camelize()] = style[property];
        }
        return this;
    },
    /**
     * Returns the value of the property defined in the element's stylesheet.
     * @param {String} property The CSS property
     * @returns {String} The value of the CSS property
    */
    getStyle:function(property) {
        var ret = this.style[property.camelize()];
        if(!ret) {
            if(document.defaultView && document.defaultView.getComputedStyle) {
                ret = document.defaultView.getComputedStyle(this, null).getPropertyValue(property.camelize());
            }
            else if(this.currentStyle) {
                ret = this.currentStyle[property.camelize()];
            }
        }
        return ret;
    },
    /**
     * Returns the dimensions of the element.
     * Accessible fields are x, y, width, height
    */
    getDimensions:function() {
        function get(elem) {
            var left = elem.parentNode.offsetWidth - elem.offsetWidth;
            var top = elem.parentNode.offsetHeight - elem.offsetHeight;
            var w = parseInt(elem.getStyle('width'))||elem.offsetWidth;
            var h = parseInt(elem.getStyle('height'))||elem.offsetHeight;
            return { x:left, y:top, width:w, height:h};
        }
        if(this.getStyle('display') == 'none') {
            var originalVisibility = this.visibility;
            var originalPosition = this.position;
            this.visibility = 'hidden';
            this.position = 'absolute';
            this.setStyle({display: 'block'});
            
            var ret = get(this);            
            this.visibility = originalVisibility;
            this.position = originalPosition;
            this.setStyle({display:'none'});
            return ret;
        }
        return get(this);
        
    },
    
    addEvent:function(type, callback, useCapture) {
        Events.push([this, type, callback, useCapture]);
        //try W3C
        if(window.addEventListener) {
            this.addEventListener(type, callback, useCapture);
        }
        //else MS
        else {
            this.attachEvent('on'+type, callback.bind(this));
        }
    },

    removeEvent:function(type, callback, useCapture) {
        //try W3C
        if(window.addEventListener) {
            this.removeEventListener(type, callback, useCapture);
        }
        //else MS
        else {
            this.detachEvent('on'+type, callback.bind(this));
        }
    } 
});

//actual extend
Object.extend(Element, CustomElement.prototype);

/**
 * Returns elements having the id passed as a string argument.
 * More than one id can be provided in which case an array of all elements
 * having the corresponding ids is returned
 * @param One or more strings specifying ids.
 * @returns An array or a single element.
*/
function $() {
    if(arguments.length == 1) return getElem(arguments[0]);
    var ret = [];
    $A(arguments).each(
    function (el) {
        ret.push(getElem(el));
    });
    function getElem(el) {
        if (typeof el == 'string' )
            el = document.getElementById(el);
        return ( el ? Object.extend(el, CustomElement.prototype) : false);
    }
    return ret;
}

if(!window.Event)
    var Event = Class.create();
Object.extend(Event, {
    stopEvent: function(event) {
        if(event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;
    },
    
    stopDefault: function(event) {
        if(event.preventDefault) event.preventDefault();
        else event.returnValue = false;
    }
});

var Events = Class.create();
Object.extend(Events, {
    eventList : false,
    push:function(event) {
        if(!this.eventList) this.eventList = [];
        this.eventList.push(event);
    },
    unloadAll:function() {
        if(!this.eventList) return;
        $A(this.eventList).each( function(item) {
            item[0].removeEvent(item[1], item[2], item[3]);
            item[0] = null;
        });
    }
});

$(window).addEvent('unload', Events.unloadAll, false);
