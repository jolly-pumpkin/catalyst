const require_chunk = require("./chunk-4N-2k_uM.js");
//#region node_modules/underscore/underscore-node-f.cjs
var require_underscore_node_f = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var VERSION = "1.13.8";
	var root = typeof self == "object" && self.self === self && self || typeof global == "object" && global.global === global && global || Function("return this")() || {};
	var ArrayProto = Array.prototype, ObjProto = Object.prototype;
	var SymbolProto = typeof Symbol !== "undefined" ? Symbol.prototype : null;
	var push = ArrayProto.push, slice = ArrayProto.slice, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
	var supportsArrayBuffer = typeof ArrayBuffer !== "undefined", supportsDataView = typeof DataView !== "undefined";
	var nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeCreate = Object.create, nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;
	var _isNaN = isNaN, _isFinite = isFinite;
	var hasEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
	var nonEnumerableProps = [
		"valueOf",
		"isPrototypeOf",
		"toString",
		"propertyIsEnumerable",
		"hasOwnProperty",
		"toLocaleString"
	];
	var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	function restArguments(func, startIndex) {
		startIndex = startIndex == null ? func.length - 1 : +startIndex;
		return function() {
			var length = Math.max(arguments.length - startIndex, 0), rest = Array(length), index = 0;
			for (; index < length; index++) rest[index] = arguments[index + startIndex];
			switch (startIndex) {
				case 0: return func.call(this, rest);
				case 1: return func.call(this, arguments[0], rest);
				case 2: return func.call(this, arguments[0], arguments[1], rest);
			}
			var args = Array(startIndex + 1);
			for (index = 0; index < startIndex; index++) args[index] = arguments[index];
			args[startIndex] = rest;
			return func.apply(this, args);
		};
	}
	function isObject(obj) {
		var type = typeof obj;
		return type === "function" || type === "object" && !!obj;
	}
	function isNull(obj) {
		return obj === null;
	}
	function isUndefined(obj) {
		return obj === void 0;
	}
	function isBoolean(obj) {
		return obj === true || obj === false || toString.call(obj) === "[object Boolean]";
	}
	function isElement(obj) {
		return !!(obj && obj.nodeType === 1);
	}
	function tagTester(name) {
		var tag = "[object " + name + "]";
		return function(obj) {
			return toString.call(obj) === tag;
		};
	}
	var isString = tagTester("String");
	var isNumber = tagTester("Number");
	var isDate = tagTester("Date");
	var isRegExp = tagTester("RegExp");
	var isError = tagTester("Error");
	var isSymbol = tagTester("Symbol");
	var isArrayBuffer = tagTester("ArrayBuffer");
	var isFunction = tagTester("Function");
	var nodelist = root.document && root.document.childNodes;
	if (typeof /./ != "function" && typeof Int8Array != "object" && typeof nodelist != "function") isFunction = function(obj) {
		return typeof obj == "function" || false;
	};
	var isFunction$1 = isFunction;
	var hasObjectTag = tagTester("Object");
	var hasDataViewBug = supportsDataView && (!/\[native code\]/.test(String(DataView)) || hasObjectTag(/* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8)))), isIE11 = typeof Map !== "undefined" && hasObjectTag(/* @__PURE__ */ new Map());
	var isDataView = tagTester("DataView");
	function alternateIsDataView(obj) {
		return obj != null && isFunction$1(obj.getInt8) && isArrayBuffer(obj.buffer);
	}
	var isDataView$1 = hasDataViewBug ? alternateIsDataView : isDataView;
	var isArray = nativeIsArray || tagTester("Array");
	function has$1(obj, key) {
		return obj != null && hasOwnProperty.call(obj, key);
	}
	var isArguments = tagTester("Arguments");
	(function() {
		if (!isArguments(arguments)) isArguments = function(obj) {
			return has$1(obj, "callee");
		};
	})();
	var isArguments$1 = isArguments;
	function isFinite$1(obj) {
		return !isSymbol(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
	}
	function isNaN$1(obj) {
		return isNumber(obj) && _isNaN(obj);
	}
	function constant(value) {
		return function() {
			return value;
		};
	}
	function createSizePropertyCheck(getSizeProperty) {
		return function(collection) {
			var sizeProperty = getSizeProperty(collection);
			return typeof sizeProperty == "number" && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
		};
	}
	function shallowProperty(key) {
		return function(obj) {
			return obj == null ? void 0 : obj[key];
		};
	}
	var getByteLength = shallowProperty("byteLength");
	var isBufferLike = createSizePropertyCheck(getByteLength);
	var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
	function isTypedArray(obj) {
		return nativeIsView ? nativeIsView(obj) && !isDataView$1(obj) : isBufferLike(obj) && typedArrayPattern.test(toString.call(obj));
	}
	var isTypedArray$1 = supportsArrayBuffer ? isTypedArray : constant(false);
	var getLength = shallowProperty("length");
	function emulatedSet(keys) {
		var hash = {};
		for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;
		return {
			contains: function(key) {
				return hash[key] === true;
			},
			push: function(key) {
				hash[key] = true;
				return keys.push(key);
			}
		};
	}
	function collectNonEnumProps(obj, keys) {
		keys = emulatedSet(keys);
		var nonEnumIdx = nonEnumerableProps.length;
		var constructor = obj.constructor;
		var proto = isFunction$1(constructor) && constructor.prototype || ObjProto;
		var prop = "constructor";
		if (has$1(obj, prop) && !keys.contains(prop)) keys.push(prop);
		while (nonEnumIdx--) {
			prop = nonEnumerableProps[nonEnumIdx];
			if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) keys.push(prop);
		}
	}
	function keys(obj) {
		if (!isObject(obj)) return [];
		if (nativeKeys) return nativeKeys(obj);
		var keys = [];
		for (var key in obj) if (has$1(obj, key)) keys.push(key);
		if (hasEnumBug) collectNonEnumProps(obj, keys);
		return keys;
	}
	function isEmpty(obj) {
		if (obj == null) return true;
		var length = getLength(obj);
		if (typeof length == "number" && (isArray(obj) || isString(obj) || isArguments$1(obj))) return length === 0;
		return getLength(keys(obj)) === 0;
	}
	function isMatch(object, attrs) {
		var _keys = keys(attrs), length = _keys.length;
		if (object == null) return !length;
		var obj = Object(object);
		for (var i = 0; i < length; i++) {
			var key = _keys[i];
			if (attrs[key] !== obj[key] || !(key in obj)) return false;
		}
		return true;
	}
	function _$1(obj) {
		if (obj instanceof _$1) return obj;
		if (!(this instanceof _$1)) return new _$1(obj);
		this._wrapped = obj;
	}
	_$1.VERSION = VERSION;
	_$1.prototype.value = function() {
		return this._wrapped;
	};
	_$1.prototype.valueOf = _$1.prototype.toJSON = _$1.prototype.value;
	_$1.prototype.toString = function() {
		return String(this._wrapped);
	};
	function toBufferView(bufferSource) {
		return new Uint8Array(bufferSource.buffer || bufferSource, bufferSource.byteOffset || 0, getByteLength(bufferSource));
	}
	var tagDataView = "[object DataView]";
	function isEqual(a, b) {
		var todo = [{
			a,
			b
		}];
		var aStack = [], bStack = [];
		while (todo.length) {
			var frame = todo.pop();
			if (frame === true) {
				aStack.pop();
				bStack.pop();
				continue;
			}
			a = frame.a;
			b = frame.b;
			if (a === b) {
				if (a !== 0 || 1 / a === 1 / b) continue;
				return false;
			}
			if (a == null || b == null) return false;
			if (a !== a) {
				if (b !== b) continue;
				return false;
			}
			var type = typeof a;
			if (type !== "function" && type !== "object" && typeof b != "object") return false;
			if (a instanceof _$1) a = a._wrapped;
			if (b instanceof _$1) b = b._wrapped;
			var className = toString.call(a);
			if (className !== toString.call(b)) return false;
			if (hasDataViewBug && className == "[object Object]" && isDataView$1(a)) {
				if (!isDataView$1(b)) return false;
				className = tagDataView;
			}
			switch (className) {
				case "[object RegExp]":
				case "[object String]":
					if ("" + a === "" + b) continue;
					return false;
				case "[object Number]":
					todo.push({
						a: +a,
						b: +b
					});
					continue;
				case "[object Date]":
				case "[object Boolean]":
					if (+a === +b) continue;
					return false;
				case "[object Symbol]":
					if (SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b)) continue;
					return false;
				case "[object ArrayBuffer]":
				case tagDataView:
					todo.push({
						a: toBufferView(a),
						b: toBufferView(b)
					});
					continue;
			}
			var areArrays = className === "[object Array]";
			if (!areArrays && isTypedArray$1(a)) {
				if (getByteLength(a) !== getByteLength(b)) return false;
				if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) continue;
				areArrays = true;
			}
			if (!areArrays) {
				if (typeof a != "object" || typeof b != "object") return false;
				var aCtor = a.constructor, bCtor = b.constructor;
				if (aCtor !== bCtor && !(isFunction$1(aCtor) && aCtor instanceof aCtor && isFunction$1(bCtor) && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b) return false;
			}
			var length = aStack.length;
			while (length--) if (aStack[length] === a) {
				if (bStack[length] === b) break;
				return false;
			}
			if (length >= 0) continue;
			aStack.push(a);
			bStack.push(b);
			todo.push(true);
			if (areArrays) {
				length = a.length;
				if (length !== b.length) return false;
				while (length--) todo.push({
					a: a[length],
					b: b[length]
				});
			} else {
				var _keys = keys(a), key;
				length = _keys.length;
				if (keys(b).length !== length) return false;
				while (length--) {
					key = _keys[length];
					if (!has$1(b, key)) return false;
					todo.push({
						a: a[key],
						b: b[key]
					});
				}
			}
		}
		return true;
	}
	function allKeys(obj) {
		if (!isObject(obj)) return [];
		var keys = [];
		for (var key in obj) keys.push(key);
		if (hasEnumBug) collectNonEnumProps(obj, keys);
		return keys;
	}
	function ie11fingerprint(methods) {
		var length = getLength(methods);
		return function(obj) {
			if (obj == null) return false;
			if (getLength(allKeys(obj))) return false;
			for (var i = 0; i < length; i++) if (!isFunction$1(obj[methods[i]])) return false;
			return methods !== weakMapMethods || !isFunction$1(obj[forEachName]);
		};
	}
	var forEachName = "forEach", hasName = "has", commonInit = ["clear", "delete"], mapTail = [
		"get",
		hasName,
		"set"
	];
	var mapMethods = commonInit.concat(forEachName, mapTail), weakMapMethods = commonInit.concat(mapTail), setMethods = ["add"].concat(commonInit, forEachName, hasName);
	var isMap = isIE11 ? ie11fingerprint(mapMethods) : tagTester("Map");
	var isWeakMap = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester("WeakMap");
	var isSet = isIE11 ? ie11fingerprint(setMethods) : tagTester("Set");
	var isWeakSet = tagTester("WeakSet");
	function values(obj) {
		var _keys = keys(obj);
		var length = _keys.length;
		var values = Array(length);
		for (var i = 0; i < length; i++) values[i] = obj[_keys[i]];
		return values;
	}
	function pairs(obj) {
		var _keys = keys(obj);
		var length = _keys.length;
		var pairs = Array(length);
		for (var i = 0; i < length; i++) pairs[i] = [_keys[i], obj[_keys[i]]];
		return pairs;
	}
	function invert(obj) {
		var result = {};
		var _keys = keys(obj);
		for (var i = 0, length = _keys.length; i < length; i++) result[obj[_keys[i]]] = _keys[i];
		return result;
	}
	function functions(obj) {
		var names = [];
		for (var key in obj) if (isFunction$1(obj[key])) names.push(key);
		return names.sort();
	}
	function createAssigner(keysFunc, defaults) {
		return function(obj) {
			var length = arguments.length;
			if (defaults) obj = Object(obj);
			if (length < 2 || obj == null) return obj;
			for (var index = 1; index < length; index++) {
				var source = arguments[index], keys = keysFunc(source), l = keys.length;
				for (var i = 0; i < l; i++) {
					var key = keys[i];
					if (!defaults || obj[key] === void 0) obj[key] = source[key];
				}
			}
			return obj;
		};
	}
	var extend = createAssigner(allKeys);
	var extendOwn = createAssigner(keys);
	var defaults = createAssigner(allKeys, true);
	function ctor() {
		return function() {};
	}
	function baseCreate(prototype) {
		if (!isObject(prototype)) return {};
		if (nativeCreate) return nativeCreate(prototype);
		var Ctor = ctor();
		Ctor.prototype = prototype;
		var result = new Ctor();
		Ctor.prototype = null;
		return result;
	}
	function create(prototype, props) {
		var result = baseCreate(prototype);
		if (props) extendOwn(result, props);
		return result;
	}
	function clone(obj) {
		if (!isObject(obj)) return obj;
		return isArray(obj) ? obj.slice() : extend({}, obj);
	}
	function tap(obj, interceptor) {
		interceptor(obj);
		return obj;
	}
	function toPath$1(path) {
		return isArray(path) ? path : [path];
	}
	_$1.toPath = toPath$1;
	function toPath(path) {
		return _$1.toPath(path);
	}
	function deepGet(obj, path) {
		var length = path.length;
		for (var i = 0; i < length; i++) {
			if (obj == null) return void 0;
			obj = obj[path[i]];
		}
		return length ? obj : void 0;
	}
	function get(object, path, defaultValue) {
		var value = deepGet(object, toPath(path));
		return isUndefined(value) ? defaultValue : value;
	}
	function has(obj, path) {
		path = toPath(path);
		var length = path.length;
		for (var i = 0; i < length; i++) {
			var key = path[i];
			if (!has$1(obj, key)) return false;
			obj = obj[key];
		}
		return !!length;
	}
	function identity(value) {
		return value;
	}
	function matcher(attrs) {
		attrs = extendOwn({}, attrs);
		return function(obj) {
			return isMatch(obj, attrs);
		};
	}
	function property(path) {
		path = toPath(path);
		return function(obj) {
			return deepGet(obj, path);
		};
	}
	function optimizeCb(func, context, argCount) {
		if (context === void 0) return func;
		switch (argCount == null ? 3 : argCount) {
			case 1: return function(value) {
				return func.call(context, value);
			};
			case 3: return function(value, index, collection) {
				return func.call(context, value, index, collection);
			};
			case 4: return function(accumulator, value, index, collection) {
				return func.call(context, accumulator, value, index, collection);
			};
		}
		return function() {
			return func.apply(context, arguments);
		};
	}
	function baseIteratee(value, context, argCount) {
		if (value == null) return identity;
		if (isFunction$1(value)) return optimizeCb(value, context, argCount);
		if (isObject(value) && !isArray(value)) return matcher(value);
		return property(value);
	}
	function iteratee(value, context) {
		return baseIteratee(value, context, Infinity);
	}
	_$1.iteratee = iteratee;
	function cb(value, context, argCount) {
		if (_$1.iteratee !== iteratee) return _$1.iteratee(value, context);
		return baseIteratee(value, context, argCount);
	}
	function mapObject(obj, iteratee, context) {
		iteratee = cb(iteratee, context);
		var _keys = keys(obj), length = _keys.length, results = {};
		for (var index = 0; index < length; index++) {
			var currentKey = _keys[index];
			results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
		}
		return results;
	}
	function noop() {}
	function propertyOf(obj) {
		if (obj == null) return noop;
		return function(path) {
			return get(obj, path);
		};
	}
	function times(n, iteratee, context) {
		var accum = Array(Math.max(0, n));
		iteratee = optimizeCb(iteratee, context, 1);
		for (var i = 0; i < n; i++) accum[i] = iteratee(i);
		return accum;
	}
	function random(min, max) {
		if (max == null) {
			max = min;
			min = 0;
		}
		return min + Math.floor(Math.random() * (max - min + 1));
	}
	var now = Date.now || function() {
		return (/* @__PURE__ */ new Date()).getTime();
	};
	function createEscaper(map) {
		var escaper = function(match) {
			return map[match];
		};
		var source = "(?:" + keys(map).join("|") + ")";
		var testRegexp = RegExp(source);
		var replaceRegexp = RegExp(source, "g");
		return function(string) {
			string = string == null ? "" : "" + string;
			return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
		};
	}
	var escapeMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#x27;",
		"`": "&#x60;"
	};
	var _escape = createEscaper(escapeMap);
	var _unescape = createEscaper(invert(escapeMap));
	var templateSettings = _$1.templateSettings = {
		evaluate: /<%([\s\S]+?)%>/g,
		interpolate: /<%=([\s\S]+?)%>/g,
		escape: /<%-([\s\S]+?)%>/g
	};
	var noMatch = /(.)^/;
	var escapes = {
		"'": "'",
		"\\": "\\",
		"\r": "r",
		"\n": "n",
		"\u2028": "u2028",
		"\u2029": "u2029"
	};
	var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
	function escapeChar(match) {
		return "\\" + escapes[match];
	}
	var bareIdentifier = /^\s*(\w|\$)+\s*$/;
	function template(text, settings, oldSettings) {
		if (!settings && oldSettings) settings = oldSettings;
		settings = defaults({}, settings, _$1.templateSettings);
		var matcher = RegExp([
			(settings.escape || noMatch).source,
			(settings.interpolate || noMatch).source,
			(settings.evaluate || noMatch).source
		].join("|") + "|$", "g");
		var index = 0;
		var source = "__p+='";
		text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
			source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
			index = offset + match.length;
			if (escape) source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
			else if (interpolate) source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
			else if (evaluate) source += "';\n" + evaluate + "\n__p+='";
			return match;
		});
		source += "';\n";
		var argument = settings.variable;
		if (argument) {
			if (!bareIdentifier.test(argument)) throw new Error("variable is not a bare identifier: " + argument);
		} else {
			source = "with(obj||{}){\n" + source + "}\n";
			argument = "obj";
		}
		source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
		var render;
		try {
			render = new Function(argument, "_", source);
		} catch (e) {
			e.source = source;
			throw e;
		}
		var template = function(data) {
			return render.call(this, data, _$1);
		};
		template.source = "function(" + argument + "){\n" + source + "}";
		return template;
	}
	function result(obj, path, fallback) {
		path = toPath(path);
		var length = path.length;
		if (!length) return isFunction$1(fallback) ? fallback.call(obj) : fallback;
		for (var i = 0; i < length; i++) {
			var prop = obj == null ? void 0 : obj[path[i]];
			if (prop === void 0) {
				prop = fallback;
				i = length;
			}
			obj = isFunction$1(prop) ? prop.call(obj) : prop;
		}
		return obj;
	}
	var idCounter = 0;
	function uniqueId(prefix) {
		var id = ++idCounter + "";
		return prefix ? prefix + id : id;
	}
	function chain(obj) {
		var instance = _$1(obj);
		instance._chain = true;
		return instance;
	}
	function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
		if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
		var self = baseCreate(sourceFunc.prototype);
		var result = sourceFunc.apply(self, args);
		if (isObject(result)) return result;
		return self;
	}
	var partial = restArguments(function(func, boundArgs) {
		var placeholder = partial.placeholder;
		var bound = function() {
			var position = 0, length = boundArgs.length;
			var args = Array(length);
			for (var i = 0; i < length; i++) args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
			while (position < arguments.length) args.push(arguments[position++]);
			return executeBound(func, bound, this, this, args);
		};
		return bound;
	});
	partial.placeholder = _$1;
	var bind = restArguments(function(func, context, args) {
		if (!isFunction$1(func)) throw new TypeError("Bind must be called on a function");
		var bound = restArguments(function(callArgs) {
			return executeBound(func, bound, context, this, args.concat(callArgs));
		});
		return bound;
	});
	var isArrayLike = createSizePropertyCheck(getLength);
	function flatten$1(input, depth, strict) {
		if (!depth && depth !== 0) depth = Infinity;
		var output = [], idx = 0, i = 0, length = getLength(input) || 0, stack = [];
		while (true) {
			if (i >= length) {
				if (!stack.length) break;
				var frame = stack.pop();
				i = frame.i;
				input = frame.v;
				length = getLength(input);
				continue;
			}
			var value = input[i++];
			if (stack.length >= depth) output[idx++] = value;
			else if (isArrayLike(value) && (isArray(value) || isArguments$1(value))) {
				stack.push({
					i,
					v: input
				});
				i = 0;
				input = value;
				length = getLength(input);
			} else if (!strict) output[idx++] = value;
		}
		return output;
	}
	var bindAll = restArguments(function(obj, keys) {
		keys = flatten$1(keys, false, false);
		var index = keys.length;
		if (index < 1) throw new Error("bindAll must be passed function names");
		while (index--) {
			var key = keys[index];
			obj[key] = bind(obj[key], obj);
		}
		return obj;
	});
	function memoize(func, hasher) {
		var memoize = function(key) {
			var cache = memoize.cache;
			var address = "" + (hasher ? hasher.apply(this, arguments) : key);
			if (!has$1(cache, address)) cache[address] = func.apply(this, arguments);
			return cache[address];
		};
		memoize.cache = {};
		return memoize;
	}
	var delay = restArguments(function(func, wait, args) {
		return setTimeout(function() {
			return func.apply(null, args);
		}, wait);
	});
	var defer = partial(delay, _$1, 1);
	function throttle(func, wait, options) {
		var timeout, context, args, result;
		var previous = 0;
		if (!options) options = {};
		var later = function() {
			previous = options.leading === false ? 0 : now();
			timeout = null;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		};
		var throttled = function() {
			var _now = now();
			if (!previous && options.leading === false) previous = _now;
			var remaining = wait - (_now - previous);
			context = this;
			args = arguments;
			if (remaining <= 0 || remaining > wait) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				previous = _now;
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			} else if (!timeout && options.trailing !== false) timeout = setTimeout(later, remaining);
			return result;
		};
		throttled.cancel = function() {
			clearTimeout(timeout);
			previous = 0;
			timeout = context = args = null;
		};
		return throttled;
	}
	function debounce(func, wait, immediate) {
		var timeout, previous, args, result, context;
		var later = function() {
			var passed = now() - previous;
			if (wait > passed) timeout = setTimeout(later, wait - passed);
			else {
				timeout = null;
				if (!immediate) result = func.apply(context, args);
				if (!timeout) args = context = null;
			}
		};
		var debounced = restArguments(function(_args) {
			context = this;
			args = _args;
			previous = now();
			if (!timeout) {
				timeout = setTimeout(later, wait);
				if (immediate) result = func.apply(context, args);
			}
			return result;
		});
		debounced.cancel = function() {
			clearTimeout(timeout);
			timeout = args = context = null;
		};
		return debounced;
	}
	function wrap(func, wrapper) {
		return partial(wrapper, func);
	}
	function negate(predicate) {
		return function() {
			return !predicate.apply(this, arguments);
		};
	}
	function compose() {
		var args = arguments;
		var start = args.length - 1;
		return function() {
			var i = start;
			var result = args[start].apply(this, arguments);
			while (i--) result = args[i].call(this, result);
			return result;
		};
	}
	function after(times, func) {
		return function() {
			if (--times < 1) return func.apply(this, arguments);
		};
	}
	function before(times, func) {
		var memo;
		return function() {
			if (--times > 0) memo = func.apply(this, arguments);
			if (times <= 1) func = null;
			return memo;
		};
	}
	var once = partial(before, 2);
	function findKey(obj, predicate, context) {
		predicate = cb(predicate, context);
		var _keys = keys(obj), key;
		for (var i = 0, length = _keys.length; i < length; i++) {
			key = _keys[i];
			if (predicate(obj[key], key, obj)) return key;
		}
	}
	function createPredicateIndexFinder(dir) {
		return function(array, predicate, context) {
			predicate = cb(predicate, context);
			var length = getLength(array);
			var index = dir > 0 ? 0 : length - 1;
			for (; index >= 0 && index < length; index += dir) if (predicate(array[index], index, array)) return index;
			return -1;
		};
	}
	var findIndex = createPredicateIndexFinder(1);
	var findLastIndex = createPredicateIndexFinder(-1);
	function sortedIndex(array, obj, iteratee, context) {
		iteratee = cb(iteratee, context, 1);
		var value = iteratee(obj);
		var low = 0, high = getLength(array);
		while (low < high) {
			var mid = Math.floor((low + high) / 2);
			if (iteratee(array[mid]) < value) low = mid + 1;
			else high = mid;
		}
		return low;
	}
	function createIndexFinder(dir, predicateFind, sortedIndex) {
		return function(array, item, idx) {
			var i = 0, length = getLength(array);
			if (typeof idx == "number") if (dir > 0) i = idx >= 0 ? idx : Math.max(idx + length, i);
			else length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
			else if (sortedIndex && idx && length) {
				idx = sortedIndex(array, item);
				return array[idx] === item ? idx : -1;
			}
			if (item !== item) {
				idx = predicateFind(slice.call(array, i, length), isNaN$1);
				return idx >= 0 ? idx + i : -1;
			}
			for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) if (array[idx] === item) return idx;
			return -1;
		};
	}
	var indexOf = createIndexFinder(1, findIndex, sortedIndex);
	var lastIndexOf = createIndexFinder(-1, findLastIndex);
	function find(obj, predicate, context) {
		var key = (isArrayLike(obj) ? findIndex : findKey)(obj, predicate, context);
		if (key !== void 0 && key !== -1) return obj[key];
	}
	function findWhere(obj, attrs) {
		return find(obj, matcher(attrs));
	}
	function each(obj, iteratee, context) {
		iteratee = optimizeCb(iteratee, context);
		var i, length;
		if (isArrayLike(obj)) for (i = 0, length = obj.length; i < length; i++) iteratee(obj[i], i, obj);
		else {
			var _keys = keys(obj);
			for (i = 0, length = _keys.length; i < length; i++) iteratee(obj[_keys[i]], _keys[i], obj);
		}
		return obj;
	}
	function map(obj, iteratee, context) {
		iteratee = cb(iteratee, context);
		var _keys = !isArrayLike(obj) && keys(obj), length = (_keys || obj).length, results = Array(length);
		for (var index = 0; index < length; index++) {
			var currentKey = _keys ? _keys[index] : index;
			results[index] = iteratee(obj[currentKey], currentKey, obj);
		}
		return results;
	}
	function createReduce(dir) {
		var reducer = function(obj, iteratee, memo, initial) {
			var _keys = !isArrayLike(obj) && keys(obj), length = (_keys || obj).length, index = dir > 0 ? 0 : length - 1;
			if (!initial) {
				memo = obj[_keys ? _keys[index] : index];
				index += dir;
			}
			for (; index >= 0 && index < length; index += dir) {
				var currentKey = _keys ? _keys[index] : index;
				memo = iteratee(memo, obj[currentKey], currentKey, obj);
			}
			return memo;
		};
		return function(obj, iteratee, memo, context) {
			var initial = arguments.length >= 3;
			return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
		};
	}
	var reduce = createReduce(1);
	var reduceRight = createReduce(-1);
	function filter(obj, predicate, context) {
		var results = [];
		predicate = cb(predicate, context);
		each(obj, function(value, index, list) {
			if (predicate(value, index, list)) results.push(value);
		});
		return results;
	}
	function reject(obj, predicate, context) {
		return filter(obj, negate(cb(predicate)), context);
	}
	function every(obj, predicate, context) {
		predicate = cb(predicate, context);
		var _keys = !isArrayLike(obj) && keys(obj), length = (_keys || obj).length;
		for (var index = 0; index < length; index++) {
			var currentKey = _keys ? _keys[index] : index;
			if (!predicate(obj[currentKey], currentKey, obj)) return false;
		}
		return true;
	}
	function some(obj, predicate, context) {
		predicate = cb(predicate, context);
		var _keys = !isArrayLike(obj) && keys(obj), length = (_keys || obj).length;
		for (var index = 0; index < length; index++) {
			var currentKey = _keys ? _keys[index] : index;
			if (predicate(obj[currentKey], currentKey, obj)) return true;
		}
		return false;
	}
	function contains(obj, item, fromIndex, guard) {
		if (!isArrayLike(obj)) obj = values(obj);
		if (typeof fromIndex != "number" || guard) fromIndex = 0;
		return indexOf(obj, item, fromIndex) >= 0;
	}
	var invoke = restArguments(function(obj, path, args) {
		var contextPath, func;
		if (isFunction$1(path)) func = path;
		else {
			path = toPath(path);
			contextPath = path.slice(0, -1);
			path = path[path.length - 1];
		}
		return map(obj, function(context) {
			var method = func;
			if (!method) {
				if (contextPath && contextPath.length) context = deepGet(context, contextPath);
				if (context == null) return void 0;
				method = context[path];
			}
			return method == null ? method : method.apply(context, args);
		});
	});
	function pluck(obj, key) {
		return map(obj, property(key));
	}
	function where(obj, attrs) {
		return filter(obj, matcher(attrs));
	}
	function max(obj, iteratee, context) {
		var result = -Infinity, lastComputed = -Infinity, value, computed;
		if (iteratee == null || typeof iteratee == "number" && typeof obj[0] != "object" && obj != null) {
			obj = isArrayLike(obj) ? obj : values(obj);
			for (var i = 0, length = obj.length; i < length; i++) {
				value = obj[i];
				if (value != null && value > result) result = value;
			}
		} else {
			iteratee = cb(iteratee, context);
			each(obj, function(v, index, list) {
				computed = iteratee(v, index, list);
				if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
					result = v;
					lastComputed = computed;
				}
			});
		}
		return result;
	}
	function min(obj, iteratee, context) {
		var result = Infinity, lastComputed = Infinity, value, computed;
		if (iteratee == null || typeof iteratee == "number" && typeof obj[0] != "object" && obj != null) {
			obj = isArrayLike(obj) ? obj : values(obj);
			for (var i = 0, length = obj.length; i < length; i++) {
				value = obj[i];
				if (value != null && value < result) result = value;
			}
		} else {
			iteratee = cb(iteratee, context);
			each(obj, function(v, index, list) {
				computed = iteratee(v, index, list);
				if (computed < lastComputed || computed === Infinity && result === Infinity) {
					result = v;
					lastComputed = computed;
				}
			});
		}
		return result;
	}
	var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
	function toArray(obj) {
		if (!obj) return [];
		if (isArray(obj)) return slice.call(obj);
		if (isString(obj)) return obj.match(reStrSymbol);
		if (isArrayLike(obj)) return map(obj, identity);
		return values(obj);
	}
	function sample(obj, n, guard) {
		if (n == null || guard) {
			if (!isArrayLike(obj)) obj = values(obj);
			return obj[random(obj.length - 1)];
		}
		var sample = toArray(obj);
		var length = getLength(sample);
		n = Math.max(Math.min(n, length), 0);
		var last = length - 1;
		for (var index = 0; index < n; index++) {
			var rand = random(index, last);
			var temp = sample[index];
			sample[index] = sample[rand];
			sample[rand] = temp;
		}
		return sample.slice(0, n);
	}
	function shuffle(obj) {
		return sample(obj, Infinity);
	}
	function sortBy(obj, iteratee, context) {
		var index = 0;
		iteratee = cb(iteratee, context);
		return pluck(map(obj, function(value, key, list) {
			return {
				value,
				index: index++,
				criteria: iteratee(value, key, list)
			};
		}).sort(function(left, right) {
			var a = left.criteria;
			var b = right.criteria;
			if (a !== b) {
				if (a > b || a === void 0) return 1;
				if (a < b || b === void 0) return -1;
			}
			return left.index - right.index;
		}), "value");
	}
	function group(behavior, partition) {
		return function(obj, iteratee, context) {
			var result = partition ? [[], []] : {};
			iteratee = cb(iteratee, context);
			each(obj, function(value, index) {
				behavior(result, value, iteratee(value, index, obj));
			});
			return result;
		};
	}
	var groupBy = group(function(result, value, key) {
		if (has$1(result, key)) result[key].push(value);
		else result[key] = [value];
	});
	var indexBy = group(function(result, value, key) {
		result[key] = value;
	});
	var countBy = group(function(result, value, key) {
		if (has$1(result, key)) result[key]++;
		else result[key] = 1;
	});
	var partition = group(function(result, value, pass) {
		result[pass ? 0 : 1].push(value);
	}, true);
	function size(obj) {
		if (obj == null) return 0;
		return isArrayLike(obj) ? obj.length : keys(obj).length;
	}
	function keyInObj(value, key, obj) {
		return key in obj;
	}
	var pick = restArguments(function(obj, keys) {
		var result = {}, iteratee = keys[0];
		if (obj == null) return result;
		if (isFunction$1(iteratee)) {
			if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
			keys = allKeys(obj);
		} else {
			iteratee = keyInObj;
			keys = flatten$1(keys, false, false);
			obj = Object(obj);
		}
		for (var i = 0, length = keys.length; i < length; i++) {
			var key = keys[i];
			var value = obj[key];
			if (iteratee(value, key, obj)) result[key] = value;
		}
		return result;
	});
	var omit = restArguments(function(obj, keys) {
		var iteratee = keys[0], context;
		if (isFunction$1(iteratee)) {
			iteratee = negate(iteratee);
			if (keys.length > 1) context = keys[1];
		} else {
			keys = map(flatten$1(keys, false, false), String);
			iteratee = function(value, key) {
				return !contains(keys, key);
			};
		}
		return pick(obj, iteratee, context);
	});
	function initial(array, n, guard) {
		return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	}
	function first(array, n, guard) {
		if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
		if (n == null || guard) return array[0];
		return initial(array, array.length - n);
	}
	function rest(array, n, guard) {
		return slice.call(array, n == null || guard ? 1 : n);
	}
	function last(array, n, guard) {
		if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
		if (n == null || guard) return array[array.length - 1];
		return rest(array, Math.max(0, array.length - n));
	}
	function compact(array) {
		return filter(array, Boolean);
	}
	function flatten(array, depth) {
		return flatten$1(array, depth, false);
	}
	var difference = restArguments(function(array, rest) {
		rest = flatten$1(rest, true, true);
		return filter(array, function(value) {
			return !contains(rest, value);
		});
	});
	var without = restArguments(function(array, otherArrays) {
		return difference(array, otherArrays);
	});
	function uniq(array, isSorted, iteratee, context) {
		if (!isBoolean(isSorted)) {
			context = iteratee;
			iteratee = isSorted;
			isSorted = false;
		}
		if (iteratee != null) iteratee = cb(iteratee, context);
		var result = [];
		var seen = [];
		for (var i = 0, length = getLength(array); i < length; i++) {
			var value = array[i], computed = iteratee ? iteratee(value, i, array) : value;
			if (isSorted && !iteratee) {
				if (!i || seen !== computed) result.push(value);
				seen = computed;
			} else if (iteratee) {
				if (!contains(seen, computed)) {
					seen.push(computed);
					result.push(value);
				}
			} else if (!contains(result, value)) result.push(value);
		}
		return result;
	}
	var union = restArguments(function(arrays) {
		return uniq(flatten$1(arrays, true, true));
	});
	function intersection(array) {
		var result = [];
		var argsLength = arguments.length;
		for (var i = 0, length = getLength(array); i < length; i++) {
			var item = array[i];
			if (contains(result, item)) continue;
			var j;
			for (j = 1; j < argsLength; j++) if (!contains(arguments[j], item)) break;
			if (j === argsLength) result.push(item);
		}
		return result;
	}
	function unzip(array) {
		var length = array && max(array, getLength).length || 0;
		var result = Array(length);
		for (var index = 0; index < length; index++) result[index] = pluck(array, index);
		return result;
	}
	var zip = restArguments(unzip);
	function object(list, values) {
		var result = {};
		for (var i = 0, length = getLength(list); i < length; i++) if (values) result[list[i]] = values[i];
		else result[list[i][0]] = list[i][1];
		return result;
	}
	function range(start, stop, step) {
		if (stop == null) {
			stop = start || 0;
			start = 0;
		}
		if (!step) step = stop < start ? -1 : 1;
		var length = Math.max(Math.ceil((stop - start) / step), 0);
		var range = Array(length);
		for (var idx = 0; idx < length; idx++, start += step) range[idx] = start;
		return range;
	}
	function chunk(array, count) {
		if (count == null || count < 1) return [];
		var result = [];
		var i = 0, length = array.length;
		while (i < length) result.push(slice.call(array, i, i += count));
		return result;
	}
	function chainResult(instance, obj) {
		return instance._chain ? _$1(obj).chain() : obj;
	}
	function mixin(obj) {
		each(functions(obj), function(name) {
			var func = _$1[name] = obj[name];
			_$1.prototype[name] = function() {
				var args = [this._wrapped];
				push.apply(args, arguments);
				return chainResult(this, func.apply(_$1, args));
			};
		});
		return _$1;
	}
	each([
		"pop",
		"push",
		"reverse",
		"shift",
		"sort",
		"splice",
		"unshift"
	], function(name) {
		var method = ArrayProto[name];
		_$1.prototype[name] = function() {
			var obj = this._wrapped;
			if (obj != null) {
				method.apply(obj, arguments);
				if ((name === "shift" || name === "splice") && obj.length === 0) delete obj[0];
			}
			return chainResult(this, obj);
		};
	});
	each([
		"concat",
		"join",
		"slice"
	], function(name) {
		var method = ArrayProto[name];
		_$1.prototype[name] = function() {
			var obj = this._wrapped;
			if (obj != null) obj = method.apply(obj, arguments);
			return chainResult(this, obj);
		};
	});
	var _ = mixin({
		__proto__: null,
		VERSION,
		restArguments,
		isObject,
		isNull,
		isUndefined,
		isBoolean,
		isElement,
		isString,
		isNumber,
		isDate,
		isRegExp,
		isError,
		isSymbol,
		isArrayBuffer,
		isDataView: isDataView$1,
		isArray,
		isFunction: isFunction$1,
		isArguments: isArguments$1,
		isFinite: isFinite$1,
		isNaN: isNaN$1,
		isTypedArray: isTypedArray$1,
		isEmpty,
		isMatch,
		isEqual,
		isMap,
		isWeakMap,
		isSet,
		isWeakSet,
		keys,
		allKeys,
		values,
		pairs,
		invert,
		functions,
		methods: functions,
		extend,
		extendOwn,
		assign: extendOwn,
		defaults,
		create,
		clone,
		tap,
		get,
		has,
		mapObject,
		identity,
		constant,
		noop,
		toPath: toPath$1,
		property,
		propertyOf,
		matcher,
		matches: matcher,
		times,
		random,
		now,
		escape: _escape,
		unescape: _unescape,
		templateSettings,
		template,
		result,
		uniqueId,
		chain,
		iteratee,
		partial,
		bind,
		bindAll,
		memoize,
		delay,
		defer,
		throttle,
		debounce,
		wrap,
		negate,
		compose,
		after,
		before,
		once,
		findKey,
		findIndex,
		findLastIndex,
		sortedIndex,
		indexOf,
		lastIndexOf,
		find,
		detect: find,
		findWhere,
		each,
		forEach: each,
		map,
		collect: map,
		reduce,
		foldl: reduce,
		inject: reduce,
		reduceRight,
		foldr: reduceRight,
		filter,
		select: filter,
		reject,
		every,
		all: every,
		some,
		any: some,
		contains,
		includes: contains,
		include: contains,
		invoke,
		pluck,
		where,
		max,
		min,
		shuffle,
		sample,
		sortBy,
		groupBy,
		indexBy,
		countBy,
		partition,
		toArray,
		size,
		pick,
		omit,
		first,
		head: first,
		take: first,
		initial,
		last,
		rest,
		tail: rest,
		drop: rest,
		compact,
		flatten,
		without,
		uniq,
		unique: uniq,
		union,
		intersection,
		difference,
		unzip,
		transpose: unzip,
		zip,
		object,
		range,
		chunk,
		mixin,
		"default": _$1
	});
	_._ = _;
	exports.VERSION = VERSION;
	exports._ = _;
	exports._escape = _escape;
	exports._unescape = _unescape;
	exports.after = after;
	exports.allKeys = allKeys;
	exports.before = before;
	exports.bind = bind;
	exports.bindAll = bindAll;
	exports.chain = chain;
	exports.chunk = chunk;
	exports.clone = clone;
	exports.compact = compact;
	exports.compose = compose;
	exports.constant = constant;
	exports.contains = contains;
	exports.countBy = countBy;
	exports.create = create;
	exports.debounce = debounce;
	exports.defaults = defaults;
	exports.defer = defer;
	exports.delay = delay;
	exports.difference = difference;
	exports.each = each;
	exports.every = every;
	exports.extend = extend;
	exports.extendOwn = extendOwn;
	exports.filter = filter;
	exports.find = find;
	exports.findIndex = findIndex;
	exports.findKey = findKey;
	exports.findLastIndex = findLastIndex;
	exports.findWhere = findWhere;
	exports.first = first;
	exports.flatten = flatten;
	exports.functions = functions;
	exports.get = get;
	exports.groupBy = groupBy;
	exports.has = has;
	exports.identity = identity;
	exports.indexBy = indexBy;
	exports.indexOf = indexOf;
	exports.initial = initial;
	exports.intersection = intersection;
	exports.invert = invert;
	exports.invoke = invoke;
	exports.isArguments = isArguments$1;
	exports.isArray = isArray;
	exports.isArrayBuffer = isArrayBuffer;
	exports.isBoolean = isBoolean;
	exports.isDataView = isDataView$1;
	exports.isDate = isDate;
	exports.isElement = isElement;
	exports.isEmpty = isEmpty;
	exports.isEqual = isEqual;
	exports.isError = isError;
	exports.isFinite = isFinite$1;
	exports.isFunction = isFunction$1;
	exports.isMap = isMap;
	exports.isMatch = isMatch;
	exports.isNaN = isNaN$1;
	exports.isNull = isNull;
	exports.isNumber = isNumber;
	exports.isObject = isObject;
	exports.isRegExp = isRegExp;
	exports.isSet = isSet;
	exports.isString = isString;
	exports.isSymbol = isSymbol;
	exports.isTypedArray = isTypedArray$1;
	exports.isUndefined = isUndefined;
	exports.isWeakMap = isWeakMap;
	exports.isWeakSet = isWeakSet;
	exports.iteratee = iteratee;
	exports.keys = keys;
	exports.last = last;
	exports.lastIndexOf = lastIndexOf;
	exports.map = map;
	exports.mapObject = mapObject;
	exports.matcher = matcher;
	exports.max = max;
	exports.memoize = memoize;
	exports.min = min;
	exports.mixin = mixin;
	exports.negate = negate;
	exports.noop = noop;
	exports.now = now;
	exports.object = object;
	exports.omit = omit;
	exports.once = once;
	exports.pairs = pairs;
	exports.partial = partial;
	exports.partition = partition;
	exports.pick = pick;
	exports.pluck = pluck;
	exports.property = property;
	exports.propertyOf = propertyOf;
	exports.random = random;
	exports.range = range;
	exports.reduce = reduce;
	exports.reduceRight = reduceRight;
	exports.reject = reject;
	exports.rest = rest;
	exports.restArguments = restArguments;
	exports.result = result;
	exports.sample = sample;
	exports.shuffle = shuffle;
	exports.size = size;
	exports.some = some;
	exports.sortBy = sortBy;
	exports.sortedIndex = sortedIndex;
	exports.tap = tap;
	exports.template = template;
	exports.templateSettings = templateSettings;
	exports.throttle = throttle;
	exports.times = times;
	exports.toArray = toArray;
	exports.toPath = toPath$1;
	exports.union = union;
	exports.uniq = uniq;
	exports.uniqueId = uniqueId;
	exports.unzip = unzip;
	exports.values = values;
	exports.where = where;
	exports.without = without;
	exports.wrap = wrap;
	exports.zip = zip;
}));
//#endregion
//#region node_modules/underscore/underscore-node.cjs
var require_underscore_node = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = require_underscore_node_f()._;
}));
//#endregion
//#region node_modules/bluebird/js/release/es5.js
var require_es5 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var isES5 = (function() {
		"use strict";
		return this === void 0;
	})();
	if (isES5) module.exports = {
		freeze: Object.freeze,
		defineProperty: Object.defineProperty,
		getDescriptor: Object.getOwnPropertyDescriptor,
		keys: Object.keys,
		names: Object.getOwnPropertyNames,
		getPrototypeOf: Object.getPrototypeOf,
		isArray: Array.isArray,
		isES5,
		propertyIsWritable: function(obj, prop) {
			var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
			return !!(!descriptor || descriptor.writable || descriptor.set);
		}
	};
	else {
		var has = {}.hasOwnProperty;
		var str = {}.toString;
		var proto = {}.constructor.prototype;
		var ObjectKeys = function(o) {
			var ret = [];
			for (var key in o) if (has.call(o, key)) ret.push(key);
			return ret;
		};
		var ObjectGetDescriptor = function(o, key) {
			return { value: o[key] };
		};
		var ObjectDefineProperty = function(o, key, desc) {
			o[key] = desc.value;
			return o;
		};
		var ObjectFreeze = function(obj) {
			return obj;
		};
		var ObjectGetPrototypeOf = function(obj) {
			try {
				return Object(obj).constructor.prototype;
			} catch (e) {
				return proto;
			}
		};
		var ArrayIsArray = function(obj) {
			try {
				return str.call(obj) === "[object Array]";
			} catch (e) {
				return false;
			}
		};
		module.exports = {
			isArray: ArrayIsArray,
			keys: ObjectKeys,
			names: ObjectKeys,
			defineProperty: ObjectDefineProperty,
			getDescriptor: ObjectGetDescriptor,
			freeze: ObjectFreeze,
			getPrototypeOf: ObjectGetPrototypeOf,
			isES5,
			propertyIsWritable: function() {
				return true;
			}
		};
	}
}));
//#endregion
//#region node_modules/bluebird/js/release/util.js
var require_util$1 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var es5 = require_es5();
	var canEvaluate = typeof navigator == "undefined";
	var errorObj = { e: {} };
	var tryCatchTarget;
	var globalObject = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : exports !== void 0 ? exports : null;
	function tryCatcher() {
		try {
			var target = tryCatchTarget;
			tryCatchTarget = null;
			return target.apply(this, arguments);
		} catch (e) {
			errorObj.e = e;
			return errorObj;
		}
	}
	function tryCatch(fn) {
		tryCatchTarget = fn;
		return tryCatcher;
	}
	var inherits = function(Child, Parent) {
		var hasProp = {}.hasOwnProperty;
		function T() {
			this.constructor = Child;
			this.constructor$ = Parent;
			for (var propertyName in Parent.prototype) if (hasProp.call(Parent.prototype, propertyName) && propertyName.charAt(propertyName.length - 1) !== "$") this[propertyName + "$"] = Parent.prototype[propertyName];
		}
		T.prototype = Parent.prototype;
		Child.prototype = new T();
		return Child.prototype;
	};
	function isPrimitive(val) {
		return val == null || val === true || val === false || typeof val === "string" || typeof val === "number";
	}
	function isObject(value) {
		return typeof value === "function" || typeof value === "object" && value !== null;
	}
	function maybeWrapAsError(maybeError) {
		if (!isPrimitive(maybeError)) return maybeError;
		return new Error(safeToString(maybeError));
	}
	function withAppended(target, appendee) {
		var len = target.length;
		var ret = new Array(len + 1);
		var i;
		for (i = 0; i < len; ++i) ret[i] = target[i];
		ret[i] = appendee;
		return ret;
	}
	function getDataPropertyOrDefault(obj, key, defaultValue) {
		if (es5.isES5) {
			var desc = Object.getOwnPropertyDescriptor(obj, key);
			if (desc != null) return desc.get == null && desc.set == null ? desc.value : defaultValue;
		} else return {}.hasOwnProperty.call(obj, key) ? obj[key] : void 0;
	}
	function notEnumerableProp(obj, name, value) {
		if (isPrimitive(obj)) return obj;
		var descriptor = {
			value,
			configurable: true,
			enumerable: false,
			writable: true
		};
		es5.defineProperty(obj, name, descriptor);
		return obj;
	}
	function thrower(r) {
		throw r;
	}
	var inheritedDataKeys = (function() {
		var excludedPrototypes = [
			Array.prototype,
			Object.prototype,
			Function.prototype
		];
		var isExcludedProto = function(val) {
			for (var i = 0; i < excludedPrototypes.length; ++i) if (excludedPrototypes[i] === val) return true;
			return false;
		};
		if (es5.isES5) {
			var getKeys = Object.getOwnPropertyNames;
			return function(obj) {
				var ret = [];
				var visitedKeys = Object.create(null);
				while (obj != null && !isExcludedProto(obj)) {
					var keys;
					try {
						keys = getKeys(obj);
					} catch (e) {
						return ret;
					}
					for (var i = 0; i < keys.length; ++i) {
						var key = keys[i];
						if (visitedKeys[key]) continue;
						visitedKeys[key] = true;
						var desc = Object.getOwnPropertyDescriptor(obj, key);
						if (desc != null && desc.get == null && desc.set == null) ret.push(key);
					}
					obj = es5.getPrototypeOf(obj);
				}
				return ret;
			};
		} else {
			var hasProp = {}.hasOwnProperty;
			return function(obj) {
				if (isExcludedProto(obj)) return [];
				var ret = [];
				enumeration: for (var key in obj) if (hasProp.call(obj, key)) ret.push(key);
				else {
					for (var i = 0; i < excludedPrototypes.length; ++i) if (hasProp.call(excludedPrototypes[i], key)) continue enumeration;
					ret.push(key);
				}
				return ret;
			};
		}
	})();
	var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
	function isClass(fn) {
		try {
			if (typeof fn === "function") {
				var keys = es5.names(fn.prototype);
				var hasMethods = es5.isES5 && keys.length > 1;
				var hasMethodsOtherThanConstructor = keys.length > 0 && !(keys.length === 1 && keys[0] === "constructor");
				var hasThisAssignmentAndStaticMethods = thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;
				if (hasMethods || hasMethodsOtherThanConstructor || hasThisAssignmentAndStaticMethods) return true;
			}
			return false;
		} catch (e) {
			return false;
		}
	}
	function toFastProperties(obj) {
		function FakeConstructor() {}
		FakeConstructor.prototype = obj;
		var l = 8;
		while (l--) new FakeConstructor();
		return obj;
	}
	var rident = /^[a-z$_][a-z$_0-9]*$/i;
	function isIdentifier(str) {
		return rident.test(str);
	}
	function filledRange(count, prefix, suffix) {
		var ret = new Array(count);
		for (var i = 0; i < count; ++i) ret[i] = prefix + i + suffix;
		return ret;
	}
	function safeToString(obj) {
		try {
			return obj + "";
		} catch (e) {
			return "[no string representation]";
		}
	}
	function isError(obj) {
		return obj !== null && typeof obj === "object" && typeof obj.message === "string" && typeof obj.name === "string";
	}
	function markAsOriginatingFromRejection(e) {
		try {
			notEnumerableProp(e, "isOperational", true);
		} catch (ignore) {}
	}
	function originatesFromRejection(e) {
		if (e == null) return false;
		return e instanceof Error["__BluebirdErrorTypes__"].OperationalError || e["isOperational"] === true;
	}
	function canAttachTrace(obj) {
		return isError(obj) && es5.propertyIsWritable(obj, "stack");
	}
	var ensureErrorObject = (function() {
		if (!("stack" in /* @__PURE__ */ new Error())) return function(value) {
			if (canAttachTrace(value)) return value;
			try {
				throw new Error(safeToString(value));
			} catch (err) {
				return err;
			}
		};
		else return function(value) {
			if (canAttachTrace(value)) return value;
			return new Error(safeToString(value));
		};
	})();
	function classString(obj) {
		return {}.toString.call(obj);
	}
	function copyDescriptors(from, to, filter) {
		var keys = es5.names(from);
		for (var i = 0; i < keys.length; ++i) {
			var key = keys[i];
			if (filter(key)) try {
				es5.defineProperty(to, key, es5.getDescriptor(from, key));
			} catch (ignore) {}
		}
	}
	var asArray = function(v) {
		if (es5.isArray(v)) return v;
		return null;
	};
	if (typeof Symbol !== "undefined" && Symbol.iterator) {
		var ArrayFrom = typeof Array.from === "function" ? function(v) {
			return Array.from(v);
		} : function(v) {
			var ret = [];
			var it = v[Symbol.iterator]();
			var itResult;
			while (!(itResult = it.next()).done) ret.push(itResult.value);
			return ret;
		};
		asArray = function(v) {
			if (es5.isArray(v)) return v;
			else if (v != null && typeof v[Symbol.iterator] === "function") return ArrayFrom(v);
			return null;
		};
	}
	var isNode = typeof process !== "undefined" && classString(process).toLowerCase() === "[object process]";
	var hasEnvVariables = typeof process !== "undefined" && typeof process.env !== "undefined";
	function env(key) {
		return hasEnvVariables ? process.env[key] : void 0;
	}
	function getNativePromise() {
		if (typeof Promise === "function") try {
			var promise = new Promise(function() {});
			if ({}.toString.call(promise) === "[object Promise]") return Promise;
		} catch (e) {}
	}
	function domainBind(self, cb) {
		return self.bind(cb);
	}
	var ret = {
		isClass,
		isIdentifier,
		inheritedDataKeys,
		getDataPropertyOrDefault,
		thrower,
		isArray: es5.isArray,
		asArray,
		notEnumerableProp,
		isPrimitive,
		isObject,
		isError,
		canEvaluate,
		errorObj,
		tryCatch,
		inherits,
		withAppended,
		maybeWrapAsError,
		toFastProperties,
		filledRange,
		toString: safeToString,
		canAttachTrace,
		ensureErrorObject,
		originatesFromRejection,
		markAsOriginatingFromRejection,
		classString,
		copyDescriptors,
		hasDevTools: typeof chrome !== "undefined" && chrome && typeof chrome.loadTimes === "function",
		isNode,
		hasEnvVariables,
		env,
		global: globalObject,
		getNativePromise,
		domainBind
	};
	ret.isRecentNode = ret.isNode && (function() {
		var version = process.versions.node.split(".").map(Number);
		return version[0] === 0 && version[1] > 10 || version[0] > 0;
	})();
	if (ret.isNode) ret.toFastProperties(process);
	try {
		throw new Error();
	} catch (e) {
		ret.lastLineError = e;
	}
	module.exports = ret;
}));
//#endregion
//#region node_modules/bluebird/js/release/schedule.js
var require_schedule = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var util = require_util$1();
	var schedule;
	var noAsyncScheduler = function() {
		throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
	};
	var NativePromise = util.getNativePromise();
	if (util.isNode && typeof MutationObserver === "undefined") {
		var GlobalSetImmediate = global.setImmediate;
		var ProcessNextTick = process.nextTick;
		schedule = util.isRecentNode ? function(fn) {
			GlobalSetImmediate.call(global, fn);
		} : function(fn) {
			ProcessNextTick.call(process, fn);
		};
	} else if (typeof NativePromise === "function" && typeof NativePromise.resolve === "function") {
		var nativePromise = NativePromise.resolve();
		schedule = function(fn) {
			nativePromise.then(fn);
		};
	} else if (typeof MutationObserver !== "undefined" && !(typeof window !== "undefined" && window.navigator && (window.navigator.standalone || window.cordova))) schedule = (function() {
		var div = document.createElement("div");
		var opts = { attributes: true };
		var toggleScheduled = false;
		var div2 = document.createElement("div");
		new MutationObserver(function() {
			div.classList.toggle("foo");
			toggleScheduled = false;
		}).observe(div2, opts);
		var scheduleToggle = function() {
			if (toggleScheduled) return;
			toggleScheduled = true;
			div2.classList.toggle("foo");
		};
		return function schedule(fn) {
			var o = new MutationObserver(function() {
				o.disconnect();
				fn();
			});
			o.observe(div, opts);
			scheduleToggle();
		};
	})();
	else if (typeof setImmediate !== "undefined") schedule = function(fn) {
		setImmediate(fn);
	};
	else if (typeof setTimeout !== "undefined") schedule = function(fn) {
		setTimeout(fn, 0);
	};
	else schedule = noAsyncScheduler;
	module.exports = schedule;
}));
//#endregion
//#region node_modules/bluebird/js/release/queue.js
var require_queue = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	function arrayMove(src, srcIndex, dst, dstIndex, len) {
		for (var j = 0; j < len; ++j) {
			dst[j + dstIndex] = src[j + srcIndex];
			src[j + srcIndex] = void 0;
		}
	}
	function Queue(capacity) {
		this._capacity = capacity;
		this._length = 0;
		this._front = 0;
	}
	Queue.prototype._willBeOverCapacity = function(size) {
		return this._capacity < size;
	};
	Queue.prototype._pushOne = function(arg) {
		var length = this.length();
		this._checkCapacity(length + 1);
		var i = this._front + length & this._capacity - 1;
		this[i] = arg;
		this._length = length + 1;
	};
	Queue.prototype.push = function(fn, receiver, arg) {
		var length = this.length() + 3;
		if (this._willBeOverCapacity(length)) {
			this._pushOne(fn);
			this._pushOne(receiver);
			this._pushOne(arg);
			return;
		}
		var j = this._front + length - 3;
		this._checkCapacity(length);
		var wrapMask = this._capacity - 1;
		this[j + 0 & wrapMask] = fn;
		this[j + 1 & wrapMask] = receiver;
		this[j + 2 & wrapMask] = arg;
		this._length = length;
	};
	Queue.prototype.shift = function() {
		var front = this._front, ret = this[front];
		this[front] = void 0;
		this._front = front + 1 & this._capacity - 1;
		this._length--;
		return ret;
	};
	Queue.prototype.length = function() {
		return this._length;
	};
	Queue.prototype._checkCapacity = function(size) {
		if (this._capacity < size) this._resizeTo(this._capacity << 1);
	};
	Queue.prototype._resizeTo = function(capacity) {
		var oldCapacity = this._capacity;
		this._capacity = capacity;
		var moveItemsCount = this._front + this._length & oldCapacity - 1;
		arrayMove(this, 0, this, oldCapacity, moveItemsCount);
	};
	module.exports = Queue;
}));
//#endregion
//#region node_modules/bluebird/js/release/async.js
var require_async = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var firstLineError;
	try {
		throw new Error();
	} catch (e) {
		firstLineError = e;
	}
	var schedule = require_schedule();
	var Queue = require_queue();
	var util = require_util$1();
	function Async() {
		this._customScheduler = false;
		this._isTickUsed = false;
		this._lateQueue = new Queue(16);
		this._normalQueue = new Queue(16);
		this._haveDrainedQueues = false;
		this._trampolineEnabled = true;
		var self = this;
		this.drainQueues = function() {
			self._drainQueues();
		};
		this._schedule = schedule;
	}
	Async.prototype.setScheduler = function(fn) {
		var prev = this._schedule;
		this._schedule = fn;
		this._customScheduler = true;
		return prev;
	};
	Async.prototype.hasCustomScheduler = function() {
		return this._customScheduler;
	};
	Async.prototype.enableTrampoline = function() {
		this._trampolineEnabled = true;
	};
	Async.prototype.disableTrampolineIfNecessary = function() {
		if (util.hasDevTools) this._trampolineEnabled = false;
	};
	Async.prototype.haveItemsQueued = function() {
		return this._isTickUsed || this._haveDrainedQueues;
	};
	Async.prototype.fatalError = function(e, isNode) {
		if (isNode) {
			process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) + "\n");
			process.exit(2);
		} else this.throwLater(e);
	};
	Async.prototype.throwLater = function(fn, arg) {
		if (arguments.length === 1) {
			arg = fn;
			fn = function() {
				throw arg;
			};
		}
		if (typeof setTimeout !== "undefined") setTimeout(function() {
			fn(arg);
		}, 0);
		else try {
			this._schedule(function() {
				fn(arg);
			});
		} catch (e) {
			throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
		}
	};
	function AsyncInvokeLater(fn, receiver, arg) {
		this._lateQueue.push(fn, receiver, arg);
		this._queueTick();
	}
	function AsyncInvoke(fn, receiver, arg) {
		this._normalQueue.push(fn, receiver, arg);
		this._queueTick();
	}
	function AsyncSettlePromises(promise) {
		this._normalQueue._pushOne(promise);
		this._queueTick();
	}
	if (!util.hasDevTools) {
		Async.prototype.invokeLater = AsyncInvokeLater;
		Async.prototype.invoke = AsyncInvoke;
		Async.prototype.settlePromises = AsyncSettlePromises;
	} else {
		Async.prototype.invokeLater = function(fn, receiver, arg) {
			if (this._trampolineEnabled) AsyncInvokeLater.call(this, fn, receiver, arg);
			else this._schedule(function() {
				setTimeout(function() {
					fn.call(receiver, arg);
				}, 100);
			});
		};
		Async.prototype.invoke = function(fn, receiver, arg) {
			if (this._trampolineEnabled) AsyncInvoke.call(this, fn, receiver, arg);
			else this._schedule(function() {
				fn.call(receiver, arg);
			});
		};
		Async.prototype.settlePromises = function(promise) {
			if (this._trampolineEnabled) AsyncSettlePromises.call(this, promise);
			else this._schedule(function() {
				promise._settlePromises();
			});
		};
	}
	Async.prototype._drainQueue = function(queue) {
		while (queue.length() > 0) {
			var fn = queue.shift();
			if (typeof fn !== "function") {
				fn._settlePromises();
				continue;
			}
			var receiver = queue.shift();
			var arg = queue.shift();
			fn.call(receiver, arg);
		}
	};
	Async.prototype._drainQueues = function() {
		this._drainQueue(this._normalQueue);
		this._reset();
		this._haveDrainedQueues = true;
		this._drainQueue(this._lateQueue);
	};
	Async.prototype._queueTick = function() {
		if (!this._isTickUsed) {
			this._isTickUsed = true;
			this._schedule(this.drainQueues);
		}
	};
	Async.prototype._reset = function() {
		this._isTickUsed = false;
	};
	module.exports = Async;
	module.exports.firstLineError = firstLineError;
}));
//#endregion
//#region node_modules/bluebird/js/release/errors.js
var require_errors$1 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var es5 = require_es5();
	var Objectfreeze = es5.freeze;
	var util = require_util$1();
	var inherits = util.inherits;
	var notEnumerableProp = util.notEnumerableProp;
	function subError(nameProperty, defaultMessage) {
		function SubError(message) {
			if (!(this instanceof SubError)) return new SubError(message);
			notEnumerableProp(this, "message", typeof message === "string" ? message : defaultMessage);
			notEnumerableProp(this, "name", nameProperty);
			if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
			else Error.call(this);
		}
		inherits(SubError, Error);
		return SubError;
	}
	var _TypeError, _RangeError;
	var Warning = subError("Warning", "warning");
	var CancellationError = subError("CancellationError", "cancellation error");
	var TimeoutError = subError("TimeoutError", "timeout error");
	var AggregateError = subError("AggregateError", "aggregate error");
	try {
		_TypeError = TypeError;
		_RangeError = RangeError;
	} catch (e) {
		_TypeError = subError("TypeError", "type error");
		_RangeError = subError("RangeError", "range error");
	}
	var methods = "join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" ");
	for (var i = 0; i < methods.length; ++i) if (typeof Array.prototype[methods[i]] === "function") AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
	es5.defineProperty(AggregateError.prototype, "length", {
		value: 0,
		configurable: false,
		writable: true,
		enumerable: true
	});
	AggregateError.prototype["isOperational"] = true;
	var level = 0;
	AggregateError.prototype.toString = function() {
		var indent = Array(level * 4 + 1).join(" ");
		var ret = "\n" + indent + "AggregateError of:\n";
		level++;
		indent = Array(level * 4 + 1).join(" ");
		for (var i = 0; i < this.length; ++i) {
			var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
			var lines = str.split("\n");
			for (var j = 0; j < lines.length; ++j) lines[j] = indent + lines[j];
			str = lines.join("\n");
			ret += str + "\n";
		}
		level--;
		return ret;
	};
	function OperationalError(message) {
		if (!(this instanceof OperationalError)) return new OperationalError(message);
		notEnumerableProp(this, "name", "OperationalError");
		notEnumerableProp(this, "message", message);
		this.cause = message;
		this["isOperational"] = true;
		if (message instanceof Error) {
			notEnumerableProp(this, "message", message.message);
			notEnumerableProp(this, "stack", message.stack);
		} else if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
	}
	inherits(OperationalError, Error);
	var errorTypes = Error["__BluebirdErrorTypes__"];
	if (!errorTypes) {
		errorTypes = Objectfreeze({
			CancellationError,
			TimeoutError,
			OperationalError,
			RejectionError: OperationalError,
			AggregateError
		});
		es5.defineProperty(Error, "__BluebirdErrorTypes__", {
			value: errorTypes,
			writable: false,
			enumerable: false,
			configurable: false
		});
	}
	module.exports = {
		Error,
		TypeError: _TypeError,
		RangeError: _RangeError,
		CancellationError: errorTypes.CancellationError,
		OperationalError: errorTypes.OperationalError,
		TimeoutError: errorTypes.TimeoutError,
		AggregateError: errorTypes.AggregateError,
		Warning
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/thenables.js
var require_thenables = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, INTERNAL) {
		var util = require_util$1();
		var errorObj = util.errorObj;
		var isObject = util.isObject;
		function tryConvertToPromise(obj, context) {
			if (isObject(obj)) {
				if (obj instanceof Promise) return obj;
				var then = getThen(obj);
				if (then === errorObj) {
					if (context) context._pushContext();
					var ret = Promise.reject(then.e);
					if (context) context._popContext();
					return ret;
				} else if (typeof then === "function") {
					if (isAnyBluebirdPromise(obj)) {
						var ret = new Promise(INTERNAL);
						obj._then(ret._fulfill, ret._reject, void 0, ret, null);
						return ret;
					}
					return doThenable(obj, then, context);
				}
			}
			return obj;
		}
		function doGetThen(obj) {
			return obj.then;
		}
		function getThen(obj) {
			try {
				return doGetThen(obj);
			} catch (e) {
				errorObj.e = e;
				return errorObj;
			}
		}
		var hasProp = {}.hasOwnProperty;
		function isAnyBluebirdPromise(obj) {
			try {
				return hasProp.call(obj, "_promise0");
			} catch (e) {
				return false;
			}
		}
		function doThenable(x, then, context) {
			var promise = new Promise(INTERNAL);
			var ret = promise;
			if (context) context._pushContext();
			promise._captureStackTrace();
			if (context) context._popContext();
			var synchronous = true;
			var result = util.tryCatch(then).call(x, resolve, reject);
			synchronous = false;
			if (promise && result === errorObj) {
				promise._rejectCallback(result.e, true, true);
				promise = null;
			}
			function resolve(value) {
				if (!promise) return;
				promise._resolveCallback(value);
				promise = null;
			}
			function reject(reason) {
				if (!promise) return;
				promise._rejectCallback(reason, synchronous, true);
				promise = null;
			}
			return ret;
		}
		return tryConvertToPromise;
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/promise_array.js
var require_promise_array = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable) {
		var util = require_util$1();
		util.isArray;
		function toResolutionValue(val) {
			switch (val) {
				case -2: return [];
				case -3: return {};
			}
		}
		function PromiseArray(values) {
			var promise = this._promise = new Promise(INTERNAL);
			if (values instanceof Promise) promise._propagateFrom(values, 3);
			promise._setOnCancel(this);
			this._values = values;
			this._length = 0;
			this._totalResolved = 0;
			this._init(void 0, -2);
		}
		util.inherits(PromiseArray, Proxyable);
		PromiseArray.prototype.length = function() {
			return this._length;
		};
		PromiseArray.prototype.promise = function() {
			return this._promise;
		};
		PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
			var values = tryConvertToPromise(this._values, this._promise);
			if (values instanceof Promise) {
				values = values._target();
				var bitField = values._bitField;
				this._values = values;
				if ((bitField & 50397184) === 0) {
					this._promise._setAsyncGuaranteed();
					return values._then(init, this._reject, void 0, this, resolveValueIfEmpty);
				} else if ((bitField & 33554432) !== 0) values = values._value();
				else if ((bitField & 16777216) !== 0) return this._reject(values._reason());
				else return this._cancel();
			}
			values = util.asArray(values);
			if (values === null) {
				var err = apiRejection("expecting an array or an iterable object but got " + util.classString(values)).reason();
				this._promise._rejectCallback(err, false);
				return;
			}
			if (values.length === 0) {
				if (resolveValueIfEmpty === -5) this._resolveEmptyArray();
				else this._resolve(toResolutionValue(resolveValueIfEmpty));
				return;
			}
			this._iterate(values);
		};
		PromiseArray.prototype._iterate = function(values) {
			var len = this.getActualLength(values.length);
			this._length = len;
			this._values = this.shouldCopyValues() ? new Array(len) : this._values;
			var result = this._promise;
			var isResolved = false;
			var bitField = null;
			for (var i = 0; i < len; ++i) {
				var maybePromise = tryConvertToPromise(values[i], result);
				if (maybePromise instanceof Promise) {
					maybePromise = maybePromise._target();
					bitField = maybePromise._bitField;
				} else bitField = null;
				if (isResolved) {
					if (bitField !== null) maybePromise.suppressUnhandledRejections();
				} else if (bitField !== null) if ((bitField & 50397184) === 0) {
					maybePromise._proxy(this, i);
					this._values[i] = maybePromise;
				} else if ((bitField & 33554432) !== 0) isResolved = this._promiseFulfilled(maybePromise._value(), i);
				else if ((bitField & 16777216) !== 0) isResolved = this._promiseRejected(maybePromise._reason(), i);
				else isResolved = this._promiseCancelled(i);
				else isResolved = this._promiseFulfilled(maybePromise, i);
			}
			if (!isResolved) result._setAsyncGuaranteed();
		};
		PromiseArray.prototype._isResolved = function() {
			return this._values === null;
		};
		PromiseArray.prototype._resolve = function(value) {
			this._values = null;
			this._promise._fulfill(value);
		};
		PromiseArray.prototype._cancel = function() {
			if (this._isResolved() || !this._promise._isCancellable()) return;
			this._values = null;
			this._promise._cancel();
		};
		PromiseArray.prototype._reject = function(reason) {
			this._values = null;
			this._promise._rejectCallback(reason, false);
		};
		PromiseArray.prototype._promiseFulfilled = function(value, index) {
			this._values[index] = value;
			if (++this._totalResolved >= this._length) {
				this._resolve(this._values);
				return true;
			}
			return false;
		};
		PromiseArray.prototype._promiseCancelled = function() {
			this._cancel();
			return true;
		};
		PromiseArray.prototype._promiseRejected = function(reason) {
			this._totalResolved++;
			this._reject(reason);
			return true;
		};
		PromiseArray.prototype._resultCancelled = function() {
			if (this._isResolved()) return;
			var values = this._values;
			this._cancel();
			if (values instanceof Promise) values.cancel();
			else for (var i = 0; i < values.length; ++i) if (values[i] instanceof Promise) values[i].cancel();
		};
		PromiseArray.prototype.shouldCopyValues = function() {
			return true;
		};
		PromiseArray.prototype.getActualLength = function(len) {
			return len;
		};
		return PromiseArray;
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/context.js
var require_context = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise) {
		var longStackTraces = false;
		var contextStack = [];
		Promise.prototype._promiseCreated = function() {};
		Promise.prototype._pushContext = function() {};
		Promise.prototype._popContext = function() {
			return null;
		};
		Promise._peekContext = Promise.prototype._peekContext = function() {};
		function Context() {
			this._trace = new Context.CapturedTrace(peekContext());
		}
		Context.prototype._pushContext = function() {
			if (this._trace !== void 0) {
				this._trace._promiseCreated = null;
				contextStack.push(this._trace);
			}
		};
		Context.prototype._popContext = function() {
			if (this._trace !== void 0) {
				var trace = contextStack.pop();
				var ret = trace._promiseCreated;
				trace._promiseCreated = null;
				return ret;
			}
			return null;
		};
		function createContext() {
			if (longStackTraces) return new Context();
		}
		function peekContext() {
			var lastIndex = contextStack.length - 1;
			if (lastIndex >= 0) return contextStack[lastIndex];
		}
		Context.CapturedTrace = null;
		Context.create = createContext;
		Context.deactivateLongStackTraces = function() {};
		Context.activateLongStackTraces = function() {
			var Promise_pushContext = Promise.prototype._pushContext;
			var Promise_popContext = Promise.prototype._popContext;
			var Promise_PeekContext = Promise._peekContext;
			var Promise_peekContext = Promise.prototype._peekContext;
			var Promise_promiseCreated = Promise.prototype._promiseCreated;
			Context.deactivateLongStackTraces = function() {
				Promise.prototype._pushContext = Promise_pushContext;
				Promise.prototype._popContext = Promise_popContext;
				Promise._peekContext = Promise_PeekContext;
				Promise.prototype._peekContext = Promise_peekContext;
				Promise.prototype._promiseCreated = Promise_promiseCreated;
				longStackTraces = false;
			};
			longStackTraces = true;
			Promise.prototype._pushContext = Context.prototype._pushContext;
			Promise.prototype._popContext = Context.prototype._popContext;
			Promise._peekContext = Promise.prototype._peekContext = peekContext;
			Promise.prototype._promiseCreated = function() {
				var ctx = this._peekContext();
				if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
			};
		};
		return Context;
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/debuggability.js
var require_debuggability = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, Context) {
		var getDomain = Promise._getDomain;
		var async = Promise._async;
		var Warning = require_errors$1().Warning;
		var util = require_util$1();
		var canAttachTrace = util.canAttachTrace;
		var unhandledRejectionHandled;
		var possiblyUnhandledRejection;
		var bluebirdFramePattern = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
		var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
		var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
		var stackFramePattern = null;
		var formatStack = null;
		var indentStackFrames = false;
		var printWarning;
		var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 && (util.env("BLUEBIRD_DEBUG") || util.env("NODE_ENV") === "development"));
		var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 && (debugging || util.env("BLUEBIRD_WARNINGS")));
		var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 && (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));
		var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 && (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));
		Promise.prototype.suppressUnhandledRejections = function() {
			var target = this._target();
			target._bitField = target._bitField & -1048577 | 524288;
		};
		Promise.prototype._ensurePossibleRejectionHandled = function() {
			if ((this._bitField & 524288) !== 0) return;
			this._setRejectionIsUnhandled();
			async.invokeLater(this._notifyUnhandledRejection, this, void 0);
		};
		Promise.prototype._notifyUnhandledRejectionIsHandled = function() {
			fireRejectionEvent("rejectionHandled", unhandledRejectionHandled, void 0, this);
		};
		Promise.prototype._setReturnedNonUndefined = function() {
			this._bitField = this._bitField | 268435456;
		};
		Promise.prototype._returnedNonUndefined = function() {
			return (this._bitField & 268435456) !== 0;
		};
		Promise.prototype._notifyUnhandledRejection = function() {
			if (this._isRejectionUnhandled()) {
				var reason = this._settledValue();
				this._setUnhandledRejectionIsNotified();
				fireRejectionEvent("unhandledRejection", possiblyUnhandledRejection, reason, this);
			}
		};
		Promise.prototype._setUnhandledRejectionIsNotified = function() {
			this._bitField = this._bitField | 262144;
		};
		Promise.prototype._unsetUnhandledRejectionIsNotified = function() {
			this._bitField = this._bitField & -262145;
		};
		Promise.prototype._isUnhandledRejectionNotified = function() {
			return (this._bitField & 262144) > 0;
		};
		Promise.prototype._setRejectionIsUnhandled = function() {
			this._bitField = this._bitField | 1048576;
		};
		Promise.prototype._unsetRejectionIsUnhandled = function() {
			this._bitField = this._bitField & -1048577;
			if (this._isUnhandledRejectionNotified()) {
				this._unsetUnhandledRejectionIsNotified();
				this._notifyUnhandledRejectionIsHandled();
			}
		};
		Promise.prototype._isRejectionUnhandled = function() {
			return (this._bitField & 1048576) > 0;
		};
		Promise.prototype._warn = function(message, shouldUseOwnTrace, promise) {
			return warn(message, shouldUseOwnTrace, promise || this);
		};
		Promise.onPossiblyUnhandledRejection = function(fn) {
			var domain = getDomain();
			possiblyUnhandledRejection = typeof fn === "function" ? domain === null ? fn : util.domainBind(domain, fn) : void 0;
		};
		Promise.onUnhandledRejectionHandled = function(fn) {
			var domain = getDomain();
			unhandledRejectionHandled = typeof fn === "function" ? domain === null ? fn : util.domainBind(domain, fn) : void 0;
		};
		var disableLongStackTraces = function() {};
		Promise.longStackTraces = function() {
			if (async.haveItemsQueued() && !config.longStackTraces) throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
			if (!config.longStackTraces && longStackTracesIsSupported()) {
				var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
				var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
				config.longStackTraces = true;
				disableLongStackTraces = function() {
					if (async.haveItemsQueued() && !config.longStackTraces) throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
					Promise.prototype._captureStackTrace = Promise_captureStackTrace;
					Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
					Context.deactivateLongStackTraces();
					async.enableTrampoline();
					config.longStackTraces = false;
				};
				Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
				Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
				Context.activateLongStackTraces();
				async.disableTrampolineIfNecessary();
			}
		};
		Promise.hasLongStackTraces = function() {
			return config.longStackTraces && longStackTracesIsSupported();
		};
		var fireDomEvent = (function() {
			try {
				if (typeof CustomEvent === "function") {
					var event = new CustomEvent("CustomEvent");
					util.global.dispatchEvent(event);
					return function(name, event) {
						var domEvent = new CustomEvent(name.toLowerCase(), {
							detail: event,
							cancelable: true
						});
						return !util.global.dispatchEvent(domEvent);
					};
				} else if (typeof Event === "function") {
					var event = new Event("CustomEvent");
					util.global.dispatchEvent(event);
					return function(name, event) {
						var domEvent = new Event(name.toLowerCase(), { cancelable: true });
						domEvent.detail = event;
						return !util.global.dispatchEvent(domEvent);
					};
				} else {
					var event = document.createEvent("CustomEvent");
					event.initCustomEvent("testingtheevent", false, true, {});
					util.global.dispatchEvent(event);
					return function(name, event) {
						var domEvent = document.createEvent("CustomEvent");
						domEvent.initCustomEvent(name.toLowerCase(), false, true, event);
						return !util.global.dispatchEvent(domEvent);
					};
				}
			} catch (e) {}
			return function() {
				return false;
			};
		})();
		var fireGlobalEvent = (function() {
			if (util.isNode) return function() {
				return process.emit.apply(process, arguments);
			};
			else {
				if (!util.global) return function() {
					return false;
				};
				return function(name) {
					var methodName = "on" + name.toLowerCase();
					var method = util.global[methodName];
					if (!method) return false;
					method.apply(util.global, [].slice.call(arguments, 1));
					return true;
				};
			}
		})();
		function generatePromiseLifecycleEventObject(name, promise) {
			return { promise };
		}
		var eventToObjectGenerator = {
			promiseCreated: generatePromiseLifecycleEventObject,
			promiseFulfilled: generatePromiseLifecycleEventObject,
			promiseRejected: generatePromiseLifecycleEventObject,
			promiseResolved: generatePromiseLifecycleEventObject,
			promiseCancelled: generatePromiseLifecycleEventObject,
			promiseChained: function(name, promise, child) {
				return {
					promise,
					child
				};
			},
			warning: function(name, warning) {
				return { warning };
			},
			unhandledRejection: function(name, reason, promise) {
				return {
					reason,
					promise
				};
			},
			rejectionHandled: generatePromiseLifecycleEventObject
		};
		var activeFireEvent = function(name) {
			var globalEventFired = false;
			try {
				globalEventFired = fireGlobalEvent.apply(null, arguments);
			} catch (e) {
				async.throwLater(e);
				globalEventFired = true;
			}
			var domEventFired = false;
			try {
				domEventFired = fireDomEvent(name, eventToObjectGenerator[name].apply(null, arguments));
			} catch (e) {
				async.throwLater(e);
				domEventFired = true;
			}
			return domEventFired || globalEventFired;
		};
		Promise.config = function(opts) {
			opts = Object(opts);
			if ("longStackTraces" in opts) {
				if (opts.longStackTraces) Promise.longStackTraces();
				else if (!opts.longStackTraces && Promise.hasLongStackTraces()) disableLongStackTraces();
			}
			if ("warnings" in opts) {
				var warningsOption = opts.warnings;
				config.warnings = !!warningsOption;
				wForgottenReturn = config.warnings;
				if (util.isObject(warningsOption)) {
					if ("wForgottenReturn" in warningsOption) wForgottenReturn = !!warningsOption.wForgottenReturn;
				}
			}
			if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
				if (async.haveItemsQueued()) throw new Error("cannot enable cancellation after promises are in use");
				Promise.prototype._clearCancellationData = cancellationClearCancellationData;
				Promise.prototype._propagateFrom = cancellationPropagateFrom;
				Promise.prototype._onCancel = cancellationOnCancel;
				Promise.prototype._setOnCancel = cancellationSetOnCancel;
				Promise.prototype._attachCancellationCallback = cancellationAttachCancellationCallback;
				Promise.prototype._execute = cancellationExecute;
				propagateFromFunction = cancellationPropagateFrom;
				config.cancellation = true;
			}
			if ("monitoring" in opts) {
				if (opts.monitoring && !config.monitoring) {
					config.monitoring = true;
					Promise.prototype._fireEvent = activeFireEvent;
				} else if (!opts.monitoring && config.monitoring) {
					config.monitoring = false;
					Promise.prototype._fireEvent = defaultFireEvent;
				}
			}
			return Promise;
		};
		function defaultFireEvent() {
			return false;
		}
		Promise.prototype._fireEvent = defaultFireEvent;
		Promise.prototype._execute = function(executor, resolve, reject) {
			try {
				executor(resolve, reject);
			} catch (e) {
				return e;
			}
		};
		Promise.prototype._onCancel = function() {};
		Promise.prototype._setOnCancel = function(handler) {};
		Promise.prototype._attachCancellationCallback = function(onCancel) {};
		Promise.prototype._captureStackTrace = function() {};
		Promise.prototype._attachExtraTrace = function() {};
		Promise.prototype._clearCancellationData = function() {};
		Promise.prototype._propagateFrom = function(parent, flags) {};
		function cancellationExecute(executor, resolve, reject) {
			var promise = this;
			try {
				executor(resolve, reject, function(onCancel) {
					if (typeof onCancel !== "function") throw new TypeError("onCancel must be a function, got: " + util.toString(onCancel));
					promise._attachCancellationCallback(onCancel);
				});
			} catch (e) {
				return e;
			}
		}
		function cancellationAttachCancellationCallback(onCancel) {
			if (!this._isCancellable()) return this;
			var previousOnCancel = this._onCancel();
			if (previousOnCancel !== void 0) if (util.isArray(previousOnCancel)) previousOnCancel.push(onCancel);
			else this._setOnCancel([previousOnCancel, onCancel]);
			else this._setOnCancel(onCancel);
		}
		function cancellationOnCancel() {
			return this._onCancelField;
		}
		function cancellationSetOnCancel(onCancel) {
			this._onCancelField = onCancel;
		}
		function cancellationClearCancellationData() {
			this._cancellationParent = void 0;
			this._onCancelField = void 0;
		}
		function cancellationPropagateFrom(parent, flags) {
			if ((flags & 1) !== 0) {
				this._cancellationParent = parent;
				var branchesRemainingToCancel = parent._branchesRemainingToCancel;
				if (branchesRemainingToCancel === void 0) branchesRemainingToCancel = 0;
				parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
			}
			if ((flags & 2) !== 0 && parent._isBound()) this._setBoundTo(parent._boundTo);
		}
		function bindingPropagateFrom(parent, flags) {
			if ((flags & 2) !== 0 && parent._isBound()) this._setBoundTo(parent._boundTo);
		}
		var propagateFromFunction = bindingPropagateFrom;
		function boundValueFunction() {
			var ret = this._boundTo;
			if (ret !== void 0) {
				if (ret instanceof Promise) if (ret.isFulfilled()) return ret.value();
				else return;
			}
			return ret;
		}
		function longStackTracesCaptureStackTrace() {
			this._trace = new CapturedTrace(this._peekContext());
		}
		function longStackTracesAttachExtraTrace(error, ignoreSelf) {
			if (canAttachTrace(error)) {
				var trace = this._trace;
				if (trace !== void 0) {
					if (ignoreSelf) trace = trace._parent;
				}
				if (trace !== void 0) trace.attachExtraTrace(error);
				else if (!error.__stackCleaned__) {
					var parsed = parseStackAndMessage(error);
					util.notEnumerableProp(error, "stack", parsed.message + "\n" + parsed.stack.join("\n"));
					util.notEnumerableProp(error, "__stackCleaned__", true);
				}
			}
		}
		function checkForgottenReturns(returnValue, promiseCreated, name, promise, parent) {
			if (returnValue === void 0 && promiseCreated !== null && wForgottenReturn) {
				if (parent !== void 0 && parent._returnedNonUndefined()) return;
				if ((promise._bitField & 65535) === 0) return;
				if (name) name = name + " ";
				var handlerLine = "";
				var creatorLine = "";
				if (promiseCreated._trace) {
					var traceLines = promiseCreated._trace.stack.split("\n");
					var stack = cleanStack(traceLines);
					for (var i = stack.length - 1; i >= 0; --i) {
						var line = stack[i];
						if (!nodeFramePattern.test(line)) {
							var lineMatches = line.match(parseLinePattern);
							if (lineMatches) handlerLine = "at " + lineMatches[1] + ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
							break;
						}
					}
					if (stack.length > 0) {
						var firstUserLine = stack[0];
						for (var i = 0; i < traceLines.length; ++i) if (traceLines[i] === firstUserLine) {
							if (i > 0) creatorLine = "\n" + traceLines[i - 1];
							break;
						}
					}
				}
				var msg = "a promise was created in a " + name + "handler " + handlerLine + "but was not returned from it, see http://goo.gl/rRqMUw" + creatorLine;
				promise._warn(msg, true, promiseCreated);
			}
		}
		function deprecated(name, replacement) {
			var message = name + " is deprecated and will be removed in a future version.";
			if (replacement) message += " Use " + replacement + " instead.";
			return warn(message);
		}
		function warn(message, shouldUseOwnTrace, promise) {
			if (!config.warnings) return;
			var warning = new Warning(message);
			var ctx;
			if (shouldUseOwnTrace) promise._attachExtraTrace(warning);
			else if (config.longStackTraces && (ctx = Promise._peekContext())) ctx.attachExtraTrace(warning);
			else {
				var parsed = parseStackAndMessage(warning);
				warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
			}
			if (!activeFireEvent("warning", warning)) formatAndLogError(warning, "", true);
		}
		function reconstructStack(message, stacks) {
			for (var i = 0; i < stacks.length - 1; ++i) {
				stacks[i].push("From previous event:");
				stacks[i] = stacks[i].join("\n");
			}
			if (i < stacks.length) stacks[i] = stacks[i].join("\n");
			return message + "\n" + stacks.join("\n");
		}
		function removeDuplicateOrEmptyJumps(stacks) {
			for (var i = 0; i < stacks.length; ++i) if (stacks[i].length === 0 || i + 1 < stacks.length && stacks[i][0] === stacks[i + 1][0]) {
				stacks.splice(i, 1);
				i--;
			}
		}
		function removeCommonRoots(stacks) {
			var current = stacks[0];
			for (var i = 1; i < stacks.length; ++i) {
				var prev = stacks[i];
				var currentLastIndex = current.length - 1;
				var currentLastLine = current[currentLastIndex];
				var commonRootMeetPoint = -1;
				for (var j = prev.length - 1; j >= 0; --j) if (prev[j] === currentLastLine) {
					commonRootMeetPoint = j;
					break;
				}
				for (var j = commonRootMeetPoint; j >= 0; --j) {
					var line = prev[j];
					if (current[currentLastIndex] === line) {
						current.pop();
						currentLastIndex--;
					} else break;
				}
				current = prev;
			}
		}
		function cleanStack(stack) {
			var ret = [];
			for (var i = 0; i < stack.length; ++i) {
				var line = stack[i];
				var isTraceLine = "    (No stack trace)" === line || stackFramePattern.test(line);
				var isInternalFrame = isTraceLine && shouldIgnore(line);
				if (isTraceLine && !isInternalFrame) {
					if (indentStackFrames && line.charAt(0) !== " ") line = "    " + line;
					ret.push(line);
				}
			}
			return ret;
		}
		function stackFramesAsArray(error) {
			var stack = error.stack.replace(/\s+$/g, "").split("\n");
			for (var i = 0; i < stack.length; ++i) {
				var line = stack[i];
				if ("    (No stack trace)" === line || stackFramePattern.test(line)) break;
			}
			if (i > 0 && error.name != "SyntaxError") stack = stack.slice(i);
			return stack;
		}
		function parseStackAndMessage(error) {
			var stack = error.stack;
			var message = error.toString();
			stack = typeof stack === "string" && stack.length > 0 ? stackFramesAsArray(error) : ["    (No stack trace)"];
			return {
				message,
				stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
			};
		}
		function formatAndLogError(error, title, isSoft) {
			if (typeof console !== "undefined") {
				var message;
				if (util.isObject(error)) {
					var stack = error.stack;
					message = title + formatStack(stack, error);
				} else message = title + String(error);
				if (typeof printWarning === "function") printWarning(message, isSoft);
				else if (typeof console.log === "function" || typeof console.log === "object") console.log(message);
			}
		}
		function fireRejectionEvent(name, localHandler, reason, promise) {
			var localEventFired = false;
			try {
				if (typeof localHandler === "function") {
					localEventFired = true;
					if (name === "rejectionHandled") localHandler(promise);
					else localHandler(reason, promise);
				}
			} catch (e) {
				async.throwLater(e);
			}
			if (name === "unhandledRejection") {
				if (!activeFireEvent(name, reason, promise) && !localEventFired) formatAndLogError(reason, "Unhandled rejection ");
			} else activeFireEvent(name, promise);
		}
		function formatNonError(obj) {
			var str;
			if (typeof obj === "function") str = "[function " + (obj.name || "anonymous") + "]";
			else {
				str = obj && typeof obj.toString === "function" ? obj.toString() : util.toString(obj);
				if (/\[object [a-zA-Z0-9$_]+\]/.test(str)) try {
					str = JSON.stringify(obj);
				} catch (e) {}
				if (str.length === 0) str = "(empty array)";
			}
			return "(<" + snip(str) + ">, no stack trace)";
		}
		function snip(str) {
			var maxChars = 41;
			if (str.length < maxChars) return str;
			return str.substr(0, maxChars - 3) + "...";
		}
		function longStackTracesIsSupported() {
			return typeof captureStackTrace === "function";
		}
		var shouldIgnore = function() {
			return false;
		};
		var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
		function parseLineInfo(line) {
			var matches = line.match(parseLineInfoRegex);
			if (matches) return {
				fileName: matches[1],
				line: parseInt(matches[2], 10)
			};
		}
		function setBounds(firstLineError, lastLineError) {
			if (!longStackTracesIsSupported()) return;
			var firstStackLines = firstLineError.stack.split("\n");
			var lastStackLines = lastLineError.stack.split("\n");
			var firstIndex = -1;
			var lastIndex = -1;
			var firstFileName;
			var lastFileName;
			for (var i = 0; i < firstStackLines.length; ++i) {
				var result = parseLineInfo(firstStackLines[i]);
				if (result) {
					firstFileName = result.fileName;
					firstIndex = result.line;
					break;
				}
			}
			for (var i = 0; i < lastStackLines.length; ++i) {
				var result = parseLineInfo(lastStackLines[i]);
				if (result) {
					lastFileName = result.fileName;
					lastIndex = result.line;
					break;
				}
			}
			if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName || firstFileName !== lastFileName || firstIndex >= lastIndex) return;
			shouldIgnore = function(line) {
				if (bluebirdFramePattern.test(line)) return true;
				var info = parseLineInfo(line);
				if (info) {
					if (info.fileName === firstFileName && firstIndex <= info.line && info.line <= lastIndex) return true;
				}
				return false;
			};
		}
		function CapturedTrace(parent) {
			this._parent = parent;
			this._promisesCreated = 0;
			var length = this._length = 1 + (parent === void 0 ? 0 : parent._length);
			captureStackTrace(this, CapturedTrace);
			if (length > 32) this.uncycle();
		}
		util.inherits(CapturedTrace, Error);
		Context.CapturedTrace = CapturedTrace;
		CapturedTrace.prototype.uncycle = function() {
			var length = this._length;
			if (length < 2) return;
			var nodes = [];
			var stackToIndex = {};
			for (var i = 0, node = this; node !== void 0; ++i) {
				nodes.push(node);
				node = node._parent;
			}
			length = this._length = i;
			for (var i = length - 1; i >= 0; --i) {
				var stack = nodes[i].stack;
				if (stackToIndex[stack] === void 0) stackToIndex[stack] = i;
			}
			for (var i = 0; i < length; ++i) {
				var index = stackToIndex[nodes[i].stack];
				if (index !== void 0 && index !== i) {
					if (index > 0) {
						nodes[index - 1]._parent = void 0;
						nodes[index - 1]._length = 1;
					}
					nodes[i]._parent = void 0;
					nodes[i]._length = 1;
					var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;
					if (index < length - 1) {
						cycleEdgeNode._parent = nodes[index + 1];
						cycleEdgeNode._parent.uncycle();
						cycleEdgeNode._length = cycleEdgeNode._parent._length + 1;
					} else {
						cycleEdgeNode._parent = void 0;
						cycleEdgeNode._length = 1;
					}
					var currentChildLength = cycleEdgeNode._length + 1;
					for (var j = i - 2; j >= 0; --j) {
						nodes[j]._length = currentChildLength;
						currentChildLength++;
					}
					return;
				}
			}
		};
		CapturedTrace.prototype.attachExtraTrace = function(error) {
			if (error.__stackCleaned__) return;
			this.uncycle();
			var parsed = parseStackAndMessage(error);
			var message = parsed.message;
			var stacks = [parsed.stack];
			var trace = this;
			while (trace !== void 0) {
				stacks.push(cleanStack(trace.stack.split("\n")));
				trace = trace._parent;
			}
			removeCommonRoots(stacks);
			removeDuplicateOrEmptyJumps(stacks);
			util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
			util.notEnumerableProp(error, "__stackCleaned__", true);
		};
		var captureStackTrace = (function stackDetection() {
			var v8stackFramePattern = /^\s*at\s*/;
			var v8stackFormatter = function(stack, error) {
				if (typeof stack === "string") return stack;
				if (error.name !== void 0 && error.message !== void 0) return error.toString();
				return formatNonError(error);
			};
			if (typeof Error.stackTraceLimit === "number" && typeof Error.captureStackTrace === "function") {
				Error.stackTraceLimit += 6;
				stackFramePattern = v8stackFramePattern;
				formatStack = v8stackFormatter;
				var captureStackTrace = Error.captureStackTrace;
				shouldIgnore = function(line) {
					return bluebirdFramePattern.test(line);
				};
				return function(receiver, ignoreUntil) {
					Error.stackTraceLimit += 6;
					captureStackTrace(receiver, ignoreUntil);
					Error.stackTraceLimit -= 6;
				};
			}
			var err = /* @__PURE__ */ new Error();
			if (typeof err.stack === "string" && err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
				stackFramePattern = /@/;
				formatStack = v8stackFormatter;
				indentStackFrames = true;
				return function captureStackTrace(o) {
					o.stack = (/* @__PURE__ */ new Error()).stack;
				};
			}
			var hasStackAfterThrow;
			try {
				throw new Error();
			} catch (e) {
				hasStackAfterThrow = "stack" in e;
			}
			if (!("stack" in err) && hasStackAfterThrow && typeof Error.stackTraceLimit === "number") {
				stackFramePattern = v8stackFramePattern;
				formatStack = v8stackFormatter;
				return function captureStackTrace(o) {
					Error.stackTraceLimit += 6;
					try {
						throw new Error();
					} catch (e) {
						o.stack = e.stack;
					}
					Error.stackTraceLimit -= 6;
				};
			}
			formatStack = function(stack, error) {
				if (typeof stack === "string") return stack;
				if ((typeof error === "object" || typeof error === "function") && error.name !== void 0 && error.message !== void 0) return error.toString();
				return formatNonError(error);
			};
			return null;
		})([]);
		if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
			printWarning = function(message) {
				console.warn(message);
			};
			if (util.isNode && process.stderr.isTTY) printWarning = function(message, isSoft) {
				console.warn((isSoft ? "\x1B[33m" : "\x1B[31m") + message + "\x1B[0m\n");
			};
			else if (!util.isNode && typeof (/* @__PURE__ */ new Error()).stack === "string") printWarning = function(message, isSoft) {
				console.warn("%c" + message, isSoft ? "color: darkorange" : "color: red");
			};
		}
		var config = {
			warnings,
			longStackTraces: false,
			cancellation: false,
			monitoring: false
		};
		if (longStackTraces) Promise.longStackTraces();
		return {
			longStackTraces: function() {
				return config.longStackTraces;
			},
			warnings: function() {
				return config.warnings;
			},
			cancellation: function() {
				return config.cancellation;
			},
			monitoring: function() {
				return config.monitoring;
			},
			propagateFromFunction: function() {
				return propagateFromFunction;
			},
			boundValueFunction: function() {
				return boundValueFunction;
			},
			checkForgottenReturns,
			setBounds,
			warn,
			deprecated,
			CapturedTrace,
			fireDomEvent,
			fireGlobalEvent
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/finally.js
var require_finally = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, tryConvertToPromise) {
		var util = require_util$1();
		var CancellationError = Promise.CancellationError;
		var errorObj = util.errorObj;
		function PassThroughHandlerContext(promise, type, handler) {
			this.promise = promise;
			this.type = type;
			this.handler = handler;
			this.called = false;
			this.cancelPromise = null;
		}
		PassThroughHandlerContext.prototype.isFinallyHandler = function() {
			return this.type === 0;
		};
		function FinallyHandlerCancelReaction(finallyHandler) {
			this.finallyHandler = finallyHandler;
		}
		FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
			checkCancel(this.finallyHandler);
		};
		function checkCancel(ctx, reason) {
			if (ctx.cancelPromise != null) {
				if (arguments.length > 1) ctx.cancelPromise._reject(reason);
				else ctx.cancelPromise._cancel();
				ctx.cancelPromise = null;
				return true;
			}
			return false;
		}
		function succeed() {
			return finallyHandler.call(this, this.promise._target()._settledValue());
		}
		function fail(reason) {
			if (checkCancel(this, reason)) return;
			errorObj.e = reason;
			return errorObj;
		}
		function finallyHandler(reasonOrValue) {
			var promise = this.promise;
			var handler = this.handler;
			if (!this.called) {
				this.called = true;
				var ret = this.isFinallyHandler() ? handler.call(promise._boundValue()) : handler.call(promise._boundValue(), reasonOrValue);
				if (ret !== void 0) {
					promise._setReturnedNonUndefined();
					var maybePromise = tryConvertToPromise(ret, promise);
					if (maybePromise instanceof Promise) {
						if (this.cancelPromise != null) {
							if (maybePromise._isCancelled()) {
								var reason = new CancellationError("late cancellation observer");
								promise._attachExtraTrace(reason);
								errorObj.e = reason;
								return errorObj;
							} else if (maybePromise.isPending()) maybePromise._attachCancellationCallback(new FinallyHandlerCancelReaction(this));
						}
						return maybePromise._then(succeed, fail, void 0, this, void 0);
					}
				}
			}
			if (promise.isRejected()) {
				checkCancel(this);
				errorObj.e = reasonOrValue;
				return errorObj;
			} else {
				checkCancel(this);
				return reasonOrValue;
			}
		}
		Promise.prototype._passThrough = function(handler, type, success, fail) {
			if (typeof handler !== "function") return this.then();
			return this._then(success, fail, void 0, new PassThroughHandlerContext(this, type, handler), void 0);
		};
		Promise.prototype.lastly = Promise.prototype["finally"] = function(handler) {
			return this._passThrough(handler, 0, finallyHandler, finallyHandler);
		};
		Promise.prototype.tap = function(handler) {
			return this._passThrough(handler, 1, finallyHandler);
		};
		return PassThroughHandlerContext;
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/catch_filter.js
var require_catch_filter = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(NEXT_FILTER) {
		var util = require_util$1();
		var getKeys = require_es5().keys;
		var tryCatch = util.tryCatch;
		var errorObj = util.errorObj;
		function catchFilter(instances, cb, promise) {
			return function(e) {
				var boundTo = promise._boundValue();
				predicateLoop: for (var i = 0; i < instances.length; ++i) {
					var item = instances[i];
					if (item === Error || item != null && item.prototype instanceof Error) {
						if (e instanceof item) return tryCatch(cb).call(boundTo, e);
					} else if (typeof item === "function") {
						var matchesPredicate = tryCatch(item).call(boundTo, e);
						if (matchesPredicate === errorObj) return matchesPredicate;
						else if (matchesPredicate) return tryCatch(cb).call(boundTo, e);
					} else if (util.isObject(e)) {
						var keys = getKeys(item);
						for (var j = 0; j < keys.length; ++j) {
							var key = keys[j];
							if (item[key] != e[key]) continue predicateLoop;
						}
						return tryCatch(cb).call(boundTo, e);
					}
				}
				return NEXT_FILTER;
			};
		}
		return catchFilter;
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/nodeback.js
var require_nodeback = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var util = require_util$1();
	var maybeWrapAsError = util.maybeWrapAsError;
	var OperationalError = require_errors$1().OperationalError;
	var es5 = require_es5();
	function isUntypedError(obj) {
		return obj instanceof Error && es5.getPrototypeOf(obj) === Error.prototype;
	}
	var rErrorKey = /^(?:name|message|stack|cause)$/;
	function wrapAsOperationalError(obj) {
		var ret;
		if (isUntypedError(obj)) {
			ret = new OperationalError(obj);
			ret.name = obj.name;
			ret.message = obj.message;
			ret.stack = obj.stack;
			var keys = es5.keys(obj);
			for (var i = 0; i < keys.length; ++i) {
				var key = keys[i];
				if (!rErrorKey.test(key)) ret[key] = obj[key];
			}
			return ret;
		}
		util.markAsOriginatingFromRejection(obj);
		return obj;
	}
	function nodebackForPromise(promise, multiArgs) {
		return function(err, value) {
			if (promise === null) return;
			if (err) {
				var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
				promise._attachExtraTrace(wrapped);
				promise._reject(wrapped);
			} else if (!multiArgs) promise._fulfill(value);
			else {
				var $_len = arguments.length;
				var args = new Array(Math.max($_len - 1, 0));
				for (var $_i = 1; $_i < $_len; ++$_i) args[$_i - 1] = arguments[$_i];
				promise._fulfill(args);
			}
			promise = null;
		};
	}
	module.exports = nodebackForPromise;
}));
//#endregion
//#region node_modules/bluebird/js/release/method.js
var require_method = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
		var util = require_util$1();
		var tryCatch = util.tryCatch;
		Promise.method = function(fn) {
			if (typeof fn !== "function") throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
			return function() {
				var ret = new Promise(INTERNAL);
				ret._captureStackTrace();
				ret._pushContext();
				var value = tryCatch(fn).apply(this, arguments);
				var promiseCreated = ret._popContext();
				debug.checkForgottenReturns(value, promiseCreated, "Promise.method", ret);
				ret._resolveFromSyncValue(value);
				return ret;
			};
		};
		Promise.attempt = Promise["try"] = function(fn) {
			if (typeof fn !== "function") return apiRejection("expecting a function but got " + util.classString(fn));
			var ret = new Promise(INTERNAL);
			ret._captureStackTrace();
			ret._pushContext();
			var value;
			if (arguments.length > 1) {
				debug.deprecated("calling Promise.try with more than 1 argument");
				var arg = arguments[1];
				var ctx = arguments[2];
				value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg) : tryCatch(fn).call(ctx, arg);
			} else value = tryCatch(fn)();
			var promiseCreated = ret._popContext();
			debug.checkForgottenReturns(value, promiseCreated, "Promise.try", ret);
			ret._resolveFromSyncValue(value);
			return ret;
		};
		Promise.prototype._resolveFromSyncValue = function(value) {
			if (value === util.errorObj) this._rejectCallback(value.e, false);
			else this._resolveCallback(value, true);
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/bind.js
var require_bind = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, INTERNAL, tryConvertToPromise, debug) {
		var calledBind = false;
		var rejectThis = function(_, e) {
			this._reject(e);
		};
		var targetRejected = function(e, context) {
			context.promiseRejectionQueued = true;
			context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
		};
		var bindingResolved = function(thisArg, context) {
			if ((this._bitField & 50397184) === 0) this._resolveCallback(context.target);
		};
		var bindingRejected = function(e, context) {
			if (!context.promiseRejectionQueued) this._reject(e);
		};
		Promise.prototype.bind = function(thisArg) {
			if (!calledBind) {
				calledBind = true;
				Promise.prototype._propagateFrom = debug.propagateFromFunction();
				Promise.prototype._boundValue = debug.boundValueFunction();
			}
			var maybePromise = tryConvertToPromise(thisArg);
			var ret = new Promise(INTERNAL);
			ret._propagateFrom(this, 1);
			var target = this._target();
			ret._setBoundTo(maybePromise);
			if (maybePromise instanceof Promise) {
				var context = {
					promiseRejectionQueued: false,
					promise: ret,
					target,
					bindingPromise: maybePromise
				};
				target._then(INTERNAL, targetRejected, void 0, ret, context);
				maybePromise._then(bindingResolved, bindingRejected, void 0, ret, context);
				ret._setOnCancel(maybePromise);
			} else ret._resolveCallback(target);
			return ret;
		};
		Promise.prototype._setBoundTo = function(obj) {
			if (obj !== void 0) {
				this._bitField = this._bitField | 2097152;
				this._boundTo = obj;
			} else this._bitField = this._bitField & -2097153;
		};
		Promise.prototype._isBound = function() {
			return (this._bitField & 2097152) === 2097152;
		};
		Promise.bind = function(thisArg, value) {
			return Promise.resolve(value).bind(thisArg);
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/cancel.js
var require_cancel = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, PromiseArray, apiRejection, debug) {
		var util = require_util$1();
		var tryCatch = util.tryCatch;
		var errorObj = util.errorObj;
		var async = Promise._async;
		Promise.prototype["break"] = Promise.prototype.cancel = function() {
			if (!debug.cancellation()) return this._warn("cancellation is disabled");
			var promise = this;
			var child = promise;
			while (promise._isCancellable()) {
				if (!promise._cancelBy(child)) {
					if (child._isFollowing()) child._followee().cancel();
					else child._cancelBranched();
					break;
				}
				var parent = promise._cancellationParent;
				if (parent == null || !parent._isCancellable()) {
					if (promise._isFollowing()) promise._followee().cancel();
					else promise._cancelBranched();
					break;
				} else {
					if (promise._isFollowing()) promise._followee().cancel();
					promise._setWillBeCancelled();
					child = promise;
					promise = parent;
				}
			}
		};
		Promise.prototype._branchHasCancelled = function() {
			this._branchesRemainingToCancel--;
		};
		Promise.prototype._enoughBranchesHaveCancelled = function() {
			return this._branchesRemainingToCancel === void 0 || this._branchesRemainingToCancel <= 0;
		};
		Promise.prototype._cancelBy = function(canceller) {
			if (canceller === this) {
				this._branchesRemainingToCancel = 0;
				this._invokeOnCancel();
				return true;
			} else {
				this._branchHasCancelled();
				if (this._enoughBranchesHaveCancelled()) {
					this._invokeOnCancel();
					return true;
				}
			}
			return false;
		};
		Promise.prototype._cancelBranched = function() {
			if (this._enoughBranchesHaveCancelled()) this._cancel();
		};
		Promise.prototype._cancel = function() {
			if (!this._isCancellable()) return;
			this._setCancelled();
			async.invoke(this._cancelPromises, this, void 0);
		};
		Promise.prototype._cancelPromises = function() {
			if (this._length() > 0) this._settlePromises();
		};
		Promise.prototype._unsetOnCancel = function() {
			this._onCancelField = void 0;
		};
		Promise.prototype._isCancellable = function() {
			return this.isPending() && !this._isCancelled();
		};
		Promise.prototype.isCancellable = function() {
			return this.isPending() && !this.isCancelled();
		};
		Promise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
			if (util.isArray(onCancelCallback)) for (var i = 0; i < onCancelCallback.length; ++i) this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
			else if (onCancelCallback !== void 0) if (typeof onCancelCallback === "function") {
				if (!internalOnly) {
					var e = tryCatch(onCancelCallback).call(this._boundValue());
					if (e === errorObj) {
						this._attachExtraTrace(e.e);
						async.throwLater(e.e);
					}
				}
			} else onCancelCallback._resultCancelled(this);
		};
		Promise.prototype._invokeOnCancel = function() {
			var onCancelCallback = this._onCancel();
			this._unsetOnCancel();
			async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
		};
		Promise.prototype._invokeInternalOnCancel = function() {
			if (this._isCancellable()) {
				this._doInvokeOnCancel(this._onCancel(), true);
				this._unsetOnCancel();
			}
		};
		Promise.prototype._resultCancelled = function() {
			this.cancel();
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/direct_resolve.js
var require_direct_resolve = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise) {
		function returner() {
			return this.value;
		}
		function thrower() {
			throw this.reason;
		}
		Promise.prototype["return"] = Promise.prototype.thenReturn = function(value) {
			if (value instanceof Promise) value.suppressUnhandledRejections();
			return this._then(returner, void 0, void 0, { value }, void 0);
		};
		Promise.prototype["throw"] = Promise.prototype.thenThrow = function(reason) {
			return this._then(thrower, void 0, void 0, { reason }, void 0);
		};
		Promise.prototype.catchThrow = function(reason) {
			if (arguments.length <= 1) return this._then(void 0, thrower, void 0, { reason }, void 0);
			else {
				var _reason = arguments[1];
				var handler = function() {
					throw _reason;
				};
				return this.caught(reason, handler);
			}
		};
		Promise.prototype.catchReturn = function(value) {
			if (arguments.length <= 1) {
				if (value instanceof Promise) value.suppressUnhandledRejections();
				return this._then(void 0, returner, void 0, { value }, void 0);
			} else {
				var _value = arguments[1];
				if (_value instanceof Promise) _value.suppressUnhandledRejections();
				var handler = function() {
					return _value;
				};
				return this.caught(value, handler);
			}
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/synchronous_inspection.js
var require_synchronous_inspection = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise) {
		function PromiseInspection(promise) {
			if (promise !== void 0) {
				promise = promise._target();
				this._bitField = promise._bitField;
				this._settledValueField = promise._isFateSealed() ? promise._settledValue() : void 0;
			} else {
				this._bitField = 0;
				this._settledValueField = void 0;
			}
		}
		PromiseInspection.prototype._settledValue = function() {
			return this._settledValueField;
		};
		var value = PromiseInspection.prototype.value = function() {
			if (!this.isFulfilled()) throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");
			return this._settledValue();
		};
		var reason = PromiseInspection.prototype.error = PromiseInspection.prototype.reason = function() {
			if (!this.isRejected()) throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");
			return this._settledValue();
		};
		var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
			return (this._bitField & 33554432) !== 0;
		};
		var isRejected = PromiseInspection.prototype.isRejected = function() {
			return (this._bitField & 16777216) !== 0;
		};
		var isPending = PromiseInspection.prototype.isPending = function() {
			return (this._bitField & 50397184) === 0;
		};
		var isResolved = PromiseInspection.prototype.isResolved = function() {
			return (this._bitField & 50331648) !== 0;
		};
		PromiseInspection.prototype.isCancelled = function() {
			return (this._bitField & 8454144) !== 0;
		};
		Promise.prototype.__isCancelled = function() {
			return (this._bitField & 65536) === 65536;
		};
		Promise.prototype._isCancelled = function() {
			return this._target().__isCancelled();
		};
		Promise.prototype.isCancelled = function() {
			return (this._target()._bitField & 8454144) !== 0;
		};
		Promise.prototype.isPending = function() {
			return isPending.call(this._target());
		};
		Promise.prototype.isRejected = function() {
			return isRejected.call(this._target());
		};
		Promise.prototype.isFulfilled = function() {
			return isFulfilled.call(this._target());
		};
		Promise.prototype.isResolved = function() {
			return isResolved.call(this._target());
		};
		Promise.prototype.value = function() {
			return value.call(this._target());
		};
		Promise.prototype.reason = function() {
			var target = this._target();
			target._unsetRejectionIsUnhandled();
			return reason.call(target);
		};
		Promise.prototype._value = function() {
			return this._settledValue();
		};
		Promise.prototype._reason = function() {
			this._unsetRejectionIsUnhandled();
			return this._settledValue();
		};
		Promise.PromiseInspection = PromiseInspection;
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/join.js
var require_join = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain) {
		var util = require_util$1();
		var canEvaluate = util.canEvaluate;
		var tryCatch = util.tryCatch;
		var errorObj = util.errorObj;
		var reject;
		if (canEvaluate) {
			var thenCallback = function(i) {
				return new Function("value", "holder", "                             \n            'use strict';                                                    \n            holder.pIndex = value;                                           \n            holder.checkFulfillment(this);                                   \n            ".replace(/Index/g, i));
			};
			var promiseSetter = function(i) {
				return new Function("promise", "holder", "                           \n            'use strict';                                                    \n            holder.pIndex = promise;                                         \n            ".replace(/Index/g, i));
			};
			var generateHolderClass = function(total) {
				var props = new Array(total);
				for (var i = 0; i < props.length; ++i) props[i] = "this.p" + (i + 1);
				var assignment = props.join(" = ") + " = null;";
				var cancellationCode = "var promise;\n" + props.map(function(prop) {
					return "                                                         \n                promise = " + prop + ";                                      \n                if (promise instanceof Promise) {                            \n                    promise.cancel();                                        \n                }                                                            \n            ";
				}).join("\n");
				var passedArguments = props.join(", ");
				var name = "Holder$" + total;
				var code = "return function(tryCatch, errorObj, Promise, async) {    \n            'use strict';                                                    \n            function [TheName](fn) {                                         \n                [TheProperties]                                              \n                this.fn = fn;                                                \n                this.asyncNeeded = true;                                     \n                this.now = 0;                                                \n            }                                                                \n                                                                             \n            [TheName].prototype._callFunction = function(promise) {          \n                promise._pushContext();                                      \n                var ret = tryCatch(this.fn)([ThePassedArguments]);           \n                promise._popContext();                                       \n                if (ret === errorObj) {                                      \n                    promise._rejectCallback(ret.e, false);                   \n                } else {                                                     \n                    promise._resolveCallback(ret);                           \n                }                                                            \n            };                                                               \n                                                                             \n            [TheName].prototype.checkFulfillment = function(promise) {       \n                var now = ++this.now;                                        \n                if (now === [TheTotal]) {                                    \n                    if (this.asyncNeeded) {                                  \n                        async.invoke(this._callFunction, this, promise);     \n                    } else {                                                 \n                        this._callFunction(promise);                         \n                    }                                                        \n                                                                             \n                }                                                            \n            };                                                               \n                                                                             \n            [TheName].prototype._resultCancelled = function() {              \n                [CancellationCode]                                           \n            };                                                               \n                                                                             \n            return [TheName];                                                \n        }(tryCatch, errorObj, Promise, async);                               \n        ";
				code = code.replace(/\[TheName\]/g, name).replace(/\[TheTotal\]/g, total).replace(/\[ThePassedArguments\]/g, passedArguments).replace(/\[TheProperties\]/g, assignment).replace(/\[CancellationCode\]/g, cancellationCode);
				return new Function("tryCatch", "errorObj", "Promise", "async", code)(tryCatch, errorObj, Promise, async);
			};
			var holderClasses = [];
			var thenCallbacks = [];
			var promiseSetters = [];
			for (var i = 0; i < 8; ++i) {
				holderClasses.push(generateHolderClass(i + 1));
				thenCallbacks.push(thenCallback(i + 1));
				promiseSetters.push(promiseSetter(i + 1));
			}
			reject = function(reason) {
				this._reject(reason);
			};
		}
		Promise.join = function() {
			var last = arguments.length - 1;
			var fn;
			if (last > 0 && typeof arguments[last] === "function") {
				fn = arguments[last];
				if (last <= 8 && canEvaluate) {
					var ret = new Promise(INTERNAL);
					ret._captureStackTrace();
					var HolderClass = holderClasses[last - 1];
					var holder = new HolderClass(fn);
					var callbacks = thenCallbacks;
					for (var i = 0; i < last; ++i) {
						var maybePromise = tryConvertToPromise(arguments[i], ret);
						if (maybePromise instanceof Promise) {
							maybePromise = maybePromise._target();
							var bitField = maybePromise._bitField;
							if ((bitField & 50397184) === 0) {
								maybePromise._then(callbacks[i], reject, void 0, ret, holder);
								promiseSetters[i](maybePromise, holder);
								holder.asyncNeeded = false;
							} else if ((bitField & 33554432) !== 0) callbacks[i].call(ret, maybePromise._value(), holder);
							else if ((bitField & 16777216) !== 0) ret._reject(maybePromise._reason());
							else ret._cancel();
						} else callbacks[i].call(ret, maybePromise, holder);
					}
					if (!ret._isFateSealed()) {
						if (holder.asyncNeeded) {
							var domain = getDomain();
							if (domain !== null) holder.fn = util.domainBind(domain, holder.fn);
						}
						ret._setAsyncGuaranteed();
						ret._setOnCancel(holder);
					}
					return ret;
				}
			}
			var $_len = arguments.length;
			var args = new Array($_len);
			for (var $_i = 0; $_i < $_len; ++$_i) args[$_i] = arguments[$_i];
			if (fn) args.pop();
			var ret = new PromiseArray(args).promise();
			return fn !== void 0 ? ret.spread(fn) : ret;
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/map.js
var require_map = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
		var getDomain = Promise._getDomain;
		var util = require_util$1();
		var tryCatch = util.tryCatch;
		var errorObj = util.errorObj;
		var async = Promise._async;
		function MappingPromiseArray(promises, fn, limit, _filter) {
			this.constructor$(promises);
			this._promise._captureStackTrace();
			var domain = getDomain();
			this._callback = domain === null ? fn : util.domainBind(domain, fn);
			this._preservedValues = _filter === INTERNAL ? new Array(this.length()) : null;
			this._limit = limit;
			this._inFlight = 0;
			this._queue = [];
			async.invoke(this._asyncInit, this, void 0);
		}
		util.inherits(MappingPromiseArray, PromiseArray);
		MappingPromiseArray.prototype._asyncInit = function() {
			this._init$(void 0, -2);
		};
		MappingPromiseArray.prototype._init = function() {};
		MappingPromiseArray.prototype._promiseFulfilled = function(value, index) {
			var values = this._values;
			var length = this.length();
			var preservedValues = this._preservedValues;
			var limit = this._limit;
			if (index < 0) {
				index = index * -1 - 1;
				values[index] = value;
				if (limit >= 1) {
					this._inFlight--;
					this._drainQueue();
					if (this._isResolved()) return true;
				}
			} else {
				if (limit >= 1 && this._inFlight >= limit) {
					values[index] = value;
					this._queue.push(index);
					return false;
				}
				if (preservedValues !== null) preservedValues[index] = value;
				var promise = this._promise;
				var callback = this._callback;
				var receiver = promise._boundValue();
				promise._pushContext();
				var ret = tryCatch(callback).call(receiver, value, index, length);
				var promiseCreated = promise._popContext();
				debug.checkForgottenReturns(ret, promiseCreated, preservedValues !== null ? "Promise.filter" : "Promise.map", promise);
				if (ret === errorObj) {
					this._reject(ret.e);
					return true;
				}
				var maybePromise = tryConvertToPromise(ret, this._promise);
				if (maybePromise instanceof Promise) {
					maybePromise = maybePromise._target();
					var bitField = maybePromise._bitField;
					if ((bitField & 50397184) === 0) {
						if (limit >= 1) this._inFlight++;
						values[index] = maybePromise;
						maybePromise._proxy(this, (index + 1) * -1);
						return false;
					} else if ((bitField & 33554432) !== 0) ret = maybePromise._value();
					else if ((bitField & 16777216) !== 0) {
						this._reject(maybePromise._reason());
						return true;
					} else {
						this._cancel();
						return true;
					}
				}
				values[index] = ret;
			}
			if (++this._totalResolved >= length) {
				if (preservedValues !== null) this._filter(values, preservedValues);
				else this._resolve(values);
				return true;
			}
			return false;
		};
		MappingPromiseArray.prototype._drainQueue = function() {
			var queue = this._queue;
			var limit = this._limit;
			var values = this._values;
			while (queue.length > 0 && this._inFlight < limit) {
				if (this._isResolved()) return;
				var index = queue.pop();
				this._promiseFulfilled(values[index], index);
			}
		};
		MappingPromiseArray.prototype._filter = function(booleans, values) {
			var len = values.length;
			var ret = new Array(len);
			var j = 0;
			for (var i = 0; i < len; ++i) if (booleans[i]) ret[j++] = values[i];
			ret.length = j;
			this._resolve(ret);
		};
		MappingPromiseArray.prototype.preservedValues = function() {
			return this._preservedValues;
		};
		function map(promises, fn, options, _filter) {
			if (typeof fn !== "function") return apiRejection("expecting a function but got " + util.classString(fn));
			var limit = 0;
			if (options !== void 0) if (typeof options === "object" && options !== null) {
				if (typeof options.concurrency !== "number") return Promise.reject(/* @__PURE__ */ new TypeError("'concurrency' must be a number but it is " + util.classString(options.concurrency)));
				limit = options.concurrency;
			} else return Promise.reject(/* @__PURE__ */ new TypeError("options argument must be an object but it is " + util.classString(options)));
			limit = typeof limit === "number" && isFinite(limit) && limit >= 1 ? limit : 0;
			return new MappingPromiseArray(promises, fn, limit, _filter).promise();
		}
		Promise.prototype.map = function(fn, options) {
			return map(this, fn, options, null);
		};
		Promise.map = function(promises, fn, options, _filter) {
			return map(promises, fn, options, _filter);
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/call_get.js
var require_call_get = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var cr = Object.create;
	if (cr) {
		var callerCache = cr(null);
		var getterCache = cr(null);
		callerCache[" size"] = getterCache[" size"] = 0;
	}
	module.exports = function(Promise) {
		var util = require_util$1();
		var canEvaluate = util.canEvaluate;
		var isIdentifier = util.isIdentifier;
		var getMethodCaller;
		var getGetter;
		var makeMethodCaller = function(methodName) {
			return new Function("ensureMethod", "                                    \n        return function(obj) {                                               \n            'use strict'                                                     \n            var len = this.length;                                           \n            ensureMethod(obj, 'methodName');                                 \n            switch(len) {                                                    \n                case 1: return obj.methodName(this[0]);                      \n                case 2: return obj.methodName(this[0], this[1]);             \n                case 3: return obj.methodName(this[0], this[1], this[2]);    \n                case 0: return obj.methodName();                             \n                default:                                                     \n                    return obj.methodName.apply(obj, this);                  \n            }                                                                \n        };                                                                   \n        ".replace(/methodName/g, methodName))(ensureMethod);
		};
		var makeGetter = function(propertyName) {
			return new Function("obj", "                                             \n        'use strict';                                                        \n        return obj.propertyName;                                             \n        ".replace("propertyName", propertyName));
		};
		var getCompiled = function(name, compiler, cache) {
			var ret = cache[name];
			if (typeof ret !== "function") {
				if (!isIdentifier(name)) return null;
				ret = compiler(name);
				cache[name] = ret;
				cache[" size"]++;
				if (cache[" size"] > 512) {
					var keys = Object.keys(cache);
					for (var i = 0; i < 256; ++i) delete cache[keys[i]];
					cache[" size"] = keys.length - 256;
				}
			}
			return ret;
		};
		getMethodCaller = function(name) {
			return getCompiled(name, makeMethodCaller, callerCache);
		};
		getGetter = function(name) {
			return getCompiled(name, makeGetter, getterCache);
		};
		function ensureMethod(obj, methodName) {
			var fn;
			if (obj != null) fn = obj[methodName];
			if (typeof fn !== "function") {
				var message = "Object " + util.classString(obj) + " has no method '" + util.toString(methodName) + "'";
				throw new Promise.TypeError(message);
			}
			return fn;
		}
		function caller(obj) {
			return ensureMethod(obj, this.pop()).apply(obj, this);
		}
		Promise.prototype.call = function(methodName) {
			var $_len = arguments.length;
			var args = new Array(Math.max($_len - 1, 0));
			for (var $_i = 1; $_i < $_len; ++$_i) args[$_i - 1] = arguments[$_i];
			if (canEvaluate) {
				var maybeCaller = getMethodCaller(methodName);
				if (maybeCaller !== null) return this._then(maybeCaller, void 0, void 0, args, void 0);
			}
			args.push(methodName);
			return this._then(caller, void 0, void 0, args, void 0);
		};
		function namedGetter(obj) {
			return obj[this];
		}
		function indexedGetter(obj) {
			var index = +this;
			if (index < 0) index = Math.max(0, index + obj.length);
			return obj[index];
		}
		Promise.prototype.get = function(propertyName) {
			var isIndex = typeof propertyName === "number";
			var getter;
			if (!isIndex) if (canEvaluate) {
				var maybeGetter = getGetter(propertyName);
				getter = maybeGetter !== null ? maybeGetter : namedGetter;
			} else getter = namedGetter;
			else getter = indexedGetter;
			return this._then(getter, void 0, void 0, propertyName, void 0);
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/using.js
var require_using = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug) {
		var util = require_util$1();
		var TypeError = require_errors$1().TypeError;
		var inherits = require_util$1().inherits;
		var errorObj = util.errorObj;
		var tryCatch = util.tryCatch;
		var NULL = {};
		function thrower(e) {
			setTimeout(function() {
				throw e;
			}, 0);
		}
		function castPreservingDisposable(thenable) {
			var maybePromise = tryConvertToPromise(thenable);
			if (maybePromise !== thenable && typeof thenable._isDisposable === "function" && typeof thenable._getDisposer === "function" && thenable._isDisposable()) maybePromise._setDisposable(thenable._getDisposer());
			return maybePromise;
		}
		function dispose(resources, inspection) {
			var i = 0;
			var len = resources.length;
			var ret = new Promise(INTERNAL);
			function iterator() {
				if (i >= len) return ret._fulfill();
				var maybePromise = castPreservingDisposable(resources[i++]);
				if (maybePromise instanceof Promise && maybePromise._isDisposable()) {
					try {
						maybePromise = tryConvertToPromise(maybePromise._getDisposer().tryDispose(inspection), resources.promise);
					} catch (e) {
						return thrower(e);
					}
					if (maybePromise instanceof Promise) return maybePromise._then(iterator, thrower, null, null, null);
				}
				iterator();
			}
			iterator();
			return ret;
		}
		function Disposer(data, promise, context) {
			this._data = data;
			this._promise = promise;
			this._context = context;
		}
		Disposer.prototype.data = function() {
			return this._data;
		};
		Disposer.prototype.promise = function() {
			return this._promise;
		};
		Disposer.prototype.resource = function() {
			if (this.promise().isFulfilled()) return this.promise().value();
			return NULL;
		};
		Disposer.prototype.tryDispose = function(inspection) {
			var resource = this.resource();
			var context = this._context;
			if (context !== void 0) context._pushContext();
			var ret = resource !== NULL ? this.doDispose(resource, inspection) : null;
			if (context !== void 0) context._popContext();
			this._promise._unsetDisposable();
			this._data = null;
			return ret;
		};
		Disposer.isDisposer = function(d) {
			return d != null && typeof d.resource === "function" && typeof d.tryDispose === "function";
		};
		function FunctionDisposer(fn, promise, context) {
			this.constructor$(fn, promise, context);
		}
		inherits(FunctionDisposer, Disposer);
		FunctionDisposer.prototype.doDispose = function(resource, inspection) {
			return this.data().call(resource, resource, inspection);
		};
		function maybeUnwrapDisposer(value) {
			if (Disposer.isDisposer(value)) {
				this.resources[this.index]._setDisposable(value);
				return value.promise();
			}
			return value;
		}
		function ResourceList(length) {
			this.length = length;
			this.promise = null;
			this[length - 1] = null;
		}
		ResourceList.prototype._resultCancelled = function() {
			var len = this.length;
			for (var i = 0; i < len; ++i) {
				var item = this[i];
				if (item instanceof Promise) item.cancel();
			}
		};
		Promise.using = function() {
			var len = arguments.length;
			if (len < 2) return apiRejection("you must pass at least 2 arguments to Promise.using");
			var fn = arguments[len - 1];
			if (typeof fn !== "function") return apiRejection("expecting a function but got " + util.classString(fn));
			var input;
			var spreadArgs = true;
			if (len === 2 && Array.isArray(arguments[0])) {
				input = arguments[0];
				len = input.length;
				spreadArgs = false;
			} else {
				input = arguments;
				len--;
			}
			var resources = new ResourceList(len);
			for (var i = 0; i < len; ++i) {
				var resource = input[i];
				if (Disposer.isDisposer(resource)) {
					var disposer = resource;
					resource = resource.promise();
					resource._setDisposable(disposer);
				} else {
					var maybePromise = tryConvertToPromise(resource);
					if (maybePromise instanceof Promise) resource = maybePromise._then(maybeUnwrapDisposer, null, null, {
						resources,
						index: i
					}, void 0);
				}
				resources[i] = resource;
			}
			var reflectedResources = new Array(resources.length);
			for (var i = 0; i < reflectedResources.length; ++i) reflectedResources[i] = Promise.resolve(resources[i]).reflect();
			var resultPromise = Promise.all(reflectedResources).then(function(inspections) {
				for (var i = 0; i < inspections.length; ++i) {
					var inspection = inspections[i];
					if (inspection.isRejected()) {
						errorObj.e = inspection.error();
						return errorObj;
					} else if (!inspection.isFulfilled()) {
						resultPromise.cancel();
						return;
					}
					inspections[i] = inspection.value();
				}
				promise._pushContext();
				fn = tryCatch(fn);
				var ret = spreadArgs ? fn.apply(void 0, inspections) : fn(inspections);
				var promiseCreated = promise._popContext();
				debug.checkForgottenReturns(ret, promiseCreated, "Promise.using", promise);
				return ret;
			});
			var promise = resultPromise.lastly(function() {
				return dispose(resources, new Promise.PromiseInspection(resultPromise));
			});
			resources.promise = promise;
			promise._setOnCancel(resources);
			return promise;
		};
		Promise.prototype._setDisposable = function(disposer) {
			this._bitField = this._bitField | 131072;
			this._disposer = disposer;
		};
		Promise.prototype._isDisposable = function() {
			return (this._bitField & 131072) > 0;
		};
		Promise.prototype._getDisposer = function() {
			return this._disposer;
		};
		Promise.prototype._unsetDisposable = function() {
			this._bitField = this._bitField & -131073;
			this._disposer = void 0;
		};
		Promise.prototype.disposer = function(fn) {
			if (typeof fn === "function") return new FunctionDisposer(fn, this, createContext());
			throw new TypeError();
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/timers.js
var require_timers = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, INTERNAL, debug) {
		var util = require_util$1();
		var TimeoutError = Promise.TimeoutError;
		function HandleWrapper(handle) {
			this.handle = handle;
		}
		HandleWrapper.prototype._resultCancelled = function() {
			clearTimeout(this.handle);
		};
		var afterValue = function(value) {
			return delay(+this).thenReturn(value);
		};
		var delay = Promise.delay = function(ms, value) {
			var ret;
			var handle;
			if (value !== void 0) {
				ret = Promise.resolve(value)._then(afterValue, null, null, ms, void 0);
				if (debug.cancellation() && value instanceof Promise) ret._setOnCancel(value);
			} else {
				ret = new Promise(INTERNAL);
				handle = setTimeout(function() {
					ret._fulfill();
				}, +ms);
				if (debug.cancellation()) ret._setOnCancel(new HandleWrapper(handle));
				ret._captureStackTrace();
			}
			ret._setAsyncGuaranteed();
			return ret;
		};
		Promise.prototype.delay = function(ms) {
			return delay(ms, this);
		};
		var afterTimeout = function(promise, message, parent) {
			var err;
			if (typeof message !== "string") if (message instanceof Error) err = message;
			else err = new TimeoutError("operation timed out");
			else err = new TimeoutError(message);
			util.markAsOriginatingFromRejection(err);
			promise._attachExtraTrace(err);
			promise._reject(err);
			if (parent != null) parent.cancel();
		};
		function successClear(value) {
			clearTimeout(this.handle);
			return value;
		}
		function failureClear(reason) {
			clearTimeout(this.handle);
			throw reason;
		}
		Promise.prototype.timeout = function(ms, message) {
			ms = +ms;
			var ret, parent;
			var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
				if (ret.isPending()) afterTimeout(ret, message, parent);
			}, ms));
			if (debug.cancellation()) {
				parent = this.then();
				ret = parent._then(successClear, failureClear, void 0, handleWrapper, void 0);
				ret._setOnCancel(handleWrapper);
			} else ret = this._then(successClear, failureClear, void 0, handleWrapper, void 0);
			return ret;
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/generators.js
var require_generators = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug) {
		var TypeError = require_errors$1().TypeError;
		var util = require_util$1();
		var errorObj = util.errorObj;
		var tryCatch = util.tryCatch;
		var yieldHandlers = [];
		function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
			for (var i = 0; i < yieldHandlers.length; ++i) {
				traceParent._pushContext();
				var result = tryCatch(yieldHandlers[i])(value);
				traceParent._popContext();
				if (result === errorObj) {
					traceParent._pushContext();
					var ret = Promise.reject(errorObj.e);
					traceParent._popContext();
					return ret;
				}
				var maybePromise = tryConvertToPromise(result, traceParent);
				if (maybePromise instanceof Promise) return maybePromise;
			}
			return null;
		}
		function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
			if (debug.cancellation()) {
				var internal = new Promise(INTERNAL);
				var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
				this._promise = internal.lastly(function() {
					return _finallyPromise;
				});
				internal._captureStackTrace();
				internal._setOnCancel(this);
			} else (this._promise = new Promise(INTERNAL))._captureStackTrace();
			this._stack = stack;
			this._generatorFunction = generatorFunction;
			this._receiver = receiver;
			this._generator = void 0;
			this._yieldHandlers = typeof yieldHandler === "function" ? [yieldHandler].concat(yieldHandlers) : yieldHandlers;
			this._yieldedPromise = null;
			this._cancellationPhase = false;
		}
		util.inherits(PromiseSpawn, Proxyable);
		PromiseSpawn.prototype._isResolved = function() {
			return this._promise === null;
		};
		PromiseSpawn.prototype._cleanup = function() {
			this._promise = this._generator = null;
			if (debug.cancellation() && this._finallyPromise !== null) {
				this._finallyPromise._fulfill();
				this._finallyPromise = null;
			}
		};
		PromiseSpawn.prototype._promiseCancelled = function() {
			if (this._isResolved()) return;
			var implementsReturn = typeof this._generator["return"] !== "undefined";
			var result;
			if (!implementsReturn) {
				var reason = new Promise.CancellationError("generator .return() sentinel");
				Promise.coroutine.returnSentinel = reason;
				this._promise._attachExtraTrace(reason);
				this._promise._pushContext();
				result = tryCatch(this._generator["throw"]).call(this._generator, reason);
				this._promise._popContext();
			} else {
				this._promise._pushContext();
				result = tryCatch(this._generator["return"]).call(this._generator, void 0);
				this._promise._popContext();
			}
			this._cancellationPhase = true;
			this._yieldedPromise = null;
			this._continue(result);
		};
		PromiseSpawn.prototype._promiseFulfilled = function(value) {
			this._yieldedPromise = null;
			this._promise._pushContext();
			var result = tryCatch(this._generator.next).call(this._generator, value);
			this._promise._popContext();
			this._continue(result);
		};
		PromiseSpawn.prototype._promiseRejected = function(reason) {
			this._yieldedPromise = null;
			this._promise._attachExtraTrace(reason);
			this._promise._pushContext();
			var result = tryCatch(this._generator["throw"]).call(this._generator, reason);
			this._promise._popContext();
			this._continue(result);
		};
		PromiseSpawn.prototype._resultCancelled = function() {
			if (this._yieldedPromise instanceof Promise) {
				var promise = this._yieldedPromise;
				this._yieldedPromise = null;
				promise.cancel();
			}
		};
		PromiseSpawn.prototype.promise = function() {
			return this._promise;
		};
		PromiseSpawn.prototype._run = function() {
			this._generator = this._generatorFunction.call(this._receiver);
			this._receiver = this._generatorFunction = void 0;
			this._promiseFulfilled(void 0);
		};
		PromiseSpawn.prototype._continue = function(result) {
			var promise = this._promise;
			if (result === errorObj) {
				this._cleanup();
				if (this._cancellationPhase) return promise.cancel();
				else return promise._rejectCallback(result.e, false);
			}
			var value = result.value;
			if (result.done === true) {
				this._cleanup();
				if (this._cancellationPhase) return promise.cancel();
				else return promise._resolveCallback(value);
			} else {
				var maybePromise = tryConvertToPromise(value, this._promise);
				if (!(maybePromise instanceof Promise)) {
					maybePromise = promiseFromYieldHandler(maybePromise, this._yieldHandlers, this._promise);
					if (maybePromise === null) {
						this._promiseRejected(new TypeError("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s", value) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")));
						return;
					}
				}
				maybePromise = maybePromise._target();
				var bitField = maybePromise._bitField;
				if ((bitField & 50397184) === 0) {
					this._yieldedPromise = maybePromise;
					maybePromise._proxy(this, null);
				} else if ((bitField & 33554432) !== 0) Promise._async.invoke(this._promiseFulfilled, this, maybePromise._value());
				else if ((bitField & 16777216) !== 0) Promise._async.invoke(this._promiseRejected, this, maybePromise._reason());
				else this._promiseCancelled();
			}
		};
		Promise.coroutine = function(generatorFunction, options) {
			if (typeof generatorFunction !== "function") throw new TypeError("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
			var yieldHandler = Object(options).yieldHandler;
			var PromiseSpawn$ = PromiseSpawn;
			var stack = (/* @__PURE__ */ new Error()).stack;
			return function() {
				var generator = generatorFunction.apply(this, arguments);
				var spawn = new PromiseSpawn$(void 0, void 0, yieldHandler, stack);
				var ret = spawn.promise();
				spawn._generator = generator;
				spawn._promiseFulfilled(void 0);
				return ret;
			};
		};
		Promise.coroutine.addYieldHandler = function(fn) {
			if (typeof fn !== "function") throw new TypeError("expecting a function but got " + util.classString(fn));
			yieldHandlers.push(fn);
		};
		Promise.spawn = function(generatorFunction) {
			debug.deprecated("Promise.spawn()", "Promise.coroutine()");
			if (typeof generatorFunction !== "function") return apiRejection("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
			var spawn = new PromiseSpawn(generatorFunction, this);
			var ret = spawn.promise();
			spawn._run(Promise.spawn);
			return ret;
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/nodeify.js
var require_nodeify = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise) {
		var util = require_util$1();
		var async = Promise._async;
		var tryCatch = util.tryCatch;
		var errorObj = util.errorObj;
		function spreadAdapter(val, nodeback) {
			var promise = this;
			if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
			var ret = tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
			if (ret === errorObj) async.throwLater(ret.e);
		}
		function successAdapter(val, nodeback) {
			var receiver = this._boundValue();
			var ret = val === void 0 ? tryCatch(nodeback).call(receiver, null) : tryCatch(nodeback).call(receiver, null, val);
			if (ret === errorObj) async.throwLater(ret.e);
		}
		function errorAdapter(reason, nodeback) {
			var promise = this;
			if (!reason) {
				var newReason = /* @__PURE__ */ new Error(reason + "");
				newReason.cause = reason;
				reason = newReason;
			}
			var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
			if (ret === errorObj) async.throwLater(ret.e);
		}
		Promise.prototype.asCallback = Promise.prototype.nodeify = function(nodeback, options) {
			if (typeof nodeback == "function") {
				var adapter = successAdapter;
				if (options !== void 0 && Object(options).spread) adapter = spreadAdapter;
				this._then(adapter, errorAdapter, void 0, this, nodeback);
			}
			return this;
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/promisify.js
var require_promisify = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, INTERNAL) {
		var THIS = {};
		var util = require_util$1();
		var nodebackForPromise = require_nodeback();
		var withAppended = util.withAppended;
		var maybeWrapAsError = util.maybeWrapAsError;
		var canEvaluate = util.canEvaluate;
		var TypeError = require_errors$1().TypeError;
		var defaultSuffix = "Async";
		var defaultPromisified = { __isPromisified__: true };
		var noCopyPropsPattern = new RegExp("^(?:" + [
			"arity",
			"length",
			"name",
			"arguments",
			"caller",
			"callee",
			"prototype",
			"__isPromisified__"
		].join("|") + ")$");
		var defaultFilter = function(name) {
			return util.isIdentifier(name) && name.charAt(0) !== "_" && name !== "constructor";
		};
		function propsFilter(key) {
			return !noCopyPropsPattern.test(key);
		}
		function isPromisified(fn) {
			try {
				return fn.__isPromisified__ === true;
			} catch (e) {
				return false;
			}
		}
		function hasPromisified(obj, key, suffix) {
			var val = util.getDataPropertyOrDefault(obj, key + suffix, defaultPromisified);
			return val ? isPromisified(val) : false;
		}
		function checkValid(ret, suffix, suffixRegexp) {
			for (var i = 0; i < ret.length; i += 2) {
				var key = ret[i];
				if (suffixRegexp.test(key)) {
					var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
					for (var j = 0; j < ret.length; j += 2) if (ret[j] === keyWithoutAsyncSuffix) throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s", suffix));
				}
			}
		}
		function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
			var keys = util.inheritedDataKeys(obj);
			var ret = [];
			for (var i = 0; i < keys.length; ++i) {
				var key = keys[i];
				var value = obj[key];
				var passesDefaultFilter = filter === defaultFilter ? true : defaultFilter(key, value, obj);
				if (typeof value === "function" && !isPromisified(value) && !hasPromisified(obj, key, suffix) && filter(key, value, obj, passesDefaultFilter)) ret.push(key, value);
			}
			checkValid(ret, suffix, suffixRegexp);
			return ret;
		}
		var escapeIdentRegex = function(str) {
			return str.replace(/([$])/, "\\$");
		};
		var makeNodePromisifiedEval;
		var switchCaseArgumentOrder = function(likelyArgumentCount) {
			var ret = [likelyArgumentCount];
			var min = Math.max(0, likelyArgumentCount - 1 - 3);
			for (var i = likelyArgumentCount - 1; i >= min; --i) ret.push(i);
			for (var i = likelyArgumentCount + 1; i <= 3; ++i) ret.push(i);
			return ret;
		};
		var argumentSequence = function(argumentCount) {
			return util.filledRange(argumentCount, "_arg", "");
		};
		var parameterDeclaration = function(parameterCount) {
			return util.filledRange(Math.max(parameterCount, 3), "_arg", "");
		};
		var parameterCount = function(fn) {
			if (typeof fn.length === "number") return Math.max(Math.min(fn.length, 1024), 0);
			return 0;
		};
		makeNodePromisifiedEval = function(callback, receiver, originalName, fn, _, multiArgs) {
			var newParameterCount = Math.max(0, parameterCount(fn) - 1);
			var argumentOrder = switchCaseArgumentOrder(newParameterCount);
			var shouldProxyThis = typeof callback === "string" || receiver === THIS;
			function generateCallForArgumentCount(count) {
				var args = argumentSequence(count).join(", ");
				var comma = count > 0 ? ", " : "";
				var ret;
				if (shouldProxyThis) ret = "ret = callback.call(this, {{args}}, nodeback); break;\n";
				else ret = receiver === void 0 ? "ret = callback({{args}}, nodeback); break;\n" : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
				return ret.replace("{{args}}", args).replace(", ", comma);
			}
			function generateArgumentSwitchCase() {
				var ret = "";
				for (var i = 0; i < argumentOrder.length; ++i) ret += "case " + argumentOrder[i] + ":" + generateCallForArgumentCount(argumentOrder[i]);
				ret += "                                                             \n        default:                                                             \n            var args = new Array(len + 1);                                   \n            var i = 0;                                                       \n            for (var i = 0; i < len; ++i) {                                  \n               args[i] = arguments[i];                                       \n            }                                                                \n            args[i] = nodeback;                                              \n            [CodeForCall]                                                    \n            break;                                                           \n        ".replace("[CodeForCall]", shouldProxyThis ? "ret = callback.apply(this, args);\n" : "ret = callback.apply(receiver, args);\n");
				return ret;
			}
			var getFunctionCode = typeof callback === "string" ? "this != null ? this['" + callback + "'] : fn" : "fn";
			var body = "'use strict';                                                \n        var ret = function (Parameters) {                                    \n            'use strict';                                                    \n            var len = arguments.length;                                      \n            var promise = new Promise(INTERNAL);                             \n            promise._captureStackTrace();                                    \n            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n            var ret;                                                         \n            var callback = tryCatch([GetFunctionCode]);                      \n            switch(len) {                                                    \n                [CodeForSwitchCase]                                          \n            }                                                                \n            if (ret === errorObj) {                                          \n                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n            }                                                                \n            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n            return promise;                                                  \n        };                                                                   \n        notEnumerableProp(ret, '__isPromisified__', true);                   \n        return ret;                                                          \n    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase()).replace("[GetFunctionCode]", getFunctionCode);
			body = body.replace("Parameters", parameterDeclaration(newParameterCount));
			return new Function("Promise", "fn", "receiver", "withAppended", "maybeWrapAsError", "nodebackForPromise", "tryCatch", "errorObj", "notEnumerableProp", "INTERNAL", body)(Promise, fn, receiver, withAppended, maybeWrapAsError, nodebackForPromise, util.tryCatch, util.errorObj, util.notEnumerableProp, INTERNAL);
		};
		function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
			var defaultThis = (function() {
				return this;
			})();
			var method = callback;
			if (typeof method === "string") callback = fn;
			function promisified() {
				var _receiver = receiver;
				if (receiver === THIS) _receiver = this;
				var promise = new Promise(INTERNAL);
				promise._captureStackTrace();
				var cb = typeof method === "string" && this !== defaultThis ? this[method] : callback;
				var fn = nodebackForPromise(promise, multiArgs);
				try {
					cb.apply(_receiver, withAppended(arguments, fn));
				} catch (e) {
					promise._rejectCallback(maybeWrapAsError(e), true, true);
				}
				if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
				return promise;
			}
			util.notEnumerableProp(promisified, "__isPromisified__", true);
			return promisified;
		}
		var makeNodePromisified = canEvaluate ? makeNodePromisifiedEval : makeNodePromisifiedClosure;
		function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
			var methods = promisifiableMethods(obj, suffix, new RegExp(escapeIdentRegex(suffix) + "$"), filter);
			for (var i = 0, len = methods.length; i < len; i += 2) {
				var key = methods[i];
				var fn = methods[i + 1];
				var promisifiedKey = key + suffix;
				if (promisifier === makeNodePromisified) obj[promisifiedKey] = makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
				else {
					var promisified = promisifier(fn, function() {
						return makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
					});
					util.notEnumerableProp(promisified, "__isPromisified__", true);
					obj[promisifiedKey] = promisified;
				}
			}
			util.toFastProperties(obj);
			return obj;
		}
		function promisify(callback, receiver, multiArgs) {
			return makeNodePromisified(callback, receiver, void 0, callback, null, multiArgs);
		}
		Promise.promisify = function(fn, options) {
			if (typeof fn !== "function") throw new TypeError("expecting a function but got " + util.classString(fn));
			if (isPromisified(fn)) return fn;
			options = Object(options);
			var ret = promisify(fn, options.context === void 0 ? THIS : options.context, !!options.multiArgs);
			util.copyDescriptors(fn, ret, propsFilter);
			return ret;
		};
		Promise.promisifyAll = function(target, options) {
			if (typeof target !== "function" && typeof target !== "object") throw new TypeError("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");
			options = Object(options);
			var multiArgs = !!options.multiArgs;
			var suffix = options.suffix;
			if (typeof suffix !== "string") suffix = defaultSuffix;
			var filter = options.filter;
			if (typeof filter !== "function") filter = defaultFilter;
			var promisifier = options.promisifier;
			if (typeof promisifier !== "function") promisifier = makeNodePromisified;
			if (!util.isIdentifier(suffix)) throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");
			var keys = util.inheritedDataKeys(target);
			for (var i = 0; i < keys.length; ++i) {
				var value = target[keys[i]];
				if (keys[i] !== "constructor" && util.isClass(value)) {
					promisifyAll(value.prototype, suffix, filter, promisifier, multiArgs);
					promisifyAll(value, suffix, filter, promisifier, multiArgs);
				}
			}
			return promisifyAll(target, suffix, filter, promisifier, multiArgs);
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/props.js
var require_props = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, PromiseArray, tryConvertToPromise, apiRejection) {
		var util = require_util$1();
		var isObject = util.isObject;
		var es5 = require_es5();
		var Es6Map;
		if (typeof Map === "function") Es6Map = Map;
		var mapToEntries = (function() {
			var index = 0;
			var size = 0;
			function extractEntry(value, key) {
				this[index] = value;
				this[index + size] = key;
				index++;
			}
			return function mapToEntries(map) {
				size = map.size;
				index = 0;
				var ret = new Array(map.size * 2);
				map.forEach(extractEntry, ret);
				return ret;
			};
		})();
		var entriesToMap = function(entries) {
			var ret = new Es6Map();
			var length = entries.length / 2 | 0;
			for (var i = 0; i < length; ++i) {
				var key = entries[length + i];
				var value = entries[i];
				ret.set(key, value);
			}
			return ret;
		};
		function PropertiesPromiseArray(obj) {
			var isMap = false;
			var entries;
			if (Es6Map !== void 0 && obj instanceof Es6Map) {
				entries = mapToEntries(obj);
				isMap = true;
			} else {
				var keys = es5.keys(obj);
				var len = keys.length;
				entries = new Array(len * 2);
				for (var i = 0; i < len; ++i) {
					var key = keys[i];
					entries[i] = obj[key];
					entries[i + len] = key;
				}
			}
			this.constructor$(entries);
			this._isMap = isMap;
			this._init$(void 0, -3);
		}
		util.inherits(PropertiesPromiseArray, PromiseArray);
		PropertiesPromiseArray.prototype._init = function() {};
		PropertiesPromiseArray.prototype._promiseFulfilled = function(value, index) {
			this._values[index] = value;
			if (++this._totalResolved >= this._length) {
				var val;
				if (this._isMap) val = entriesToMap(this._values);
				else {
					val = {};
					var keyOffset = this.length();
					for (var i = 0, len = this.length(); i < len; ++i) val[this._values[i + keyOffset]] = this._values[i];
				}
				this._resolve(val);
				return true;
			}
			return false;
		};
		PropertiesPromiseArray.prototype.shouldCopyValues = function() {
			return false;
		};
		PropertiesPromiseArray.prototype.getActualLength = function(len) {
			return len >> 1;
		};
		function props(promises) {
			var ret;
			var castValue = tryConvertToPromise(promises);
			if (!isObject(castValue)) return apiRejection("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n");
			else if (castValue instanceof Promise) ret = castValue._then(Promise.props, void 0, void 0, void 0, void 0);
			else ret = new PropertiesPromiseArray(castValue).promise();
			if (castValue instanceof Promise) ret._propagateFrom(castValue, 2);
			return ret;
		}
		Promise.prototype.props = function() {
			return props(this);
		};
		Promise.props = function(promises) {
			return props(promises);
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/race.js
var require_race = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, INTERNAL, tryConvertToPromise, apiRejection) {
		var util = require_util$1();
		var raceLater = function(promise) {
			return promise.then(function(array) {
				return race(array, promise);
			});
		};
		function race(promises, parent) {
			var maybePromise = tryConvertToPromise(promises);
			if (maybePromise instanceof Promise) return raceLater(maybePromise);
			else {
				promises = util.asArray(promises);
				if (promises === null) return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
			}
			var ret = new Promise(INTERNAL);
			if (parent !== void 0) ret._propagateFrom(parent, 3);
			var fulfill = ret._fulfill;
			var reject = ret._reject;
			for (var i = 0, len = promises.length; i < len; ++i) {
				var val = promises[i];
				if (val === void 0 && !(i in promises)) continue;
				Promise.cast(val)._then(fulfill, reject, void 0, ret, null);
			}
			return ret;
		}
		Promise.race = function(promises) {
			return race(promises, void 0);
		};
		Promise.prototype.race = function() {
			return race(this, void 0);
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/reduce.js
var require_reduce = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
		var getDomain = Promise._getDomain;
		var util = require_util$1();
		var tryCatch = util.tryCatch;
		function ReductionPromiseArray(promises, fn, initialValue, _each) {
			this.constructor$(promises);
			var domain = getDomain();
			this._fn = domain === null ? fn : util.domainBind(domain, fn);
			if (initialValue !== void 0) {
				initialValue = Promise.resolve(initialValue);
				initialValue._attachCancellationCallback(this);
			}
			this._initialValue = initialValue;
			this._currentCancellable = null;
			if (_each === INTERNAL) this._eachValues = Array(this._length);
			else if (_each === 0) this._eachValues = null;
			else this._eachValues = void 0;
			this._promise._captureStackTrace();
			this._init$(void 0, -5);
		}
		util.inherits(ReductionPromiseArray, PromiseArray);
		ReductionPromiseArray.prototype._gotAccum = function(accum) {
			if (this._eachValues !== void 0 && this._eachValues !== null && accum !== INTERNAL) this._eachValues.push(accum);
		};
		ReductionPromiseArray.prototype._eachComplete = function(value) {
			if (this._eachValues !== null) this._eachValues.push(value);
			return this._eachValues;
		};
		ReductionPromiseArray.prototype._init = function() {};
		ReductionPromiseArray.prototype._resolveEmptyArray = function() {
			this._resolve(this._eachValues !== void 0 ? this._eachValues : this._initialValue);
		};
		ReductionPromiseArray.prototype.shouldCopyValues = function() {
			return false;
		};
		ReductionPromiseArray.prototype._resolve = function(value) {
			this._promise._resolveCallback(value);
			this._values = null;
		};
		ReductionPromiseArray.prototype._resultCancelled = function(sender) {
			if (sender === this._initialValue) return this._cancel();
			if (this._isResolved()) return;
			this._resultCancelled$();
			if (this._currentCancellable instanceof Promise) this._currentCancellable.cancel();
			if (this._initialValue instanceof Promise) this._initialValue.cancel();
		};
		ReductionPromiseArray.prototype._iterate = function(values) {
			this._values = values;
			var value;
			var i;
			var length = values.length;
			if (this._initialValue !== void 0) {
				value = this._initialValue;
				i = 0;
			} else {
				value = Promise.resolve(values[0]);
				i = 1;
			}
			this._currentCancellable = value;
			if (!value.isRejected()) for (; i < length; ++i) {
				var ctx = {
					accum: null,
					value: values[i],
					index: i,
					length,
					array: this
				};
				value = value._then(gotAccum, void 0, void 0, ctx, void 0);
			}
			if (this._eachValues !== void 0) value = value._then(this._eachComplete, void 0, void 0, this, void 0);
			value._then(completed, completed, void 0, value, this);
		};
		Promise.prototype.reduce = function(fn, initialValue) {
			return reduce(this, fn, initialValue, null);
		};
		Promise.reduce = function(promises, fn, initialValue, _each) {
			return reduce(promises, fn, initialValue, _each);
		};
		function completed(valueOrReason, array) {
			if (this.isFulfilled()) array._resolve(valueOrReason);
			else array._reject(valueOrReason);
		}
		function reduce(promises, fn, initialValue, _each) {
			if (typeof fn !== "function") return apiRejection("expecting a function but got " + util.classString(fn));
			return new ReductionPromiseArray(promises, fn, initialValue, _each).promise();
		}
		function gotAccum(accum) {
			this.accum = accum;
			this.array._gotAccum(accum);
			var value = tryConvertToPromise(this.value, this.array._promise);
			if (value instanceof Promise) {
				this.array._currentCancellable = value;
				return value._then(gotValue, void 0, void 0, this, void 0);
			} else return gotValue.call(this, value);
		}
		function gotValue(value) {
			var array = this.array;
			var promise = array._promise;
			var fn = tryCatch(array._fn);
			promise._pushContext();
			var ret;
			if (array._eachValues !== void 0) ret = fn.call(promise._boundValue(), value, this.index, this.length);
			else ret = fn.call(promise._boundValue(), this.accum, value, this.index, this.length);
			if (ret instanceof Promise) array._currentCancellable = ret;
			var promiseCreated = promise._popContext();
			debug.checkForgottenReturns(ret, promiseCreated, array._eachValues !== void 0 ? "Promise.each" : "Promise.reduce", promise);
			return ret;
		}
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/settle.js
var require_settle = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, PromiseArray, debug) {
		var PromiseInspection = Promise.PromiseInspection;
		var util = require_util$1();
		function SettledPromiseArray(values) {
			this.constructor$(values);
		}
		util.inherits(SettledPromiseArray, PromiseArray);
		SettledPromiseArray.prototype._promiseResolved = function(index, inspection) {
			this._values[index] = inspection;
			if (++this._totalResolved >= this._length) {
				this._resolve(this._values);
				return true;
			}
			return false;
		};
		SettledPromiseArray.prototype._promiseFulfilled = function(value, index) {
			var ret = new PromiseInspection();
			ret._bitField = 33554432;
			ret._settledValueField = value;
			return this._promiseResolved(index, ret);
		};
		SettledPromiseArray.prototype._promiseRejected = function(reason, index) {
			var ret = new PromiseInspection();
			ret._bitField = 16777216;
			ret._settledValueField = reason;
			return this._promiseResolved(index, ret);
		};
		Promise.settle = function(promises) {
			debug.deprecated(".settle()", ".reflect()");
			return new SettledPromiseArray(promises).promise();
		};
		Promise.prototype.settle = function() {
			return Promise.settle(this);
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/some.js
var require_some = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, PromiseArray, apiRejection) {
		var util = require_util$1();
		var RangeError = require_errors$1().RangeError;
		var AggregateError = require_errors$1().AggregateError;
		var isArray = util.isArray;
		var CANCELLATION = {};
		function SomePromiseArray(values) {
			this.constructor$(values);
			this._howMany = 0;
			this._unwrap = false;
			this._initialized = false;
		}
		util.inherits(SomePromiseArray, PromiseArray);
		SomePromiseArray.prototype._init = function() {
			if (!this._initialized) return;
			if (this._howMany === 0) {
				this._resolve([]);
				return;
			}
			this._init$(void 0, -5);
			var isArrayResolved = isArray(this._values);
			if (!this._isResolved() && isArrayResolved && this._howMany > this._canPossiblyFulfill()) this._reject(this._getRangeError(this.length()));
		};
		SomePromiseArray.prototype.init = function() {
			this._initialized = true;
			this._init();
		};
		SomePromiseArray.prototype.setUnwrap = function() {
			this._unwrap = true;
		};
		SomePromiseArray.prototype.howMany = function() {
			return this._howMany;
		};
		SomePromiseArray.prototype.setHowMany = function(count) {
			this._howMany = count;
		};
		SomePromiseArray.prototype._promiseFulfilled = function(value) {
			this._addFulfilled(value);
			if (this._fulfilled() === this.howMany()) {
				this._values.length = this.howMany();
				if (this.howMany() === 1 && this._unwrap) this._resolve(this._values[0]);
				else this._resolve(this._values);
				return true;
			}
			return false;
		};
		SomePromiseArray.prototype._promiseRejected = function(reason) {
			this._addRejected(reason);
			return this._checkOutcome();
		};
		SomePromiseArray.prototype._promiseCancelled = function() {
			if (this._values instanceof Promise || this._values == null) return this._cancel();
			this._addRejected(CANCELLATION);
			return this._checkOutcome();
		};
		SomePromiseArray.prototype._checkOutcome = function() {
			if (this.howMany() > this._canPossiblyFulfill()) {
				var e = new AggregateError();
				for (var i = this.length(); i < this._values.length; ++i) if (this._values[i] !== CANCELLATION) e.push(this._values[i]);
				if (e.length > 0) this._reject(e);
				else this._cancel();
				return true;
			}
			return false;
		};
		SomePromiseArray.prototype._fulfilled = function() {
			return this._totalResolved;
		};
		SomePromiseArray.prototype._rejected = function() {
			return this._values.length - this.length();
		};
		SomePromiseArray.prototype._addRejected = function(reason) {
			this._values.push(reason);
		};
		SomePromiseArray.prototype._addFulfilled = function(value) {
			this._values[this._totalResolved++] = value;
		};
		SomePromiseArray.prototype._canPossiblyFulfill = function() {
			return this.length() - this._rejected();
		};
		SomePromiseArray.prototype._getRangeError = function(count) {
			return new RangeError("Input array must contain at least " + this._howMany + " items but contains only " + count + " items");
		};
		SomePromiseArray.prototype._resolveEmptyArray = function() {
			this._reject(this._getRangeError(0));
		};
		function some(promises, howMany) {
			if ((howMany | 0) !== howMany || howMany < 0) return apiRejection("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");
			var ret = new SomePromiseArray(promises);
			var promise = ret.promise();
			ret.setHowMany(howMany);
			ret.init();
			return promise;
		}
		Promise.some = function(promises, howMany) {
			return some(promises, howMany);
		};
		Promise.prototype.some = function(howMany) {
			return some(this, howMany);
		};
		Promise._SomePromiseArray = SomePromiseArray;
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/filter.js
var require_filter = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, INTERNAL) {
		var PromiseMap = Promise.map;
		Promise.prototype.filter = function(fn, options) {
			return PromiseMap(this, fn, options, INTERNAL);
		};
		Promise.filter = function(promises, fn, options) {
			return PromiseMap(promises, fn, options, INTERNAL);
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/each.js
var require_each = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise, INTERNAL) {
		var PromiseReduce = Promise.reduce;
		var PromiseAll = Promise.all;
		function promiseAllThis() {
			return PromiseAll(this);
		}
		function PromiseMapSeries(promises, fn) {
			return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
		}
		Promise.prototype.each = function(fn) {
			return PromiseReduce(this, fn, INTERNAL, 0)._then(promiseAllThis, void 0, void 0, this, void 0);
		};
		Promise.prototype.mapSeries = function(fn) {
			return PromiseReduce(this, fn, INTERNAL, INTERNAL);
		};
		Promise.each = function(promises, fn) {
			return PromiseReduce(promises, fn, INTERNAL, 0)._then(promiseAllThis, void 0, void 0, promises, void 0);
		};
		Promise.mapSeries = PromiseMapSeries;
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/any.js
var require_any = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(Promise) {
		var SomePromiseArray = Promise._SomePromiseArray;
		function any(promises) {
			var ret = new SomePromiseArray(promises);
			var promise = ret.promise();
			ret.setHowMany(1);
			ret.setUnwrap();
			ret.init();
			return promise;
		}
		Promise.any = function(promises) {
			return any(promises);
		};
		Promise.prototype.any = function() {
			return any(this);
		};
	};
}));
//#endregion
//#region node_modules/bluebird/js/release/promise.js
var require_promise = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function() {
		var makeSelfResolutionError = function() {
			return new TypeError("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n");
		};
		var reflectHandler = function() {
			return new Promise.PromiseInspection(this._target());
		};
		var apiRejection = function(msg) {
			return Promise.reject(new TypeError(msg));
		};
		function Proxyable() {}
		var UNDEFINED_BINDING = {};
		var util = require_util$1();
		var getDomain;
		if (util.isNode) getDomain = function() {
			var ret = process.domain;
			if (ret === void 0) ret = null;
			return ret;
		};
		else getDomain = function() {
			return null;
		};
		util.notEnumerableProp(Promise, "_getDomain", getDomain);
		var es5 = require_es5();
		var Async = require_async();
		var async = new Async();
		es5.defineProperty(Promise, "_async", { value: async });
		var errors = require_errors$1();
		var TypeError = Promise.TypeError = errors.TypeError;
		Promise.RangeError = errors.RangeError;
		var CancellationError = Promise.CancellationError = errors.CancellationError;
		Promise.TimeoutError = errors.TimeoutError;
		Promise.OperationalError = errors.OperationalError;
		Promise.RejectionError = errors.OperationalError;
		Promise.AggregateError = errors.AggregateError;
		var INTERNAL = function() {};
		var APPLY = {};
		var NEXT_FILTER = {};
		var tryConvertToPromise = require_thenables()(Promise, INTERNAL);
		var PromiseArray = require_promise_array()(Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable);
		var Context = require_context()(Promise);
		var createContext = Context.create;
		var debug = require_debuggability()(Promise, Context);
		debug.CapturedTrace;
		var PassThroughHandlerContext = require_finally()(Promise, tryConvertToPromise);
		var catchFilter = require_catch_filter()(NEXT_FILTER);
		var nodebackForPromise = require_nodeback();
		var errorObj = util.errorObj;
		var tryCatch = util.tryCatch;
		function check(self, executor) {
			if (typeof executor !== "function") throw new TypeError("expecting a function but got " + util.classString(executor));
			if (self.constructor !== Promise) throw new TypeError("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");
		}
		function Promise(executor) {
			this._bitField = 0;
			this._fulfillmentHandler0 = void 0;
			this._rejectionHandler0 = void 0;
			this._promise0 = void 0;
			this._receiver0 = void 0;
			if (executor !== INTERNAL) {
				check(this, executor);
				this._resolveFromExecutor(executor);
			}
			this._promiseCreated();
			this._fireEvent("promiseCreated", this);
		}
		Promise.prototype.toString = function() {
			return "[object Promise]";
		};
		Promise.prototype.caught = Promise.prototype["catch"] = function(fn) {
			var len = arguments.length;
			if (len > 1) {
				var catchInstances = new Array(len - 1), j = 0, i;
				for (i = 0; i < len - 1; ++i) {
					var item = arguments[i];
					if (util.isObject(item)) catchInstances[j++] = item;
					else return apiRejection("expecting an object but got A catch statement predicate " + util.classString(item));
				}
				catchInstances.length = j;
				fn = arguments[i];
				return this.then(void 0, catchFilter(catchInstances, fn, this));
			}
			return this.then(void 0, fn);
		};
		Promise.prototype.reflect = function() {
			return this._then(reflectHandler, reflectHandler, void 0, this, void 0);
		};
		Promise.prototype.then = function(didFulfill, didReject) {
			if (debug.warnings() && arguments.length > 0 && typeof didFulfill !== "function" && typeof didReject !== "function") {
				var msg = ".then() only accepts functions but was passed: " + util.classString(didFulfill);
				if (arguments.length > 1) msg += ", " + util.classString(didReject);
				this._warn(msg);
			}
			return this._then(didFulfill, didReject, void 0, void 0, void 0);
		};
		Promise.prototype.done = function(didFulfill, didReject) {
			this._then(didFulfill, didReject, void 0, void 0, void 0)._setIsFinal();
		};
		Promise.prototype.spread = function(fn) {
			if (typeof fn !== "function") return apiRejection("expecting a function but got " + util.classString(fn));
			return this.all()._then(fn, void 0, void 0, APPLY, void 0);
		};
		Promise.prototype.toJSON = function() {
			var ret = {
				isFulfilled: false,
				isRejected: false,
				fulfillmentValue: void 0,
				rejectionReason: void 0
			};
			if (this.isFulfilled()) {
				ret.fulfillmentValue = this.value();
				ret.isFulfilled = true;
			} else if (this.isRejected()) {
				ret.rejectionReason = this.reason();
				ret.isRejected = true;
			}
			return ret;
		};
		Promise.prototype.all = function() {
			if (arguments.length > 0) this._warn(".all() was passed arguments but it does not take any");
			return new PromiseArray(this).promise();
		};
		Promise.prototype.error = function(fn) {
			return this.caught(util.originatesFromRejection, fn);
		};
		Promise.getNewLibraryCopy = module.exports;
		Promise.is = function(val) {
			return val instanceof Promise;
		};
		Promise.fromNode = Promise.fromCallback = function(fn) {
			var ret = new Promise(INTERNAL);
			ret._captureStackTrace();
			var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs : false;
			var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
			if (result === errorObj) ret._rejectCallback(result.e, true);
			if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
			return ret;
		};
		Promise.all = function(promises) {
			return new PromiseArray(promises).promise();
		};
		Promise.cast = function(obj) {
			var ret = tryConvertToPromise(obj);
			if (!(ret instanceof Promise)) {
				ret = new Promise(INTERNAL);
				ret._captureStackTrace();
				ret._setFulfilled();
				ret._rejectionHandler0 = obj;
			}
			return ret;
		};
		Promise.resolve = Promise.fulfilled = Promise.cast;
		Promise.reject = Promise.rejected = function(reason) {
			var ret = new Promise(INTERNAL);
			ret._captureStackTrace();
			ret._rejectCallback(reason, true);
			return ret;
		};
		Promise.setScheduler = function(fn) {
			if (typeof fn !== "function") throw new TypeError("expecting a function but got " + util.classString(fn));
			return async.setScheduler(fn);
		};
		Promise.prototype._then = function(didFulfill, didReject, _, receiver, internalData) {
			var haveInternalData = internalData !== void 0;
			var promise = haveInternalData ? internalData : new Promise(INTERNAL);
			var target = this._target();
			var bitField = target._bitField;
			if (!haveInternalData) {
				promise._propagateFrom(this, 3);
				promise._captureStackTrace();
				if (receiver === void 0 && (this._bitField & 2097152) !== 0) if (!((bitField & 50397184) === 0)) receiver = this._boundValue();
				else receiver = target === this ? void 0 : this._boundTo;
				this._fireEvent("promiseChained", this, promise);
			}
			var domain = getDomain();
			if (!((bitField & 50397184) === 0)) {
				var handler, value, settler = target._settlePromiseCtx;
				if ((bitField & 33554432) !== 0) {
					value = target._rejectionHandler0;
					handler = didFulfill;
				} else if ((bitField & 16777216) !== 0) {
					value = target._fulfillmentHandler0;
					handler = didReject;
					target._unsetRejectionIsUnhandled();
				} else {
					settler = target._settlePromiseLateCancellationObserver;
					value = new CancellationError("late cancellation observer");
					target._attachExtraTrace(value);
					handler = didReject;
				}
				async.invoke(settler, target, {
					handler: domain === null ? handler : typeof handler === "function" && util.domainBind(domain, handler),
					promise,
					receiver,
					value
				});
			} else target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
			return promise;
		};
		Promise.prototype._length = function() {
			return this._bitField & 65535;
		};
		Promise.prototype._isFateSealed = function() {
			return (this._bitField & 117506048) !== 0;
		};
		Promise.prototype._isFollowing = function() {
			return (this._bitField & 67108864) === 67108864;
		};
		Promise.prototype._setLength = function(len) {
			this._bitField = this._bitField & -65536 | len & 65535;
		};
		Promise.prototype._setFulfilled = function() {
			this._bitField = this._bitField | 33554432;
			this._fireEvent("promiseFulfilled", this);
		};
		Promise.prototype._setRejected = function() {
			this._bitField = this._bitField | 16777216;
			this._fireEvent("promiseRejected", this);
		};
		Promise.prototype._setFollowing = function() {
			this._bitField = this._bitField | 67108864;
			this._fireEvent("promiseResolved", this);
		};
		Promise.prototype._setIsFinal = function() {
			this._bitField = this._bitField | 4194304;
		};
		Promise.prototype._isFinal = function() {
			return (this._bitField & 4194304) > 0;
		};
		Promise.prototype._unsetCancelled = function() {
			this._bitField = this._bitField & -65537;
		};
		Promise.prototype._setCancelled = function() {
			this._bitField = this._bitField | 65536;
			this._fireEvent("promiseCancelled", this);
		};
		Promise.prototype._setWillBeCancelled = function() {
			this._bitField = this._bitField | 8388608;
		};
		Promise.prototype._setAsyncGuaranteed = function() {
			if (async.hasCustomScheduler()) return;
			this._bitField = this._bitField | 134217728;
		};
		Promise.prototype._receiverAt = function(index) {
			var ret = index === 0 ? this._receiver0 : this[index * 4 - 4 + 3];
			if (ret === UNDEFINED_BINDING) return;
			else if (ret === void 0 && this._isBound()) return this._boundValue();
			return ret;
		};
		Promise.prototype._promiseAt = function(index) {
			return this[index * 4 - 4 + 2];
		};
		Promise.prototype._fulfillmentHandlerAt = function(index) {
			return this[index * 4 - 4 + 0];
		};
		Promise.prototype._rejectionHandlerAt = function(index) {
			return this[index * 4 - 4 + 1];
		};
		Promise.prototype._boundValue = function() {};
		Promise.prototype._migrateCallback0 = function(follower) {
			follower._bitField;
			var fulfill = follower._fulfillmentHandler0;
			var reject = follower._rejectionHandler0;
			var promise = follower._promise0;
			var receiver = follower._receiverAt(0);
			if (receiver === void 0) receiver = UNDEFINED_BINDING;
			this._addCallbacks(fulfill, reject, promise, receiver, null);
		};
		Promise.prototype._migrateCallbackAt = function(follower, index) {
			var fulfill = follower._fulfillmentHandlerAt(index);
			var reject = follower._rejectionHandlerAt(index);
			var promise = follower._promiseAt(index);
			var receiver = follower._receiverAt(index);
			if (receiver === void 0) receiver = UNDEFINED_BINDING;
			this._addCallbacks(fulfill, reject, promise, receiver, null);
		};
		Promise.prototype._addCallbacks = function(fulfill, reject, promise, receiver, domain) {
			var index = this._length();
			if (index >= 65531) {
				index = 0;
				this._setLength(0);
			}
			if (index === 0) {
				this._promise0 = promise;
				this._receiver0 = receiver;
				if (typeof fulfill === "function") this._fulfillmentHandler0 = domain === null ? fulfill : util.domainBind(domain, fulfill);
				if (typeof reject === "function") this._rejectionHandler0 = domain === null ? reject : util.domainBind(domain, reject);
			} else {
				var base = index * 4 - 4;
				this[base + 2] = promise;
				this[base + 3] = receiver;
				if (typeof fulfill === "function") this[base + 0] = domain === null ? fulfill : util.domainBind(domain, fulfill);
				if (typeof reject === "function") this[base + 1] = domain === null ? reject : util.domainBind(domain, reject);
			}
			this._setLength(index + 1);
			return index;
		};
		Promise.prototype._proxy = function(proxyable, arg) {
			this._addCallbacks(void 0, void 0, arg, proxyable, null);
		};
		Promise.prototype._resolveCallback = function(value, shouldBind) {
			if ((this._bitField & 117506048) !== 0) return;
			if (value === this) return this._rejectCallback(makeSelfResolutionError(), false);
			var maybePromise = tryConvertToPromise(value, this);
			if (!(maybePromise instanceof Promise)) return this._fulfill(value);
			if (shouldBind) this._propagateFrom(maybePromise, 2);
			var promise = maybePromise._target();
			if (promise === this) {
				this._reject(makeSelfResolutionError());
				return;
			}
			var bitField = promise._bitField;
			if ((bitField & 50397184) === 0) {
				var len = this._length();
				if (len > 0) promise._migrateCallback0(this);
				for (var i = 1; i < len; ++i) promise._migrateCallbackAt(this, i);
				this._setFollowing();
				this._setLength(0);
				this._setFollowee(promise);
			} else if ((bitField & 33554432) !== 0) this._fulfill(promise._value());
			else if ((bitField & 16777216) !== 0) this._reject(promise._reason());
			else {
				var reason = new CancellationError("late cancellation observer");
				promise._attachExtraTrace(reason);
				this._reject(reason);
			}
		};
		Promise.prototype._rejectCallback = function(reason, synchronous, ignoreNonErrorWarnings) {
			var trace = util.ensureErrorObject(reason);
			var hasStack = trace === reason;
			if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
				var message = "a promise was rejected with a non-error: " + util.classString(reason);
				this._warn(message, true);
			}
			this._attachExtraTrace(trace, synchronous ? hasStack : false);
			this._reject(reason);
		};
		Promise.prototype._resolveFromExecutor = function(executor) {
			var promise = this;
			this._captureStackTrace();
			this._pushContext();
			var synchronous = true;
			var r = this._execute(executor, function(value) {
				promise._resolveCallback(value);
			}, function(reason) {
				promise._rejectCallback(reason, synchronous);
			});
			synchronous = false;
			this._popContext();
			if (r !== void 0) promise._rejectCallback(r, true);
		};
		Promise.prototype._settlePromiseFromHandler = function(handler, receiver, value, promise) {
			var bitField = promise._bitField;
			if ((bitField & 65536) !== 0) return;
			promise._pushContext();
			var x;
			if (receiver === APPLY) if (!value || typeof value.length !== "number") {
				x = errorObj;
				x.e = new TypeError("cannot .spread() a non-array: " + util.classString(value));
			} else x = tryCatch(handler).apply(this._boundValue(), value);
			else x = tryCatch(handler).call(receiver, value);
			var promiseCreated = promise._popContext();
			bitField = promise._bitField;
			if ((bitField & 65536) !== 0) return;
			if (x === NEXT_FILTER) promise._reject(value);
			else if (x === errorObj) promise._rejectCallback(x.e, false);
			else {
				debug.checkForgottenReturns(x, promiseCreated, "", promise, this);
				promise._resolveCallback(x);
			}
		};
		Promise.prototype._target = function() {
			var ret = this;
			while (ret._isFollowing()) ret = ret._followee();
			return ret;
		};
		Promise.prototype._followee = function() {
			return this._rejectionHandler0;
		};
		Promise.prototype._setFollowee = function(promise) {
			this._rejectionHandler0 = promise;
		};
		Promise.prototype._settlePromise = function(promise, handler, receiver, value) {
			var isPromise = promise instanceof Promise;
			var bitField = this._bitField;
			var asyncGuaranteed = (bitField & 134217728) !== 0;
			if ((bitField & 65536) !== 0) {
				if (isPromise) promise._invokeInternalOnCancel();
				if (receiver instanceof PassThroughHandlerContext && receiver.isFinallyHandler()) {
					receiver.cancelPromise = promise;
					if (tryCatch(handler).call(receiver, value) === errorObj) promise._reject(errorObj.e);
				} else if (handler === reflectHandler) promise._fulfill(reflectHandler.call(receiver));
				else if (receiver instanceof Proxyable) receiver._promiseCancelled(promise);
				else if (isPromise || promise instanceof PromiseArray) promise._cancel();
				else receiver.cancel();
			} else if (typeof handler === "function") if (!isPromise) handler.call(receiver, value, promise);
			else {
				if (asyncGuaranteed) promise._setAsyncGuaranteed();
				this._settlePromiseFromHandler(handler, receiver, value, promise);
			}
			else if (receiver instanceof Proxyable) {
				if (!receiver._isResolved()) if ((bitField & 33554432) !== 0) receiver._promiseFulfilled(value, promise);
				else receiver._promiseRejected(value, promise);
			} else if (isPromise) {
				if (asyncGuaranteed) promise._setAsyncGuaranteed();
				if ((bitField & 33554432) !== 0) promise._fulfill(value);
				else promise._reject(value);
			}
		};
		Promise.prototype._settlePromiseLateCancellationObserver = function(ctx) {
			var handler = ctx.handler;
			var promise = ctx.promise;
			var receiver = ctx.receiver;
			var value = ctx.value;
			if (typeof handler === "function") if (!(promise instanceof Promise)) handler.call(receiver, value, promise);
			else this._settlePromiseFromHandler(handler, receiver, value, promise);
			else if (promise instanceof Promise) promise._reject(value);
		};
		Promise.prototype._settlePromiseCtx = function(ctx) {
			this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
		};
		Promise.prototype._settlePromise0 = function(handler, value, bitField) {
			var promise = this._promise0;
			var receiver = this._receiverAt(0);
			this._promise0 = void 0;
			this._receiver0 = void 0;
			this._settlePromise(promise, handler, receiver, value);
		};
		Promise.prototype._clearCallbackDataAtIndex = function(index) {
			var base = index * 4 - 4;
			this[base + 2] = this[base + 3] = this[base + 0] = this[base + 1] = void 0;
		};
		Promise.prototype._fulfill = function(value) {
			var bitField = this._bitField;
			if ((bitField & 117506048) >>> 16) return;
			if (value === this) {
				var err = makeSelfResolutionError();
				this._attachExtraTrace(err);
				return this._reject(err);
			}
			this._setFulfilled();
			this._rejectionHandler0 = value;
			if ((bitField & 65535) > 0) if ((bitField & 134217728) !== 0) this._settlePromises();
			else async.settlePromises(this);
		};
		Promise.prototype._reject = function(reason) {
			var bitField = this._bitField;
			if ((bitField & 117506048) >>> 16) return;
			this._setRejected();
			this._fulfillmentHandler0 = reason;
			if (this._isFinal()) return async.fatalError(reason, util.isNode);
			if ((bitField & 65535) > 0) async.settlePromises(this);
			else this._ensurePossibleRejectionHandled();
		};
		Promise.prototype._fulfillPromises = function(len, value) {
			for (var i = 1; i < len; i++) {
				var handler = this._fulfillmentHandlerAt(i);
				var promise = this._promiseAt(i);
				var receiver = this._receiverAt(i);
				this._clearCallbackDataAtIndex(i);
				this._settlePromise(promise, handler, receiver, value);
			}
		};
		Promise.prototype._rejectPromises = function(len, reason) {
			for (var i = 1; i < len; i++) {
				var handler = this._rejectionHandlerAt(i);
				var promise = this._promiseAt(i);
				var receiver = this._receiverAt(i);
				this._clearCallbackDataAtIndex(i);
				this._settlePromise(promise, handler, receiver, reason);
			}
		};
		Promise.prototype._settlePromises = function() {
			var bitField = this._bitField;
			var len = bitField & 65535;
			if (len > 0) {
				if ((bitField & 16842752) !== 0) {
					var reason = this._fulfillmentHandler0;
					this._settlePromise0(this._rejectionHandler0, reason, bitField);
					this._rejectPromises(len, reason);
				} else {
					var value = this._rejectionHandler0;
					this._settlePromise0(this._fulfillmentHandler0, value, bitField);
					this._fulfillPromises(len, value);
				}
				this._setLength(0);
			}
			this._clearCancellationData();
		};
		Promise.prototype._settledValue = function() {
			var bitField = this._bitField;
			if ((bitField & 33554432) !== 0) return this._rejectionHandler0;
			else if ((bitField & 16777216) !== 0) return this._fulfillmentHandler0;
		};
		function deferResolve(v) {
			this.promise._resolveCallback(v);
		}
		function deferReject(v) {
			this.promise._rejectCallback(v, false);
		}
		Promise.defer = Promise.pending = function() {
			debug.deprecated("Promise.defer", "new Promise");
			return {
				promise: new Promise(INTERNAL),
				resolve: deferResolve,
				reject: deferReject
			};
		};
		util.notEnumerableProp(Promise, "_makeSelfResolutionError", makeSelfResolutionError);
		require_method()(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug);
		require_bind()(Promise, INTERNAL, tryConvertToPromise, debug);
		require_cancel()(Promise, PromiseArray, apiRejection, debug);
		require_direct_resolve()(Promise);
		require_synchronous_inspection()(Promise);
		require_join()(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain);
		Promise.Promise = Promise;
		Promise.version = "3.4.7";
		require_map()(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
		require_call_get()(Promise);
		require_using()(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
		require_timers()(Promise, INTERNAL, debug);
		require_generators()(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
		require_nodeify()(Promise);
		require_promisify()(Promise, INTERNAL);
		require_props()(Promise, PromiseArray, tryConvertToPromise, apiRejection);
		require_race()(Promise, INTERNAL, tryConvertToPromise, apiRejection);
		require_reduce()(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
		require_settle()(Promise, PromiseArray, debug);
		require_some()(Promise, PromiseArray, apiRejection);
		require_filter()(Promise, INTERNAL);
		require_each()(Promise, INTERNAL);
		require_any()(Promise);
		util.toFastProperties(Promise);
		util.toFastProperties(Promise.prototype);
		function fillTypes(value) {
			var p = new Promise(INTERNAL);
			p._fulfillmentHandler0 = value;
			p._rejectionHandler0 = value;
			p._promise0 = value;
			p._receiver0 = value;
		}
		fillTypes({ a: 1 });
		fillTypes({ b: 2 });
		fillTypes({ c: 3 });
		fillTypes(1);
		fillTypes(function() {});
		fillTypes(void 0);
		fillTypes(false);
		fillTypes(new Promise(INTERNAL));
		debug.setBounds(Async.firstLineError, util.lastLineError);
		return Promise;
	};
}));
//#endregion
//#region node_modules/mammoth/lib/promises.js
var require_promises = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	var bluebird = require_promise()();
	exports.defer = defer;
	exports.when = bluebird.resolve;
	exports.resolve = bluebird.resolve;
	exports.all = bluebird.all;
	exports.props = bluebird.props;
	exports.reject = bluebird.reject;
	exports.promisify = bluebird.promisify;
	exports.mapSeries = bluebird.mapSeries;
	exports.attempt = bluebird.attempt;
	exports.nfcall = function(func) {
		var args = Array.prototype.slice.call(arguments, 1);
		return bluebird.promisify(func).apply(null, args);
	};
	bluebird.prototype.fail = bluebird.prototype.caught;
	bluebird.prototype.also = function(func) {
		return this.then(function(value) {
			var returnValue = _.extend({}, value, func(value));
			return bluebird.props(returnValue);
		});
	};
	function defer() {
		var resolve;
		var reject;
		var promise = new bluebird.Promise(function(resolveArg, rejectArg) {
			resolve = resolveArg;
			reject = rejectArg;
		});
		return {
			resolve,
			reject,
			promise
		};
	}
}));
//#endregion
//#region node_modules/mammoth/lib/documents.js
var require_documents = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	var types = exports.types = {
		document: "document",
		paragraph: "paragraph",
		run: "run",
		text: "text",
		tab: "tab",
		checkbox: "checkbox",
		hyperlink: "hyperlink",
		noteReference: "noteReference",
		image: "image",
		note: "note",
		commentReference: "commentReference",
		comment: "comment",
		table: "table",
		tableRow: "tableRow",
		tableCell: "tableCell",
		"break": "break",
		bookmarkStart: "bookmarkStart"
	};
	function Document(children, options) {
		options = options || {};
		return {
			type: types.document,
			children,
			notes: options.notes || new Notes({}),
			comments: options.comments || []
		};
	}
	function Paragraph(children, properties) {
		properties = properties || {};
		var indent = properties.indent || {};
		return {
			type: types.paragraph,
			children,
			styleId: properties.styleId || null,
			styleName: properties.styleName || null,
			numbering: properties.numbering || null,
			alignment: properties.alignment || null,
			indent: {
				start: indent.start || null,
				end: indent.end || null,
				firstLine: indent.firstLine || null,
				hanging: indent.hanging || null
			}
		};
	}
	function Run(children, properties) {
		properties = properties || {};
		return {
			type: types.run,
			children,
			styleId: properties.styleId || null,
			styleName: properties.styleName || null,
			isBold: !!properties.isBold,
			isUnderline: !!properties.isUnderline,
			isItalic: !!properties.isItalic,
			isStrikethrough: !!properties.isStrikethrough,
			isAllCaps: !!properties.isAllCaps,
			isSmallCaps: !!properties.isSmallCaps,
			verticalAlignment: properties.verticalAlignment || verticalAlignment.baseline,
			font: properties.font || null,
			fontSize: properties.fontSize || null,
			highlight: properties.highlight || null
		};
	}
	var verticalAlignment = {
		baseline: "baseline",
		superscript: "superscript",
		subscript: "subscript"
	};
	function Text(value) {
		return {
			type: types.text,
			value
		};
	}
	function Tab() {
		return { type: types.tab };
	}
	function Checkbox(options) {
		return {
			type: types.checkbox,
			checked: options.checked
		};
	}
	function Hyperlink(children, options) {
		return {
			type: types.hyperlink,
			children,
			href: options.href,
			anchor: options.anchor,
			targetFrame: options.targetFrame
		};
	}
	function NoteReference(options) {
		return {
			type: types.noteReference,
			noteType: options.noteType,
			noteId: options.noteId
		};
	}
	function Notes(notes) {
		this._notes = _.indexBy(notes, function(note) {
			return noteKey(note.noteType, note.noteId);
		});
	}
	Notes.prototype.resolve = function(reference) {
		return this.findNoteByKey(noteKey(reference.noteType, reference.noteId));
	};
	Notes.prototype.findNoteByKey = function(key) {
		return this._notes[key] || null;
	};
	function Note(options) {
		return {
			type: types.note,
			noteType: options.noteType,
			noteId: options.noteId,
			body: options.body
		};
	}
	function commentReference(options) {
		return {
			type: types.commentReference,
			commentId: options.commentId
		};
	}
	function comment(options) {
		return {
			type: types.comment,
			commentId: options.commentId,
			body: options.body,
			authorName: options.authorName,
			authorInitials: options.authorInitials
		};
	}
	function noteKey(noteType, id) {
		return noteType + "-" + id;
	}
	function Image(options) {
		return {
			type: types.image,
			read: function(encoding) {
				if (encoding) return options.readImage(encoding);
				else return options.readImage().then(function(arrayBuffer) {
					return Buffer.from(arrayBuffer);
				});
			},
			readAsArrayBuffer: function() {
				return options.readImage();
			},
			readAsBase64String: function() {
				return options.readImage("base64");
			},
			readAsBuffer: function() {
				return options.readImage().then(function(arrayBuffer) {
					return Buffer.from(arrayBuffer);
				});
			},
			altText: options.altText,
			contentType: options.contentType
		};
	}
	function Table(children, properties) {
		properties = properties || {};
		return {
			type: types.table,
			children,
			styleId: properties.styleId || null,
			styleName: properties.styleName || null
		};
	}
	function TableRow(children, options) {
		options = options || {};
		return {
			type: types.tableRow,
			children,
			isHeader: options.isHeader || false
		};
	}
	function TableCell(children, options) {
		options = options || {};
		return {
			type: types.tableCell,
			children,
			colSpan: options.colSpan == null ? 1 : options.colSpan,
			rowSpan: options.rowSpan == null ? 1 : options.rowSpan
		};
	}
	function Break(breakType) {
		return {
			type: types["break"],
			breakType
		};
	}
	function BookmarkStart(options) {
		return {
			type: types.bookmarkStart,
			name: options.name
		};
	}
	exports.document = exports.Document = Document;
	exports.paragraph = exports.Paragraph = Paragraph;
	exports.run = exports.Run = Run;
	exports.text = exports.Text = Text;
	exports.tab = exports.Tab = Tab;
	exports.checkbox = exports.Checkbox = Checkbox;
	exports.Hyperlink = Hyperlink;
	exports.noteReference = exports.NoteReference = NoteReference;
	exports.Notes = Notes;
	exports.Note = Note;
	exports.commentReference = commentReference;
	exports.comment = comment;
	exports.Image = Image;
	exports.Table = Table;
	exports.TableRow = TableRow;
	exports.TableCell = TableCell;
	exports.lineBreak = Break("line");
	exports.pageBreak = Break("page");
	exports.columnBreak = Break("column");
	exports.BookmarkStart = BookmarkStart;
	exports.verticalAlignment = verticalAlignment;
}));
//#endregion
//#region node_modules/mammoth/lib/results.js
var require_results = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	exports.Result = Result;
	exports.success = success;
	exports.warning = warning;
	exports.error = error;
	function Result(value, messages) {
		this.value = value;
		this.messages = messages || [];
	}
	Result.prototype.map = function(func) {
		return new Result(func(this.value), this.messages);
	};
	Result.prototype.flatMap = function(func) {
		var funcResult = func(this.value);
		return new Result(funcResult.value, combineMessages([this, funcResult]));
	};
	Result.prototype.flatMapThen = function(func) {
		var that = this;
		return func(this.value).then(function(otherResult) {
			return new Result(otherResult.value, combineMessages([that, otherResult]));
		});
	};
	Result.combine = function(results) {
		return new Result(_.flatten(_.pluck(results, "value")), combineMessages(results));
	};
	function success(value) {
		return new Result(value, []);
	}
	function warning(message) {
		return {
			type: "warning",
			message
		};
	}
	function error(exception) {
		return {
			type: "error",
			message: exception.message,
			error: exception
		};
	}
	function combineMessages(results) {
		var messages = [];
		_.flatten(_.pluck(results, "messages"), true).forEach(function(message) {
			if (!containsMessage(messages, message)) messages.push(message);
		});
		return messages;
	}
	function containsMessage(messages, message) {
		return _.find(messages, isSameMessage.bind(null, message)) !== void 0;
	}
	function isSameMessage(first, second) {
		return first.type === second.type && first.message === second.message;
	}
}));
//#endregion
//#region node_modules/base64-js/index.js
var require_base64_js = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.byteLength = byteLength;
	exports.toByteArray = toByteArray;
	exports.fromByteArray = fromByteArray;
	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
	var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	for (var i = 0, len = code.length; i < len; ++i) {
		lookup[i] = code[i];
		revLookup[code.charCodeAt(i)] = i;
	}
	revLookup["-".charCodeAt(0)] = 62;
	revLookup["_".charCodeAt(0)] = 63;
	function getLens(b64) {
		var len = b64.length;
		if (len % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
		var validLen = b64.indexOf("=");
		if (validLen === -1) validLen = len;
		var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
		return [validLen, placeHoldersLen];
	}
	function byteLength(b64) {
		var lens = getLens(b64);
		var validLen = lens[0];
		var placeHoldersLen = lens[1];
		return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
	}
	function _byteLength(b64, validLen, placeHoldersLen) {
		return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
	}
	function toByteArray(b64) {
		var tmp;
		var lens = getLens(b64);
		var validLen = lens[0];
		var placeHoldersLen = lens[1];
		var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
		var curByte = 0;
		var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
		var i;
		for (i = 0; i < len; i += 4) {
			tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
			arr[curByte++] = tmp >> 16 & 255;
			arr[curByte++] = tmp >> 8 & 255;
			arr[curByte++] = tmp & 255;
		}
		if (placeHoldersLen === 2) {
			tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
			arr[curByte++] = tmp & 255;
		}
		if (placeHoldersLen === 1) {
			tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
			arr[curByte++] = tmp >> 8 & 255;
			arr[curByte++] = tmp & 255;
		}
		return arr;
	}
	function tripletToBase64(num) {
		return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
	}
	function encodeChunk(uint8, start, end) {
		var tmp;
		var output = [];
		for (var i = start; i < end; i += 3) {
			tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (uint8[i + 2] & 255);
			output.push(tripletToBase64(tmp));
		}
		return output.join("");
	}
	function fromByteArray(uint8) {
		var tmp;
		var len = uint8.length;
		var extraBytes = len % 3;
		var parts = [];
		var maxChunkLength = 16383;
		for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
		if (extraBytes === 1) {
			tmp = uint8[len - 1];
			parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
		} else if (extraBytes === 2) {
			tmp = (uint8[len - 2] << 8) + uint8[len - 1];
			parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
		}
		return parts.join("");
	}
}));
//#endregion
//#region node_modules/process-nextick-args/index.js
var require_process_nextick_args = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	if (typeof process === "undefined" || !process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.indexOf("v1.8.") !== 0) module.exports = { nextTick };
	else module.exports = process;
	function nextTick(fn, arg1, arg2, arg3) {
		if (typeof fn !== "function") throw new TypeError("\"callback\" argument must be a function");
		var len = arguments.length;
		var args, i;
		switch (len) {
			case 0:
			case 1: return process.nextTick(fn);
			case 2: return process.nextTick(function afterTickOne() {
				fn.call(null, arg1);
			});
			case 3: return process.nextTick(function afterTickTwo() {
				fn.call(null, arg1, arg2);
			});
			case 4: return process.nextTick(function afterTickThree() {
				fn.call(null, arg1, arg2, arg3);
			});
			default:
				args = new Array(len - 1);
				i = 0;
				while (i < args.length) args[i++] = arguments[i];
				return process.nextTick(function afterTick() {
					fn.apply(null, args);
				});
		}
	}
}));
//#endregion
//#region node_modules/isarray/index.js
var require_isarray = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var toString = {}.toString;
	module.exports = Array.isArray || function(arr) {
		return toString.call(arr) == "[object Array]";
	};
}));
//#endregion
//#region node_modules/readable-stream/lib/internal/streams/stream.js
var require_stream = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = require("stream");
}));
//#endregion
//#region node_modules/safe-buffer/index.js
var require_safe_buffer = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var buffer = require("buffer");
	var Buffer = buffer.Buffer;
	function copyProps(src, dst) {
		for (var key in src) dst[key] = src[key];
	}
	if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) module.exports = buffer;
	else {
		copyProps(buffer, exports);
		exports.Buffer = SafeBuffer;
	}
	function SafeBuffer(arg, encodingOrOffset, length) {
		return Buffer(arg, encodingOrOffset, length);
	}
	copyProps(Buffer, SafeBuffer);
	SafeBuffer.from = function(arg, encodingOrOffset, length) {
		if (typeof arg === "number") throw new TypeError("Argument must not be a number");
		return Buffer(arg, encodingOrOffset, length);
	};
	SafeBuffer.alloc = function(size, fill, encoding) {
		if (typeof size !== "number") throw new TypeError("Argument must be a number");
		var buf = Buffer(size);
		if (fill !== void 0) if (typeof encoding === "string") buf.fill(fill, encoding);
		else buf.fill(fill);
		else buf.fill(0);
		return buf;
	};
	SafeBuffer.allocUnsafe = function(size) {
		if (typeof size !== "number") throw new TypeError("Argument must be a number");
		return Buffer(size);
	};
	SafeBuffer.allocUnsafeSlow = function(size) {
		if (typeof size !== "number") throw new TypeError("Argument must be a number");
		return buffer.SlowBuffer(size);
	};
}));
//#endregion
//#region node_modules/core-util-is/lib/util.js
var require_util = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	function isArray(arg) {
		if (Array.isArray) return Array.isArray(arg);
		return objectToString(arg) === "[object Array]";
	}
	exports.isArray = isArray;
	function isBoolean(arg) {
		return typeof arg === "boolean";
	}
	exports.isBoolean = isBoolean;
	function isNull(arg) {
		return arg === null;
	}
	exports.isNull = isNull;
	function isNullOrUndefined(arg) {
		return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;
	function isNumber(arg) {
		return typeof arg === "number";
	}
	exports.isNumber = isNumber;
	function isString(arg) {
		return typeof arg === "string";
	}
	exports.isString = isString;
	function isSymbol(arg) {
		return typeof arg === "symbol";
	}
	exports.isSymbol = isSymbol;
	function isUndefined(arg) {
		return arg === void 0;
	}
	exports.isUndefined = isUndefined;
	function isRegExp(re) {
		return objectToString(re) === "[object RegExp]";
	}
	exports.isRegExp = isRegExp;
	function isObject(arg) {
		return typeof arg === "object" && arg !== null;
	}
	exports.isObject = isObject;
	function isDate(d) {
		return objectToString(d) === "[object Date]";
	}
	exports.isDate = isDate;
	function isError(e) {
		return objectToString(e) === "[object Error]" || e instanceof Error;
	}
	exports.isError = isError;
	function isFunction(arg) {
		return typeof arg === "function";
	}
	exports.isFunction = isFunction;
	function isPrimitive(arg) {
		return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
	}
	exports.isPrimitive = isPrimitive;
	exports.isBuffer = require("buffer").Buffer.isBuffer;
	function objectToString(o) {
		return Object.prototype.toString.call(o);
	}
}));
//#endregion
//#region node_modules/inherits/inherits_browser.js
var require_inherits_browser = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	if (typeof Object.create === "function") module.exports = function inherits(ctor, superCtor) {
		if (superCtor) {
			ctor.super_ = superCtor;
			ctor.prototype = Object.create(superCtor.prototype, { constructor: {
				value: ctor,
				enumerable: false,
				writable: true,
				configurable: true
			} });
		}
	};
	else module.exports = function inherits(ctor, superCtor) {
		if (superCtor) {
			ctor.super_ = superCtor;
			var TempCtor = function() {};
			TempCtor.prototype = superCtor.prototype;
			ctor.prototype = new TempCtor();
			ctor.prototype.constructor = ctor;
		}
	};
}));
//#endregion
//#region node_modules/inherits/inherits.js
var require_inherits = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	try {
		var util$1 = require("util");
		/* istanbul ignore next */
		if (typeof util$1.inherits !== "function") throw "";
		module.exports = util$1.inherits;
	} catch (e) {
		/* istanbul ignore next */
		module.exports = require_inherits_browser();
	}
}));
//#endregion
//#region node_modules/readable-stream/lib/internal/streams/BufferList.js
var require_BufferList = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	var Buffer = require_safe_buffer().Buffer;
	var util = require("util");
	function copyBuffer(src, target, offset) {
		src.copy(target, offset);
	}
	module.exports = function() {
		function BufferList() {
			_classCallCheck(this, BufferList);
			this.head = null;
			this.tail = null;
			this.length = 0;
		}
		BufferList.prototype.push = function push(v) {
			var entry = {
				data: v,
				next: null
			};
			if (this.length > 0) this.tail.next = entry;
			else this.head = entry;
			this.tail = entry;
			++this.length;
		};
		BufferList.prototype.unshift = function unshift(v) {
			var entry = {
				data: v,
				next: this.head
			};
			if (this.length === 0) this.tail = entry;
			this.head = entry;
			++this.length;
		};
		BufferList.prototype.shift = function shift() {
			if (this.length === 0) return;
			var ret = this.head.data;
			if (this.length === 1) this.head = this.tail = null;
			else this.head = this.head.next;
			--this.length;
			return ret;
		};
		BufferList.prototype.clear = function clear() {
			this.head = this.tail = null;
			this.length = 0;
		};
		BufferList.prototype.join = function join(s) {
			if (this.length === 0) return "";
			var p = this.head;
			var ret = "" + p.data;
			while (p = p.next) ret += s + p.data;
			return ret;
		};
		BufferList.prototype.concat = function concat(n) {
			if (this.length === 0) return Buffer.alloc(0);
			var ret = Buffer.allocUnsafe(n >>> 0);
			var p = this.head;
			var i = 0;
			while (p) {
				copyBuffer(p.data, ret, i);
				i += p.data.length;
				p = p.next;
			}
			return ret;
		};
		return BufferList;
	}();
	if (util && util.inspect && util.inspect.custom) module.exports.prototype[util.inspect.custom] = function() {
		var obj = util.inspect({ length: this.length });
		return this.constructor.name + " " + obj;
	};
}));
//#endregion
//#region node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var pna = require_process_nextick_args();
	function destroy(err, cb) {
		var _this = this;
		var readableDestroyed = this._readableState && this._readableState.destroyed;
		var writableDestroyed = this._writableState && this._writableState.destroyed;
		if (readableDestroyed || writableDestroyed) {
			if (cb) cb(err);
			else if (err) {
				if (!this._writableState) pna.nextTick(emitErrorNT, this, err);
				else if (!this._writableState.errorEmitted) {
					this._writableState.errorEmitted = true;
					pna.nextTick(emitErrorNT, this, err);
				}
			}
			return this;
		}
		if (this._readableState) this._readableState.destroyed = true;
		if (this._writableState) this._writableState.destroyed = true;
		this._destroy(err || null, function(err) {
			if (!cb && err) {
				if (!_this._writableState) pna.nextTick(emitErrorNT, _this, err);
				else if (!_this._writableState.errorEmitted) {
					_this._writableState.errorEmitted = true;
					pna.nextTick(emitErrorNT, _this, err);
				}
			} else if (cb) cb(err);
		});
		return this;
	}
	function undestroy() {
		if (this._readableState) {
			this._readableState.destroyed = false;
			this._readableState.reading = false;
			this._readableState.ended = false;
			this._readableState.endEmitted = false;
		}
		if (this._writableState) {
			this._writableState.destroyed = false;
			this._writableState.ended = false;
			this._writableState.ending = false;
			this._writableState.finalCalled = false;
			this._writableState.prefinished = false;
			this._writableState.finished = false;
			this._writableState.errorEmitted = false;
		}
	}
	function emitErrorNT(self, err) {
		self.emit("error", err);
	}
	module.exports = {
		destroy,
		undestroy
	};
}));
//#endregion
//#region node_modules/util-deprecate/node.js
var require_node = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	/**
	* For Node.js, simply re-export the core `util.deprecate` function.
	*/
	module.exports = require("util").deprecate;
}));
//#endregion
//#region node_modules/readable-stream/lib/_stream_writable.js
var require__stream_writable = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var pna = require_process_nextick_args();
	module.exports = Writable;
	function CorkedRequest(state) {
		var _this = this;
		this.next = null;
		this.entry = null;
		this.finish = function() {
			onCorkedFinish(_this, state);
		};
	}
	var asyncWrite = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
	var Duplex;
	Writable.WritableState = WritableState;
	var util = Object.create(require_util());
	util.inherits = require_inherits();
	var internalUtil = { deprecate: require_node() };
	var Stream = require_stream();
	var Buffer = require_safe_buffer().Buffer;
	var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {};
	function _uint8ArrayToBuffer(chunk) {
		return Buffer.from(chunk);
	}
	function _isUint8Array(obj) {
		return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
	}
	var destroyImpl = require_destroy();
	util.inherits(Writable, Stream);
	function nop() {}
	function WritableState(options, stream) {
		Duplex = Duplex || require__stream_duplex();
		options = options || {};
		var isDuplex = stream instanceof Duplex;
		this.objectMode = !!options.objectMode;
		if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
		var hwm = options.highWaterMark;
		var writableHwm = options.writableHighWaterMark;
		var defaultHwm = this.objectMode ? 16 : 16 * 1024;
		if (hwm || hwm === 0) this.highWaterMark = hwm;
		else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;
		else this.highWaterMark = defaultHwm;
		this.highWaterMark = Math.floor(this.highWaterMark);
		this.finalCalled = false;
		this.needDrain = false;
		this.ending = false;
		this.ended = false;
		this.finished = false;
		this.destroyed = false;
		this.decodeStrings = !(options.decodeStrings === false);
		this.defaultEncoding = options.defaultEncoding || "utf8";
		this.length = 0;
		this.writing = false;
		this.corked = 0;
		this.sync = true;
		this.bufferProcessing = false;
		this.onwrite = function(er) {
			onwrite(stream, er);
		};
		this.writecb = null;
		this.writelen = 0;
		this.bufferedRequest = null;
		this.lastBufferedRequest = null;
		this.pendingcb = 0;
		this.prefinished = false;
		this.errorEmitted = false;
		this.bufferedRequestCount = 0;
		this.corkedRequestsFree = new CorkedRequest(this);
	}
	WritableState.prototype.getBuffer = function getBuffer() {
		var current = this.bufferedRequest;
		var out = [];
		while (current) {
			out.push(current);
			current = current.next;
		}
		return out;
	};
	(function() {
		try {
			Object.defineProperty(WritableState.prototype, "buffer", { get: internalUtil.deprecate(function() {
				return this.getBuffer();
			}, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003") });
		} catch (_) {}
	})();
	var realHasInstance;
	if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
		realHasInstance = Function.prototype[Symbol.hasInstance];
		Object.defineProperty(Writable, Symbol.hasInstance, { value: function(object) {
			if (realHasInstance.call(this, object)) return true;
			if (this !== Writable) return false;
			return object && object._writableState instanceof WritableState;
		} });
	} else realHasInstance = function(object) {
		return object instanceof this;
	};
	function Writable(options) {
		Duplex = Duplex || require__stream_duplex();
		if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) return new Writable(options);
		this._writableState = new WritableState(options, this);
		this.writable = true;
		if (options) {
			if (typeof options.write === "function") this._write = options.write;
			if (typeof options.writev === "function") this._writev = options.writev;
			if (typeof options.destroy === "function") this._destroy = options.destroy;
			if (typeof options.final === "function") this._final = options.final;
		}
		Stream.call(this);
	}
	Writable.prototype.pipe = function() {
		this.emit("error", /* @__PURE__ */ new Error("Cannot pipe, not readable"));
	};
	function writeAfterEnd(stream, cb) {
		var er = /* @__PURE__ */ new Error("write after end");
		stream.emit("error", er);
		pna.nextTick(cb, er);
	}
	function validChunk(stream, state, chunk, cb) {
		var valid = true;
		var er = false;
		if (chunk === null) er = /* @__PURE__ */ new TypeError("May not write null values to stream");
		else if (typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) er = /* @__PURE__ */ new TypeError("Invalid non-string/buffer chunk");
		if (er) {
			stream.emit("error", er);
			pna.nextTick(cb, er);
			valid = false;
		}
		return valid;
	}
	Writable.prototype.write = function(chunk, encoding, cb) {
		var state = this._writableState;
		var ret = false;
		var isBuf = !state.objectMode && _isUint8Array(chunk);
		if (isBuf && !Buffer.isBuffer(chunk)) chunk = _uint8ArrayToBuffer(chunk);
		if (typeof encoding === "function") {
			cb = encoding;
			encoding = null;
		}
		if (isBuf) encoding = "buffer";
		else if (!encoding) encoding = state.defaultEncoding;
		if (typeof cb !== "function") cb = nop;
		if (state.ended) writeAfterEnd(this, cb);
		else if (isBuf || validChunk(this, state, chunk, cb)) {
			state.pendingcb++;
			ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
		}
		return ret;
	};
	Writable.prototype.cork = function() {
		var state = this._writableState;
		state.corked++;
	};
	Writable.prototype.uncork = function() {
		var state = this._writableState;
		if (state.corked) {
			state.corked--;
			if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
		}
	};
	Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
		if (typeof encoding === "string") encoding = encoding.toLowerCase();
		if (!([
			"hex",
			"utf8",
			"utf-8",
			"ascii",
			"binary",
			"base64",
			"ucs2",
			"ucs-2",
			"utf16le",
			"utf-16le",
			"raw"
		].indexOf((encoding + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + encoding);
		this._writableState.defaultEncoding = encoding;
		return this;
	};
	function decodeChunk(state, chunk, encoding) {
		if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") chunk = Buffer.from(chunk, encoding);
		return chunk;
	}
	Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
		enumerable: false,
		get: function() {
			return this._writableState.highWaterMark;
		}
	});
	function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
		if (!isBuf) {
			var newChunk = decodeChunk(state, chunk, encoding);
			if (chunk !== newChunk) {
				isBuf = true;
				encoding = "buffer";
				chunk = newChunk;
			}
		}
		var len = state.objectMode ? 1 : chunk.length;
		state.length += len;
		var ret = state.length < state.highWaterMark;
		if (!ret) state.needDrain = true;
		if (state.writing || state.corked) {
			var last = state.lastBufferedRequest;
			state.lastBufferedRequest = {
				chunk,
				encoding,
				isBuf,
				callback: cb,
				next: null
			};
			if (last) last.next = state.lastBufferedRequest;
			else state.bufferedRequest = state.lastBufferedRequest;
			state.bufferedRequestCount += 1;
		} else doWrite(stream, state, false, len, chunk, encoding, cb);
		return ret;
	}
	function doWrite(stream, state, writev, len, chunk, encoding, cb) {
		state.writelen = len;
		state.writecb = cb;
		state.writing = true;
		state.sync = true;
		if (writev) stream._writev(chunk, state.onwrite);
		else stream._write(chunk, encoding, state.onwrite);
		state.sync = false;
	}
	function onwriteError(stream, state, sync, er, cb) {
		--state.pendingcb;
		if (sync) {
			pna.nextTick(cb, er);
			pna.nextTick(finishMaybe, stream, state);
			stream._writableState.errorEmitted = true;
			stream.emit("error", er);
		} else {
			cb(er);
			stream._writableState.errorEmitted = true;
			stream.emit("error", er);
			finishMaybe(stream, state);
		}
	}
	function onwriteStateUpdate(state) {
		state.writing = false;
		state.writecb = null;
		state.length -= state.writelen;
		state.writelen = 0;
	}
	function onwrite(stream, er) {
		var state = stream._writableState;
		var sync = state.sync;
		var cb = state.writecb;
		onwriteStateUpdate(state);
		if (er) onwriteError(stream, state, sync, er, cb);
		else {
			var finished = needFinish(state);
			if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(stream, state);
			if (sync) asyncWrite(afterWrite, stream, state, finished, cb);
			else afterWrite(stream, state, finished, cb);
		}
	}
	function afterWrite(stream, state, finished, cb) {
		if (!finished) onwriteDrain(stream, state);
		state.pendingcb--;
		cb();
		finishMaybe(stream, state);
	}
	function onwriteDrain(stream, state) {
		if (state.length === 0 && state.needDrain) {
			state.needDrain = false;
			stream.emit("drain");
		}
	}
	function clearBuffer(stream, state) {
		state.bufferProcessing = true;
		var entry = state.bufferedRequest;
		if (stream._writev && entry && entry.next) {
			var l = state.bufferedRequestCount;
			var buffer = new Array(l);
			var holder = state.corkedRequestsFree;
			holder.entry = entry;
			var count = 0;
			var allBuffers = true;
			while (entry) {
				buffer[count] = entry;
				if (!entry.isBuf) allBuffers = false;
				entry = entry.next;
				count += 1;
			}
			buffer.allBuffers = allBuffers;
			doWrite(stream, state, true, state.length, buffer, "", holder.finish);
			state.pendingcb++;
			state.lastBufferedRequest = null;
			if (holder.next) {
				state.corkedRequestsFree = holder.next;
				holder.next = null;
			} else state.corkedRequestsFree = new CorkedRequest(state);
			state.bufferedRequestCount = 0;
		} else {
			while (entry) {
				var chunk = entry.chunk;
				var encoding = entry.encoding;
				var cb = entry.callback;
				doWrite(stream, state, false, state.objectMode ? 1 : chunk.length, chunk, encoding, cb);
				entry = entry.next;
				state.bufferedRequestCount--;
				if (state.writing) break;
			}
			if (entry === null) state.lastBufferedRequest = null;
		}
		state.bufferedRequest = entry;
		state.bufferProcessing = false;
	}
	Writable.prototype._write = function(chunk, encoding, cb) {
		cb(/* @__PURE__ */ new Error("_write() is not implemented"));
	};
	Writable.prototype._writev = null;
	Writable.prototype.end = function(chunk, encoding, cb) {
		var state = this._writableState;
		if (typeof chunk === "function") {
			cb = chunk;
			chunk = null;
			encoding = null;
		} else if (typeof encoding === "function") {
			cb = encoding;
			encoding = null;
		}
		if (chunk !== null && chunk !== void 0) this.write(chunk, encoding);
		if (state.corked) {
			state.corked = 1;
			this.uncork();
		}
		if (!state.ending) endWritable(this, state, cb);
	};
	function needFinish(state) {
		return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
	}
	function callFinal(stream, state) {
		stream._final(function(err) {
			state.pendingcb--;
			if (err) stream.emit("error", err);
			state.prefinished = true;
			stream.emit("prefinish");
			finishMaybe(stream, state);
		});
	}
	function prefinish(stream, state) {
		if (!state.prefinished && !state.finalCalled) if (typeof stream._final === "function") {
			state.pendingcb++;
			state.finalCalled = true;
			pna.nextTick(callFinal, stream, state);
		} else {
			state.prefinished = true;
			stream.emit("prefinish");
		}
	}
	function finishMaybe(stream, state) {
		var need = needFinish(state);
		if (need) {
			prefinish(stream, state);
			if (state.pendingcb === 0) {
				state.finished = true;
				stream.emit("finish");
			}
		}
		return need;
	}
	function endWritable(stream, state, cb) {
		state.ending = true;
		finishMaybe(stream, state);
		if (cb) if (state.finished) pna.nextTick(cb);
		else stream.once("finish", cb);
		state.ended = true;
		stream.writable = false;
	}
	function onCorkedFinish(corkReq, state, err) {
		var entry = corkReq.entry;
		corkReq.entry = null;
		while (entry) {
			var cb = entry.callback;
			state.pendingcb--;
			cb(err);
			entry = entry.next;
		}
		state.corkedRequestsFree.next = corkReq;
	}
	Object.defineProperty(Writable.prototype, "destroyed", {
		get: function() {
			if (this._writableState === void 0) return false;
			return this._writableState.destroyed;
		},
		set: function(value) {
			if (!this._writableState) return;
			this._writableState.destroyed = value;
		}
	});
	Writable.prototype.destroy = destroyImpl.destroy;
	Writable.prototype._undestroy = destroyImpl.undestroy;
	Writable.prototype._destroy = function(err, cb) {
		this.end();
		cb(err);
	};
}));
//#endregion
//#region node_modules/readable-stream/lib/_stream_duplex.js
var require__stream_duplex = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var pna = require_process_nextick_args();
	var objectKeys = Object.keys || function(obj) {
		var keys = [];
		for (var key in obj) keys.push(key);
		return keys;
	};
	module.exports = Duplex;
	var util = Object.create(require_util());
	util.inherits = require_inherits();
	var Readable = require__stream_readable();
	var Writable = require__stream_writable();
	util.inherits(Duplex, Readable);
	var keys = objectKeys(Writable.prototype);
	for (var v = 0; v < keys.length; v++) {
		var method = keys[v];
		if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
	}
	function Duplex(options) {
		if (!(this instanceof Duplex)) return new Duplex(options);
		Readable.call(this, options);
		Writable.call(this, options);
		if (options && options.readable === false) this.readable = false;
		if (options && options.writable === false) this.writable = false;
		this.allowHalfOpen = true;
		if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;
		this.once("end", onend);
	}
	Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
		enumerable: false,
		get: function() {
			return this._writableState.highWaterMark;
		}
	});
	function onend() {
		if (this.allowHalfOpen || this._writableState.ended) return;
		pna.nextTick(onEndNT, this);
	}
	function onEndNT(self) {
		self.end();
	}
	Object.defineProperty(Duplex.prototype, "destroyed", {
		get: function() {
			if (this._readableState === void 0 || this._writableState === void 0) return false;
			return this._readableState.destroyed && this._writableState.destroyed;
		},
		set: function(value) {
			if (this._readableState === void 0 || this._writableState === void 0) return;
			this._readableState.destroyed = value;
			this._writableState.destroyed = value;
		}
	});
	Duplex.prototype._destroy = function(err, cb) {
		this.push(null);
		this.end();
		pna.nextTick(cb, err);
	};
}));
//#endregion
//#region node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var Buffer = require_safe_buffer().Buffer;
	var isEncoding = Buffer.isEncoding || function(encoding) {
		encoding = "" + encoding;
		switch (encoding && encoding.toLowerCase()) {
			case "hex":
			case "utf8":
			case "utf-8":
			case "ascii":
			case "binary":
			case "base64":
			case "ucs2":
			case "ucs-2":
			case "utf16le":
			case "utf-16le":
			case "raw": return true;
			default: return false;
		}
	};
	function _normalizeEncoding(enc) {
		if (!enc) return "utf8";
		var retried;
		while (true) switch (enc) {
			case "utf8":
			case "utf-8": return "utf8";
			case "ucs2":
			case "ucs-2":
			case "utf16le":
			case "utf-16le": return "utf16le";
			case "latin1":
			case "binary": return "latin1";
			case "base64":
			case "ascii":
			case "hex": return enc;
			default:
				if (retried) return;
				enc = ("" + enc).toLowerCase();
				retried = true;
		}
	}
	function normalizeEncoding(enc) {
		var nenc = _normalizeEncoding(enc);
		if (typeof nenc !== "string" && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error("Unknown encoding: " + enc);
		return nenc || enc;
	}
	exports.StringDecoder = StringDecoder;
	function StringDecoder(encoding) {
		this.encoding = normalizeEncoding(encoding);
		var nb;
		switch (this.encoding) {
			case "utf16le":
				this.text = utf16Text;
				this.end = utf16End;
				nb = 4;
				break;
			case "utf8":
				this.fillLast = utf8FillLast;
				nb = 4;
				break;
			case "base64":
				this.text = base64Text;
				this.end = base64End;
				nb = 3;
				break;
			default:
				this.write = simpleWrite;
				this.end = simpleEnd;
				return;
		}
		this.lastNeed = 0;
		this.lastTotal = 0;
		this.lastChar = Buffer.allocUnsafe(nb);
	}
	StringDecoder.prototype.write = function(buf) {
		if (buf.length === 0) return "";
		var r;
		var i;
		if (this.lastNeed) {
			r = this.fillLast(buf);
			if (r === void 0) return "";
			i = this.lastNeed;
			this.lastNeed = 0;
		} else i = 0;
		if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
		return r || "";
	};
	StringDecoder.prototype.end = utf8End;
	StringDecoder.prototype.text = utf8Text;
	StringDecoder.prototype.fillLast = function(buf) {
		if (this.lastNeed <= buf.length) {
			buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
			return this.lastChar.toString(this.encoding, 0, this.lastTotal);
		}
		buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
		this.lastNeed -= buf.length;
	};
	function utf8CheckByte(byte) {
		if (byte <= 127) return 0;
		else if (byte >> 5 === 6) return 2;
		else if (byte >> 4 === 14) return 3;
		else if (byte >> 3 === 30) return 4;
		return byte >> 6 === 2 ? -1 : -2;
	}
	function utf8CheckIncomplete(self, buf, i) {
		var j = buf.length - 1;
		if (j < i) return 0;
		var nb = utf8CheckByte(buf[j]);
		if (nb >= 0) {
			if (nb > 0) self.lastNeed = nb - 1;
			return nb;
		}
		if (--j < i || nb === -2) return 0;
		nb = utf8CheckByte(buf[j]);
		if (nb >= 0) {
			if (nb > 0) self.lastNeed = nb - 2;
			return nb;
		}
		if (--j < i || nb === -2) return 0;
		nb = utf8CheckByte(buf[j]);
		if (nb >= 0) {
			if (nb > 0) if (nb === 2) nb = 0;
			else self.lastNeed = nb - 3;
			return nb;
		}
		return 0;
	}
	function utf8CheckExtraBytes(self, buf, p) {
		if ((buf[0] & 192) !== 128) {
			self.lastNeed = 0;
			return "�";
		}
		if (self.lastNeed > 1 && buf.length > 1) {
			if ((buf[1] & 192) !== 128) {
				self.lastNeed = 1;
				return "�";
			}
			if (self.lastNeed > 2 && buf.length > 2) {
				if ((buf[2] & 192) !== 128) {
					self.lastNeed = 2;
					return "�";
				}
			}
		}
	}
	function utf8FillLast(buf) {
		var p = this.lastTotal - this.lastNeed;
		var r = utf8CheckExtraBytes(this, buf, p);
		if (r !== void 0) return r;
		if (this.lastNeed <= buf.length) {
			buf.copy(this.lastChar, p, 0, this.lastNeed);
			return this.lastChar.toString(this.encoding, 0, this.lastTotal);
		}
		buf.copy(this.lastChar, p, 0, buf.length);
		this.lastNeed -= buf.length;
	}
	function utf8Text(buf, i) {
		var total = utf8CheckIncomplete(this, buf, i);
		if (!this.lastNeed) return buf.toString("utf8", i);
		this.lastTotal = total;
		var end = buf.length - (total - this.lastNeed);
		buf.copy(this.lastChar, 0, end);
		return buf.toString("utf8", i, end);
	}
	function utf8End(buf) {
		var r = buf && buf.length ? this.write(buf) : "";
		if (this.lastNeed) return r + "�";
		return r;
	}
	function utf16Text(buf, i) {
		if ((buf.length - i) % 2 === 0) {
			var r = buf.toString("utf16le", i);
			if (r) {
				var c = r.charCodeAt(r.length - 1);
				if (c >= 55296 && c <= 56319) {
					this.lastNeed = 2;
					this.lastTotal = 4;
					this.lastChar[0] = buf[buf.length - 2];
					this.lastChar[1] = buf[buf.length - 1];
					return r.slice(0, -1);
				}
			}
			return r;
		}
		this.lastNeed = 1;
		this.lastTotal = 2;
		this.lastChar[0] = buf[buf.length - 1];
		return buf.toString("utf16le", i, buf.length - 1);
	}
	function utf16End(buf) {
		var r = buf && buf.length ? this.write(buf) : "";
		if (this.lastNeed) {
			var end = this.lastTotal - this.lastNeed;
			return r + this.lastChar.toString("utf16le", 0, end);
		}
		return r;
	}
	function base64Text(buf, i) {
		var n = (buf.length - i) % 3;
		if (n === 0) return buf.toString("base64", i);
		this.lastNeed = 3 - n;
		this.lastTotal = 3;
		if (n === 1) this.lastChar[0] = buf[buf.length - 1];
		else {
			this.lastChar[0] = buf[buf.length - 2];
			this.lastChar[1] = buf[buf.length - 1];
		}
		return buf.toString("base64", i, buf.length - n);
	}
	function base64End(buf) {
		var r = buf && buf.length ? this.write(buf) : "";
		if (this.lastNeed) return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
		return r;
	}
	function simpleWrite(buf) {
		return buf.toString(this.encoding);
	}
	function simpleEnd(buf) {
		return buf && buf.length ? this.write(buf) : "";
	}
}));
//#endregion
//#region node_modules/readable-stream/lib/_stream_readable.js
var require__stream_readable = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var pna = require_process_nextick_args();
	module.exports = Readable;
	var isArray = require_isarray();
	var Duplex;
	Readable.ReadableState = ReadableState;
	require("events").EventEmitter;
	var EElistenerCount = function(emitter, type) {
		return emitter.listeners(type).length;
	};
	var Stream = require_stream();
	var Buffer = require_safe_buffer().Buffer;
	var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {};
	function _uint8ArrayToBuffer(chunk) {
		return Buffer.from(chunk);
	}
	function _isUint8Array(obj) {
		return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
	}
	var util = Object.create(require_util());
	util.inherits = require_inherits();
	var debugUtil = require("util");
	var debug = void 0;
	if (debugUtil && debugUtil.debuglog) debug = debugUtil.debuglog("stream");
	else debug = function() {};
	var BufferList = require_BufferList();
	var destroyImpl = require_destroy();
	var StringDecoder;
	util.inherits(Readable, Stream);
	var kProxyEvents = [
		"error",
		"close",
		"destroy",
		"pause",
		"resume"
	];
	function prependListener(emitter, event, fn) {
		if (typeof emitter.prependListener === "function") return emitter.prependListener(event, fn);
		if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
		else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);
		else emitter._events[event] = [fn, emitter._events[event]];
	}
	function ReadableState(options, stream) {
		Duplex = Duplex || require__stream_duplex();
		options = options || {};
		var isDuplex = stream instanceof Duplex;
		this.objectMode = !!options.objectMode;
		if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
		var hwm = options.highWaterMark;
		var readableHwm = options.readableHighWaterMark;
		var defaultHwm = this.objectMode ? 16 : 16 * 1024;
		if (hwm || hwm === 0) this.highWaterMark = hwm;
		else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;
		else this.highWaterMark = defaultHwm;
		this.highWaterMark = Math.floor(this.highWaterMark);
		this.buffer = new BufferList();
		this.length = 0;
		this.pipes = null;
		this.pipesCount = 0;
		this.flowing = null;
		this.ended = false;
		this.endEmitted = false;
		this.reading = false;
		this.sync = true;
		this.needReadable = false;
		this.emittedReadable = false;
		this.readableListening = false;
		this.resumeScheduled = false;
		this.destroyed = false;
		this.defaultEncoding = options.defaultEncoding || "utf8";
		this.awaitDrain = 0;
		this.readingMore = false;
		this.decoder = null;
		this.encoding = null;
		if (options.encoding) {
			if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
			this.decoder = new StringDecoder(options.encoding);
			this.encoding = options.encoding;
		}
	}
	function Readable(options) {
		Duplex = Duplex || require__stream_duplex();
		if (!(this instanceof Readable)) return new Readable(options);
		this._readableState = new ReadableState(options, this);
		this.readable = true;
		if (options) {
			if (typeof options.read === "function") this._read = options.read;
			if (typeof options.destroy === "function") this._destroy = options.destroy;
		}
		Stream.call(this);
	}
	Object.defineProperty(Readable.prototype, "destroyed", {
		get: function() {
			if (this._readableState === void 0) return false;
			return this._readableState.destroyed;
		},
		set: function(value) {
			if (!this._readableState) return;
			this._readableState.destroyed = value;
		}
	});
	Readable.prototype.destroy = destroyImpl.destroy;
	Readable.prototype._undestroy = destroyImpl.undestroy;
	Readable.prototype._destroy = function(err, cb) {
		this.push(null);
		cb(err);
	};
	Readable.prototype.push = function(chunk, encoding) {
		var state = this._readableState;
		var skipChunkCheck;
		if (!state.objectMode) {
			if (typeof chunk === "string") {
				encoding = encoding || state.defaultEncoding;
				if (encoding !== state.encoding) {
					chunk = Buffer.from(chunk, encoding);
					encoding = "";
				}
				skipChunkCheck = true;
			}
		} else skipChunkCheck = true;
		return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
	};
	Readable.prototype.unshift = function(chunk) {
		return readableAddChunk(this, chunk, null, true, false);
	};
	function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
		var state = stream._readableState;
		if (chunk === null) {
			state.reading = false;
			onEofChunk(stream, state);
		} else {
			var er;
			if (!skipChunkCheck) er = chunkInvalid(state, chunk);
			if (er) stream.emit("error", er);
			else if (state.objectMode || chunk && chunk.length > 0) {
				if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) chunk = _uint8ArrayToBuffer(chunk);
				if (addToFront) if (state.endEmitted) stream.emit("error", /* @__PURE__ */ new Error("stream.unshift() after end event"));
				else addChunk(stream, state, chunk, true);
				else if (state.ended) stream.emit("error", /* @__PURE__ */ new Error("stream.push() after EOF"));
				else {
					state.reading = false;
					if (state.decoder && !encoding) {
						chunk = state.decoder.write(chunk);
						if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);
						else maybeReadMore(stream, state);
					} else addChunk(stream, state, chunk, false);
				}
			} else if (!addToFront) state.reading = false;
		}
		return needMoreData(state);
	}
	function addChunk(stream, state, chunk, addToFront) {
		if (state.flowing && state.length === 0 && !state.sync) {
			stream.emit("data", chunk);
			stream.read(0);
		} else {
			state.length += state.objectMode ? 1 : chunk.length;
			if (addToFront) state.buffer.unshift(chunk);
			else state.buffer.push(chunk);
			if (state.needReadable) emitReadable(stream);
		}
		maybeReadMore(stream, state);
	}
	function chunkInvalid(state, chunk) {
		var er;
		if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) er = /* @__PURE__ */ new TypeError("Invalid non-string/buffer chunk");
		return er;
	}
	function needMoreData(state) {
		return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
	}
	Readable.prototype.isPaused = function() {
		return this._readableState.flowing === false;
	};
	Readable.prototype.setEncoding = function(enc) {
		if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
		this._readableState.decoder = new StringDecoder(enc);
		this._readableState.encoding = enc;
		return this;
	};
	var MAX_HWM = 8388608;
	function computeNewHighWaterMark(n) {
		if (n >= MAX_HWM) n = MAX_HWM;
		else {
			n--;
			n |= n >>> 1;
			n |= n >>> 2;
			n |= n >>> 4;
			n |= n >>> 8;
			n |= n >>> 16;
			n++;
		}
		return n;
	}
	function howMuchToRead(n, state) {
		if (n <= 0 || state.length === 0 && state.ended) return 0;
		if (state.objectMode) return 1;
		if (n !== n) if (state.flowing && state.length) return state.buffer.head.data.length;
		else return state.length;
		if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
		if (n <= state.length) return n;
		if (!state.ended) {
			state.needReadable = true;
			return 0;
		}
		return state.length;
	}
	Readable.prototype.read = function(n) {
		debug("read", n);
		n = parseInt(n, 10);
		var state = this._readableState;
		var nOrig = n;
		if (n !== 0) state.emittedReadable = false;
		if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
			debug("read: emitReadable", state.length, state.ended);
			if (state.length === 0 && state.ended) endReadable(this);
			else emitReadable(this);
			return null;
		}
		n = howMuchToRead(n, state);
		if (n === 0 && state.ended) {
			if (state.length === 0) endReadable(this);
			return null;
		}
		var doRead = state.needReadable;
		debug("need readable", doRead);
		if (state.length === 0 || state.length - n < state.highWaterMark) {
			doRead = true;
			debug("length less than watermark", doRead);
		}
		if (state.ended || state.reading) {
			doRead = false;
			debug("reading or ended", doRead);
		} else if (doRead) {
			debug("do read");
			state.reading = true;
			state.sync = true;
			if (state.length === 0) state.needReadable = true;
			this._read(state.highWaterMark);
			state.sync = false;
			if (!state.reading) n = howMuchToRead(nOrig, state);
		}
		var ret;
		if (n > 0) ret = fromList(n, state);
		else ret = null;
		if (ret === null) {
			state.needReadable = true;
			n = 0;
		} else state.length -= n;
		if (state.length === 0) {
			if (!state.ended) state.needReadable = true;
			if (nOrig !== n && state.ended) endReadable(this);
		}
		if (ret !== null) this.emit("data", ret);
		return ret;
	};
	function onEofChunk(stream, state) {
		if (state.ended) return;
		if (state.decoder) {
			var chunk = state.decoder.end();
			if (chunk && chunk.length) {
				state.buffer.push(chunk);
				state.length += state.objectMode ? 1 : chunk.length;
			}
		}
		state.ended = true;
		emitReadable(stream);
	}
	function emitReadable(stream) {
		var state = stream._readableState;
		state.needReadable = false;
		if (!state.emittedReadable) {
			debug("emitReadable", state.flowing);
			state.emittedReadable = true;
			if (state.sync) pna.nextTick(emitReadable_, stream);
			else emitReadable_(stream);
		}
	}
	function emitReadable_(stream) {
		debug("emit readable");
		stream.emit("readable");
		flow(stream);
	}
	function maybeReadMore(stream, state) {
		if (!state.readingMore) {
			state.readingMore = true;
			pna.nextTick(maybeReadMore_, stream, state);
		}
	}
	function maybeReadMore_(stream, state) {
		var len = state.length;
		while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
			debug("maybeReadMore read 0");
			stream.read(0);
			if (len === state.length) break;
			else len = state.length;
		}
		state.readingMore = false;
	}
	Readable.prototype._read = function(n) {
		this.emit("error", /* @__PURE__ */ new Error("_read() is not implemented"));
	};
	Readable.prototype.pipe = function(dest, pipeOpts) {
		var src = this;
		var state = this._readableState;
		switch (state.pipesCount) {
			case 0:
				state.pipes = dest;
				break;
			case 1:
				state.pipes = [state.pipes, dest];
				break;
			default:
				state.pipes.push(dest);
				break;
		}
		state.pipesCount += 1;
		debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
		var endFn = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr ? onend : unpipe;
		if (state.endEmitted) pna.nextTick(endFn);
		else src.once("end", endFn);
		dest.on("unpipe", onunpipe);
		function onunpipe(readable, unpipeInfo) {
			debug("onunpipe");
			if (readable === src) {
				if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
					unpipeInfo.hasUnpiped = true;
					cleanup();
				}
			}
		}
		function onend() {
			debug("onend");
			dest.end();
		}
		var ondrain = pipeOnDrain(src);
		dest.on("drain", ondrain);
		var cleanedUp = false;
		function cleanup() {
			debug("cleanup");
			dest.removeListener("close", onclose);
			dest.removeListener("finish", onfinish);
			dest.removeListener("drain", ondrain);
			dest.removeListener("error", onerror);
			dest.removeListener("unpipe", onunpipe);
			src.removeListener("end", onend);
			src.removeListener("end", unpipe);
			src.removeListener("data", ondata);
			cleanedUp = true;
			if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
		}
		var increasedAwaitDrain = false;
		src.on("data", ondata);
		function ondata(chunk) {
			debug("ondata");
			increasedAwaitDrain = false;
			if (false === dest.write(chunk) && !increasedAwaitDrain) {
				if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
					debug("false write response, pause", state.awaitDrain);
					state.awaitDrain++;
					increasedAwaitDrain = true;
				}
				src.pause();
			}
		}
		function onerror(er) {
			debug("onerror", er);
			unpipe();
			dest.removeListener("error", onerror);
			if (EElistenerCount(dest, "error") === 0) dest.emit("error", er);
		}
		prependListener(dest, "error", onerror);
		function onclose() {
			dest.removeListener("finish", onfinish);
			unpipe();
		}
		dest.once("close", onclose);
		function onfinish() {
			debug("onfinish");
			dest.removeListener("close", onclose);
			unpipe();
		}
		dest.once("finish", onfinish);
		function unpipe() {
			debug("unpipe");
			src.unpipe(dest);
		}
		dest.emit("pipe", src);
		if (!state.flowing) {
			debug("pipe resume");
			src.resume();
		}
		return dest;
	};
	function pipeOnDrain(src) {
		return function() {
			var state = src._readableState;
			debug("pipeOnDrain", state.awaitDrain);
			if (state.awaitDrain) state.awaitDrain--;
			if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
				state.flowing = true;
				flow(src);
			}
		};
	}
	Readable.prototype.unpipe = function(dest) {
		var state = this._readableState;
		var unpipeInfo = { hasUnpiped: false };
		if (state.pipesCount === 0) return this;
		if (state.pipesCount === 1) {
			if (dest && dest !== state.pipes) return this;
			if (!dest) dest = state.pipes;
			state.pipes = null;
			state.pipesCount = 0;
			state.flowing = false;
			if (dest) dest.emit("unpipe", this, unpipeInfo);
			return this;
		}
		if (!dest) {
			var dests = state.pipes;
			var len = state.pipesCount;
			state.pipes = null;
			state.pipesCount = 0;
			state.flowing = false;
			for (var i = 0; i < len; i++) dests[i].emit("unpipe", this, { hasUnpiped: false });
			return this;
		}
		var index = indexOf(state.pipes, dest);
		if (index === -1) return this;
		state.pipes.splice(index, 1);
		state.pipesCount -= 1;
		if (state.pipesCount === 1) state.pipes = state.pipes[0];
		dest.emit("unpipe", this, unpipeInfo);
		return this;
	};
	Readable.prototype.on = function(ev, fn) {
		var res = Stream.prototype.on.call(this, ev, fn);
		if (ev === "data") {
			if (this._readableState.flowing !== false) this.resume();
		} else if (ev === "readable") {
			var state = this._readableState;
			if (!state.endEmitted && !state.readableListening) {
				state.readableListening = state.needReadable = true;
				state.emittedReadable = false;
				if (!state.reading) pna.nextTick(nReadingNextTick, this);
				else if (state.length) emitReadable(this);
			}
		}
		return res;
	};
	Readable.prototype.addListener = Readable.prototype.on;
	function nReadingNextTick(self) {
		debug("readable nexttick read 0");
		self.read(0);
	}
	Readable.prototype.resume = function() {
		var state = this._readableState;
		if (!state.flowing) {
			debug("resume");
			state.flowing = true;
			resume(this, state);
		}
		return this;
	};
	function resume(stream, state) {
		if (!state.resumeScheduled) {
			state.resumeScheduled = true;
			pna.nextTick(resume_, stream, state);
		}
	}
	function resume_(stream, state) {
		if (!state.reading) {
			debug("resume read 0");
			stream.read(0);
		}
		state.resumeScheduled = false;
		state.awaitDrain = 0;
		stream.emit("resume");
		flow(stream);
		if (state.flowing && !state.reading) stream.read(0);
	}
	Readable.prototype.pause = function() {
		debug("call pause flowing=%j", this._readableState.flowing);
		if (false !== this._readableState.flowing) {
			debug("pause");
			this._readableState.flowing = false;
			this.emit("pause");
		}
		return this;
	};
	function flow(stream) {
		var state = stream._readableState;
		debug("flow", state.flowing);
		while (state.flowing && stream.read() !== null);
	}
	Readable.prototype.wrap = function(stream) {
		var _this = this;
		var state = this._readableState;
		var paused = false;
		stream.on("end", function() {
			debug("wrapped end");
			if (state.decoder && !state.ended) {
				var chunk = state.decoder.end();
				if (chunk && chunk.length) _this.push(chunk);
			}
			_this.push(null);
		});
		stream.on("data", function(chunk) {
			debug("wrapped data");
			if (state.decoder) chunk = state.decoder.write(chunk);
			if (state.objectMode && (chunk === null || chunk === void 0)) return;
			else if (!state.objectMode && (!chunk || !chunk.length)) return;
			if (!_this.push(chunk)) {
				paused = true;
				stream.pause();
			}
		});
		for (var i in stream) if (this[i] === void 0 && typeof stream[i] === "function") this[i] = function(method) {
			return function() {
				return stream[method].apply(stream, arguments);
			};
		}(i);
		for (var n = 0; n < kProxyEvents.length; n++) stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
		this._read = function(n) {
			debug("wrapped _read", n);
			if (paused) {
				paused = false;
				stream.resume();
			}
		};
		return this;
	};
	Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
		enumerable: false,
		get: function() {
			return this._readableState.highWaterMark;
		}
	});
	Readable._fromList = fromList;
	function fromList(n, state) {
		if (state.length === 0) return null;
		var ret;
		if (state.objectMode) ret = state.buffer.shift();
		else if (!n || n >= state.length) {
			if (state.decoder) ret = state.buffer.join("");
			else if (state.buffer.length === 1) ret = state.buffer.head.data;
			else ret = state.buffer.concat(state.length);
			state.buffer.clear();
		} else ret = fromListPartial(n, state.buffer, state.decoder);
		return ret;
	}
	function fromListPartial(n, list, hasStrings) {
		var ret;
		if (n < list.head.data.length) {
			ret = list.head.data.slice(0, n);
			list.head.data = list.head.data.slice(n);
		} else if (n === list.head.data.length) ret = list.shift();
		else ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
		return ret;
	}
	function copyFromBufferString(n, list) {
		var p = list.head;
		var c = 1;
		var ret = p.data;
		n -= ret.length;
		while (p = p.next) {
			var str = p.data;
			var nb = n > str.length ? str.length : n;
			if (nb === str.length) ret += str;
			else ret += str.slice(0, n);
			n -= nb;
			if (n === 0) {
				if (nb === str.length) {
					++c;
					if (p.next) list.head = p.next;
					else list.head = list.tail = null;
				} else {
					list.head = p;
					p.data = str.slice(nb);
				}
				break;
			}
			++c;
		}
		list.length -= c;
		return ret;
	}
	function copyFromBuffer(n, list) {
		var ret = Buffer.allocUnsafe(n);
		var p = list.head;
		var c = 1;
		p.data.copy(ret);
		n -= p.data.length;
		while (p = p.next) {
			var buf = p.data;
			var nb = n > buf.length ? buf.length : n;
			buf.copy(ret, ret.length - n, 0, nb);
			n -= nb;
			if (n === 0) {
				if (nb === buf.length) {
					++c;
					if (p.next) list.head = p.next;
					else list.head = list.tail = null;
				} else {
					list.head = p;
					p.data = buf.slice(nb);
				}
				break;
			}
			++c;
		}
		list.length -= c;
		return ret;
	}
	function endReadable(stream) {
		var state = stream._readableState;
		if (state.length > 0) throw new Error("\"endReadable()\" called on non-empty stream");
		if (!state.endEmitted) {
			state.ended = true;
			pna.nextTick(endReadableNT, state, stream);
		}
	}
	function endReadableNT(state, stream) {
		if (!state.endEmitted && state.length === 0) {
			state.endEmitted = true;
			stream.readable = false;
			stream.emit("end");
		}
	}
	function indexOf(xs, x) {
		for (var i = 0, l = xs.length; i < l; i++) if (xs[i] === x) return i;
		return -1;
	}
}));
//#endregion
//#region node_modules/readable-stream/lib/_stream_transform.js
var require__stream_transform = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = Transform;
	var Duplex = require__stream_duplex();
	var util = Object.create(require_util());
	util.inherits = require_inherits();
	util.inherits(Transform, Duplex);
	function afterTransform(er, data) {
		var ts = this._transformState;
		ts.transforming = false;
		var cb = ts.writecb;
		if (!cb) return this.emit("error", /* @__PURE__ */ new Error("write callback called multiple times"));
		ts.writechunk = null;
		ts.writecb = null;
		if (data != null) this.push(data);
		cb(er);
		var rs = this._readableState;
		rs.reading = false;
		if (rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
	}
	function Transform(options) {
		if (!(this instanceof Transform)) return new Transform(options);
		Duplex.call(this, options);
		this._transformState = {
			afterTransform: afterTransform.bind(this),
			needTransform: false,
			transforming: false,
			writecb: null,
			writechunk: null,
			writeencoding: null
		};
		this._readableState.needReadable = true;
		this._readableState.sync = false;
		if (options) {
			if (typeof options.transform === "function") this._transform = options.transform;
			if (typeof options.flush === "function") this._flush = options.flush;
		}
		this.on("prefinish", prefinish);
	}
	function prefinish() {
		var _this = this;
		if (typeof this._flush === "function") this._flush(function(er, data) {
			done(_this, er, data);
		});
		else done(this, null, null);
	}
	Transform.prototype.push = function(chunk, encoding) {
		this._transformState.needTransform = false;
		return Duplex.prototype.push.call(this, chunk, encoding);
	};
	Transform.prototype._transform = function(chunk, encoding, cb) {
		throw new Error("_transform() is not implemented");
	};
	Transform.prototype._write = function(chunk, encoding, cb) {
		var ts = this._transformState;
		ts.writecb = cb;
		ts.writechunk = chunk;
		ts.writeencoding = encoding;
		if (!ts.transforming) {
			var rs = this._readableState;
			if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
		}
	};
	Transform.prototype._read = function(n) {
		var ts = this._transformState;
		if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
			ts.transforming = true;
			this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
		} else ts.needTransform = true;
	};
	Transform.prototype._destroy = function(err, cb) {
		var _this2 = this;
		Duplex.prototype._destroy.call(this, err, function(err2) {
			cb(err2);
			_this2.emit("close");
		});
	};
	function done(stream, er, data) {
		if (er) return stream.emit("error", er);
		if (data != null) stream.push(data);
		if (stream._writableState.length) throw new Error("Calling transform done when ws.length != 0");
		if (stream._transformState.transforming) throw new Error("Calling transform done when still transforming");
		return stream.push(null);
	}
}));
//#endregion
//#region node_modules/readable-stream/lib/_stream_passthrough.js
var require__stream_passthrough = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = PassThrough;
	var Transform = require__stream_transform();
	var util = Object.create(require_util());
	util.inherits = require_inherits();
	util.inherits(PassThrough, Transform);
	function PassThrough(options) {
		if (!(this instanceof PassThrough)) return new PassThrough(options);
		Transform.call(this, options);
	}
	PassThrough.prototype._transform = function(chunk, encoding, cb) {
		cb(null, chunk);
	};
}));
//#endregion
//#region node_modules/readable-stream/readable.js
var require_readable = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var Stream = require("stream");
	if (process.env.READABLE_STREAM === "disable" && Stream) {
		module.exports = Stream;
		exports = module.exports = Stream.Readable;
		exports.Readable = Stream.Readable;
		exports.Writable = Stream.Writable;
		exports.Duplex = Stream.Duplex;
		exports.Transform = Stream.Transform;
		exports.PassThrough = Stream.PassThrough;
		exports.Stream = Stream;
	} else {
		exports = module.exports = require__stream_readable();
		exports.Stream = Stream || exports;
		exports.Readable = exports;
		exports.Writable = require__stream_writable();
		exports.Duplex = require__stream_duplex();
		exports.Transform = require__stream_transform();
		exports.PassThrough = require__stream_passthrough();
	}
}));
//#endregion
//#region node_modules/jszip/lib/support.js
var require_support = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.base64 = true;
	exports.array = true;
	exports.string = true;
	exports.arraybuffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
	exports.nodebuffer = typeof Buffer !== "undefined";
	exports.uint8array = typeof Uint8Array !== "undefined";
	if (typeof ArrayBuffer === "undefined") exports.blob = false;
	else {
		var buffer = /* @__PURE__ */ new ArrayBuffer(0);
		try {
			exports.blob = new Blob([buffer], { type: "application/zip" }).size === 0;
		} catch (e) {
			try {
				var builder = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
				builder.append(buffer);
				exports.blob = builder.getBlob("application/zip").size === 0;
			} catch (e) {
				exports.blob = false;
			}
		}
	}
	try {
		exports.nodestream = !!require_readable().Readable;
	} catch (e) {
		exports.nodestream = false;
	}
}));
//#endregion
//#region node_modules/jszip/lib/base64.js
var require_base64 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var utils = require_utils();
	var support = require_support();
	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	exports.encode = function(input) {
		var output = [];
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0, len = input.length, remainingBytes = len;
		var isArray = utils.getTypeOf(input) !== "string";
		while (i < input.length) {
			remainingBytes = len - i;
			if (!isArray) {
				chr1 = input.charCodeAt(i++);
				chr2 = i < len ? input.charCodeAt(i++) : 0;
				chr3 = i < len ? input.charCodeAt(i++) : 0;
			} else {
				chr1 = input[i++];
				chr2 = i < len ? input[i++] : 0;
				chr3 = i < len ? input[i++] : 0;
			}
			enc1 = chr1 >> 2;
			enc2 = (chr1 & 3) << 4 | chr2 >> 4;
			enc3 = remainingBytes > 1 ? (chr2 & 15) << 2 | chr3 >> 6 : 64;
			enc4 = remainingBytes > 2 ? chr3 & 63 : 64;
			output.push(_keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4));
		}
		return output.join("");
	};
	exports.decode = function(input) {
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0, resultIndex = 0;
		var dataUrlPrefix = "data:";
		if (input.substr(0, dataUrlPrefix.length) === dataUrlPrefix) throw new Error("Invalid base64 input, it looks like a data url.");
		input = input.replace(/[^A-Za-z0-9+/=]/g, "");
		var totalLength = input.length * 3 / 4;
		if (input.charAt(input.length - 1) === _keyStr.charAt(64)) totalLength--;
		if (input.charAt(input.length - 2) === _keyStr.charAt(64)) totalLength--;
		if (totalLength % 1 !== 0) throw new Error("Invalid base64 input, bad content length.");
		var output;
		if (support.uint8array) output = new Uint8Array(totalLength | 0);
		else output = new Array(totalLength | 0);
		while (i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = enc1 << 2 | enc2 >> 4;
			chr2 = (enc2 & 15) << 4 | enc3 >> 2;
			chr3 = (enc3 & 3) << 6 | enc4;
			output[resultIndex++] = chr1;
			if (enc3 !== 64) output[resultIndex++] = chr2;
			if (enc4 !== 64) output[resultIndex++] = chr3;
		}
		return output;
	};
}));
//#endregion
//#region node_modules/jszip/lib/nodejsUtils.js
var require_nodejsUtils = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = {
		isNode: typeof Buffer !== "undefined",
		newBufferFrom: function(data, encoding) {
			if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(data, encoding);
			else {
				if (typeof data === "number") throw new Error("The \"data\" argument must not be a number");
				return new Buffer(data, encoding);
			}
		},
		allocBuffer: function(size) {
			if (Buffer.alloc) return Buffer.alloc(size);
			else {
				var buf = new Buffer(size);
				buf.fill(0);
				return buf;
			}
		},
		isBuffer: function(b) {
			return Buffer.isBuffer(b);
		},
		isStream: function(obj) {
			return obj && typeof obj.on === "function" && typeof obj.pause === "function" && typeof obj.resume === "function";
		}
	};
}));
//#endregion
//#region node_modules/immediate/lib/index.js
var require_lib$5 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var Mutation = global.MutationObserver || global.WebKitMutationObserver;
	var scheduleDrain;
	if (process.browser) if (Mutation) {
		var called = 0;
		var observer = new Mutation(nextTick);
		var element = global.document.createTextNode("");
		observer.observe(element, { characterData: true });
		scheduleDrain = function() {
			element.data = called = ++called % 2;
		};
	} else if (!global.setImmediate && typeof global.MessageChannel !== "undefined") {
		var channel = new global.MessageChannel();
		channel.port1.onmessage = nextTick;
		scheduleDrain = function() {
			channel.port2.postMessage(0);
		};
	} else if ("document" in global && "onreadystatechange" in global.document.createElement("script")) scheduleDrain = function() {
		var scriptEl = global.document.createElement("script");
		scriptEl.onreadystatechange = function() {
			nextTick();
			scriptEl.onreadystatechange = null;
			scriptEl.parentNode.removeChild(scriptEl);
			scriptEl = null;
		};
		global.document.documentElement.appendChild(scriptEl);
	};
	else scheduleDrain = function() {
		setTimeout(nextTick, 0);
	};
	else scheduleDrain = function() {
		process.nextTick(nextTick);
	};
	var draining;
	var queue = [];
	function nextTick() {
		draining = true;
		var i, oldQueue;
		var len = queue.length;
		while (len) {
			oldQueue = queue;
			queue = [];
			i = -1;
			while (++i < len) oldQueue[i]();
			len = queue.length;
		}
		draining = false;
	}
	module.exports = immediate;
	function immediate(task) {
		if (queue.push(task) === 1 && !draining) scheduleDrain();
	}
}));
//#endregion
//#region node_modules/lie/lib/index.js
var require_lib$4 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var immediate = require_lib$5();
	/* istanbul ignore next */
	function INTERNAL() {}
	var handlers = {};
	var REJECTED = ["REJECTED"];
	var FULFILLED = ["FULFILLED"];
	var PENDING = ["PENDING"];
	/* istanbul ignore else */
	if (!process.browser) var UNHANDLED = ["UNHANDLED"];
	module.exports = Promise;
	function Promise(resolver) {
		if (typeof resolver !== "function") throw new TypeError("resolver must be a function");
		this.state = PENDING;
		this.queue = [];
		this.outcome = void 0;
		/* istanbul ignore else */
		if (!process.browser) this.handled = UNHANDLED;
		if (resolver !== INTERNAL) safelyResolveThenable(this, resolver);
	}
	Promise.prototype.finally = function(callback) {
		if (typeof callback !== "function") return this;
		var p = this.constructor;
		return this.then(resolve, reject);
		function resolve(value) {
			function yes() {
				return value;
			}
			return p.resolve(callback()).then(yes);
		}
		function reject(reason) {
			function no() {
				throw reason;
			}
			return p.resolve(callback()).then(no);
		}
	};
	Promise.prototype.catch = function(onRejected) {
		return this.then(null, onRejected);
	};
	Promise.prototype.then = function(onFulfilled, onRejected) {
		if (typeof onFulfilled !== "function" && this.state === FULFILLED || typeof onRejected !== "function" && this.state === REJECTED) return this;
		var promise = new this.constructor(INTERNAL);
		/* istanbul ignore else */
		if (!process.browser) {
			if (this.handled === UNHANDLED) this.handled = null;
		}
		if (this.state !== PENDING) unwrap(promise, this.state === FULFILLED ? onFulfilled : onRejected, this.outcome);
		else this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
		return promise;
	};
	function QueueItem(promise, onFulfilled, onRejected) {
		this.promise = promise;
		if (typeof onFulfilled === "function") {
			this.onFulfilled = onFulfilled;
			this.callFulfilled = this.otherCallFulfilled;
		}
		if (typeof onRejected === "function") {
			this.onRejected = onRejected;
			this.callRejected = this.otherCallRejected;
		}
	}
	QueueItem.prototype.callFulfilled = function(value) {
		handlers.resolve(this.promise, value);
	};
	QueueItem.prototype.otherCallFulfilled = function(value) {
		unwrap(this.promise, this.onFulfilled, value);
	};
	QueueItem.prototype.callRejected = function(value) {
		handlers.reject(this.promise, value);
	};
	QueueItem.prototype.otherCallRejected = function(value) {
		unwrap(this.promise, this.onRejected, value);
	};
	function unwrap(promise, func, value) {
		immediate(function() {
			var returnValue;
			try {
				returnValue = func(value);
			} catch (e) {
				return handlers.reject(promise, e);
			}
			if (returnValue === promise) handlers.reject(promise, /* @__PURE__ */ new TypeError("Cannot resolve promise with itself"));
			else handlers.resolve(promise, returnValue);
		});
	}
	handlers.resolve = function(self, value) {
		var result = tryCatch(getThen, value);
		if (result.status === "error") return handlers.reject(self, result.value);
		var thenable = result.value;
		if (thenable) safelyResolveThenable(self, thenable);
		else {
			self.state = FULFILLED;
			self.outcome = value;
			var i = -1;
			var len = self.queue.length;
			while (++i < len) self.queue[i].callFulfilled(value);
		}
		return self;
	};
	handlers.reject = function(self, error) {
		self.state = REJECTED;
		self.outcome = error;
		/* istanbul ignore else */
		if (!process.browser) {
			if (self.handled === UNHANDLED) immediate(function() {
				if (self.handled === UNHANDLED) process.emit("unhandledRejection", error, self);
			});
		}
		var i = -1;
		var len = self.queue.length;
		while (++i < len) self.queue[i].callRejected(error);
		return self;
	};
	function getThen(obj) {
		var then = obj && obj.then;
		if (obj && (typeof obj === "object" || typeof obj === "function") && typeof then === "function") return function appyThen() {
			then.apply(obj, arguments);
		};
	}
	function safelyResolveThenable(self, thenable) {
		var called = false;
		function onError(value) {
			if (called) return;
			called = true;
			handlers.reject(self, value);
		}
		function onSuccess(value) {
			if (called) return;
			called = true;
			handlers.resolve(self, value);
		}
		function tryToUnwrap() {
			thenable(onSuccess, onError);
		}
		var result = tryCatch(tryToUnwrap);
		if (result.status === "error") onError(result.value);
	}
	function tryCatch(func, value) {
		var out = {};
		try {
			out.value = func(value);
			out.status = "success";
		} catch (e) {
			out.status = "error";
			out.value = e;
		}
		return out;
	}
	Promise.resolve = resolve;
	function resolve(value) {
		if (value instanceof this) return value;
		return handlers.resolve(new this(INTERNAL), value);
	}
	Promise.reject = reject;
	function reject(reason) {
		var promise = new this(INTERNAL);
		return handlers.reject(promise, reason);
	}
	Promise.all = all;
	function all(iterable) {
		var self = this;
		if (Object.prototype.toString.call(iterable) !== "[object Array]") return this.reject(/* @__PURE__ */ new TypeError("must be an array"));
		var len = iterable.length;
		var called = false;
		if (!len) return this.resolve([]);
		var values = new Array(len);
		var resolved = 0;
		var i = -1;
		var promise = new this(INTERNAL);
		while (++i < len) allResolver(iterable[i], i);
		return promise;
		function allResolver(value, i) {
			self.resolve(value).then(resolveFromAll, function(error) {
				if (!called) {
					called = true;
					handlers.reject(promise, error);
				}
			});
			function resolveFromAll(outValue) {
				values[i] = outValue;
				if (++resolved === len && !called) {
					called = true;
					handlers.resolve(promise, values);
				}
			}
		}
	}
	Promise.race = race;
	function race(iterable) {
		var self = this;
		if (Object.prototype.toString.call(iterable) !== "[object Array]") return this.reject(/* @__PURE__ */ new TypeError("must be an array"));
		var len = iterable.length;
		var called = false;
		if (!len) return this.resolve([]);
		var i = -1;
		var promise = new this(INTERNAL);
		while (++i < len) resolver(iterable[i]);
		return promise;
		function resolver(value) {
			self.resolve(value).then(function(response) {
				if (!called) {
					called = true;
					handlers.resolve(promise, response);
				}
			}, function(error) {
				if (!called) {
					called = true;
					handlers.reject(promise, error);
				}
			});
		}
	}
}));
//#endregion
//#region node_modules/jszip/lib/external.js
var require_external = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var ES6Promise = null;
	if (typeof Promise !== "undefined") ES6Promise = Promise;
	else ES6Promise = require_lib$4();
	/**
	* Let the user use/change some implementations.
	*/
	module.exports = { Promise: ES6Promise };
}));
//#endregion
//#region node_modules/setimmediate/setImmediate.js
var require_setImmediate = /* @__PURE__ */ require_chunk.__commonJSMin((() => {
	(function(global, undefined) {
		"use strict";
		if (global.setImmediate) return;
		var nextHandle = 1;
		var tasksByHandle = {};
		var currentlyRunningATask = false;
		var doc = global.document;
		var registerImmediate;
		function setImmediate(callback) {
			if (typeof callback !== "function") callback = new Function("" + callback);
			var args = new Array(arguments.length - 1);
			for (var i = 0; i < args.length; i++) args[i] = arguments[i + 1];
			tasksByHandle[nextHandle] = {
				callback,
				args
			};
			registerImmediate(nextHandle);
			return nextHandle++;
		}
		function clearImmediate(handle) {
			delete tasksByHandle[handle];
		}
		function run(task) {
			var callback = task.callback;
			var args = task.args;
			switch (args.length) {
				case 0:
					callback();
					break;
				case 1:
					callback(args[0]);
					break;
				case 2:
					callback(args[0], args[1]);
					break;
				case 3:
					callback(args[0], args[1], args[2]);
					break;
				default:
					callback.apply(undefined, args);
					break;
			}
		}
		function runIfPresent(handle) {
			if (currentlyRunningATask) setTimeout(runIfPresent, 0, handle);
			else {
				var task = tasksByHandle[handle];
				if (task) {
					currentlyRunningATask = true;
					try {
						run(task);
					} finally {
						clearImmediate(handle);
						currentlyRunningATask = false;
					}
				}
			}
		}
		function installNextTickImplementation() {
			registerImmediate = function(handle) {
				process.nextTick(function() {
					runIfPresent(handle);
				});
			};
		}
		function canUsePostMessage() {
			if (global.postMessage && !global.importScripts) {
				var postMessageIsAsynchronous = true;
				var oldOnMessage = global.onmessage;
				global.onmessage = function() {
					postMessageIsAsynchronous = false;
				};
				global.postMessage("", "*");
				global.onmessage = oldOnMessage;
				return postMessageIsAsynchronous;
			}
		}
		function installPostMessageImplementation() {
			var messagePrefix = "setImmediate$" + Math.random() + "$";
			var onGlobalMessage = function(event) {
				if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) runIfPresent(+event.data.slice(messagePrefix.length));
			};
			if (global.addEventListener) global.addEventListener("message", onGlobalMessage, false);
			else global.attachEvent("onmessage", onGlobalMessage);
			registerImmediate = function(handle) {
				global.postMessage(messagePrefix + handle, "*");
			};
		}
		function installMessageChannelImplementation() {
			var channel = new MessageChannel();
			channel.port1.onmessage = function(event) {
				var handle = event.data;
				runIfPresent(handle);
			};
			registerImmediate = function(handle) {
				channel.port2.postMessage(handle);
			};
		}
		function installReadyStateChangeImplementation() {
			var html = doc.documentElement;
			registerImmediate = function(handle) {
				var script = doc.createElement("script");
				script.onreadystatechange = function() {
					runIfPresent(handle);
					script.onreadystatechange = null;
					html.removeChild(script);
					script = null;
				};
				html.appendChild(script);
			};
		}
		function installSetTimeoutImplementation() {
			registerImmediate = function(handle) {
				setTimeout(runIfPresent, 0, handle);
			};
		}
		var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
		attachTo = attachTo && attachTo.setTimeout ? attachTo : global;
		if ({}.toString.call(global.process) === "[object process]") installNextTickImplementation();
		else if (canUsePostMessage()) installPostMessageImplementation();
		else if (global.MessageChannel) installMessageChannelImplementation();
		else if (doc && "onreadystatechange" in doc.createElement("script")) installReadyStateChangeImplementation();
		else installSetTimeoutImplementation();
		attachTo.setImmediate = setImmediate;
		attachTo.clearImmediate = clearImmediate;
	})(typeof self === "undefined" ? typeof global === "undefined" ? void 0 : global : self);
}));
//#endregion
//#region node_modules/jszip/lib/utils.js
var require_utils = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var support = require_support();
	var base64 = require_base64();
	var nodejsUtils = require_nodejsUtils();
	var external = require_external();
	require_setImmediate();
	/**
	* Convert a string that pass as a "binary string": it should represent a byte
	* array but may have > 255 char codes. Be sure to take only the first byte
	* and returns the byte array.
	* @param {String} str the string to transform.
	* @return {Array|Uint8Array} the string in a binary format.
	*/
	function string2binary(str) {
		var result = null;
		if (support.uint8array) result = new Uint8Array(str.length);
		else result = new Array(str.length);
		return stringToArrayLike(str, result);
	}
	/**
	* Create a new blob with the given content and the given type.
	* @param {String|ArrayBuffer} part the content to put in the blob. DO NOT use
	* an Uint8Array because the stock browser of android 4 won't accept it (it
	* will be silently converted to a string, "[object Uint8Array]").
	*
	* Use only ONE part to build the blob to avoid a memory leak in IE11 / Edge:
	* when a large amount of Array is used to create the Blob, the amount of
	* memory consumed is nearly 100 times the original data amount.
	*
	* @param {String} type the mime type of the blob.
	* @return {Blob} the created blob.
	*/
	exports.newBlob = function(part, type) {
		exports.checkSupport("blob");
		try {
			return new Blob([part], { type });
		} catch (e) {
			try {
				var builder = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
				builder.append(part);
				return builder.getBlob(type);
			} catch (e) {
				throw new Error("Bug : can't construct the Blob.");
			}
		}
	};
	/**
	* The identity function.
	* @param {Object} input the input.
	* @return {Object} the same input.
	*/
	function identity(input) {
		return input;
	}
	/**
	* Fill in an array with a string.
	* @param {String} str the string to use.
	* @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to fill in (will be mutated).
	* @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated array.
	*/
	function stringToArrayLike(str, array) {
		for (var i = 0; i < str.length; ++i) array[i] = str.charCodeAt(i) & 255;
		return array;
	}
	/**
	* An helper for the function arrayLikeToString.
	* This contains static information and functions that
	* can be optimized by the browser JIT compiler.
	*/
	var arrayToStringHelper = {
		stringifyByChunk: function(array, type, chunk) {
			var result = [], k = 0, len = array.length;
			if (len <= chunk) return String.fromCharCode.apply(null, array);
			while (k < len) {
				if (type === "array" || type === "nodebuffer") result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));
				else result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));
				k += chunk;
			}
			return result.join("");
		},
		stringifyByChar: function(array) {
			var resultStr = "";
			for (var i = 0; i < array.length; i++) resultStr += String.fromCharCode(array[i]);
			return resultStr;
		},
		applyCanBeUsed: {
			uint8array: (function() {
				try {
					return support.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
				} catch (e) {
					return false;
				}
			})(),
			nodebuffer: (function() {
				try {
					return support.nodebuffer && String.fromCharCode.apply(null, nodejsUtils.allocBuffer(1)).length === 1;
				} catch (e) {
					return false;
				}
			})()
		}
	};
	/**
	* Transform an array-like object to a string.
	* @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
	* @return {String} the result.
	*/
	function arrayLikeToString(array) {
		var chunk = 65536, type = exports.getTypeOf(array), canUseApply = true;
		if (type === "uint8array") canUseApply = arrayToStringHelper.applyCanBeUsed.uint8array;
		else if (type === "nodebuffer") canUseApply = arrayToStringHelper.applyCanBeUsed.nodebuffer;
		if (canUseApply) while (chunk > 1) try {
			return arrayToStringHelper.stringifyByChunk(array, type, chunk);
		} catch (e) {
			chunk = Math.floor(chunk / 2);
		}
		return arrayToStringHelper.stringifyByChar(array);
	}
	exports.applyFromCharCode = arrayLikeToString;
	/**
	* Copy the data from an array-like to an other array-like.
	* @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayFrom the origin array.
	* @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayTo the destination array which will be mutated.
	* @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated destination array.
	*/
	function arrayLikeToArrayLike(arrayFrom, arrayTo) {
		for (var i = 0; i < arrayFrom.length; i++) arrayTo[i] = arrayFrom[i];
		return arrayTo;
	}
	var transform = {};
	transform["string"] = {
		"string": identity,
		"array": function(input) {
			return stringToArrayLike(input, new Array(input.length));
		},
		"arraybuffer": function(input) {
			return transform["string"]["uint8array"](input).buffer;
		},
		"uint8array": function(input) {
			return stringToArrayLike(input, new Uint8Array(input.length));
		},
		"nodebuffer": function(input) {
			return stringToArrayLike(input, nodejsUtils.allocBuffer(input.length));
		}
	};
	transform["array"] = {
		"string": arrayLikeToString,
		"array": identity,
		"arraybuffer": function(input) {
			return new Uint8Array(input).buffer;
		},
		"uint8array": function(input) {
			return new Uint8Array(input);
		},
		"nodebuffer": function(input) {
			return nodejsUtils.newBufferFrom(input);
		}
	};
	transform["arraybuffer"] = {
		"string": function(input) {
			return arrayLikeToString(new Uint8Array(input));
		},
		"array": function(input) {
			return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));
		},
		"arraybuffer": identity,
		"uint8array": function(input) {
			return new Uint8Array(input);
		},
		"nodebuffer": function(input) {
			return nodejsUtils.newBufferFrom(new Uint8Array(input));
		}
	};
	transform["uint8array"] = {
		"string": arrayLikeToString,
		"array": function(input) {
			return arrayLikeToArrayLike(input, new Array(input.length));
		},
		"arraybuffer": function(input) {
			return input.buffer;
		},
		"uint8array": identity,
		"nodebuffer": function(input) {
			return nodejsUtils.newBufferFrom(input);
		}
	};
	transform["nodebuffer"] = {
		"string": arrayLikeToString,
		"array": function(input) {
			return arrayLikeToArrayLike(input, new Array(input.length));
		},
		"arraybuffer": function(input) {
			return transform["nodebuffer"]["uint8array"](input).buffer;
		},
		"uint8array": function(input) {
			return arrayLikeToArrayLike(input, new Uint8Array(input.length));
		},
		"nodebuffer": identity
	};
	/**
	* Transform an input into any type.
	* The supported output type are : string, array, uint8array, arraybuffer, nodebuffer.
	* If no output type is specified, the unmodified input will be returned.
	* @param {String} outputType the output type.
	* @param {String|Array|ArrayBuffer|Uint8Array|Buffer} input the input to convert.
	* @throws {Error} an Error if the browser doesn't support the requested output type.
	*/
	exports.transformTo = function(outputType, input) {
		if (!input) input = "";
		if (!outputType) return input;
		exports.checkSupport(outputType);
		return transform[exports.getTypeOf(input)][outputType](input);
	};
	/**
	* Resolve all relative path components, "." and "..", in a path. If these relative components
	* traverse above the root then the resulting path will only contain the final path component.
	*
	* All empty components, e.g. "//", are removed.
	* @param {string} path A path with / or \ separators
	* @returns {string} The path with all relative path components resolved.
	*/
	exports.resolve = function(path) {
		var parts = path.split("/");
		var result = [];
		for (var index = 0; index < parts.length; index++) {
			var part = parts[index];
			if (part === "." || part === "" && index !== 0 && index !== parts.length - 1) continue;
			else if (part === "..") result.pop();
			else result.push(part);
		}
		return result.join("/");
	};
	/**
	* Return the type of the input.
	* The type will be in a format valid for JSZip.utils.transformTo : string, array, uint8array, arraybuffer.
	* @param {Object} input the input to identify.
	* @return {String} the (lowercase) type of the input.
	*/
	exports.getTypeOf = function(input) {
		if (typeof input === "string") return "string";
		if (Object.prototype.toString.call(input) === "[object Array]") return "array";
		if (support.nodebuffer && nodejsUtils.isBuffer(input)) return "nodebuffer";
		if (support.uint8array && input instanceof Uint8Array) return "uint8array";
		if (support.arraybuffer && input instanceof ArrayBuffer) return "arraybuffer";
	};
	/**
	* Throw an exception if the type is not supported.
	* @param {String} type the type to check.
	* @throws {Error} an Error if the browser doesn't support the requested type.
	*/
	exports.checkSupport = function(type) {
		if (!support[type.toLowerCase()]) throw new Error(type + " is not supported by this platform");
	};
	exports.MAX_VALUE_16BITS = 65535;
	exports.MAX_VALUE_32BITS = -1;
	/**
	* Prettify a string read as binary.
	* @param {string} str the string to prettify.
	* @return {string} a pretty string.
	*/
	exports.pretty = function(str) {
		var res = "", code, i;
		for (i = 0; i < (str || "").length; i++) {
			code = str.charCodeAt(i);
			res += "\\x" + (code < 16 ? "0" : "") + code.toString(16).toUpperCase();
		}
		return res;
	};
	/**
	* Defer the call of a function.
	* @param {Function} callback the function to call asynchronously.
	* @param {Array} args the arguments to give to the callback.
	*/
	exports.delay = function(callback, args, self) {
		setImmediate(function() {
			callback.apply(self || null, args || []);
		});
	};
	/**
	* Extends a prototype with an other, without calling a constructor with
	* side effects. Inspired by nodejs' `utils.inherits`
	* @param {Function} ctor the constructor to augment
	* @param {Function} superCtor the parent constructor to use
	*/
	exports.inherits = function(ctor, superCtor) {
		var Obj = function() {};
		Obj.prototype = superCtor.prototype;
		ctor.prototype = new Obj();
	};
	/**
	* Merge the objects passed as parameters into a new one.
	* @private
	* @param {...Object} var_args All objects to merge.
	* @return {Object} a new object with the data of the others.
	*/
	exports.extend = function() {
		var result = {}, i, attr;
		for (i = 0; i < arguments.length; i++) for (attr in arguments[i]) if (Object.prototype.hasOwnProperty.call(arguments[i], attr) && typeof result[attr] === "undefined") result[attr] = arguments[i][attr];
		return result;
	};
	/**
	* Transform arbitrary content into a Promise.
	* @param {String} name a name for the content being processed.
	* @param {Object} inputData the content to process.
	* @param {Boolean} isBinary true if the content is not an unicode string
	* @param {Boolean} isOptimizedBinaryString true if the string content only has one byte per character.
	* @param {Boolean} isBase64 true if the string content is encoded with base64.
	* @return {Promise} a promise in a format usable by JSZip.
	*/
	exports.prepareContent = function(name, inputData, isBinary, isOptimizedBinaryString, isBase64) {
		return external.Promise.resolve(inputData).then(function(data) {
			if (support.blob && (data instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(data)) !== -1) && typeof FileReader !== "undefined") return new external.Promise(function(resolve, reject) {
				var reader = new FileReader();
				reader.onload = function(e) {
					resolve(e.target.result);
				};
				reader.onerror = function(e) {
					reject(e.target.error);
				};
				reader.readAsArrayBuffer(data);
			});
			else return data;
		}).then(function(data) {
			var dataType = exports.getTypeOf(data);
			if (!dataType) return external.Promise.reject(/* @__PURE__ */ new Error("Can't read the data of '" + name + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
			if (dataType === "arraybuffer") data = exports.transformTo("uint8array", data);
			else if (dataType === "string") {
				if (isBase64) data = base64.decode(data);
				else if (isBinary) {
					if (isOptimizedBinaryString !== true) data = string2binary(data);
				}
			}
			return data;
		});
	};
}));
//#endregion
//#region node_modules/jszip/lib/stream/GenericWorker.js
var require_GenericWorker = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	/**
	* A worker that does nothing but passing chunks to the next one. This is like
	* a nodejs stream but with some differences. On the good side :
	* - it works on IE 6-9 without any issue / polyfill
	* - it weights less than the full dependencies bundled with browserify
	* - it forwards errors (no need to declare an error handler EVERYWHERE)
	*
	* A chunk is an object with 2 attributes : `meta` and `data`. The former is an
	* object containing anything (`percent` for example), see each worker for more
	* details. The latter is the real data (String, Uint8Array, etc).
	*
	* @constructor
	* @param {String} name the name of the stream (mainly used for debugging purposes)
	*/
	function GenericWorker(name) {
		this.name = name || "default";
		this.streamInfo = {};
		this.generatedError = null;
		this.extraStreamInfo = {};
		this.isPaused = true;
		this.isFinished = false;
		this.isLocked = false;
		this._listeners = {
			"data": [],
			"end": [],
			"error": []
		};
		this.previous = null;
	}
	GenericWorker.prototype = {
		push: function(chunk) {
			this.emit("data", chunk);
		},
		end: function() {
			if (this.isFinished) return false;
			this.flush();
			try {
				this.emit("end");
				this.cleanUp();
				this.isFinished = true;
			} catch (e) {
				this.emit("error", e);
			}
			return true;
		},
		error: function(e) {
			if (this.isFinished) return false;
			if (this.isPaused) this.generatedError = e;
			else {
				this.isFinished = true;
				this.emit("error", e);
				if (this.previous) this.previous.error(e);
				this.cleanUp();
			}
			return true;
		},
		on: function(name, listener) {
			this._listeners[name].push(listener);
			return this;
		},
		cleanUp: function() {
			this.streamInfo = this.generatedError = this.extraStreamInfo = null;
			this._listeners = [];
		},
		emit: function(name, arg) {
			if (this._listeners[name]) for (var i = 0; i < this._listeners[name].length; i++) this._listeners[name][i].call(this, arg);
		},
		pipe: function(next) {
			return next.registerPrevious(this);
		},
		registerPrevious: function(previous) {
			if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
			this.streamInfo = previous.streamInfo;
			this.mergeStreamInfo();
			this.previous = previous;
			var self = this;
			previous.on("data", function(chunk) {
				self.processChunk(chunk);
			});
			previous.on("end", function() {
				self.end();
			});
			previous.on("error", function(e) {
				self.error(e);
			});
			return this;
		},
		pause: function() {
			if (this.isPaused || this.isFinished) return false;
			this.isPaused = true;
			if (this.previous) this.previous.pause();
			return true;
		},
		resume: function() {
			if (!this.isPaused || this.isFinished) return false;
			this.isPaused = false;
			var withError = false;
			if (this.generatedError) {
				this.error(this.generatedError);
				withError = true;
			}
			if (this.previous) this.previous.resume();
			return !withError;
		},
		flush: function() {},
		processChunk: function(chunk) {
			this.push(chunk);
		},
		withStreamInfo: function(key, value) {
			this.extraStreamInfo[key] = value;
			this.mergeStreamInfo();
			return this;
		},
		mergeStreamInfo: function() {
			for (var key in this.extraStreamInfo) {
				if (!Object.prototype.hasOwnProperty.call(this.extraStreamInfo, key)) continue;
				this.streamInfo[key] = this.extraStreamInfo[key];
			}
		},
		lock: function() {
			if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
			this.isLocked = true;
			if (this.previous) this.previous.lock();
		},
		toString: function() {
			var me = "Worker " + this.name;
			if (this.previous) return this.previous + " -> " + me;
			else return me;
		}
	};
	module.exports = GenericWorker;
}));
//#endregion
//#region node_modules/jszip/lib/utf8.js
var require_utf8 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var utils = require_utils();
	var support = require_support();
	var nodejsUtils = require_nodejsUtils();
	var GenericWorker = require_GenericWorker();
	/**
	* The following functions come from pako, from pako/lib/utils/strings
	* released under the MIT license, see pako https://github.com/nodeca/pako/
	*/
	var _utf8len = new Array(256);
	for (var i = 0; i < 256; i++) _utf8len[i] = i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1;
	_utf8len[254] = _utf8len[254] = 1;
	var string2buf = function(str) {
		var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
		for (m_pos = 0; m_pos < str_len; m_pos++) {
			c = str.charCodeAt(m_pos);
			if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
				c2 = str.charCodeAt(m_pos + 1);
				if ((c2 & 64512) === 56320) {
					c = 65536 + (c - 55296 << 10) + (c2 - 56320);
					m_pos++;
				}
			}
			buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
		}
		if (support.uint8array) buf = new Uint8Array(buf_len);
		else buf = new Array(buf_len);
		for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
			c = str.charCodeAt(m_pos);
			if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
				c2 = str.charCodeAt(m_pos + 1);
				if ((c2 & 64512) === 56320) {
					c = 65536 + (c - 55296 << 10) + (c2 - 56320);
					m_pos++;
				}
			}
			if (c < 128) buf[i++] = c;
			else if (c < 2048) {
				buf[i++] = 192 | c >>> 6;
				buf[i++] = 128 | c & 63;
			} else if (c < 65536) {
				buf[i++] = 224 | c >>> 12;
				buf[i++] = 128 | c >>> 6 & 63;
				buf[i++] = 128 | c & 63;
			} else {
				buf[i++] = 240 | c >>> 18;
				buf[i++] = 128 | c >>> 12 & 63;
				buf[i++] = 128 | c >>> 6 & 63;
				buf[i++] = 128 | c & 63;
			}
		}
		return buf;
	};
	var utf8border = function(buf, max) {
		var pos;
		max = max || buf.length;
		if (max > buf.length) max = buf.length;
		pos = max - 1;
		while (pos >= 0 && (buf[pos] & 192) === 128) pos--;
		if (pos < 0) return max;
		if (pos === 0) return max;
		return pos + _utf8len[buf[pos]] > max ? pos : max;
	};
	var buf2string = function(buf) {
		var i, out, c, c_len;
		var len = buf.length;
		var utf16buf = new Array(len * 2);
		for (out = 0, i = 0; i < len;) {
			c = buf[i++];
			if (c < 128) {
				utf16buf[out++] = c;
				continue;
			}
			c_len = _utf8len[c];
			if (c_len > 4) {
				utf16buf[out++] = 65533;
				i += c_len - 1;
				continue;
			}
			c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
			while (c_len > 1 && i < len) {
				c = c << 6 | buf[i++] & 63;
				c_len--;
			}
			if (c_len > 1) {
				utf16buf[out++] = 65533;
				continue;
			}
			if (c < 65536) utf16buf[out++] = c;
			else {
				c -= 65536;
				utf16buf[out++] = 55296 | c >> 10 & 1023;
				utf16buf[out++] = 56320 | c & 1023;
			}
		}
		if (utf16buf.length !== out) if (utf16buf.subarray) utf16buf = utf16buf.subarray(0, out);
		else utf16buf.length = out;
		return utils.applyFromCharCode(utf16buf);
	};
	/**
	* Transform a javascript string into an array (typed if possible) of bytes,
	* UTF-8 encoded.
	* @param {String} str the string to encode
	* @return {Array|Uint8Array|Buffer} the UTF-8 encoded string.
	*/
	exports.utf8encode = function utf8encode(str) {
		if (support.nodebuffer) return nodejsUtils.newBufferFrom(str, "utf-8");
		return string2buf(str);
	};
	/**
	* Transform a bytes array (or a representation) representing an UTF-8 encoded
	* string into a javascript string.
	* @param {Array|Uint8Array|Buffer} buf the data de decode
	* @return {String} the decoded string.
	*/
	exports.utf8decode = function utf8decode(buf) {
		if (support.nodebuffer) return utils.transformTo("nodebuffer", buf).toString("utf-8");
		buf = utils.transformTo(support.uint8array ? "uint8array" : "array", buf);
		return buf2string(buf);
	};
	/**
	* A worker to decode utf8 encoded binary chunks into string chunks.
	* @constructor
	*/
	function Utf8DecodeWorker() {
		GenericWorker.call(this, "utf-8 decode");
		this.leftOver = null;
	}
	utils.inherits(Utf8DecodeWorker, GenericWorker);
	/**
	* @see GenericWorker.processChunk
	*/
	Utf8DecodeWorker.prototype.processChunk = function(chunk) {
		var data = utils.transformTo(support.uint8array ? "uint8array" : "array", chunk.data);
		if (this.leftOver && this.leftOver.length) {
			if (support.uint8array) {
				var previousData = data;
				data = new Uint8Array(previousData.length + this.leftOver.length);
				data.set(this.leftOver, 0);
				data.set(previousData, this.leftOver.length);
			} else data = this.leftOver.concat(data);
			this.leftOver = null;
		}
		var nextBoundary = utf8border(data);
		var usableData = data;
		if (nextBoundary !== data.length) if (support.uint8array) {
			usableData = data.subarray(0, nextBoundary);
			this.leftOver = data.subarray(nextBoundary, data.length);
		} else {
			usableData = data.slice(0, nextBoundary);
			this.leftOver = data.slice(nextBoundary, data.length);
		}
		this.push({
			data: exports.utf8decode(usableData),
			meta: chunk.meta
		});
	};
	/**
	* @see GenericWorker.flush
	*/
	Utf8DecodeWorker.prototype.flush = function() {
		if (this.leftOver && this.leftOver.length) {
			this.push({
				data: exports.utf8decode(this.leftOver),
				meta: {}
			});
			this.leftOver = null;
		}
	};
	exports.Utf8DecodeWorker = Utf8DecodeWorker;
	/**
	* A worker to endcode string chunks into utf8 encoded binary chunks.
	* @constructor
	*/
	function Utf8EncodeWorker() {
		GenericWorker.call(this, "utf-8 encode");
	}
	utils.inherits(Utf8EncodeWorker, GenericWorker);
	/**
	* @see GenericWorker.processChunk
	*/
	Utf8EncodeWorker.prototype.processChunk = function(chunk) {
		this.push({
			data: exports.utf8encode(chunk.data),
			meta: chunk.meta
		});
	};
	exports.Utf8EncodeWorker = Utf8EncodeWorker;
}));
//#endregion
//#region node_modules/jszip/lib/stream/ConvertWorker.js
var require_ConvertWorker = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var GenericWorker = require_GenericWorker();
	var utils = require_utils();
	/**
	* A worker which convert chunks to a specified type.
	* @constructor
	* @param {String} destType the destination type.
	*/
	function ConvertWorker(destType) {
		GenericWorker.call(this, "ConvertWorker to " + destType);
		this.destType = destType;
	}
	utils.inherits(ConvertWorker, GenericWorker);
	/**
	* @see GenericWorker.processChunk
	*/
	ConvertWorker.prototype.processChunk = function(chunk) {
		this.push({
			data: utils.transformTo(this.destType, chunk.data),
			meta: chunk.meta
		});
	};
	module.exports = ConvertWorker;
}));
//#endregion
//#region node_modules/jszip/lib/nodejs/NodejsStreamOutputAdapter.js
var require_NodejsStreamOutputAdapter = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var Readable = require_readable().Readable;
	require_utils().inherits(NodejsStreamOutputAdapter, Readable);
	/**
	* A nodejs stream using a worker as source.
	* @see the SourceWrapper in http://nodejs.org/api/stream.html
	* @constructor
	* @param {StreamHelper} helper the helper wrapping the worker
	* @param {Object} options the nodejs stream options
	* @param {Function} updateCb the update callback.
	*/
	function NodejsStreamOutputAdapter(helper, options, updateCb) {
		Readable.call(this, options);
		this._helper = helper;
		var self = this;
		helper.on("data", function(data, meta) {
			if (!self.push(data)) self._helper.pause();
			if (updateCb) updateCb(meta);
		}).on("error", function(e) {
			self.emit("error", e);
		}).on("end", function() {
			self.push(null);
		});
	}
	NodejsStreamOutputAdapter.prototype._read = function() {
		this._helper.resume();
	};
	module.exports = NodejsStreamOutputAdapter;
}));
//#endregion
//#region node_modules/jszip/lib/stream/StreamHelper.js
var require_StreamHelper = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var utils = require_utils();
	var ConvertWorker = require_ConvertWorker();
	var GenericWorker = require_GenericWorker();
	var base64 = require_base64();
	var support = require_support();
	var external = require_external();
	var NodejsStreamOutputAdapter = null;
	if (support.nodestream) try {
		NodejsStreamOutputAdapter = require_NodejsStreamOutputAdapter();
	} catch (e) {}
	/**
	* Apply the final transformation of the data. If the user wants a Blob for
	* example, it's easier to work with an U8intArray and finally do the
	* ArrayBuffer/Blob conversion.
	* @param {String} type the name of the final type
	* @param {String|Uint8Array|Buffer} content the content to transform
	* @param {String} mimeType the mime type of the content, if applicable.
	* @return {String|Uint8Array|ArrayBuffer|Buffer|Blob} the content in the right format.
	*/
	function transformZipOutput(type, content, mimeType) {
		switch (type) {
			case "blob": return utils.newBlob(utils.transformTo("arraybuffer", content), mimeType);
			case "base64": return base64.encode(content);
			default: return utils.transformTo(type, content);
		}
	}
	/**
	* Concatenate an array of data of the given type.
	* @param {String} type the type of the data in the given array.
	* @param {Array} dataArray the array containing the data chunks to concatenate
	* @return {String|Uint8Array|Buffer} the concatenated data
	* @throws Error if the asked type is unsupported
	*/
	function concat(type, dataArray) {
		var i, index = 0, res = null, totalLength = 0;
		for (i = 0; i < dataArray.length; i++) totalLength += dataArray[i].length;
		switch (type) {
			case "string": return dataArray.join("");
			case "array": return Array.prototype.concat.apply([], dataArray);
			case "uint8array":
				res = new Uint8Array(totalLength);
				for (i = 0; i < dataArray.length; i++) {
					res.set(dataArray[i], index);
					index += dataArray[i].length;
				}
				return res;
			case "nodebuffer": return Buffer.concat(dataArray);
			default: throw new Error("concat : unsupported type '" + type + "'");
		}
	}
	/**
	* Listen a StreamHelper, accumulate its content and concatenate it into a
	* complete block.
	* @param {StreamHelper} helper the helper to use.
	* @param {Function} updateCallback a callback called on each update. Called
	* with one arg :
	* - the metadata linked to the update received.
	* @return Promise the promise for the accumulation.
	*/
	function accumulate(helper, updateCallback) {
		return new external.Promise(function(resolve, reject) {
			var dataArray = [];
			var chunkType = helper._internalType, resultType = helper._outputType, mimeType = helper._mimeType;
			helper.on("data", function(data, meta) {
				dataArray.push(data);
				if (updateCallback) updateCallback(meta);
			}).on("error", function(err) {
				dataArray = [];
				reject(err);
			}).on("end", function() {
				try {
					resolve(transformZipOutput(resultType, concat(chunkType, dataArray), mimeType));
				} catch (e) {
					reject(e);
				}
				dataArray = [];
			}).resume();
		});
	}
	/**
	* An helper to easily use workers outside of JSZip.
	* @constructor
	* @param {Worker} worker the worker to wrap
	* @param {String} outputType the type of data expected by the use
	* @param {String} mimeType the mime type of the content, if applicable.
	*/
	function StreamHelper(worker, outputType, mimeType) {
		var internalType = outputType;
		switch (outputType) {
			case "blob":
			case "arraybuffer":
				internalType = "uint8array";
				break;
			case "base64":
				internalType = "string";
				break;
		}
		try {
			this._internalType = internalType;
			this._outputType = outputType;
			this._mimeType = mimeType;
			utils.checkSupport(internalType);
			this._worker = worker.pipe(new ConvertWorker(internalType));
			worker.lock();
		} catch (e) {
			this._worker = new GenericWorker("error");
			this._worker.error(e);
		}
	}
	StreamHelper.prototype = {
		accumulate: function(updateCb) {
			return accumulate(this, updateCb);
		},
		on: function(evt, fn) {
			var self = this;
			if (evt === "data") this._worker.on(evt, function(chunk) {
				fn.call(self, chunk.data, chunk.meta);
			});
			else this._worker.on(evt, function() {
				utils.delay(fn, arguments, self);
			});
			return this;
		},
		resume: function() {
			utils.delay(this._worker.resume, [], this._worker);
			return this;
		},
		pause: function() {
			this._worker.pause();
			return this;
		},
		toNodejsStream: function(updateCb) {
			utils.checkSupport("nodestream");
			if (this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
			return new NodejsStreamOutputAdapter(this, { objectMode: this._outputType !== "nodebuffer" }, updateCb);
		}
	};
	module.exports = StreamHelper;
}));
//#endregion
//#region node_modules/jszip/lib/defaults.js
var require_defaults = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.base64 = false;
	exports.binary = false;
	exports.dir = false;
	exports.createFolders = true;
	exports.date = null;
	exports.compression = null;
	exports.compressionOptions = null;
	exports.comment = null;
	exports.unixPermissions = null;
	exports.dosPermissions = null;
}));
//#endregion
//#region node_modules/jszip/lib/stream/DataWorker.js
var require_DataWorker = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var utils = require_utils();
	var GenericWorker = require_GenericWorker();
	var DEFAULT_BLOCK_SIZE = 16 * 1024;
	/**
	* A worker that reads a content and emits chunks.
	* @constructor
	* @param {Promise} dataP the promise of the data to split
	*/
	function DataWorker(dataP) {
		GenericWorker.call(this, "DataWorker");
		var self = this;
		this.dataIsReady = false;
		this.index = 0;
		this.max = 0;
		this.data = null;
		this.type = "";
		this._tickScheduled = false;
		dataP.then(function(data) {
			self.dataIsReady = true;
			self.data = data;
			self.max = data && data.length || 0;
			self.type = utils.getTypeOf(data);
			if (!self.isPaused) self._tickAndRepeat();
		}, function(e) {
			self.error(e);
		});
	}
	utils.inherits(DataWorker, GenericWorker);
	/**
	* @see GenericWorker.cleanUp
	*/
	DataWorker.prototype.cleanUp = function() {
		GenericWorker.prototype.cleanUp.call(this);
		this.data = null;
	};
	/**
	* @see GenericWorker.resume
	*/
	DataWorker.prototype.resume = function() {
		if (!GenericWorker.prototype.resume.call(this)) return false;
		if (!this._tickScheduled && this.dataIsReady) {
			this._tickScheduled = true;
			utils.delay(this._tickAndRepeat, [], this);
		}
		return true;
	};
	/**
	* Trigger a tick a schedule an other call to this function.
	*/
	DataWorker.prototype._tickAndRepeat = function() {
		this._tickScheduled = false;
		if (this.isPaused || this.isFinished) return;
		this._tick();
		if (!this.isFinished) {
			utils.delay(this._tickAndRepeat, [], this);
			this._tickScheduled = true;
		}
	};
	/**
	* Read and push a chunk.
	*/
	DataWorker.prototype._tick = function() {
		if (this.isPaused || this.isFinished) return false;
		var size = DEFAULT_BLOCK_SIZE;
		var data = null, nextIndex = Math.min(this.max, this.index + size);
		if (this.index >= this.max) return this.end();
		else {
			switch (this.type) {
				case "string":
					data = this.data.substring(this.index, nextIndex);
					break;
				case "uint8array":
					data = this.data.subarray(this.index, nextIndex);
					break;
				case "array":
				case "nodebuffer":
					data = this.data.slice(this.index, nextIndex);
					break;
			}
			this.index = nextIndex;
			return this.push({
				data,
				meta: { percent: this.max ? this.index / this.max * 100 : 0 }
			});
		}
	};
	module.exports = DataWorker;
}));
//#endregion
//#region node_modules/jszip/lib/crc32.js
var require_crc32$1 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var utils = require_utils();
	/**
	* The following functions come from pako, from pako/lib/zlib/crc32.js
	* released under the MIT license, see pako https://github.com/nodeca/pako/
	*/
	function makeTable() {
		var c, table = [];
		for (var n = 0; n < 256; n++) {
			c = n;
			for (var k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
			table[n] = c;
		}
		return table;
	}
	var crcTable = makeTable();
	function crc32(crc, buf, len, pos) {
		var t = crcTable, end = pos + len;
		crc = crc ^ -1;
		for (var i = pos; i < end; i++) crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
		return crc ^ -1;
	}
	/**
	* Compute the crc32 of a string.
	* This is almost the same as the function crc32, but for strings. Using the
	* same function for the two use cases leads to horrible performances.
	* @param {Number} crc the starting value of the crc.
	* @param {String} str the string to use.
	* @param {Number} len the length of the string.
	* @param {Number} pos the starting position for the crc32 computation.
	* @return {Number} the computed crc32.
	*/
	function crc32str(crc, str, len, pos) {
		var t = crcTable, end = pos + len;
		crc = crc ^ -1;
		for (var i = pos; i < end; i++) crc = crc >>> 8 ^ t[(crc ^ str.charCodeAt(i)) & 255];
		return crc ^ -1;
	}
	module.exports = function crc32wrapper(input, crc) {
		if (typeof input === "undefined" || !input.length) return 0;
		if (utils.getTypeOf(input) !== "string") return crc32(crc | 0, input, input.length, 0);
		else return crc32str(crc | 0, input, input.length, 0);
	};
}));
//#endregion
//#region node_modules/jszip/lib/stream/Crc32Probe.js
var require_Crc32Probe = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var GenericWorker = require_GenericWorker();
	var crc32 = require_crc32$1();
	var utils = require_utils();
	/**
	* A worker which calculate the crc32 of the data flowing through.
	* @constructor
	*/
	function Crc32Probe() {
		GenericWorker.call(this, "Crc32Probe");
		this.withStreamInfo("crc32", 0);
	}
	utils.inherits(Crc32Probe, GenericWorker);
	/**
	* @see GenericWorker.processChunk
	*/
	Crc32Probe.prototype.processChunk = function(chunk) {
		this.streamInfo.crc32 = crc32(chunk.data, this.streamInfo.crc32 || 0);
		this.push(chunk);
	};
	module.exports = Crc32Probe;
}));
//#endregion
//#region node_modules/jszip/lib/stream/DataLengthProbe.js
var require_DataLengthProbe = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var utils = require_utils();
	var GenericWorker = require_GenericWorker();
	/**
	* A worker which calculate the total length of the data flowing through.
	* @constructor
	* @param {String} propName the name used to expose the length
	*/
	function DataLengthProbe(propName) {
		GenericWorker.call(this, "DataLengthProbe for " + propName);
		this.propName = propName;
		this.withStreamInfo(propName, 0);
	}
	utils.inherits(DataLengthProbe, GenericWorker);
	/**
	* @see GenericWorker.processChunk
	*/
	DataLengthProbe.prototype.processChunk = function(chunk) {
		if (chunk) {
			var length = this.streamInfo[this.propName] || 0;
			this.streamInfo[this.propName] = length + chunk.data.length;
		}
		GenericWorker.prototype.processChunk.call(this, chunk);
	};
	module.exports = DataLengthProbe;
}));
//#endregion
//#region node_modules/jszip/lib/compressedObject.js
var require_compressedObject = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var external = require_external();
	var DataWorker = require_DataWorker();
	var Crc32Probe = require_Crc32Probe();
	var DataLengthProbe = require_DataLengthProbe();
	/**
	* Represent a compressed object, with everything needed to decompress it.
	* @constructor
	* @param {number} compressedSize the size of the data compressed.
	* @param {number} uncompressedSize the size of the data after decompression.
	* @param {number} crc32 the crc32 of the decompressed file.
	* @param {object} compression the type of compression, see lib/compressions.js.
	* @param {String|ArrayBuffer|Uint8Array|Buffer} data the compressed data.
	*/
	function CompressedObject(compressedSize, uncompressedSize, crc32, compression, data) {
		this.compressedSize = compressedSize;
		this.uncompressedSize = uncompressedSize;
		this.crc32 = crc32;
		this.compression = compression;
		this.compressedContent = data;
	}
	CompressedObject.prototype = {
		getContentWorker: function() {
			var worker = new DataWorker(external.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new DataLengthProbe("data_length"));
			var that = this;
			worker.on("end", function() {
				if (this.streamInfo["data_length"] !== that.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
			});
			return worker;
		},
		getCompressedWorker: function() {
			return new DataWorker(external.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
		}
	};
	/**
	* Chain the given worker with other workers to compress the content with the
	* given compression.
	* @param {GenericWorker} uncompressedWorker the worker to pipe.
	* @param {Object} compression the compression object.
	* @param {Object} compressionOptions the options to use when compressing.
	* @return {GenericWorker} the new worker compressing the content.
	*/
	CompressedObject.createWorkerFrom = function(uncompressedWorker, compression, compressionOptions) {
		return uncompressedWorker.pipe(new Crc32Probe()).pipe(new DataLengthProbe("uncompressedSize")).pipe(compression.compressWorker(compressionOptions)).pipe(new DataLengthProbe("compressedSize")).withStreamInfo("compression", compression);
	};
	module.exports = CompressedObject;
}));
//#endregion
//#region node_modules/jszip/lib/zipObject.js
var require_zipObject = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var StreamHelper = require_StreamHelper();
	var DataWorker = require_DataWorker();
	var utf8 = require_utf8();
	var CompressedObject = require_compressedObject();
	var GenericWorker = require_GenericWorker();
	/**
	* A simple object representing a file in the zip file.
	* @constructor
	* @param {string} name the name of the file
	* @param {String|ArrayBuffer|Uint8Array|Buffer} data the data
	* @param {Object} options the options of the file
	*/
	var ZipObject = function(name, data, options) {
		this.name = name;
		this.dir = options.dir;
		this.date = options.date;
		this.comment = options.comment;
		this.unixPermissions = options.unixPermissions;
		this.dosPermissions = options.dosPermissions;
		this._data = data;
		this._dataBinary = options.binary;
		this.options = {
			compression: options.compression,
			compressionOptions: options.compressionOptions
		};
	};
	ZipObject.prototype = {
		internalStream: function(type) {
			var result = null, outputType = "string";
			try {
				if (!type) throw new Error("No output type specified.");
				outputType = type.toLowerCase();
				var askUnicodeString = outputType === "string" || outputType === "text";
				if (outputType === "binarystring" || outputType === "text") outputType = "string";
				result = this._decompressWorker();
				var isUnicodeString = !this._dataBinary;
				if (isUnicodeString && !askUnicodeString) result = result.pipe(new utf8.Utf8EncodeWorker());
				if (!isUnicodeString && askUnicodeString) result = result.pipe(new utf8.Utf8DecodeWorker());
			} catch (e) {
				result = new GenericWorker("error");
				result.error(e);
			}
			return new StreamHelper(result, outputType, "");
		},
		async: function(type, onUpdate) {
			return this.internalStream(type).accumulate(onUpdate);
		},
		nodeStream: function(type, onUpdate) {
			return this.internalStream(type || "nodebuffer").toNodejsStream(onUpdate);
		},
		_compressWorker: function(compression, compressionOptions) {
			if (this._data instanceof CompressedObject && this._data.compression.magic === compression.magic) return this._data.getCompressedWorker();
			else {
				var result = this._decompressWorker();
				if (!this._dataBinary) result = result.pipe(new utf8.Utf8EncodeWorker());
				return CompressedObject.createWorkerFrom(result, compression, compressionOptions);
			}
		},
		_decompressWorker: function() {
			if (this._data instanceof CompressedObject) return this._data.getContentWorker();
			else if (this._data instanceof GenericWorker) return this._data;
			else return new DataWorker(this._data);
		}
	};
	var removedMethods = [
		"asText",
		"asBinary",
		"asNodeBuffer",
		"asUint8Array",
		"asArrayBuffer"
	];
	var removedFn = function() {
		throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
	};
	for (var i = 0; i < removedMethods.length; i++) ZipObject.prototype[removedMethods[i]] = removedFn;
	module.exports = ZipObject;
}));
//#endregion
//#region node_modules/pako/lib/utils/common.js
var require_common = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var TYPED_OK = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Int32Array !== "undefined";
	function _has(obj, key) {
		return Object.prototype.hasOwnProperty.call(obj, key);
	}
	exports.assign = function(obj) {
		var sources = Array.prototype.slice.call(arguments, 1);
		while (sources.length) {
			var source = sources.shift();
			if (!source) continue;
			if (typeof source !== "object") throw new TypeError(source + "must be non-object");
			for (var p in source) if (_has(source, p)) obj[p] = source[p];
		}
		return obj;
	};
	exports.shrinkBuf = function(buf, size) {
		if (buf.length === size) return buf;
		if (buf.subarray) return buf.subarray(0, size);
		buf.length = size;
		return buf;
	};
	var fnTyped = {
		arraySet: function(dest, src, src_offs, len, dest_offs) {
			if (src.subarray && dest.subarray) {
				dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
				return;
			}
			for (var i = 0; i < len; i++) dest[dest_offs + i] = src[src_offs + i];
		},
		flattenChunks: function(chunks) {
			var i, l, len = 0, pos, chunk, result;
			for (i = 0, l = chunks.length; i < l; i++) len += chunks[i].length;
			result = new Uint8Array(len);
			pos = 0;
			for (i = 0, l = chunks.length; i < l; i++) {
				chunk = chunks[i];
				result.set(chunk, pos);
				pos += chunk.length;
			}
			return result;
		}
	};
	var fnUntyped = {
		arraySet: function(dest, src, src_offs, len, dest_offs) {
			for (var i = 0; i < len; i++) dest[dest_offs + i] = src[src_offs + i];
		},
		flattenChunks: function(chunks) {
			return [].concat.apply([], chunks);
		}
	};
	exports.setTyped = function(on) {
		if (on) {
			exports.Buf8 = Uint8Array;
			exports.Buf16 = Uint16Array;
			exports.Buf32 = Int32Array;
			exports.assign(exports, fnTyped);
		} else {
			exports.Buf8 = Array;
			exports.Buf16 = Array;
			exports.Buf32 = Array;
			exports.assign(exports, fnUntyped);
		}
	};
	exports.setTyped(TYPED_OK);
}));
//#endregion
//#region node_modules/pako/lib/zlib/trees.js
var require_trees = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var utils = require_common();
	var Z_FIXED = 4;
	var Z_BINARY = 0;
	var Z_TEXT = 1;
	var Z_UNKNOWN = 2;
	function zero(buf) {
		var len = buf.length;
		while (--len >= 0) buf[len] = 0;
	}
	var STORED_BLOCK = 0;
	var STATIC_TREES = 1;
	var DYN_TREES = 2;
	var MIN_MATCH = 3;
	var MAX_MATCH = 258;
	var LENGTH_CODES = 29;
	var LITERALS = 256;
	var L_CODES = LITERALS + 1 + LENGTH_CODES;
	var D_CODES = 30;
	var BL_CODES = 19;
	var HEAP_SIZE = 2 * L_CODES + 1;
	var MAX_BITS = 15;
	var Buf_size = 16;
	var MAX_BL_BITS = 7;
	var END_BLOCK = 256;
	var REP_3_6 = 16;
	var REPZ_3_10 = 17;
	var REPZ_11_138 = 18;
	var extra_lbits = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		2,
		2,
		2,
		2,
		3,
		3,
		3,
		3,
		4,
		4,
		4,
		4,
		5,
		5,
		5,
		5,
		0
	];
	var extra_dbits = [
		0,
		0,
		0,
		0,
		1,
		1,
		2,
		2,
		3,
		3,
		4,
		4,
		5,
		5,
		6,
		6,
		7,
		7,
		8,
		8,
		9,
		9,
		10,
		10,
		11,
		11,
		12,
		12,
		13,
		13
	];
	var extra_blbits = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		2,
		3,
		7
	];
	var bl_order = [
		16,
		17,
		18,
		0,
		8,
		7,
		9,
		6,
		10,
		5,
		11,
		4,
		12,
		3,
		13,
		2,
		14,
		1,
		15
	];
	var DIST_CODE_LEN = 512;
	var static_ltree = new Array((L_CODES + 2) * 2);
	zero(static_ltree);
	var static_dtree = new Array(D_CODES * 2);
	zero(static_dtree);
	var _dist_code = new Array(DIST_CODE_LEN);
	zero(_dist_code);
	var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
	zero(_length_code);
	var base_length = new Array(LENGTH_CODES);
	zero(base_length);
	var base_dist = new Array(D_CODES);
	zero(base_dist);
	function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
		this.static_tree = static_tree;
		this.extra_bits = extra_bits;
		this.extra_base = extra_base;
		this.elems = elems;
		this.max_length = max_length;
		this.has_stree = static_tree && static_tree.length;
	}
	var static_l_desc;
	var static_d_desc;
	var static_bl_desc;
	function TreeDesc(dyn_tree, stat_desc) {
		this.dyn_tree = dyn_tree;
		this.max_code = 0;
		this.stat_desc = stat_desc;
	}
	function d_code(dist) {
		return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
	}
	function put_short(s, w) {
		s.pending_buf[s.pending++] = w & 255;
		s.pending_buf[s.pending++] = w >>> 8 & 255;
	}
	function send_bits(s, value, length) {
		if (s.bi_valid > Buf_size - length) {
			s.bi_buf |= value << s.bi_valid & 65535;
			put_short(s, s.bi_buf);
			s.bi_buf = value >> Buf_size - s.bi_valid;
			s.bi_valid += length - Buf_size;
		} else {
			s.bi_buf |= value << s.bi_valid & 65535;
			s.bi_valid += length;
		}
	}
	function send_code(s, c, tree) {
		send_bits(s, tree[c * 2], tree[c * 2 + 1]);
	}
	function bi_reverse(code, len) {
		var res = 0;
		do {
			res |= code & 1;
			code >>>= 1;
			res <<= 1;
		} while (--len > 0);
		return res >>> 1;
	}
	function bi_flush(s) {
		if (s.bi_valid === 16) {
			put_short(s, s.bi_buf);
			s.bi_buf = 0;
			s.bi_valid = 0;
		} else if (s.bi_valid >= 8) {
			s.pending_buf[s.pending++] = s.bi_buf & 255;
			s.bi_buf >>= 8;
			s.bi_valid -= 8;
		}
	}
	function gen_bitlen(s, desc) {
		var tree = desc.dyn_tree;
		var max_code = desc.max_code;
		var stree = desc.stat_desc.static_tree;
		var has_stree = desc.stat_desc.has_stree;
		var extra = desc.stat_desc.extra_bits;
		var base = desc.stat_desc.extra_base;
		var max_length = desc.stat_desc.max_length;
		var h;
		var n, m;
		var bits;
		var xbits;
		var f;
		var overflow = 0;
		for (bits = 0; bits <= MAX_BITS; bits++) s.bl_count[bits] = 0;
		tree[s.heap[s.heap_max] * 2 + 1] = 0;
		for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
			n = s.heap[h];
			bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
			if (bits > max_length) {
				bits = max_length;
				overflow++;
			}
			tree[n * 2 + 1] = bits;
			if (n > max_code) continue;
			s.bl_count[bits]++;
			xbits = 0;
			if (n >= base) xbits = extra[n - base];
			f = tree[n * 2];
			s.opt_len += f * (bits + xbits);
			if (has_stree) s.static_len += f * (stree[n * 2 + 1] + xbits);
		}
		if (overflow === 0) return;
		do {
			bits = max_length - 1;
			while (s.bl_count[bits] === 0) bits--;
			s.bl_count[bits]--;
			s.bl_count[bits + 1] += 2;
			s.bl_count[max_length]--;
			overflow -= 2;
		} while (overflow > 0);
		for (bits = max_length; bits !== 0; bits--) {
			n = s.bl_count[bits];
			while (n !== 0) {
				m = s.heap[--h];
				if (m > max_code) continue;
				if (tree[m * 2 + 1] !== bits) {
					s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
					tree[m * 2 + 1] = bits;
				}
				n--;
			}
		}
	}
	function gen_codes(tree, max_code, bl_count) {
		var next_code = new Array(MAX_BITS + 1);
		var code = 0;
		var bits;
		var n;
		for (bits = 1; bits <= MAX_BITS; bits++) next_code[bits] = code = code + bl_count[bits - 1] << 1;
		for (n = 0; n <= max_code; n++) {
			var len = tree[n * 2 + 1];
			if (len === 0) continue;
			tree[n * 2] = bi_reverse(next_code[len]++, len);
		}
	}
	function tr_static_init() {
		var n;
		var bits;
		var length;
		var code;
		var dist;
		var bl_count = new Array(MAX_BITS + 1);
		length = 0;
		for (code = 0; code < LENGTH_CODES - 1; code++) {
			base_length[code] = length;
			for (n = 0; n < 1 << extra_lbits[code]; n++) _length_code[length++] = code;
		}
		_length_code[length - 1] = code;
		dist = 0;
		for (code = 0; code < 16; code++) {
			base_dist[code] = dist;
			for (n = 0; n < 1 << extra_dbits[code]; n++) _dist_code[dist++] = code;
		}
		dist >>= 7;
		for (; code < D_CODES; code++) {
			base_dist[code] = dist << 7;
			for (n = 0; n < 1 << extra_dbits[code] - 7; n++) _dist_code[256 + dist++] = code;
		}
		for (bits = 0; bits <= MAX_BITS; bits++) bl_count[bits] = 0;
		n = 0;
		while (n <= 143) {
			static_ltree[n * 2 + 1] = 8;
			n++;
			bl_count[8]++;
		}
		while (n <= 255) {
			static_ltree[n * 2 + 1] = 9;
			n++;
			bl_count[9]++;
		}
		while (n <= 279) {
			static_ltree[n * 2 + 1] = 7;
			n++;
			bl_count[7]++;
		}
		while (n <= 287) {
			static_ltree[n * 2 + 1] = 8;
			n++;
			bl_count[8]++;
		}
		gen_codes(static_ltree, L_CODES + 1, bl_count);
		for (n = 0; n < D_CODES; n++) {
			static_dtree[n * 2 + 1] = 5;
			static_dtree[n * 2] = bi_reverse(n, 5);
		}
		static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
		static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
		static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
	}
	function init_block(s) {
		var n;
		for (n = 0; n < L_CODES; n++) s.dyn_ltree[n * 2] = 0;
		for (n = 0; n < D_CODES; n++) s.dyn_dtree[n * 2] = 0;
		for (n = 0; n < BL_CODES; n++) s.bl_tree[n * 2] = 0;
		s.dyn_ltree[END_BLOCK * 2] = 1;
		s.opt_len = s.static_len = 0;
		s.last_lit = s.matches = 0;
	}
	function bi_windup(s) {
		if (s.bi_valid > 8) put_short(s, s.bi_buf);
		else if (s.bi_valid > 0) s.pending_buf[s.pending++] = s.bi_buf;
		s.bi_buf = 0;
		s.bi_valid = 0;
	}
	function copy_block(s, buf, len, header) {
		bi_windup(s);
		if (header) {
			put_short(s, len);
			put_short(s, ~len);
		}
		utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
		s.pending += len;
	}
	function smaller(tree, n, m, depth) {
		var _n2 = n * 2;
		var _m2 = m * 2;
		return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
	}
	function pqdownheap(s, tree, k) {
		var v = s.heap[k];
		var j = k << 1;
		while (j <= s.heap_len) {
			if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) j++;
			if (smaller(tree, v, s.heap[j], s.depth)) break;
			s.heap[k] = s.heap[j];
			k = j;
			j <<= 1;
		}
		s.heap[k] = v;
	}
	function compress_block(s, ltree, dtree) {
		var dist;
		var lc;
		var lx = 0;
		var code;
		var extra;
		if (s.last_lit !== 0) do {
			dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
			lc = s.pending_buf[s.l_buf + lx];
			lx++;
			if (dist === 0) send_code(s, lc, ltree);
			else {
				code = _length_code[lc];
				send_code(s, code + LITERALS + 1, ltree);
				extra = extra_lbits[code];
				if (extra !== 0) {
					lc -= base_length[code];
					send_bits(s, lc, extra);
				}
				dist--;
				code = d_code(dist);
				send_code(s, code, dtree);
				extra = extra_dbits[code];
				if (extra !== 0) {
					dist -= base_dist[code];
					send_bits(s, dist, extra);
				}
			}
		} while (lx < s.last_lit);
		send_code(s, END_BLOCK, ltree);
	}
	function build_tree(s, desc) {
		var tree = desc.dyn_tree;
		var stree = desc.stat_desc.static_tree;
		var has_stree = desc.stat_desc.has_stree;
		var elems = desc.stat_desc.elems;
		var n, m;
		var max_code = -1;
		var node;
		s.heap_len = 0;
		s.heap_max = HEAP_SIZE;
		for (n = 0; n < elems; n++) if (tree[n * 2] !== 0) {
			s.heap[++s.heap_len] = max_code = n;
			s.depth[n] = 0;
		} else tree[n * 2 + 1] = 0;
		while (s.heap_len < 2) {
			node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
			tree[node * 2] = 1;
			s.depth[node] = 0;
			s.opt_len--;
			if (has_stree) s.static_len -= stree[node * 2 + 1];
		}
		desc.max_code = max_code;
		for (n = s.heap_len >> 1; n >= 1; n--) pqdownheap(s, tree, n);
		node = elems;
		do {
			/*** pqremove ***/
			n = s.heap[1];
			s.heap[1] = s.heap[s.heap_len--];
			pqdownheap(s, tree, 1);
			m = s.heap[1];
			s.heap[--s.heap_max] = n;
			s.heap[--s.heap_max] = m;
			tree[node * 2] = tree[n * 2] + tree[m * 2];
			s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
			tree[n * 2 + 1] = tree[m * 2 + 1] = node;
			s.heap[1] = node++;
			pqdownheap(s, tree, 1);
		} while (s.heap_len >= 2);
		s.heap[--s.heap_max] = s.heap[1];
		gen_bitlen(s, desc);
		gen_codes(tree, max_code, s.bl_count);
	}
	function scan_tree(s, tree, max_code) {
		var n;
		var prevlen = -1;
		var curlen;
		var nextlen = tree[1];
		var count = 0;
		var max_count = 7;
		var min_count = 4;
		if (nextlen === 0) {
			max_count = 138;
			min_count = 3;
		}
		tree[(max_code + 1) * 2 + 1] = 65535;
		for (n = 0; n <= max_code; n++) {
			curlen = nextlen;
			nextlen = tree[(n + 1) * 2 + 1];
			if (++count < max_count && curlen === nextlen) continue;
			else if (count < min_count) s.bl_tree[curlen * 2] += count;
			else if (curlen !== 0) {
				if (curlen !== prevlen) s.bl_tree[curlen * 2]++;
				s.bl_tree[REP_3_6 * 2]++;
			} else if (count <= 10) s.bl_tree[REPZ_3_10 * 2]++;
			else s.bl_tree[REPZ_11_138 * 2]++;
			count = 0;
			prevlen = curlen;
			if (nextlen === 0) {
				max_count = 138;
				min_count = 3;
			} else if (curlen === nextlen) {
				max_count = 6;
				min_count = 3;
			} else {
				max_count = 7;
				min_count = 4;
			}
		}
	}
	function send_tree(s, tree, max_code) {
		var n;
		var prevlen = -1;
		var curlen;
		var nextlen = tree[1];
		var count = 0;
		var max_count = 7;
		var min_count = 4;
		if (nextlen === 0) {
			max_count = 138;
			min_count = 3;
		}
		for (n = 0; n <= max_code; n++) {
			curlen = nextlen;
			nextlen = tree[(n + 1) * 2 + 1];
			if (++count < max_count && curlen === nextlen) continue;
			else if (count < min_count) do
				send_code(s, curlen, s.bl_tree);
			while (--count !== 0);
			else if (curlen !== 0) {
				if (curlen !== prevlen) {
					send_code(s, curlen, s.bl_tree);
					count--;
				}
				send_code(s, REP_3_6, s.bl_tree);
				send_bits(s, count - 3, 2);
			} else if (count <= 10) {
				send_code(s, REPZ_3_10, s.bl_tree);
				send_bits(s, count - 3, 3);
			} else {
				send_code(s, REPZ_11_138, s.bl_tree);
				send_bits(s, count - 11, 7);
			}
			count = 0;
			prevlen = curlen;
			if (nextlen === 0) {
				max_count = 138;
				min_count = 3;
			} else if (curlen === nextlen) {
				max_count = 6;
				min_count = 3;
			} else {
				max_count = 7;
				min_count = 4;
			}
		}
	}
	function build_bl_tree(s) {
		var max_blindex;
		scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
		scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
		build_tree(s, s.bl_desc);
		for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) break;
		s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
		return max_blindex;
	}
	function send_all_trees(s, lcodes, dcodes, blcodes) {
		var rank;
		send_bits(s, lcodes - 257, 5);
		send_bits(s, dcodes - 1, 5);
		send_bits(s, blcodes - 4, 4);
		for (rank = 0; rank < blcodes; rank++) send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3);
		send_tree(s, s.dyn_ltree, lcodes - 1);
		send_tree(s, s.dyn_dtree, dcodes - 1);
	}
	function detect_data_type(s) {
		var black_mask = 4093624447;
		var n;
		for (n = 0; n <= 31; n++, black_mask >>>= 1) if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0) return Z_BINARY;
		if (s.dyn_ltree[18] !== 0 || s.dyn_ltree[20] !== 0 || s.dyn_ltree[26] !== 0) return Z_TEXT;
		for (n = 32; n < LITERALS; n++) if (s.dyn_ltree[n * 2] !== 0) return Z_TEXT;
		return Z_BINARY;
	}
	var static_init_done = false;
	function _tr_init(s) {
		if (!static_init_done) {
			tr_static_init();
			static_init_done = true;
		}
		s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
		s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
		s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
		s.bi_buf = 0;
		s.bi_valid = 0;
		init_block(s);
	}
	function _tr_stored_block(s, buf, stored_len, last) {
		send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
		copy_block(s, buf, stored_len, true);
	}
	function _tr_align(s) {
		send_bits(s, STATIC_TREES << 1, 3);
		send_code(s, END_BLOCK, static_ltree);
		bi_flush(s);
	}
	function _tr_flush_block(s, buf, stored_len, last) {
		var opt_lenb, static_lenb;
		var max_blindex = 0;
		if (s.level > 0) {
			if (s.strm.data_type === Z_UNKNOWN) s.strm.data_type = detect_data_type(s);
			build_tree(s, s.l_desc);
			build_tree(s, s.d_desc);
			max_blindex = build_bl_tree(s);
			opt_lenb = s.opt_len + 3 + 7 >>> 3;
			static_lenb = s.static_len + 3 + 7 >>> 3;
			if (static_lenb <= opt_lenb) opt_lenb = static_lenb;
		} else opt_lenb = static_lenb = stored_len + 5;
		if (stored_len + 4 <= opt_lenb && buf !== -1) _tr_stored_block(s, buf, stored_len, last);
		else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
			send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
			compress_block(s, static_ltree, static_dtree);
		} else {
			send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
			send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
			compress_block(s, s.dyn_ltree, s.dyn_dtree);
		}
		init_block(s);
		if (last) bi_windup(s);
	}
	function _tr_tally(s, dist, lc) {
		s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 255;
		s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 255;
		s.pending_buf[s.l_buf + s.last_lit] = lc & 255;
		s.last_lit++;
		if (dist === 0) s.dyn_ltree[lc * 2]++;
		else {
			s.matches++;
			dist--;
			s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
			s.dyn_dtree[d_code(dist) * 2]++;
		}
		return s.last_lit === s.lit_bufsize - 1;
	}
	exports._tr_init = _tr_init;
	exports._tr_stored_block = _tr_stored_block;
	exports._tr_flush_block = _tr_flush_block;
	exports._tr_tally = _tr_tally;
	exports._tr_align = _tr_align;
}));
//#endregion
//#region node_modules/pako/lib/zlib/adler32.js
var require_adler32 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	function adler32(adler, buf, len, pos) {
		var s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
		while (len !== 0) {
			n = len > 2e3 ? 2e3 : len;
			len -= n;
			do {
				s1 = s1 + buf[pos++] | 0;
				s2 = s2 + s1 | 0;
			} while (--n);
			s1 %= 65521;
			s2 %= 65521;
		}
		return s1 | s2 << 16 | 0;
	}
	module.exports = adler32;
}));
//#endregion
//#region node_modules/pako/lib/zlib/crc32.js
var require_crc32 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	function makeTable() {
		var c, table = [];
		for (var n = 0; n < 256; n++) {
			c = n;
			for (var k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
			table[n] = c;
		}
		return table;
	}
	var crcTable = makeTable();
	function crc32(crc, buf, len, pos) {
		var t = crcTable, end = pos + len;
		crc ^= -1;
		for (var i = pos; i < end; i++) crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
		return crc ^ -1;
	}
	module.exports = crc32;
}));
//#endregion
//#region node_modules/pako/lib/zlib/messages.js
var require_messages = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = {
		2: "need dictionary",
		1: "stream end",
		0: "",
		"-1": "file error",
		"-2": "stream error",
		"-3": "data error",
		"-4": "insufficient memory",
		"-5": "buffer error",
		"-6": "incompatible version"
	};
}));
//#endregion
//#region node_modules/pako/lib/zlib/deflate.js
var require_deflate$1 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var utils = require_common();
	var trees = require_trees();
	var adler32 = require_adler32();
	var crc32 = require_crc32();
	var msg = require_messages();
	var Z_NO_FLUSH = 0;
	var Z_PARTIAL_FLUSH = 1;
	var Z_FULL_FLUSH = 3;
	var Z_FINISH = 4;
	var Z_BLOCK = 5;
	var Z_OK = 0;
	var Z_STREAM_END = 1;
	var Z_STREAM_ERROR = -2;
	var Z_DATA_ERROR = -3;
	var Z_BUF_ERROR = -5;
	var Z_DEFAULT_COMPRESSION = -1;
	var Z_FILTERED = 1;
	var Z_HUFFMAN_ONLY = 2;
	var Z_RLE = 3;
	var Z_FIXED = 4;
	var Z_DEFAULT_STRATEGY = 0;
	var Z_UNKNOWN = 2;
	var Z_DEFLATED = 8;
	var MAX_MEM_LEVEL = 9;
	var MAX_WBITS = 15;
	var DEF_MEM_LEVEL = 8;
	var L_CODES = 286;
	var D_CODES = 30;
	var BL_CODES = 19;
	var HEAP_SIZE = 2 * L_CODES + 1;
	var MAX_BITS = 15;
	var MIN_MATCH = 3;
	var MAX_MATCH = 258;
	var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
	var PRESET_DICT = 32;
	var INIT_STATE = 42;
	var EXTRA_STATE = 69;
	var NAME_STATE = 73;
	var COMMENT_STATE = 91;
	var HCRC_STATE = 103;
	var BUSY_STATE = 113;
	var FINISH_STATE = 666;
	var BS_NEED_MORE = 1;
	var BS_BLOCK_DONE = 2;
	var BS_FINISH_STARTED = 3;
	var BS_FINISH_DONE = 4;
	var OS_CODE = 3;
	function err(strm, errorCode) {
		strm.msg = msg[errorCode];
		return errorCode;
	}
	function rank(f) {
		return (f << 1) - (f > 4 ? 9 : 0);
	}
	function zero(buf) {
		var len = buf.length;
		while (--len >= 0) buf[len] = 0;
	}
	function flush_pending(strm) {
		var s = strm.state;
		var len = s.pending;
		if (len > strm.avail_out) len = strm.avail_out;
		if (len === 0) return;
		utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
		strm.next_out += len;
		s.pending_out += len;
		strm.total_out += len;
		strm.avail_out -= len;
		s.pending -= len;
		if (s.pending === 0) s.pending_out = 0;
	}
	function flush_block_only(s, last) {
		trees._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
		s.block_start = s.strstart;
		flush_pending(s.strm);
	}
	function put_byte(s, b) {
		s.pending_buf[s.pending++] = b;
	}
	function putShortMSB(s, b) {
		s.pending_buf[s.pending++] = b >>> 8 & 255;
		s.pending_buf[s.pending++] = b & 255;
	}
	function read_buf(strm, buf, start, size) {
		var len = strm.avail_in;
		if (len > size) len = size;
		if (len === 0) return 0;
		strm.avail_in -= len;
		utils.arraySet(buf, strm.input, strm.next_in, len, start);
		if (strm.state.wrap === 1) strm.adler = adler32(strm.adler, buf, len, start);
		else if (strm.state.wrap === 2) strm.adler = crc32(strm.adler, buf, len, start);
		strm.next_in += len;
		strm.total_in += len;
		return len;
	}
	function longest_match(s, cur_match) {
		var chain_length = s.max_chain_length;
		var scan = s.strstart;
		var match;
		var len;
		var best_len = s.prev_length;
		var nice_match = s.nice_match;
		var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
		var _win = s.window;
		var wmask = s.w_mask;
		var prev = s.prev;
		var strend = s.strstart + MAX_MATCH;
		var scan_end1 = _win[scan + best_len - 1];
		var scan_end = _win[scan + best_len];
		if (s.prev_length >= s.good_match) chain_length >>= 2;
		if (nice_match > s.lookahead) nice_match = s.lookahead;
		do {
			match = cur_match;
			if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) continue;
			scan += 2;
			match++;
			do			;
while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
			len = MAX_MATCH - (strend - scan);
			scan = strend - MAX_MATCH;
			if (len > best_len) {
				s.match_start = cur_match;
				best_len = len;
				if (len >= nice_match) break;
				scan_end1 = _win[scan + best_len - 1];
				scan_end = _win[scan + best_len];
			}
		} while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
		if (best_len <= s.lookahead) return best_len;
		return s.lookahead;
	}
	function fill_window(s) {
		var _w_size = s.w_size;
		var p, n, m, more, str;
		do {
			more = s.window_size - s.lookahead - s.strstart;
			if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
				utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
				s.match_start -= _w_size;
				s.strstart -= _w_size;
				s.block_start -= _w_size;
				n = s.hash_size;
				p = n;
				do {
					m = s.head[--p];
					s.head[p] = m >= _w_size ? m - _w_size : 0;
				} while (--n);
				n = _w_size;
				p = n;
				do {
					m = s.prev[--p];
					s.prev[p] = m >= _w_size ? m - _w_size : 0;
				} while (--n);
				more += _w_size;
			}
			if (s.strm.avail_in === 0) break;
			n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
			s.lookahead += n;
			if (s.lookahead + s.insert >= MIN_MATCH) {
				str = s.strstart - s.insert;
				s.ins_h = s.window[str];
				s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
				while (s.insert) {
					s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
					s.prev[str & s.w_mask] = s.head[s.ins_h];
					s.head[s.ins_h] = str;
					str++;
					s.insert--;
					if (s.lookahead + s.insert < MIN_MATCH) break;
				}
			}
		} while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
	}
	function deflate_stored(s, flush) {
		var max_block_size = 65535;
		if (max_block_size > s.pending_buf_size - 5) max_block_size = s.pending_buf_size - 5;
		for (;;) {
			if (s.lookahead <= 1) {
				fill_window(s);
				if (s.lookahead === 0 && flush === Z_NO_FLUSH) return BS_NEED_MORE;
				if (s.lookahead === 0) break;
			}
			s.strstart += s.lookahead;
			s.lookahead = 0;
			var max_start = s.block_start + max_block_size;
			if (s.strstart === 0 || s.strstart >= max_start) {
				s.lookahead = s.strstart - max_start;
				s.strstart = max_start;
				/*** FLUSH_BLOCK(s, 0); ***/
				flush_block_only(s, false);
				if (s.strm.avail_out === 0) return BS_NEED_MORE;
			}
			if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
				/*** FLUSH_BLOCK(s, 0); ***/
				flush_block_only(s, false);
				if (s.strm.avail_out === 0) return BS_NEED_MORE;
			}
		}
		s.insert = 0;
		if (flush === Z_FINISH) {
			/*** FLUSH_BLOCK(s, 1); ***/
			flush_block_only(s, true);
			if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
			return BS_FINISH_DONE;
		}
		if (s.strstart > s.block_start) {
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) return BS_NEED_MORE;
		}
		return BS_NEED_MORE;
	}
	function deflate_fast(s, flush) {
		var hash_head;
		var bflush;
		for (;;) {
			if (s.lookahead < MIN_LOOKAHEAD) {
				fill_window(s);
				if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) return BS_NEED_MORE;
				if (s.lookahead === 0) break;
			}
			hash_head = 0;
			if (s.lookahead >= MIN_MATCH) {
				/*** INSERT_STRING(s, s.strstart, hash_head); ***/
				s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
				hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
				s.head[s.ins_h] = s.strstart;
			}
			if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) s.match_length = longest_match(s, hash_head);
			if (s.match_length >= MIN_MATCH) {
				/*** _tr_tally_dist(s, s.strstart - s.match_start,
				s.match_length - MIN_MATCH, bflush); ***/
				bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
				s.lookahead -= s.match_length;
				if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
					s.match_length--;
					do {
						s.strstart++;
						/*** INSERT_STRING(s, s.strstart, hash_head); ***/
						s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
						hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
						s.head[s.ins_h] = s.strstart;
					} while (--s.match_length !== 0);
					s.strstart++;
				} else {
					s.strstart += s.match_length;
					s.match_length = 0;
					s.ins_h = s.window[s.strstart];
					s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
				}
			} else {
				/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
				bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
				s.lookahead--;
				s.strstart++;
			}
			if (bflush) {
				/*** FLUSH_BLOCK(s, 0); ***/
				flush_block_only(s, false);
				if (s.strm.avail_out === 0) return BS_NEED_MORE;
			}
		}
		s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
		if (flush === Z_FINISH) {
			/*** FLUSH_BLOCK(s, 1); ***/
			flush_block_only(s, true);
			if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
			return BS_FINISH_DONE;
		}
		if (s.last_lit) {
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) return BS_NEED_MORE;
		}
		return BS_BLOCK_DONE;
	}
	function deflate_slow(s, flush) {
		var hash_head;
		var bflush;
		var max_insert;
		for (;;) {
			if (s.lookahead < MIN_LOOKAHEAD) {
				fill_window(s);
				if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) return BS_NEED_MORE;
				if (s.lookahead === 0) break;
			}
			hash_head = 0;
			if (s.lookahead >= MIN_MATCH) {
				/*** INSERT_STRING(s, s.strstart, hash_head); ***/
				s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
				hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
				s.head[s.ins_h] = s.strstart;
			}
			s.prev_length = s.match_length;
			s.prev_match = s.match_start;
			s.match_length = MIN_MATCH - 1;
			if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
				s.match_length = longest_match(s, hash_head);
				if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) s.match_length = MIN_MATCH - 1;
			}
			if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
				max_insert = s.strstart + s.lookahead - MIN_MATCH;
				/***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
				s.prev_length - MIN_MATCH, bflush);***/
				bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
				s.lookahead -= s.prev_length - 1;
				s.prev_length -= 2;
				do
					if (++s.strstart <= max_insert) {
						/*** INSERT_STRING(s, s.strstart, hash_head); ***/
						s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
						hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
						s.head[s.ins_h] = s.strstart;
					}
				while (--s.prev_length !== 0);
				s.match_available = 0;
				s.match_length = MIN_MATCH - 1;
				s.strstart++;
				if (bflush) {
					/*** FLUSH_BLOCK(s, 0); ***/
					flush_block_only(s, false);
					if (s.strm.avail_out === 0) return BS_NEED_MORE;
				}
			} else if (s.match_available) {
				/*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
				bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
				if (bflush)
 /*** FLUSH_BLOCK_ONLY(s, 0) ***/
				flush_block_only(s, false);
				s.strstart++;
				s.lookahead--;
				if (s.strm.avail_out === 0) return BS_NEED_MORE;
			} else {
				s.match_available = 1;
				s.strstart++;
				s.lookahead--;
			}
		}
		if (s.match_available) {
			/*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
			bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
			s.match_available = 0;
		}
		s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
		if (flush === Z_FINISH) {
			/*** FLUSH_BLOCK(s, 1); ***/
			flush_block_only(s, true);
			if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
			return BS_FINISH_DONE;
		}
		if (s.last_lit) {
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) return BS_NEED_MORE;
		}
		return BS_BLOCK_DONE;
	}
	function deflate_rle(s, flush) {
		var bflush;
		var prev;
		var scan, strend;
		var _win = s.window;
		for (;;) {
			if (s.lookahead <= MAX_MATCH) {
				fill_window(s);
				if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) return BS_NEED_MORE;
				if (s.lookahead === 0) break;
			}
			s.match_length = 0;
			if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
				scan = s.strstart - 1;
				prev = _win[scan];
				if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
					strend = s.strstart + MAX_MATCH;
					do					;
while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
					s.match_length = MAX_MATCH - (strend - scan);
					if (s.match_length > s.lookahead) s.match_length = s.lookahead;
				}
			}
			if (s.match_length >= MIN_MATCH) {
				/*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
				bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);
				s.lookahead -= s.match_length;
				s.strstart += s.match_length;
				s.match_length = 0;
			} else {
				/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
				bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
				s.lookahead--;
				s.strstart++;
			}
			if (bflush) {
				/*** FLUSH_BLOCK(s, 0); ***/
				flush_block_only(s, false);
				if (s.strm.avail_out === 0) return BS_NEED_MORE;
			}
		}
		s.insert = 0;
		if (flush === Z_FINISH) {
			/*** FLUSH_BLOCK(s, 1); ***/
			flush_block_only(s, true);
			if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
			return BS_FINISH_DONE;
		}
		if (s.last_lit) {
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) return BS_NEED_MORE;
		}
		return BS_BLOCK_DONE;
	}
	function deflate_huff(s, flush) {
		var bflush;
		for (;;) {
			if (s.lookahead === 0) {
				fill_window(s);
				if (s.lookahead === 0) {
					if (flush === Z_NO_FLUSH) return BS_NEED_MORE;
					break;
				}
			}
			s.match_length = 0;
			/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
			bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
			s.lookahead--;
			s.strstart++;
			if (bflush) {
				/*** FLUSH_BLOCK(s, 0); ***/
				flush_block_only(s, false);
				if (s.strm.avail_out === 0) return BS_NEED_MORE;
			}
		}
		s.insert = 0;
		if (flush === Z_FINISH) {
			/*** FLUSH_BLOCK(s, 1); ***/
			flush_block_only(s, true);
			if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
			return BS_FINISH_DONE;
		}
		if (s.last_lit) {
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) return BS_NEED_MORE;
		}
		return BS_BLOCK_DONE;
	}
	function Config(good_length, max_lazy, nice_length, max_chain, func) {
		this.good_length = good_length;
		this.max_lazy = max_lazy;
		this.nice_length = nice_length;
		this.max_chain = max_chain;
		this.func = func;
	}
	var configuration_table = [
		new Config(0, 0, 0, 0, deflate_stored),
		new Config(4, 4, 8, 4, deflate_fast),
		new Config(4, 5, 16, 8, deflate_fast),
		new Config(4, 6, 32, 32, deflate_fast),
		new Config(4, 4, 16, 16, deflate_slow),
		new Config(8, 16, 32, 32, deflate_slow),
		new Config(8, 16, 128, 128, deflate_slow),
		new Config(8, 32, 128, 256, deflate_slow),
		new Config(32, 128, 258, 1024, deflate_slow),
		new Config(32, 258, 258, 4096, deflate_slow)
	];
	function lm_init(s) {
		s.window_size = 2 * s.w_size;
		/*** CLEAR_HASH(s); ***/
		zero(s.head);
		s.max_lazy_match = configuration_table[s.level].max_lazy;
		s.good_match = configuration_table[s.level].good_length;
		s.nice_match = configuration_table[s.level].nice_length;
		s.max_chain_length = configuration_table[s.level].max_chain;
		s.strstart = 0;
		s.block_start = 0;
		s.lookahead = 0;
		s.insert = 0;
		s.match_length = s.prev_length = MIN_MATCH - 1;
		s.match_available = 0;
		s.ins_h = 0;
	}
	function DeflateState() {
		this.strm = null;
		this.status = 0;
		this.pending_buf = null;
		this.pending_buf_size = 0;
		this.pending_out = 0;
		this.pending = 0;
		this.wrap = 0;
		this.gzhead = null;
		this.gzindex = 0;
		this.method = Z_DEFLATED;
		this.last_flush = -1;
		this.w_size = 0;
		this.w_bits = 0;
		this.w_mask = 0;
		this.window = null;
		this.window_size = 0;
		this.prev = null;
		this.head = null;
		this.ins_h = 0;
		this.hash_size = 0;
		this.hash_bits = 0;
		this.hash_mask = 0;
		this.hash_shift = 0;
		this.block_start = 0;
		this.match_length = 0;
		this.prev_match = 0;
		this.match_available = 0;
		this.strstart = 0;
		this.match_start = 0;
		this.lookahead = 0;
		this.prev_length = 0;
		this.max_chain_length = 0;
		this.max_lazy_match = 0;
		this.level = 0;
		this.strategy = 0;
		this.good_match = 0;
		this.nice_match = 0;
		this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2);
		this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2);
		this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2);
		zero(this.dyn_ltree);
		zero(this.dyn_dtree);
		zero(this.bl_tree);
		this.l_desc = null;
		this.d_desc = null;
		this.bl_desc = null;
		this.bl_count = new utils.Buf16(MAX_BITS + 1);
		this.heap = new utils.Buf16(2 * L_CODES + 1);
		zero(this.heap);
		this.heap_len = 0;
		this.heap_max = 0;
		this.depth = new utils.Buf16(2 * L_CODES + 1);
		zero(this.depth);
		this.l_buf = 0;
		this.lit_bufsize = 0;
		this.last_lit = 0;
		this.d_buf = 0;
		this.opt_len = 0;
		this.static_len = 0;
		this.matches = 0;
		this.insert = 0;
		this.bi_buf = 0;
		this.bi_valid = 0;
	}
	function deflateResetKeep(strm) {
		var s;
		if (!strm || !strm.state) return err(strm, Z_STREAM_ERROR);
		strm.total_in = strm.total_out = 0;
		strm.data_type = Z_UNKNOWN;
		s = strm.state;
		s.pending = 0;
		s.pending_out = 0;
		if (s.wrap < 0) s.wrap = -s.wrap;
		s.status = s.wrap ? INIT_STATE : BUSY_STATE;
		strm.adler = s.wrap === 2 ? 0 : 1;
		s.last_flush = Z_NO_FLUSH;
		trees._tr_init(s);
		return Z_OK;
	}
	function deflateReset(strm) {
		var ret = deflateResetKeep(strm);
		if (ret === Z_OK) lm_init(strm.state);
		return ret;
	}
	function deflateSetHeader(strm, head) {
		if (!strm || !strm.state) return Z_STREAM_ERROR;
		if (strm.state.wrap !== 2) return Z_STREAM_ERROR;
		strm.state.gzhead = head;
		return Z_OK;
	}
	function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
		if (!strm) return Z_STREAM_ERROR;
		var wrap = 1;
		if (level === Z_DEFAULT_COMPRESSION) level = 6;
		if (windowBits < 0) {
			wrap = 0;
			windowBits = -windowBits;
		} else if (windowBits > 15) {
			wrap = 2;
			windowBits -= 16;
		}
		if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED) return err(strm, Z_STREAM_ERROR);
		if (windowBits === 8) windowBits = 9;
		var s = new DeflateState();
		strm.state = s;
		s.strm = strm;
		s.wrap = wrap;
		s.gzhead = null;
		s.w_bits = windowBits;
		s.w_size = 1 << s.w_bits;
		s.w_mask = s.w_size - 1;
		s.hash_bits = memLevel + 7;
		s.hash_size = 1 << s.hash_bits;
		s.hash_mask = s.hash_size - 1;
		s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
		s.window = new utils.Buf8(s.w_size * 2);
		s.head = new utils.Buf16(s.hash_size);
		s.prev = new utils.Buf16(s.w_size);
		s.lit_bufsize = 1 << memLevel + 6;
		s.pending_buf_size = s.lit_bufsize * 4;
		s.pending_buf = new utils.Buf8(s.pending_buf_size);
		s.d_buf = 1 * s.lit_bufsize;
		s.l_buf = 3 * s.lit_bufsize;
		s.level = level;
		s.strategy = strategy;
		s.method = method;
		return deflateReset(strm);
	}
	function deflateInit(strm, level) {
		return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
	}
	function deflate(strm, flush) {
		var old_flush, s;
		var beg, val;
		if (!strm || !strm.state || flush > Z_BLOCK || flush < 0) return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
		s = strm.state;
		if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH) return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
		s.strm = strm;
		old_flush = s.last_flush;
		s.last_flush = flush;
		if (s.status === INIT_STATE) if (s.wrap === 2) {
			strm.adler = 0;
			put_byte(s, 31);
			put_byte(s, 139);
			put_byte(s, 8);
			if (!s.gzhead) {
				put_byte(s, 0);
				put_byte(s, 0);
				put_byte(s, 0);
				put_byte(s, 0);
				put_byte(s, 0);
				put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
				put_byte(s, OS_CODE);
				s.status = BUSY_STATE;
			} else {
				put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
				put_byte(s, s.gzhead.time & 255);
				put_byte(s, s.gzhead.time >> 8 & 255);
				put_byte(s, s.gzhead.time >> 16 & 255);
				put_byte(s, s.gzhead.time >> 24 & 255);
				put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
				put_byte(s, s.gzhead.os & 255);
				if (s.gzhead.extra && s.gzhead.extra.length) {
					put_byte(s, s.gzhead.extra.length & 255);
					put_byte(s, s.gzhead.extra.length >> 8 & 255);
				}
				if (s.gzhead.hcrc) strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
				s.gzindex = 0;
				s.status = EXTRA_STATE;
			}
		} else {
			var header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
			var level_flags = -1;
			if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) level_flags = 0;
			else if (s.level < 6) level_flags = 1;
			else if (s.level === 6) level_flags = 2;
			else level_flags = 3;
			header |= level_flags << 6;
			if (s.strstart !== 0) header |= PRESET_DICT;
			header += 31 - header % 31;
			s.status = BUSY_STATE;
			putShortMSB(s, header);
			if (s.strstart !== 0) {
				putShortMSB(s, strm.adler >>> 16);
				putShortMSB(s, strm.adler & 65535);
			}
			strm.adler = 1;
		}
		if (s.status === EXTRA_STATE) if (s.gzhead.extra) {
			beg = s.pending;
			while (s.gzindex < (s.gzhead.extra.length & 65535)) {
				if (s.pending === s.pending_buf_size) {
					if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
					flush_pending(strm);
					beg = s.pending;
					if (s.pending === s.pending_buf_size) break;
				}
				put_byte(s, s.gzhead.extra[s.gzindex] & 255);
				s.gzindex++;
			}
			if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
			if (s.gzindex === s.gzhead.extra.length) {
				s.gzindex = 0;
				s.status = NAME_STATE;
			}
		} else s.status = NAME_STATE;
		if (s.status === NAME_STATE) if (s.gzhead.name) {
			beg = s.pending;
			do {
				if (s.pending === s.pending_buf_size) {
					if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
					flush_pending(strm);
					beg = s.pending;
					if (s.pending === s.pending_buf_size) {
						val = 1;
						break;
					}
				}
				if (s.gzindex < s.gzhead.name.length) val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
				else val = 0;
				put_byte(s, val);
			} while (val !== 0);
			if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
			if (val === 0) {
				s.gzindex = 0;
				s.status = COMMENT_STATE;
			}
		} else s.status = COMMENT_STATE;
		if (s.status === COMMENT_STATE) if (s.gzhead.comment) {
			beg = s.pending;
			do {
				if (s.pending === s.pending_buf_size) {
					if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
					flush_pending(strm);
					beg = s.pending;
					if (s.pending === s.pending_buf_size) {
						val = 1;
						break;
					}
				}
				if (s.gzindex < s.gzhead.comment.length) val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
				else val = 0;
				put_byte(s, val);
			} while (val !== 0);
			if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
			if (val === 0) s.status = HCRC_STATE;
		} else s.status = HCRC_STATE;
		if (s.status === HCRC_STATE) if (s.gzhead.hcrc) {
			if (s.pending + 2 > s.pending_buf_size) flush_pending(strm);
			if (s.pending + 2 <= s.pending_buf_size) {
				put_byte(s, strm.adler & 255);
				put_byte(s, strm.adler >> 8 & 255);
				strm.adler = 0;
				s.status = BUSY_STATE;
			}
		} else s.status = BUSY_STATE;
		if (s.pending !== 0) {
			flush_pending(strm);
			if (strm.avail_out === 0) {
				s.last_flush = -1;
				return Z_OK;
			}
		} else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) return err(strm, Z_BUF_ERROR);
		if (s.status === FINISH_STATE && strm.avail_in !== 0) return err(strm, Z_BUF_ERROR);
		if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
			var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
			if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) s.status = FINISH_STATE;
			if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
				if (strm.avail_out === 0) s.last_flush = -1;
				return Z_OK;
			}
			if (bstate === BS_BLOCK_DONE) {
				if (flush === Z_PARTIAL_FLUSH) trees._tr_align(s);
				else if (flush !== Z_BLOCK) {
					trees._tr_stored_block(s, 0, 0, false);
					if (flush === Z_FULL_FLUSH) {
						/*** CLEAR_HASH(s); ***/ zero(s.head);
						if (s.lookahead === 0) {
							s.strstart = 0;
							s.block_start = 0;
							s.insert = 0;
						}
					}
				}
				flush_pending(strm);
				if (strm.avail_out === 0) {
					s.last_flush = -1;
					return Z_OK;
				}
			}
		}
		if (flush !== Z_FINISH) return Z_OK;
		if (s.wrap <= 0) return Z_STREAM_END;
		if (s.wrap === 2) {
			put_byte(s, strm.adler & 255);
			put_byte(s, strm.adler >> 8 & 255);
			put_byte(s, strm.adler >> 16 & 255);
			put_byte(s, strm.adler >> 24 & 255);
			put_byte(s, strm.total_in & 255);
			put_byte(s, strm.total_in >> 8 & 255);
			put_byte(s, strm.total_in >> 16 & 255);
			put_byte(s, strm.total_in >> 24 & 255);
		} else {
			putShortMSB(s, strm.adler >>> 16);
			putShortMSB(s, strm.adler & 65535);
		}
		flush_pending(strm);
		if (s.wrap > 0) s.wrap = -s.wrap;
		return s.pending !== 0 ? Z_OK : Z_STREAM_END;
	}
	function deflateEnd(strm) {
		var status;
		if (!strm || !strm.state) return Z_STREAM_ERROR;
		status = strm.state.status;
		if (status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE) return err(strm, Z_STREAM_ERROR);
		strm.state = null;
		return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
	}
	function deflateSetDictionary(strm, dictionary) {
		var dictLength = dictionary.length;
		var s;
		var str, n;
		var wrap;
		var avail;
		var next;
		var input;
		var tmpDict;
		if (!strm || !strm.state) return Z_STREAM_ERROR;
		s = strm.state;
		wrap = s.wrap;
		if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) return Z_STREAM_ERROR;
		if (wrap === 1) strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
		s.wrap = 0;
		if (dictLength >= s.w_size) {
			if (wrap === 0) {
				/*** CLEAR_HASH(s); ***/
				zero(s.head);
				s.strstart = 0;
				s.block_start = 0;
				s.insert = 0;
			}
			tmpDict = new utils.Buf8(s.w_size);
			utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
			dictionary = tmpDict;
			dictLength = s.w_size;
		}
		avail = strm.avail_in;
		next = strm.next_in;
		input = strm.input;
		strm.avail_in = dictLength;
		strm.next_in = 0;
		strm.input = dictionary;
		fill_window(s);
		while (s.lookahead >= MIN_MATCH) {
			str = s.strstart;
			n = s.lookahead - (MIN_MATCH - 1);
			do {
				s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
				s.prev[str & s.w_mask] = s.head[s.ins_h];
				s.head[s.ins_h] = str;
				str++;
			} while (--n);
			s.strstart = str;
			s.lookahead = MIN_MATCH - 1;
			fill_window(s);
		}
		s.strstart += s.lookahead;
		s.block_start = s.strstart;
		s.insert = s.lookahead;
		s.lookahead = 0;
		s.match_length = s.prev_length = MIN_MATCH - 1;
		s.match_available = 0;
		strm.next_in = next;
		strm.input = input;
		strm.avail_in = avail;
		s.wrap = wrap;
		return Z_OK;
	}
	exports.deflateInit = deflateInit;
	exports.deflateInit2 = deflateInit2;
	exports.deflateReset = deflateReset;
	exports.deflateResetKeep = deflateResetKeep;
	exports.deflateSetHeader = deflateSetHeader;
	exports.deflate = deflate;
	exports.deflateEnd = deflateEnd;
	exports.deflateSetDictionary = deflateSetDictionary;
	exports.deflateInfo = "pako deflate (from Nodeca project)";
}));
//#endregion
//#region node_modules/pako/lib/utils/strings.js
var require_strings = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var utils = require_common();
	var STR_APPLY_OK = true;
	var STR_APPLY_UIA_OK = true;
	try {
		String.fromCharCode.apply(null, [0]);
	} catch (__) {
		STR_APPLY_OK = false;
	}
	try {
		String.fromCharCode.apply(null, new Uint8Array(1));
	} catch (__) {
		STR_APPLY_UIA_OK = false;
	}
	var _utf8len = new utils.Buf8(256);
	for (var q = 0; q < 256; q++) _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
	_utf8len[254] = _utf8len[254] = 1;
	exports.string2buf = function(str) {
		var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
		for (m_pos = 0; m_pos < str_len; m_pos++) {
			c = str.charCodeAt(m_pos);
			if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
				c2 = str.charCodeAt(m_pos + 1);
				if ((c2 & 64512) === 56320) {
					c = 65536 + (c - 55296 << 10) + (c2 - 56320);
					m_pos++;
				}
			}
			buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
		}
		buf = new utils.Buf8(buf_len);
		for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
			c = str.charCodeAt(m_pos);
			if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
				c2 = str.charCodeAt(m_pos + 1);
				if ((c2 & 64512) === 56320) {
					c = 65536 + (c - 55296 << 10) + (c2 - 56320);
					m_pos++;
				}
			}
			if (c < 128) buf[i++] = c;
			else if (c < 2048) {
				buf[i++] = 192 | c >>> 6;
				buf[i++] = 128 | c & 63;
			} else if (c < 65536) {
				buf[i++] = 224 | c >>> 12;
				buf[i++] = 128 | c >>> 6 & 63;
				buf[i++] = 128 | c & 63;
			} else {
				buf[i++] = 240 | c >>> 18;
				buf[i++] = 128 | c >>> 12 & 63;
				buf[i++] = 128 | c >>> 6 & 63;
				buf[i++] = 128 | c & 63;
			}
		}
		return buf;
	};
	function buf2binstring(buf, len) {
		if (len < 65534) {
			if (buf.subarray && STR_APPLY_UIA_OK || !buf.subarray && STR_APPLY_OK) return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
		}
		var result = "";
		for (var i = 0; i < len; i++) result += String.fromCharCode(buf[i]);
		return result;
	}
	exports.buf2binstring = function(buf) {
		return buf2binstring(buf, buf.length);
	};
	exports.binstring2buf = function(str) {
		var buf = new utils.Buf8(str.length);
		for (var i = 0, len = buf.length; i < len; i++) buf[i] = str.charCodeAt(i);
		return buf;
	};
	exports.buf2string = function(buf, max) {
		var i, out, c, c_len;
		var len = max || buf.length;
		var utf16buf = new Array(len * 2);
		for (out = 0, i = 0; i < len;) {
			c = buf[i++];
			if (c < 128) {
				utf16buf[out++] = c;
				continue;
			}
			c_len = _utf8len[c];
			if (c_len > 4) {
				utf16buf[out++] = 65533;
				i += c_len - 1;
				continue;
			}
			c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
			while (c_len > 1 && i < len) {
				c = c << 6 | buf[i++] & 63;
				c_len--;
			}
			if (c_len > 1) {
				utf16buf[out++] = 65533;
				continue;
			}
			if (c < 65536) utf16buf[out++] = c;
			else {
				c -= 65536;
				utf16buf[out++] = 55296 | c >> 10 & 1023;
				utf16buf[out++] = 56320 | c & 1023;
			}
		}
		return buf2binstring(utf16buf, out);
	};
	exports.utf8border = function(buf, max) {
		var pos;
		max = max || buf.length;
		if (max > buf.length) max = buf.length;
		pos = max - 1;
		while (pos >= 0 && (buf[pos] & 192) === 128) pos--;
		if (pos < 0) return max;
		if (pos === 0) return max;
		return pos + _utf8len[buf[pos]] > max ? pos : max;
	};
}));
//#endregion
//#region node_modules/pako/lib/zlib/zstream.js
var require_zstream = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	function ZStream() {
		this.input = null;
		this.next_in = 0;
		this.avail_in = 0;
		this.total_in = 0;
		this.output = null;
		this.next_out = 0;
		this.avail_out = 0;
		this.total_out = 0;
		this.msg = "";
		this.state = null;
		this.data_type = 2;
		this.adler = 0;
	}
	module.exports = ZStream;
}));
//#endregion
//#region node_modules/pako/lib/deflate.js
var require_deflate = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var zlib_deflate = require_deflate$1();
	var utils = require_common();
	var strings = require_strings();
	var msg = require_messages();
	var ZStream = require_zstream();
	var toString = Object.prototype.toString;
	var Z_NO_FLUSH = 0;
	var Z_FINISH = 4;
	var Z_OK = 0;
	var Z_STREAM_END = 1;
	var Z_SYNC_FLUSH = 2;
	var Z_DEFAULT_COMPRESSION = -1;
	var Z_DEFAULT_STRATEGY = 0;
	var Z_DEFLATED = 8;
	/**
	* class Deflate
	*
	* Generic JS-style wrapper for zlib calls. If you don't need
	* streaming behaviour - use more simple functions: [[deflate]],
	* [[deflateRaw]] and [[gzip]].
	**/
	/**
	* Deflate.result -> Uint8Array|Array
	*
	* Compressed result, generated by default [[Deflate#onData]]
	* and [[Deflate#onEnd]] handlers. Filled after you push last chunk
	* (call [[Deflate#push]] with `Z_FINISH` / `true` param)  or if you
	* push a chunk with explicit flush (call [[Deflate#push]] with
	* `Z_SYNC_FLUSH` param).
	**/
	/**
	* Deflate.err -> Number
	*
	* Error code after deflate finished. 0 (Z_OK) on success.
	* You will not need it in real life, because deflate errors
	* are possible only on wrong options or bad `onData` / `onEnd`
	* custom handlers.
	**/
	/**
	* Deflate.msg -> String
	*
	* Error message, if [[Deflate.err]] != 0
	**/
	/**
	* new Deflate(options)
	* - options (Object): zlib deflate options.
	*
	* Creates new deflator instance with specified params. Throws exception
	* on bad params. Supported options:
	*
	* - `level`
	* - `windowBits`
	* - `memLevel`
	* - `strategy`
	* - `dictionary`
	*
	* [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	* for more information on these.
	*
	* Additional options, for internal needs:
	*
	* - `chunkSize` - size of generated data chunks (16K by default)
	* - `raw` (Boolean) - do raw deflate
	* - `gzip` (Boolean) - create gzip wrapper
	* - `to` (String) - if equal to 'string', then result will be "binary string"
	*    (each char code [0..255])
	* - `header` (Object) - custom header for gzip
	*   - `text` (Boolean) - true if compressed data believed to be text
	*   - `time` (Number) - modification time, unix timestamp
	*   - `os` (Number) - operation system code
	*   - `extra` (Array) - array of bytes with extra data (max 65536)
	*   - `name` (String) - file name (binary string)
	*   - `comment` (String) - comment (binary string)
	*   - `hcrc` (Boolean) - true if header crc should be added
	*
	* ##### Example:
	*
	* ```javascript
	* var pako = require('pako')
	*   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
	*   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
	*
	* var deflate = new pako.Deflate({ level: 3});
	*
	* deflate.push(chunk1, false);
	* deflate.push(chunk2, true);  // true -> last chunk
	*
	* if (deflate.err) { throw new Error(deflate.err); }
	*
	* console.log(deflate.result);
	* ```
	**/
	function Deflate(options) {
		if (!(this instanceof Deflate)) return new Deflate(options);
		this.options = utils.assign({
			level: Z_DEFAULT_COMPRESSION,
			method: Z_DEFLATED,
			chunkSize: 16384,
			windowBits: 15,
			memLevel: 8,
			strategy: Z_DEFAULT_STRATEGY,
			to: ""
		}, options || {});
		var opt = this.options;
		if (opt.raw && opt.windowBits > 0) opt.windowBits = -opt.windowBits;
		else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) opt.windowBits += 16;
		this.err = 0;
		this.msg = "";
		this.ended = false;
		this.chunks = [];
		this.strm = new ZStream();
		this.strm.avail_out = 0;
		var status = zlib_deflate.deflateInit2(this.strm, opt.level, opt.method, opt.windowBits, opt.memLevel, opt.strategy);
		if (status !== Z_OK) throw new Error(msg[status]);
		if (opt.header) zlib_deflate.deflateSetHeader(this.strm, opt.header);
		if (opt.dictionary) {
			var dict;
			if (typeof opt.dictionary === "string") dict = strings.string2buf(opt.dictionary);
			else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") dict = new Uint8Array(opt.dictionary);
			else dict = opt.dictionary;
			status = zlib_deflate.deflateSetDictionary(this.strm, dict);
			if (status !== Z_OK) throw new Error(msg[status]);
			this._dict_set = true;
		}
	}
	/**
	* Deflate#push(data[, mode]) -> Boolean
	* - data (Uint8Array|Array|ArrayBuffer|String): input data. Strings will be
	*   converted to utf8 byte sequence.
	* - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
	*   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
	*
	* Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
	* new compressed chunks. Returns `true` on success. The last data block must have
	* mode Z_FINISH (or `true`). That will flush internal pending buffers and call
	* [[Deflate#onEnd]]. For interim explicit flushes (without ending the stream) you
	* can use mode Z_SYNC_FLUSH, keeping the compression context.
	*
	* On fail call [[Deflate#onEnd]] with error code and return false.
	*
	* We strongly recommend to use `Uint8Array` on input for best speed (output
	* array format is detected automatically). Also, don't skip last param and always
	* use the same type in your code (boolean or number). That will improve JS speed.
	*
	* For regular `Array`-s make sure all elements are [0..255].
	*
	* ##### Example
	*
	* ```javascript
	* push(chunk, false); // push one of data chunks
	* ...
	* push(chunk, true);  // push last chunk
	* ```
	**/
	Deflate.prototype.push = function(data, mode) {
		var strm = this.strm;
		var chunkSize = this.options.chunkSize;
		var status, _mode;
		if (this.ended) return false;
		_mode = mode === ~~mode ? mode : mode === true ? Z_FINISH : Z_NO_FLUSH;
		if (typeof data === "string") strm.input = strings.string2buf(data);
		else if (toString.call(data) === "[object ArrayBuffer]") strm.input = new Uint8Array(data);
		else strm.input = data;
		strm.next_in = 0;
		strm.avail_in = strm.input.length;
		do {
			if (strm.avail_out === 0) {
				strm.output = new utils.Buf8(chunkSize);
				strm.next_out = 0;
				strm.avail_out = chunkSize;
			}
			status = zlib_deflate.deflate(strm, _mode);
			if (status !== Z_STREAM_END && status !== Z_OK) {
				this.onEnd(status);
				this.ended = true;
				return false;
			}
			if (strm.avail_out === 0 || strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH)) if (this.options.to === "string") this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
			else this.onData(utils.shrinkBuf(strm.output, strm.next_out));
		} while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);
		if (_mode === Z_FINISH) {
			status = zlib_deflate.deflateEnd(this.strm);
			this.onEnd(status);
			this.ended = true;
			return status === Z_OK;
		}
		if (_mode === Z_SYNC_FLUSH) {
			this.onEnd(Z_OK);
			strm.avail_out = 0;
			return true;
		}
		return true;
	};
	/**
	* Deflate#onData(chunk) -> Void
	* - chunk (Uint8Array|Array|String): output data. Type of array depends
	*   on js engine support. When string output requested, each chunk
	*   will be string.
	*
	* By default, stores data blocks in `chunks[]` property and glue
	* those in `onEnd`. Override this handler, if you need another behaviour.
	**/
	Deflate.prototype.onData = function(chunk) {
		this.chunks.push(chunk);
	};
	/**
	* Deflate#onEnd(status) -> Void
	* - status (Number): deflate status. 0 (Z_OK) on success,
	*   other if not.
	*
	* Called once after you tell deflate that the input stream is
	* complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
	* or if an error happened. By default - join collected chunks,
	* free memory and fill `results` / `err` properties.
	**/
	Deflate.prototype.onEnd = function(status) {
		if (status === Z_OK) if (this.options.to === "string") this.result = this.chunks.join("");
		else this.result = utils.flattenChunks(this.chunks);
		this.chunks = [];
		this.err = status;
		this.msg = this.strm.msg;
	};
	/**
	* deflate(data[, options]) -> Uint8Array|Array|String
	* - data (Uint8Array|Array|String): input data to compress.
	* - options (Object): zlib deflate options.
	*
	* Compress `data` with deflate algorithm and `options`.
	*
	* Supported options are:
	*
	* - level
	* - windowBits
	* - memLevel
	* - strategy
	* - dictionary
	*
	* [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	* for more information on these.
	*
	* Sugar (options):
	*
	* - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
	*   negative windowBits implicitly.
	* - `to` (String) - if equal to 'string', then result will be "binary string"
	*    (each char code [0..255])
	*
	* ##### Example:
	*
	* ```javascript
	* var pako = require('pako')
	*   , data = Uint8Array([1,2,3,4,5,6,7,8,9]);
	*
	* console.log(pako.deflate(data));
	* ```
	**/
	function deflate(input, options) {
		var deflator = new Deflate(options);
		deflator.push(input, true);
		if (deflator.err) throw deflator.msg || msg[deflator.err];
		return deflator.result;
	}
	/**
	* deflateRaw(data[, options]) -> Uint8Array|Array|String
	* - data (Uint8Array|Array|String): input data to compress.
	* - options (Object): zlib deflate options.
	*
	* The same as [[deflate]], but creates raw data, without wrapper
	* (header and adler32 crc).
	**/
	function deflateRaw(input, options) {
		options = options || {};
		options.raw = true;
		return deflate(input, options);
	}
	/**
	* gzip(data[, options]) -> Uint8Array|Array|String
	* - data (Uint8Array|Array|String): input data to compress.
	* - options (Object): zlib deflate options.
	*
	* The same as [[deflate]], but create gzip wrapper instead of
	* deflate one.
	**/
	function gzip(input, options) {
		options = options || {};
		options.gzip = true;
		return deflate(input, options);
	}
	exports.Deflate = Deflate;
	exports.deflate = deflate;
	exports.deflateRaw = deflateRaw;
	exports.gzip = gzip;
}));
//#endregion
//#region node_modules/pako/lib/zlib/inffast.js
var require_inffast = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var BAD = 30;
	var TYPE = 12;
	module.exports = function inflate_fast(strm, start) {
		var state;
		var _in;
		var last;
		var _out;
		var beg;
		var end;
		var dmax;
		var wsize;
		var whave;
		var wnext;
		var s_window;
		var hold;
		var bits;
		var lcode;
		var dcode;
		var lmask;
		var dmask;
		var here;
		var op;
		var len;
		var dist;
		var from;
		var from_source;
		var input, output;
		state = strm.state;
		_in = strm.next_in;
		input = strm.input;
		last = _in + (strm.avail_in - 5);
		_out = strm.next_out;
		output = strm.output;
		beg = _out - (start - strm.avail_out);
		end = _out + (strm.avail_out - 257);
		dmax = state.dmax;
		wsize = state.wsize;
		whave = state.whave;
		wnext = state.wnext;
		s_window = state.window;
		hold = state.hold;
		bits = state.bits;
		lcode = state.lencode;
		dcode = state.distcode;
		lmask = (1 << state.lenbits) - 1;
		dmask = (1 << state.distbits) - 1;
		top: do {
			if (bits < 15) {
				hold += input[_in++] << bits;
				bits += 8;
				hold += input[_in++] << bits;
				bits += 8;
			}
			here = lcode[hold & lmask];
			dolen: for (;;) {
				op = here >>> 24;
				hold >>>= op;
				bits -= op;
				op = here >>> 16 & 255;
				if (op === 0) output[_out++] = here & 65535;
				else if (op & 16) {
					len = here & 65535;
					op &= 15;
					if (op) {
						if (bits < op) {
							hold += input[_in++] << bits;
							bits += 8;
						}
						len += hold & (1 << op) - 1;
						hold >>>= op;
						bits -= op;
					}
					if (bits < 15) {
						hold += input[_in++] << bits;
						bits += 8;
						hold += input[_in++] << bits;
						bits += 8;
					}
					here = dcode[hold & dmask];
					dodist: for (;;) {
						op = here >>> 24;
						hold >>>= op;
						bits -= op;
						op = here >>> 16 & 255;
						if (op & 16) {
							dist = here & 65535;
							op &= 15;
							if (bits < op) {
								hold += input[_in++] << bits;
								bits += 8;
								if (bits < op) {
									hold += input[_in++] << bits;
									bits += 8;
								}
							}
							dist += hold & (1 << op) - 1;
							if (dist > dmax) {
								strm.msg = "invalid distance too far back";
								state.mode = BAD;
								break top;
							}
							hold >>>= op;
							bits -= op;
							op = _out - beg;
							if (dist > op) {
								op = dist - op;
								if (op > whave) {
									if (state.sane) {
										strm.msg = "invalid distance too far back";
										state.mode = BAD;
										break top;
									}
								}
								from = 0;
								from_source = s_window;
								if (wnext === 0) {
									from += wsize - op;
									if (op < len) {
										len -= op;
										do
											output[_out++] = s_window[from++];
										while (--op);
										from = _out - dist;
										from_source = output;
									}
								} else if (wnext < op) {
									from += wsize + wnext - op;
									op -= wnext;
									if (op < len) {
										len -= op;
										do
											output[_out++] = s_window[from++];
										while (--op);
										from = 0;
										if (wnext < len) {
											op = wnext;
											len -= op;
											do
												output[_out++] = s_window[from++];
											while (--op);
											from = _out - dist;
											from_source = output;
										}
									}
								} else {
									from += wnext - op;
									if (op < len) {
										len -= op;
										do
											output[_out++] = s_window[from++];
										while (--op);
										from = _out - dist;
										from_source = output;
									}
								}
								while (len > 2) {
									output[_out++] = from_source[from++];
									output[_out++] = from_source[from++];
									output[_out++] = from_source[from++];
									len -= 3;
								}
								if (len) {
									output[_out++] = from_source[from++];
									if (len > 1) output[_out++] = from_source[from++];
								}
							} else {
								from = _out - dist;
								do {
									output[_out++] = output[from++];
									output[_out++] = output[from++];
									output[_out++] = output[from++];
									len -= 3;
								} while (len > 2);
								if (len) {
									output[_out++] = output[from++];
									if (len > 1) output[_out++] = output[from++];
								}
							}
						} else if ((op & 64) === 0) {
							here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
							continue dodist;
						} else {
							strm.msg = "invalid distance code";
							state.mode = BAD;
							break top;
						}
						break;
					}
				} else if ((op & 64) === 0) {
					here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
					continue dolen;
				} else if (op & 32) {
					state.mode = TYPE;
					break top;
				} else {
					strm.msg = "invalid literal/length code";
					state.mode = BAD;
					break top;
				}
				break;
			}
		} while (_in < last && _out < end);
		len = bits >> 3;
		_in -= len;
		bits -= len << 3;
		hold &= (1 << bits) - 1;
		strm.next_in = _in;
		strm.next_out = _out;
		strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
		strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
		state.hold = hold;
		state.bits = bits;
	};
}));
//#endregion
//#region node_modules/pako/lib/zlib/inftrees.js
var require_inftrees = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var utils = require_common();
	var MAXBITS = 15;
	var ENOUGH_LENS = 852;
	var ENOUGH_DISTS = 592;
	var CODES = 0;
	var LENS = 1;
	var DISTS = 2;
	var lbase = [
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		13,
		15,
		17,
		19,
		23,
		27,
		31,
		35,
		43,
		51,
		59,
		67,
		83,
		99,
		115,
		131,
		163,
		195,
		227,
		258,
		0,
		0
	];
	var lext = [
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		17,
		17,
		17,
		17,
		18,
		18,
		18,
		18,
		19,
		19,
		19,
		19,
		20,
		20,
		20,
		20,
		21,
		21,
		21,
		21,
		16,
		72,
		78
	];
	var dbase = [
		1,
		2,
		3,
		4,
		5,
		7,
		9,
		13,
		17,
		25,
		33,
		49,
		65,
		97,
		129,
		193,
		257,
		385,
		513,
		769,
		1025,
		1537,
		2049,
		3073,
		4097,
		6145,
		8193,
		12289,
		16385,
		24577,
		0,
		0
	];
	var dext = [
		16,
		16,
		16,
		16,
		17,
		17,
		18,
		18,
		19,
		19,
		20,
		20,
		21,
		21,
		22,
		22,
		23,
		23,
		24,
		24,
		25,
		25,
		26,
		26,
		27,
		27,
		28,
		28,
		29,
		29,
		64,
		64
	];
	module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
		var bits = opts.bits;
		var len = 0;
		var sym = 0;
		var min = 0, max = 0;
		var root = 0;
		var curr = 0;
		var drop = 0;
		var left = 0;
		var used = 0;
		var huff = 0;
		var incr;
		var fill;
		var low;
		var mask;
		var next;
		var base = null;
		var base_index = 0;
		var end;
		var count = new utils.Buf16(MAXBITS + 1);
		var offs = new utils.Buf16(MAXBITS + 1);
		var extra = null;
		var extra_index = 0;
		var here_bits, here_op, here_val;
		for (len = 0; len <= MAXBITS; len++) count[len] = 0;
		for (sym = 0; sym < codes; sym++) count[lens[lens_index + sym]]++;
		root = bits;
		for (max = MAXBITS; max >= 1; max--) if (count[max] !== 0) break;
		if (root > max) root = max;
		if (max === 0) {
			table[table_index++] = 20971520;
			table[table_index++] = 20971520;
			opts.bits = 1;
			return 0;
		}
		for (min = 1; min < max; min++) if (count[min] !== 0) break;
		if (root < min) root = min;
		left = 1;
		for (len = 1; len <= MAXBITS; len++) {
			left <<= 1;
			left -= count[len];
			if (left < 0) return -1;
		}
		if (left > 0 && (type === CODES || max !== 1)) return -1;
		offs[1] = 0;
		for (len = 1; len < MAXBITS; len++) offs[len + 1] = offs[len] + count[len];
		for (sym = 0; sym < codes; sym++) if (lens[lens_index + sym] !== 0) work[offs[lens[lens_index + sym]]++] = sym;
		if (type === CODES) {
			base = extra = work;
			end = 19;
		} else if (type === LENS) {
			base = lbase;
			base_index -= 257;
			extra = lext;
			extra_index -= 257;
			end = 256;
		} else {
			base = dbase;
			extra = dext;
			end = -1;
		}
		huff = 0;
		sym = 0;
		len = min;
		next = table_index;
		curr = root;
		drop = 0;
		low = -1;
		used = 1 << root;
		mask = used - 1;
		if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) return 1;
		for (;;) {
			here_bits = len - drop;
			if (work[sym] < end) {
				here_op = 0;
				here_val = work[sym];
			} else if (work[sym] > end) {
				here_op = extra[extra_index + work[sym]];
				here_val = base[base_index + work[sym]];
			} else {
				here_op = 96;
				here_val = 0;
			}
			incr = 1 << len - drop;
			fill = 1 << curr;
			min = fill;
			do {
				fill -= incr;
				table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
			} while (fill !== 0);
			incr = 1 << len - 1;
			while (huff & incr) incr >>= 1;
			if (incr !== 0) {
				huff &= incr - 1;
				huff += incr;
			} else huff = 0;
			sym++;
			if (--count[len] === 0) {
				if (len === max) break;
				len = lens[lens_index + work[sym]];
			}
			if (len > root && (huff & mask) !== low) {
				if (drop === 0) drop = root;
				next += min;
				curr = len - drop;
				left = 1 << curr;
				while (curr + drop < max) {
					left -= count[curr + drop];
					if (left <= 0) break;
					curr++;
					left <<= 1;
				}
				used += 1 << curr;
				if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) return 1;
				low = huff & mask;
				table[low] = root << 24 | curr << 16 | next - table_index | 0;
			}
		}
		if (huff !== 0) table[next + huff] = len - drop << 24 | 4194304;
		opts.bits = root;
		return 0;
	};
}));
//#endregion
//#region node_modules/pako/lib/zlib/inflate.js
var require_inflate$1 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var utils = require_common();
	var adler32 = require_adler32();
	var crc32 = require_crc32();
	var inflate_fast = require_inffast();
	var inflate_table = require_inftrees();
	var CODES = 0;
	var LENS = 1;
	var DISTS = 2;
	var Z_FINISH = 4;
	var Z_BLOCK = 5;
	var Z_TREES = 6;
	var Z_OK = 0;
	var Z_STREAM_END = 1;
	var Z_NEED_DICT = 2;
	var Z_STREAM_ERROR = -2;
	var Z_DATA_ERROR = -3;
	var Z_MEM_ERROR = -4;
	var Z_BUF_ERROR = -5;
	var Z_DEFLATED = 8;
	var HEAD = 1;
	var FLAGS = 2;
	var TIME = 3;
	var OS = 4;
	var EXLEN = 5;
	var EXTRA = 6;
	var NAME = 7;
	var COMMENT = 8;
	var HCRC = 9;
	var DICTID = 10;
	var DICT = 11;
	var TYPE = 12;
	var TYPEDO = 13;
	var STORED = 14;
	var COPY_ = 15;
	var COPY = 16;
	var TABLE = 17;
	var LENLENS = 18;
	var CODELENS = 19;
	var LEN_ = 20;
	var LEN = 21;
	var LENEXT = 22;
	var DIST = 23;
	var DISTEXT = 24;
	var MATCH = 25;
	var LIT = 26;
	var CHECK = 27;
	var LENGTH = 28;
	var DONE = 29;
	var BAD = 30;
	var MEM = 31;
	var SYNC = 32;
	var ENOUGH_LENS = 852;
	var ENOUGH_DISTS = 592;
	var DEF_WBITS = 15;
	function zswap32(q) {
		return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
	}
	function InflateState() {
		this.mode = 0;
		this.last = false;
		this.wrap = 0;
		this.havedict = false;
		this.flags = 0;
		this.dmax = 0;
		this.check = 0;
		this.total = 0;
		this.head = null;
		this.wbits = 0;
		this.wsize = 0;
		this.whave = 0;
		this.wnext = 0;
		this.window = null;
		this.hold = 0;
		this.bits = 0;
		this.length = 0;
		this.offset = 0;
		this.extra = 0;
		this.lencode = null;
		this.distcode = null;
		this.lenbits = 0;
		this.distbits = 0;
		this.ncode = 0;
		this.nlen = 0;
		this.ndist = 0;
		this.have = 0;
		this.next = null;
		this.lens = new utils.Buf16(320);
		this.work = new utils.Buf16(288);
		this.lendyn = null;
		this.distdyn = null;
		this.sane = 0;
		this.back = 0;
		this.was = 0;
	}
	function inflateResetKeep(strm) {
		var state;
		if (!strm || !strm.state) return Z_STREAM_ERROR;
		state = strm.state;
		strm.total_in = strm.total_out = state.total = 0;
		strm.msg = "";
		if (state.wrap) strm.adler = state.wrap & 1;
		state.mode = HEAD;
		state.last = 0;
		state.havedict = 0;
		state.dmax = 32768;
		state.head = null;
		state.hold = 0;
		state.bits = 0;
		state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
		state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);
		state.sane = 1;
		state.back = -1;
		return Z_OK;
	}
	function inflateReset(strm) {
		var state;
		if (!strm || !strm.state) return Z_STREAM_ERROR;
		state = strm.state;
		state.wsize = 0;
		state.whave = 0;
		state.wnext = 0;
		return inflateResetKeep(strm);
	}
	function inflateReset2(strm, windowBits) {
		var wrap;
		var state;
		if (!strm || !strm.state) return Z_STREAM_ERROR;
		state = strm.state;
		if (windowBits < 0) {
			wrap = 0;
			windowBits = -windowBits;
		} else {
			wrap = (windowBits >> 4) + 1;
			if (windowBits < 48) windowBits &= 15;
		}
		if (windowBits && (windowBits < 8 || windowBits > 15)) return Z_STREAM_ERROR;
		if (state.window !== null && state.wbits !== windowBits) state.window = null;
		state.wrap = wrap;
		state.wbits = windowBits;
		return inflateReset(strm);
	}
	function inflateInit2(strm, windowBits) {
		var ret;
		var state;
		if (!strm) return Z_STREAM_ERROR;
		state = new InflateState();
		strm.state = state;
		state.window = null;
		ret = inflateReset2(strm, windowBits);
		if (ret !== Z_OK) strm.state = null;
		return ret;
	}
	function inflateInit(strm) {
		return inflateInit2(strm, DEF_WBITS);
	}
	var virgin = true;
	var lenfix, distfix;
	function fixedtables(state) {
		if (virgin) {
			var sym;
			lenfix = new utils.Buf32(512);
			distfix = new utils.Buf32(32);
			sym = 0;
			while (sym < 144) state.lens[sym++] = 8;
			while (sym < 256) state.lens[sym++] = 9;
			while (sym < 280) state.lens[sym++] = 7;
			while (sym < 288) state.lens[sym++] = 8;
			inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
			sym = 0;
			while (sym < 32) state.lens[sym++] = 5;
			inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
			virgin = false;
		}
		state.lencode = lenfix;
		state.lenbits = 9;
		state.distcode = distfix;
		state.distbits = 5;
	}
	function updatewindow(strm, src, end, copy) {
		var dist;
		var state = strm.state;
		if (state.window === null) {
			state.wsize = 1 << state.wbits;
			state.wnext = 0;
			state.whave = 0;
			state.window = new utils.Buf8(state.wsize);
		}
		if (copy >= state.wsize) {
			utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
			state.wnext = 0;
			state.whave = state.wsize;
		} else {
			dist = state.wsize - state.wnext;
			if (dist > copy) dist = copy;
			utils.arraySet(state.window, src, end - copy, dist, state.wnext);
			copy -= dist;
			if (copy) {
				utils.arraySet(state.window, src, end - copy, copy, 0);
				state.wnext = copy;
				state.whave = state.wsize;
			} else {
				state.wnext += dist;
				if (state.wnext === state.wsize) state.wnext = 0;
				if (state.whave < state.wsize) state.whave += dist;
			}
		}
		return 0;
	}
	function inflate(strm, flush) {
		var state;
		var input, output;
		var next;
		var put;
		var have, left;
		var hold;
		var bits;
		var _in, _out;
		var copy;
		var from;
		var from_source;
		var here = 0;
		var here_bits, here_op, here_val;
		var last_bits, last_op, last_val;
		var len;
		var ret;
		var hbuf = new utils.Buf8(4);
		var opts;
		var n;
		var order = [
			16,
			17,
			18,
			0,
			8,
			7,
			9,
			6,
			10,
			5,
			11,
			4,
			12,
			3,
			13,
			2,
			14,
			1,
			15
		];
		if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) return Z_STREAM_ERROR;
		state = strm.state;
		if (state.mode === TYPE) state.mode = TYPEDO;
		put = strm.next_out;
		output = strm.output;
		left = strm.avail_out;
		next = strm.next_in;
		input = strm.input;
		have = strm.avail_in;
		hold = state.hold;
		bits = state.bits;
		_in = have;
		_out = left;
		ret = Z_OK;
		inf_leave: for (;;) switch (state.mode) {
			case HEAD:
				if (state.wrap === 0) {
					state.mode = TYPEDO;
					break;
				}
				while (bits < 16) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if (state.wrap & 2 && hold === 35615) {
					state.check = 0;
					hbuf[0] = hold & 255;
					hbuf[1] = hold >>> 8 & 255;
					state.check = crc32(state.check, hbuf, 2, 0);
					hold = 0;
					bits = 0;
					state.mode = FLAGS;
					break;
				}
				state.flags = 0;
				if (state.head) state.head.done = false;
				if (!(state.wrap & 1) || (((hold & 255) << 8) + (hold >> 8)) % 31) {
					strm.msg = "incorrect header check";
					state.mode = BAD;
					break;
				}
				if ((hold & 15) !== Z_DEFLATED) {
					strm.msg = "unknown compression method";
					state.mode = BAD;
					break;
				}
				hold >>>= 4;
				bits -= 4;
				len = (hold & 15) + 8;
				if (state.wbits === 0) state.wbits = len;
				else if (len > state.wbits) {
					strm.msg = "invalid window size";
					state.mode = BAD;
					break;
				}
				state.dmax = 1 << len;
				strm.adler = state.check = 1;
				state.mode = hold & 512 ? DICTID : TYPE;
				hold = 0;
				bits = 0;
				break;
			case FLAGS:
				while (bits < 16) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				state.flags = hold;
				if ((state.flags & 255) !== Z_DEFLATED) {
					strm.msg = "unknown compression method";
					state.mode = BAD;
					break;
				}
				if (state.flags & 57344) {
					strm.msg = "unknown header flags set";
					state.mode = BAD;
					break;
				}
				if (state.head) state.head.text = hold >> 8 & 1;
				if (state.flags & 512) {
					hbuf[0] = hold & 255;
					hbuf[1] = hold >>> 8 & 255;
					state.check = crc32(state.check, hbuf, 2, 0);
				}
				hold = 0;
				bits = 0;
				state.mode = TIME;
			case TIME:
				while (bits < 32) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if (state.head) state.head.time = hold;
				if (state.flags & 512) {
					hbuf[0] = hold & 255;
					hbuf[1] = hold >>> 8 & 255;
					hbuf[2] = hold >>> 16 & 255;
					hbuf[3] = hold >>> 24 & 255;
					state.check = crc32(state.check, hbuf, 4, 0);
				}
				hold = 0;
				bits = 0;
				state.mode = OS;
			case OS:
				while (bits < 16) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if (state.head) {
					state.head.xflags = hold & 255;
					state.head.os = hold >> 8;
				}
				if (state.flags & 512) {
					hbuf[0] = hold & 255;
					hbuf[1] = hold >>> 8 & 255;
					state.check = crc32(state.check, hbuf, 2, 0);
				}
				hold = 0;
				bits = 0;
				state.mode = EXLEN;
			case EXLEN:
				if (state.flags & 1024) {
					while (bits < 16) {
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					state.length = hold;
					if (state.head) state.head.extra_len = hold;
					if (state.flags & 512) {
						hbuf[0] = hold & 255;
						hbuf[1] = hold >>> 8 & 255;
						state.check = crc32(state.check, hbuf, 2, 0);
					}
					hold = 0;
					bits = 0;
				} else if (state.head) state.head.extra = null;
				state.mode = EXTRA;
			case EXTRA:
				if (state.flags & 1024) {
					copy = state.length;
					if (copy > have) copy = have;
					if (copy) {
						if (state.head) {
							len = state.head.extra_len - state.length;
							if (!state.head.extra) state.head.extra = new Array(state.head.extra_len);
							utils.arraySet(state.head.extra, input, next, copy, len);
						}
						if (state.flags & 512) state.check = crc32(state.check, input, copy, next);
						have -= copy;
						next += copy;
						state.length -= copy;
					}
					if (state.length) break inf_leave;
				}
				state.length = 0;
				state.mode = NAME;
			case NAME:
				if (state.flags & 2048) {
					if (have === 0) break inf_leave;
					copy = 0;
					do {
						len = input[next + copy++];
						if (state.head && len && state.length < 65536) state.head.name += String.fromCharCode(len);
					} while (len && copy < have);
					if (state.flags & 512) state.check = crc32(state.check, input, copy, next);
					have -= copy;
					next += copy;
					if (len) break inf_leave;
				} else if (state.head) state.head.name = null;
				state.length = 0;
				state.mode = COMMENT;
			case COMMENT:
				if (state.flags & 4096) {
					if (have === 0) break inf_leave;
					copy = 0;
					do {
						len = input[next + copy++];
						if (state.head && len && state.length < 65536) state.head.comment += String.fromCharCode(len);
					} while (len && copy < have);
					if (state.flags & 512) state.check = crc32(state.check, input, copy, next);
					have -= copy;
					next += copy;
					if (len) break inf_leave;
				} else if (state.head) state.head.comment = null;
				state.mode = HCRC;
			case HCRC:
				if (state.flags & 512) {
					while (bits < 16) {
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					if (hold !== (state.check & 65535)) {
						strm.msg = "header crc mismatch";
						state.mode = BAD;
						break;
					}
					hold = 0;
					bits = 0;
				}
				if (state.head) {
					state.head.hcrc = state.flags >> 9 & 1;
					state.head.done = true;
				}
				strm.adler = state.check = 0;
				state.mode = TYPE;
				break;
			case DICTID:
				while (bits < 32) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				strm.adler = state.check = zswap32(hold);
				hold = 0;
				bits = 0;
				state.mode = DICT;
			case DICT:
				if (state.havedict === 0) {
					strm.next_out = put;
					strm.avail_out = left;
					strm.next_in = next;
					strm.avail_in = have;
					state.hold = hold;
					state.bits = bits;
					return Z_NEED_DICT;
				}
				strm.adler = state.check = 1;
				state.mode = TYPE;
			case TYPE: if (flush === Z_BLOCK || flush === Z_TREES) break inf_leave;
			case TYPEDO:
				if (state.last) {
					hold >>>= bits & 7;
					bits -= bits & 7;
					state.mode = CHECK;
					break;
				}
				while (bits < 3) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				state.last = hold & 1;
				hold >>>= 1;
				bits -= 1;
				switch (hold & 3) {
					case 0:
						state.mode = STORED;
						break;
					case 1:
						fixedtables(state);
						state.mode = LEN_;
						if (flush === Z_TREES) {
							hold >>>= 2;
							bits -= 2;
							break inf_leave;
						}
						break;
					case 2:
						state.mode = TABLE;
						break;
					case 3:
						strm.msg = "invalid block type";
						state.mode = BAD;
				}
				hold >>>= 2;
				bits -= 2;
				break;
			case STORED:
				hold >>>= bits & 7;
				bits -= bits & 7;
				while (bits < 32) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
					strm.msg = "invalid stored block lengths";
					state.mode = BAD;
					break;
				}
				state.length = hold & 65535;
				hold = 0;
				bits = 0;
				state.mode = COPY_;
				if (flush === Z_TREES) break inf_leave;
			case COPY_: state.mode = COPY;
			case COPY:
				copy = state.length;
				if (copy) {
					if (copy > have) copy = have;
					if (copy > left) copy = left;
					if (copy === 0) break inf_leave;
					utils.arraySet(output, input, next, copy, put);
					have -= copy;
					next += copy;
					left -= copy;
					put += copy;
					state.length -= copy;
					break;
				}
				state.mode = TYPE;
				break;
			case TABLE:
				while (bits < 14) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				state.nlen = (hold & 31) + 257;
				hold >>>= 5;
				bits -= 5;
				state.ndist = (hold & 31) + 1;
				hold >>>= 5;
				bits -= 5;
				state.ncode = (hold & 15) + 4;
				hold >>>= 4;
				bits -= 4;
				if (state.nlen > 286 || state.ndist > 30) {
					strm.msg = "too many length or distance symbols";
					state.mode = BAD;
					break;
				}
				state.have = 0;
				state.mode = LENLENS;
			case LENLENS:
				while (state.have < state.ncode) {
					while (bits < 3) {
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					state.lens[order[state.have++]] = hold & 7;
					hold >>>= 3;
					bits -= 3;
				}
				while (state.have < 19) state.lens[order[state.have++]] = 0;
				state.lencode = state.lendyn;
				state.lenbits = 7;
				opts = { bits: state.lenbits };
				ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
				state.lenbits = opts.bits;
				if (ret) {
					strm.msg = "invalid code lengths set";
					state.mode = BAD;
					break;
				}
				state.have = 0;
				state.mode = CODELENS;
			case CODELENS:
				while (state.have < state.nlen + state.ndist) {
					for (;;) {
						here = state.lencode[hold & (1 << state.lenbits) - 1];
						here_bits = here >>> 24;
						here_op = here >>> 16 & 255;
						here_val = here & 65535;
						if (here_bits <= bits) break;
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					if (here_val < 16) {
						hold >>>= here_bits;
						bits -= here_bits;
						state.lens[state.have++] = here_val;
					} else {
						if (here_val === 16) {
							n = here_bits + 2;
							while (bits < n) {
								if (have === 0) break inf_leave;
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							hold >>>= here_bits;
							bits -= here_bits;
							if (state.have === 0) {
								strm.msg = "invalid bit length repeat";
								state.mode = BAD;
								break;
							}
							len = state.lens[state.have - 1];
							copy = 3 + (hold & 3);
							hold >>>= 2;
							bits -= 2;
						} else if (here_val === 17) {
							n = here_bits + 3;
							while (bits < n) {
								if (have === 0) break inf_leave;
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							hold >>>= here_bits;
							bits -= here_bits;
							len = 0;
							copy = 3 + (hold & 7);
							hold >>>= 3;
							bits -= 3;
						} else {
							n = here_bits + 7;
							while (bits < n) {
								if (have === 0) break inf_leave;
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							hold >>>= here_bits;
							bits -= here_bits;
							len = 0;
							copy = 11 + (hold & 127);
							hold >>>= 7;
							bits -= 7;
						}
						if (state.have + copy > state.nlen + state.ndist) {
							strm.msg = "invalid bit length repeat";
							state.mode = BAD;
							break;
						}
						while (copy--) state.lens[state.have++] = len;
					}
				}
				if (state.mode === BAD) break;
				if (state.lens[256] === 0) {
					strm.msg = "invalid code -- missing end-of-block";
					state.mode = BAD;
					break;
				}
				state.lenbits = 9;
				opts = { bits: state.lenbits };
				ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
				state.lenbits = opts.bits;
				if (ret) {
					strm.msg = "invalid literal/lengths set";
					state.mode = BAD;
					break;
				}
				state.distbits = 6;
				state.distcode = state.distdyn;
				opts = { bits: state.distbits };
				ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
				state.distbits = opts.bits;
				if (ret) {
					strm.msg = "invalid distances set";
					state.mode = BAD;
					break;
				}
				state.mode = LEN_;
				if (flush === Z_TREES) break inf_leave;
			case LEN_: state.mode = LEN;
			case LEN:
				if (have >= 6 && left >= 258) {
					strm.next_out = put;
					strm.avail_out = left;
					strm.next_in = next;
					strm.avail_in = have;
					state.hold = hold;
					state.bits = bits;
					inflate_fast(strm, _out);
					put = strm.next_out;
					output = strm.output;
					left = strm.avail_out;
					next = strm.next_in;
					input = strm.input;
					have = strm.avail_in;
					hold = state.hold;
					bits = state.bits;
					if (state.mode === TYPE) state.back = -1;
					break;
				}
				state.back = 0;
				for (;;) {
					here = state.lencode[hold & (1 << state.lenbits) - 1];
					here_bits = here >>> 24;
					here_op = here >>> 16 & 255;
					here_val = here & 65535;
					if (here_bits <= bits) break;
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if (here_op && (here_op & 240) === 0) {
					last_bits = here_bits;
					last_op = here_op;
					last_val = here_val;
					for (;;) {
						here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
						here_bits = here >>> 24;
						here_op = here >>> 16 & 255;
						here_val = here & 65535;
						if (last_bits + here_bits <= bits) break;
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					hold >>>= last_bits;
					bits -= last_bits;
					state.back += last_bits;
				}
				hold >>>= here_bits;
				bits -= here_bits;
				state.back += here_bits;
				state.length = here_val;
				if (here_op === 0) {
					state.mode = LIT;
					break;
				}
				if (here_op & 32) {
					state.back = -1;
					state.mode = TYPE;
					break;
				}
				if (here_op & 64) {
					strm.msg = "invalid literal/length code";
					state.mode = BAD;
					break;
				}
				state.extra = here_op & 15;
				state.mode = LENEXT;
			case LENEXT:
				if (state.extra) {
					n = state.extra;
					while (bits < n) {
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					state.length += hold & (1 << state.extra) - 1;
					hold >>>= state.extra;
					bits -= state.extra;
					state.back += state.extra;
				}
				state.was = state.length;
				state.mode = DIST;
			case DIST:
				for (;;) {
					here = state.distcode[hold & (1 << state.distbits) - 1];
					here_bits = here >>> 24;
					here_op = here >>> 16 & 255;
					here_val = here & 65535;
					if (here_bits <= bits) break;
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if ((here_op & 240) === 0) {
					last_bits = here_bits;
					last_op = here_op;
					last_val = here_val;
					for (;;) {
						here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
						here_bits = here >>> 24;
						here_op = here >>> 16 & 255;
						here_val = here & 65535;
						if (last_bits + here_bits <= bits) break;
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					hold >>>= last_bits;
					bits -= last_bits;
					state.back += last_bits;
				}
				hold >>>= here_bits;
				bits -= here_bits;
				state.back += here_bits;
				if (here_op & 64) {
					strm.msg = "invalid distance code";
					state.mode = BAD;
					break;
				}
				state.offset = here_val;
				state.extra = here_op & 15;
				state.mode = DISTEXT;
			case DISTEXT:
				if (state.extra) {
					n = state.extra;
					while (bits < n) {
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					state.offset += hold & (1 << state.extra) - 1;
					hold >>>= state.extra;
					bits -= state.extra;
					state.back += state.extra;
				}
				if (state.offset > state.dmax) {
					strm.msg = "invalid distance too far back";
					state.mode = BAD;
					break;
				}
				state.mode = MATCH;
			case MATCH:
				if (left === 0) break inf_leave;
				copy = _out - left;
				if (state.offset > copy) {
					copy = state.offset - copy;
					if (copy > state.whave) {
						if (state.sane) {
							strm.msg = "invalid distance too far back";
							state.mode = BAD;
							break;
						}
					}
					if (copy > state.wnext) {
						copy -= state.wnext;
						from = state.wsize - copy;
					} else from = state.wnext - copy;
					if (copy > state.length) copy = state.length;
					from_source = state.window;
				} else {
					from_source = output;
					from = put - state.offset;
					copy = state.length;
				}
				if (copy > left) copy = left;
				left -= copy;
				state.length -= copy;
				do
					output[put++] = from_source[from++];
				while (--copy);
				if (state.length === 0) state.mode = LEN;
				break;
			case LIT:
				if (left === 0) break inf_leave;
				output[put++] = state.length;
				left--;
				state.mode = LEN;
				break;
			case CHECK:
				if (state.wrap) {
					while (bits < 32) {
						if (have === 0) break inf_leave;
						have--;
						hold |= input[next++] << bits;
						bits += 8;
					}
					_out -= left;
					strm.total_out += _out;
					state.total += _out;
					if (_out) strm.adler = state.check = state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
					_out = left;
					if ((state.flags ? hold : zswap32(hold)) !== state.check) {
						strm.msg = "incorrect data check";
						state.mode = BAD;
						break;
					}
					hold = 0;
					bits = 0;
				}
				state.mode = LENGTH;
			case LENGTH:
				if (state.wrap && state.flags) {
					while (bits < 32) {
						if (have === 0) break inf_leave;
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					if (hold !== (state.total & 4294967295)) {
						strm.msg = "incorrect length check";
						state.mode = BAD;
						break;
					}
					hold = 0;
					bits = 0;
				}
				state.mode = DONE;
			case DONE:
				ret = Z_STREAM_END;
				break inf_leave;
			case BAD:
				ret = Z_DATA_ERROR;
				break inf_leave;
			case MEM: return Z_MEM_ERROR;
			case SYNC:
			default: return Z_STREAM_ERROR;
		}
		strm.next_out = put;
		strm.avail_out = left;
		strm.next_in = next;
		strm.avail_in = have;
		state.hold = hold;
		state.bits = bits;
		if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) {
			if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
				state.mode = MEM;
				return Z_MEM_ERROR;
			}
		}
		_in -= strm.avail_in;
		_out -= strm.avail_out;
		strm.total_in += _in;
		strm.total_out += _out;
		state.total += _out;
		if (state.wrap && _out) strm.adler = state.check = state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
		strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
		if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) ret = Z_BUF_ERROR;
		return ret;
	}
	function inflateEnd(strm) {
		if (!strm || !strm.state) return Z_STREAM_ERROR;
		var state = strm.state;
		if (state.window) state.window = null;
		strm.state = null;
		return Z_OK;
	}
	function inflateGetHeader(strm, head) {
		var state;
		if (!strm || !strm.state) return Z_STREAM_ERROR;
		state = strm.state;
		if ((state.wrap & 2) === 0) return Z_STREAM_ERROR;
		state.head = head;
		head.done = false;
		return Z_OK;
	}
	function inflateSetDictionary(strm, dictionary) {
		var dictLength = dictionary.length;
		var state;
		var dictid;
		var ret;
		if (!strm || !strm.state) return Z_STREAM_ERROR;
		state = strm.state;
		if (state.wrap !== 0 && state.mode !== DICT) return Z_STREAM_ERROR;
		if (state.mode === DICT) {
			dictid = 1;
			dictid = adler32(dictid, dictionary, dictLength, 0);
			if (dictid !== state.check) return Z_DATA_ERROR;
		}
		ret = updatewindow(strm, dictionary, dictLength, dictLength);
		if (ret) {
			state.mode = MEM;
			return Z_MEM_ERROR;
		}
		state.havedict = 1;
		return Z_OK;
	}
	exports.inflateReset = inflateReset;
	exports.inflateReset2 = inflateReset2;
	exports.inflateResetKeep = inflateResetKeep;
	exports.inflateInit = inflateInit;
	exports.inflateInit2 = inflateInit2;
	exports.inflate = inflate;
	exports.inflateEnd = inflateEnd;
	exports.inflateGetHeader = inflateGetHeader;
	exports.inflateSetDictionary = inflateSetDictionary;
	exports.inflateInfo = "pako inflate (from Nodeca project)";
}));
//#endregion
//#region node_modules/pako/lib/zlib/constants.js
var require_constants = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = {
		Z_NO_FLUSH: 0,
		Z_PARTIAL_FLUSH: 1,
		Z_SYNC_FLUSH: 2,
		Z_FULL_FLUSH: 3,
		Z_FINISH: 4,
		Z_BLOCK: 5,
		Z_TREES: 6,
		Z_OK: 0,
		Z_STREAM_END: 1,
		Z_NEED_DICT: 2,
		Z_ERRNO: -1,
		Z_STREAM_ERROR: -2,
		Z_DATA_ERROR: -3,
		Z_BUF_ERROR: -5,
		Z_NO_COMPRESSION: 0,
		Z_BEST_SPEED: 1,
		Z_BEST_COMPRESSION: 9,
		Z_DEFAULT_COMPRESSION: -1,
		Z_FILTERED: 1,
		Z_HUFFMAN_ONLY: 2,
		Z_RLE: 3,
		Z_FIXED: 4,
		Z_DEFAULT_STRATEGY: 0,
		Z_BINARY: 0,
		Z_TEXT: 1,
		Z_UNKNOWN: 2,
		Z_DEFLATED: 8
	};
}));
//#endregion
//#region node_modules/pako/lib/zlib/gzheader.js
var require_gzheader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	function GZheader() {
		this.text = 0;
		this.time = 0;
		this.xflags = 0;
		this.os = 0;
		this.extra = null;
		this.extra_len = 0;
		this.name = "";
		this.comment = "";
		this.hcrc = 0;
		this.done = false;
	}
	module.exports = GZheader;
}));
//#endregion
//#region node_modules/pako/lib/inflate.js
var require_inflate = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var zlib_inflate = require_inflate$1();
	var utils = require_common();
	var strings = require_strings();
	var c = require_constants();
	var msg = require_messages();
	var ZStream = require_zstream();
	var GZheader = require_gzheader();
	var toString = Object.prototype.toString;
	/**
	* class Inflate
	*
	* Generic JS-style wrapper for zlib calls. If you don't need
	* streaming behaviour - use more simple functions: [[inflate]]
	* and [[inflateRaw]].
	**/
	/**
	* Inflate.result -> Uint8Array|Array|String
	*
	* Uncompressed result, generated by default [[Inflate#onData]]
	* and [[Inflate#onEnd]] handlers. Filled after you push last chunk
	* (call [[Inflate#push]] with `Z_FINISH` / `true` param) or if you
	* push a chunk with explicit flush (call [[Inflate#push]] with
	* `Z_SYNC_FLUSH` param).
	**/
	/**
	* Inflate.err -> Number
	*
	* Error code after inflate finished. 0 (Z_OK) on success.
	* Should be checked if broken data possible.
	**/
	/**
	* Inflate.msg -> String
	*
	* Error message, if [[Inflate.err]] != 0
	**/
	/**
	* new Inflate(options)
	* - options (Object): zlib inflate options.
	*
	* Creates new inflator instance with specified params. Throws exception
	* on bad params. Supported options:
	*
	* - `windowBits`
	* - `dictionary`
	*
	* [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	* for more information on these.
	*
	* Additional options, for internal needs:
	*
	* - `chunkSize` - size of generated data chunks (16K by default)
	* - `raw` (Boolean) - do raw inflate
	* - `to` (String) - if equal to 'string', then result will be converted
	*   from utf8 to utf16 (javascript) string. When string output requested,
	*   chunk length can differ from `chunkSize`, depending on content.
	*
	* By default, when no options set, autodetect deflate/gzip data format via
	* wrapper header.
	*
	* ##### Example:
	*
	* ```javascript
	* var pako = require('pako')
	*   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
	*   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
	*
	* var inflate = new pako.Inflate({ level: 3});
	*
	* inflate.push(chunk1, false);
	* inflate.push(chunk2, true);  // true -> last chunk
	*
	* if (inflate.err) { throw new Error(inflate.err); }
	*
	* console.log(inflate.result);
	* ```
	**/
	function Inflate(options) {
		if (!(this instanceof Inflate)) return new Inflate(options);
		this.options = utils.assign({
			chunkSize: 16384,
			windowBits: 0,
			to: ""
		}, options || {});
		var opt = this.options;
		if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
			opt.windowBits = -opt.windowBits;
			if (opt.windowBits === 0) opt.windowBits = -15;
		}
		if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) opt.windowBits += 32;
		if (opt.windowBits > 15 && opt.windowBits < 48) {
			if ((opt.windowBits & 15) === 0) opt.windowBits |= 15;
		}
		this.err = 0;
		this.msg = "";
		this.ended = false;
		this.chunks = [];
		this.strm = new ZStream();
		this.strm.avail_out = 0;
		var status = zlib_inflate.inflateInit2(this.strm, opt.windowBits);
		if (status !== c.Z_OK) throw new Error(msg[status]);
		this.header = new GZheader();
		zlib_inflate.inflateGetHeader(this.strm, this.header);
		if (opt.dictionary) {
			if (typeof opt.dictionary === "string") opt.dictionary = strings.string2buf(opt.dictionary);
			else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") opt.dictionary = new Uint8Array(opt.dictionary);
			if (opt.raw) {
				status = zlib_inflate.inflateSetDictionary(this.strm, opt.dictionary);
				if (status !== c.Z_OK) throw new Error(msg[status]);
			}
		}
	}
	/**
	* Inflate#push(data[, mode]) -> Boolean
	* - data (Uint8Array|Array|ArrayBuffer|String): input data
	* - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
	*   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
	*
	* Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
	* new output chunks. Returns `true` on success. The last data block must have
	* mode Z_FINISH (or `true`). That will flush internal pending buffers and call
	* [[Inflate#onEnd]]. For interim explicit flushes (without ending the stream) you
	* can use mode Z_SYNC_FLUSH, keeping the decompression context.
	*
	* On fail call [[Inflate#onEnd]] with error code and return false.
	*
	* We strongly recommend to use `Uint8Array` on input for best speed (output
	* format is detected automatically). Also, don't skip last param and always
	* use the same type in your code (boolean or number). That will improve JS speed.
	*
	* For regular `Array`-s make sure all elements are [0..255].
	*
	* ##### Example
	*
	* ```javascript
	* push(chunk, false); // push one of data chunks
	* ...
	* push(chunk, true);  // push last chunk
	* ```
	**/
	Inflate.prototype.push = function(data, mode) {
		var strm = this.strm;
		var chunkSize = this.options.chunkSize;
		var dictionary = this.options.dictionary;
		var status, _mode;
		var next_out_utf8, tail, utf8str;
		var allowBufError = false;
		if (this.ended) return false;
		_mode = mode === ~~mode ? mode : mode === true ? c.Z_FINISH : c.Z_NO_FLUSH;
		if (typeof data === "string") strm.input = strings.binstring2buf(data);
		else if (toString.call(data) === "[object ArrayBuffer]") strm.input = new Uint8Array(data);
		else strm.input = data;
		strm.next_in = 0;
		strm.avail_in = strm.input.length;
		do {
			if (strm.avail_out === 0) {
				strm.output = new utils.Buf8(chunkSize);
				strm.next_out = 0;
				strm.avail_out = chunkSize;
			}
			status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);
			if (status === c.Z_NEED_DICT && dictionary) status = zlib_inflate.inflateSetDictionary(this.strm, dictionary);
			if (status === c.Z_BUF_ERROR && allowBufError === true) {
				status = c.Z_OK;
				allowBufError = false;
			}
			if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
				this.onEnd(status);
				this.ended = true;
				return false;
			}
			if (strm.next_out) {
				if (strm.avail_out === 0 || status === c.Z_STREAM_END || strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH)) if (this.options.to === "string") {
					next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
					tail = strm.next_out - next_out_utf8;
					utf8str = strings.buf2string(strm.output, next_out_utf8);
					strm.next_out = tail;
					strm.avail_out = chunkSize - tail;
					if (tail) utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0);
					this.onData(utf8str);
				} else this.onData(utils.shrinkBuf(strm.output, strm.next_out));
			}
			if (strm.avail_in === 0 && strm.avail_out === 0) allowBufError = true;
		} while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);
		if (status === c.Z_STREAM_END) _mode = c.Z_FINISH;
		if (_mode === c.Z_FINISH) {
			status = zlib_inflate.inflateEnd(this.strm);
			this.onEnd(status);
			this.ended = true;
			return status === c.Z_OK;
		}
		if (_mode === c.Z_SYNC_FLUSH) {
			this.onEnd(c.Z_OK);
			strm.avail_out = 0;
			return true;
		}
		return true;
	};
	/**
	* Inflate#onData(chunk) -> Void
	* - chunk (Uint8Array|Array|String): output data. Type of array depends
	*   on js engine support. When string output requested, each chunk
	*   will be string.
	*
	* By default, stores data blocks in `chunks[]` property and glue
	* those in `onEnd`. Override this handler, if you need another behaviour.
	**/
	Inflate.prototype.onData = function(chunk) {
		this.chunks.push(chunk);
	};
	/**
	* Inflate#onEnd(status) -> Void
	* - status (Number): inflate status. 0 (Z_OK) on success,
	*   other if not.
	*
	* Called either after you tell inflate that the input stream is
	* complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
	* or if an error happened. By default - join collected chunks,
	* free memory and fill `results` / `err` properties.
	**/
	Inflate.prototype.onEnd = function(status) {
		if (status === c.Z_OK) if (this.options.to === "string") this.result = this.chunks.join("");
		else this.result = utils.flattenChunks(this.chunks);
		this.chunks = [];
		this.err = status;
		this.msg = this.strm.msg;
	};
	/**
	* inflate(data[, options]) -> Uint8Array|Array|String
	* - data (Uint8Array|Array|String): input data to decompress.
	* - options (Object): zlib inflate options.
	*
	* Decompress `data` with inflate/ungzip and `options`. Autodetect
	* format via wrapper header by default. That's why we don't provide
	* separate `ungzip` method.
	*
	* Supported options are:
	*
	* - windowBits
	*
	* [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	* for more information.
	*
	* Sugar (options):
	*
	* - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
	*   negative windowBits implicitly.
	* - `to` (String) - if equal to 'string', then result will be converted
	*   from utf8 to utf16 (javascript) string. When string output requested,
	*   chunk length can differ from `chunkSize`, depending on content.
	*
	*
	* ##### Example:
	*
	* ```javascript
	* var pako = require('pako')
	*   , input = pako.deflate([1,2,3,4,5,6,7,8,9])
	*   , output;
	*
	* try {
	*   output = pako.inflate(input);
	* } catch (err)
	*   console.log(err);
	* }
	* ```
	**/
	function inflate(input, options) {
		var inflator = new Inflate(options);
		inflator.push(input, true);
		if (inflator.err) throw inflator.msg || msg[inflator.err];
		return inflator.result;
	}
	/**
	* inflateRaw(data[, options]) -> Uint8Array|Array|String
	* - data (Uint8Array|Array|String): input data to decompress.
	* - options (Object): zlib inflate options.
	*
	* The same as [[inflate]], but creates raw data, without wrapper
	* (header and adler32 crc).
	**/
	function inflateRaw(input, options) {
		options = options || {};
		options.raw = true;
		return inflate(input, options);
	}
	/**
	* ungzip(data[, options]) -> Uint8Array|Array|String
	* - data (Uint8Array|Array|String): input data to decompress.
	* - options (Object): zlib inflate options.
	*
	* Just shortcut to [[inflate]], because it autodetects format
	* by header.content. Done for convenience.
	**/
	exports.Inflate = Inflate;
	exports.inflate = inflate;
	exports.inflateRaw = inflateRaw;
	exports.ungzip = inflate;
}));
//#endregion
//#region node_modules/pako/index.js
var require_pako = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var assign = require_common().assign;
	var deflate = require_deflate();
	var inflate = require_inflate();
	var constants = require_constants();
	var pako = {};
	assign(pako, deflate, inflate, constants);
	module.exports = pako;
}));
//#endregion
//#region node_modules/jszip/lib/flate.js
var require_flate = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var USE_TYPEDARRAY = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Uint32Array !== "undefined";
	var pako = require_pako();
	var utils = require_utils();
	var GenericWorker = require_GenericWorker();
	var ARRAY_TYPE = USE_TYPEDARRAY ? "uint8array" : "array";
	exports.magic = "\b\0";
	/**
	* Create a worker that uses pako to inflate/deflate.
	* @constructor
	* @param {String} action the name of the pako function to call : either "Deflate" or "Inflate".
	* @param {Object} options the options to use when (de)compressing.
	*/
	function FlateWorker(action, options) {
		GenericWorker.call(this, "FlateWorker/" + action);
		this._pako = null;
		this._pakoAction = action;
		this._pakoOptions = options;
		this.meta = {};
	}
	utils.inherits(FlateWorker, GenericWorker);
	/**
	* @see GenericWorker.processChunk
	*/
	FlateWorker.prototype.processChunk = function(chunk) {
		this.meta = chunk.meta;
		if (this._pako === null) this._createPako();
		this._pako.push(utils.transformTo(ARRAY_TYPE, chunk.data), false);
	};
	/**
	* @see GenericWorker.flush
	*/
	FlateWorker.prototype.flush = function() {
		GenericWorker.prototype.flush.call(this);
		if (this._pako === null) this._createPako();
		this._pako.push([], true);
	};
	/**
	* @see GenericWorker.cleanUp
	*/
	FlateWorker.prototype.cleanUp = function() {
		GenericWorker.prototype.cleanUp.call(this);
		this._pako = null;
	};
	/**
	* Create the _pako object.
	* TODO: lazy-loading this object isn't the best solution but it's the
	* quickest. The best solution is to lazy-load the worker list. See also the
	* issue #446.
	*/
	FlateWorker.prototype._createPako = function() {
		this._pako = new pako[this._pakoAction]({
			raw: true,
			level: this._pakoOptions.level || -1
		});
		var self = this;
		this._pako.onData = function(data) {
			self.push({
				data,
				meta: self.meta
			});
		};
	};
	exports.compressWorker = function(compressionOptions) {
		return new FlateWorker("Deflate", compressionOptions);
	};
	exports.uncompressWorker = function() {
		return new FlateWorker("Inflate", {});
	};
}));
//#endregion
//#region node_modules/jszip/lib/compressions.js
var require_compressions = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var GenericWorker = require_GenericWorker();
	exports.STORE = {
		magic: "\0\0",
		compressWorker: function() {
			return new GenericWorker("STORE compression");
		},
		uncompressWorker: function() {
			return new GenericWorker("STORE decompression");
		}
	};
	exports.DEFLATE = require_flate();
}));
//#endregion
//#region node_modules/jszip/lib/signature.js
var require_signature = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.LOCAL_FILE_HEADER = "PK";
	exports.CENTRAL_FILE_HEADER = "PK";
	exports.CENTRAL_DIRECTORY_END = "PK";
	exports.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07";
	exports.ZIP64_CENTRAL_DIRECTORY_END = "PK";
	exports.DATA_DESCRIPTOR = "PK\x07\b";
}));
//#endregion
//#region node_modules/jszip/lib/generate/ZipFileWorker.js
var require_ZipFileWorker = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var utils = require_utils();
	var GenericWorker = require_GenericWorker();
	var utf8 = require_utf8();
	var crc32 = require_crc32$1();
	var signature = require_signature();
	/**
	* Transform an integer into a string in hexadecimal.
	* @private
	* @param {number} dec the number to convert.
	* @param {number} bytes the number of bytes to generate.
	* @returns {string} the result.
	*/
	var decToHex = function(dec, bytes) {
		var hex = "", i;
		for (i = 0; i < bytes; i++) {
			hex += String.fromCharCode(dec & 255);
			dec = dec >>> 8;
		}
		return hex;
	};
	/**
	* Generate the UNIX part of the external file attributes.
	* @param {Object} unixPermissions the unix permissions or null.
	* @param {Boolean} isDir true if the entry is a directory, false otherwise.
	* @return {Number} a 32 bit integer.
	*
	* adapted from http://unix.stackexchange.com/questions/14705/the-zip-formats-external-file-attribute :
	*
	* TTTTsstrwxrwxrwx0000000000ADVSHR
	* ^^^^____________________________ file type, see zipinfo.c (UNX_*)
	*     ^^^_________________________ setuid, setgid, sticky
	*        ^^^^^^^^^________________ permissions
	*                 ^^^^^^^^^^______ not used ?
	*                           ^^^^^^ DOS attribute bits : Archive, Directory, Volume label, System file, Hidden, Read only
	*/
	var generateUnixExternalFileAttr = function(unixPermissions, isDir) {
		var result = unixPermissions;
		if (!unixPermissions) result = isDir ? 16893 : 33204;
		return (result & 65535) << 16;
	};
	/**
	* Generate the DOS part of the external file attributes.
	* @param {Object} dosPermissions the dos permissions or null.
	* @param {Boolean} isDir true if the entry is a directory, false otherwise.
	* @return {Number} a 32 bit integer.
	*
	* Bit 0     Read-Only
	* Bit 1     Hidden
	* Bit 2     System
	* Bit 3     Volume Label
	* Bit 4     Directory
	* Bit 5     Archive
	*/
	var generateDosExternalFileAttr = function(dosPermissions) {
		return (dosPermissions || 0) & 63;
	};
	/**
	* Generate the various parts used in the construction of the final zip file.
	* @param {Object} streamInfo the hash with information about the compressed file.
	* @param {Boolean} streamedContent is the content streamed ?
	* @param {Boolean} streamingEnded is the stream finished ?
	* @param {number} offset the current offset from the start of the zip file.
	* @param {String} platform let's pretend we are this platform (change platform dependents fields)
	* @param {Function} encodeFileName the function to encode the file name / comment.
	* @return {Object} the zip parts.
	*/
	var generateZipParts = function(streamInfo, streamedContent, streamingEnded, offset, platform, encodeFileName) {
		var file = streamInfo["file"], compression = streamInfo["compression"], useCustomEncoding = encodeFileName !== utf8.utf8encode, encodedFileName = utils.transformTo("string", encodeFileName(file.name)), utfEncodedFileName = utils.transformTo("string", utf8.utf8encode(file.name)), comment = file.comment, encodedComment = utils.transformTo("string", encodeFileName(comment)), utfEncodedComment = utils.transformTo("string", utf8.utf8encode(comment)), useUTF8ForFileName = utfEncodedFileName.length !== file.name.length, useUTF8ForComment = utfEncodedComment.length !== comment.length, dosTime, dosDate, extraFields = "", unicodePathExtraField = "", unicodeCommentExtraField = "", dir = file.dir, date = file.date;
		var dataInfo = {
			crc32: 0,
			compressedSize: 0,
			uncompressedSize: 0
		};
		if (!streamedContent || streamingEnded) {
			dataInfo.crc32 = streamInfo["crc32"];
			dataInfo.compressedSize = streamInfo["compressedSize"];
			dataInfo.uncompressedSize = streamInfo["uncompressedSize"];
		}
		var bitflag = 0;
		if (streamedContent) bitflag |= 8;
		if (!useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment)) bitflag |= 2048;
		var extFileAttr = 0;
		var versionMadeBy = 0;
		if (dir) extFileAttr |= 16;
		if (platform === "UNIX") {
			versionMadeBy = 798;
			extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir);
		} else {
			versionMadeBy = 20;
			extFileAttr |= generateDosExternalFileAttr(file.dosPermissions, dir);
		}
		dosTime = date.getUTCHours();
		dosTime = dosTime << 6;
		dosTime = dosTime | date.getUTCMinutes();
		dosTime = dosTime << 5;
		dosTime = dosTime | date.getUTCSeconds() / 2;
		dosDate = date.getUTCFullYear() - 1980;
		dosDate = dosDate << 4;
		dosDate = dosDate | date.getUTCMonth() + 1;
		dosDate = dosDate << 5;
		dosDate = dosDate | date.getUTCDate();
		if (useUTF8ForFileName) {
			unicodePathExtraField = decToHex(1, 1) + decToHex(crc32(encodedFileName), 4) + utfEncodedFileName;
			extraFields += "up" + decToHex(unicodePathExtraField.length, 2) + unicodePathExtraField;
		}
		if (useUTF8ForComment) {
			unicodeCommentExtraField = decToHex(1, 1) + decToHex(crc32(encodedComment), 4) + utfEncodedComment;
			extraFields += "uc" + decToHex(unicodeCommentExtraField.length, 2) + unicodeCommentExtraField;
		}
		var header = "";
		header += "\n\0";
		header += decToHex(bitflag, 2);
		header += compression.magic;
		header += decToHex(dosTime, 2);
		header += decToHex(dosDate, 2);
		header += decToHex(dataInfo.crc32, 4);
		header += decToHex(dataInfo.compressedSize, 4);
		header += decToHex(dataInfo.uncompressedSize, 4);
		header += decToHex(encodedFileName.length, 2);
		header += decToHex(extraFields.length, 2);
		return {
			fileRecord: signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields,
			dirRecord: signature.CENTRAL_FILE_HEADER + decToHex(versionMadeBy, 2) + header + decToHex(encodedComment.length, 2) + "\0\0\0\0" + decToHex(extFileAttr, 4) + decToHex(offset, 4) + encodedFileName + extraFields + encodedComment
		};
	};
	/**
	* Generate the EOCD record.
	* @param {Number} entriesCount the number of entries in the zip file.
	* @param {Number} centralDirLength the length (in bytes) of the central dir.
	* @param {Number} localDirLength the length (in bytes) of the local dir.
	* @param {String} comment the zip file comment as a binary string.
	* @param {Function} encodeFileName the function to encode the comment.
	* @return {String} the EOCD record.
	*/
	var generateCentralDirectoryEnd = function(entriesCount, centralDirLength, localDirLength, comment, encodeFileName) {
		var dirEnd = "";
		var encodedComment = utils.transformTo("string", encodeFileName(comment));
		dirEnd = signature.CENTRAL_DIRECTORY_END + "\0\0\0\0" + decToHex(entriesCount, 2) + decToHex(entriesCount, 2) + decToHex(centralDirLength, 4) + decToHex(localDirLength, 4) + decToHex(encodedComment.length, 2) + encodedComment;
		return dirEnd;
	};
	/**
	* Generate data descriptors for a file entry.
	* @param {Object} streamInfo the hash generated by a worker, containing information
	* on the file entry.
	* @return {String} the data descriptors.
	*/
	var generateDataDescriptors = function(streamInfo) {
		var descriptor = "";
		descriptor = signature.DATA_DESCRIPTOR + decToHex(streamInfo["crc32"], 4) + decToHex(streamInfo["compressedSize"], 4) + decToHex(streamInfo["uncompressedSize"], 4);
		return descriptor;
	};
	/**
	* A worker to concatenate other workers to create a zip file.
	* @param {Boolean} streamFiles `true` to stream the content of the files,
	* `false` to accumulate it.
	* @param {String} comment the comment to use.
	* @param {String} platform the platform to use, "UNIX" or "DOS".
	* @param {Function} encodeFileName the function to encode file names and comments.
	*/
	function ZipFileWorker(streamFiles, comment, platform, encodeFileName) {
		GenericWorker.call(this, "ZipFileWorker");
		this.bytesWritten = 0;
		this.zipComment = comment;
		this.zipPlatform = platform;
		this.encodeFileName = encodeFileName;
		this.streamFiles = streamFiles;
		this.accumulate = false;
		this.contentBuffer = [];
		this.dirRecords = [];
		this.currentSourceOffset = 0;
		this.entriesCount = 0;
		this.currentFile = null;
		this._sources = [];
	}
	utils.inherits(ZipFileWorker, GenericWorker);
	/**
	* @see GenericWorker.push
	*/
	ZipFileWorker.prototype.push = function(chunk) {
		var currentFilePercent = chunk.meta.percent || 0;
		var entriesCount = this.entriesCount;
		var remainingFiles = this._sources.length;
		if (this.accumulate) this.contentBuffer.push(chunk);
		else {
			this.bytesWritten += chunk.data.length;
			GenericWorker.prototype.push.call(this, {
				data: chunk.data,
				meta: {
					currentFile: this.currentFile,
					percent: entriesCount ? (currentFilePercent + 100 * (entriesCount - remainingFiles - 1)) / entriesCount : 100
				}
			});
		}
	};
	/**
	* The worker started a new source (an other worker).
	* @param {Object} streamInfo the streamInfo object from the new source.
	*/
	ZipFileWorker.prototype.openedSource = function(streamInfo) {
		this.currentSourceOffset = this.bytesWritten;
		this.currentFile = streamInfo["file"].name;
		var streamedContent = this.streamFiles && !streamInfo["file"].dir;
		if (streamedContent) {
			var record = generateZipParts(streamInfo, streamedContent, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
			this.push({
				data: record.fileRecord,
				meta: { percent: 0 }
			});
		} else this.accumulate = true;
	};
	/**
	* The worker finished a source (an other worker).
	* @param {Object} streamInfo the streamInfo object from the finished source.
	*/
	ZipFileWorker.prototype.closedSource = function(streamInfo) {
		this.accumulate = false;
		var streamedContent = this.streamFiles && !streamInfo["file"].dir;
		var record = generateZipParts(streamInfo, streamedContent, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
		this.dirRecords.push(record.dirRecord);
		if (streamedContent) this.push({
			data: generateDataDescriptors(streamInfo),
			meta: { percent: 100 }
		});
		else {
			this.push({
				data: record.fileRecord,
				meta: { percent: 0 }
			});
			while (this.contentBuffer.length) this.push(this.contentBuffer.shift());
		}
		this.currentFile = null;
	};
	/**
	* @see GenericWorker.flush
	*/
	ZipFileWorker.prototype.flush = function() {
		var localDirLength = this.bytesWritten;
		for (var i = 0; i < this.dirRecords.length; i++) this.push({
			data: this.dirRecords[i],
			meta: { percent: 100 }
		});
		var centralDirLength = this.bytesWritten - localDirLength;
		var dirEnd = generateCentralDirectoryEnd(this.dirRecords.length, centralDirLength, localDirLength, this.zipComment, this.encodeFileName);
		this.push({
			data: dirEnd,
			meta: { percent: 100 }
		});
	};
	/**
	* Prepare the next source to be read.
	*/
	ZipFileWorker.prototype.prepareNextSource = function() {
		this.previous = this._sources.shift();
		this.openedSource(this.previous.streamInfo);
		if (this.isPaused) this.previous.pause();
		else this.previous.resume();
	};
	/**
	* @see GenericWorker.registerPrevious
	*/
	ZipFileWorker.prototype.registerPrevious = function(previous) {
		this._sources.push(previous);
		var self = this;
		previous.on("data", function(chunk) {
			self.processChunk(chunk);
		});
		previous.on("end", function() {
			self.closedSource(self.previous.streamInfo);
			if (self._sources.length) self.prepareNextSource();
			else self.end();
		});
		previous.on("error", function(e) {
			self.error(e);
		});
		return this;
	};
	/**
	* @see GenericWorker.resume
	*/
	ZipFileWorker.prototype.resume = function() {
		if (!GenericWorker.prototype.resume.call(this)) return false;
		if (!this.previous && this._sources.length) {
			this.prepareNextSource();
			return true;
		}
		if (!this.previous && !this._sources.length && !this.generatedError) {
			this.end();
			return true;
		}
	};
	/**
	* @see GenericWorker.error
	*/
	ZipFileWorker.prototype.error = function(e) {
		var sources = this._sources;
		if (!GenericWorker.prototype.error.call(this, e)) return false;
		for (var i = 0; i < sources.length; i++) try {
			sources[i].error(e);
		} catch (e) {}
		return true;
	};
	/**
	* @see GenericWorker.lock
	*/
	ZipFileWorker.prototype.lock = function() {
		GenericWorker.prototype.lock.call(this);
		var sources = this._sources;
		for (var i = 0; i < sources.length; i++) sources[i].lock();
	};
	module.exports = ZipFileWorker;
}));
//#endregion
//#region node_modules/jszip/lib/generate/index.js
var require_generate = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var compressions = require_compressions();
	var ZipFileWorker = require_ZipFileWorker();
	/**
	* Find the compression to use.
	* @param {String} fileCompression the compression defined at the file level, if any.
	* @param {String} zipCompression the compression defined at the load() level.
	* @return {Object} the compression object to use.
	*/
	var getCompression = function(fileCompression, zipCompression) {
		var compressionName = fileCompression || zipCompression;
		var compression = compressions[compressionName];
		if (!compression) throw new Error(compressionName + " is not a valid compression method !");
		return compression;
	};
	/**
	* Create a worker to generate a zip file.
	* @param {JSZip} zip the JSZip instance at the right root level.
	* @param {Object} options to generate the zip file.
	* @param {String} comment the comment to use.
	*/
	exports.generateWorker = function(zip, options, comment) {
		var zipFileWorker = new ZipFileWorker(options.streamFiles, comment, options.platform, options.encodeFileName);
		var entriesCount = 0;
		try {
			zip.forEach(function(relativePath, file) {
				entriesCount++;
				var compression = getCompression(file.options.compression, options.compression);
				var compressionOptions = file.options.compressionOptions || options.compressionOptions || {};
				var dir = file.dir, date = file.date;
				file._compressWorker(compression, compressionOptions).withStreamInfo("file", {
					name: relativePath,
					dir,
					date,
					comment: file.comment || "",
					unixPermissions: file.unixPermissions,
					dosPermissions: file.dosPermissions
				}).pipe(zipFileWorker);
			});
			zipFileWorker.entriesCount = entriesCount;
		} catch (e) {
			zipFileWorker.error(e);
		}
		return zipFileWorker;
	};
}));
//#endregion
//#region node_modules/jszip/lib/nodejs/NodejsStreamInputAdapter.js
var require_NodejsStreamInputAdapter = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var utils = require_utils();
	var GenericWorker = require_GenericWorker();
	/**
	* A worker that use a nodejs stream as source.
	* @constructor
	* @param {String} filename the name of the file entry for this stream.
	* @param {Readable} stream the nodejs stream.
	*/
	function NodejsStreamInputAdapter(filename, stream) {
		GenericWorker.call(this, "Nodejs stream input adapter for " + filename);
		this._upstreamEnded = false;
		this._bindStream(stream);
	}
	utils.inherits(NodejsStreamInputAdapter, GenericWorker);
	/**
	* Prepare the stream and bind the callbacks on it.
	* Do this ASAP on node 0.10 ! A lazy binding doesn't always work.
	* @param {Stream} stream the nodejs stream to use.
	*/
	NodejsStreamInputAdapter.prototype._bindStream = function(stream) {
		var self = this;
		this._stream = stream;
		stream.pause();
		stream.on("data", function(chunk) {
			self.push({
				data: chunk,
				meta: { percent: 0 }
			});
		}).on("error", function(e) {
			if (self.isPaused) this.generatedError = e;
			else self.error(e);
		}).on("end", function() {
			if (self.isPaused) self._upstreamEnded = true;
			else self.end();
		});
	};
	NodejsStreamInputAdapter.prototype.pause = function() {
		if (!GenericWorker.prototype.pause.call(this)) return false;
		this._stream.pause();
		return true;
	};
	NodejsStreamInputAdapter.prototype.resume = function() {
		if (!GenericWorker.prototype.resume.call(this)) return false;
		if (this._upstreamEnded) this.end();
		else this._stream.resume();
		return true;
	};
	module.exports = NodejsStreamInputAdapter;
}));
//#endregion
//#region node_modules/jszip/lib/object.js
var require_object = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var utf8 = require_utf8();
	var utils = require_utils();
	var GenericWorker = require_GenericWorker();
	var StreamHelper = require_StreamHelper();
	var defaults = require_defaults();
	var CompressedObject = require_compressedObject();
	var ZipObject = require_zipObject();
	var generate = require_generate();
	var nodejsUtils = require_nodejsUtils();
	var NodejsStreamInputAdapter = require_NodejsStreamInputAdapter();
	/**
	* Add a file in the current folder.
	* @private
	* @param {string} name the name of the file
	* @param {String|ArrayBuffer|Uint8Array|Buffer} data the data of the file
	* @param {Object} originalOptions the options of the file
	* @return {Object} the new file.
	*/
	var fileAdd = function(name, data, originalOptions) {
		var dataType = utils.getTypeOf(data), parent;
		var o = utils.extend(originalOptions || {}, defaults);
		o.date = o.date || /* @__PURE__ */ new Date();
		if (o.compression !== null) o.compression = o.compression.toUpperCase();
		if (typeof o.unixPermissions === "string") o.unixPermissions = parseInt(o.unixPermissions, 8);
		if (o.unixPermissions && o.unixPermissions & 16384) o.dir = true;
		if (o.dosPermissions && o.dosPermissions & 16) o.dir = true;
		if (o.dir) name = forceTrailingSlash(name);
		if (o.createFolders && (parent = parentFolder(name))) folderAdd.call(this, parent, true);
		var isUnicodeString = dataType === "string" && o.binary === false && o.base64 === false;
		if (!originalOptions || typeof originalOptions.binary === "undefined") o.binary = !isUnicodeString;
		if (data instanceof CompressedObject && data.uncompressedSize === 0 || o.dir || !data || data.length === 0) {
			o.base64 = false;
			o.binary = true;
			data = "";
			o.compression = "STORE";
			dataType = "string";
		}
		var zipObjectContent = null;
		if (data instanceof CompressedObject || data instanceof GenericWorker) zipObjectContent = data;
		else if (nodejsUtils.isNode && nodejsUtils.isStream(data)) zipObjectContent = new NodejsStreamInputAdapter(name, data);
		else zipObjectContent = utils.prepareContent(name, data, o.binary, o.optimizedBinaryString, o.base64);
		var object = new ZipObject(name, zipObjectContent, o);
		this.files[name] = object;
	};
	/**
	* Find the parent folder of the path.
	* @private
	* @param {string} path the path to use
	* @return {string} the parent folder, or ""
	*/
	var parentFolder = function(path) {
		if (path.slice(-1) === "/") path = path.substring(0, path.length - 1);
		var lastSlash = path.lastIndexOf("/");
		return lastSlash > 0 ? path.substring(0, lastSlash) : "";
	};
	/**
	* Returns the path with a slash at the end.
	* @private
	* @param {String} path the path to check.
	* @return {String} the path with a trailing slash.
	*/
	var forceTrailingSlash = function(path) {
		if (path.slice(-1) !== "/") path += "/";
		return path;
	};
	/**
	* Add a (sub) folder in the current folder.
	* @private
	* @param {string} name the folder's name
	* @param {boolean=} [createFolders] If true, automatically create sub
	*  folders. Defaults to false.
	* @return {Object} the new folder.
	*/
	var folderAdd = function(name, createFolders) {
		createFolders = typeof createFolders !== "undefined" ? createFolders : defaults.createFolders;
		name = forceTrailingSlash(name);
		if (!this.files[name]) fileAdd.call(this, name, null, {
			dir: true,
			createFolders
		});
		return this.files[name];
	};
	/**
	* Cross-window, cross-Node-context regular expression detection
	* @param  {Object}  object Anything
	* @return {Boolean}        true if the object is a regular expression,
	* false otherwise
	*/
	function isRegExp(object) {
		return Object.prototype.toString.call(object) === "[object RegExp]";
	}
	module.exports = {
		load: function() {
			throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
		},
		forEach: function(cb) {
			var filename, relativePath, file;
			for (filename in this.files) {
				file = this.files[filename];
				relativePath = filename.slice(this.root.length, filename.length);
				if (relativePath && filename.slice(0, this.root.length) === this.root) cb(relativePath, file);
			}
		},
		filter: function(search) {
			var result = [];
			this.forEach(function(relativePath, entry) {
				if (search(relativePath, entry)) result.push(entry);
			});
			return result;
		},
		file: function(name, data, o) {
			if (arguments.length === 1) if (isRegExp(name)) {
				var regexp = name;
				return this.filter(function(relativePath, file) {
					return !file.dir && regexp.test(relativePath);
				});
			} else {
				var obj = this.files[this.root + name];
				if (obj && !obj.dir) return obj;
				else return null;
			}
			else {
				name = this.root + name;
				fileAdd.call(this, name, data, o);
			}
			return this;
		},
		folder: function(arg) {
			if (!arg) return this;
			if (isRegExp(arg)) return this.filter(function(relativePath, file) {
				return file.dir && arg.test(relativePath);
			});
			var name = this.root + arg;
			var newFolder = folderAdd.call(this, name);
			var ret = this.clone();
			ret.root = newFolder.name;
			return ret;
		},
		remove: function(name) {
			name = this.root + name;
			var file = this.files[name];
			if (!file) {
				if (name.slice(-1) !== "/") name += "/";
				file = this.files[name];
			}
			if (file && !file.dir) delete this.files[name];
			else {
				var kids = this.filter(function(relativePath, file) {
					return file.name.slice(0, name.length) === name;
				});
				for (var i = 0; i < kids.length; i++) delete this.files[kids[i].name];
			}
			return this;
		},
		generate: function() {
			throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
		},
		generateInternalStream: function(options) {
			var worker, opts = {};
			try {
				opts = utils.extend(options || {}, {
					streamFiles: false,
					compression: "STORE",
					compressionOptions: null,
					type: "",
					platform: "DOS",
					comment: null,
					mimeType: "application/zip",
					encodeFileName: utf8.utf8encode
				});
				opts.type = opts.type.toLowerCase();
				opts.compression = opts.compression.toUpperCase();
				if (opts.type === "binarystring") opts.type = "string";
				if (!opts.type) throw new Error("No output type specified.");
				utils.checkSupport(opts.type);
				if (opts.platform === "darwin" || opts.platform === "freebsd" || opts.platform === "linux" || opts.platform === "sunos") opts.platform = "UNIX";
				if (opts.platform === "win32") opts.platform = "DOS";
				var comment = opts.comment || this.comment || "";
				worker = generate.generateWorker(this, opts, comment);
			} catch (e) {
				worker = new GenericWorker("error");
				worker.error(e);
			}
			return new StreamHelper(worker, opts.type || "string", opts.mimeType);
		},
		generateAsync: function(options, onUpdate) {
			return this.generateInternalStream(options).accumulate(onUpdate);
		},
		generateNodeStream: function(options, onUpdate) {
			options = options || {};
			if (!options.type) options.type = "nodebuffer";
			return this.generateInternalStream(options).toNodejsStream(onUpdate);
		}
	};
}));
//#endregion
//#region node_modules/jszip/lib/reader/DataReader.js
var require_DataReader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var utils = require_utils();
	function DataReader(data) {
		this.data = data;
		this.length = data.length;
		this.index = 0;
		this.zero = 0;
	}
	DataReader.prototype = {
		checkOffset: function(offset) {
			this.checkIndex(this.index + offset);
		},
		checkIndex: function(newIndex) {
			if (this.length < this.zero + newIndex || newIndex < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + newIndex + "). Corrupted zip ?");
		},
		setIndex: function(newIndex) {
			this.checkIndex(newIndex);
			this.index = newIndex;
		},
		skip: function(n) {
			this.setIndex(this.index + n);
		},
		byteAt: function() {},
		readInt: function(size) {
			var result = 0, i;
			this.checkOffset(size);
			for (i = this.index + size - 1; i >= this.index; i--) result = (result << 8) + this.byteAt(i);
			this.index += size;
			return result;
		},
		readString: function(size) {
			return utils.transformTo("string", this.readData(size));
		},
		readData: function() {},
		lastIndexOfSignature: function() {},
		readAndCheckSignature: function() {},
		readDate: function() {
			var dostime = this.readInt(4);
			return new Date(Date.UTC((dostime >> 25 & 127) + 1980, (dostime >> 21 & 15) - 1, dostime >> 16 & 31, dostime >> 11 & 31, dostime >> 5 & 63, (dostime & 31) << 1));
		}
	};
	module.exports = DataReader;
}));
//#endregion
//#region node_modules/jszip/lib/reader/ArrayReader.js
var require_ArrayReader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var DataReader = require_DataReader();
	var utils = require_utils();
	function ArrayReader(data) {
		DataReader.call(this, data);
		for (var i = 0; i < this.data.length; i++) data[i] = data[i] & 255;
	}
	utils.inherits(ArrayReader, DataReader);
	/**
	* @see DataReader.byteAt
	*/
	ArrayReader.prototype.byteAt = function(i) {
		return this.data[this.zero + i];
	};
	/**
	* @see DataReader.lastIndexOfSignature
	*/
	ArrayReader.prototype.lastIndexOfSignature = function(sig) {
		var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3);
		for (var i = this.length - 4; i >= 0; --i) if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) return i - this.zero;
		return -1;
	};
	/**
	* @see DataReader.readAndCheckSignature
	*/
	ArrayReader.prototype.readAndCheckSignature = function(sig) {
		var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3), data = this.readData(4);
		return sig0 === data[0] && sig1 === data[1] && sig2 === data[2] && sig3 === data[3];
	};
	/**
	* @see DataReader.readData
	*/
	ArrayReader.prototype.readData = function(size) {
		this.checkOffset(size);
		if (size === 0) return [];
		var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
		this.index += size;
		return result;
	};
	module.exports = ArrayReader;
}));
//#endregion
//#region node_modules/jszip/lib/reader/StringReader.js
var require_StringReader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var DataReader = require_DataReader();
	var utils = require_utils();
	function StringReader(data) {
		DataReader.call(this, data);
	}
	utils.inherits(StringReader, DataReader);
	/**
	* @see DataReader.byteAt
	*/
	StringReader.prototype.byteAt = function(i) {
		return this.data.charCodeAt(this.zero + i);
	};
	/**
	* @see DataReader.lastIndexOfSignature
	*/
	StringReader.prototype.lastIndexOfSignature = function(sig) {
		return this.data.lastIndexOf(sig) - this.zero;
	};
	/**
	* @see DataReader.readAndCheckSignature
	*/
	StringReader.prototype.readAndCheckSignature = function(sig) {
		return sig === this.readData(4);
	};
	/**
	* @see DataReader.readData
	*/
	StringReader.prototype.readData = function(size) {
		this.checkOffset(size);
		var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
		this.index += size;
		return result;
	};
	module.exports = StringReader;
}));
//#endregion
//#region node_modules/jszip/lib/reader/Uint8ArrayReader.js
var require_Uint8ArrayReader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var ArrayReader = require_ArrayReader();
	var utils = require_utils();
	function Uint8ArrayReader(data) {
		ArrayReader.call(this, data);
	}
	utils.inherits(Uint8ArrayReader, ArrayReader);
	/**
	* @see DataReader.readData
	*/
	Uint8ArrayReader.prototype.readData = function(size) {
		this.checkOffset(size);
		if (size === 0) return new Uint8Array(0);
		var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
		this.index += size;
		return result;
	};
	module.exports = Uint8ArrayReader;
}));
//#endregion
//#region node_modules/jszip/lib/reader/NodeBufferReader.js
var require_NodeBufferReader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var Uint8ArrayReader = require_Uint8ArrayReader();
	var utils = require_utils();
	function NodeBufferReader(data) {
		Uint8ArrayReader.call(this, data);
	}
	utils.inherits(NodeBufferReader, Uint8ArrayReader);
	/**
	* @see DataReader.readData
	*/
	NodeBufferReader.prototype.readData = function(size) {
		this.checkOffset(size);
		var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
		this.index += size;
		return result;
	};
	module.exports = NodeBufferReader;
}));
//#endregion
//#region node_modules/jszip/lib/reader/readerFor.js
var require_readerFor = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var utils = require_utils();
	var support = require_support();
	var ArrayReader = require_ArrayReader();
	var StringReader = require_StringReader();
	var NodeBufferReader = require_NodeBufferReader();
	var Uint8ArrayReader = require_Uint8ArrayReader();
	/**
	* Create a reader adapted to the data.
	* @param {String|ArrayBuffer|Uint8Array|Buffer} data the data to read.
	* @return {DataReader} the data reader.
	*/
	module.exports = function(data) {
		var type = utils.getTypeOf(data);
		utils.checkSupport(type);
		if (type === "string" && !support.uint8array) return new StringReader(data);
		if (type === "nodebuffer") return new NodeBufferReader(data);
		if (support.uint8array) return new Uint8ArrayReader(utils.transformTo("uint8array", data));
		return new ArrayReader(utils.transformTo("array", data));
	};
}));
//#endregion
//#region node_modules/jszip/lib/zipEntry.js
var require_zipEntry = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var readerFor = require_readerFor();
	var utils = require_utils();
	var CompressedObject = require_compressedObject();
	var crc32fn = require_crc32$1();
	var utf8 = require_utf8();
	var compressions = require_compressions();
	var support = require_support();
	var MADE_BY_DOS = 0;
	var MADE_BY_UNIX = 3;
	/**
	* Find a compression registered in JSZip.
	* @param {string} compressionMethod the method magic to find.
	* @return {Object|null} the JSZip compression object, null if none found.
	*/
	var findCompression = function(compressionMethod) {
		for (var method in compressions) {
			if (!Object.prototype.hasOwnProperty.call(compressions, method)) continue;
			if (compressions[method].magic === compressionMethod) return compressions[method];
		}
		return null;
	};
	/**
	* An entry in the zip file.
	* @constructor
	* @param {Object} options Options of the current file.
	* @param {Object} loadOptions Options for loading the stream.
	*/
	function ZipEntry(options, loadOptions) {
		this.options = options;
		this.loadOptions = loadOptions;
	}
	ZipEntry.prototype = {
		isEncrypted: function() {
			return (this.bitFlag & 1) === 1;
		},
		useUTF8: function() {
			return (this.bitFlag & 2048) === 2048;
		},
		readLocalPart: function(reader) {
			var compression, localExtraFieldsLength;
			reader.skip(22);
			this.fileNameLength = reader.readInt(2);
			localExtraFieldsLength = reader.readInt(2);
			this.fileName = reader.readData(this.fileNameLength);
			reader.skip(localExtraFieldsLength);
			if (this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
			compression = findCompression(this.compressionMethod);
			if (compression === null) throw new Error("Corrupted zip : compression " + utils.pretty(this.compressionMethod) + " unknown (inner file : " + utils.transformTo("string", this.fileName) + ")");
			this.decompressed = new CompressedObject(this.compressedSize, this.uncompressedSize, this.crc32, compression, reader.readData(this.compressedSize));
		},
		readCentralPart: function(reader) {
			this.versionMadeBy = reader.readInt(2);
			reader.skip(2);
			this.bitFlag = reader.readInt(2);
			this.compressionMethod = reader.readString(2);
			this.date = reader.readDate();
			this.crc32 = reader.readInt(4);
			this.compressedSize = reader.readInt(4);
			this.uncompressedSize = reader.readInt(4);
			var fileNameLength = reader.readInt(2);
			this.extraFieldsLength = reader.readInt(2);
			this.fileCommentLength = reader.readInt(2);
			this.diskNumberStart = reader.readInt(2);
			this.internalFileAttributes = reader.readInt(2);
			this.externalFileAttributes = reader.readInt(4);
			this.localHeaderOffset = reader.readInt(4);
			if (this.isEncrypted()) throw new Error("Encrypted zip are not supported");
			reader.skip(fileNameLength);
			this.readExtraFields(reader);
			this.parseZIP64ExtraField(reader);
			this.fileComment = reader.readData(this.fileCommentLength);
		},
		processAttributes: function() {
			this.unixPermissions = null;
			this.dosPermissions = null;
			var madeBy = this.versionMadeBy >> 8;
			this.dir = this.externalFileAttributes & 16 ? true : false;
			if (madeBy === MADE_BY_DOS) this.dosPermissions = this.externalFileAttributes & 63;
			if (madeBy === MADE_BY_UNIX) this.unixPermissions = this.externalFileAttributes >> 16 & 65535;
			if (!this.dir && this.fileNameStr.slice(-1) === "/") this.dir = true;
		},
		parseZIP64ExtraField: function() {
			if (!this.extraFields[1]) return;
			var extraReader = readerFor(this.extraFields[1].value);
			if (this.uncompressedSize === utils.MAX_VALUE_32BITS) this.uncompressedSize = extraReader.readInt(8);
			if (this.compressedSize === utils.MAX_VALUE_32BITS) this.compressedSize = extraReader.readInt(8);
			if (this.localHeaderOffset === utils.MAX_VALUE_32BITS) this.localHeaderOffset = extraReader.readInt(8);
			if (this.diskNumberStart === utils.MAX_VALUE_32BITS) this.diskNumberStart = extraReader.readInt(4);
		},
		readExtraFields: function(reader) {
			var end = reader.index + this.extraFieldsLength, extraFieldId, extraFieldLength, extraFieldValue;
			if (!this.extraFields) this.extraFields = {};
			while (reader.index + 4 < end) {
				extraFieldId = reader.readInt(2);
				extraFieldLength = reader.readInt(2);
				extraFieldValue = reader.readData(extraFieldLength);
				this.extraFields[extraFieldId] = {
					id: extraFieldId,
					length: extraFieldLength,
					value: extraFieldValue
				};
			}
			reader.setIndex(end);
		},
		handleUTF8: function() {
			var decodeParamType = support.uint8array ? "uint8array" : "array";
			if (this.useUTF8()) {
				this.fileNameStr = utf8.utf8decode(this.fileName);
				this.fileCommentStr = utf8.utf8decode(this.fileComment);
			} else {
				var upath = this.findExtraFieldUnicodePath();
				if (upath !== null) this.fileNameStr = upath;
				else {
					var fileNameByteArray = utils.transformTo(decodeParamType, this.fileName);
					this.fileNameStr = this.loadOptions.decodeFileName(fileNameByteArray);
				}
				var ucomment = this.findExtraFieldUnicodeComment();
				if (ucomment !== null) this.fileCommentStr = ucomment;
				else {
					var commentByteArray = utils.transformTo(decodeParamType, this.fileComment);
					this.fileCommentStr = this.loadOptions.decodeFileName(commentByteArray);
				}
			}
		},
		findExtraFieldUnicodePath: function() {
			var upathField = this.extraFields[28789];
			if (upathField) {
				var extraReader = readerFor(upathField.value);
				if (extraReader.readInt(1) !== 1) return null;
				if (crc32fn(this.fileName) !== extraReader.readInt(4)) return null;
				return utf8.utf8decode(extraReader.readData(upathField.length - 5));
			}
			return null;
		},
		findExtraFieldUnicodeComment: function() {
			var ucommentField = this.extraFields[25461];
			if (ucommentField) {
				var extraReader = readerFor(ucommentField.value);
				if (extraReader.readInt(1) !== 1) return null;
				if (crc32fn(this.fileComment) !== extraReader.readInt(4)) return null;
				return utf8.utf8decode(extraReader.readData(ucommentField.length - 5));
			}
			return null;
		}
	};
	module.exports = ZipEntry;
}));
//#endregion
//#region node_modules/jszip/lib/zipEntries.js
var require_zipEntries = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var readerFor = require_readerFor();
	var utils = require_utils();
	var sig = require_signature();
	var ZipEntry = require_zipEntry();
	var support = require_support();
	/**
	* All the entries in the zip file.
	* @constructor
	* @param {Object} loadOptions Options for loading the stream.
	*/
	function ZipEntries(loadOptions) {
		this.files = [];
		this.loadOptions = loadOptions;
	}
	ZipEntries.prototype = {
		checkSignature: function(expectedSignature) {
			if (!this.reader.readAndCheckSignature(expectedSignature)) {
				this.reader.index -= 4;
				var signature = this.reader.readString(4);
				throw new Error("Corrupted zip or bug: unexpected signature (" + utils.pretty(signature) + ", expected " + utils.pretty(expectedSignature) + ")");
			}
		},
		isSignature: function(askedIndex, expectedSignature) {
			var currentIndex = this.reader.index;
			this.reader.setIndex(askedIndex);
			var result = this.reader.readString(4) === expectedSignature;
			this.reader.setIndex(currentIndex);
			return result;
		},
		readBlockEndOfCentral: function() {
			this.diskNumber = this.reader.readInt(2);
			this.diskWithCentralDirStart = this.reader.readInt(2);
			this.centralDirRecordsOnThisDisk = this.reader.readInt(2);
			this.centralDirRecords = this.reader.readInt(2);
			this.centralDirSize = this.reader.readInt(4);
			this.centralDirOffset = this.reader.readInt(4);
			this.zipCommentLength = this.reader.readInt(2);
			var zipComment = this.reader.readData(this.zipCommentLength);
			var decodeParamType = support.uint8array ? "uint8array" : "array";
			var decodeContent = utils.transformTo(decodeParamType, zipComment);
			this.zipComment = this.loadOptions.decodeFileName(decodeContent);
		},
		readBlockZip64EndOfCentral: function() {
			this.zip64EndOfCentralSize = this.reader.readInt(8);
			this.reader.skip(4);
			this.diskNumber = this.reader.readInt(4);
			this.diskWithCentralDirStart = this.reader.readInt(4);
			this.centralDirRecordsOnThisDisk = this.reader.readInt(8);
			this.centralDirRecords = this.reader.readInt(8);
			this.centralDirSize = this.reader.readInt(8);
			this.centralDirOffset = this.reader.readInt(8);
			this.zip64ExtensibleData = {};
			var extraDataSize = this.zip64EndOfCentralSize - 44, index = 0, extraFieldId, extraFieldLength, extraFieldValue;
			while (index < extraDataSize) {
				extraFieldId = this.reader.readInt(2);
				extraFieldLength = this.reader.readInt(4);
				extraFieldValue = this.reader.readData(extraFieldLength);
				this.zip64ExtensibleData[extraFieldId] = {
					id: extraFieldId,
					length: extraFieldLength,
					value: extraFieldValue
				};
			}
		},
		readBlockZip64EndOfCentralLocator: function() {
			this.diskWithZip64CentralDirStart = this.reader.readInt(4);
			this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8);
			this.disksCount = this.reader.readInt(4);
			if (this.disksCount > 1) throw new Error("Multi-volumes zip are not supported");
		},
		readLocalFiles: function() {
			var i, file;
			for (i = 0; i < this.files.length; i++) {
				file = this.files[i];
				this.reader.setIndex(file.localHeaderOffset);
				this.checkSignature(sig.LOCAL_FILE_HEADER);
				file.readLocalPart(this.reader);
				file.handleUTF8();
				file.processAttributes();
			}
		},
		readCentralDir: function() {
			var file;
			this.reader.setIndex(this.centralDirOffset);
			while (this.reader.readAndCheckSignature(sig.CENTRAL_FILE_HEADER)) {
				file = new ZipEntry({ zip64: this.zip64 }, this.loadOptions);
				file.readCentralPart(this.reader);
				this.files.push(file);
			}
			if (this.centralDirRecords !== this.files.length) {
				if (this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
			}
		},
		readEndOfCentral: function() {
			var offset = this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);
			if (offset < 0) if (!this.isSignature(0, sig.LOCAL_FILE_HEADER)) throw new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
			else throw new Error("Corrupted zip: can't find end of central directory");
			this.reader.setIndex(offset);
			var endOfCentralDirOffset = offset;
			this.checkSignature(sig.CENTRAL_DIRECTORY_END);
			this.readBlockEndOfCentral();
			if (this.diskNumber === utils.MAX_VALUE_16BITS || this.diskWithCentralDirStart === utils.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === utils.MAX_VALUE_16BITS || this.centralDirRecords === utils.MAX_VALUE_16BITS || this.centralDirSize === utils.MAX_VALUE_32BITS || this.centralDirOffset === utils.MAX_VALUE_32BITS) {
				this.zip64 = true;
				offset = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
				if (offset < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
				this.reader.setIndex(offset);
				this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
				this.readBlockZip64EndOfCentralLocator();
				if (!this.isSignature(this.relativeOffsetEndOfZip64CentralDir, sig.ZIP64_CENTRAL_DIRECTORY_END)) {
					this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
					if (this.relativeOffsetEndOfZip64CentralDir < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
				}
				this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);
				this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
				this.readBlockZip64EndOfCentral();
			}
			var expectedEndOfCentralDirOffset = this.centralDirOffset + this.centralDirSize;
			if (this.zip64) {
				expectedEndOfCentralDirOffset += 20;
				expectedEndOfCentralDirOffset += 12 + this.zip64EndOfCentralSize;
			}
			var extraBytes = endOfCentralDirOffset - expectedEndOfCentralDirOffset;
			if (extraBytes > 0) if (this.isSignature(endOfCentralDirOffset, sig.CENTRAL_FILE_HEADER)) {} else this.reader.zero = extraBytes;
			else if (extraBytes < 0) throw new Error("Corrupted zip: missing " + Math.abs(extraBytes) + " bytes.");
		},
		prepareReader: function(data) {
			this.reader = readerFor(data);
		},
		load: function(data) {
			this.prepareReader(data);
			this.readEndOfCentral();
			this.readCentralDir();
			this.readLocalFiles();
		}
	};
	module.exports = ZipEntries;
}));
//#endregion
//#region node_modules/jszip/lib/load.js
var require_load = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var utils = require_utils();
	var external = require_external();
	var utf8 = require_utf8();
	var ZipEntries = require_zipEntries();
	var Crc32Probe = require_Crc32Probe();
	var nodejsUtils = require_nodejsUtils();
	/**
	* Check the CRC32 of an entry.
	* @param {ZipEntry} zipEntry the zip entry to check.
	* @return {Promise} the result.
	*/
	function checkEntryCRC32(zipEntry) {
		return new external.Promise(function(resolve, reject) {
			var worker = zipEntry.decompressed.getContentWorker().pipe(new Crc32Probe());
			worker.on("error", function(e) {
				reject(e);
			}).on("end", function() {
				if (worker.streamInfo.crc32 !== zipEntry.decompressed.crc32) reject(/* @__PURE__ */ new Error("Corrupted zip : CRC32 mismatch"));
				else resolve();
			}).resume();
		});
	}
	module.exports = function(data, options) {
		var zip = this;
		options = utils.extend(options || {}, {
			base64: false,
			checkCRC32: false,
			optimizedBinaryString: false,
			createFolders: false,
			decodeFileName: utf8.utf8decode
		});
		if (nodejsUtils.isNode && nodejsUtils.isStream(data)) return external.Promise.reject(/* @__PURE__ */ new Error("JSZip can't accept a stream when loading a zip file."));
		return utils.prepareContent("the loaded zip file", data, true, options.optimizedBinaryString, options.base64).then(function(data) {
			var zipEntries = new ZipEntries(options);
			zipEntries.load(data);
			return zipEntries;
		}).then(function checkCRC32(zipEntries) {
			var promises = [external.Promise.resolve(zipEntries)];
			var files = zipEntries.files;
			if (options.checkCRC32) for (var i = 0; i < files.length; i++) promises.push(checkEntryCRC32(files[i]));
			return external.Promise.all(promises);
		}).then(function addFiles(results) {
			var zipEntries = results.shift();
			var files = zipEntries.files;
			for (var i = 0; i < files.length; i++) {
				var input = files[i];
				var unsafeName = input.fileNameStr;
				var safeName = utils.resolve(input.fileNameStr);
				zip.file(safeName, input.decompressed, {
					binary: true,
					optimizedBinaryString: true,
					date: input.date,
					dir: input.dir,
					comment: input.fileCommentStr.length ? input.fileCommentStr : null,
					unixPermissions: input.unixPermissions,
					dosPermissions: input.dosPermissions,
					createFolders: options.createFolders
				});
				if (!input.dir) zip.file(safeName).unsafeOriginalName = unsafeName;
			}
			if (zipEntries.zipComment.length) zip.comment = zipEntries.zipComment;
			return zip;
		});
	};
}));
//#endregion
//#region node_modules/jszip/lib/index.js
var require_lib$3 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	/**
	* Representation a of zip file in js
	* @constructor
	*/
	function JSZip() {
		if (!(this instanceof JSZip)) return new JSZip();
		if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
		this.files = Object.create(null);
		this.comment = null;
		this.root = "";
		this.clone = function() {
			var newObj = new JSZip();
			for (var i in this) if (typeof this[i] !== "function") newObj[i] = this[i];
			return newObj;
		};
	}
	JSZip.prototype = require_object();
	JSZip.prototype.loadAsync = require_load();
	JSZip.support = require_support();
	JSZip.defaults = require_defaults();
	JSZip.version = "3.10.1";
	JSZip.loadAsync = function(content, options) {
		return new JSZip().loadAsync(content, options);
	};
	JSZip.external = require_external();
	module.exports = JSZip;
}));
//#endregion
//#region node_modules/mammoth/lib/zipfile.js
var require_zipfile = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var base64js = require_base64_js();
	var JSZip = require_lib$3();
	exports.openArrayBuffer = openArrayBuffer;
	exports.splitPath = splitPath;
	exports.joinPath = joinPath;
	function openArrayBuffer(arrayBuffer) {
		return JSZip.loadAsync(arrayBuffer).then(function(zipFile) {
			function exists(name) {
				return zipFile.file(name) !== null;
			}
			function read(name, encoding) {
				return zipFile.file(name).async("uint8array").then(function(array) {
					if (encoding === "base64") return base64js.fromByteArray(array);
					else if (encoding) return new TextDecoder(encoding).decode(array);
					else return array;
				});
			}
			function write(name, contents) {
				zipFile.file(name, contents);
			}
			function toArrayBuffer() {
				return zipFile.generateAsync({ type: "arraybuffer" });
			}
			return {
				exists,
				read,
				write,
				toArrayBuffer
			};
		});
	}
	function splitPath(path) {
		var lastIndex = path.lastIndexOf("/");
		if (lastIndex === -1) return {
			dirname: "",
			basename: path
		};
		else return {
			dirname: path.substring(0, lastIndex),
			basename: path.substring(lastIndex + 1)
		};
	}
	function joinPath() {
		var nonEmptyPaths = Array.prototype.filter.call(arguments, function(path) {
			return path;
		});
		var relevantPaths = [];
		nonEmptyPaths.forEach(function(path) {
			if (/^\//.test(path)) relevantPaths = [path];
			else relevantPaths.push(path);
		});
		return relevantPaths.join("/");
	}
}));
//#endregion
//#region node_modules/mammoth/lib/xml/nodes.js
var require_nodes = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	exports.Element = Element;
	exports.element = function(name, attributes, children) {
		return new Element(name, attributes, children);
	};
	exports.text = function(value) {
		return {
			type: "text",
			value
		};
	};
	var emptyElement = exports.emptyElement = {
		first: function() {
			return null;
		},
		firstOrEmpty: function() {
			return emptyElement;
		},
		attributes: {},
		children: []
	};
	function Element(name, attributes, children) {
		this.type = "element";
		this.name = name;
		this.attributes = attributes || {};
		this.children = children || [];
	}
	Element.prototype.first = function(name) {
		return _.find(this.children, function(child) {
			return child.name === name;
		});
	};
	Element.prototype.firstOrEmpty = function(name) {
		return this.first(name) || emptyElement;
	};
	Element.prototype.getElementsByTagName = function(name) {
		return toElementList(_.filter(this.children, function(child) {
			return child.name === name;
		}));
	};
	Element.prototype.text = function() {
		if (this.children.length === 0) return "";
		else if (this.children.length !== 1 || this.children[0].type !== "text") throw new Error("Not implemented");
		return this.children[0].value;
	};
	var elementListPrototype = { getElementsByTagName: function(name) {
		return toElementList(_.flatten(this.map(function(element) {
			return element.getElementsByTagName(name);
		}, true)));
	} };
	function toElementList(array) {
		return _.extend(array, elementListPrototype);
	}
}));
//#endregion
//#region node_modules/@xmldom/xmldom/lib/conventions.js
var require_conventions = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	/**
	* Ponyfill for `Array.prototype.find` which is only available in ES6 runtimes.
	*
	* Works with anything that has a `length` property and index access properties, including NodeList.
	*
	* @template {unknown} T
	* @param {Array<T> | ({length:number, [number]: T})} list
	* @param {function (item: T, index: number, list:Array<T> | ({length:number, [number]: T})):boolean} predicate
	* @param {Partial<Pick<ArrayConstructor['prototype'], 'find'>>?} ac `Array.prototype` by default,
	* 				allows injecting a custom implementation in tests
	* @returns {T | undefined}
	*
	* @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
	* @see https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.find
	*/
	function find(list, predicate, ac) {
		if (ac === void 0) ac = Array.prototype;
		if (list && typeof ac.find === "function") return ac.find.call(list, predicate);
		for (var i = 0; i < list.length; i++) if (Object.prototype.hasOwnProperty.call(list, i)) {
			var item = list[i];
			if (predicate.call(void 0, item, i, list)) return item;
		}
	}
	/**
	* "Shallow freezes" an object to render it immutable.
	* Uses `Object.freeze` if available,
	* otherwise the immutability is only in the type.
	*
	* Is used to create "enum like" objects.
	*
	* @template T
	* @param {T} object the object to freeze
	* @param {Pick<ObjectConstructor, 'freeze'> = Object} oc `Object` by default,
	* 				allows to inject custom object constructor for tests
	* @returns {Readonly<T>}
	*
	* @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
	*/
	function freeze(object, oc) {
		if (oc === void 0) oc = Object;
		return oc && typeof oc.freeze === "function" ? oc.freeze(object) : object;
	}
	/**
	* Since we can not rely on `Object.assign` we provide a simplified version
	* that is sufficient for our needs.
	*
	* @param {Object} target
	* @param {Object | null | undefined} source
	*
	* @returns {Object} target
	* @throws TypeError if target is not an object
	*
	* @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	* @see https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.assign
	*/
	function assign(target, source) {
		if (target === null || typeof target !== "object") throw new TypeError("target is not an object");
		for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		return target;
	}
	/**
	* All mime types that are allowed as input to `DOMParser.parseFromString`
	*
	* @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString#Argument02 MDN
	* @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#domparsersupportedtype WHATWG HTML Spec
	* @see DOMParser.prototype.parseFromString
	*/
	var MIME_TYPE = freeze({
		HTML: "text/html",
		isHTML: function(value) {
			return value === MIME_TYPE.HTML;
		},
		XML_APPLICATION: "application/xml",
		XML_TEXT: "text/xml",
		XML_XHTML_APPLICATION: "application/xhtml+xml",
		XML_SVG_IMAGE: "image/svg+xml"
	});
	/**
	* Namespaces that are used in this code base.
	*
	* @see http://www.w3.org/TR/REC-xml-names
	*/
	var NAMESPACE = freeze({
		HTML: "http://www.w3.org/1999/xhtml",
		isHTML: function(uri) {
			return uri === NAMESPACE.HTML;
		},
		SVG: "http://www.w3.org/2000/svg",
		XML: "http://www.w3.org/XML/1998/namespace",
		XMLNS: "http://www.w3.org/2000/xmlns/"
	});
	exports.assign = assign;
	exports.find = find;
	exports.freeze = freeze;
	exports.MIME_TYPE = MIME_TYPE;
	exports.NAMESPACE = NAMESPACE;
}));
//#endregion
//#region node_modules/@xmldom/xmldom/lib/dom.js
var require_dom = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var conventions = require_conventions();
	var find = conventions.find;
	var NAMESPACE = conventions.NAMESPACE;
	/**
	* A prerequisite for `[].filter`, to drop elements that are empty
	* @param {string} input
	* @returns {boolean}
	*/
	function notEmptyString(input) {
		return input !== "";
	}
	/**
	* @see https://infra.spec.whatwg.org/#split-on-ascii-whitespace
	* @see https://infra.spec.whatwg.org/#ascii-whitespace
	*
	* @param {string} input
	* @returns {string[]} (can be empty)
	*/
	function splitOnASCIIWhitespace(input) {
		return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : [];
	}
	/**
	* Adds element as a key to current if it is not already present.
	*
	* @param {Record<string, boolean | undefined>} current
	* @param {string} element
	* @returns {Record<string, boolean | undefined>}
	*/
	function orderedSetReducer(current, element) {
		if (!current.hasOwnProperty(element)) current[element] = true;
		return current;
	}
	/**
	* @see https://infra.spec.whatwg.org/#ordered-set
	* @param {string} input
	* @returns {string[]}
	*/
	function toOrderedSet(input) {
		if (!input) return [];
		var list = splitOnASCIIWhitespace(input);
		return Object.keys(list.reduce(orderedSetReducer, {}));
	}
	/**
	* Uses `list.indexOf` to implement something like `Array.prototype.includes`,
	* which we can not rely on being available.
	*
	* @param {any[]} list
	* @returns {function(any): boolean}
	*/
	function arrayIncludes(list) {
		return function(element) {
			return list && list.indexOf(element) !== -1;
		};
	}
	function copy(src, dest) {
		for (var p in src) if (Object.prototype.hasOwnProperty.call(src, p)) dest[p] = src[p];
	}
	/**
	^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
	^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
	*/
	function _extends(Class, Super) {
		var pt = Class.prototype;
		if (!(pt instanceof Super)) {
			function t() {}
			t.prototype = Super.prototype;
			t = new t();
			copy(pt, t);
			Class.prototype = pt = t;
		}
		if (pt.constructor != Class) {
			if (typeof Class != "function") console.error("unknown Class:" + Class);
			pt.constructor = Class;
		}
	}
	var NodeType = {};
	var ELEMENT_NODE = NodeType.ELEMENT_NODE = 1;
	var ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE = 2;
	var TEXT_NODE = NodeType.TEXT_NODE = 3;
	var CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4;
	var ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5;
	var ENTITY_NODE = NodeType.ENTITY_NODE = 6;
	var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
	var COMMENT_NODE = NodeType.COMMENT_NODE = 8;
	var DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9;
	var DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10;
	var DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11;
	var NOTATION_NODE = NodeType.NOTATION_NODE = 12;
	var ExceptionCode = {};
	var ExceptionMessage = {};
	ExceptionCode.INDEX_SIZE_ERR = (ExceptionMessage[1] = "Index size error", 1);
	ExceptionCode.DOMSTRING_SIZE_ERR = (ExceptionMessage[2] = "DOMString size error", 2);
	var HIERARCHY_REQUEST_ERR = ExceptionCode.HIERARCHY_REQUEST_ERR = (ExceptionMessage[3] = "Hierarchy request error", 3);
	ExceptionCode.WRONG_DOCUMENT_ERR = (ExceptionMessage[4] = "Wrong document", 4);
	var INVALID_CHARACTER_ERR = ExceptionCode.INVALID_CHARACTER_ERR = (ExceptionMessage[5] = "Invalid character", 5);
	ExceptionCode.NO_DATA_ALLOWED_ERR = (ExceptionMessage[6] = "No data allowed", 6);
	ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = (ExceptionMessage[7] = "No modification allowed", 7);
	var NOT_FOUND_ERR = ExceptionCode.NOT_FOUND_ERR = (ExceptionMessage[8] = "Not found", 8);
	ExceptionCode.NOT_SUPPORTED_ERR = (ExceptionMessage[9] = "Not supported", 9);
	var INUSE_ATTRIBUTE_ERR = ExceptionCode.INUSE_ATTRIBUTE_ERR = (ExceptionMessage[10] = "Attribute in use", 10);
	ExceptionCode.INVALID_STATE_ERR = (ExceptionMessage[11] = "Invalid state", 11);
	ExceptionCode.SYNTAX_ERR = (ExceptionMessage[12] = "Syntax error", 12);
	ExceptionCode.INVALID_MODIFICATION_ERR = (ExceptionMessage[13] = "Invalid modification", 13);
	ExceptionCode.NAMESPACE_ERR = (ExceptionMessage[14] = "Invalid namespace", 14);
	ExceptionCode.INVALID_ACCESS_ERR = (ExceptionMessage[15] = "Invalid access", 15);
	/**
	* DOM Level 2
	* Object DOMException
	* @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
	* @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
	*/
	function DOMException(code, message) {
		if (message instanceof Error) var error = message;
		else {
			error = this;
			Error.call(this, ExceptionMessage[code]);
			this.message = ExceptionMessage[code];
			if (Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
		}
		error.code = code;
		if (message) this.message = this.message + ": " + message;
		return error;
	}
	DOMException.prototype = Error.prototype;
	copy(ExceptionCode, DOMException);
	/**
	* @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
	* The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
	* The items in the NodeList are accessible via an integral index, starting from 0.
	*/
	function NodeList() {}
	NodeList.prototype = {
		length: 0,
		item: function(index) {
			return index >= 0 && index < this.length ? this[index] : null;
		},
		toString: function(isHTML, nodeFilter) {
			for (var buf = [], i = 0; i < this.length; i++) serializeToString(this[i], buf, isHTML, nodeFilter);
			return buf.join("");
		},
		filter: function(predicate) {
			return Array.prototype.filter.call(this, predicate);
		},
		indexOf: function(item) {
			return Array.prototype.indexOf.call(this, item);
		}
	};
	function LiveNodeList(node, refresh) {
		this._node = node;
		this._refresh = refresh;
		_updateLiveList(this);
	}
	function _updateLiveList(list) {
		var inc = list._node._inc || list._node.ownerDocument._inc;
		if (list._inc !== inc) {
			var ls = list._refresh(list._node);
			__set__(list, "length", ls.length);
			if (!list.$$length || ls.length < list.$$length) {
				for (var i = ls.length; i in list; i++) if (Object.prototype.hasOwnProperty.call(list, i)) delete list[i];
			}
			copy(ls, list);
			list._inc = inc;
		}
	}
	LiveNodeList.prototype.item = function(i) {
		_updateLiveList(this);
		return this[i] || null;
	};
	_extends(LiveNodeList, NodeList);
	/**
	* Objects implementing the NamedNodeMap interface are used
	* to represent collections of nodes that can be accessed by name.
	* Note that NamedNodeMap does not inherit from NodeList;
	* NamedNodeMaps are not maintained in any particular order.
	* Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index,
	* but this is simply to allow convenient enumeration of the contents of a NamedNodeMap,
	* and does not imply that the DOM specifies an order to these Nodes.
	* NamedNodeMap objects in the DOM are live.
	* used for attributes or DocumentType entities
	*/
	function NamedNodeMap() {}
	function _findNodeIndex(list, node) {
		var i = list.length;
		while (i--) if (list[i] === node) return i;
	}
	function _addNamedNode(el, list, newAttr, oldAttr) {
		if (oldAttr) list[_findNodeIndex(list, oldAttr)] = newAttr;
		else list[list.length++] = newAttr;
		if (el) {
			newAttr.ownerElement = el;
			var doc = el.ownerDocument;
			if (doc) {
				oldAttr && _onRemoveAttribute(doc, el, oldAttr);
				_onAddAttribute(doc, el, newAttr);
			}
		}
	}
	function _removeNamedNode(el, list, attr) {
		var i = _findNodeIndex(list, attr);
		if (i >= 0) {
			var lastIndex = list.length - 1;
			while (i < lastIndex) list[i] = list[++i];
			list.length = lastIndex;
			if (el) {
				var doc = el.ownerDocument;
				if (doc) {
					_onRemoveAttribute(doc, el, attr);
					attr.ownerElement = null;
				}
			}
		} else throw new DOMException(NOT_FOUND_ERR, /* @__PURE__ */ new Error(el.tagName + "@" + attr));
	}
	NamedNodeMap.prototype = {
		length: 0,
		item: NodeList.prototype.item,
		getNamedItem: function(key) {
			var i = this.length;
			while (i--) {
				var attr = this[i];
				if (attr.nodeName == key) return attr;
			}
		},
		setNamedItem: function(attr) {
			var el = attr.ownerElement;
			if (el && el != this._ownerElement) throw new DOMException(INUSE_ATTRIBUTE_ERR);
			var oldAttr = this.getNamedItem(attr.nodeName);
			_addNamedNode(this._ownerElement, this, attr, oldAttr);
			return oldAttr;
		},
		setNamedItemNS: function(attr) {
			var el = attr.ownerElement, oldAttr;
			if (el && el != this._ownerElement) throw new DOMException(INUSE_ATTRIBUTE_ERR);
			oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName);
			_addNamedNode(this._ownerElement, this, attr, oldAttr);
			return oldAttr;
		},
		removeNamedItem: function(key) {
			var attr = this.getNamedItem(key);
			_removeNamedNode(this._ownerElement, this, attr);
			return attr;
		},
		removeNamedItemNS: function(namespaceURI, localName) {
			var attr = this.getNamedItemNS(namespaceURI, localName);
			_removeNamedNode(this._ownerElement, this, attr);
			return attr;
		},
		getNamedItemNS: function(namespaceURI, localName) {
			var i = this.length;
			while (i--) {
				var node = this[i];
				if (node.localName == localName && node.namespaceURI == namespaceURI) return node;
			}
			return null;
		}
	};
	/**
	* The DOMImplementation interface represents an object providing methods
	* which are not dependent on any particular document.
	* Such an object is returned by the `Document.implementation` property.
	*
	* __The individual methods describe the differences compared to the specs.__
	*
	* @constructor
	*
	* @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation MDN
	* @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490 DOM Level 1 Core (Initial)
	* @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-102161490 DOM Level 2 Core
	* @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-102161490 DOM Level 3 Core
	* @see https://dom.spec.whatwg.org/#domimplementation DOM Living Standard
	*/
	function DOMImplementation() {}
	DOMImplementation.prototype = {
		hasFeature: function(feature, version) {
			return true;
		},
		createDocument: function(namespaceURI, qualifiedName, doctype) {
			var doc = new Document();
			doc.implementation = this;
			doc.childNodes = new NodeList();
			doc.doctype = doctype || null;
			if (doctype) doc.appendChild(doctype);
			if (qualifiedName) {
				var root = doc.createElementNS(namespaceURI, qualifiedName);
				doc.appendChild(root);
			}
			return doc;
		},
		createDocumentType: function(qualifiedName, publicId, systemId) {
			var node = new DocumentType();
			node.name = qualifiedName;
			node.nodeName = qualifiedName;
			node.publicId = publicId || "";
			node.systemId = systemId || "";
			return node;
		}
	};
	/**
	* @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
	*/
	function Node() {}
	Node.prototype = {
		firstChild: null,
		lastChild: null,
		previousSibling: null,
		nextSibling: null,
		attributes: null,
		parentNode: null,
		childNodes: null,
		ownerDocument: null,
		nodeValue: null,
		namespaceURI: null,
		prefix: null,
		localName: null,
		insertBefore: function(newChild, refChild) {
			return _insertBefore(this, newChild, refChild);
		},
		replaceChild: function(newChild, oldChild) {
			_insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
			if (oldChild) this.removeChild(oldChild);
		},
		removeChild: function(oldChild) {
			return _removeChild(this, oldChild);
		},
		appendChild: function(newChild) {
			return this.insertBefore(newChild, null);
		},
		hasChildNodes: function() {
			return this.firstChild != null;
		},
		cloneNode: function(deep) {
			return cloneNode(this.ownerDocument || this, this, deep);
		},
		normalize: function() {
			var child = this.firstChild;
			while (child) {
				var next = child.nextSibling;
				if (next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE) {
					this.removeChild(next);
					child.appendData(next.data);
				} else {
					child.normalize();
					child = next;
				}
			}
		},
		isSupported: function(feature, version) {
			return this.ownerDocument.implementation.hasFeature(feature, version);
		},
		hasAttributes: function() {
			return this.attributes.length > 0;
		},
		lookupPrefix: function(namespaceURI) {
			var el = this;
			while (el) {
				var map = el._nsMap;
				if (map) {
					for (var n in map) if (Object.prototype.hasOwnProperty.call(map, n) && map[n] === namespaceURI) return n;
				}
				el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
			}
			return null;
		},
		lookupNamespaceURI: function(prefix) {
			var el = this;
			while (el) {
				var map = el._nsMap;
				if (map) {
					if (Object.prototype.hasOwnProperty.call(map, prefix)) return map[prefix];
				}
				el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
			}
			return null;
		},
		isDefaultNamespace: function(namespaceURI) {
			return this.lookupPrefix(namespaceURI) == null;
		}
	};
	function _xmlEncoder(c) {
		return c == "<" && "&lt;" || c == ">" && "&gt;" || c == "&" && "&amp;" || c == "\"" && "&quot;" || "&#" + c.charCodeAt() + ";";
	}
	copy(NodeType, Node);
	copy(NodeType, Node.prototype);
	/**
	* @param callback return true for continue,false for break
	* @return boolean true: break visit;
	*/
	function _visitNode(node, callback) {
		if (callback(node)) return true;
		if (node = node.firstChild) do
			if (_visitNode(node, callback)) return true;
		while (node = node.nextSibling);
	}
	function Document() {
		this.ownerDocument = this;
	}
	function _onAddAttribute(doc, el, newAttr) {
		doc && doc._inc++;
		if (newAttr.namespaceURI === NAMESPACE.XMLNS) el._nsMap[newAttr.prefix ? newAttr.localName : ""] = newAttr.value;
	}
	function _onRemoveAttribute(doc, el, newAttr, remove) {
		doc && doc._inc++;
		if (newAttr.namespaceURI === NAMESPACE.XMLNS) delete el._nsMap[newAttr.prefix ? newAttr.localName : ""];
	}
	/**
	* Updates `el.childNodes`, updating the indexed items and it's `length`.
	* Passing `newChild` means it will be appended.
	* Otherwise it's assumed that an item has been removed,
	* and `el.firstNode` and it's `.nextSibling` are used
	* to walk the current list of child nodes.
	*
	* @param {Document} doc
	* @param {Node} el
	* @param {Node} [newChild]
	* @private
	*/
	function _onUpdateChild(doc, el, newChild) {
		if (doc && doc._inc) {
			doc._inc++;
			var cs = el.childNodes;
			if (newChild) cs[cs.length++] = newChild;
			else {
				var child = el.firstChild;
				var i = 0;
				while (child) {
					cs[i++] = child;
					child = child.nextSibling;
				}
				cs.length = i;
				delete cs[cs.length];
			}
		}
	}
	/**
	* Removes the connections between `parentNode` and `child`
	* and any existing `child.previousSibling` or `child.nextSibling`.
	*
	* @see https://github.com/xmldom/xmldom/issues/135
	* @see https://github.com/xmldom/xmldom/issues/145
	*
	* @param {Node} parentNode
	* @param {Node} child
	* @returns {Node} the child that was removed.
	* @private
	*/
	function _removeChild(parentNode, child) {
		var previous = child.previousSibling;
		var next = child.nextSibling;
		if (previous) previous.nextSibling = next;
		else parentNode.firstChild = next;
		if (next) next.previousSibling = previous;
		else parentNode.lastChild = previous;
		child.parentNode = null;
		child.previousSibling = null;
		child.nextSibling = null;
		_onUpdateChild(parentNode.ownerDocument, parentNode);
		return child;
	}
	/**
	* Returns `true` if `node` can be a parent for insertion.
	* @param {Node} node
	* @returns {boolean}
	*/
	function hasValidParentNodeType(node) {
		return node && (node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.ELEMENT_NODE);
	}
	/**
	* Returns `true` if `node` can be inserted according to it's `nodeType`.
	* @param {Node} node
	* @returns {boolean}
	*/
	function hasInsertableNodeType(node) {
		return node && (isElementNode(node) || isTextNode(node) || isDocTypeNode(node) || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.COMMENT_NODE || node.nodeType === Node.PROCESSING_INSTRUCTION_NODE);
	}
	/**
	* Returns true if `node` is a DOCTYPE node
	* @param {Node} node
	* @returns {boolean}
	*/
	function isDocTypeNode(node) {
		return node && node.nodeType === Node.DOCUMENT_TYPE_NODE;
	}
	/**
	* Returns true if the node is an element
	* @param {Node} node
	* @returns {boolean}
	*/
	function isElementNode(node) {
		return node && node.nodeType === Node.ELEMENT_NODE;
	}
	/**
	* Returns true if `node` is a text node
	* @param {Node} node
	* @returns {boolean}
	*/
	function isTextNode(node) {
		return node && node.nodeType === Node.TEXT_NODE;
	}
	/**
	* Check if en element node can be inserted before `child`, or at the end if child is falsy,
	* according to the presence and position of a doctype node on the same level.
	*
	* @param {Document} doc The document node
	* @param {Node} child the node that would become the nextSibling if the element would be inserted
	* @returns {boolean} `true` if an element can be inserted before child
	* @private
	* https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
	*/
	function isElementInsertionPossible(doc, child) {
		var parentChildNodes = doc.childNodes || [];
		if (find(parentChildNodes, isElementNode) || isDocTypeNode(child)) return false;
		var docTypeNode = find(parentChildNodes, isDocTypeNode);
		return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
	}
	/**
	* Check if en element node can be inserted before `child`, or at the end if child is falsy,
	* according to the presence and position of a doctype node on the same level.
	*
	* @param {Node} doc The document node
	* @param {Node} child the node that would become the nextSibling if the element would be inserted
	* @returns {boolean} `true` if an element can be inserted before child
	* @private
	* https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
	*/
	function isElementReplacementPossible(doc, child) {
		var parentChildNodes = doc.childNodes || [];
		function hasElementChildThatIsNotChild(node) {
			return isElementNode(node) && node !== child;
		}
		if (find(parentChildNodes, hasElementChildThatIsNotChild)) return false;
		var docTypeNode = find(parentChildNodes, isDocTypeNode);
		return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
	}
	/**
	* @private
	* Steps 1-5 of the checks before inserting and before replacing a child are the same.
	*
	* @param {Node} parent the parent node to insert `node` into
	* @param {Node} node the node to insert
	* @param {Node=} child the node that should become the `nextSibling` of `node`
	* @returns {Node}
	* @throws DOMException for several node combinations that would create a DOM that is not well-formed.
	* @throws DOMException if `child` is provided but is not a child of `parent`.
	* @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
	* @see https://dom.spec.whatwg.org/#concept-node-replace
	*/
	function assertPreInsertionValidity1to5(parent, node, child) {
		if (!hasValidParentNodeType(parent)) throw new DOMException(HIERARCHY_REQUEST_ERR, "Unexpected parent node type " + parent.nodeType);
		if (child && child.parentNode !== parent) throw new DOMException(NOT_FOUND_ERR, "child not in parent");
		if (!hasInsertableNodeType(node) || isDocTypeNode(node) && parent.nodeType !== Node.DOCUMENT_NODE) throw new DOMException(HIERARCHY_REQUEST_ERR, "Unexpected node type " + node.nodeType + " for parent node type " + parent.nodeType);
	}
	/**
	* @private
	* Step 6 of the checks before inserting and before replacing a child are different.
	*
	* @param {Document} parent the parent node to insert `node` into
	* @param {Node} node the node to insert
	* @param {Node | undefined} child the node that should become the `nextSibling` of `node`
	* @returns {Node}
	* @throws DOMException for several node combinations that would create a DOM that is not well-formed.
	* @throws DOMException if `child` is provided but is not a child of `parent`.
	* @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
	* @see https://dom.spec.whatwg.org/#concept-node-replace
	*/
	function assertPreInsertionValidityInDocument(parent, node, child) {
		var parentChildNodes = parent.childNodes || [];
		var nodeChildNodes = node.childNodes || [];
		if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
			var nodeChildElements = nodeChildNodes.filter(isElementNode);
			if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) throw new DOMException(HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
			if (nodeChildElements.length === 1 && !isElementInsertionPossible(parent, child)) throw new DOMException(HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
		}
		if (isElementNode(node)) {
			if (!isElementInsertionPossible(parent, child)) throw new DOMException(HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
		}
		if (isDocTypeNode(node)) {
			if (find(parentChildNodes, isDocTypeNode)) throw new DOMException(HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
			var parentElementChild = find(parentChildNodes, isElementNode);
			if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) throw new DOMException(HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
			if (!child && parentElementChild) throw new DOMException(HIERARCHY_REQUEST_ERR, "Doctype can not be appended since element is present");
		}
	}
	/**
	* @private
	* Step 6 of the checks before inserting and before replacing a child are different.
	*
	* @param {Document} parent the parent node to insert `node` into
	* @param {Node} node the node to insert
	* @param {Node | undefined} child the node that should become the `nextSibling` of `node`
	* @returns {Node}
	* @throws DOMException for several node combinations that would create a DOM that is not well-formed.
	* @throws DOMException if `child` is provided but is not a child of `parent`.
	* @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
	* @see https://dom.spec.whatwg.org/#concept-node-replace
	*/
	function assertPreReplacementValidityInDocument(parent, node, child) {
		var parentChildNodes = parent.childNodes || [];
		var nodeChildNodes = node.childNodes || [];
		if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
			var nodeChildElements = nodeChildNodes.filter(isElementNode);
			if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) throw new DOMException(HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
			if (nodeChildElements.length === 1 && !isElementReplacementPossible(parent, child)) throw new DOMException(HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
		}
		if (isElementNode(node)) {
			if (!isElementReplacementPossible(parent, child)) throw new DOMException(HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
		}
		if (isDocTypeNode(node)) {
			function hasDoctypeChildThatIsNotChild(node) {
				return isDocTypeNode(node) && node !== child;
			}
			if (find(parentChildNodes, hasDoctypeChildThatIsNotChild)) throw new DOMException(HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
			var parentElementChild = find(parentChildNodes, isElementNode);
			if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) throw new DOMException(HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
		}
	}
	/**
	* @private
	* @param {Node} parent the parent node to insert `node` into
	* @param {Node} node the node to insert
	* @param {Node=} child the node that should become the `nextSibling` of `node`
	* @returns {Node}
	* @throws DOMException for several node combinations that would create a DOM that is not well-formed.
	* @throws DOMException if `child` is provided but is not a child of `parent`.
	* @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
	*/
	function _insertBefore(parent, node, child, _inDocumentAssertion) {
		assertPreInsertionValidity1to5(parent, node, child);
		if (parent.nodeType === Node.DOCUMENT_NODE) (_inDocumentAssertion || assertPreInsertionValidityInDocument)(parent, node, child);
		var cp = node.parentNode;
		if (cp) cp.removeChild(node);
		if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
			var newFirst = node.firstChild;
			if (newFirst == null) return node;
			var newLast = node.lastChild;
		} else newFirst = newLast = node;
		var pre = child ? child.previousSibling : parent.lastChild;
		newFirst.previousSibling = pre;
		newLast.nextSibling = child;
		if (pre) pre.nextSibling = newFirst;
		else parent.firstChild = newFirst;
		if (child == null) parent.lastChild = newLast;
		else child.previousSibling = newLast;
		do {
			newFirst.parentNode = parent;
			var targetDoc = parent.ownerDocument || parent;
			_updateOwnerDocument(newFirst, targetDoc);
		} while (newFirst !== newLast && (newFirst = newFirst.nextSibling));
		_onUpdateChild(parent.ownerDocument || parent, parent);
		if (node.nodeType == DOCUMENT_FRAGMENT_NODE) node.firstChild = node.lastChild = null;
		return node;
	}
	/**
	* Recursively updates the ownerDocument property for a node and all its descendants
	* @param {Node} node
	* @param {Document} newOwnerDocument
	* @private
	*/
	function _updateOwnerDocument(node, newOwnerDocument) {
		if (node.ownerDocument === newOwnerDocument) return;
		node.ownerDocument = newOwnerDocument;
		if (node.nodeType === ELEMENT_NODE && node.attributes) for (var i = 0; i < node.attributes.length; i++) {
			var attr = node.attributes.item(i);
			if (attr) attr.ownerDocument = newOwnerDocument;
		}
		var child = node.firstChild;
		while (child) {
			_updateOwnerDocument(child, newOwnerDocument);
			child = child.nextSibling;
		}
	}
	/**
	* Appends `newChild` to `parentNode`.
	* If `newChild` is already connected to a `parentNode` it is first removed from it.
	*
	* @see https://github.com/xmldom/xmldom/issues/135
	* @see https://github.com/xmldom/xmldom/issues/145
	* @param {Node} parentNode
	* @param {Node} newChild
	* @returns {Node}
	* @private
	*/
	function _appendSingleChild(parentNode, newChild) {
		if (newChild.parentNode) newChild.parentNode.removeChild(newChild);
		newChild.parentNode = parentNode;
		newChild.previousSibling = parentNode.lastChild;
		newChild.nextSibling = null;
		if (newChild.previousSibling) newChild.previousSibling.nextSibling = newChild;
		else parentNode.firstChild = newChild;
		parentNode.lastChild = newChild;
		_onUpdateChild(parentNode.ownerDocument, parentNode, newChild);
		_updateOwnerDocument(newChild, parentNode.ownerDocument || parentNode);
		return newChild;
	}
	Document.prototype = {
		nodeName: "#document",
		nodeType: DOCUMENT_NODE,
		doctype: null,
		documentElement: null,
		_inc: 1,
		insertBefore: function(newChild, refChild) {
			if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
				var child = newChild.firstChild;
				while (child) {
					var next = child.nextSibling;
					this.insertBefore(child, refChild);
					child = next;
				}
				return newChild;
			}
			_insertBefore(this, newChild, refChild);
			_updateOwnerDocument(newChild, this);
			if (this.documentElement === null && newChild.nodeType === ELEMENT_NODE) this.documentElement = newChild;
			return newChild;
		},
		removeChild: function(oldChild) {
			if (this.documentElement == oldChild) this.documentElement = null;
			return _removeChild(this, oldChild);
		},
		replaceChild: function(newChild, oldChild) {
			_insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
			_updateOwnerDocument(newChild, this);
			if (oldChild) this.removeChild(oldChild);
			if (isElementNode(newChild)) this.documentElement = newChild;
		},
		importNode: function(importedNode, deep) {
			return importNode(this, importedNode, deep);
		},
		getElementById: function(id) {
			var rtv = null;
			_visitNode(this.documentElement, function(node) {
				if (node.nodeType == ELEMENT_NODE) {
					if (node.getAttribute("id") == id) {
						rtv = node;
						return true;
					}
				}
			});
			return rtv;
		},
		getElementsByClassName: function(classNames) {
			var classNamesSet = toOrderedSet(classNames);
			return new LiveNodeList(this, function(base) {
				var ls = [];
				if (classNamesSet.length > 0) _visitNode(base.documentElement, function(node) {
					if (node !== base && node.nodeType === ELEMENT_NODE) {
						var nodeClassNames = node.getAttribute("class");
						if (nodeClassNames) {
							var matches = classNames === nodeClassNames;
							if (!matches) {
								var nodeClassNamesSet = toOrderedSet(nodeClassNames);
								matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet));
							}
							if (matches) ls.push(node);
						}
					}
				});
				return ls;
			});
		},
		createElement: function(tagName) {
			var node = new Element();
			node.ownerDocument = this;
			node.nodeName = tagName;
			node.tagName = tagName;
			node.localName = tagName;
			node.childNodes = new NodeList();
			var attrs = node.attributes = new NamedNodeMap();
			attrs._ownerElement = node;
			return node;
		},
		createDocumentFragment: function() {
			var node = new DocumentFragment();
			node.ownerDocument = this;
			node.childNodes = new NodeList();
			return node;
		},
		createTextNode: function(data) {
			var node = new Text();
			node.ownerDocument = this;
			node.appendData(data);
			return node;
		},
		createComment: function(data) {
			var node = new Comment();
			node.ownerDocument = this;
			node.appendData(data);
			return node;
		},
		createCDATASection: function(data) {
			if (data.indexOf("]]>") !== -1) throw new DOMException(INVALID_CHARACTER_ERR, "data contains \"]]>\"");
			var node = new CDATASection();
			node.ownerDocument = this;
			node.appendData(data);
			return node;
		},
		createProcessingInstruction: function(target, data) {
			var node = new ProcessingInstruction();
			node.ownerDocument = this;
			node.tagName = node.nodeName = node.target = target;
			node.nodeValue = node.data = data;
			return node;
		},
		createAttribute: function(name) {
			var node = new Attr();
			node.ownerDocument = this;
			node.name = name;
			node.nodeName = name;
			node.localName = name;
			node.specified = true;
			return node;
		},
		createEntityReference: function(name) {
			var node = new EntityReference();
			node.ownerDocument = this;
			node.nodeName = name;
			return node;
		},
		createElementNS: function(namespaceURI, qualifiedName) {
			var node = new Element();
			var pl = qualifiedName.split(":");
			var attrs = node.attributes = new NamedNodeMap();
			node.childNodes = new NodeList();
			node.ownerDocument = this;
			node.nodeName = qualifiedName;
			node.tagName = qualifiedName;
			node.namespaceURI = namespaceURI;
			if (pl.length == 2) {
				node.prefix = pl[0];
				node.localName = pl[1];
			} else node.localName = qualifiedName;
			attrs._ownerElement = node;
			return node;
		},
		createAttributeNS: function(namespaceURI, qualifiedName) {
			var node = new Attr();
			var pl = qualifiedName.split(":");
			node.ownerDocument = this;
			node.nodeName = qualifiedName;
			node.name = qualifiedName;
			node.namespaceURI = namespaceURI;
			node.specified = true;
			if (pl.length == 2) {
				node.prefix = pl[0];
				node.localName = pl[1];
			} else node.localName = qualifiedName;
			return node;
		}
	};
	_extends(Document, Node);
	function Element() {
		this._nsMap = {};
	}
	Element.prototype = {
		nodeType: ELEMENT_NODE,
		hasAttribute: function(name) {
			return this.getAttributeNode(name) != null;
		},
		getAttribute: function(name) {
			var attr = this.getAttributeNode(name);
			return attr && attr.value || "";
		},
		getAttributeNode: function(name) {
			return this.attributes.getNamedItem(name);
		},
		setAttribute: function(name, value) {
			var attr = this.ownerDocument.createAttribute(name);
			attr.value = attr.nodeValue = "" + value;
			this.setAttributeNode(attr);
		},
		removeAttribute: function(name) {
			var attr = this.getAttributeNode(name);
			attr && this.removeAttributeNode(attr);
		},
		appendChild: function(newChild) {
			if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) return this.insertBefore(newChild, null);
			else return _appendSingleChild(this, newChild);
		},
		setAttributeNode: function(newAttr) {
			return this.attributes.setNamedItem(newAttr);
		},
		setAttributeNodeNS: function(newAttr) {
			return this.attributes.setNamedItemNS(newAttr);
		},
		removeAttributeNode: function(oldAttr) {
			return this.attributes.removeNamedItem(oldAttr.nodeName);
		},
		removeAttributeNS: function(namespaceURI, localName) {
			var old = this.getAttributeNodeNS(namespaceURI, localName);
			old && this.removeAttributeNode(old);
		},
		hasAttributeNS: function(namespaceURI, localName) {
			return this.getAttributeNodeNS(namespaceURI, localName) != null;
		},
		getAttributeNS: function(namespaceURI, localName) {
			var attr = this.getAttributeNodeNS(namespaceURI, localName);
			return attr && attr.value || "";
		},
		setAttributeNS: function(namespaceURI, qualifiedName, value) {
			var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
			attr.value = attr.nodeValue = "" + value;
			this.setAttributeNode(attr);
		},
		getAttributeNodeNS: function(namespaceURI, localName) {
			return this.attributes.getNamedItemNS(namespaceURI, localName);
		},
		getElementsByTagName: function(tagName) {
			return new LiveNodeList(this, function(base) {
				var ls = [];
				_visitNode(base, function(node) {
					if (node !== base && node.nodeType == ELEMENT_NODE && (tagName === "*" || node.tagName == tagName)) ls.push(node);
				});
				return ls;
			});
		},
		getElementsByTagNameNS: function(namespaceURI, localName) {
			return new LiveNodeList(this, function(base) {
				var ls = [];
				_visitNode(base, function(node) {
					if (node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === "*" || node.namespaceURI === namespaceURI) && (localName === "*" || node.localName == localName)) ls.push(node);
				});
				return ls;
			});
		}
	};
	Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
	Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;
	_extends(Element, Node);
	function Attr() {}
	Attr.prototype.nodeType = ATTRIBUTE_NODE;
	_extends(Attr, Node);
	function CharacterData() {}
	CharacterData.prototype = {
		data: "",
		substringData: function(offset, count) {
			return this.data.substring(offset, offset + count);
		},
		appendData: function(text) {
			text = this.data + text;
			this.nodeValue = this.data = text;
			this.length = text.length;
		},
		insertData: function(offset, text) {
			this.replaceData(offset, 0, text);
		},
		appendChild: function(newChild) {
			throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR]);
		},
		deleteData: function(offset, count) {
			this.replaceData(offset, count, "");
		},
		replaceData: function(offset, count, text) {
			var start = this.data.substring(0, offset);
			var end = this.data.substring(offset + count);
			text = start + text + end;
			this.nodeValue = this.data = text;
			this.length = text.length;
		}
	};
	_extends(CharacterData, Node);
	function Text() {}
	Text.prototype = {
		nodeName: "#text",
		nodeType: TEXT_NODE,
		splitText: function(offset) {
			var text = this.data;
			var newText = text.substring(offset);
			text = text.substring(0, offset);
			this.data = this.nodeValue = text;
			this.length = text.length;
			var newNode = this.ownerDocument.createTextNode(newText);
			if (this.parentNode) this.parentNode.insertBefore(newNode, this.nextSibling);
			return newNode;
		}
	};
	_extends(Text, CharacterData);
	function Comment() {}
	Comment.prototype = {
		nodeName: "#comment",
		nodeType: COMMENT_NODE
	};
	_extends(Comment, CharacterData);
	function CDATASection() {}
	CDATASection.prototype = {
		nodeName: "#cdata-section",
		nodeType: CDATA_SECTION_NODE
	};
	_extends(CDATASection, CharacterData);
	function DocumentType() {}
	DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
	_extends(DocumentType, Node);
	function Notation() {}
	Notation.prototype.nodeType = NOTATION_NODE;
	_extends(Notation, Node);
	function Entity() {}
	Entity.prototype.nodeType = ENTITY_NODE;
	_extends(Entity, Node);
	function EntityReference() {}
	EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
	_extends(EntityReference, Node);
	function DocumentFragment() {}
	DocumentFragment.prototype.nodeName = "#document-fragment";
	DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE;
	_extends(DocumentFragment, Node);
	function ProcessingInstruction() {}
	ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
	_extends(ProcessingInstruction, Node);
	function XMLSerializer() {}
	/**
	* Returns the result of serializing `node` to XML.
	*
	* __This implementation differs from the specification:__
	* - CDATASection nodes whose data contains `]]>` are serialized by splitting the section
	*   at each `]]>` occurrence (following W3C DOM Level 3 Core `split-cdata-sections`
	*   default behaviour). A configurable option is not yet implemented.
	*
	* @param {Node} node
	* @param {boolean} [isHtml]
	* @param {function} [nodeFilter]
	* @returns {string}
	* @see https://html.spec.whatwg.org/#dom-xmlserializer-serializetostring
	*/
	XMLSerializer.prototype.serializeToString = function(node, isHtml, nodeFilter) {
		return nodeSerializeToString.call(node, isHtml, nodeFilter);
	};
	Node.prototype.toString = nodeSerializeToString;
	function nodeSerializeToString(isHtml, nodeFilter) {
		var buf = [];
		var refNode = this.nodeType == 9 && this.documentElement || this;
		var prefix = refNode.prefix;
		var uri = refNode.namespaceURI;
		if (uri && prefix == null) {
			var prefix = refNode.lookupPrefix(uri);
			if (prefix == null) var visibleNamespaces = [{
				namespace: uri,
				prefix: null
			}];
		}
		serializeToString(this, buf, isHtml, nodeFilter, visibleNamespaces);
		return buf.join("");
	}
	function needNamespaceDefine(node, isHTML, visibleNamespaces) {
		var prefix = node.prefix || "";
		var uri = node.namespaceURI;
		if (!uri) return false;
		if (prefix === "xml" && uri === NAMESPACE.XML || uri === NAMESPACE.XMLNS) return false;
		var i = visibleNamespaces.length;
		while (i--) {
			var ns = visibleNamespaces[i];
			if (ns.prefix === prefix) return ns.namespace !== uri;
		}
		return true;
	}
	/**
	* Well-formed constraint: No < in Attribute Values
	* > The replacement text of any entity referred to directly or indirectly
	* > in an attribute value must not contain a <.
	* @see https://www.w3.org/TR/xml11/#CleanAttrVals
	* @see https://www.w3.org/TR/xml11/#NT-AttValue
	*
	* Literal whitespace other than space that appear in attribute values
	* are serialized as their entity references, so they will be preserved.
	* (In contrast to whitespace literals in the input which are normalized to spaces)
	* @see https://www.w3.org/TR/xml11/#AVNormalize
	* @see https://w3c.github.io/DOM-Parsing/#serializing-an-element-s-attributes
	*/
	function addSerializedAttribute(buf, qualifiedName, value) {
		buf.push(" ", qualifiedName, "=\"", value.replace(/[<>&"\t\n\r]/g, _xmlEncoder), "\"");
	}
	function serializeToString(node, buf, isHTML, nodeFilter, visibleNamespaces) {
		if (!visibleNamespaces) visibleNamespaces = [];
		if (nodeFilter) {
			node = nodeFilter(node);
			if (node) {
				if (typeof node == "string") {
					buf.push(node);
					return;
				}
			} else return;
		}
		switch (node.nodeType) {
			case ELEMENT_NODE:
				var attrs = node.attributes;
				var len = attrs.length;
				var child = node.firstChild;
				var nodeName = node.tagName;
				isHTML = NAMESPACE.isHTML(node.namespaceURI) || isHTML;
				var prefixedNodeName = nodeName;
				if (!isHTML && !node.prefix && node.namespaceURI) {
					var defaultNS;
					for (var ai = 0; ai < attrs.length; ai++) if (attrs.item(ai).name === "xmlns") {
						defaultNS = attrs.item(ai).value;
						break;
					}
					if (!defaultNS) for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
						var namespace = visibleNamespaces[nsi];
						if (namespace.prefix === "" && namespace.namespace === node.namespaceURI) {
							defaultNS = namespace.namespace;
							break;
						}
					}
					if (defaultNS !== node.namespaceURI) for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
						var namespace = visibleNamespaces[nsi];
						if (namespace.namespace === node.namespaceURI) {
							if (namespace.prefix) prefixedNodeName = namespace.prefix + ":" + nodeName;
							break;
						}
					}
				}
				buf.push("<", prefixedNodeName);
				for (var i = 0; i < len; i++) {
					var attr = attrs.item(i);
					if (attr.prefix == "xmlns") visibleNamespaces.push({
						prefix: attr.localName,
						namespace: attr.value
					});
					else if (attr.nodeName == "xmlns") visibleNamespaces.push({
						prefix: "",
						namespace: attr.value
					});
				}
				for (var i = 0; i < len; i++) {
					var attr = attrs.item(i);
					if (needNamespaceDefine(attr, isHTML, visibleNamespaces)) {
						var prefix = attr.prefix || "";
						var uri = attr.namespaceURI;
						addSerializedAttribute(buf, prefix ? "xmlns:" + prefix : "xmlns", uri);
						visibleNamespaces.push({
							prefix,
							namespace: uri
						});
					}
					serializeToString(attr, buf, isHTML, nodeFilter, visibleNamespaces);
				}
				if (nodeName === prefixedNodeName && needNamespaceDefine(node, isHTML, visibleNamespaces)) {
					var prefix = node.prefix || "";
					var uri = node.namespaceURI;
					addSerializedAttribute(buf, prefix ? "xmlns:" + prefix : "xmlns", uri);
					visibleNamespaces.push({
						prefix,
						namespace: uri
					});
				}
				if (child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)) {
					buf.push(">");
					if (isHTML && /^script$/i.test(nodeName)) while (child) {
						if (child.data) buf.push(child.data);
						else serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
						child = child.nextSibling;
					}
					else while (child) {
						serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
						child = child.nextSibling;
					}
					buf.push("</", prefixedNodeName, ">");
				} else buf.push("/>");
				return;
			case DOCUMENT_NODE:
			case DOCUMENT_FRAGMENT_NODE:
				var child = node.firstChild;
				while (child) {
					serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
					child = child.nextSibling;
				}
				return;
			case ATTRIBUTE_NODE: return addSerializedAttribute(buf, node.name, node.value);
			case TEXT_NODE:
 /**
			* The ampersand character (&) and the left angle bracket (<) must not appear in their literal form,
			* except when used as markup delimiters, or within a comment, a processing instruction, or a CDATA section.
			* If they are needed elsewhere, they must be escaped using either numeric character references or the strings
			* `&amp;` and `&lt;` respectively.
			* The right angle bracket (>) may be represented using the string " &gt; ", and must, for compatibility,
			* be escaped using either `&gt;` or a character reference when it appears in the string `]]>` in content,
			* when that string is not marking the end of a CDATA section.
			*
			* In the content of elements, character data is any string of characters
			* which does not contain the start-delimiter of any markup
			* and does not include the CDATA-section-close delimiter, `]]>`.
			*
			* @see https://www.w3.org/TR/xml/#NT-CharData
			* @see https://w3c.github.io/DOM-Parsing/#xml-serializing-a-text-node
			*/
			return buf.push(node.data.replace(/[<&>]/g, _xmlEncoder));
			case CDATA_SECTION_NODE: return buf.push("<![CDATA[", node.data.replace(/]]>/g, "]]]]><![CDATA[>"), "]]>");
			case COMMENT_NODE: return buf.push("<!--", node.data, "-->");
			case DOCUMENT_TYPE_NODE:
				var pubid = node.publicId;
				var sysid = node.systemId;
				buf.push("<!DOCTYPE ", node.name);
				if (pubid) {
					buf.push(" PUBLIC ", pubid);
					if (sysid && sysid != ".") buf.push(" ", sysid);
					buf.push(">");
				} else if (sysid && sysid != ".") buf.push(" SYSTEM ", sysid, ">");
				else {
					var sub = node.internalSubset;
					if (sub) buf.push(" [", sub, "]");
					buf.push(">");
				}
				return;
			case PROCESSING_INSTRUCTION_NODE: return buf.push("<?", node.target, " ", node.data, "?>");
			case ENTITY_REFERENCE_NODE: return buf.push("&", node.nodeName, ";");
			default: buf.push("??", node.nodeName);
		}
	}
	function importNode(doc, node, deep) {
		var node2;
		switch (node.nodeType) {
			case ELEMENT_NODE:
				node2 = node.cloneNode(false);
				node2.ownerDocument = doc;
			case DOCUMENT_FRAGMENT_NODE: break;
			case ATTRIBUTE_NODE:
				deep = true;
				break;
		}
		if (!node2) node2 = node.cloneNode(false);
		node2.ownerDocument = doc;
		node2.parentNode = null;
		if (deep) {
			var child = node.firstChild;
			while (child) {
				node2.appendChild(importNode(doc, child, deep));
				child = child.nextSibling;
			}
		}
		return node2;
	}
	function cloneNode(doc, node, deep) {
		var node2 = new node.constructor();
		for (var n in node) if (Object.prototype.hasOwnProperty.call(node, n)) {
			var v = node[n];
			if (typeof v != "object") {
				if (v != node2[n]) node2[n] = v;
			}
		}
		if (node.childNodes) node2.childNodes = new NodeList();
		node2.ownerDocument = doc;
		switch (node2.nodeType) {
			case ELEMENT_NODE:
				var attrs = node.attributes;
				var attrs2 = node2.attributes = new NamedNodeMap();
				var len = attrs.length;
				attrs2._ownerElement = node2;
				for (var i = 0; i < len; i++) node2.setAttributeNode(cloneNode(doc, attrs.item(i), true));
				break;
			case ATTRIBUTE_NODE: deep = true;
		}
		if (deep) {
			var child = node.firstChild;
			while (child) {
				node2.appendChild(cloneNode(doc, child, deep));
				child = child.nextSibling;
			}
		}
		return node2;
	}
	function __set__(object, key, value) {
		object[key] = value;
	}
	try {
		if (Object.defineProperty) {
			Object.defineProperty(LiveNodeList.prototype, "length", { get: function() {
				_updateLiveList(this);
				return this.$$length;
			} });
			Object.defineProperty(Node.prototype, "textContent", {
				get: function() {
					return getTextContent(this);
				},
				set: function(data) {
					switch (this.nodeType) {
						case ELEMENT_NODE:
						case DOCUMENT_FRAGMENT_NODE:
							while (this.firstChild) this.removeChild(this.firstChild);
							if (data || String(data)) this.appendChild(this.ownerDocument.createTextNode(data));
							break;
						default:
							this.data = data;
							this.value = data;
							this.nodeValue = data;
					}
				}
			});
			function getTextContent(node) {
				switch (node.nodeType) {
					case ELEMENT_NODE:
					case DOCUMENT_FRAGMENT_NODE:
						var buf = [];
						node = node.firstChild;
						while (node) {
							if (node.nodeType !== 7 && node.nodeType !== 8) buf.push(getTextContent(node));
							node = node.nextSibling;
						}
						return buf.join("");
					default: return node.nodeValue;
				}
			}
			__set__ = function(object, key, value) {
				object["$$" + key] = value;
			};
		}
	} catch (e) {}
	exports.DocumentType = DocumentType;
	exports.DOMException = DOMException;
	exports.DOMImplementation = DOMImplementation;
	exports.Element = Element;
	exports.Node = Node;
	exports.NodeList = NodeList;
	exports.XMLSerializer = XMLSerializer;
}));
//#endregion
//#region node_modules/@xmldom/xmldom/lib/entities.js
var require_entities = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var freeze = require_conventions().freeze;
	/**
	* The entities that are predefined in every XML document.
	*
	* @see https://www.w3.org/TR/2006/REC-xml11-20060816/#sec-predefined-ent W3C XML 1.1
	* @see https://www.w3.org/TR/2008/REC-xml-20081126/#sec-predefined-ent W3C XML 1.0
	* @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Predefined_entities_in_XML Wikipedia
	*/
	exports.XML_ENTITIES = freeze({
		amp: "&",
		apos: "'",
		gt: ">",
		lt: "<",
		quot: "\""
	});
	/**
	* A map of all entities that are detected in an HTML document.
	* They contain all entries from `XML_ENTITIES`.
	*
	* @see XML_ENTITIES
	* @see DOMParser.parseFromString
	* @see DOMImplementation.prototype.createHTMLDocument
	* @see https://html.spec.whatwg.org/#named-character-references WHATWG HTML(5) Spec
	* @see https://html.spec.whatwg.org/entities.json JSON
	* @see https://www.w3.org/TR/xml-entity-names/ W3C XML Entity Names
	* @see https://www.w3.org/TR/html4/sgml/entities.html W3C HTML4/SGML
	* @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Character_entity_references_in_HTML Wikipedia (HTML)
	* @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Entities_representing_special_characters_in_XHTML Wikpedia (XHTML)
	*/
	exports.HTML_ENTITIES = freeze({
		Aacute: "Á",
		aacute: "á",
		Abreve: "Ă",
		abreve: "ă",
		ac: "∾",
		acd: "∿",
		acE: "∾̳",
		Acirc: "Â",
		acirc: "â",
		acute: "´",
		Acy: "А",
		acy: "а",
		AElig: "Æ",
		aelig: "æ",
		af: "⁡",
		Afr: "𝔄",
		afr: "𝔞",
		Agrave: "À",
		agrave: "à",
		alefsym: "ℵ",
		aleph: "ℵ",
		Alpha: "Α",
		alpha: "α",
		Amacr: "Ā",
		amacr: "ā",
		amalg: "⨿",
		AMP: "&",
		amp: "&",
		And: "⩓",
		and: "∧",
		andand: "⩕",
		andd: "⩜",
		andslope: "⩘",
		andv: "⩚",
		ang: "∠",
		ange: "⦤",
		angle: "∠",
		angmsd: "∡",
		angmsdaa: "⦨",
		angmsdab: "⦩",
		angmsdac: "⦪",
		angmsdad: "⦫",
		angmsdae: "⦬",
		angmsdaf: "⦭",
		angmsdag: "⦮",
		angmsdah: "⦯",
		angrt: "∟",
		angrtvb: "⊾",
		angrtvbd: "⦝",
		angsph: "∢",
		angst: "Å",
		angzarr: "⍼",
		Aogon: "Ą",
		aogon: "ą",
		Aopf: "𝔸",
		aopf: "𝕒",
		ap: "≈",
		apacir: "⩯",
		apE: "⩰",
		ape: "≊",
		apid: "≋",
		apos: "'",
		ApplyFunction: "⁡",
		approx: "≈",
		approxeq: "≊",
		Aring: "Å",
		aring: "å",
		Ascr: "𝒜",
		ascr: "𝒶",
		Assign: "≔",
		ast: "*",
		asymp: "≈",
		asympeq: "≍",
		Atilde: "Ã",
		atilde: "ã",
		Auml: "Ä",
		auml: "ä",
		awconint: "∳",
		awint: "⨑",
		backcong: "≌",
		backepsilon: "϶",
		backprime: "‵",
		backsim: "∽",
		backsimeq: "⋍",
		Backslash: "∖",
		Barv: "⫧",
		barvee: "⊽",
		Barwed: "⌆",
		barwed: "⌅",
		barwedge: "⌅",
		bbrk: "⎵",
		bbrktbrk: "⎶",
		bcong: "≌",
		Bcy: "Б",
		bcy: "б",
		bdquo: "„",
		becaus: "∵",
		Because: "∵",
		because: "∵",
		bemptyv: "⦰",
		bepsi: "϶",
		bernou: "ℬ",
		Bernoullis: "ℬ",
		Beta: "Β",
		beta: "β",
		beth: "ℶ",
		between: "≬",
		Bfr: "𝔅",
		bfr: "𝔟",
		bigcap: "⋂",
		bigcirc: "◯",
		bigcup: "⋃",
		bigodot: "⨀",
		bigoplus: "⨁",
		bigotimes: "⨂",
		bigsqcup: "⨆",
		bigstar: "★",
		bigtriangledown: "▽",
		bigtriangleup: "△",
		biguplus: "⨄",
		bigvee: "⋁",
		bigwedge: "⋀",
		bkarow: "⤍",
		blacklozenge: "⧫",
		blacksquare: "▪",
		blacktriangle: "▴",
		blacktriangledown: "▾",
		blacktriangleleft: "◂",
		blacktriangleright: "▸",
		blank: "␣",
		blk12: "▒",
		blk14: "░",
		blk34: "▓",
		block: "█",
		bne: "=⃥",
		bnequiv: "≡⃥",
		bNot: "⫭",
		bnot: "⌐",
		Bopf: "𝔹",
		bopf: "𝕓",
		bot: "⊥",
		bottom: "⊥",
		bowtie: "⋈",
		boxbox: "⧉",
		boxDL: "╗",
		boxDl: "╖",
		boxdL: "╕",
		boxdl: "┐",
		boxDR: "╔",
		boxDr: "╓",
		boxdR: "╒",
		boxdr: "┌",
		boxH: "═",
		boxh: "─",
		boxHD: "╦",
		boxHd: "╤",
		boxhD: "╥",
		boxhd: "┬",
		boxHU: "╩",
		boxHu: "╧",
		boxhU: "╨",
		boxhu: "┴",
		boxminus: "⊟",
		boxplus: "⊞",
		boxtimes: "⊠",
		boxUL: "╝",
		boxUl: "╜",
		boxuL: "╛",
		boxul: "┘",
		boxUR: "╚",
		boxUr: "╙",
		boxuR: "╘",
		boxur: "└",
		boxV: "║",
		boxv: "│",
		boxVH: "╬",
		boxVh: "╫",
		boxvH: "╪",
		boxvh: "┼",
		boxVL: "╣",
		boxVl: "╢",
		boxvL: "╡",
		boxvl: "┤",
		boxVR: "╠",
		boxVr: "╟",
		boxvR: "╞",
		boxvr: "├",
		bprime: "‵",
		Breve: "˘",
		breve: "˘",
		brvbar: "¦",
		Bscr: "ℬ",
		bscr: "𝒷",
		bsemi: "⁏",
		bsim: "∽",
		bsime: "⋍",
		bsol: "\\",
		bsolb: "⧅",
		bsolhsub: "⟈",
		bull: "•",
		bullet: "•",
		bump: "≎",
		bumpE: "⪮",
		bumpe: "≏",
		Bumpeq: "≎",
		bumpeq: "≏",
		Cacute: "Ć",
		cacute: "ć",
		Cap: "⋒",
		cap: "∩",
		capand: "⩄",
		capbrcup: "⩉",
		capcap: "⩋",
		capcup: "⩇",
		capdot: "⩀",
		CapitalDifferentialD: "ⅅ",
		caps: "∩︀",
		caret: "⁁",
		caron: "ˇ",
		Cayleys: "ℭ",
		ccaps: "⩍",
		Ccaron: "Č",
		ccaron: "č",
		Ccedil: "Ç",
		ccedil: "ç",
		Ccirc: "Ĉ",
		ccirc: "ĉ",
		Cconint: "∰",
		ccups: "⩌",
		ccupssm: "⩐",
		Cdot: "Ċ",
		cdot: "ċ",
		cedil: "¸",
		Cedilla: "¸",
		cemptyv: "⦲",
		cent: "¢",
		CenterDot: "·",
		centerdot: "·",
		Cfr: "ℭ",
		cfr: "𝔠",
		CHcy: "Ч",
		chcy: "ч",
		check: "✓",
		checkmark: "✓",
		Chi: "Χ",
		chi: "χ",
		cir: "○",
		circ: "ˆ",
		circeq: "≗",
		circlearrowleft: "↺",
		circlearrowright: "↻",
		circledast: "⊛",
		circledcirc: "⊚",
		circleddash: "⊝",
		CircleDot: "⊙",
		circledR: "®",
		circledS: "Ⓢ",
		CircleMinus: "⊖",
		CirclePlus: "⊕",
		CircleTimes: "⊗",
		cirE: "⧃",
		cire: "≗",
		cirfnint: "⨐",
		cirmid: "⫯",
		cirscir: "⧂",
		ClockwiseContourIntegral: "∲",
		CloseCurlyDoubleQuote: "”",
		CloseCurlyQuote: "’",
		clubs: "♣",
		clubsuit: "♣",
		Colon: "∷",
		colon: ":",
		Colone: "⩴",
		colone: "≔",
		coloneq: "≔",
		comma: ",",
		commat: "@",
		comp: "∁",
		compfn: "∘",
		complement: "∁",
		complexes: "ℂ",
		cong: "≅",
		congdot: "⩭",
		Congruent: "≡",
		Conint: "∯",
		conint: "∮",
		ContourIntegral: "∮",
		Copf: "ℂ",
		copf: "𝕔",
		coprod: "∐",
		Coproduct: "∐",
		COPY: "©",
		copy: "©",
		copysr: "℗",
		CounterClockwiseContourIntegral: "∳",
		crarr: "↵",
		Cross: "⨯",
		cross: "✗",
		Cscr: "𝒞",
		cscr: "𝒸",
		csub: "⫏",
		csube: "⫑",
		csup: "⫐",
		csupe: "⫒",
		ctdot: "⋯",
		cudarrl: "⤸",
		cudarrr: "⤵",
		cuepr: "⋞",
		cuesc: "⋟",
		cularr: "↶",
		cularrp: "⤽",
		Cup: "⋓",
		cup: "∪",
		cupbrcap: "⩈",
		CupCap: "≍",
		cupcap: "⩆",
		cupcup: "⩊",
		cupdot: "⊍",
		cupor: "⩅",
		cups: "∪︀",
		curarr: "↷",
		curarrm: "⤼",
		curlyeqprec: "⋞",
		curlyeqsucc: "⋟",
		curlyvee: "⋎",
		curlywedge: "⋏",
		curren: "¤",
		curvearrowleft: "↶",
		curvearrowright: "↷",
		cuvee: "⋎",
		cuwed: "⋏",
		cwconint: "∲",
		cwint: "∱",
		cylcty: "⌭",
		Dagger: "‡",
		dagger: "†",
		daleth: "ℸ",
		Darr: "↡",
		dArr: "⇓",
		darr: "↓",
		dash: "‐",
		Dashv: "⫤",
		dashv: "⊣",
		dbkarow: "⤏",
		dblac: "˝",
		Dcaron: "Ď",
		dcaron: "ď",
		Dcy: "Д",
		dcy: "д",
		DD: "ⅅ",
		dd: "ⅆ",
		ddagger: "‡",
		ddarr: "⇊",
		DDotrahd: "⤑",
		ddotseq: "⩷",
		deg: "°",
		Del: "∇",
		Delta: "Δ",
		delta: "δ",
		demptyv: "⦱",
		dfisht: "⥿",
		Dfr: "𝔇",
		dfr: "𝔡",
		dHar: "⥥",
		dharl: "⇃",
		dharr: "⇂",
		DiacriticalAcute: "´",
		DiacriticalDot: "˙",
		DiacriticalDoubleAcute: "˝",
		DiacriticalGrave: "`",
		DiacriticalTilde: "˜",
		diam: "⋄",
		Diamond: "⋄",
		diamond: "⋄",
		diamondsuit: "♦",
		diams: "♦",
		die: "¨",
		DifferentialD: "ⅆ",
		digamma: "ϝ",
		disin: "⋲",
		div: "÷",
		divide: "÷",
		divideontimes: "⋇",
		divonx: "⋇",
		DJcy: "Ђ",
		djcy: "ђ",
		dlcorn: "⌞",
		dlcrop: "⌍",
		dollar: "$",
		Dopf: "𝔻",
		dopf: "𝕕",
		Dot: "¨",
		dot: "˙",
		DotDot: "⃜",
		doteq: "≐",
		doteqdot: "≑",
		DotEqual: "≐",
		dotminus: "∸",
		dotplus: "∔",
		dotsquare: "⊡",
		doublebarwedge: "⌆",
		DoubleContourIntegral: "∯",
		DoubleDot: "¨",
		DoubleDownArrow: "⇓",
		DoubleLeftArrow: "⇐",
		DoubleLeftRightArrow: "⇔",
		DoubleLeftTee: "⫤",
		DoubleLongLeftArrow: "⟸",
		DoubleLongLeftRightArrow: "⟺",
		DoubleLongRightArrow: "⟹",
		DoubleRightArrow: "⇒",
		DoubleRightTee: "⊨",
		DoubleUpArrow: "⇑",
		DoubleUpDownArrow: "⇕",
		DoubleVerticalBar: "∥",
		DownArrow: "↓",
		Downarrow: "⇓",
		downarrow: "↓",
		DownArrowBar: "⤓",
		DownArrowUpArrow: "⇵",
		DownBreve: "̑",
		downdownarrows: "⇊",
		downharpoonleft: "⇃",
		downharpoonright: "⇂",
		DownLeftRightVector: "⥐",
		DownLeftTeeVector: "⥞",
		DownLeftVector: "↽",
		DownLeftVectorBar: "⥖",
		DownRightTeeVector: "⥟",
		DownRightVector: "⇁",
		DownRightVectorBar: "⥗",
		DownTee: "⊤",
		DownTeeArrow: "↧",
		drbkarow: "⤐",
		drcorn: "⌟",
		drcrop: "⌌",
		Dscr: "𝒟",
		dscr: "𝒹",
		DScy: "Ѕ",
		dscy: "ѕ",
		dsol: "⧶",
		Dstrok: "Đ",
		dstrok: "đ",
		dtdot: "⋱",
		dtri: "▿",
		dtrif: "▾",
		duarr: "⇵",
		duhar: "⥯",
		dwangle: "⦦",
		DZcy: "Џ",
		dzcy: "џ",
		dzigrarr: "⟿",
		Eacute: "É",
		eacute: "é",
		easter: "⩮",
		Ecaron: "Ě",
		ecaron: "ě",
		ecir: "≖",
		Ecirc: "Ê",
		ecirc: "ê",
		ecolon: "≕",
		Ecy: "Э",
		ecy: "э",
		eDDot: "⩷",
		Edot: "Ė",
		eDot: "≑",
		edot: "ė",
		ee: "ⅇ",
		efDot: "≒",
		Efr: "𝔈",
		efr: "𝔢",
		eg: "⪚",
		Egrave: "È",
		egrave: "è",
		egs: "⪖",
		egsdot: "⪘",
		el: "⪙",
		Element: "∈",
		elinters: "⏧",
		ell: "ℓ",
		els: "⪕",
		elsdot: "⪗",
		Emacr: "Ē",
		emacr: "ē",
		empty: "∅",
		emptyset: "∅",
		EmptySmallSquare: "◻",
		emptyv: "∅",
		EmptyVerySmallSquare: "▫",
		emsp: " ",
		emsp13: " ",
		emsp14: " ",
		ENG: "Ŋ",
		eng: "ŋ",
		ensp: " ",
		Eogon: "Ę",
		eogon: "ę",
		Eopf: "𝔼",
		eopf: "𝕖",
		epar: "⋕",
		eparsl: "⧣",
		eplus: "⩱",
		epsi: "ε",
		Epsilon: "Ε",
		epsilon: "ε",
		epsiv: "ϵ",
		eqcirc: "≖",
		eqcolon: "≕",
		eqsim: "≂",
		eqslantgtr: "⪖",
		eqslantless: "⪕",
		Equal: "⩵",
		equals: "=",
		EqualTilde: "≂",
		equest: "≟",
		Equilibrium: "⇌",
		equiv: "≡",
		equivDD: "⩸",
		eqvparsl: "⧥",
		erarr: "⥱",
		erDot: "≓",
		Escr: "ℰ",
		escr: "ℯ",
		esdot: "≐",
		Esim: "⩳",
		esim: "≂",
		Eta: "Η",
		eta: "η",
		ETH: "Ð",
		eth: "ð",
		Euml: "Ë",
		euml: "ë",
		euro: "€",
		excl: "!",
		exist: "∃",
		Exists: "∃",
		expectation: "ℰ",
		ExponentialE: "ⅇ",
		exponentiale: "ⅇ",
		fallingdotseq: "≒",
		Fcy: "Ф",
		fcy: "ф",
		female: "♀",
		ffilig: "ﬃ",
		fflig: "ﬀ",
		ffllig: "ﬄ",
		Ffr: "𝔉",
		ffr: "𝔣",
		filig: "ﬁ",
		FilledSmallSquare: "◼",
		FilledVerySmallSquare: "▪",
		fjlig: "fj",
		flat: "♭",
		fllig: "ﬂ",
		fltns: "▱",
		fnof: "ƒ",
		Fopf: "𝔽",
		fopf: "𝕗",
		ForAll: "∀",
		forall: "∀",
		fork: "⋔",
		forkv: "⫙",
		Fouriertrf: "ℱ",
		fpartint: "⨍",
		frac12: "½",
		frac13: "⅓",
		frac14: "¼",
		frac15: "⅕",
		frac16: "⅙",
		frac18: "⅛",
		frac23: "⅔",
		frac25: "⅖",
		frac34: "¾",
		frac35: "⅗",
		frac38: "⅜",
		frac45: "⅘",
		frac56: "⅚",
		frac58: "⅝",
		frac78: "⅞",
		frasl: "⁄",
		frown: "⌢",
		Fscr: "ℱ",
		fscr: "𝒻",
		gacute: "ǵ",
		Gamma: "Γ",
		gamma: "γ",
		Gammad: "Ϝ",
		gammad: "ϝ",
		gap: "⪆",
		Gbreve: "Ğ",
		gbreve: "ğ",
		Gcedil: "Ģ",
		Gcirc: "Ĝ",
		gcirc: "ĝ",
		Gcy: "Г",
		gcy: "г",
		Gdot: "Ġ",
		gdot: "ġ",
		gE: "≧",
		ge: "≥",
		gEl: "⪌",
		gel: "⋛",
		geq: "≥",
		geqq: "≧",
		geqslant: "⩾",
		ges: "⩾",
		gescc: "⪩",
		gesdot: "⪀",
		gesdoto: "⪂",
		gesdotol: "⪄",
		gesl: "⋛︀",
		gesles: "⪔",
		Gfr: "𝔊",
		gfr: "𝔤",
		Gg: "⋙",
		gg: "≫",
		ggg: "⋙",
		gimel: "ℷ",
		GJcy: "Ѓ",
		gjcy: "ѓ",
		gl: "≷",
		gla: "⪥",
		glE: "⪒",
		glj: "⪤",
		gnap: "⪊",
		gnapprox: "⪊",
		gnE: "≩",
		gne: "⪈",
		gneq: "⪈",
		gneqq: "≩",
		gnsim: "⋧",
		Gopf: "𝔾",
		gopf: "𝕘",
		grave: "`",
		GreaterEqual: "≥",
		GreaterEqualLess: "⋛",
		GreaterFullEqual: "≧",
		GreaterGreater: "⪢",
		GreaterLess: "≷",
		GreaterSlantEqual: "⩾",
		GreaterTilde: "≳",
		Gscr: "𝒢",
		gscr: "ℊ",
		gsim: "≳",
		gsime: "⪎",
		gsiml: "⪐",
		Gt: "≫",
		GT: ">",
		gt: ">",
		gtcc: "⪧",
		gtcir: "⩺",
		gtdot: "⋗",
		gtlPar: "⦕",
		gtquest: "⩼",
		gtrapprox: "⪆",
		gtrarr: "⥸",
		gtrdot: "⋗",
		gtreqless: "⋛",
		gtreqqless: "⪌",
		gtrless: "≷",
		gtrsim: "≳",
		gvertneqq: "≩︀",
		gvnE: "≩︀",
		Hacek: "ˇ",
		hairsp: " ",
		half: "½",
		hamilt: "ℋ",
		HARDcy: "Ъ",
		hardcy: "ъ",
		hArr: "⇔",
		harr: "↔",
		harrcir: "⥈",
		harrw: "↭",
		Hat: "^",
		hbar: "ℏ",
		Hcirc: "Ĥ",
		hcirc: "ĥ",
		hearts: "♥",
		heartsuit: "♥",
		hellip: "…",
		hercon: "⊹",
		Hfr: "ℌ",
		hfr: "𝔥",
		HilbertSpace: "ℋ",
		hksearow: "⤥",
		hkswarow: "⤦",
		hoarr: "⇿",
		homtht: "∻",
		hookleftarrow: "↩",
		hookrightarrow: "↪",
		Hopf: "ℍ",
		hopf: "𝕙",
		horbar: "―",
		HorizontalLine: "─",
		Hscr: "ℋ",
		hscr: "𝒽",
		hslash: "ℏ",
		Hstrok: "Ħ",
		hstrok: "ħ",
		HumpDownHump: "≎",
		HumpEqual: "≏",
		hybull: "⁃",
		hyphen: "‐",
		Iacute: "Í",
		iacute: "í",
		ic: "⁣",
		Icirc: "Î",
		icirc: "î",
		Icy: "И",
		icy: "и",
		Idot: "İ",
		IEcy: "Е",
		iecy: "е",
		iexcl: "¡",
		iff: "⇔",
		Ifr: "ℑ",
		ifr: "𝔦",
		Igrave: "Ì",
		igrave: "ì",
		ii: "ⅈ",
		iiiint: "⨌",
		iiint: "∭",
		iinfin: "⧜",
		iiota: "℩",
		IJlig: "Ĳ",
		ijlig: "ĳ",
		Im: "ℑ",
		Imacr: "Ī",
		imacr: "ī",
		image: "ℑ",
		ImaginaryI: "ⅈ",
		imagline: "ℐ",
		imagpart: "ℑ",
		imath: "ı",
		imof: "⊷",
		imped: "Ƶ",
		Implies: "⇒",
		in: "∈",
		incare: "℅",
		infin: "∞",
		infintie: "⧝",
		inodot: "ı",
		Int: "∬",
		int: "∫",
		intcal: "⊺",
		integers: "ℤ",
		Integral: "∫",
		intercal: "⊺",
		Intersection: "⋂",
		intlarhk: "⨗",
		intprod: "⨼",
		InvisibleComma: "⁣",
		InvisibleTimes: "⁢",
		IOcy: "Ё",
		iocy: "ё",
		Iogon: "Į",
		iogon: "į",
		Iopf: "𝕀",
		iopf: "𝕚",
		Iota: "Ι",
		iota: "ι",
		iprod: "⨼",
		iquest: "¿",
		Iscr: "ℐ",
		iscr: "𝒾",
		isin: "∈",
		isindot: "⋵",
		isinE: "⋹",
		isins: "⋴",
		isinsv: "⋳",
		isinv: "∈",
		it: "⁢",
		Itilde: "Ĩ",
		itilde: "ĩ",
		Iukcy: "І",
		iukcy: "і",
		Iuml: "Ï",
		iuml: "ï",
		Jcirc: "Ĵ",
		jcirc: "ĵ",
		Jcy: "Й",
		jcy: "й",
		Jfr: "𝔍",
		jfr: "𝔧",
		jmath: "ȷ",
		Jopf: "𝕁",
		jopf: "𝕛",
		Jscr: "𝒥",
		jscr: "𝒿",
		Jsercy: "Ј",
		jsercy: "ј",
		Jukcy: "Є",
		jukcy: "є",
		Kappa: "Κ",
		kappa: "κ",
		kappav: "ϰ",
		Kcedil: "Ķ",
		kcedil: "ķ",
		Kcy: "К",
		kcy: "к",
		Kfr: "𝔎",
		kfr: "𝔨",
		kgreen: "ĸ",
		KHcy: "Х",
		khcy: "х",
		KJcy: "Ќ",
		kjcy: "ќ",
		Kopf: "𝕂",
		kopf: "𝕜",
		Kscr: "𝒦",
		kscr: "𝓀",
		lAarr: "⇚",
		Lacute: "Ĺ",
		lacute: "ĺ",
		laemptyv: "⦴",
		lagran: "ℒ",
		Lambda: "Λ",
		lambda: "λ",
		Lang: "⟪",
		lang: "⟨",
		langd: "⦑",
		langle: "⟨",
		lap: "⪅",
		Laplacetrf: "ℒ",
		laquo: "«",
		Larr: "↞",
		lArr: "⇐",
		larr: "←",
		larrb: "⇤",
		larrbfs: "⤟",
		larrfs: "⤝",
		larrhk: "↩",
		larrlp: "↫",
		larrpl: "⤹",
		larrsim: "⥳",
		larrtl: "↢",
		lat: "⪫",
		lAtail: "⤛",
		latail: "⤙",
		late: "⪭",
		lates: "⪭︀",
		lBarr: "⤎",
		lbarr: "⤌",
		lbbrk: "❲",
		lbrace: "{",
		lbrack: "[",
		lbrke: "⦋",
		lbrksld: "⦏",
		lbrkslu: "⦍",
		Lcaron: "Ľ",
		lcaron: "ľ",
		Lcedil: "Ļ",
		lcedil: "ļ",
		lceil: "⌈",
		lcub: "{",
		Lcy: "Л",
		lcy: "л",
		ldca: "⤶",
		ldquo: "“",
		ldquor: "„",
		ldrdhar: "⥧",
		ldrushar: "⥋",
		ldsh: "↲",
		lE: "≦",
		le: "≤",
		LeftAngleBracket: "⟨",
		LeftArrow: "←",
		Leftarrow: "⇐",
		leftarrow: "←",
		LeftArrowBar: "⇤",
		LeftArrowRightArrow: "⇆",
		leftarrowtail: "↢",
		LeftCeiling: "⌈",
		LeftDoubleBracket: "⟦",
		LeftDownTeeVector: "⥡",
		LeftDownVector: "⇃",
		LeftDownVectorBar: "⥙",
		LeftFloor: "⌊",
		leftharpoondown: "↽",
		leftharpoonup: "↼",
		leftleftarrows: "⇇",
		LeftRightArrow: "↔",
		Leftrightarrow: "⇔",
		leftrightarrow: "↔",
		leftrightarrows: "⇆",
		leftrightharpoons: "⇋",
		leftrightsquigarrow: "↭",
		LeftRightVector: "⥎",
		LeftTee: "⊣",
		LeftTeeArrow: "↤",
		LeftTeeVector: "⥚",
		leftthreetimes: "⋋",
		LeftTriangle: "⊲",
		LeftTriangleBar: "⧏",
		LeftTriangleEqual: "⊴",
		LeftUpDownVector: "⥑",
		LeftUpTeeVector: "⥠",
		LeftUpVector: "↿",
		LeftUpVectorBar: "⥘",
		LeftVector: "↼",
		LeftVectorBar: "⥒",
		lEg: "⪋",
		leg: "⋚",
		leq: "≤",
		leqq: "≦",
		leqslant: "⩽",
		les: "⩽",
		lescc: "⪨",
		lesdot: "⩿",
		lesdoto: "⪁",
		lesdotor: "⪃",
		lesg: "⋚︀",
		lesges: "⪓",
		lessapprox: "⪅",
		lessdot: "⋖",
		lesseqgtr: "⋚",
		lesseqqgtr: "⪋",
		LessEqualGreater: "⋚",
		LessFullEqual: "≦",
		LessGreater: "≶",
		lessgtr: "≶",
		LessLess: "⪡",
		lesssim: "≲",
		LessSlantEqual: "⩽",
		LessTilde: "≲",
		lfisht: "⥼",
		lfloor: "⌊",
		Lfr: "𝔏",
		lfr: "𝔩",
		lg: "≶",
		lgE: "⪑",
		lHar: "⥢",
		lhard: "↽",
		lharu: "↼",
		lharul: "⥪",
		lhblk: "▄",
		LJcy: "Љ",
		ljcy: "љ",
		Ll: "⋘",
		ll: "≪",
		llarr: "⇇",
		llcorner: "⌞",
		Lleftarrow: "⇚",
		llhard: "⥫",
		lltri: "◺",
		Lmidot: "Ŀ",
		lmidot: "ŀ",
		lmoust: "⎰",
		lmoustache: "⎰",
		lnap: "⪉",
		lnapprox: "⪉",
		lnE: "≨",
		lne: "⪇",
		lneq: "⪇",
		lneqq: "≨",
		lnsim: "⋦",
		loang: "⟬",
		loarr: "⇽",
		lobrk: "⟦",
		LongLeftArrow: "⟵",
		Longleftarrow: "⟸",
		longleftarrow: "⟵",
		LongLeftRightArrow: "⟷",
		Longleftrightarrow: "⟺",
		longleftrightarrow: "⟷",
		longmapsto: "⟼",
		LongRightArrow: "⟶",
		Longrightarrow: "⟹",
		longrightarrow: "⟶",
		looparrowleft: "↫",
		looparrowright: "↬",
		lopar: "⦅",
		Lopf: "𝕃",
		lopf: "𝕝",
		loplus: "⨭",
		lotimes: "⨴",
		lowast: "∗",
		lowbar: "_",
		LowerLeftArrow: "↙",
		LowerRightArrow: "↘",
		loz: "◊",
		lozenge: "◊",
		lozf: "⧫",
		lpar: "(",
		lparlt: "⦓",
		lrarr: "⇆",
		lrcorner: "⌟",
		lrhar: "⇋",
		lrhard: "⥭",
		lrm: "‎",
		lrtri: "⊿",
		lsaquo: "‹",
		Lscr: "ℒ",
		lscr: "𝓁",
		Lsh: "↰",
		lsh: "↰",
		lsim: "≲",
		lsime: "⪍",
		lsimg: "⪏",
		lsqb: "[",
		lsquo: "‘",
		lsquor: "‚",
		Lstrok: "Ł",
		lstrok: "ł",
		Lt: "≪",
		LT: "<",
		lt: "<",
		ltcc: "⪦",
		ltcir: "⩹",
		ltdot: "⋖",
		lthree: "⋋",
		ltimes: "⋉",
		ltlarr: "⥶",
		ltquest: "⩻",
		ltri: "◃",
		ltrie: "⊴",
		ltrif: "◂",
		ltrPar: "⦖",
		lurdshar: "⥊",
		luruhar: "⥦",
		lvertneqq: "≨︀",
		lvnE: "≨︀",
		macr: "¯",
		male: "♂",
		malt: "✠",
		maltese: "✠",
		Map: "⤅",
		map: "↦",
		mapsto: "↦",
		mapstodown: "↧",
		mapstoleft: "↤",
		mapstoup: "↥",
		marker: "▮",
		mcomma: "⨩",
		Mcy: "М",
		mcy: "м",
		mdash: "—",
		mDDot: "∺",
		measuredangle: "∡",
		MediumSpace: " ",
		Mellintrf: "ℳ",
		Mfr: "𝔐",
		mfr: "𝔪",
		mho: "℧",
		micro: "µ",
		mid: "∣",
		midast: "*",
		midcir: "⫰",
		middot: "·",
		minus: "−",
		minusb: "⊟",
		minusd: "∸",
		minusdu: "⨪",
		MinusPlus: "∓",
		mlcp: "⫛",
		mldr: "…",
		mnplus: "∓",
		models: "⊧",
		Mopf: "𝕄",
		mopf: "𝕞",
		mp: "∓",
		Mscr: "ℳ",
		mscr: "𝓂",
		mstpos: "∾",
		Mu: "Μ",
		mu: "μ",
		multimap: "⊸",
		mumap: "⊸",
		nabla: "∇",
		Nacute: "Ń",
		nacute: "ń",
		nang: "∠⃒",
		nap: "≉",
		napE: "⩰̸",
		napid: "≋̸",
		napos: "ŉ",
		napprox: "≉",
		natur: "♮",
		natural: "♮",
		naturals: "ℕ",
		nbsp: "\xA0",
		nbump: "≎̸",
		nbumpe: "≏̸",
		ncap: "⩃",
		Ncaron: "Ň",
		ncaron: "ň",
		Ncedil: "Ņ",
		ncedil: "ņ",
		ncong: "≇",
		ncongdot: "⩭̸",
		ncup: "⩂",
		Ncy: "Н",
		ncy: "н",
		ndash: "–",
		ne: "≠",
		nearhk: "⤤",
		neArr: "⇗",
		nearr: "↗",
		nearrow: "↗",
		nedot: "≐̸",
		NegativeMediumSpace: "​",
		NegativeThickSpace: "​",
		NegativeThinSpace: "​",
		NegativeVeryThinSpace: "​",
		nequiv: "≢",
		nesear: "⤨",
		nesim: "≂̸",
		NestedGreaterGreater: "≫",
		NestedLessLess: "≪",
		NewLine: "\n",
		nexist: "∄",
		nexists: "∄",
		Nfr: "𝔑",
		nfr: "𝔫",
		ngE: "≧̸",
		nge: "≱",
		ngeq: "≱",
		ngeqq: "≧̸",
		ngeqslant: "⩾̸",
		nges: "⩾̸",
		nGg: "⋙̸",
		ngsim: "≵",
		nGt: "≫⃒",
		ngt: "≯",
		ngtr: "≯",
		nGtv: "≫̸",
		nhArr: "⇎",
		nharr: "↮",
		nhpar: "⫲",
		ni: "∋",
		nis: "⋼",
		nisd: "⋺",
		niv: "∋",
		NJcy: "Њ",
		njcy: "њ",
		nlArr: "⇍",
		nlarr: "↚",
		nldr: "‥",
		nlE: "≦̸",
		nle: "≰",
		nLeftarrow: "⇍",
		nleftarrow: "↚",
		nLeftrightarrow: "⇎",
		nleftrightarrow: "↮",
		nleq: "≰",
		nleqq: "≦̸",
		nleqslant: "⩽̸",
		nles: "⩽̸",
		nless: "≮",
		nLl: "⋘̸",
		nlsim: "≴",
		nLt: "≪⃒",
		nlt: "≮",
		nltri: "⋪",
		nltrie: "⋬",
		nLtv: "≪̸",
		nmid: "∤",
		NoBreak: "⁠",
		NonBreakingSpace: "\xA0",
		Nopf: "ℕ",
		nopf: "𝕟",
		Not: "⫬",
		not: "¬",
		NotCongruent: "≢",
		NotCupCap: "≭",
		NotDoubleVerticalBar: "∦",
		NotElement: "∉",
		NotEqual: "≠",
		NotEqualTilde: "≂̸",
		NotExists: "∄",
		NotGreater: "≯",
		NotGreaterEqual: "≱",
		NotGreaterFullEqual: "≧̸",
		NotGreaterGreater: "≫̸",
		NotGreaterLess: "≹",
		NotGreaterSlantEqual: "⩾̸",
		NotGreaterTilde: "≵",
		NotHumpDownHump: "≎̸",
		NotHumpEqual: "≏̸",
		notin: "∉",
		notindot: "⋵̸",
		notinE: "⋹̸",
		notinva: "∉",
		notinvb: "⋷",
		notinvc: "⋶",
		NotLeftTriangle: "⋪",
		NotLeftTriangleBar: "⧏̸",
		NotLeftTriangleEqual: "⋬",
		NotLess: "≮",
		NotLessEqual: "≰",
		NotLessGreater: "≸",
		NotLessLess: "≪̸",
		NotLessSlantEqual: "⩽̸",
		NotLessTilde: "≴",
		NotNestedGreaterGreater: "⪢̸",
		NotNestedLessLess: "⪡̸",
		notni: "∌",
		notniva: "∌",
		notnivb: "⋾",
		notnivc: "⋽",
		NotPrecedes: "⊀",
		NotPrecedesEqual: "⪯̸",
		NotPrecedesSlantEqual: "⋠",
		NotReverseElement: "∌",
		NotRightTriangle: "⋫",
		NotRightTriangleBar: "⧐̸",
		NotRightTriangleEqual: "⋭",
		NotSquareSubset: "⊏̸",
		NotSquareSubsetEqual: "⋢",
		NotSquareSuperset: "⊐̸",
		NotSquareSupersetEqual: "⋣",
		NotSubset: "⊂⃒",
		NotSubsetEqual: "⊈",
		NotSucceeds: "⊁",
		NotSucceedsEqual: "⪰̸",
		NotSucceedsSlantEqual: "⋡",
		NotSucceedsTilde: "≿̸",
		NotSuperset: "⊃⃒",
		NotSupersetEqual: "⊉",
		NotTilde: "≁",
		NotTildeEqual: "≄",
		NotTildeFullEqual: "≇",
		NotTildeTilde: "≉",
		NotVerticalBar: "∤",
		npar: "∦",
		nparallel: "∦",
		nparsl: "⫽⃥",
		npart: "∂̸",
		npolint: "⨔",
		npr: "⊀",
		nprcue: "⋠",
		npre: "⪯̸",
		nprec: "⊀",
		npreceq: "⪯̸",
		nrArr: "⇏",
		nrarr: "↛",
		nrarrc: "⤳̸",
		nrarrw: "↝̸",
		nRightarrow: "⇏",
		nrightarrow: "↛",
		nrtri: "⋫",
		nrtrie: "⋭",
		nsc: "⊁",
		nsccue: "⋡",
		nsce: "⪰̸",
		Nscr: "𝒩",
		nscr: "𝓃",
		nshortmid: "∤",
		nshortparallel: "∦",
		nsim: "≁",
		nsime: "≄",
		nsimeq: "≄",
		nsmid: "∤",
		nspar: "∦",
		nsqsube: "⋢",
		nsqsupe: "⋣",
		nsub: "⊄",
		nsubE: "⫅̸",
		nsube: "⊈",
		nsubset: "⊂⃒",
		nsubseteq: "⊈",
		nsubseteqq: "⫅̸",
		nsucc: "⊁",
		nsucceq: "⪰̸",
		nsup: "⊅",
		nsupE: "⫆̸",
		nsupe: "⊉",
		nsupset: "⊃⃒",
		nsupseteq: "⊉",
		nsupseteqq: "⫆̸",
		ntgl: "≹",
		Ntilde: "Ñ",
		ntilde: "ñ",
		ntlg: "≸",
		ntriangleleft: "⋪",
		ntrianglelefteq: "⋬",
		ntriangleright: "⋫",
		ntrianglerighteq: "⋭",
		Nu: "Ν",
		nu: "ν",
		num: "#",
		numero: "№",
		numsp: " ",
		nvap: "≍⃒",
		nVDash: "⊯",
		nVdash: "⊮",
		nvDash: "⊭",
		nvdash: "⊬",
		nvge: "≥⃒",
		nvgt: ">⃒",
		nvHarr: "⤄",
		nvinfin: "⧞",
		nvlArr: "⤂",
		nvle: "≤⃒",
		nvlt: "<⃒",
		nvltrie: "⊴⃒",
		nvrArr: "⤃",
		nvrtrie: "⊵⃒",
		nvsim: "∼⃒",
		nwarhk: "⤣",
		nwArr: "⇖",
		nwarr: "↖",
		nwarrow: "↖",
		nwnear: "⤧",
		Oacute: "Ó",
		oacute: "ó",
		oast: "⊛",
		ocir: "⊚",
		Ocirc: "Ô",
		ocirc: "ô",
		Ocy: "О",
		ocy: "о",
		odash: "⊝",
		Odblac: "Ő",
		odblac: "ő",
		odiv: "⨸",
		odot: "⊙",
		odsold: "⦼",
		OElig: "Œ",
		oelig: "œ",
		ofcir: "⦿",
		Ofr: "𝔒",
		ofr: "𝔬",
		ogon: "˛",
		Ograve: "Ò",
		ograve: "ò",
		ogt: "⧁",
		ohbar: "⦵",
		ohm: "Ω",
		oint: "∮",
		olarr: "↺",
		olcir: "⦾",
		olcross: "⦻",
		oline: "‾",
		olt: "⧀",
		Omacr: "Ō",
		omacr: "ō",
		Omega: "Ω",
		omega: "ω",
		Omicron: "Ο",
		omicron: "ο",
		omid: "⦶",
		ominus: "⊖",
		Oopf: "𝕆",
		oopf: "𝕠",
		opar: "⦷",
		OpenCurlyDoubleQuote: "“",
		OpenCurlyQuote: "‘",
		operp: "⦹",
		oplus: "⊕",
		Or: "⩔",
		or: "∨",
		orarr: "↻",
		ord: "⩝",
		order: "ℴ",
		orderof: "ℴ",
		ordf: "ª",
		ordm: "º",
		origof: "⊶",
		oror: "⩖",
		orslope: "⩗",
		orv: "⩛",
		oS: "Ⓢ",
		Oscr: "𝒪",
		oscr: "ℴ",
		Oslash: "Ø",
		oslash: "ø",
		osol: "⊘",
		Otilde: "Õ",
		otilde: "õ",
		Otimes: "⨷",
		otimes: "⊗",
		otimesas: "⨶",
		Ouml: "Ö",
		ouml: "ö",
		ovbar: "⌽",
		OverBar: "‾",
		OverBrace: "⏞",
		OverBracket: "⎴",
		OverParenthesis: "⏜",
		par: "∥",
		para: "¶",
		parallel: "∥",
		parsim: "⫳",
		parsl: "⫽",
		part: "∂",
		PartialD: "∂",
		Pcy: "П",
		pcy: "п",
		percnt: "%",
		period: ".",
		permil: "‰",
		perp: "⊥",
		pertenk: "‱",
		Pfr: "𝔓",
		pfr: "𝔭",
		Phi: "Φ",
		phi: "φ",
		phiv: "ϕ",
		phmmat: "ℳ",
		phone: "☎",
		Pi: "Π",
		pi: "π",
		pitchfork: "⋔",
		piv: "ϖ",
		planck: "ℏ",
		planckh: "ℎ",
		plankv: "ℏ",
		plus: "+",
		plusacir: "⨣",
		plusb: "⊞",
		pluscir: "⨢",
		plusdo: "∔",
		plusdu: "⨥",
		pluse: "⩲",
		PlusMinus: "±",
		plusmn: "±",
		plussim: "⨦",
		plustwo: "⨧",
		pm: "±",
		Poincareplane: "ℌ",
		pointint: "⨕",
		Popf: "ℙ",
		popf: "𝕡",
		pound: "£",
		Pr: "⪻",
		pr: "≺",
		prap: "⪷",
		prcue: "≼",
		prE: "⪳",
		pre: "⪯",
		prec: "≺",
		precapprox: "⪷",
		preccurlyeq: "≼",
		Precedes: "≺",
		PrecedesEqual: "⪯",
		PrecedesSlantEqual: "≼",
		PrecedesTilde: "≾",
		preceq: "⪯",
		precnapprox: "⪹",
		precneqq: "⪵",
		precnsim: "⋨",
		precsim: "≾",
		Prime: "″",
		prime: "′",
		primes: "ℙ",
		prnap: "⪹",
		prnE: "⪵",
		prnsim: "⋨",
		prod: "∏",
		Product: "∏",
		profalar: "⌮",
		profline: "⌒",
		profsurf: "⌓",
		prop: "∝",
		Proportion: "∷",
		Proportional: "∝",
		propto: "∝",
		prsim: "≾",
		prurel: "⊰",
		Pscr: "𝒫",
		pscr: "𝓅",
		Psi: "Ψ",
		psi: "ψ",
		puncsp: " ",
		Qfr: "𝔔",
		qfr: "𝔮",
		qint: "⨌",
		Qopf: "ℚ",
		qopf: "𝕢",
		qprime: "⁗",
		Qscr: "𝒬",
		qscr: "𝓆",
		quaternions: "ℍ",
		quatint: "⨖",
		quest: "?",
		questeq: "≟",
		QUOT: "\"",
		quot: "\"",
		rAarr: "⇛",
		race: "∽̱",
		Racute: "Ŕ",
		racute: "ŕ",
		radic: "√",
		raemptyv: "⦳",
		Rang: "⟫",
		rang: "⟩",
		rangd: "⦒",
		range: "⦥",
		rangle: "⟩",
		raquo: "»",
		Rarr: "↠",
		rArr: "⇒",
		rarr: "→",
		rarrap: "⥵",
		rarrb: "⇥",
		rarrbfs: "⤠",
		rarrc: "⤳",
		rarrfs: "⤞",
		rarrhk: "↪",
		rarrlp: "↬",
		rarrpl: "⥅",
		rarrsim: "⥴",
		Rarrtl: "⤖",
		rarrtl: "↣",
		rarrw: "↝",
		rAtail: "⤜",
		ratail: "⤚",
		ratio: "∶",
		rationals: "ℚ",
		RBarr: "⤐",
		rBarr: "⤏",
		rbarr: "⤍",
		rbbrk: "❳",
		rbrace: "}",
		rbrack: "]",
		rbrke: "⦌",
		rbrksld: "⦎",
		rbrkslu: "⦐",
		Rcaron: "Ř",
		rcaron: "ř",
		Rcedil: "Ŗ",
		rcedil: "ŗ",
		rceil: "⌉",
		rcub: "}",
		Rcy: "Р",
		rcy: "р",
		rdca: "⤷",
		rdldhar: "⥩",
		rdquo: "”",
		rdquor: "”",
		rdsh: "↳",
		Re: "ℜ",
		real: "ℜ",
		realine: "ℛ",
		realpart: "ℜ",
		reals: "ℝ",
		rect: "▭",
		REG: "®",
		reg: "®",
		ReverseElement: "∋",
		ReverseEquilibrium: "⇋",
		ReverseUpEquilibrium: "⥯",
		rfisht: "⥽",
		rfloor: "⌋",
		Rfr: "ℜ",
		rfr: "𝔯",
		rHar: "⥤",
		rhard: "⇁",
		rharu: "⇀",
		rharul: "⥬",
		Rho: "Ρ",
		rho: "ρ",
		rhov: "ϱ",
		RightAngleBracket: "⟩",
		RightArrow: "→",
		Rightarrow: "⇒",
		rightarrow: "→",
		RightArrowBar: "⇥",
		RightArrowLeftArrow: "⇄",
		rightarrowtail: "↣",
		RightCeiling: "⌉",
		RightDoubleBracket: "⟧",
		RightDownTeeVector: "⥝",
		RightDownVector: "⇂",
		RightDownVectorBar: "⥕",
		RightFloor: "⌋",
		rightharpoondown: "⇁",
		rightharpoonup: "⇀",
		rightleftarrows: "⇄",
		rightleftharpoons: "⇌",
		rightrightarrows: "⇉",
		rightsquigarrow: "↝",
		RightTee: "⊢",
		RightTeeArrow: "↦",
		RightTeeVector: "⥛",
		rightthreetimes: "⋌",
		RightTriangle: "⊳",
		RightTriangleBar: "⧐",
		RightTriangleEqual: "⊵",
		RightUpDownVector: "⥏",
		RightUpTeeVector: "⥜",
		RightUpVector: "↾",
		RightUpVectorBar: "⥔",
		RightVector: "⇀",
		RightVectorBar: "⥓",
		ring: "˚",
		risingdotseq: "≓",
		rlarr: "⇄",
		rlhar: "⇌",
		rlm: "‏",
		rmoust: "⎱",
		rmoustache: "⎱",
		rnmid: "⫮",
		roang: "⟭",
		roarr: "⇾",
		robrk: "⟧",
		ropar: "⦆",
		Ropf: "ℝ",
		ropf: "𝕣",
		roplus: "⨮",
		rotimes: "⨵",
		RoundImplies: "⥰",
		rpar: ")",
		rpargt: "⦔",
		rppolint: "⨒",
		rrarr: "⇉",
		Rrightarrow: "⇛",
		rsaquo: "›",
		Rscr: "ℛ",
		rscr: "𝓇",
		Rsh: "↱",
		rsh: "↱",
		rsqb: "]",
		rsquo: "’",
		rsquor: "’",
		rthree: "⋌",
		rtimes: "⋊",
		rtri: "▹",
		rtrie: "⊵",
		rtrif: "▸",
		rtriltri: "⧎",
		RuleDelayed: "⧴",
		ruluhar: "⥨",
		rx: "℞",
		Sacute: "Ś",
		sacute: "ś",
		sbquo: "‚",
		Sc: "⪼",
		sc: "≻",
		scap: "⪸",
		Scaron: "Š",
		scaron: "š",
		sccue: "≽",
		scE: "⪴",
		sce: "⪰",
		Scedil: "Ş",
		scedil: "ş",
		Scirc: "Ŝ",
		scirc: "ŝ",
		scnap: "⪺",
		scnE: "⪶",
		scnsim: "⋩",
		scpolint: "⨓",
		scsim: "≿",
		Scy: "С",
		scy: "с",
		sdot: "⋅",
		sdotb: "⊡",
		sdote: "⩦",
		searhk: "⤥",
		seArr: "⇘",
		searr: "↘",
		searrow: "↘",
		sect: "§",
		semi: ";",
		seswar: "⤩",
		setminus: "∖",
		setmn: "∖",
		sext: "✶",
		Sfr: "𝔖",
		sfr: "𝔰",
		sfrown: "⌢",
		sharp: "♯",
		SHCHcy: "Щ",
		shchcy: "щ",
		SHcy: "Ш",
		shcy: "ш",
		ShortDownArrow: "↓",
		ShortLeftArrow: "←",
		shortmid: "∣",
		shortparallel: "∥",
		ShortRightArrow: "→",
		ShortUpArrow: "↑",
		shy: "­",
		Sigma: "Σ",
		sigma: "σ",
		sigmaf: "ς",
		sigmav: "ς",
		sim: "∼",
		simdot: "⩪",
		sime: "≃",
		simeq: "≃",
		simg: "⪞",
		simgE: "⪠",
		siml: "⪝",
		simlE: "⪟",
		simne: "≆",
		simplus: "⨤",
		simrarr: "⥲",
		slarr: "←",
		SmallCircle: "∘",
		smallsetminus: "∖",
		smashp: "⨳",
		smeparsl: "⧤",
		smid: "∣",
		smile: "⌣",
		smt: "⪪",
		smte: "⪬",
		smtes: "⪬︀",
		SOFTcy: "Ь",
		softcy: "ь",
		sol: "/",
		solb: "⧄",
		solbar: "⌿",
		Sopf: "𝕊",
		sopf: "𝕤",
		spades: "♠",
		spadesuit: "♠",
		spar: "∥",
		sqcap: "⊓",
		sqcaps: "⊓︀",
		sqcup: "⊔",
		sqcups: "⊔︀",
		Sqrt: "√",
		sqsub: "⊏",
		sqsube: "⊑",
		sqsubset: "⊏",
		sqsubseteq: "⊑",
		sqsup: "⊐",
		sqsupe: "⊒",
		sqsupset: "⊐",
		sqsupseteq: "⊒",
		squ: "□",
		Square: "□",
		square: "□",
		SquareIntersection: "⊓",
		SquareSubset: "⊏",
		SquareSubsetEqual: "⊑",
		SquareSuperset: "⊐",
		SquareSupersetEqual: "⊒",
		SquareUnion: "⊔",
		squarf: "▪",
		squf: "▪",
		srarr: "→",
		Sscr: "𝒮",
		sscr: "𝓈",
		ssetmn: "∖",
		ssmile: "⌣",
		sstarf: "⋆",
		Star: "⋆",
		star: "☆",
		starf: "★",
		straightepsilon: "ϵ",
		straightphi: "ϕ",
		strns: "¯",
		Sub: "⋐",
		sub: "⊂",
		subdot: "⪽",
		subE: "⫅",
		sube: "⊆",
		subedot: "⫃",
		submult: "⫁",
		subnE: "⫋",
		subne: "⊊",
		subplus: "⪿",
		subrarr: "⥹",
		Subset: "⋐",
		subset: "⊂",
		subseteq: "⊆",
		subseteqq: "⫅",
		SubsetEqual: "⊆",
		subsetneq: "⊊",
		subsetneqq: "⫋",
		subsim: "⫇",
		subsub: "⫕",
		subsup: "⫓",
		succ: "≻",
		succapprox: "⪸",
		succcurlyeq: "≽",
		Succeeds: "≻",
		SucceedsEqual: "⪰",
		SucceedsSlantEqual: "≽",
		SucceedsTilde: "≿",
		succeq: "⪰",
		succnapprox: "⪺",
		succneqq: "⪶",
		succnsim: "⋩",
		succsim: "≿",
		SuchThat: "∋",
		Sum: "∑",
		sum: "∑",
		sung: "♪",
		Sup: "⋑",
		sup: "⊃",
		sup1: "¹",
		sup2: "²",
		sup3: "³",
		supdot: "⪾",
		supdsub: "⫘",
		supE: "⫆",
		supe: "⊇",
		supedot: "⫄",
		Superset: "⊃",
		SupersetEqual: "⊇",
		suphsol: "⟉",
		suphsub: "⫗",
		suplarr: "⥻",
		supmult: "⫂",
		supnE: "⫌",
		supne: "⊋",
		supplus: "⫀",
		Supset: "⋑",
		supset: "⊃",
		supseteq: "⊇",
		supseteqq: "⫆",
		supsetneq: "⊋",
		supsetneqq: "⫌",
		supsim: "⫈",
		supsub: "⫔",
		supsup: "⫖",
		swarhk: "⤦",
		swArr: "⇙",
		swarr: "↙",
		swarrow: "↙",
		swnwar: "⤪",
		szlig: "ß",
		Tab: "	",
		target: "⌖",
		Tau: "Τ",
		tau: "τ",
		tbrk: "⎴",
		Tcaron: "Ť",
		tcaron: "ť",
		Tcedil: "Ţ",
		tcedil: "ţ",
		Tcy: "Т",
		tcy: "т",
		tdot: "⃛",
		telrec: "⌕",
		Tfr: "𝔗",
		tfr: "𝔱",
		there4: "∴",
		Therefore: "∴",
		therefore: "∴",
		Theta: "Θ",
		theta: "θ",
		thetasym: "ϑ",
		thetav: "ϑ",
		thickapprox: "≈",
		thicksim: "∼",
		ThickSpace: "  ",
		thinsp: " ",
		ThinSpace: " ",
		thkap: "≈",
		thksim: "∼",
		THORN: "Þ",
		thorn: "þ",
		Tilde: "∼",
		tilde: "˜",
		TildeEqual: "≃",
		TildeFullEqual: "≅",
		TildeTilde: "≈",
		times: "×",
		timesb: "⊠",
		timesbar: "⨱",
		timesd: "⨰",
		tint: "∭",
		toea: "⤨",
		top: "⊤",
		topbot: "⌶",
		topcir: "⫱",
		Topf: "𝕋",
		topf: "𝕥",
		topfork: "⫚",
		tosa: "⤩",
		tprime: "‴",
		TRADE: "™",
		trade: "™",
		triangle: "▵",
		triangledown: "▿",
		triangleleft: "◃",
		trianglelefteq: "⊴",
		triangleq: "≜",
		triangleright: "▹",
		trianglerighteq: "⊵",
		tridot: "◬",
		trie: "≜",
		triminus: "⨺",
		TripleDot: "⃛",
		triplus: "⨹",
		trisb: "⧍",
		tritime: "⨻",
		trpezium: "⏢",
		Tscr: "𝒯",
		tscr: "𝓉",
		TScy: "Ц",
		tscy: "ц",
		TSHcy: "Ћ",
		tshcy: "ћ",
		Tstrok: "Ŧ",
		tstrok: "ŧ",
		twixt: "≬",
		twoheadleftarrow: "↞",
		twoheadrightarrow: "↠",
		Uacute: "Ú",
		uacute: "ú",
		Uarr: "↟",
		uArr: "⇑",
		uarr: "↑",
		Uarrocir: "⥉",
		Ubrcy: "Ў",
		ubrcy: "ў",
		Ubreve: "Ŭ",
		ubreve: "ŭ",
		Ucirc: "Û",
		ucirc: "û",
		Ucy: "У",
		ucy: "у",
		udarr: "⇅",
		Udblac: "Ű",
		udblac: "ű",
		udhar: "⥮",
		ufisht: "⥾",
		Ufr: "𝔘",
		ufr: "𝔲",
		Ugrave: "Ù",
		ugrave: "ù",
		uHar: "⥣",
		uharl: "↿",
		uharr: "↾",
		uhblk: "▀",
		ulcorn: "⌜",
		ulcorner: "⌜",
		ulcrop: "⌏",
		ultri: "◸",
		Umacr: "Ū",
		umacr: "ū",
		uml: "¨",
		UnderBar: "_",
		UnderBrace: "⏟",
		UnderBracket: "⎵",
		UnderParenthesis: "⏝",
		Union: "⋃",
		UnionPlus: "⊎",
		Uogon: "Ų",
		uogon: "ų",
		Uopf: "𝕌",
		uopf: "𝕦",
		UpArrow: "↑",
		Uparrow: "⇑",
		uparrow: "↑",
		UpArrowBar: "⤒",
		UpArrowDownArrow: "⇅",
		UpDownArrow: "↕",
		Updownarrow: "⇕",
		updownarrow: "↕",
		UpEquilibrium: "⥮",
		upharpoonleft: "↿",
		upharpoonright: "↾",
		uplus: "⊎",
		UpperLeftArrow: "↖",
		UpperRightArrow: "↗",
		Upsi: "ϒ",
		upsi: "υ",
		upsih: "ϒ",
		Upsilon: "Υ",
		upsilon: "υ",
		UpTee: "⊥",
		UpTeeArrow: "↥",
		upuparrows: "⇈",
		urcorn: "⌝",
		urcorner: "⌝",
		urcrop: "⌎",
		Uring: "Ů",
		uring: "ů",
		urtri: "◹",
		Uscr: "𝒰",
		uscr: "𝓊",
		utdot: "⋰",
		Utilde: "Ũ",
		utilde: "ũ",
		utri: "▵",
		utrif: "▴",
		uuarr: "⇈",
		Uuml: "Ü",
		uuml: "ü",
		uwangle: "⦧",
		vangrt: "⦜",
		varepsilon: "ϵ",
		varkappa: "ϰ",
		varnothing: "∅",
		varphi: "ϕ",
		varpi: "ϖ",
		varpropto: "∝",
		vArr: "⇕",
		varr: "↕",
		varrho: "ϱ",
		varsigma: "ς",
		varsubsetneq: "⊊︀",
		varsubsetneqq: "⫋︀",
		varsupsetneq: "⊋︀",
		varsupsetneqq: "⫌︀",
		vartheta: "ϑ",
		vartriangleleft: "⊲",
		vartriangleright: "⊳",
		Vbar: "⫫",
		vBar: "⫨",
		vBarv: "⫩",
		Vcy: "В",
		vcy: "в",
		VDash: "⊫",
		Vdash: "⊩",
		vDash: "⊨",
		vdash: "⊢",
		Vdashl: "⫦",
		Vee: "⋁",
		vee: "∨",
		veebar: "⊻",
		veeeq: "≚",
		vellip: "⋮",
		Verbar: "‖",
		verbar: "|",
		Vert: "‖",
		vert: "|",
		VerticalBar: "∣",
		VerticalLine: "|",
		VerticalSeparator: "❘",
		VerticalTilde: "≀",
		VeryThinSpace: " ",
		Vfr: "𝔙",
		vfr: "𝔳",
		vltri: "⊲",
		vnsub: "⊂⃒",
		vnsup: "⊃⃒",
		Vopf: "𝕍",
		vopf: "𝕧",
		vprop: "∝",
		vrtri: "⊳",
		Vscr: "𝒱",
		vscr: "𝓋",
		vsubnE: "⫋︀",
		vsubne: "⊊︀",
		vsupnE: "⫌︀",
		vsupne: "⊋︀",
		Vvdash: "⊪",
		vzigzag: "⦚",
		Wcirc: "Ŵ",
		wcirc: "ŵ",
		wedbar: "⩟",
		Wedge: "⋀",
		wedge: "∧",
		wedgeq: "≙",
		weierp: "℘",
		Wfr: "𝔚",
		wfr: "𝔴",
		Wopf: "𝕎",
		wopf: "𝕨",
		wp: "℘",
		wr: "≀",
		wreath: "≀",
		Wscr: "𝒲",
		wscr: "𝓌",
		xcap: "⋂",
		xcirc: "◯",
		xcup: "⋃",
		xdtri: "▽",
		Xfr: "𝔛",
		xfr: "𝔵",
		xhArr: "⟺",
		xharr: "⟷",
		Xi: "Ξ",
		xi: "ξ",
		xlArr: "⟸",
		xlarr: "⟵",
		xmap: "⟼",
		xnis: "⋻",
		xodot: "⨀",
		Xopf: "𝕏",
		xopf: "𝕩",
		xoplus: "⨁",
		xotime: "⨂",
		xrArr: "⟹",
		xrarr: "⟶",
		Xscr: "𝒳",
		xscr: "𝓍",
		xsqcup: "⨆",
		xuplus: "⨄",
		xutri: "△",
		xvee: "⋁",
		xwedge: "⋀",
		Yacute: "Ý",
		yacute: "ý",
		YAcy: "Я",
		yacy: "я",
		Ycirc: "Ŷ",
		ycirc: "ŷ",
		Ycy: "Ы",
		ycy: "ы",
		yen: "¥",
		Yfr: "𝔜",
		yfr: "𝔶",
		YIcy: "Ї",
		yicy: "ї",
		Yopf: "𝕐",
		yopf: "𝕪",
		Yscr: "𝒴",
		yscr: "𝓎",
		YUcy: "Ю",
		yucy: "ю",
		Yuml: "Ÿ",
		yuml: "ÿ",
		Zacute: "Ź",
		zacute: "ź",
		Zcaron: "Ž",
		zcaron: "ž",
		Zcy: "З",
		zcy: "з",
		Zdot: "Ż",
		zdot: "ż",
		zeetrf: "ℨ",
		ZeroWidthSpace: "​",
		Zeta: "Ζ",
		zeta: "ζ",
		Zfr: "ℨ",
		zfr: "𝔷",
		ZHcy: "Ж",
		zhcy: "ж",
		zigrarr: "⇝",
		Zopf: "ℤ",
		zopf: "𝕫",
		Zscr: "𝒵",
		zscr: "𝓏",
		zwj: "‍",
		zwnj: "‌"
	});
	/**
	* @deprecated use `HTML_ENTITIES` instead
	* @see HTML_ENTITIES
	*/
	exports.entityMap = exports.HTML_ENTITIES;
}));
//#endregion
//#region node_modules/@xmldom/xmldom/lib/sax.js
var require_sax = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var NAMESPACE = require_conventions().NAMESPACE;
	var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
	var nameChar = new RegExp("[\\-\\.0-9" + nameStartChar.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
	var tagNamePattern = new RegExp("^" + nameStartChar.source + nameChar.source + "*(?::" + nameStartChar.source + nameChar.source + "*)?$");
	var S_TAG = 0;
	var S_ATTR = 1;
	var S_ATTR_SPACE = 2;
	var S_EQ = 3;
	var S_ATTR_NOQUOT_VALUE = 4;
	var S_ATTR_END = 5;
	var S_TAG_SPACE = 6;
	var S_TAG_CLOSE = 7;
	/**
	* Creates an error that will not be caught by XMLReader aka the SAX parser.
	*
	* @param {string} message
	* @param {any?} locator Optional, can provide details about the location in the source
	* @constructor
	*/
	function ParseError(message, locator) {
		this.message = message;
		this.locator = locator;
		if (Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
	}
	ParseError.prototype = /* @__PURE__ */ new Error();
	ParseError.prototype.name = ParseError.name;
	function XMLReader() {}
	XMLReader.prototype = { parse: function(source, defaultNSMap, entityMap) {
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap, defaultNSMap = {});
		parse(source, defaultNSMap, entityMap, domBuilder, this.errorHandler);
		domBuilder.endDocument();
	} };
	function parse(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
		function fixedFromCharCode(code) {
			if (code > 65535) {
				code -= 65536;
				var surrogate1 = 55296 + (code >> 10), surrogate2 = 56320 + (code & 1023);
				return String.fromCharCode(surrogate1, surrogate2);
			} else return String.fromCharCode(code);
		}
		function entityReplacer(a) {
			var k = a.slice(1, -1);
			if (Object.hasOwnProperty.call(entityMap, k)) return entityMap[k];
			else if (k.charAt(0) === "#") return fixedFromCharCode(parseInt(k.substr(1).replace("x", "0x")));
			else {
				errorHandler.error("entity not found:" + a);
				return a;
			}
		}
		function appendText(end) {
			if (end > start) {
				var xt = source.substring(start, end).replace(/&#?\w+;/g, entityReplacer);
				locator && position(start);
				domBuilder.characters(xt, 0, end - start);
				start = end;
			}
		}
		function position(p, m) {
			while (p >= lineEnd && (m = linePattern.exec(source))) {
				lineStart = m.index;
				lineEnd = lineStart + m[0].length;
				locator.lineNumber++;
			}
			locator.columnNumber = p - lineStart + 1;
		}
		var lineStart = 0;
		var lineEnd = 0;
		var linePattern = /.*(?:\r\n?|\n)|.*$/g;
		var locator = domBuilder.locator;
		var parseStack = [{ currentNSMap: defaultNSMapCopy }];
		var closeMap = {};
		var start = 0;
		while (true) {
			try {
				var tagStart = source.indexOf("<", start);
				if (tagStart < 0) {
					if (!source.substr(start).match(/^\s*$/)) {
						var doc = domBuilder.doc;
						var text = doc.createTextNode(source.substr(start));
						doc.appendChild(text);
						domBuilder.currentElement = text;
					}
					return;
				}
				if (tagStart > start) appendText(tagStart);
				switch (source.charAt(tagStart + 1)) {
					case "/":
						var end = source.indexOf(">", tagStart + 3);
						var tagName = source.substring(tagStart + 2, end).replace(/[ \t\n\r]+$/g, "");
						var config = parseStack.pop();
						if (end < 0) {
							tagName = source.substring(tagStart + 2).replace(/[\s<].*/, "");
							errorHandler.error("end tag name: " + tagName + " is not complete:" + config.tagName);
							end = tagStart + 1 + tagName.length;
						} else if (tagName.match(/\s</)) {
							tagName = tagName.replace(/[\s<].*/, "");
							errorHandler.error("end tag name: " + tagName + " maybe not complete");
							end = tagStart + 1 + tagName.length;
						}
						var localNSMap = config.localNSMap;
						var endMatch = config.tagName == tagName;
						if (endMatch || config.tagName && config.tagName.toLowerCase() == tagName.toLowerCase()) {
							domBuilder.endElement(config.uri, config.localName, tagName);
							if (localNSMap) {
								for (var prefix in localNSMap) if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) domBuilder.endPrefixMapping(prefix);
							}
							if (!endMatch) errorHandler.fatalError("end tag name: " + tagName + " is not match the current start tagName:" + config.tagName);
						} else parseStack.push(config);
						end++;
						break;
					case "?":
						locator && position(tagStart);
						end = parseInstruction(source, tagStart, domBuilder);
						break;
					case "!":
						locator && position(tagStart);
						end = parseDCC(source, tagStart, domBuilder, errorHandler);
						break;
					default:
						locator && position(tagStart);
						var el = new ElementAttributes();
						var currentNSMap = parseStack[parseStack.length - 1].currentNSMap;
						var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler);
						var len = el.length;
						if (!el.closed && fixSelfClosed(source, end, el.tagName, closeMap)) {
							el.closed = true;
							if (!entityMap.nbsp) errorHandler.warning("unclosed xml attribute");
						}
						if (locator && len) {
							var locator2 = copyLocator(locator, {});
							for (var i = 0; i < len; i++) {
								var a = el[i];
								position(a.offset);
								a.locator = copyLocator(locator, {});
							}
							domBuilder.locator = locator2;
							if (appendElement(el, domBuilder, currentNSMap)) parseStack.push(el);
							domBuilder.locator = locator;
						} else if (appendElement(el, domBuilder, currentNSMap)) parseStack.push(el);
						if (NAMESPACE.isHTML(el.uri) && !el.closed) end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder);
						else end++;
				}
			} catch (e) {
				if (e instanceof ParseError) throw e;
				errorHandler.error("element parse error: " + e);
				end = -1;
			}
			if (end > start) start = end;
			else appendText(Math.max(tagStart, start) + 1);
		}
	}
	function copyLocator(f, t) {
		t.lineNumber = f.lineNumber;
		t.columnNumber = f.columnNumber;
		return t;
	}
	/**
	* @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
	* @return end of the elementStartPart(end of elementEndPart for selfClosed el)
	*/
	function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler) {
		/**
		* @param {string} qname
		* @param {string} value
		* @param {number} startIndex
		*/
		function addAttribute(qname, value, startIndex) {
			if (el.attributeNames.hasOwnProperty(qname)) errorHandler.fatalError("Attribute " + qname + " redefined");
			el.addValue(qname, value.replace(/[\t\n\r]/g, " ").replace(/&#?\w+;/g, entityReplacer), startIndex);
		}
		var attrName;
		var value;
		var p = ++start;
		var s = S_TAG;
		while (true) {
			var c = source.charAt(p);
			switch (c) {
				case "=":
					if (s === S_ATTR) {
						attrName = source.slice(start, p);
						s = S_EQ;
					} else if (s === S_ATTR_SPACE) s = S_EQ;
					else throw new Error("attribute equal must after attrName");
					break;
				case "'":
				case "\"":
					if (s === S_EQ || s === S_ATTR) {
						if (s === S_ATTR) {
							errorHandler.warning("attribute value must after \"=\"");
							attrName = source.slice(start, p);
						}
						start = p + 1;
						p = source.indexOf(c, start);
						if (p > 0) {
							value = source.slice(start, p);
							addAttribute(attrName, value, start - 1);
							s = S_ATTR_END;
						} else throw new Error("attribute value no end '" + c + "' match");
					} else if (s == S_ATTR_NOQUOT_VALUE) {
						value = source.slice(start, p);
						addAttribute(attrName, value, start);
						errorHandler.warning("attribute \"" + attrName + "\" missed start quot(" + c + ")!!");
						start = p + 1;
						s = S_ATTR_END;
					} else throw new Error("attribute value must after \"=\"");
					break;
				case "/":
					switch (s) {
						case S_TAG: el.setTagName(source.slice(start, p));
						case S_ATTR_END:
						case S_TAG_SPACE:
						case S_TAG_CLOSE:
							s = S_TAG_CLOSE;
							el.closed = true;
						case S_ATTR_NOQUOT_VALUE:
						case S_ATTR: break;
						case S_ATTR_SPACE:
							el.closed = true;
							break;
						default: throw new Error("attribute invalid close char('/')");
					}
					break;
				case "":
					errorHandler.error("unexpected end of input");
					if (s == S_TAG) el.setTagName(source.slice(start, p));
					return p;
				case ">":
					switch (s) {
						case S_TAG: el.setTagName(source.slice(start, p));
						case S_ATTR_END:
						case S_TAG_SPACE:
						case S_TAG_CLOSE: break;
						case S_ATTR_NOQUOT_VALUE:
						case S_ATTR:
							value = source.slice(start, p);
							if (value.slice(-1) === "/") {
								el.closed = true;
								value = value.slice(0, -1);
							}
						case S_ATTR_SPACE:
							if (s === S_ATTR_SPACE) value = attrName;
							if (s == S_ATTR_NOQUOT_VALUE) {
								errorHandler.warning("attribute \"" + value + "\" missed quot(\")!");
								addAttribute(attrName, value, start);
							} else {
								if (!NAMESPACE.isHTML(currentNSMap[""]) || !value.match(/^(?:disabled|checked|selected)$/i)) errorHandler.warning("attribute \"" + value + "\" missed value!! \"" + value + "\" instead!!");
								addAttribute(value, value, start);
							}
							break;
						case S_EQ: throw new Error("attribute value missed!!");
					}
					return p;
				case "": c = " ";
				default: if (c <= " ") switch (s) {
					case S_TAG:
						el.setTagName(source.slice(start, p));
						s = S_TAG_SPACE;
						break;
					case S_ATTR:
						attrName = source.slice(start, p);
						s = S_ATTR_SPACE;
						break;
					case S_ATTR_NOQUOT_VALUE:
						var value = source.slice(start, p);
						errorHandler.warning("attribute \"" + value + "\" missed quot(\")!!");
						addAttribute(attrName, value, start);
					case S_ATTR_END:
						s = S_TAG_SPACE;
						break;
				}
				else switch (s) {
					case S_ATTR_SPACE:
						el.tagName;
						if (!NAMESPACE.isHTML(currentNSMap[""]) || !attrName.match(/^(?:disabled|checked|selected)$/i)) errorHandler.warning("attribute \"" + attrName + "\" missed value!! \"" + attrName + "\" instead2!!");
						addAttribute(attrName, attrName, start);
						start = p;
						s = S_ATTR;
						break;
					case S_ATTR_END: errorHandler.warning("attribute space is required\"" + attrName + "\"!!");
					case S_TAG_SPACE:
						s = S_ATTR;
						start = p;
						break;
					case S_EQ:
						s = S_ATTR_NOQUOT_VALUE;
						start = p;
						break;
					case S_TAG_CLOSE: throw new Error("elements closed character '/' and '>' must be connected to");
				}
			}
			p++;
		}
	}
	/**
	* @return true if has new namespace define
	*/
	function appendElement(el, domBuilder, currentNSMap) {
		var tagName = el.tagName;
		var localNSMap = null;
		var i = el.length;
		while (i--) {
			var a = el[i];
			var qName = a.qName;
			var value = a.value;
			var nsp = qName.indexOf(":");
			if (nsp > 0) {
				var prefix = a.prefix = qName.slice(0, nsp);
				var localName = qName.slice(nsp + 1);
				var nsPrefix = prefix === "xmlns" && localName;
			} else {
				localName = qName;
				prefix = null;
				nsPrefix = qName === "xmlns" && "";
			}
			a.localName = localName;
			if (nsPrefix !== false) {
				if (localNSMap == null) {
					localNSMap = {};
					_copy(currentNSMap, currentNSMap = {});
				}
				currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
				a.uri = NAMESPACE.XMLNS;
				domBuilder.startPrefixMapping(nsPrefix, value);
			}
		}
		var i = el.length;
		while (i--) {
			a = el[i];
			var prefix = a.prefix;
			if (prefix) {
				if (prefix === "xml") a.uri = NAMESPACE.XML;
				if (prefix !== "xmlns") a.uri = currentNSMap[prefix || ""];
			}
		}
		var nsp = tagName.indexOf(":");
		if (nsp > 0) {
			prefix = el.prefix = tagName.slice(0, nsp);
			localName = el.localName = tagName.slice(nsp + 1);
		} else {
			prefix = null;
			localName = el.localName = tagName;
		}
		var ns = el.uri = currentNSMap[prefix || ""];
		domBuilder.startElement(ns, localName, tagName, el);
		if (el.closed) {
			domBuilder.endElement(ns, localName, tagName);
			if (localNSMap) {
				for (prefix in localNSMap) if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) domBuilder.endPrefixMapping(prefix);
			}
		} else {
			el.currentNSMap = currentNSMap;
			el.localNSMap = localNSMap;
			return true;
		}
	}
	function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
		if (/^(?:script|textarea)$/i.test(tagName)) {
			var elEndStart = source.indexOf("</" + tagName + ">", elStartEnd);
			var text = source.substring(elStartEnd + 1, elEndStart);
			if (/[&<]/.test(text)) {
				if (/^script$/i.test(tagName)) {
					domBuilder.characters(text, 0, text.length);
					return elEndStart;
				}
				text = text.replace(/&#?\w+;/g, entityReplacer);
				domBuilder.characters(text, 0, text.length);
				return elEndStart;
			}
		}
		return elStartEnd + 1;
	}
	function fixSelfClosed(source, elStartEnd, tagName, closeMap) {
		var pos = closeMap[tagName];
		if (pos == null) {
			pos = source.lastIndexOf("</" + tagName + ">");
			if (pos < elStartEnd) pos = source.lastIndexOf("</" + tagName);
			closeMap[tagName] = pos;
		}
		return pos < elStartEnd;
	}
	function _copy(source, target) {
		for (var n in source) if (Object.prototype.hasOwnProperty.call(source, n)) target[n] = source[n];
	}
	function parseDCC(source, start, domBuilder, errorHandler) {
		switch (source.charAt(start + 2)) {
			case "-": if (source.charAt(start + 3) === "-") {
				var end = source.indexOf("-->", start + 4);
				if (end > start) {
					domBuilder.comment(source, start + 4, end - start - 4);
					return end + 3;
				} else {
					errorHandler.error("Unclosed comment");
					return -1;
				}
			} else return -1;
			default:
				if (source.substr(start + 3, 6) == "CDATA[") {
					var end = source.indexOf("]]>", start + 9);
					domBuilder.startCDATA();
					domBuilder.characters(source, start + 9, end - start - 9);
					domBuilder.endCDATA();
					return end + 3;
				}
				var matchs = split(source, start);
				var len = matchs.length;
				if (len > 1 && /!doctype/i.test(matchs[0][0])) {
					var name = matchs[1][0];
					var pubid = false;
					var sysid = false;
					if (len > 3) {
						if (/^public$/i.test(matchs[2][0])) {
							pubid = matchs[3][0];
							sysid = len > 4 && matchs[4][0];
						} else if (/^system$/i.test(matchs[2][0])) sysid = matchs[3][0];
					}
					var lastMatch = matchs[len - 1];
					domBuilder.startDTD(name, pubid, sysid);
					domBuilder.endDTD();
					return lastMatch.index + lastMatch[0].length;
				}
		}
		return -1;
	}
	function parseInstruction(source, start, domBuilder) {
		var end = source.indexOf("?>", start);
		if (end) {
			var match = source.substring(start, end).match(/^<\?(\S*)\s*([\s\S]*?)$/);
			if (match) {
				match[0].length;
				domBuilder.processingInstruction(match[1], match[2]);
				return end + 2;
			} else return -1;
		}
		return -1;
	}
	function ElementAttributes() {
		this.attributeNames = {};
	}
	ElementAttributes.prototype = {
		setTagName: function(tagName) {
			if (!tagNamePattern.test(tagName)) throw new Error("invalid tagName:" + tagName);
			this.tagName = tagName;
		},
		addValue: function(qName, value, offset) {
			if (!tagNamePattern.test(qName)) throw new Error("invalid attribute:" + qName);
			this.attributeNames[qName] = this.length;
			this[this.length++] = {
				qName,
				value,
				offset
			};
		},
		length: 0,
		getLocalName: function(i) {
			return this[i].localName;
		},
		getLocator: function(i) {
			return this[i].locator;
		},
		getQName: function(i) {
			return this[i].qName;
		},
		getURI: function(i) {
			return this[i].uri;
		},
		getValue: function(i) {
			return this[i].value;
		}
	};
	function split(source, start) {
		var match;
		var buf = [];
		var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
		reg.lastIndex = start;
		reg.exec(source);
		while (match = reg.exec(source)) {
			buf.push(match);
			if (match[1]) return buf;
		}
	}
	exports.XMLReader = XMLReader;
	exports.ParseError = ParseError;
}));
//#endregion
//#region node_modules/@xmldom/xmldom/lib/dom-parser.js
var require_dom_parser = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var conventions = require_conventions();
	var dom = require_dom();
	var entities = require_entities();
	var sax = require_sax();
	var DOMImplementation = dom.DOMImplementation;
	var NAMESPACE = conventions.NAMESPACE;
	var ParseError = sax.ParseError;
	var XMLReader = sax.XMLReader;
	/**
	* Normalizes line ending according to https://www.w3.org/TR/xml11/#sec-line-ends:
	*
	* > XML parsed entities are often stored in computer files which,
	* > for editing convenience, are organized into lines.
	* > These lines are typically separated by some combination
	* > of the characters CARRIAGE RETURN (#xD) and LINE FEED (#xA).
	* >
	* > To simplify the tasks of applications, the XML processor must behave
	* > as if it normalized all line breaks in external parsed entities (including the document entity)
	* > on input, before parsing, by translating all of the following to a single #xA character:
	* >
	* > 1. the two-character sequence #xD #xA
	* > 2. the two-character sequence #xD #x85
	* > 3. the single character #x85
	* > 4. the single character #x2028
	* > 5. any #xD character that is not immediately followed by #xA or #x85.
	*
	* @param {string} input
	* @returns {string}
	*/
	function normalizeLineEndings(input) {
		return input.replace(/\r[\n\u0085]/g, "\n").replace(/[\r\u0085\u2028]/g, "\n");
	}
	/**
	* @typedef Locator
	* @property {number} [columnNumber]
	* @property {number} [lineNumber]
	*/
	/**
	* @typedef DOMParserOptions
	* @property {DOMHandler} [domBuilder]
	* @property {Function} [errorHandler]
	* @property {(string) => string} [normalizeLineEndings] used to replace line endings before parsing
	* 						defaults to `normalizeLineEndings`
	* @property {Locator} [locator]
	* @property {Record<string, string>} [xmlns]
	*
	* @see normalizeLineEndings
	*/
	/**
	* The DOMParser interface provides the ability to parse XML or HTML source code
	* from a string into a DOM `Document`.
	*
	* _xmldom is different from the spec in that it allows an `options` parameter,
	* to override the default behavior._
	*
	* @param {DOMParserOptions} [options]
	* @constructor
	*
	* @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
	* @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-parsing-and-serialization
	*/
	function DOMParser(options) {
		this.options = options || { locator: {} };
	}
	DOMParser.prototype.parseFromString = function(source, mimeType) {
		var options = this.options;
		var sax = new XMLReader();
		var domBuilder = options.domBuilder || new DOMHandler();
		var errorHandler = options.errorHandler;
		var locator = options.locator;
		var defaultNSMap = options.xmlns || {};
		var isHTML = /\/x?html?$/.test(mimeType);
		var entityMap = isHTML ? entities.HTML_ENTITIES : entities.XML_ENTITIES;
		if (locator) domBuilder.setDocumentLocator(locator);
		sax.errorHandler = buildErrorHandler(errorHandler, domBuilder, locator);
		sax.domBuilder = options.domBuilder || domBuilder;
		if (isHTML) defaultNSMap[""] = NAMESPACE.HTML;
		defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
		var normalize = options.normalizeLineEndings || normalizeLineEndings;
		if (source && typeof source === "string") sax.parse(normalize(source), defaultNSMap, entityMap);
		else sax.errorHandler.error("invalid doc source");
		return domBuilder.doc;
	};
	function buildErrorHandler(errorImpl, domBuilder, locator) {
		if (!errorImpl) {
			if (domBuilder instanceof DOMHandler) return domBuilder;
			errorImpl = domBuilder;
		}
		var errorHandler = {};
		var isCallback = errorImpl instanceof Function;
		locator = locator || {};
		function build(key) {
			var fn = errorImpl[key];
			if (!fn && isCallback) fn = errorImpl.length == 2 ? function(msg) {
				errorImpl(key, msg);
			} : errorImpl;
			errorHandler[key] = fn && function(msg) {
				fn("[xmldom " + key + "]	" + msg + _locator(locator));
			} || function() {};
		}
		build("warning");
		build("error");
		build("fatalError");
		return errorHandler;
	}
	/**
	* +ContentHandler+ErrorHandler
	* +LexicalHandler+EntityResolver2
	* -DeclHandler-DTDHandler
	*
	* DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
	* DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
	* @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
	*/
	function DOMHandler() {
		this.cdata = false;
	}
	function position(locator, node) {
		node.lineNumber = locator.lineNumber;
		node.columnNumber = locator.columnNumber;
	}
	/**
	* @see org.xml.sax.ContentHandler#startDocument
	* @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
	*/
	DOMHandler.prototype = {
		startDocument: function() {
			this.doc = new DOMImplementation().createDocument(null, null, null);
			if (this.locator) this.doc.documentURI = this.locator.systemId;
		},
		startElement: function(namespaceURI, localName, qName, attrs) {
			var doc = this.doc;
			var el = doc.createElementNS(namespaceURI, qName || localName);
			var len = attrs.length;
			appendElement(this, el);
			this.currentElement = el;
			this.locator && position(this.locator, el);
			for (var i = 0; i < len; i++) {
				var namespaceURI = attrs.getURI(i);
				var value = attrs.getValue(i);
				var qName = attrs.getQName(i);
				var attr = doc.createAttributeNS(namespaceURI, qName);
				this.locator && position(attrs.getLocator(i), attr);
				attr.value = attr.nodeValue = value;
				el.setAttributeNode(attr);
			}
		},
		endElement: function(namespaceURI, localName, qName) {
			var current = this.currentElement;
			current.tagName;
			this.currentElement = current.parentNode;
		},
		startPrefixMapping: function(prefix, uri) {},
		endPrefixMapping: function(prefix) {},
		processingInstruction: function(target, data) {
			var ins = this.doc.createProcessingInstruction(target, data);
			this.locator && position(this.locator, ins);
			appendElement(this, ins);
		},
		ignorableWhitespace: function(ch, start, length) {},
		characters: function(chars, start, length) {
			chars = _toString.apply(this, arguments);
			if (chars) {
				if (this.cdata) var charNode = this.doc.createCDATASection(chars);
				else var charNode = this.doc.createTextNode(chars);
				if (this.currentElement) this.currentElement.appendChild(charNode);
				else if (/^\s*$/.test(chars)) this.doc.appendChild(charNode);
				this.locator && position(this.locator, charNode);
			}
		},
		skippedEntity: function(name) {},
		endDocument: function() {
			this.doc.normalize();
		},
		setDocumentLocator: function(locator) {
			if (this.locator = locator) locator.lineNumber = 0;
		},
		comment: function(chars, start, length) {
			chars = _toString.apply(this, arguments);
			var comm = this.doc.createComment(chars);
			this.locator && position(this.locator, comm);
			appendElement(this, comm);
		},
		startCDATA: function() {
			this.cdata = true;
		},
		endCDATA: function() {
			this.cdata = false;
		},
		startDTD: function(name, publicId, systemId) {
			var impl = this.doc.implementation;
			if (impl && impl.createDocumentType) {
				var dt = impl.createDocumentType(name, publicId, systemId);
				this.locator && position(this.locator, dt);
				appendElement(this, dt);
				this.doc.doctype = dt;
			}
		},
		warning: function(error) {
			console.warn("[xmldom warning]	" + error, _locator(this.locator));
		},
		error: function(error) {
			console.error("[xmldom error]	" + error, _locator(this.locator));
		},
		fatalError: function(error) {
			throw new ParseError(error, this.locator);
		}
	};
	function _locator(l) {
		if (l) return "\n@" + (l.systemId || "") + "#[line:" + l.lineNumber + ",col:" + l.columnNumber + "]";
	}
	function _toString(chars, start, length) {
		if (typeof chars == "string") return chars.substr(start, length);
		else {
			if (chars.length >= start + length || start) return new java.lang.String(chars, start, length) + "";
			return chars;
		}
	}
	"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function(key) {
		DOMHandler.prototype[key] = function() {
			return null;
		};
	});
	function appendElement(hander, node) {
		if (!hander.currentElement) hander.doc.appendChild(node);
		else hander.currentElement.appendChild(node);
	}
	exports.__DOMHandler = DOMHandler;
	exports.normalizeLineEndings = normalizeLineEndings;
	exports.DOMParser = DOMParser;
}));
//#endregion
//#region node_modules/@xmldom/xmldom/lib/index.js
var require_lib$2 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var dom = require_dom();
	exports.DOMImplementation = dom.DOMImplementation;
	exports.XMLSerializer = dom.XMLSerializer;
	exports.DOMParser = require_dom_parser().DOMParser;
}));
//#endregion
//#region node_modules/mammoth/lib/xml/xmldom.js
var require_xmldom = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var xmldom = require_lib$2();
	var dom = require_dom();
	function parseFromString(string) {
		var error = null;
		var document = new xmldom.DOMParser({ errorHandler: function(level, message) {
			error = {
				level,
				message
			};
		} }).parseFromString(string);
		if (error === null) return document;
		else throw new Error(error.level + ": " + error.message);
	}
	exports.parseFromString = parseFromString;
	exports.Node = dom.Node;
}));
//#endregion
//#region node_modules/mammoth/lib/xml/reader.js
var require_reader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var promises = require_promises();
	var _ = require_underscore_node();
	var xmldom = require_xmldom();
	var nodes = require_nodes();
	var Element = nodes.Element;
	exports.readString = readString;
	var Node = xmldom.Node;
	function readString(xmlString, namespaceMap) {
		namespaceMap = namespaceMap || {};
		try {
			var document = xmldom.parseFromString(xmlString, "text/xml");
		} catch (error) {
			return promises.reject(error);
		}
		if (document.documentElement.tagName === "parsererror") return promises.resolve(new Error(document.documentElement.textContent));
		function convertNode(node) {
			switch (node.nodeType) {
				case Node.ELEMENT_NODE: return convertElement(node);
				case Node.TEXT_NODE: return nodes.text(node.nodeValue);
			}
		}
		function convertElement(element) {
			var convertedName = convertName(element);
			var convertedChildren = [];
			_.forEach(element.childNodes, function(childNode) {
				var convertedNode = convertNode(childNode);
				if (convertedNode) convertedChildren.push(convertedNode);
			});
			var convertedAttributes = {};
			_.forEach(element.attributes, function(attribute) {
				convertedAttributes[convertName(attribute)] = attribute.value;
			});
			return new Element(convertedName, convertedAttributes, convertedChildren);
		}
		function convertName(node) {
			if (node.namespaceURI) {
				var mappedPrefix = namespaceMap[node.namespaceURI];
				var prefix;
				if (mappedPrefix) prefix = mappedPrefix + ":";
				else prefix = "{" + node.namespaceURI + "}";
				return prefix + node.localName;
			} else return node.localName;
		}
		return promises.resolve(convertNode(document.documentElement));
	}
}));
//#endregion
//#region node_modules/xmlbuilder/lib/Utility.js
var require_Utility = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var assign, getValue, isArray, isEmpty, isFunction, isObject, isPlainObject, slice = [].slice, hasProp = {}.hasOwnProperty;
		assign = function() {
			var i, key, len, source, sources, target = arguments[0];
			sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
			if (isFunction(Object.assign)) Object.assign.apply(null, arguments);
			else for (i = 0, len = sources.length; i < len; i++) {
				source = sources[i];
				if (source != null) for (key in source) {
					if (!hasProp.call(source, key)) continue;
					target[key] = source[key];
				}
			}
			return target;
		};
		isFunction = function(val) {
			return !!val && Object.prototype.toString.call(val) === "[object Function]";
		};
		isObject = function(val) {
			var ref;
			return !!val && ((ref = typeof val) === "function" || ref === "object");
		};
		isArray = function(val) {
			if (isFunction(Array.isArray)) return Array.isArray(val);
			else return Object.prototype.toString.call(val) === "[object Array]";
		};
		isEmpty = function(val) {
			var key;
			if (isArray(val)) return !val.length;
			else {
				for (key in val) {
					if (!hasProp.call(val, key)) continue;
					return false;
				}
				return true;
			}
		};
		isPlainObject = function(val) {
			var ctor, proto;
			return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && typeof ctor === "function" && ctor instanceof ctor && Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object);
		};
		getValue = function(obj) {
			if (isFunction(obj.valueOf)) return obj.valueOf();
			else return obj;
		};
		module.exports.assign = assign;
		module.exports.isFunction = isFunction;
		module.exports.isObject = isObject;
		module.exports.isArray = isArray;
		module.exports.isEmpty = isEmpty;
		module.exports.isPlainObject = isPlainObject;
		module.exports.getValue = getValue;
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLAttribute.js
var require_XMLAttribute = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		module.exports = (function() {
			function XMLAttribute(parent, name, value) {
				this.options = parent.options;
				this.stringify = parent.stringify;
				this.parent = parent;
				if (name == null) throw new Error("Missing attribute name. " + this.debugInfo(name));
				if (value == null) throw new Error("Missing attribute value. " + this.debugInfo(name));
				this.name = this.stringify.attName(name);
				this.value = this.stringify.attValue(value);
			}
			XMLAttribute.prototype.clone = function() {
				return Object.create(this);
			};
			XMLAttribute.prototype.toString = function(options) {
				return this.options.writer.set(options).attribute(this);
			};
			XMLAttribute.prototype.debugInfo = function(name) {
				name = name || this.name;
				if (name == null) return "parent: <" + this.parent.name + ">";
				else return "attribute: {" + name + "}, parent: <" + this.parent.name + ">";
			};
			return XMLAttribute;
		})();
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLElement.js
var require_XMLElement = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLAttribute, XMLNode, getValue, isFunction, isObject, ref, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, getValue = ref.getValue;
		XMLNode = require_XMLNode();
		XMLAttribute = require_XMLAttribute();
		module.exports = (function(superClass) {
			extend(XMLElement, superClass);
			function XMLElement(parent, name, attributes) {
				XMLElement.__super__.constructor.call(this, parent);
				if (name == null) throw new Error("Missing element name. " + this.debugInfo());
				this.name = this.stringify.eleName(name);
				this.attributes = {};
				if (attributes != null) this.attribute(attributes);
				if (parent.isDocument) {
					this.isRoot = true;
					this.documentObject = parent;
					parent.rootObject = this;
				}
			}
			XMLElement.prototype.clone = function() {
				var att, attName, clonedSelf = Object.create(this), ref1;
				if (clonedSelf.isRoot) clonedSelf.documentObject = null;
				clonedSelf.attributes = {};
				ref1 = this.attributes;
				for (attName in ref1) {
					if (!hasProp.call(ref1, attName)) continue;
					att = ref1[attName];
					clonedSelf.attributes[attName] = att.clone();
				}
				clonedSelf.children = [];
				this.children.forEach(function(child) {
					var clonedChild = child.clone();
					clonedChild.parent = clonedSelf;
					return clonedSelf.children.push(clonedChild);
				});
				return clonedSelf;
			};
			XMLElement.prototype.attribute = function(name, value) {
				var attName, attValue;
				if (name != null) name = getValue(name);
				if (isObject(name)) for (attName in name) {
					if (!hasProp.call(name, attName)) continue;
					attValue = name[attName];
					this.attribute(attName, attValue);
				}
				else {
					if (isFunction(value)) value = value.apply();
					if (!this.options.skipNullAttributes || value != null) this.attributes[name] = new XMLAttribute(this, name, value);
				}
				return this;
			};
			XMLElement.prototype.removeAttribute = function(name) {
				var attName, i, len;
				if (name == null) throw new Error("Missing attribute name. " + this.debugInfo());
				name = getValue(name);
				if (Array.isArray(name)) for (i = 0, len = name.length; i < len; i++) {
					attName = name[i];
					delete this.attributes[attName];
				}
				else delete this.attributes[name];
				return this;
			};
			XMLElement.prototype.toString = function(options) {
				return this.options.writer.set(options).element(this);
			};
			XMLElement.prototype.att = function(name, value) {
				return this.attribute(name, value);
			};
			XMLElement.prototype.a = function(name, value) {
				return this.attribute(name, value);
			};
			return XMLElement;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLCData.js
var require_XMLCData = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLCData, superClass);
			function XMLCData(parent, text) {
				XMLCData.__super__.constructor.call(this, parent);
				if (text == null) throw new Error("Missing CDATA text. " + this.debugInfo());
				this.text = this.stringify.cdata(text);
			}
			XMLCData.prototype.clone = function() {
				return Object.create(this);
			};
			XMLCData.prototype.toString = function(options) {
				return this.options.writer.set(options).cdata(this);
			};
			return XMLCData;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLComment.js
var require_XMLComment = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLComment, superClass);
			function XMLComment(parent, text) {
				XMLComment.__super__.constructor.call(this, parent);
				if (text == null) throw new Error("Missing comment text. " + this.debugInfo());
				this.text = this.stringify.comment(text);
			}
			XMLComment.prototype.clone = function() {
				return Object.create(this);
			};
			XMLComment.prototype.toString = function(options) {
				return this.options.writer.set(options).comment(this);
			};
			return XMLComment;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLDeclaration.js
var require_XMLDeclaration = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, isObject, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		isObject = require_Utility().isObject;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLDeclaration, superClass);
			function XMLDeclaration(parent, version, encoding, standalone) {
				var ref;
				XMLDeclaration.__super__.constructor.call(this, parent);
				if (isObject(version)) ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
				if (!version) version = "1.0";
				this.version = this.stringify.xmlVersion(version);
				if (encoding != null) this.encoding = this.stringify.xmlEncoding(encoding);
				if (standalone != null) this.standalone = this.stringify.xmlStandalone(standalone);
			}
			XMLDeclaration.prototype.toString = function(options) {
				return this.options.writer.set(options).declaration(this);
			};
			return XMLDeclaration;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLDTDAttList.js
var require_XMLDTDAttList = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLDTDAttList, superClass);
			function XMLDTDAttList(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
				XMLDTDAttList.__super__.constructor.call(this, parent);
				if (elementName == null) throw new Error("Missing DTD element name. " + this.debugInfo());
				if (attributeName == null) throw new Error("Missing DTD attribute name. " + this.debugInfo(elementName));
				if (!attributeType) throw new Error("Missing DTD attribute type. " + this.debugInfo(elementName));
				if (!defaultValueType) throw new Error("Missing DTD attribute default. " + this.debugInfo(elementName));
				if (defaultValueType.indexOf("#") !== 0) defaultValueType = "#" + defaultValueType;
				if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(elementName));
				if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(elementName));
				this.elementName = this.stringify.eleName(elementName);
				this.attributeName = this.stringify.attName(attributeName);
				this.attributeType = this.stringify.dtdAttType(attributeType);
				this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
				this.defaultValueType = defaultValueType;
			}
			XMLDTDAttList.prototype.toString = function(options) {
				return this.options.writer.set(options).dtdAttList(this);
			};
			return XMLDTDAttList;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLDTDEntity.js
var require_XMLDTDEntity = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, isObject, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		isObject = require_Utility().isObject;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLDTDEntity, superClass);
			function XMLDTDEntity(parent, pe, name, value) {
				XMLDTDEntity.__super__.constructor.call(this, parent);
				if (name == null) throw new Error("Missing DTD entity name. " + this.debugInfo(name));
				if (value == null) throw new Error("Missing DTD entity value. " + this.debugInfo(name));
				this.pe = !!pe;
				this.name = this.stringify.eleName(name);
				if (!isObject(value)) this.value = this.stringify.dtdEntityValue(value);
				else {
					if (!value.pubID && !value.sysID) throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(name));
					if (value.pubID && !value.sysID) throw new Error("System identifier is required for a public external entity. " + this.debugInfo(name));
					if (value.pubID != null) this.pubID = this.stringify.dtdPubID(value.pubID);
					if (value.sysID != null) this.sysID = this.stringify.dtdSysID(value.sysID);
					if (value.nData != null) this.nData = this.stringify.dtdNData(value.nData);
					if (this.pe && this.nData) throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(name));
				}
			}
			XMLDTDEntity.prototype.toString = function(options) {
				return this.options.writer.set(options).dtdEntity(this);
			};
			return XMLDTDEntity;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLDTDElement.js
var require_XMLDTDElement = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLDTDElement, superClass);
			function XMLDTDElement(parent, name, value) {
				XMLDTDElement.__super__.constructor.call(this, parent);
				if (name == null) throw new Error("Missing DTD element name. " + this.debugInfo());
				if (!value) value = "(#PCDATA)";
				if (Array.isArray(value)) value = "(" + value.join(",") + ")";
				this.name = this.stringify.eleName(name);
				this.value = this.stringify.dtdElementValue(value);
			}
			XMLDTDElement.prototype.toString = function(options) {
				return this.options.writer.set(options).dtdElement(this);
			};
			return XMLDTDElement;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLDTDNotation.js
var require_XMLDTDNotation = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLDTDNotation, superClass);
			function XMLDTDNotation(parent, name, value) {
				XMLDTDNotation.__super__.constructor.call(this, parent);
				if (name == null) throw new Error("Missing DTD notation name. " + this.debugInfo(name));
				if (!value.pubID && !value.sysID) throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(name));
				this.name = this.stringify.eleName(name);
				if (value.pubID != null) this.pubID = this.stringify.dtdPubID(value.pubID);
				if (value.sysID != null) this.sysID = this.stringify.dtdSysID(value.sysID);
			}
			XMLDTDNotation.prototype.toString = function(options) {
				return this.options.writer.set(options).dtdNotation(this);
			};
			return XMLDTDNotation;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLDocType.js
var require_XMLDocType = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLNode, isObject, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		isObject = require_Utility().isObject;
		XMLNode = require_XMLNode();
		XMLDTDAttList = require_XMLDTDAttList();
		XMLDTDEntity = require_XMLDTDEntity();
		XMLDTDElement = require_XMLDTDElement();
		XMLDTDNotation = require_XMLDTDNotation();
		module.exports = (function(superClass) {
			extend(XMLDocType, superClass);
			function XMLDocType(parent, pubID, sysID) {
				var ref, ref1;
				XMLDocType.__super__.constructor.call(this, parent);
				this.name = "!DOCTYPE";
				this.documentObject = parent;
				if (isObject(pubID)) ref = pubID, pubID = ref.pubID, sysID = ref.sysID;
				if (sysID == null) ref1 = [pubID, sysID], sysID = ref1[0], pubID = ref1[1];
				if (pubID != null) this.pubID = this.stringify.dtdPubID(pubID);
				if (sysID != null) this.sysID = this.stringify.dtdSysID(sysID);
			}
			XMLDocType.prototype.element = function(name, value) {
				var child = new XMLDTDElement(this, name, value);
				this.children.push(child);
				return this;
			};
			XMLDocType.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
				var child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
				this.children.push(child);
				return this;
			};
			XMLDocType.prototype.entity = function(name, value) {
				var child = new XMLDTDEntity(this, false, name, value);
				this.children.push(child);
				return this;
			};
			XMLDocType.prototype.pEntity = function(name, value) {
				var child = new XMLDTDEntity(this, true, name, value);
				this.children.push(child);
				return this;
			};
			XMLDocType.prototype.notation = function(name, value) {
				var child = new XMLDTDNotation(this, name, value);
				this.children.push(child);
				return this;
			};
			XMLDocType.prototype.toString = function(options) {
				return this.options.writer.set(options).docType(this);
			};
			XMLDocType.prototype.ele = function(name, value) {
				return this.element(name, value);
			};
			XMLDocType.prototype.att = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
				return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
			};
			XMLDocType.prototype.ent = function(name, value) {
				return this.entity(name, value);
			};
			XMLDocType.prototype.pent = function(name, value) {
				return this.pEntity(name, value);
			};
			XMLDocType.prototype.not = function(name, value) {
				return this.notation(name, value);
			};
			XMLDocType.prototype.up = function() {
				return this.root() || this.documentObject;
			};
			return XMLDocType;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLRaw.js
var require_XMLRaw = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLRaw, superClass);
			function XMLRaw(parent, text) {
				XMLRaw.__super__.constructor.call(this, parent);
				if (text == null) throw new Error("Missing raw text. " + this.debugInfo());
				this.value = this.stringify.raw(text);
			}
			XMLRaw.prototype.clone = function() {
				return Object.create(this);
			};
			XMLRaw.prototype.toString = function(options) {
				return this.options.writer.set(options).raw(this);
			};
			return XMLRaw;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLText.js
var require_XMLText = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLText, superClass);
			function XMLText(parent, text) {
				XMLText.__super__.constructor.call(this, parent);
				if (text == null) throw new Error("Missing element text. " + this.debugInfo());
				this.value = this.stringify.eleText(text);
			}
			XMLText.prototype.clone = function() {
				return Object.create(this);
			};
			XMLText.prototype.toString = function(options) {
				return this.options.writer.set(options).text(this);
			};
			return XMLText;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLProcessingInstruction.js
var require_XMLProcessingInstruction = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLProcessingInstruction, superClass);
			function XMLProcessingInstruction(parent, target, value) {
				XMLProcessingInstruction.__super__.constructor.call(this, parent);
				if (target == null) throw new Error("Missing instruction target. " + this.debugInfo());
				this.target = this.stringify.insTarget(target);
				if (value) this.value = this.stringify.insValue(value);
			}
			XMLProcessingInstruction.prototype.clone = function() {
				return Object.create(this);
			};
			XMLProcessingInstruction.prototype.toString = function(options) {
				return this.options.writer.set(options).processingInstruction(this);
			};
			return XMLProcessingInstruction;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLDummy.js
var require_XMLDummy = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLNode = require_XMLNode();
		module.exports = (function(superClass) {
			extend(XMLDummy, superClass);
			function XMLDummy(parent) {
				XMLDummy.__super__.constructor.call(this, parent);
				this.isDummy = true;
			}
			XMLDummy.prototype.clone = function() {
				return Object.create(this);
			};
			XMLDummy.prototype.toString = function(options) {
				return "";
			};
			return XMLDummy;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLNode.js
var require_XMLNode = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLCData, XMLComment, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLText, getValue, isEmpty, isFunction, isObject, ref, hasProp = {}.hasOwnProperty;
		ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, isEmpty = ref.isEmpty, getValue = ref.getValue;
		XMLElement = null;
		XMLCData = null;
		XMLComment = null;
		XMLDeclaration = null;
		XMLDocType = null;
		XMLRaw = null;
		XMLText = null;
		XMLProcessingInstruction = null;
		XMLDummy = null;
		module.exports = (function() {
			function XMLNode(parent) {
				this.parent = parent;
				if (this.parent) {
					this.options = this.parent.options;
					this.stringify = this.parent.stringify;
				}
				this.children = [];
				if (!XMLElement) {
					XMLElement = require_XMLElement();
					XMLCData = require_XMLCData();
					XMLComment = require_XMLComment();
					XMLDeclaration = require_XMLDeclaration();
					XMLDocType = require_XMLDocType();
					XMLRaw = require_XMLRaw();
					XMLText = require_XMLText();
					XMLProcessingInstruction = require_XMLProcessingInstruction();
					XMLDummy = require_XMLDummy();
				}
			}
			XMLNode.prototype.element = function(name, attributes, text) {
				var childNode, item, j, k, key, lastChild = null, len, len1, ref1, ref2, val;
				if (attributes === null && text == null) ref1 = [{}, null], attributes = ref1[0], text = ref1[1];
				if (attributes == null) attributes = {};
				attributes = getValue(attributes);
				if (!isObject(attributes)) ref2 = [attributes, text], text = ref2[0], attributes = ref2[1];
				if (name != null) name = getValue(name);
				if (Array.isArray(name)) for (j = 0, len = name.length; j < len; j++) {
					item = name[j];
					lastChild = this.element(item);
				}
				else if (isFunction(name)) lastChild = this.element(name.apply());
				else if (isObject(name)) for (key in name) {
					if (!hasProp.call(name, key)) continue;
					val = name[key];
					if (isFunction(val)) val = val.apply();
					if (isObject(val) && isEmpty(val)) val = null;
					if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
					else if (!this.options.separateArrayItems && Array.isArray(val)) for (k = 0, len1 = val.length; k < len1; k++) {
						item = val[k];
						childNode = {};
						childNode[key] = item;
						lastChild = this.element(childNode);
					}
					else if (isObject(val)) {
						lastChild = this.element(key);
						lastChild.element(val);
					} else lastChild = this.element(key, val);
				}
				else if (this.options.skipNullNodes && text === null) lastChild = this.dummy();
				else if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) lastChild = this.text(text);
				else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) lastChild = this.cdata(text);
				else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) lastChild = this.comment(text);
				else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) lastChild = this.raw(text);
				else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
				else lastChild = this.node(name, attributes, text);
				if (lastChild == null) throw new Error("Could not create any elements with: " + name + ". " + this.debugInfo());
				return lastChild;
			};
			XMLNode.prototype.insertBefore = function(name, attributes, text) {
				var child, i, removed;
				if (this.isRoot) throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
				i = this.parent.children.indexOf(this);
				removed = this.parent.children.splice(i);
				child = this.parent.element(name, attributes, text);
				Array.prototype.push.apply(this.parent.children, removed);
				return child;
			};
			XMLNode.prototype.insertAfter = function(name, attributes, text) {
				var child, i, removed;
				if (this.isRoot) throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
				i = this.parent.children.indexOf(this);
				removed = this.parent.children.splice(i + 1);
				child = this.parent.element(name, attributes, text);
				Array.prototype.push.apply(this.parent.children, removed);
				return child;
			};
			XMLNode.prototype.remove = function() {
				var i;
				if (this.isRoot) throw new Error("Cannot remove the root element. " + this.debugInfo());
				i = this.parent.children.indexOf(this);
				[].splice.apply(this.parent.children, [i, i - i + 1].concat([]));
				return this.parent;
			};
			XMLNode.prototype.node = function(name, attributes, text) {
				var child, ref1;
				if (name != null) name = getValue(name);
				attributes || (attributes = {});
				attributes = getValue(attributes);
				if (!isObject(attributes)) ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
				child = new XMLElement(this, name, attributes);
				if (text != null) child.text(text);
				this.children.push(child);
				return child;
			};
			XMLNode.prototype.text = function(value) {
				var child = new XMLText(this, value);
				this.children.push(child);
				return this;
			};
			XMLNode.prototype.cdata = function(value) {
				var child = new XMLCData(this, value);
				this.children.push(child);
				return this;
			};
			XMLNode.prototype.comment = function(value) {
				var child = new XMLComment(this, value);
				this.children.push(child);
				return this;
			};
			XMLNode.prototype.commentBefore = function(value) {
				var i = this.parent.children.indexOf(this), removed = this.parent.children.splice(i);
				this.parent.comment(value);
				Array.prototype.push.apply(this.parent.children, removed);
				return this;
			};
			XMLNode.prototype.commentAfter = function(value) {
				var i = this.parent.children.indexOf(this), removed = this.parent.children.splice(i + 1);
				this.parent.comment(value);
				Array.prototype.push.apply(this.parent.children, removed);
				return this;
			};
			XMLNode.prototype.raw = function(value) {
				var child = new XMLRaw(this, value);
				this.children.push(child);
				return this;
			};
			XMLNode.prototype.dummy = function() {
				var child = new XMLDummy(this);
				this.children.push(child);
				return child;
			};
			XMLNode.prototype.instruction = function(target, value) {
				var insTarget, insValue, instruction, j, len;
				if (target != null) target = getValue(target);
				if (value != null) value = getValue(value);
				if (Array.isArray(target)) for (j = 0, len = target.length; j < len; j++) {
					insTarget = target[j];
					this.instruction(insTarget);
				}
				else if (isObject(target)) for (insTarget in target) {
					if (!hasProp.call(target, insTarget)) continue;
					insValue = target[insTarget];
					this.instruction(insTarget, insValue);
				}
				else {
					if (isFunction(value)) value = value.apply();
					instruction = new XMLProcessingInstruction(this, target, value);
					this.children.push(instruction);
				}
				return this;
			};
			XMLNode.prototype.instructionBefore = function(target, value) {
				var i = this.parent.children.indexOf(this), removed = this.parent.children.splice(i);
				this.parent.instruction(target, value);
				Array.prototype.push.apply(this.parent.children, removed);
				return this;
			};
			XMLNode.prototype.instructionAfter = function(target, value) {
				var i = this.parent.children.indexOf(this), removed = this.parent.children.splice(i + 1);
				this.parent.instruction(target, value);
				Array.prototype.push.apply(this.parent.children, removed);
				return this;
			};
			XMLNode.prototype.declaration = function(version, encoding, standalone) {
				var doc = this.document(), xmldec = new XMLDeclaration(doc, version, encoding, standalone);
				if (doc.children[0] instanceof XMLDeclaration) doc.children[0] = xmldec;
				else doc.children.unshift(xmldec);
				return doc.root() || doc;
			};
			XMLNode.prototype.doctype = function(pubID, sysID) {
				var child, doc = this.document(), doctype = new XMLDocType(doc, pubID, sysID), i, j, k, len, len1, ref1 = doc.children, ref2;
				for (i = j = 0, len = ref1.length; j < len; i = ++j) {
					child = ref1[i];
					if (child instanceof XMLDocType) {
						doc.children[i] = doctype;
						return doctype;
					}
				}
				ref2 = doc.children;
				for (i = k = 0, len1 = ref2.length; k < len1; i = ++k) {
					child = ref2[i];
					if (child.isRoot) {
						doc.children.splice(i, 0, doctype);
						return doctype;
					}
				}
				doc.children.push(doctype);
				return doctype;
			};
			XMLNode.prototype.up = function() {
				if (this.isRoot) throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
				return this.parent;
			};
			XMLNode.prototype.root = function() {
				var node = this;
				while (node) if (node.isDocument) return node.rootObject;
				else if (node.isRoot) return node;
				else node = node.parent;
			};
			XMLNode.prototype.document = function() {
				var node = this;
				while (node) if (node.isDocument) return node;
				else node = node.parent;
			};
			XMLNode.prototype.end = function(options) {
				return this.document().end(options);
			};
			XMLNode.prototype.prev = function() {
				var i = this.parent.children.indexOf(this);
				while (i > 0 && this.parent.children[i - 1].isDummy) i = i - 1;
				if (i < 1) throw new Error("Already at the first node. " + this.debugInfo());
				return this.parent.children[i - 1];
			};
			XMLNode.prototype.next = function() {
				var i = this.parent.children.indexOf(this);
				while (i < this.parent.children.length - 1 && this.parent.children[i + 1].isDummy) i = i + 1;
				if (i === -1 || i === this.parent.children.length - 1) throw new Error("Already at the last node. " + this.debugInfo());
				return this.parent.children[i + 1];
			};
			XMLNode.prototype.importDocument = function(doc) {
				var clonedRoot = doc.root().clone();
				clonedRoot.parent = this;
				clonedRoot.isRoot = false;
				this.children.push(clonedRoot);
				return this;
			};
			XMLNode.prototype.debugInfo = function(name) {
				var ref1, ref2;
				name = name || this.name;
				if (name == null && !((ref1 = this.parent) != null ? ref1.name : void 0)) return "";
				else if (name == null) return "parent: <" + this.parent.name + ">";
				else if (!((ref2 = this.parent) != null ? ref2.name : void 0)) return "node: <" + name + ">";
				else return "node: <" + name + ">, parent: <" + this.parent.name + ">";
			};
			XMLNode.prototype.ele = function(name, attributes, text) {
				return this.element(name, attributes, text);
			};
			XMLNode.prototype.nod = function(name, attributes, text) {
				return this.node(name, attributes, text);
			};
			XMLNode.prototype.txt = function(value) {
				return this.text(value);
			};
			XMLNode.prototype.dat = function(value) {
				return this.cdata(value);
			};
			XMLNode.prototype.com = function(value) {
				return this.comment(value);
			};
			XMLNode.prototype.ins = function(target, value) {
				return this.instruction(target, value);
			};
			XMLNode.prototype.doc = function() {
				return this.document();
			};
			XMLNode.prototype.dec = function(version, encoding, standalone) {
				return this.declaration(version, encoding, standalone);
			};
			XMLNode.prototype.dtd = function(pubID, sysID) {
				return this.doctype(pubID, sysID);
			};
			XMLNode.prototype.e = function(name, attributes, text) {
				return this.element(name, attributes, text);
			};
			XMLNode.prototype.n = function(name, attributes, text) {
				return this.node(name, attributes, text);
			};
			XMLNode.prototype.t = function(value) {
				return this.text(value);
			};
			XMLNode.prototype.d = function(value) {
				return this.cdata(value);
			};
			XMLNode.prototype.c = function(value) {
				return this.comment(value);
			};
			XMLNode.prototype.r = function(value) {
				return this.raw(value);
			};
			XMLNode.prototype.i = function(target, value) {
				return this.instruction(target, value);
			};
			XMLNode.prototype.u = function() {
				return this.up();
			};
			XMLNode.prototype.importXMLBuilder = function(doc) {
				return this.importDocument(doc);
			};
			return XMLNode;
		})();
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLStringifier.js
var require_XMLStringifier = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var bind = function(fn, me) {
			return function() {
				return fn.apply(me, arguments);
			};
		}, hasProp = {}.hasOwnProperty;
		module.exports = (function() {
			function XMLStringifier(options) {
				this.assertLegalChar = bind(this.assertLegalChar, this);
				var key, ref, value;
				options || (options = {});
				this.noDoubleEncoding = options.noDoubleEncoding;
				ref = options.stringify || {};
				for (key in ref) {
					if (!hasProp.call(ref, key)) continue;
					value = ref[key];
					this[key] = value;
				}
			}
			XMLStringifier.prototype.eleName = function(val) {
				val = "" + val || "";
				return this.assertLegalChar(val);
			};
			XMLStringifier.prototype.eleText = function(val) {
				val = "" + val || "";
				return this.assertLegalChar(this.elEscape(val));
			};
			XMLStringifier.prototype.cdata = function(val) {
				val = "" + val || "";
				val = val.replace("]]>", "]]]]><![CDATA[>");
				return this.assertLegalChar(val);
			};
			XMLStringifier.prototype.comment = function(val) {
				val = "" + val || "";
				if (val.match(/--/)) throw new Error("Comment text cannot contain double-hypen: " + val);
				return this.assertLegalChar(val);
			};
			XMLStringifier.prototype.raw = function(val) {
				return "" + val || "";
			};
			XMLStringifier.prototype.attName = function(val) {
				return val = "" + val || "";
			};
			XMLStringifier.prototype.attValue = function(val) {
				val = "" + val || "";
				return this.attEscape(val);
			};
			XMLStringifier.prototype.insTarget = function(val) {
				return "" + val || "";
			};
			XMLStringifier.prototype.insValue = function(val) {
				val = "" + val || "";
				if (val.match(/\?>/)) throw new Error("Invalid processing instruction value: " + val);
				return val;
			};
			XMLStringifier.prototype.xmlVersion = function(val) {
				val = "" + val || "";
				if (!val.match(/1\.[0-9]+/)) throw new Error("Invalid version number: " + val);
				return val;
			};
			XMLStringifier.prototype.xmlEncoding = function(val) {
				val = "" + val || "";
				if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) throw new Error("Invalid encoding: " + val);
				return val;
			};
			XMLStringifier.prototype.xmlStandalone = function(val) {
				if (val) return "yes";
				else return "no";
			};
			XMLStringifier.prototype.dtdPubID = function(val) {
				return "" + val || "";
			};
			XMLStringifier.prototype.dtdSysID = function(val) {
				return "" + val || "";
			};
			XMLStringifier.prototype.dtdElementValue = function(val) {
				return "" + val || "";
			};
			XMLStringifier.prototype.dtdAttType = function(val) {
				return "" + val || "";
			};
			XMLStringifier.prototype.dtdAttDefault = function(val) {
				if (val != null) return "" + val || "";
				else return val;
			};
			XMLStringifier.prototype.dtdEntityValue = function(val) {
				return "" + val || "";
			};
			XMLStringifier.prototype.dtdNData = function(val) {
				return "" + val || "";
			};
			XMLStringifier.prototype.convertAttKey = "@";
			XMLStringifier.prototype.convertPIKey = "?";
			XMLStringifier.prototype.convertTextKey = "#text";
			XMLStringifier.prototype.convertCDataKey = "#cdata";
			XMLStringifier.prototype.convertCommentKey = "#comment";
			XMLStringifier.prototype.convertRawKey = "#raw";
			XMLStringifier.prototype.assertLegalChar = function(str) {
				var res = str.match(/[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/);
				if (res) throw new Error("Invalid character in string: " + str + " at index " + res.index);
				return str;
			};
			XMLStringifier.prototype.elEscape = function(str) {
				var ampregex = this.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
				return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#xD;");
			};
			XMLStringifier.prototype.attEscape = function(str) {
				var ampregex = this.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
				return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\t/g, "&#x9;").replace(/\n/g, "&#xA;").replace(/\r/g, "&#xD;");
			};
			return XMLStringifier;
		})();
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLWriterBase.js
var require_XMLWriterBase = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var hasProp = {}.hasOwnProperty;
		module.exports = (function() {
			function XMLWriterBase(options) {
				var key, ref, ref1, ref2, ref3, ref4, ref5, ref6, value;
				options || (options = {});
				this.pretty = options.pretty || false;
				this.allowEmpty = (ref = options.allowEmpty) != null ? ref : false;
				if (this.pretty) {
					this.indent = (ref1 = options.indent) != null ? ref1 : "  ";
					this.newline = (ref2 = options.newline) != null ? ref2 : "\n";
					this.offset = (ref3 = options.offset) != null ? ref3 : 0;
					this.dontprettytextnodes = (ref4 = options.dontprettytextnodes) != null ? ref4 : 0;
				} else {
					this.indent = "";
					this.newline = "";
					this.offset = 0;
					this.dontprettytextnodes = 0;
				}
				this.spacebeforeslash = (ref5 = options.spacebeforeslash) != null ? ref5 : "";
				if (this.spacebeforeslash === true) this.spacebeforeslash = " ";
				this.newlinedefault = this.newline;
				this.prettydefault = this.pretty;
				ref6 = options.writer || {};
				for (key in ref6) {
					if (!hasProp.call(ref6, key)) continue;
					value = ref6[key];
					this[key] = value;
				}
			}
			XMLWriterBase.prototype.set = function(options) {
				var key, ref, value;
				options || (options = {});
				if ("pretty" in options) this.pretty = options.pretty;
				if ("allowEmpty" in options) this.allowEmpty = options.allowEmpty;
				if (this.pretty) {
					this.indent = "indent" in options ? options.indent : "  ";
					this.newline = "newline" in options ? options.newline : "\n";
					this.offset = "offset" in options ? options.offset : 0;
					this.dontprettytextnodes = "dontprettytextnodes" in options ? options.dontprettytextnodes : 0;
				} else {
					this.indent = "";
					this.newline = "";
					this.offset = 0;
					this.dontprettytextnodes = 0;
				}
				this.spacebeforeslash = "spacebeforeslash" in options ? options.spacebeforeslash : "";
				if (this.spacebeforeslash === true) this.spacebeforeslash = " ";
				this.newlinedefault = this.newline;
				this.prettydefault = this.pretty;
				ref = options.writer || {};
				for (key in ref) {
					if (!hasProp.call(ref, key)) continue;
					value = ref[key];
					this[key] = value;
				}
				return this;
			};
			XMLWriterBase.prototype.space = function(level) {
				var indent;
				if (this.pretty) {
					indent = (level || 0) + this.offset + 1;
					if (indent > 0) return new Array(indent).join(this.indent);
					else return "";
				} else return "";
			};
			return XMLWriterBase;
		})();
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLStringWriter.js
var require_XMLStringWriter = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLText, XMLWriterBase, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLDeclaration = require_XMLDeclaration();
		XMLDocType = require_XMLDocType();
		XMLCData = require_XMLCData();
		XMLComment = require_XMLComment();
		XMLElement = require_XMLElement();
		XMLRaw = require_XMLRaw();
		XMLText = require_XMLText();
		XMLProcessingInstruction = require_XMLProcessingInstruction();
		XMLDummy = require_XMLDummy();
		XMLDTDAttList = require_XMLDTDAttList();
		XMLDTDElement = require_XMLDTDElement();
		XMLDTDEntity = require_XMLDTDEntity();
		XMLDTDNotation = require_XMLDTDNotation();
		XMLWriterBase = require_XMLWriterBase();
		module.exports = (function(superClass) {
			extend(XMLStringWriter, superClass);
			function XMLStringWriter(options) {
				XMLStringWriter.__super__.constructor.call(this, options);
			}
			XMLStringWriter.prototype.document = function(doc) {
				var child, i, len, r, ref;
				this.textispresent = false;
				r = "";
				ref = doc.children;
				for (i = 0, len = ref.length; i < len; i++) {
					child = ref[i];
					if (child instanceof XMLDummy) continue;
					r += (function() {
						switch (false) {
							case !(child instanceof XMLDeclaration): return this.declaration(child);
							case !(child instanceof XMLDocType): return this.docType(child);
							case !(child instanceof XMLComment): return this.comment(child);
							case !(child instanceof XMLProcessingInstruction): return this.processingInstruction(child);
							default: return this.element(child, 0);
						}
					}).call(this);
				}
				if (this.pretty && r.slice(-this.newline.length) === this.newline) r = r.slice(0, -this.newline.length);
				return r;
			};
			XMLStringWriter.prototype.attribute = function(att) {
				return " " + att.name + "=\"" + att.value + "\"";
			};
			XMLStringWriter.prototype.cdata = function(node, level) {
				return this.space(level) + "<![CDATA[" + node.text + "]]>" + this.newline;
			};
			XMLStringWriter.prototype.comment = function(node, level) {
				return this.space(level) + "<!-- " + node.text + " -->" + this.newline;
			};
			XMLStringWriter.prototype.declaration = function(node, level) {
				var r = this.space(level);
				r += "<?xml version=\"" + node.version + "\"";
				if (node.encoding != null) r += " encoding=\"" + node.encoding + "\"";
				if (node.standalone != null) r += " standalone=\"" + node.standalone + "\"";
				r += this.spacebeforeslash + "?>";
				r += this.newline;
				return r;
			};
			XMLStringWriter.prototype.docType = function(node, level) {
				var child, i, len, r, ref;
				level || (level = 0);
				r = this.space(level);
				r += "<!DOCTYPE " + node.root().name;
				if (node.pubID && node.sysID) r += " PUBLIC \"" + node.pubID + "\" \"" + node.sysID + "\"";
				else if (node.sysID) r += " SYSTEM \"" + node.sysID + "\"";
				if (node.children.length > 0) {
					r += " [";
					r += this.newline;
					ref = node.children;
					for (i = 0, len = ref.length; i < len; i++) {
						child = ref[i];
						r += (function() {
							switch (false) {
								case !(child instanceof XMLDTDAttList): return this.dtdAttList(child, level + 1);
								case !(child instanceof XMLDTDElement): return this.dtdElement(child, level + 1);
								case !(child instanceof XMLDTDEntity): return this.dtdEntity(child, level + 1);
								case !(child instanceof XMLDTDNotation): return this.dtdNotation(child, level + 1);
								case !(child instanceof XMLCData): return this.cdata(child, level + 1);
								case !(child instanceof XMLComment): return this.comment(child, level + 1);
								case !(child instanceof XMLProcessingInstruction): return this.processingInstruction(child, level + 1);
								default: throw new Error("Unknown DTD node type: " + child.constructor.name);
							}
						}).call(this);
					}
					r += "]";
				}
				r += this.spacebeforeslash + ">";
				r += this.newline;
				return r;
			};
			XMLStringWriter.prototype.element = function(node, level) {
				var att, child, i, j, len, len1, name, r, ref, ref1, ref2, space, textispresentwasset;
				level || (level = 0);
				textispresentwasset = false;
				if (this.textispresent) {
					this.newline = "";
					this.pretty = false;
				} else {
					this.newline = this.newlinedefault;
					this.pretty = this.prettydefault;
				}
				space = this.space(level);
				r = "";
				r += space + "<" + node.name;
				ref = node.attributes;
				for (name in ref) {
					if (!hasProp.call(ref, name)) continue;
					att = ref[name];
					r += this.attribute(att);
				}
				if (node.children.length === 0 || node.children.every(function(e) {
					return e.value === "";
				})) if (this.allowEmpty) r += "></" + node.name + ">" + this.newline;
				else r += this.spacebeforeslash + "/>" + this.newline;
				else if (this.pretty && node.children.length === 1 && node.children[0].value != null) {
					r += ">";
					r += node.children[0].value;
					r += "</" + node.name + ">" + this.newline;
				} else {
					if (this.dontprettytextnodes) {
						ref1 = node.children;
						for (i = 0, len = ref1.length; i < len; i++) {
							child = ref1[i];
							if (child.value != null) {
								this.textispresent++;
								textispresentwasset = true;
								break;
							}
						}
					}
					if (this.textispresent) {
						this.newline = "";
						this.pretty = false;
						space = this.space(level);
					}
					r += ">" + this.newline;
					ref2 = node.children;
					for (j = 0, len1 = ref2.length; j < len1; j++) {
						child = ref2[j];
						r += (function() {
							switch (false) {
								case !(child instanceof XMLCData): return this.cdata(child, level + 1);
								case !(child instanceof XMLComment): return this.comment(child, level + 1);
								case !(child instanceof XMLElement): return this.element(child, level + 1);
								case !(child instanceof XMLRaw): return this.raw(child, level + 1);
								case !(child instanceof XMLText): return this.text(child, level + 1);
								case !(child instanceof XMLProcessingInstruction): return this.processingInstruction(child, level + 1);
								case !(child instanceof XMLDummy): return "";
								default: throw new Error("Unknown XML node type: " + child.constructor.name);
							}
						}).call(this);
					}
					if (textispresentwasset) this.textispresent--;
					if (!this.textispresent) {
						this.newline = this.newlinedefault;
						this.pretty = this.prettydefault;
					}
					r += space + "</" + node.name + ">" + this.newline;
				}
				return r;
			};
			XMLStringWriter.prototype.processingInstruction = function(node, level) {
				var r = this.space(level) + "<?" + node.target;
				if (node.value) r += " " + node.value;
				r += this.spacebeforeslash + "?>" + this.newline;
				return r;
			};
			XMLStringWriter.prototype.raw = function(node, level) {
				return this.space(level) + node.value + this.newline;
			};
			XMLStringWriter.prototype.text = function(node, level) {
				return this.space(level) + node.value + this.newline;
			};
			XMLStringWriter.prototype.dtdAttList = function(node, level) {
				var r = this.space(level) + "<!ATTLIST " + node.elementName + " " + node.attributeName + " " + node.attributeType;
				if (node.defaultValueType !== "#DEFAULT") r += " " + node.defaultValueType;
				if (node.defaultValue) r += " \"" + node.defaultValue + "\"";
				r += this.spacebeforeslash + ">" + this.newline;
				return r;
			};
			XMLStringWriter.prototype.dtdElement = function(node, level) {
				return this.space(level) + "<!ELEMENT " + node.name + " " + node.value + this.spacebeforeslash + ">" + this.newline;
			};
			XMLStringWriter.prototype.dtdEntity = function(node, level) {
				var r = this.space(level) + "<!ENTITY";
				if (node.pe) r += " %";
				r += " " + node.name;
				if (node.value) r += " \"" + node.value + "\"";
				else {
					if (node.pubID && node.sysID) r += " PUBLIC \"" + node.pubID + "\" \"" + node.sysID + "\"";
					else if (node.sysID) r += " SYSTEM \"" + node.sysID + "\"";
					if (node.nData) r += " NDATA " + node.nData;
				}
				r += this.spacebeforeslash + ">" + this.newline;
				return r;
			};
			XMLStringWriter.prototype.dtdNotation = function(node, level) {
				var r = this.space(level) + "<!NOTATION " + node.name;
				if (node.pubID && node.sysID) r += " PUBLIC \"" + node.pubID + "\" \"" + node.sysID + "\"";
				else if (node.pubID) r += " PUBLIC \"" + node.pubID + "\"";
				else if (node.sysID) r += " SYSTEM \"" + node.sysID + "\"";
				r += this.spacebeforeslash + ">" + this.newline;
				return r;
			};
			XMLStringWriter.prototype.openNode = function(node, level) {
				var att, name, r, ref;
				level || (level = 0);
				if (node instanceof XMLElement) {
					r = this.space(level) + "<" + node.name;
					ref = node.attributes;
					for (name in ref) {
						if (!hasProp.call(ref, name)) continue;
						att = ref[name];
						r += this.attribute(att);
					}
					r += (node.children ? ">" : "/>") + this.newline;
					return r;
				} else {
					r = this.space(level) + "<!DOCTYPE " + node.rootNodeName;
					if (node.pubID && node.sysID) r += " PUBLIC \"" + node.pubID + "\" \"" + node.sysID + "\"";
					else if (node.sysID) r += " SYSTEM \"" + node.sysID + "\"";
					r += (node.children ? " [" : ">") + this.newline;
					return r;
				}
			};
			XMLStringWriter.prototype.closeNode = function(node, level) {
				level || (level = 0);
				switch (false) {
					case !(node instanceof XMLElement): return this.space(level) + "</" + node.name + ">" + this.newline;
					case !(node instanceof XMLDocType): return this.space(level) + "]>" + this.newline;
				}
			};
			return XMLStringWriter;
		})(XMLWriterBase);
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLDocument.js
var require_XMLDocument = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLNode, XMLStringWriter, XMLStringifier, isPlainObject, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		isPlainObject = require_Utility().isPlainObject;
		XMLNode = require_XMLNode();
		XMLStringifier = require_XMLStringifier();
		XMLStringWriter = require_XMLStringWriter();
		module.exports = (function(superClass) {
			extend(XMLDocument, superClass);
			function XMLDocument(options) {
				XMLDocument.__super__.constructor.call(this, null);
				this.name = "?xml";
				options || (options = {});
				if (!options.writer) options.writer = new XMLStringWriter();
				this.options = options;
				this.stringify = new XMLStringifier(options);
				this.isDocument = true;
			}
			XMLDocument.prototype.end = function(writer) {
				var writerOptions;
				if (!writer) writer = this.options.writer;
				else if (isPlainObject(writer)) {
					writerOptions = writer;
					writer = this.options.writer.set(writerOptions);
				}
				return writer.document(this);
			};
			XMLDocument.prototype.toString = function(options) {
				return this.options.writer.set(options).document(this);
			};
			return XMLDocument;
		})(XMLNode);
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLDocumentCB.js
var require_XMLDocumentCB = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLAttribute, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLStringifier, XMLText, getValue, isFunction, isObject, isPlainObject, ref, hasProp = {}.hasOwnProperty;
		ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, isPlainObject = ref.isPlainObject, getValue = ref.getValue;
		XMLElement = require_XMLElement();
		XMLCData = require_XMLCData();
		XMLComment = require_XMLComment();
		XMLRaw = require_XMLRaw();
		XMLText = require_XMLText();
		XMLProcessingInstruction = require_XMLProcessingInstruction();
		XMLDeclaration = require_XMLDeclaration();
		XMLDocType = require_XMLDocType();
		XMLDTDAttList = require_XMLDTDAttList();
		XMLDTDEntity = require_XMLDTDEntity();
		XMLDTDElement = require_XMLDTDElement();
		XMLDTDNotation = require_XMLDTDNotation();
		XMLAttribute = require_XMLAttribute();
		XMLStringifier = require_XMLStringifier();
		XMLStringWriter = require_XMLStringWriter();
		module.exports = (function() {
			function XMLDocumentCB(options, onData, onEnd) {
				var writerOptions;
				this.name = "?xml";
				options || (options = {});
				if (!options.writer) options.writer = new XMLStringWriter(options);
				else if (isPlainObject(options.writer)) {
					writerOptions = options.writer;
					options.writer = new XMLStringWriter(writerOptions);
				}
				this.options = options;
				this.writer = options.writer;
				this.stringify = new XMLStringifier(options);
				this.onDataCallback = onData || function() {};
				this.onEndCallback = onEnd || function() {};
				this.currentNode = null;
				this.currentLevel = -1;
				this.openTags = {};
				this.documentStarted = false;
				this.documentCompleted = false;
				this.root = null;
			}
			XMLDocumentCB.prototype.node = function(name, attributes, text) {
				var ref1, ref2;
				if (name == null) throw new Error("Missing node name.");
				if (this.root && this.currentLevel === -1) throw new Error("Document can only have one root node. " + this.debugInfo(name));
				this.openCurrent();
				name = getValue(name);
				if (attributes === null && text == null) ref1 = [{}, null], attributes = ref1[0], text = ref1[1];
				if (attributes == null) attributes = {};
				attributes = getValue(attributes);
				if (!isObject(attributes)) ref2 = [attributes, text], text = ref2[0], attributes = ref2[1];
				this.currentNode = new XMLElement(this, name, attributes);
				this.currentNode.children = false;
				this.currentLevel++;
				this.openTags[this.currentLevel] = this.currentNode;
				if (text != null) this.text(text);
				return this;
			};
			XMLDocumentCB.prototype.element = function(name, attributes, text) {
				if (this.currentNode && this.currentNode instanceof XMLDocType) return this.dtdElement.apply(this, arguments);
				else return this.node(name, attributes, text);
			};
			XMLDocumentCB.prototype.attribute = function(name, value) {
				var attName, attValue;
				if (!this.currentNode || this.currentNode.children) throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(name));
				if (name != null) name = getValue(name);
				if (isObject(name)) for (attName in name) {
					if (!hasProp.call(name, attName)) continue;
					attValue = name[attName];
					this.attribute(attName, attValue);
				}
				else {
					if (isFunction(value)) value = value.apply();
					if (!this.options.skipNullAttributes || value != null) this.currentNode.attributes[name] = new XMLAttribute(this, name, value);
				}
				return this;
			};
			XMLDocumentCB.prototype.text = function(value) {
				var node;
				this.openCurrent();
				node = new XMLText(this, value);
				this.onData(this.writer.text(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.cdata = function(value) {
				var node;
				this.openCurrent();
				node = new XMLCData(this, value);
				this.onData(this.writer.cdata(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.comment = function(value) {
				var node;
				this.openCurrent();
				node = new XMLComment(this, value);
				this.onData(this.writer.comment(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.raw = function(value) {
				var node;
				this.openCurrent();
				node = new XMLRaw(this, value);
				this.onData(this.writer.raw(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.instruction = function(target, value) {
				var i, insTarget, insValue, len, node;
				this.openCurrent();
				if (target != null) target = getValue(target);
				if (value != null) value = getValue(value);
				if (Array.isArray(target)) for (i = 0, len = target.length; i < len; i++) {
					insTarget = target[i];
					this.instruction(insTarget);
				}
				else if (isObject(target)) for (insTarget in target) {
					if (!hasProp.call(target, insTarget)) continue;
					insValue = target[insTarget];
					this.instruction(insTarget, insValue);
				}
				else {
					if (isFunction(value)) value = value.apply();
					node = new XMLProcessingInstruction(this, target, value);
					this.onData(this.writer.processingInstruction(node, this.currentLevel + 1), this.currentLevel + 1);
				}
				return this;
			};
			XMLDocumentCB.prototype.declaration = function(version, encoding, standalone) {
				var node;
				this.openCurrent();
				if (this.documentStarted) throw new Error("declaration() must be the first node.");
				node = new XMLDeclaration(this, version, encoding, standalone);
				this.onData(this.writer.declaration(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.doctype = function(root, pubID, sysID) {
				this.openCurrent();
				if (root == null) throw new Error("Missing root node name.");
				if (this.root) throw new Error("dtd() must come before the root node.");
				this.currentNode = new XMLDocType(this, pubID, sysID);
				this.currentNode.rootNodeName = root;
				this.currentNode.children = false;
				this.currentLevel++;
				this.openTags[this.currentLevel] = this.currentNode;
				return this;
			};
			XMLDocumentCB.prototype.dtdElement = function(name, value) {
				var node;
				this.openCurrent();
				node = new XMLDTDElement(this, name, value);
				this.onData(this.writer.dtdElement(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
				var node;
				this.openCurrent();
				node = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
				this.onData(this.writer.dtdAttList(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.entity = function(name, value) {
				var node;
				this.openCurrent();
				node = new XMLDTDEntity(this, false, name, value);
				this.onData(this.writer.dtdEntity(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.pEntity = function(name, value) {
				var node;
				this.openCurrent();
				node = new XMLDTDEntity(this, true, name, value);
				this.onData(this.writer.dtdEntity(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.notation = function(name, value) {
				var node;
				this.openCurrent();
				node = new XMLDTDNotation(this, name, value);
				this.onData(this.writer.dtdNotation(node, this.currentLevel + 1), this.currentLevel + 1);
				return this;
			};
			XMLDocumentCB.prototype.up = function() {
				if (this.currentLevel < 0) throw new Error("The document node has no parent.");
				if (this.currentNode) {
					if (this.currentNode.children) this.closeNode(this.currentNode);
					else this.openNode(this.currentNode);
					this.currentNode = null;
				} else this.closeNode(this.openTags[this.currentLevel]);
				delete this.openTags[this.currentLevel];
				this.currentLevel--;
				return this;
			};
			XMLDocumentCB.prototype.end = function() {
				while (this.currentLevel >= 0) this.up();
				return this.onEnd();
			};
			XMLDocumentCB.prototype.openCurrent = function() {
				if (this.currentNode) {
					this.currentNode.children = true;
					return this.openNode(this.currentNode);
				}
			};
			XMLDocumentCB.prototype.openNode = function(node) {
				if (!node.isOpen) {
					if (!this.root && this.currentLevel === 0 && node instanceof XMLElement) this.root = node;
					this.onData(this.writer.openNode(node, this.currentLevel), this.currentLevel);
					return node.isOpen = true;
				}
			};
			XMLDocumentCB.prototype.closeNode = function(node) {
				if (!node.isClosed) {
					this.onData(this.writer.closeNode(node, this.currentLevel), this.currentLevel);
					return node.isClosed = true;
				}
			};
			XMLDocumentCB.prototype.onData = function(chunk, level) {
				this.documentStarted = true;
				return this.onDataCallback(chunk, level + 1);
			};
			XMLDocumentCB.prototype.onEnd = function() {
				this.documentCompleted = true;
				return this.onEndCallback();
			};
			XMLDocumentCB.prototype.debugInfo = function(name) {
				if (name == null) return "";
				else return "node: <" + name + ">";
			};
			XMLDocumentCB.prototype.ele = function() {
				return this.element.apply(this, arguments);
			};
			XMLDocumentCB.prototype.nod = function(name, attributes, text) {
				return this.node(name, attributes, text);
			};
			XMLDocumentCB.prototype.txt = function(value) {
				return this.text(value);
			};
			XMLDocumentCB.prototype.dat = function(value) {
				return this.cdata(value);
			};
			XMLDocumentCB.prototype.com = function(value) {
				return this.comment(value);
			};
			XMLDocumentCB.prototype.ins = function(target, value) {
				return this.instruction(target, value);
			};
			XMLDocumentCB.prototype.dec = function(version, encoding, standalone) {
				return this.declaration(version, encoding, standalone);
			};
			XMLDocumentCB.prototype.dtd = function(root, pubID, sysID) {
				return this.doctype(root, pubID, sysID);
			};
			XMLDocumentCB.prototype.e = function(name, attributes, text) {
				return this.element(name, attributes, text);
			};
			XMLDocumentCB.prototype.n = function(name, attributes, text) {
				return this.node(name, attributes, text);
			};
			XMLDocumentCB.prototype.t = function(value) {
				return this.text(value);
			};
			XMLDocumentCB.prototype.d = function(value) {
				return this.cdata(value);
			};
			XMLDocumentCB.prototype.c = function(value) {
				return this.comment(value);
			};
			XMLDocumentCB.prototype.r = function(value) {
				return this.raw(value);
			};
			XMLDocumentCB.prototype.i = function(target, value) {
				return this.instruction(target, value);
			};
			XMLDocumentCB.prototype.att = function() {
				if (this.currentNode && this.currentNode instanceof XMLDocType) return this.attList.apply(this, arguments);
				else return this.attribute.apply(this, arguments);
			};
			XMLDocumentCB.prototype.a = function() {
				if (this.currentNode && this.currentNode instanceof XMLDocType) return this.attList.apply(this, arguments);
				else return this.attribute.apply(this, arguments);
			};
			XMLDocumentCB.prototype.ent = function(name, value) {
				return this.entity(name, value);
			};
			XMLDocumentCB.prototype.pent = function(name, value) {
				return this.pEntity(name, value);
			};
			XMLDocumentCB.prototype.not = function(name, value) {
				return this.notation(name, value);
			};
			return XMLDocumentCB;
		})();
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/XMLStreamWriter.js
var require_XMLStreamWriter = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLText, XMLWriterBase, extend = function(child, parent) {
			for (var key in parent) if (hasProp.call(parent, key)) child[key] = parent[key];
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}, hasProp = {}.hasOwnProperty;
		XMLDeclaration = require_XMLDeclaration();
		XMLDocType = require_XMLDocType();
		XMLCData = require_XMLCData();
		XMLComment = require_XMLComment();
		XMLElement = require_XMLElement();
		XMLRaw = require_XMLRaw();
		XMLText = require_XMLText();
		XMLProcessingInstruction = require_XMLProcessingInstruction();
		XMLDummy = require_XMLDummy();
		XMLDTDAttList = require_XMLDTDAttList();
		XMLDTDElement = require_XMLDTDElement();
		XMLDTDEntity = require_XMLDTDEntity();
		XMLDTDNotation = require_XMLDTDNotation();
		XMLWriterBase = require_XMLWriterBase();
		module.exports = (function(superClass) {
			extend(XMLStreamWriter, superClass);
			function XMLStreamWriter(stream, options) {
				XMLStreamWriter.__super__.constructor.call(this, options);
				this.stream = stream;
			}
			XMLStreamWriter.prototype.document = function(doc) {
				var child, i, j, len, len1, ref = doc.children, ref1, results;
				for (i = 0, len = ref.length; i < len; i++) {
					child = ref[i];
					child.isLastRootNode = false;
				}
				doc.children[doc.children.length - 1].isLastRootNode = true;
				ref1 = doc.children;
				results = [];
				for (j = 0, len1 = ref1.length; j < len1; j++) {
					child = ref1[j];
					if (child instanceof XMLDummy) continue;
					switch (false) {
						case !(child instanceof XMLDeclaration):
							results.push(this.declaration(child));
							break;
						case !(child instanceof XMLDocType):
							results.push(this.docType(child));
							break;
						case !(child instanceof XMLComment):
							results.push(this.comment(child));
							break;
						case !(child instanceof XMLProcessingInstruction):
							results.push(this.processingInstruction(child));
							break;
						default: results.push(this.element(child));
					}
				}
				return results;
			};
			XMLStreamWriter.prototype.attribute = function(att) {
				return this.stream.write(" " + att.name + "=\"" + att.value + "\"");
			};
			XMLStreamWriter.prototype.cdata = function(node, level) {
				return this.stream.write(this.space(level) + "<![CDATA[" + node.text + "]]>" + this.endline(node));
			};
			XMLStreamWriter.prototype.comment = function(node, level) {
				return this.stream.write(this.space(level) + "<!-- " + node.text + " -->" + this.endline(node));
			};
			XMLStreamWriter.prototype.declaration = function(node, level) {
				this.stream.write(this.space(level));
				this.stream.write("<?xml version=\"" + node.version + "\"");
				if (node.encoding != null) this.stream.write(" encoding=\"" + node.encoding + "\"");
				if (node.standalone != null) this.stream.write(" standalone=\"" + node.standalone + "\"");
				this.stream.write(this.spacebeforeslash + "?>");
				return this.stream.write(this.endline(node));
			};
			XMLStreamWriter.prototype.docType = function(node, level) {
				var child, i, len, ref;
				level || (level = 0);
				this.stream.write(this.space(level));
				this.stream.write("<!DOCTYPE " + node.root().name);
				if (node.pubID && node.sysID) this.stream.write(" PUBLIC \"" + node.pubID + "\" \"" + node.sysID + "\"");
				else if (node.sysID) this.stream.write(" SYSTEM \"" + node.sysID + "\"");
				if (node.children.length > 0) {
					this.stream.write(" [");
					this.stream.write(this.endline(node));
					ref = node.children;
					for (i = 0, len = ref.length; i < len; i++) {
						child = ref[i];
						switch (false) {
							case !(child instanceof XMLDTDAttList):
								this.dtdAttList(child, level + 1);
								break;
							case !(child instanceof XMLDTDElement):
								this.dtdElement(child, level + 1);
								break;
							case !(child instanceof XMLDTDEntity):
								this.dtdEntity(child, level + 1);
								break;
							case !(child instanceof XMLDTDNotation):
								this.dtdNotation(child, level + 1);
								break;
							case !(child instanceof XMLCData):
								this.cdata(child, level + 1);
								break;
							case !(child instanceof XMLComment):
								this.comment(child, level + 1);
								break;
							case !(child instanceof XMLProcessingInstruction):
								this.processingInstruction(child, level + 1);
								break;
							default: throw new Error("Unknown DTD node type: " + child.constructor.name);
						}
					}
					this.stream.write("]");
				}
				this.stream.write(this.spacebeforeslash + ">");
				return this.stream.write(this.endline(node));
			};
			XMLStreamWriter.prototype.element = function(node, level) {
				var att, child, i, len, name, ref, ref1, space;
				level || (level = 0);
				space = this.space(level);
				this.stream.write(space + "<" + node.name);
				ref = node.attributes;
				for (name in ref) {
					if (!hasProp.call(ref, name)) continue;
					att = ref[name];
					this.attribute(att);
				}
				if (node.children.length === 0 || node.children.every(function(e) {
					return e.value === "";
				})) if (this.allowEmpty) this.stream.write("></" + node.name + ">");
				else this.stream.write(this.spacebeforeslash + "/>");
				else if (this.pretty && node.children.length === 1 && node.children[0].value != null) {
					this.stream.write(">");
					this.stream.write(node.children[0].value);
					this.stream.write("</" + node.name + ">");
				} else {
					this.stream.write(">" + this.newline);
					ref1 = node.children;
					for (i = 0, len = ref1.length; i < len; i++) {
						child = ref1[i];
						switch (false) {
							case !(child instanceof XMLCData):
								this.cdata(child, level + 1);
								break;
							case !(child instanceof XMLComment):
								this.comment(child, level + 1);
								break;
							case !(child instanceof XMLElement):
								this.element(child, level + 1);
								break;
							case !(child instanceof XMLRaw):
								this.raw(child, level + 1);
								break;
							case !(child instanceof XMLText):
								this.text(child, level + 1);
								break;
							case !(child instanceof XMLProcessingInstruction):
								this.processingInstruction(child, level + 1);
								break;
							case !(child instanceof XMLDummy): break;
							default: throw new Error("Unknown XML node type: " + child.constructor.name);
						}
					}
					this.stream.write(space + "</" + node.name + ">");
				}
				return this.stream.write(this.endline(node));
			};
			XMLStreamWriter.prototype.processingInstruction = function(node, level) {
				this.stream.write(this.space(level) + "<?" + node.target);
				if (node.value) this.stream.write(" " + node.value);
				return this.stream.write(this.spacebeforeslash + "?>" + this.endline(node));
			};
			XMLStreamWriter.prototype.raw = function(node, level) {
				return this.stream.write(this.space(level) + node.value + this.endline(node));
			};
			XMLStreamWriter.prototype.text = function(node, level) {
				return this.stream.write(this.space(level) + node.value + this.endline(node));
			};
			XMLStreamWriter.prototype.dtdAttList = function(node, level) {
				this.stream.write(this.space(level) + "<!ATTLIST " + node.elementName + " " + node.attributeName + " " + node.attributeType);
				if (node.defaultValueType !== "#DEFAULT") this.stream.write(" " + node.defaultValueType);
				if (node.defaultValue) this.stream.write(" \"" + node.defaultValue + "\"");
				return this.stream.write(this.spacebeforeslash + ">" + this.endline(node));
			};
			XMLStreamWriter.prototype.dtdElement = function(node, level) {
				this.stream.write(this.space(level) + "<!ELEMENT " + node.name + " " + node.value);
				return this.stream.write(this.spacebeforeslash + ">" + this.endline(node));
			};
			XMLStreamWriter.prototype.dtdEntity = function(node, level) {
				this.stream.write(this.space(level) + "<!ENTITY");
				if (node.pe) this.stream.write(" %");
				this.stream.write(" " + node.name);
				if (node.value) this.stream.write(" \"" + node.value + "\"");
				else {
					if (node.pubID && node.sysID) this.stream.write(" PUBLIC \"" + node.pubID + "\" \"" + node.sysID + "\"");
					else if (node.sysID) this.stream.write(" SYSTEM \"" + node.sysID + "\"");
					if (node.nData) this.stream.write(" NDATA " + node.nData);
				}
				return this.stream.write(this.spacebeforeslash + ">" + this.endline(node));
			};
			XMLStreamWriter.prototype.dtdNotation = function(node, level) {
				this.stream.write(this.space(level) + "<!NOTATION " + node.name);
				if (node.pubID && node.sysID) this.stream.write(" PUBLIC \"" + node.pubID + "\" \"" + node.sysID + "\"");
				else if (node.pubID) this.stream.write(" PUBLIC \"" + node.pubID + "\"");
				else if (node.sysID) this.stream.write(" SYSTEM \"" + node.sysID + "\"");
				return this.stream.write(this.spacebeforeslash + ">" + this.endline(node));
			};
			XMLStreamWriter.prototype.endline = function(node) {
				if (!node.isLastRootNode) return this.newline;
				else return "";
			};
			return XMLStreamWriter;
		})(XMLWriterBase);
	}).call(exports);
}));
//#endregion
//#region node_modules/xmlbuilder/lib/index.js
var require_lib$1 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(function() {
		var XMLDocument, XMLDocumentCB, XMLStreamWriter, XMLStringWriter, assign, isFunction, ref = require_Utility();
		assign = ref.assign, isFunction = ref.isFunction;
		XMLDocument = require_XMLDocument();
		XMLDocumentCB = require_XMLDocumentCB();
		XMLStringWriter = require_XMLStringWriter();
		XMLStreamWriter = require_XMLStreamWriter();
		module.exports.create = function(name, xmldec, doctype, options) {
			var doc, root;
			if (name == null) throw new Error("Root element needs a name.");
			options = assign({}, xmldec, doctype, options);
			doc = new XMLDocument(options);
			root = doc.element(name);
			if (!options.headless) {
				doc.declaration(options);
				if (options.pubID != null || options.sysID != null) doc.doctype(options);
			}
			return root;
		};
		module.exports.begin = function(options, onData, onEnd) {
			var ref1;
			if (isFunction(options)) {
				ref1 = [options, onData], onData = ref1[0], onEnd = ref1[1];
				options = {};
			}
			if (onData) return new XMLDocumentCB(options, onData, onEnd);
			else return new XMLDocument(options);
		};
		module.exports.stringWriter = function(options) {
			return new XMLStringWriter(options);
		};
		module.exports.streamWriter = function(stream, options) {
			return new XMLStreamWriter(stream, options);
		};
	}).call(exports);
}));
//#endregion
//#region node_modules/mammoth/lib/xml/writer.js
var require_writer = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	var xmlbuilder = require_lib$1();
	exports.writeString = writeString;
	function writeString(root, namespaces) {
		var uriToPrefix = _.invert(namespaces);
		var nodeWriters = {
			element: writeElement,
			text: writeTextNode
		};
		function writeNode(builder, node) {
			return nodeWriters[node.type](builder, node);
		}
		function writeElement(builder, element) {
			var elementBuilder = builder.element(mapElementName(element.name), element.attributes);
			element.children.forEach(function(child) {
				writeNode(elementBuilder, child);
			});
		}
		function mapElementName(name) {
			var longFormMatch = /^\{(.*)\}(.*)$/.exec(name);
			if (longFormMatch) {
				var prefix = uriToPrefix[longFormMatch[1]];
				return prefix + (prefix === "" ? "" : ":") + longFormMatch[2];
			} else return name;
		}
		function writeDocument(root) {
			var builder = xmlbuilder.create(mapElementName(root.name), {
				version: "1.0",
				encoding: "UTF-8",
				standalone: true
			});
			_.forEach(namespaces, function(uri, prefix) {
				var key = "xmlns" + (prefix === "" ? "" : ":" + prefix);
				builder.attribute(key, uri);
			});
			root.children.forEach(function(child) {
				writeNode(builder, child);
			});
			return builder.end();
		}
		return writeDocument(root);
	}
	function writeTextNode(builder, node) {
		builder.text(node.value);
	}
}));
//#endregion
//#region node_modules/mammoth/lib/xml/index.js
var require_xml = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var nodes = require_nodes();
	exports.Element = nodes.Element;
	exports.element = nodes.element;
	exports.emptyElement = nodes.emptyElement;
	exports.text = nodes.text;
	exports.readString = require_reader().readString;
	exports.writeString = require_writer().writeString;
}));
//#endregion
//#region node_modules/mammoth/lib/docx/office-xml-reader.js
var require_office_xml_reader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	var promises = require_promises();
	var xml = require_xml();
	exports.read = read;
	exports.readXmlFromZipFile = readXmlFromZipFile;
	var xmlNamespaceMap = {
		"http://schemas.openxmlformats.org/wordprocessingml/2006/main": "w",
		"http://schemas.openxmlformats.org/officeDocument/2006/relationships": "r",
		"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing": "wp",
		"http://schemas.openxmlformats.org/drawingml/2006/main": "a",
		"http://schemas.openxmlformats.org/drawingml/2006/picture": "pic",
		"http://purl.oclc.org/ooxml/wordprocessingml/main": "w",
		"http://purl.oclc.org/ooxml/officeDocument/relationships": "r",
		"http://purl.oclc.org/ooxml/drawingml/wordprocessingDrawing": "wp",
		"http://purl.oclc.org/ooxml/drawingml/main": "a",
		"http://purl.oclc.org/ooxml/drawingml/picture": "pic",
		"http://schemas.openxmlformats.org/package/2006/content-types": "content-types",
		"http://schemas.openxmlformats.org/package/2006/relationships": "relationships",
		"http://schemas.openxmlformats.org/markup-compatibility/2006": "mc",
		"urn:schemas-microsoft-com:vml": "v",
		"urn:schemas-microsoft-com:office:word": "office-word",
		"http://schemas.microsoft.com/office/word/2010/wordml": "wordml"
	};
	function read(xmlString) {
		return xml.readString(xmlString, xmlNamespaceMap).then(function(document) {
			return collapseAlternateContent(document)[0];
		});
	}
	function readXmlFromZipFile(docxFile, path) {
		if (docxFile.exists(path)) return docxFile.read(path, "utf-8").then(stripUtf8Bom).then(read);
		else return promises.resolve(null);
	}
	function stripUtf8Bom(xmlString) {
		return xmlString.replace(/^\uFEFF/g, "");
	}
	function collapseAlternateContent(node) {
		if (node.type === "element") if (node.name === "mc:AlternateContent") return node.firstOrEmpty("mc:Fallback").children;
		else {
			node.children = _.flatten(node.children.map(collapseAlternateContent, true));
			return [node];
		}
		else return [node];
	}
}));
//#endregion
//#region node_modules/dingbat-to-unicode/dist/dingbats.js
var require_dingbats = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = [
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "32",
			"Dingbat hex": "20",
			"Unicode dec": "32",
			"Unicode hex": "20"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "33",
			"Dingbat hex": "21",
			"Unicode dec": "33",
			"Unicode hex": "21"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "34",
			"Dingbat hex": "22",
			"Unicode dec": "8704",
			"Unicode hex": "2200"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "35",
			"Dingbat hex": "23",
			"Unicode dec": "35",
			"Unicode hex": "23"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "36",
			"Dingbat hex": "24",
			"Unicode dec": "8707",
			"Unicode hex": "2203"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "37",
			"Dingbat hex": "25",
			"Unicode dec": "37",
			"Unicode hex": "25"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "38",
			"Dingbat hex": "26",
			"Unicode dec": "38",
			"Unicode hex": "26"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "39",
			"Dingbat hex": "27",
			"Unicode dec": "8717",
			"Unicode hex": "220D"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "40",
			"Dingbat hex": "28",
			"Unicode dec": "40",
			"Unicode hex": "28"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "41",
			"Dingbat hex": "29",
			"Unicode dec": "41",
			"Unicode hex": "29"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "42",
			"Dingbat hex": "2A",
			"Unicode dec": "42",
			"Unicode hex": "2A"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "43",
			"Dingbat hex": "2B",
			"Unicode dec": "43",
			"Unicode hex": "2B"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "44",
			"Dingbat hex": "2C",
			"Unicode dec": "44",
			"Unicode hex": "2C"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "45",
			"Dingbat hex": "2D",
			"Unicode dec": "8722",
			"Unicode hex": "2212"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "46",
			"Dingbat hex": "2E",
			"Unicode dec": "46",
			"Unicode hex": "2E"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "47",
			"Dingbat hex": "2F",
			"Unicode dec": "47",
			"Unicode hex": "2F"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "48",
			"Dingbat hex": "30",
			"Unicode dec": "48",
			"Unicode hex": "30"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "49",
			"Dingbat hex": "31",
			"Unicode dec": "49",
			"Unicode hex": "31"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "50",
			"Dingbat hex": "32",
			"Unicode dec": "50",
			"Unicode hex": "32"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "51",
			"Dingbat hex": "33",
			"Unicode dec": "51",
			"Unicode hex": "33"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "52",
			"Dingbat hex": "34",
			"Unicode dec": "52",
			"Unicode hex": "34"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "53",
			"Dingbat hex": "35",
			"Unicode dec": "53",
			"Unicode hex": "35"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "54",
			"Dingbat hex": "36",
			"Unicode dec": "54",
			"Unicode hex": "36"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "55",
			"Dingbat hex": "37",
			"Unicode dec": "55",
			"Unicode hex": "37"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "56",
			"Dingbat hex": "38",
			"Unicode dec": "56",
			"Unicode hex": "38"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "57",
			"Dingbat hex": "39",
			"Unicode dec": "57",
			"Unicode hex": "39"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "58",
			"Dingbat hex": "3A",
			"Unicode dec": "58",
			"Unicode hex": "3A"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "59",
			"Dingbat hex": "3B",
			"Unicode dec": "59",
			"Unicode hex": "3B"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "60",
			"Dingbat hex": "3C",
			"Unicode dec": "60",
			"Unicode hex": "3C"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "61",
			"Dingbat hex": "3D",
			"Unicode dec": "61",
			"Unicode hex": "3D"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "62",
			"Dingbat hex": "3E",
			"Unicode dec": "62",
			"Unicode hex": "3E"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "63",
			"Dingbat hex": "3F",
			"Unicode dec": "63",
			"Unicode hex": "3F"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "64",
			"Dingbat hex": "40",
			"Unicode dec": "8773",
			"Unicode hex": "2245"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "65",
			"Dingbat hex": "41",
			"Unicode dec": "913",
			"Unicode hex": "391"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "66",
			"Dingbat hex": "42",
			"Unicode dec": "914",
			"Unicode hex": "392"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "67",
			"Dingbat hex": "43",
			"Unicode dec": "935",
			"Unicode hex": "3A7"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "68",
			"Dingbat hex": "44",
			"Unicode dec": "916",
			"Unicode hex": "394"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "69",
			"Dingbat hex": "45",
			"Unicode dec": "917",
			"Unicode hex": "395"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "70",
			"Dingbat hex": "46",
			"Unicode dec": "934",
			"Unicode hex": "3A6"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "71",
			"Dingbat hex": "47",
			"Unicode dec": "915",
			"Unicode hex": "393"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "72",
			"Dingbat hex": "48",
			"Unicode dec": "919",
			"Unicode hex": "397"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "73",
			"Dingbat hex": "49",
			"Unicode dec": "921",
			"Unicode hex": "399"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "74",
			"Dingbat hex": "4A",
			"Unicode dec": "977",
			"Unicode hex": "3D1"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "75",
			"Dingbat hex": "4B",
			"Unicode dec": "922",
			"Unicode hex": "39A"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "76",
			"Dingbat hex": "4C",
			"Unicode dec": "923",
			"Unicode hex": "39B"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "77",
			"Dingbat hex": "4D",
			"Unicode dec": "924",
			"Unicode hex": "39C"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "78",
			"Dingbat hex": "4E",
			"Unicode dec": "925",
			"Unicode hex": "39D"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "79",
			"Dingbat hex": "4F",
			"Unicode dec": "927",
			"Unicode hex": "39F"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "80",
			"Dingbat hex": "50",
			"Unicode dec": "928",
			"Unicode hex": "3A0"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "81",
			"Dingbat hex": "51",
			"Unicode dec": "920",
			"Unicode hex": "398"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "82",
			"Dingbat hex": "52",
			"Unicode dec": "929",
			"Unicode hex": "3A1"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "83",
			"Dingbat hex": "53",
			"Unicode dec": "931",
			"Unicode hex": "3A3"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "84",
			"Dingbat hex": "54",
			"Unicode dec": "932",
			"Unicode hex": "3A4"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "85",
			"Dingbat hex": "55",
			"Unicode dec": "933",
			"Unicode hex": "3A5"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "86",
			"Dingbat hex": "56",
			"Unicode dec": "962",
			"Unicode hex": "3C2"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "87",
			"Dingbat hex": "57",
			"Unicode dec": "937",
			"Unicode hex": "3A9"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "88",
			"Dingbat hex": "58",
			"Unicode dec": "926",
			"Unicode hex": "39E"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "89",
			"Dingbat hex": "59",
			"Unicode dec": "936",
			"Unicode hex": "3A8"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "90",
			"Dingbat hex": "5A",
			"Unicode dec": "918",
			"Unicode hex": "396"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "91",
			"Dingbat hex": "5B",
			"Unicode dec": "91",
			"Unicode hex": "5B"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "92",
			"Dingbat hex": "5C",
			"Unicode dec": "8756",
			"Unicode hex": "2234"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "93",
			"Dingbat hex": "5D",
			"Unicode dec": "93",
			"Unicode hex": "5D"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "94",
			"Dingbat hex": "5E",
			"Unicode dec": "8869",
			"Unicode hex": "22A5"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "95",
			"Dingbat hex": "5F",
			"Unicode dec": "95",
			"Unicode hex": "5F"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "96",
			"Dingbat hex": "60",
			"Unicode dec": "8254",
			"Unicode hex": "203E"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "97",
			"Dingbat hex": "61",
			"Unicode dec": "945",
			"Unicode hex": "3B1"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "98",
			"Dingbat hex": "62",
			"Unicode dec": "946",
			"Unicode hex": "3B2"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "99",
			"Dingbat hex": "63",
			"Unicode dec": "967",
			"Unicode hex": "3C7"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "100",
			"Dingbat hex": "64",
			"Unicode dec": "948",
			"Unicode hex": "3B4"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "101",
			"Dingbat hex": "65",
			"Unicode dec": "949",
			"Unicode hex": "3B5"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "102",
			"Dingbat hex": "66",
			"Unicode dec": "966",
			"Unicode hex": "3C6"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "103",
			"Dingbat hex": "67",
			"Unicode dec": "947",
			"Unicode hex": "3B3"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "104",
			"Dingbat hex": "68",
			"Unicode dec": "951",
			"Unicode hex": "3B7"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "105",
			"Dingbat hex": "69",
			"Unicode dec": "953",
			"Unicode hex": "3B9"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "106",
			"Dingbat hex": "6A",
			"Unicode dec": "981",
			"Unicode hex": "3D5"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "107",
			"Dingbat hex": "6B",
			"Unicode dec": "954",
			"Unicode hex": "3BA"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "108",
			"Dingbat hex": "6C",
			"Unicode dec": "955",
			"Unicode hex": "3BB"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "109",
			"Dingbat hex": "6D",
			"Unicode dec": "956",
			"Unicode hex": "3BC"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "110",
			"Dingbat hex": "6E",
			"Unicode dec": "957",
			"Unicode hex": "3BD"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "111",
			"Dingbat hex": "6F",
			"Unicode dec": "959",
			"Unicode hex": "3BF"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "112",
			"Dingbat hex": "70",
			"Unicode dec": "960",
			"Unicode hex": "3C0"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "113",
			"Dingbat hex": "71",
			"Unicode dec": "952",
			"Unicode hex": "3B8"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "114",
			"Dingbat hex": "72",
			"Unicode dec": "961",
			"Unicode hex": "3C1"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "115",
			"Dingbat hex": "73",
			"Unicode dec": "963",
			"Unicode hex": "3C3"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "116",
			"Dingbat hex": "74",
			"Unicode dec": "964",
			"Unicode hex": "3C4"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "117",
			"Dingbat hex": "75",
			"Unicode dec": "965",
			"Unicode hex": "3C5"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "118",
			"Dingbat hex": "76",
			"Unicode dec": "982",
			"Unicode hex": "3D6"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "119",
			"Dingbat hex": "77",
			"Unicode dec": "969",
			"Unicode hex": "3C9"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "120",
			"Dingbat hex": "78",
			"Unicode dec": "958",
			"Unicode hex": "3BE"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "121",
			"Dingbat hex": "79",
			"Unicode dec": "968",
			"Unicode hex": "3C8"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "122",
			"Dingbat hex": "7A",
			"Unicode dec": "950",
			"Unicode hex": "3B6"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "123",
			"Dingbat hex": "7B",
			"Unicode dec": "123",
			"Unicode hex": "7B"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "124",
			"Dingbat hex": "7C",
			"Unicode dec": "124",
			"Unicode hex": "7C"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "125",
			"Dingbat hex": "7D",
			"Unicode dec": "125",
			"Unicode hex": "7D"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "126",
			"Dingbat hex": "7E",
			"Unicode dec": "126",
			"Unicode hex": "7E"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "160",
			"Dingbat hex": "A0",
			"Unicode dec": "8364",
			"Unicode hex": "20AC"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "161",
			"Dingbat hex": "A1",
			"Unicode dec": "978",
			"Unicode hex": "3D2"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "162",
			"Dingbat hex": "A2",
			"Unicode dec": "8242",
			"Unicode hex": "2032"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "163",
			"Dingbat hex": "A3",
			"Unicode dec": "8804",
			"Unicode hex": "2264"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "164",
			"Dingbat hex": "A4",
			"Unicode dec": "8260",
			"Unicode hex": "2044"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "165",
			"Dingbat hex": "A5",
			"Unicode dec": "8734",
			"Unicode hex": "221E"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "166",
			"Dingbat hex": "A6",
			"Unicode dec": "402",
			"Unicode hex": "192"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "167",
			"Dingbat hex": "A7",
			"Unicode dec": "9827",
			"Unicode hex": "2663"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "168",
			"Dingbat hex": "A8",
			"Unicode dec": "9830",
			"Unicode hex": "2666"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "169",
			"Dingbat hex": "A9",
			"Unicode dec": "9829",
			"Unicode hex": "2665"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "170",
			"Dingbat hex": "AA",
			"Unicode dec": "9824",
			"Unicode hex": "2660"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "171",
			"Dingbat hex": "AB",
			"Unicode dec": "8596",
			"Unicode hex": "2194"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "172",
			"Dingbat hex": "AC",
			"Unicode dec": "8592",
			"Unicode hex": "2190"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "173",
			"Dingbat hex": "AD",
			"Unicode dec": "8593",
			"Unicode hex": "2191"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "174",
			"Dingbat hex": "AE",
			"Unicode dec": "8594",
			"Unicode hex": "2192"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "175",
			"Dingbat hex": "AF",
			"Unicode dec": "8595",
			"Unicode hex": "2193"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "176",
			"Dingbat hex": "B0",
			"Unicode dec": "176",
			"Unicode hex": "B0"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "177",
			"Dingbat hex": "B1",
			"Unicode dec": "177",
			"Unicode hex": "B1"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "178",
			"Dingbat hex": "B2",
			"Unicode dec": "8243",
			"Unicode hex": "2033"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "179",
			"Dingbat hex": "B3",
			"Unicode dec": "8805",
			"Unicode hex": "2265"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "180",
			"Dingbat hex": "B4",
			"Unicode dec": "215",
			"Unicode hex": "D7"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "181",
			"Dingbat hex": "B5",
			"Unicode dec": "8733",
			"Unicode hex": "221D"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "182",
			"Dingbat hex": "B6",
			"Unicode dec": "8706",
			"Unicode hex": "2202"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "183",
			"Dingbat hex": "B7",
			"Unicode dec": "8226",
			"Unicode hex": "2022"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "184",
			"Dingbat hex": "B8",
			"Unicode dec": "247",
			"Unicode hex": "F7"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "185",
			"Dingbat hex": "B9",
			"Unicode dec": "8800",
			"Unicode hex": "2260"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "186",
			"Dingbat hex": "BA",
			"Unicode dec": "8801",
			"Unicode hex": "2261"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "187",
			"Dingbat hex": "BB",
			"Unicode dec": "8776",
			"Unicode hex": "2248"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "188",
			"Dingbat hex": "BC",
			"Unicode dec": "8230",
			"Unicode hex": "2026"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "189",
			"Dingbat hex": "BD",
			"Unicode dec": "9168",
			"Unicode hex": "23D0"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "190",
			"Dingbat hex": "BE",
			"Unicode dec": "9135",
			"Unicode hex": "23AF"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "191",
			"Dingbat hex": "BF",
			"Unicode dec": "8629",
			"Unicode hex": "21B5"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "192",
			"Dingbat hex": "C0",
			"Unicode dec": "8501",
			"Unicode hex": "2135"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "193",
			"Dingbat hex": "C1",
			"Unicode dec": "8465",
			"Unicode hex": "2111"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "194",
			"Dingbat hex": "C2",
			"Unicode dec": "8476",
			"Unicode hex": "211C"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "195",
			"Dingbat hex": "C3",
			"Unicode dec": "8472",
			"Unicode hex": "2118"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "196",
			"Dingbat hex": "C4",
			"Unicode dec": "8855",
			"Unicode hex": "2297"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "197",
			"Dingbat hex": "C5",
			"Unicode dec": "8853",
			"Unicode hex": "2295"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "198",
			"Dingbat hex": "C6",
			"Unicode dec": "8709",
			"Unicode hex": "2205"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "199",
			"Dingbat hex": "C7",
			"Unicode dec": "8745",
			"Unicode hex": "2229"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "200",
			"Dingbat hex": "C8",
			"Unicode dec": "8746",
			"Unicode hex": "222A"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "201",
			"Dingbat hex": "C9",
			"Unicode dec": "8835",
			"Unicode hex": "2283"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "202",
			"Dingbat hex": "CA",
			"Unicode dec": "8839",
			"Unicode hex": "2287"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "203",
			"Dingbat hex": "CB",
			"Unicode dec": "8836",
			"Unicode hex": "2284"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "204",
			"Dingbat hex": "CC",
			"Unicode dec": "8834",
			"Unicode hex": "2282"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "205",
			"Dingbat hex": "CD",
			"Unicode dec": "8838",
			"Unicode hex": "2286"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "206",
			"Dingbat hex": "CE",
			"Unicode dec": "8712",
			"Unicode hex": "2208"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "207",
			"Dingbat hex": "CF",
			"Unicode dec": "8713",
			"Unicode hex": "2209"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "208",
			"Dingbat hex": "D0",
			"Unicode dec": "8736",
			"Unicode hex": "2220"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "209",
			"Dingbat hex": "D1",
			"Unicode dec": "8711",
			"Unicode hex": "2207"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "210",
			"Dingbat hex": "D2",
			"Unicode dec": "174",
			"Unicode hex": "AE"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "211",
			"Dingbat hex": "D3",
			"Unicode dec": "169",
			"Unicode hex": "A9"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "212",
			"Dingbat hex": "D4",
			"Unicode dec": "8482",
			"Unicode hex": "2122"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "213",
			"Dingbat hex": "D5",
			"Unicode dec": "8719",
			"Unicode hex": "220F"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "214",
			"Dingbat hex": "D6",
			"Unicode dec": "8730",
			"Unicode hex": "221A"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "215",
			"Dingbat hex": "D7",
			"Unicode dec": "8901",
			"Unicode hex": "22C5"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "216",
			"Dingbat hex": "D8",
			"Unicode dec": "172",
			"Unicode hex": "AC"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "217",
			"Dingbat hex": "D9",
			"Unicode dec": "8743",
			"Unicode hex": "2227"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "218",
			"Dingbat hex": "DA",
			"Unicode dec": "8744",
			"Unicode hex": "2228"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "219",
			"Dingbat hex": "DB",
			"Unicode dec": "8660",
			"Unicode hex": "21D4"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "220",
			"Dingbat hex": "DC",
			"Unicode dec": "8656",
			"Unicode hex": "21D0"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "221",
			"Dingbat hex": "DD",
			"Unicode dec": "8657",
			"Unicode hex": "21D1"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "222",
			"Dingbat hex": "DE",
			"Unicode dec": "8658",
			"Unicode hex": "21D2"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "223",
			"Dingbat hex": "DF",
			"Unicode dec": "8659",
			"Unicode hex": "21D3"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "224",
			"Dingbat hex": "E0",
			"Unicode dec": "9674",
			"Unicode hex": "25CA"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "225",
			"Dingbat hex": "E1",
			"Unicode dec": "12296",
			"Unicode hex": "3008"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "226",
			"Dingbat hex": "E2",
			"Unicode dec": "174",
			"Unicode hex": "AE"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "227",
			"Dingbat hex": "E3",
			"Unicode dec": "169",
			"Unicode hex": "A9"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "228",
			"Dingbat hex": "E4",
			"Unicode dec": "8482",
			"Unicode hex": "2122"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "229",
			"Dingbat hex": "E5",
			"Unicode dec": "8721",
			"Unicode hex": "2211"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "230",
			"Dingbat hex": "E6",
			"Unicode dec": "9115",
			"Unicode hex": "239B"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "231",
			"Dingbat hex": "E7",
			"Unicode dec": "9116",
			"Unicode hex": "239C"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "232",
			"Dingbat hex": "E8",
			"Unicode dec": "9117",
			"Unicode hex": "239D"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "233",
			"Dingbat hex": "E9",
			"Unicode dec": "9121",
			"Unicode hex": "23A1"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "234",
			"Dingbat hex": "EA",
			"Unicode dec": "9122",
			"Unicode hex": "23A2"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "235",
			"Dingbat hex": "EB",
			"Unicode dec": "9123",
			"Unicode hex": "23A3"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "236",
			"Dingbat hex": "EC",
			"Unicode dec": "9127",
			"Unicode hex": "23A7"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "237",
			"Dingbat hex": "ED",
			"Unicode dec": "9128",
			"Unicode hex": "23A8"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "238",
			"Dingbat hex": "EE",
			"Unicode dec": "9129",
			"Unicode hex": "23A9"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "239",
			"Dingbat hex": "EF",
			"Unicode dec": "9130",
			"Unicode hex": "23AA"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "240",
			"Dingbat hex": "F0",
			"Unicode dec": "63743",
			"Unicode hex": "F8FF"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "241",
			"Dingbat hex": "F1",
			"Unicode dec": "12297",
			"Unicode hex": "3009"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "242",
			"Dingbat hex": "F2",
			"Unicode dec": "8747",
			"Unicode hex": "222B"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "243",
			"Dingbat hex": "F3",
			"Unicode dec": "8992",
			"Unicode hex": "2320"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "244",
			"Dingbat hex": "F4",
			"Unicode dec": "9134",
			"Unicode hex": "23AE"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "245",
			"Dingbat hex": "F5",
			"Unicode dec": "8993",
			"Unicode hex": "2321"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "246",
			"Dingbat hex": "F6",
			"Unicode dec": "9118",
			"Unicode hex": "239E"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "247",
			"Dingbat hex": "F7",
			"Unicode dec": "9119",
			"Unicode hex": "239F"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "248",
			"Dingbat hex": "F8",
			"Unicode dec": "9120",
			"Unicode hex": "23A0"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "249",
			"Dingbat hex": "F9",
			"Unicode dec": "9124",
			"Unicode hex": "23A4"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "250",
			"Dingbat hex": "FA",
			"Unicode dec": "9125",
			"Unicode hex": "23A5"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "251",
			"Dingbat hex": "FB",
			"Unicode dec": "9126",
			"Unicode hex": "23A6"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "252",
			"Dingbat hex": "FC",
			"Unicode dec": "9131",
			"Unicode hex": "23AB"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "253",
			"Dingbat hex": "FD",
			"Unicode dec": "9132",
			"Unicode hex": "23AC"
		},
		{
			"Typeface name": "Symbol",
			"Dingbat dec": "254",
			"Dingbat hex": "FE",
			"Unicode dec": "9133",
			"Unicode hex": "23AD"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "32",
			"Dingbat hex": "20",
			"Unicode dec": "32",
			"Unicode hex": "20"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "33",
			"Dingbat hex": "21",
			"Unicode dec": "128375",
			"Unicode hex": "1F577"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "34",
			"Dingbat hex": "22",
			"Unicode dec": "128376",
			"Unicode hex": "1F578"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "35",
			"Dingbat hex": "23",
			"Unicode dec": "128370",
			"Unicode hex": "1F572"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "36",
			"Dingbat hex": "24",
			"Unicode dec": "128374",
			"Unicode hex": "1F576"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "37",
			"Dingbat hex": "25",
			"Unicode dec": "127942",
			"Unicode hex": "1F3C6"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "38",
			"Dingbat hex": "26",
			"Unicode dec": "127894",
			"Unicode hex": "1F396"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "39",
			"Dingbat hex": "27",
			"Unicode dec": "128391",
			"Unicode hex": "1F587"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "40",
			"Dingbat hex": "28",
			"Unicode dec": "128488",
			"Unicode hex": "1F5E8"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "41",
			"Dingbat hex": "29",
			"Unicode dec": "128489",
			"Unicode hex": "1F5E9"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "42",
			"Dingbat hex": "2A",
			"Unicode dec": "128496",
			"Unicode hex": "1F5F0"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "43",
			"Dingbat hex": "2B",
			"Unicode dec": "128497",
			"Unicode hex": "1F5F1"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "44",
			"Dingbat hex": "2C",
			"Unicode dec": "127798",
			"Unicode hex": "1F336"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "45",
			"Dingbat hex": "2D",
			"Unicode dec": "127895",
			"Unicode hex": "1F397"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "46",
			"Dingbat hex": "2E",
			"Unicode dec": "128638",
			"Unicode hex": "1F67E"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "47",
			"Dingbat hex": "2F",
			"Unicode dec": "128636",
			"Unicode hex": "1F67C"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "48",
			"Dingbat hex": "30",
			"Unicode dec": "128469",
			"Unicode hex": "1F5D5"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "49",
			"Dingbat hex": "31",
			"Unicode dec": "128470",
			"Unicode hex": "1F5D6"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "50",
			"Dingbat hex": "32",
			"Unicode dec": "128471",
			"Unicode hex": "1F5D7"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "51",
			"Dingbat hex": "33",
			"Unicode dec": "9204",
			"Unicode hex": "23F4"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "52",
			"Dingbat hex": "34",
			"Unicode dec": "9205",
			"Unicode hex": "23F5"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "53",
			"Dingbat hex": "35",
			"Unicode dec": "9206",
			"Unicode hex": "23F6"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "54",
			"Dingbat hex": "36",
			"Unicode dec": "9207",
			"Unicode hex": "23F7"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "55",
			"Dingbat hex": "37",
			"Unicode dec": "9194",
			"Unicode hex": "23EA"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "56",
			"Dingbat hex": "38",
			"Unicode dec": "9193",
			"Unicode hex": "23E9"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "57",
			"Dingbat hex": "39",
			"Unicode dec": "9198",
			"Unicode hex": "23EE"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "58",
			"Dingbat hex": "3A",
			"Unicode dec": "9197",
			"Unicode hex": "23ED"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "59",
			"Dingbat hex": "3B",
			"Unicode dec": "9208",
			"Unicode hex": "23F8"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "60",
			"Dingbat hex": "3C",
			"Unicode dec": "9209",
			"Unicode hex": "23F9"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "61",
			"Dingbat hex": "3D",
			"Unicode dec": "9210",
			"Unicode hex": "23FA"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "62",
			"Dingbat hex": "3E",
			"Unicode dec": "128474",
			"Unicode hex": "1F5DA"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "63",
			"Dingbat hex": "3F",
			"Unicode dec": "128499",
			"Unicode hex": "1F5F3"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "64",
			"Dingbat hex": "40",
			"Unicode dec": "128736",
			"Unicode hex": "1F6E0"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "65",
			"Dingbat hex": "41",
			"Unicode dec": "127959",
			"Unicode hex": "1F3D7"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "66",
			"Dingbat hex": "42",
			"Unicode dec": "127960",
			"Unicode hex": "1F3D8"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "67",
			"Dingbat hex": "43",
			"Unicode dec": "127961",
			"Unicode hex": "1F3D9"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "68",
			"Dingbat hex": "44",
			"Unicode dec": "127962",
			"Unicode hex": "1F3DA"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "69",
			"Dingbat hex": "45",
			"Unicode dec": "127964",
			"Unicode hex": "1F3DC"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "70",
			"Dingbat hex": "46",
			"Unicode dec": "127981",
			"Unicode hex": "1F3ED"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "71",
			"Dingbat hex": "47",
			"Unicode dec": "127963",
			"Unicode hex": "1F3DB"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "72",
			"Dingbat hex": "48",
			"Unicode dec": "127968",
			"Unicode hex": "1F3E0"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "73",
			"Dingbat hex": "49",
			"Unicode dec": "127958",
			"Unicode hex": "1F3D6"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "74",
			"Dingbat hex": "4A",
			"Unicode dec": "127965",
			"Unicode hex": "1F3DD"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "75",
			"Dingbat hex": "4B",
			"Unicode dec": "128739",
			"Unicode hex": "1F6E3"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "76",
			"Dingbat hex": "4C",
			"Unicode dec": "128269",
			"Unicode hex": "1F50D"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "77",
			"Dingbat hex": "4D",
			"Unicode dec": "127956",
			"Unicode hex": "1F3D4"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "78",
			"Dingbat hex": "4E",
			"Unicode dec": "128065",
			"Unicode hex": "1F441"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "79",
			"Dingbat hex": "4F",
			"Unicode dec": "128066",
			"Unicode hex": "1F442"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "80",
			"Dingbat hex": "50",
			"Unicode dec": "127966",
			"Unicode hex": "1F3DE"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "81",
			"Dingbat hex": "51",
			"Unicode dec": "127957",
			"Unicode hex": "1F3D5"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "82",
			"Dingbat hex": "52",
			"Unicode dec": "128740",
			"Unicode hex": "1F6E4"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "83",
			"Dingbat hex": "53",
			"Unicode dec": "127967",
			"Unicode hex": "1F3DF"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "84",
			"Dingbat hex": "54",
			"Unicode dec": "128755",
			"Unicode hex": "1F6F3"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "85",
			"Dingbat hex": "55",
			"Unicode dec": "128364",
			"Unicode hex": "1F56C"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "86",
			"Dingbat hex": "56",
			"Unicode dec": "128363",
			"Unicode hex": "1F56B"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "87",
			"Dingbat hex": "57",
			"Unicode dec": "128360",
			"Unicode hex": "1F568"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "88",
			"Dingbat hex": "58",
			"Unicode dec": "128264",
			"Unicode hex": "1F508"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "89",
			"Dingbat hex": "59",
			"Unicode dec": "127892",
			"Unicode hex": "1F394"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "90",
			"Dingbat hex": "5A",
			"Unicode dec": "127893",
			"Unicode hex": "1F395"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "91",
			"Dingbat hex": "5B",
			"Unicode dec": "128492",
			"Unicode hex": "1F5EC"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "92",
			"Dingbat hex": "5C",
			"Unicode dec": "128637",
			"Unicode hex": "1F67D"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "93",
			"Dingbat hex": "5D",
			"Unicode dec": "128493",
			"Unicode hex": "1F5ED"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "94",
			"Dingbat hex": "5E",
			"Unicode dec": "128490",
			"Unicode hex": "1F5EA"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "95",
			"Dingbat hex": "5F",
			"Unicode dec": "128491",
			"Unicode hex": "1F5EB"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "96",
			"Dingbat hex": "60",
			"Unicode dec": "11156",
			"Unicode hex": "2B94"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "97",
			"Dingbat hex": "61",
			"Unicode dec": "10004",
			"Unicode hex": "2714"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "98",
			"Dingbat hex": "62",
			"Unicode dec": "128690",
			"Unicode hex": "1F6B2"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "99",
			"Dingbat hex": "63",
			"Unicode dec": "11036",
			"Unicode hex": "2B1C"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "100",
			"Dingbat hex": "64",
			"Unicode dec": "128737",
			"Unicode hex": "1F6E1"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "101",
			"Dingbat hex": "65",
			"Unicode dec": "128230",
			"Unicode hex": "1F4E6"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "102",
			"Dingbat hex": "66",
			"Unicode dec": "128753",
			"Unicode hex": "1F6F1"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "103",
			"Dingbat hex": "67",
			"Unicode dec": "11035",
			"Unicode hex": "2B1B"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "104",
			"Dingbat hex": "68",
			"Unicode dec": "128657",
			"Unicode hex": "1F691"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "105",
			"Dingbat hex": "69",
			"Unicode dec": "128712",
			"Unicode hex": "1F6C8"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "106",
			"Dingbat hex": "6A",
			"Unicode dec": "128745",
			"Unicode hex": "1F6E9"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "107",
			"Dingbat hex": "6B",
			"Unicode dec": "128752",
			"Unicode hex": "1F6F0"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "108",
			"Dingbat hex": "6C",
			"Unicode dec": "128968",
			"Unicode hex": "1F7C8"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "109",
			"Dingbat hex": "6D",
			"Unicode dec": "128372",
			"Unicode hex": "1F574"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "110",
			"Dingbat hex": "6E",
			"Unicode dec": "11044",
			"Unicode hex": "2B24"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "111",
			"Dingbat hex": "6F",
			"Unicode dec": "128741",
			"Unicode hex": "1F6E5"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "112",
			"Dingbat hex": "70",
			"Unicode dec": "128660",
			"Unicode hex": "1F694"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "113",
			"Dingbat hex": "71",
			"Unicode dec": "128472",
			"Unicode hex": "1F5D8"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "114",
			"Dingbat hex": "72",
			"Unicode dec": "128473",
			"Unicode hex": "1F5D9"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "115",
			"Dingbat hex": "73",
			"Unicode dec": "10067",
			"Unicode hex": "2753"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "116",
			"Dingbat hex": "74",
			"Unicode dec": "128754",
			"Unicode hex": "1F6F2"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "117",
			"Dingbat hex": "75",
			"Unicode dec": "128647",
			"Unicode hex": "1F687"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "118",
			"Dingbat hex": "76",
			"Unicode dec": "128653",
			"Unicode hex": "1F68D"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "119",
			"Dingbat hex": "77",
			"Unicode dec": "9971",
			"Unicode hex": "26F3"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "120",
			"Dingbat hex": "78",
			"Unicode dec": "10680",
			"Unicode hex": "29B8"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "121",
			"Dingbat hex": "79",
			"Unicode dec": "8854",
			"Unicode hex": "2296"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "122",
			"Dingbat hex": "7A",
			"Unicode dec": "128685",
			"Unicode hex": "1F6AD"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "123",
			"Dingbat hex": "7B",
			"Unicode dec": "128494",
			"Unicode hex": "1F5EE"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "124",
			"Dingbat hex": "7C",
			"Unicode dec": "9168",
			"Unicode hex": "23D0"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "125",
			"Dingbat hex": "7D",
			"Unicode dec": "128495",
			"Unicode hex": "1F5EF"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "126",
			"Dingbat hex": "7E",
			"Unicode dec": "128498",
			"Unicode hex": "1F5F2"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "128",
			"Dingbat hex": "80",
			"Unicode dec": "128697",
			"Unicode hex": "1F6B9"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "129",
			"Dingbat hex": "81",
			"Unicode dec": "128698",
			"Unicode hex": "1F6BA"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "130",
			"Dingbat hex": "82",
			"Unicode dec": "128713",
			"Unicode hex": "1F6C9"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "131",
			"Dingbat hex": "83",
			"Unicode dec": "128714",
			"Unicode hex": "1F6CA"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "132",
			"Dingbat hex": "84",
			"Unicode dec": "128700",
			"Unicode hex": "1F6BC"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "133",
			"Dingbat hex": "85",
			"Unicode dec": "128125",
			"Unicode hex": "1F47D"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "134",
			"Dingbat hex": "86",
			"Unicode dec": "127947",
			"Unicode hex": "1F3CB"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "135",
			"Dingbat hex": "87",
			"Unicode dec": "9975",
			"Unicode hex": "26F7"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "136",
			"Dingbat hex": "88",
			"Unicode dec": "127938",
			"Unicode hex": "1F3C2"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "137",
			"Dingbat hex": "89",
			"Unicode dec": "127948",
			"Unicode hex": "1F3CC"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "138",
			"Dingbat hex": "8A",
			"Unicode dec": "127946",
			"Unicode hex": "1F3CA"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "139",
			"Dingbat hex": "8B",
			"Unicode dec": "127940",
			"Unicode hex": "1F3C4"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "140",
			"Dingbat hex": "8C",
			"Unicode dec": "127949",
			"Unicode hex": "1F3CD"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "141",
			"Dingbat hex": "8D",
			"Unicode dec": "127950",
			"Unicode hex": "1F3CE"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "142",
			"Dingbat hex": "8E",
			"Unicode dec": "128664",
			"Unicode hex": "1F698"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "143",
			"Dingbat hex": "8F",
			"Unicode dec": "128480",
			"Unicode hex": "1F5E0"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "144",
			"Dingbat hex": "90",
			"Unicode dec": "128738",
			"Unicode hex": "1F6E2"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "145",
			"Dingbat hex": "91",
			"Unicode dec": "128176",
			"Unicode hex": "1F4B0"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "146",
			"Dingbat hex": "92",
			"Unicode dec": "127991",
			"Unicode hex": "1F3F7"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "147",
			"Dingbat hex": "93",
			"Unicode dec": "128179",
			"Unicode hex": "1F4B3"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "148",
			"Dingbat hex": "94",
			"Unicode dec": "128106",
			"Unicode hex": "1F46A"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "149",
			"Dingbat hex": "95",
			"Unicode dec": "128481",
			"Unicode hex": "1F5E1"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "150",
			"Dingbat hex": "96",
			"Unicode dec": "128482",
			"Unicode hex": "1F5E2"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "151",
			"Dingbat hex": "97",
			"Unicode dec": "128483",
			"Unicode hex": "1F5E3"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "152",
			"Dingbat hex": "98",
			"Unicode dec": "10031",
			"Unicode hex": "272F"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "153",
			"Dingbat hex": "99",
			"Unicode dec": "128388",
			"Unicode hex": "1F584"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "154",
			"Dingbat hex": "9A",
			"Unicode dec": "128389",
			"Unicode hex": "1F585"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "155",
			"Dingbat hex": "9B",
			"Unicode dec": "128387",
			"Unicode hex": "1F583"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "156",
			"Dingbat hex": "9C",
			"Unicode dec": "128390",
			"Unicode hex": "1F586"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "157",
			"Dingbat hex": "9D",
			"Unicode dec": "128441",
			"Unicode hex": "1F5B9"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "158",
			"Dingbat hex": "9E",
			"Unicode dec": "128442",
			"Unicode hex": "1F5BA"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "159",
			"Dingbat hex": "9F",
			"Unicode dec": "128443",
			"Unicode hex": "1F5BB"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "160",
			"Dingbat hex": "A0",
			"Unicode dec": "128373",
			"Unicode hex": "1F575"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "161",
			"Dingbat hex": "A1",
			"Unicode dec": "128368",
			"Unicode hex": "1F570"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "162",
			"Dingbat hex": "A2",
			"Unicode dec": "128445",
			"Unicode hex": "1F5BD"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "163",
			"Dingbat hex": "A3",
			"Unicode dec": "128446",
			"Unicode hex": "1F5BE"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "164",
			"Dingbat hex": "A4",
			"Unicode dec": "128203",
			"Unicode hex": "1F4CB"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "165",
			"Dingbat hex": "A5",
			"Unicode dec": "128466",
			"Unicode hex": "1F5D2"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "166",
			"Dingbat hex": "A6",
			"Unicode dec": "128467",
			"Unicode hex": "1F5D3"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "167",
			"Dingbat hex": "A7",
			"Unicode dec": "128366",
			"Unicode hex": "1F56E"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "168",
			"Dingbat hex": "A8",
			"Unicode dec": "128218",
			"Unicode hex": "1F4DA"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "169",
			"Dingbat hex": "A9",
			"Unicode dec": "128478",
			"Unicode hex": "1F5DE"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "170",
			"Dingbat hex": "AA",
			"Unicode dec": "128479",
			"Unicode hex": "1F5DF"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "171",
			"Dingbat hex": "AB",
			"Unicode dec": "128451",
			"Unicode hex": "1F5C3"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "172",
			"Dingbat hex": "AC",
			"Unicode dec": "128450",
			"Unicode hex": "1F5C2"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "173",
			"Dingbat hex": "AD",
			"Unicode dec": "128444",
			"Unicode hex": "1F5BC"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "174",
			"Dingbat hex": "AE",
			"Unicode dec": "127917",
			"Unicode hex": "1F3AD"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "175",
			"Dingbat hex": "AF",
			"Unicode dec": "127900",
			"Unicode hex": "1F39C"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "176",
			"Dingbat hex": "B0",
			"Unicode dec": "127896",
			"Unicode hex": "1F398"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "177",
			"Dingbat hex": "B1",
			"Unicode dec": "127897",
			"Unicode hex": "1F399"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "178",
			"Dingbat hex": "B2",
			"Unicode dec": "127911",
			"Unicode hex": "1F3A7"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "179",
			"Dingbat hex": "B3",
			"Unicode dec": "128191",
			"Unicode hex": "1F4BF"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "180",
			"Dingbat hex": "B4",
			"Unicode dec": "127902",
			"Unicode hex": "1F39E"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "181",
			"Dingbat hex": "B5",
			"Unicode dec": "128247",
			"Unicode hex": "1F4F7"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "182",
			"Dingbat hex": "B6",
			"Unicode dec": "127903",
			"Unicode hex": "1F39F"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "183",
			"Dingbat hex": "B7",
			"Unicode dec": "127916",
			"Unicode hex": "1F3AC"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "184",
			"Dingbat hex": "B8",
			"Unicode dec": "128253",
			"Unicode hex": "1F4FD"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "185",
			"Dingbat hex": "B9",
			"Unicode dec": "128249",
			"Unicode hex": "1F4F9"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "186",
			"Dingbat hex": "BA",
			"Unicode dec": "128254",
			"Unicode hex": "1F4FE"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "187",
			"Dingbat hex": "BB",
			"Unicode dec": "128251",
			"Unicode hex": "1F4FB"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "188",
			"Dingbat hex": "BC",
			"Unicode dec": "127898",
			"Unicode hex": "1F39A"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "189",
			"Dingbat hex": "BD",
			"Unicode dec": "127899",
			"Unicode hex": "1F39B"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "190",
			"Dingbat hex": "BE",
			"Unicode dec": "128250",
			"Unicode hex": "1F4FA"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "191",
			"Dingbat hex": "BF",
			"Unicode dec": "128187",
			"Unicode hex": "1F4BB"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "192",
			"Dingbat hex": "C0",
			"Unicode dec": "128421",
			"Unicode hex": "1F5A5"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "193",
			"Dingbat hex": "C1",
			"Unicode dec": "128422",
			"Unicode hex": "1F5A6"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "194",
			"Dingbat hex": "C2",
			"Unicode dec": "128423",
			"Unicode hex": "1F5A7"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "195",
			"Dingbat hex": "C3",
			"Unicode dec": "128377",
			"Unicode hex": "1F579"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "196",
			"Dingbat hex": "C4",
			"Unicode dec": "127918",
			"Unicode hex": "1F3AE"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "197",
			"Dingbat hex": "C5",
			"Unicode dec": "128379",
			"Unicode hex": "1F57B"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "198",
			"Dingbat hex": "C6",
			"Unicode dec": "128380",
			"Unicode hex": "1F57C"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "199",
			"Dingbat hex": "C7",
			"Unicode dec": "128223",
			"Unicode hex": "1F4DF"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "200",
			"Dingbat hex": "C8",
			"Unicode dec": "128385",
			"Unicode hex": "1F581"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "201",
			"Dingbat hex": "C9",
			"Unicode dec": "128384",
			"Unicode hex": "1F580"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "202",
			"Dingbat hex": "CA",
			"Unicode dec": "128424",
			"Unicode hex": "1F5A8"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "203",
			"Dingbat hex": "CB",
			"Unicode dec": "128425",
			"Unicode hex": "1F5A9"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "204",
			"Dingbat hex": "CC",
			"Unicode dec": "128447",
			"Unicode hex": "1F5BF"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "205",
			"Dingbat hex": "CD",
			"Unicode dec": "128426",
			"Unicode hex": "1F5AA"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "206",
			"Dingbat hex": "CE",
			"Unicode dec": "128476",
			"Unicode hex": "1F5DC"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "207",
			"Dingbat hex": "CF",
			"Unicode dec": "128274",
			"Unicode hex": "1F512"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "208",
			"Dingbat hex": "D0",
			"Unicode dec": "128275",
			"Unicode hex": "1F513"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "209",
			"Dingbat hex": "D1",
			"Unicode dec": "128477",
			"Unicode hex": "1F5DD"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "210",
			"Dingbat hex": "D2",
			"Unicode dec": "128229",
			"Unicode hex": "1F4E5"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "211",
			"Dingbat hex": "D3",
			"Unicode dec": "128228",
			"Unicode hex": "1F4E4"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "212",
			"Dingbat hex": "D4",
			"Unicode dec": "128371",
			"Unicode hex": "1F573"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "213",
			"Dingbat hex": "D5",
			"Unicode dec": "127779",
			"Unicode hex": "1F323"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "214",
			"Dingbat hex": "D6",
			"Unicode dec": "127780",
			"Unicode hex": "1F324"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "215",
			"Dingbat hex": "D7",
			"Unicode dec": "127781",
			"Unicode hex": "1F325"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "216",
			"Dingbat hex": "D8",
			"Unicode dec": "127782",
			"Unicode hex": "1F326"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "217",
			"Dingbat hex": "D9",
			"Unicode dec": "9729",
			"Unicode hex": "2601"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "218",
			"Dingbat hex": "DA",
			"Unicode dec": "127784",
			"Unicode hex": "1F328"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "219",
			"Dingbat hex": "DB",
			"Unicode dec": "127783",
			"Unicode hex": "1F327"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "220",
			"Dingbat hex": "DC",
			"Unicode dec": "127785",
			"Unicode hex": "1F329"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "221",
			"Dingbat hex": "DD",
			"Unicode dec": "127786",
			"Unicode hex": "1F32A"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "222",
			"Dingbat hex": "DE",
			"Unicode dec": "127788",
			"Unicode hex": "1F32C"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "223",
			"Dingbat hex": "DF",
			"Unicode dec": "127787",
			"Unicode hex": "1F32B"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "224",
			"Dingbat hex": "E0",
			"Unicode dec": "127772",
			"Unicode hex": "1F31C"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "225",
			"Dingbat hex": "E1",
			"Unicode dec": "127777",
			"Unicode hex": "1F321"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "226",
			"Dingbat hex": "E2",
			"Unicode dec": "128715",
			"Unicode hex": "1F6CB"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "227",
			"Dingbat hex": "E3",
			"Unicode dec": "128719",
			"Unicode hex": "1F6CF"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "228",
			"Dingbat hex": "E4",
			"Unicode dec": "127869",
			"Unicode hex": "1F37D"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "229",
			"Dingbat hex": "E5",
			"Unicode dec": "127864",
			"Unicode hex": "1F378"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "230",
			"Dingbat hex": "E6",
			"Unicode dec": "128718",
			"Unicode hex": "1F6CE"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "231",
			"Dingbat hex": "E7",
			"Unicode dec": "128717",
			"Unicode hex": "1F6CD"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "232",
			"Dingbat hex": "E8",
			"Unicode dec": "9413",
			"Unicode hex": "24C5"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "233",
			"Dingbat hex": "E9",
			"Unicode dec": "9855",
			"Unicode hex": "267F"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "234",
			"Dingbat hex": "EA",
			"Unicode dec": "128710",
			"Unicode hex": "1F6C6"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "235",
			"Dingbat hex": "EB",
			"Unicode dec": "128392",
			"Unicode hex": "1F588"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "236",
			"Dingbat hex": "EC",
			"Unicode dec": "127891",
			"Unicode hex": "1F393"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "237",
			"Dingbat hex": "ED",
			"Unicode dec": "128484",
			"Unicode hex": "1F5E4"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "238",
			"Dingbat hex": "EE",
			"Unicode dec": "128485",
			"Unicode hex": "1F5E5"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "239",
			"Dingbat hex": "EF",
			"Unicode dec": "128486",
			"Unicode hex": "1F5E6"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "240",
			"Dingbat hex": "F0",
			"Unicode dec": "128487",
			"Unicode hex": "1F5E7"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "241",
			"Dingbat hex": "F1",
			"Unicode dec": "128746",
			"Unicode hex": "1F6EA"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "242",
			"Dingbat hex": "F2",
			"Unicode dec": "128063",
			"Unicode hex": "1F43F"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "243",
			"Dingbat hex": "F3",
			"Unicode dec": "128038",
			"Unicode hex": "1F426"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "244",
			"Dingbat hex": "F4",
			"Unicode dec": "128031",
			"Unicode hex": "1F41F"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "245",
			"Dingbat hex": "F5",
			"Unicode dec": "128021",
			"Unicode hex": "1F415"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "246",
			"Dingbat hex": "F6",
			"Unicode dec": "128008",
			"Unicode hex": "1F408"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "247",
			"Dingbat hex": "F7",
			"Unicode dec": "128620",
			"Unicode hex": "1F66C"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "248",
			"Dingbat hex": "F8",
			"Unicode dec": "128622",
			"Unicode hex": "1F66E"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "249",
			"Dingbat hex": "F9",
			"Unicode dec": "128621",
			"Unicode hex": "1F66D"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "250",
			"Dingbat hex": "FA",
			"Unicode dec": "128623",
			"Unicode hex": "1F66F"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "251",
			"Dingbat hex": "FB",
			"Unicode dec": "128506",
			"Unicode hex": "1F5FA"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "252",
			"Dingbat hex": "FC",
			"Unicode dec": "127757",
			"Unicode hex": "1F30D"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "253",
			"Dingbat hex": "FD",
			"Unicode dec": "127759",
			"Unicode hex": "1F30F"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "254",
			"Dingbat hex": "FE",
			"Unicode dec": "127758",
			"Unicode hex": "1F30E"
		},
		{
			"Typeface name": "Webdings",
			"Dingbat dec": "255",
			"Dingbat hex": "FF",
			"Unicode dec": "128330",
			"Unicode hex": "1F54A"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "32",
			"Dingbat hex": "20",
			"Unicode dec": "32",
			"Unicode hex": "20"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "33",
			"Dingbat hex": "21",
			"Unicode dec": "128393",
			"Unicode hex": "1F589"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "34",
			"Dingbat hex": "22",
			"Unicode dec": "9986",
			"Unicode hex": "2702"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "35",
			"Dingbat hex": "23",
			"Unicode dec": "9985",
			"Unicode hex": "2701"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "36",
			"Dingbat hex": "24",
			"Unicode dec": "128083",
			"Unicode hex": "1F453"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "37",
			"Dingbat hex": "25",
			"Unicode dec": "128365",
			"Unicode hex": "1F56D"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "38",
			"Dingbat hex": "26",
			"Unicode dec": "128366",
			"Unicode hex": "1F56E"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "39",
			"Dingbat hex": "27",
			"Unicode dec": "128367",
			"Unicode hex": "1F56F"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "40",
			"Dingbat hex": "28",
			"Unicode dec": "128383",
			"Unicode hex": "1F57F"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "41",
			"Dingbat hex": "29",
			"Unicode dec": "9990",
			"Unicode hex": "2706"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "42",
			"Dingbat hex": "2A",
			"Unicode dec": "128386",
			"Unicode hex": "1F582"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "43",
			"Dingbat hex": "2B",
			"Unicode dec": "128387",
			"Unicode hex": "1F583"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "44",
			"Dingbat hex": "2C",
			"Unicode dec": "128234",
			"Unicode hex": "1F4EA"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "45",
			"Dingbat hex": "2D",
			"Unicode dec": "128235",
			"Unicode hex": "1F4EB"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "46",
			"Dingbat hex": "2E",
			"Unicode dec": "128236",
			"Unicode hex": "1F4EC"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "47",
			"Dingbat hex": "2F",
			"Unicode dec": "128237",
			"Unicode hex": "1F4ED"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "48",
			"Dingbat hex": "30",
			"Unicode dec": "128448",
			"Unicode hex": "1F5C0"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "49",
			"Dingbat hex": "31",
			"Unicode dec": "128449",
			"Unicode hex": "1F5C1"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "50",
			"Dingbat hex": "32",
			"Unicode dec": "128462",
			"Unicode hex": "1F5CE"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "51",
			"Dingbat hex": "33",
			"Unicode dec": "128463",
			"Unicode hex": "1F5CF"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "52",
			"Dingbat hex": "34",
			"Unicode dec": "128464",
			"Unicode hex": "1F5D0"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "53",
			"Dingbat hex": "35",
			"Unicode dec": "128452",
			"Unicode hex": "1F5C4"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "54",
			"Dingbat hex": "36",
			"Unicode dec": "8987",
			"Unicode hex": "231B"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "55",
			"Dingbat hex": "37",
			"Unicode dec": "128430",
			"Unicode hex": "1F5AE"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "56",
			"Dingbat hex": "38",
			"Unicode dec": "128432",
			"Unicode hex": "1F5B0"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "57",
			"Dingbat hex": "39",
			"Unicode dec": "128434",
			"Unicode hex": "1F5B2"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "58",
			"Dingbat hex": "3A",
			"Unicode dec": "128435",
			"Unicode hex": "1F5B3"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "59",
			"Dingbat hex": "3B",
			"Unicode dec": "128436",
			"Unicode hex": "1F5B4"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "60",
			"Dingbat hex": "3C",
			"Unicode dec": "128427",
			"Unicode hex": "1F5AB"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "61",
			"Dingbat hex": "3D",
			"Unicode dec": "128428",
			"Unicode hex": "1F5AC"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "62",
			"Dingbat hex": "3E",
			"Unicode dec": "9991",
			"Unicode hex": "2707"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "63",
			"Dingbat hex": "3F",
			"Unicode dec": "9997",
			"Unicode hex": "270D"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "64",
			"Dingbat hex": "40",
			"Unicode dec": "128398",
			"Unicode hex": "1F58E"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "65",
			"Dingbat hex": "41",
			"Unicode dec": "9996",
			"Unicode hex": "270C"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "66",
			"Dingbat hex": "42",
			"Unicode dec": "128399",
			"Unicode hex": "1F58F"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "67",
			"Dingbat hex": "43",
			"Unicode dec": "128077",
			"Unicode hex": "1F44D"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "68",
			"Dingbat hex": "44",
			"Unicode dec": "128078",
			"Unicode hex": "1F44E"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "69",
			"Dingbat hex": "45",
			"Unicode dec": "9756",
			"Unicode hex": "261C"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "70",
			"Dingbat hex": "46",
			"Unicode dec": "9758",
			"Unicode hex": "261E"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "71",
			"Dingbat hex": "47",
			"Unicode dec": "9757",
			"Unicode hex": "261D"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "72",
			"Dingbat hex": "48",
			"Unicode dec": "9759",
			"Unicode hex": "261F"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "73",
			"Dingbat hex": "49",
			"Unicode dec": "128400",
			"Unicode hex": "1F590"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "74",
			"Dingbat hex": "4A",
			"Unicode dec": "9786",
			"Unicode hex": "263A"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "75",
			"Dingbat hex": "4B",
			"Unicode dec": "128528",
			"Unicode hex": "1F610"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "76",
			"Dingbat hex": "4C",
			"Unicode dec": "9785",
			"Unicode hex": "2639"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "77",
			"Dingbat hex": "4D",
			"Unicode dec": "128163",
			"Unicode hex": "1F4A3"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "78",
			"Dingbat hex": "4E",
			"Unicode dec": "128369",
			"Unicode hex": "1F571"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "79",
			"Dingbat hex": "4F",
			"Unicode dec": "127987",
			"Unicode hex": "1F3F3"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "80",
			"Dingbat hex": "50",
			"Unicode dec": "127985",
			"Unicode hex": "1F3F1"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "81",
			"Dingbat hex": "51",
			"Unicode dec": "9992",
			"Unicode hex": "2708"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "82",
			"Dingbat hex": "52",
			"Unicode dec": "9788",
			"Unicode hex": "263C"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "83",
			"Dingbat hex": "53",
			"Unicode dec": "127778",
			"Unicode hex": "1F322"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "84",
			"Dingbat hex": "54",
			"Unicode dec": "10052",
			"Unicode hex": "2744"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "85",
			"Dingbat hex": "55",
			"Unicode dec": "128326",
			"Unicode hex": "1F546"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "86",
			"Dingbat hex": "56",
			"Unicode dec": "10014",
			"Unicode hex": "271E"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "87",
			"Dingbat hex": "57",
			"Unicode dec": "128328",
			"Unicode hex": "1F548"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "88",
			"Dingbat hex": "58",
			"Unicode dec": "10016",
			"Unicode hex": "2720"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "89",
			"Dingbat hex": "59",
			"Unicode dec": "10017",
			"Unicode hex": "2721"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "90",
			"Dingbat hex": "5A",
			"Unicode dec": "9770",
			"Unicode hex": "262A"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "91",
			"Dingbat hex": "5B",
			"Unicode dec": "9775",
			"Unicode hex": "262F"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "92",
			"Dingbat hex": "5C",
			"Unicode dec": "128329",
			"Unicode hex": "1F549"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "93",
			"Dingbat hex": "5D",
			"Unicode dec": "9784",
			"Unicode hex": "2638"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "94",
			"Dingbat hex": "5E",
			"Unicode dec": "9800",
			"Unicode hex": "2648"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "95",
			"Dingbat hex": "5F",
			"Unicode dec": "9801",
			"Unicode hex": "2649"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "96",
			"Dingbat hex": "60",
			"Unicode dec": "9802",
			"Unicode hex": "264A"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "97",
			"Dingbat hex": "61",
			"Unicode dec": "9803",
			"Unicode hex": "264B"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "98",
			"Dingbat hex": "62",
			"Unicode dec": "9804",
			"Unicode hex": "264C"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "99",
			"Dingbat hex": "63",
			"Unicode dec": "9805",
			"Unicode hex": "264D"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "100",
			"Dingbat hex": "64",
			"Unicode dec": "9806",
			"Unicode hex": "264E"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "101",
			"Dingbat hex": "65",
			"Unicode dec": "9807",
			"Unicode hex": "264F"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "102",
			"Dingbat hex": "66",
			"Unicode dec": "9808",
			"Unicode hex": "2650"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "103",
			"Dingbat hex": "67",
			"Unicode dec": "9809",
			"Unicode hex": "2651"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "104",
			"Dingbat hex": "68",
			"Unicode dec": "9810",
			"Unicode hex": "2652"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "105",
			"Dingbat hex": "69",
			"Unicode dec": "9811",
			"Unicode hex": "2653"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "106",
			"Dingbat hex": "6A",
			"Unicode dec": "128624",
			"Unicode hex": "1F670"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "107",
			"Dingbat hex": "6B",
			"Unicode dec": "128629",
			"Unicode hex": "1F675"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "108",
			"Dingbat hex": "6C",
			"Unicode dec": "9899",
			"Unicode hex": "26AB"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "109",
			"Dingbat hex": "6D",
			"Unicode dec": "128318",
			"Unicode hex": "1F53E"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "110",
			"Dingbat hex": "6E",
			"Unicode dec": "9724",
			"Unicode hex": "25FC"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "111",
			"Dingbat hex": "6F",
			"Unicode dec": "128911",
			"Unicode hex": "1F78F"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "112",
			"Dingbat hex": "70",
			"Unicode dec": "128912",
			"Unicode hex": "1F790"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "113",
			"Dingbat hex": "71",
			"Unicode dec": "10065",
			"Unicode hex": "2751"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "114",
			"Dingbat hex": "72",
			"Unicode dec": "10066",
			"Unicode hex": "2752"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "115",
			"Dingbat hex": "73",
			"Unicode dec": "128927",
			"Unicode hex": "1F79F"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "116",
			"Dingbat hex": "74",
			"Unicode dec": "10731",
			"Unicode hex": "29EB"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "117",
			"Dingbat hex": "75",
			"Unicode dec": "9670",
			"Unicode hex": "25C6"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "118",
			"Dingbat hex": "76",
			"Unicode dec": "10070",
			"Unicode hex": "2756"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "119",
			"Dingbat hex": "77",
			"Unicode dec": "11049",
			"Unicode hex": "2B29"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "120",
			"Dingbat hex": "78",
			"Unicode dec": "8999",
			"Unicode hex": "2327"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "121",
			"Dingbat hex": "79",
			"Unicode dec": "11193",
			"Unicode hex": "2BB9"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "122",
			"Dingbat hex": "7A",
			"Unicode dec": "8984",
			"Unicode hex": "2318"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "123",
			"Dingbat hex": "7B",
			"Unicode dec": "127989",
			"Unicode hex": "1F3F5"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "124",
			"Dingbat hex": "7C",
			"Unicode dec": "127990",
			"Unicode hex": "1F3F6"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "125",
			"Dingbat hex": "7D",
			"Unicode dec": "128630",
			"Unicode hex": "1F676"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "126",
			"Dingbat hex": "7E",
			"Unicode dec": "128631",
			"Unicode hex": "1F677"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "127",
			"Dingbat hex": "7F",
			"Unicode dec": "9647",
			"Unicode hex": "25AF"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "128",
			"Dingbat hex": "80",
			"Unicode dec": "127243",
			"Unicode hex": "1F10B"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "129",
			"Dingbat hex": "81",
			"Unicode dec": "10112",
			"Unicode hex": "2780"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "130",
			"Dingbat hex": "82",
			"Unicode dec": "10113",
			"Unicode hex": "2781"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "131",
			"Dingbat hex": "83",
			"Unicode dec": "10114",
			"Unicode hex": "2782"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "132",
			"Dingbat hex": "84",
			"Unicode dec": "10115",
			"Unicode hex": "2783"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "133",
			"Dingbat hex": "85",
			"Unicode dec": "10116",
			"Unicode hex": "2784"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "134",
			"Dingbat hex": "86",
			"Unicode dec": "10117",
			"Unicode hex": "2785"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "135",
			"Dingbat hex": "87",
			"Unicode dec": "10118",
			"Unicode hex": "2786"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "136",
			"Dingbat hex": "88",
			"Unicode dec": "10119",
			"Unicode hex": "2787"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "137",
			"Dingbat hex": "89",
			"Unicode dec": "10120",
			"Unicode hex": "2788"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "138",
			"Dingbat hex": "8A",
			"Unicode dec": "10121",
			"Unicode hex": "2789"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "139",
			"Dingbat hex": "8B",
			"Unicode dec": "127244",
			"Unicode hex": "1F10C"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "140",
			"Dingbat hex": "8C",
			"Unicode dec": "10122",
			"Unicode hex": "278A"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "141",
			"Dingbat hex": "8D",
			"Unicode dec": "10123",
			"Unicode hex": "278B"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "142",
			"Dingbat hex": "8E",
			"Unicode dec": "10124",
			"Unicode hex": "278C"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "143",
			"Dingbat hex": "8F",
			"Unicode dec": "10125",
			"Unicode hex": "278D"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "144",
			"Dingbat hex": "90",
			"Unicode dec": "10126",
			"Unicode hex": "278E"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "145",
			"Dingbat hex": "91",
			"Unicode dec": "10127",
			"Unicode hex": "278F"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "146",
			"Dingbat hex": "92",
			"Unicode dec": "10128",
			"Unicode hex": "2790"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "147",
			"Dingbat hex": "93",
			"Unicode dec": "10129",
			"Unicode hex": "2791"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "148",
			"Dingbat hex": "94",
			"Unicode dec": "10130",
			"Unicode hex": "2792"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "149",
			"Dingbat hex": "95",
			"Unicode dec": "10131",
			"Unicode hex": "2793"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "150",
			"Dingbat hex": "96",
			"Unicode dec": "128610",
			"Unicode hex": "1F662"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "151",
			"Dingbat hex": "97",
			"Unicode dec": "128608",
			"Unicode hex": "1F660"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "152",
			"Dingbat hex": "98",
			"Unicode dec": "128609",
			"Unicode hex": "1F661"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "153",
			"Dingbat hex": "99",
			"Unicode dec": "128611",
			"Unicode hex": "1F663"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "154",
			"Dingbat hex": "9A",
			"Unicode dec": "128606",
			"Unicode hex": "1F65E"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "155",
			"Dingbat hex": "9B",
			"Unicode dec": "128604",
			"Unicode hex": "1F65C"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "156",
			"Dingbat hex": "9C",
			"Unicode dec": "128605",
			"Unicode hex": "1F65D"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "157",
			"Dingbat hex": "9D",
			"Unicode dec": "128607",
			"Unicode hex": "1F65F"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "158",
			"Dingbat hex": "9E",
			"Unicode dec": "8729",
			"Unicode hex": "2219"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "159",
			"Dingbat hex": "9F",
			"Unicode dec": "8226",
			"Unicode hex": "2022"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "160",
			"Dingbat hex": "A0",
			"Unicode dec": "11037",
			"Unicode hex": "2B1D"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "161",
			"Dingbat hex": "A1",
			"Unicode dec": "11096",
			"Unicode hex": "2B58"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "162",
			"Dingbat hex": "A2",
			"Unicode dec": "128902",
			"Unicode hex": "1F786"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "163",
			"Dingbat hex": "A3",
			"Unicode dec": "128904",
			"Unicode hex": "1F788"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "164",
			"Dingbat hex": "A4",
			"Unicode dec": "128906",
			"Unicode hex": "1F78A"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "165",
			"Dingbat hex": "A5",
			"Unicode dec": "128907",
			"Unicode hex": "1F78B"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "166",
			"Dingbat hex": "A6",
			"Unicode dec": "128319",
			"Unicode hex": "1F53F"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "167",
			"Dingbat hex": "A7",
			"Unicode dec": "9642",
			"Unicode hex": "25AA"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "168",
			"Dingbat hex": "A8",
			"Unicode dec": "128910",
			"Unicode hex": "1F78E"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "169",
			"Dingbat hex": "A9",
			"Unicode dec": "128961",
			"Unicode hex": "1F7C1"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "170",
			"Dingbat hex": "AA",
			"Unicode dec": "128965",
			"Unicode hex": "1F7C5"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "171",
			"Dingbat hex": "AB",
			"Unicode dec": "9733",
			"Unicode hex": "2605"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "172",
			"Dingbat hex": "AC",
			"Unicode dec": "128971",
			"Unicode hex": "1F7CB"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "173",
			"Dingbat hex": "AD",
			"Unicode dec": "128975",
			"Unicode hex": "1F7CF"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "174",
			"Dingbat hex": "AE",
			"Unicode dec": "128979",
			"Unicode hex": "1F7D3"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "175",
			"Dingbat hex": "AF",
			"Unicode dec": "128977",
			"Unicode hex": "1F7D1"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "176",
			"Dingbat hex": "B0",
			"Unicode dec": "11216",
			"Unicode hex": "2BD0"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "177",
			"Dingbat hex": "B1",
			"Unicode dec": "8982",
			"Unicode hex": "2316"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "178",
			"Dingbat hex": "B2",
			"Unicode dec": "11214",
			"Unicode hex": "2BCE"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "179",
			"Dingbat hex": "B3",
			"Unicode dec": "11215",
			"Unicode hex": "2BCF"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "180",
			"Dingbat hex": "B4",
			"Unicode dec": "11217",
			"Unicode hex": "2BD1"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "181",
			"Dingbat hex": "B5",
			"Unicode dec": "10026",
			"Unicode hex": "272A"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "182",
			"Dingbat hex": "B6",
			"Unicode dec": "10032",
			"Unicode hex": "2730"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "183",
			"Dingbat hex": "B7",
			"Unicode dec": "128336",
			"Unicode hex": "1F550"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "184",
			"Dingbat hex": "B8",
			"Unicode dec": "128337",
			"Unicode hex": "1F551"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "185",
			"Dingbat hex": "B9",
			"Unicode dec": "128338",
			"Unicode hex": "1F552"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "186",
			"Dingbat hex": "BA",
			"Unicode dec": "128339",
			"Unicode hex": "1F553"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "187",
			"Dingbat hex": "BB",
			"Unicode dec": "128340",
			"Unicode hex": "1F554"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "188",
			"Dingbat hex": "BC",
			"Unicode dec": "128341",
			"Unicode hex": "1F555"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "189",
			"Dingbat hex": "BD",
			"Unicode dec": "128342",
			"Unicode hex": "1F556"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "190",
			"Dingbat hex": "BE",
			"Unicode dec": "128343",
			"Unicode hex": "1F557"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "191",
			"Dingbat hex": "BF",
			"Unicode dec": "128344",
			"Unicode hex": "1F558"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "192",
			"Dingbat hex": "C0",
			"Unicode dec": "128345",
			"Unicode hex": "1F559"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "193",
			"Dingbat hex": "C1",
			"Unicode dec": "128346",
			"Unicode hex": "1F55A"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "194",
			"Dingbat hex": "C2",
			"Unicode dec": "128347",
			"Unicode hex": "1F55B"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "195",
			"Dingbat hex": "C3",
			"Unicode dec": "11184",
			"Unicode hex": "2BB0"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "196",
			"Dingbat hex": "C4",
			"Unicode dec": "11185",
			"Unicode hex": "2BB1"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "197",
			"Dingbat hex": "C5",
			"Unicode dec": "11186",
			"Unicode hex": "2BB2"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "198",
			"Dingbat hex": "C6",
			"Unicode dec": "11187",
			"Unicode hex": "2BB3"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "199",
			"Dingbat hex": "C7",
			"Unicode dec": "11188",
			"Unicode hex": "2BB4"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "200",
			"Dingbat hex": "C8",
			"Unicode dec": "11189",
			"Unicode hex": "2BB5"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "201",
			"Dingbat hex": "C9",
			"Unicode dec": "11190",
			"Unicode hex": "2BB6"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "202",
			"Dingbat hex": "CA",
			"Unicode dec": "11191",
			"Unicode hex": "2BB7"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "203",
			"Dingbat hex": "CB",
			"Unicode dec": "128618",
			"Unicode hex": "1F66A"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "204",
			"Dingbat hex": "CC",
			"Unicode dec": "128619",
			"Unicode hex": "1F66B"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "205",
			"Dingbat hex": "CD",
			"Unicode dec": "128597",
			"Unicode hex": "1F655"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "206",
			"Dingbat hex": "CE",
			"Unicode dec": "128596",
			"Unicode hex": "1F654"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "207",
			"Dingbat hex": "CF",
			"Unicode dec": "128599",
			"Unicode hex": "1F657"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "208",
			"Dingbat hex": "D0",
			"Unicode dec": "128598",
			"Unicode hex": "1F656"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "209",
			"Dingbat hex": "D1",
			"Unicode dec": "128592",
			"Unicode hex": "1F650"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "210",
			"Dingbat hex": "D2",
			"Unicode dec": "128593",
			"Unicode hex": "1F651"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "211",
			"Dingbat hex": "D3",
			"Unicode dec": "128594",
			"Unicode hex": "1F652"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "212",
			"Dingbat hex": "D4",
			"Unicode dec": "128595",
			"Unicode hex": "1F653"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "213",
			"Dingbat hex": "D5",
			"Unicode dec": "9003",
			"Unicode hex": "232B"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "214",
			"Dingbat hex": "D6",
			"Unicode dec": "8998",
			"Unicode hex": "2326"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "215",
			"Dingbat hex": "D7",
			"Unicode dec": "11160",
			"Unicode hex": "2B98"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "216",
			"Dingbat hex": "D8",
			"Unicode dec": "11162",
			"Unicode hex": "2B9A"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "217",
			"Dingbat hex": "D9",
			"Unicode dec": "11161",
			"Unicode hex": "2B99"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "218",
			"Dingbat hex": "DA",
			"Unicode dec": "11163",
			"Unicode hex": "2B9B"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "219",
			"Dingbat hex": "DB",
			"Unicode dec": "11144",
			"Unicode hex": "2B88"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "220",
			"Dingbat hex": "DC",
			"Unicode dec": "11146",
			"Unicode hex": "2B8A"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "221",
			"Dingbat hex": "DD",
			"Unicode dec": "11145",
			"Unicode hex": "2B89"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "222",
			"Dingbat hex": "DE",
			"Unicode dec": "11147",
			"Unicode hex": "2B8B"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "223",
			"Dingbat hex": "DF",
			"Unicode dec": "129128",
			"Unicode hex": "1F868"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "224",
			"Dingbat hex": "E0",
			"Unicode dec": "129130",
			"Unicode hex": "1F86A"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "225",
			"Dingbat hex": "E1",
			"Unicode dec": "129129",
			"Unicode hex": "1F869"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "226",
			"Dingbat hex": "E2",
			"Unicode dec": "129131",
			"Unicode hex": "1F86B"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "227",
			"Dingbat hex": "E3",
			"Unicode dec": "129132",
			"Unicode hex": "1F86C"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "228",
			"Dingbat hex": "E4",
			"Unicode dec": "129133",
			"Unicode hex": "1F86D"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "229",
			"Dingbat hex": "E5",
			"Unicode dec": "129135",
			"Unicode hex": "1F86F"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "230",
			"Dingbat hex": "E6",
			"Unicode dec": "129134",
			"Unicode hex": "1F86E"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "231",
			"Dingbat hex": "E7",
			"Unicode dec": "129144",
			"Unicode hex": "1F878"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "232",
			"Dingbat hex": "E8",
			"Unicode dec": "129146",
			"Unicode hex": "1F87A"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "233",
			"Dingbat hex": "E9",
			"Unicode dec": "129145",
			"Unicode hex": "1F879"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "234",
			"Dingbat hex": "EA",
			"Unicode dec": "129147",
			"Unicode hex": "1F87B"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "235",
			"Dingbat hex": "EB",
			"Unicode dec": "129148",
			"Unicode hex": "1F87C"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "236",
			"Dingbat hex": "EC",
			"Unicode dec": "129149",
			"Unicode hex": "1F87D"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "237",
			"Dingbat hex": "ED",
			"Unicode dec": "129151",
			"Unicode hex": "1F87F"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "238",
			"Dingbat hex": "EE",
			"Unicode dec": "129150",
			"Unicode hex": "1F87E"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "239",
			"Dingbat hex": "EF",
			"Unicode dec": "8678",
			"Unicode hex": "21E6"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "240",
			"Dingbat hex": "F0",
			"Unicode dec": "8680",
			"Unicode hex": "21E8"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "241",
			"Dingbat hex": "F1",
			"Unicode dec": "8679",
			"Unicode hex": "21E7"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "242",
			"Dingbat hex": "F2",
			"Unicode dec": "8681",
			"Unicode hex": "21E9"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "243",
			"Dingbat hex": "F3",
			"Unicode dec": "11012",
			"Unicode hex": "2B04"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "244",
			"Dingbat hex": "F4",
			"Unicode dec": "8691",
			"Unicode hex": "21F3"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "245",
			"Dingbat hex": "F5",
			"Unicode dec": "11009",
			"Unicode hex": "2B01"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "246",
			"Dingbat hex": "F6",
			"Unicode dec": "11008",
			"Unicode hex": "2B00"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "247",
			"Dingbat hex": "F7",
			"Unicode dec": "11011",
			"Unicode hex": "2B03"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "248",
			"Dingbat hex": "F8",
			"Unicode dec": "11010",
			"Unicode hex": "2B02"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "249",
			"Dingbat hex": "F9",
			"Unicode dec": "129196",
			"Unicode hex": "1F8AC"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "250",
			"Dingbat hex": "FA",
			"Unicode dec": "129197",
			"Unicode hex": "1F8AD"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "251",
			"Dingbat hex": "FB",
			"Unicode dec": "128502",
			"Unicode hex": "1F5F6"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "252",
			"Dingbat hex": "FC",
			"Unicode dec": "10003",
			"Unicode hex": "2713"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "253",
			"Dingbat hex": "FD",
			"Unicode dec": "128503",
			"Unicode hex": "1F5F7"
		},
		{
			"Typeface name": "Wingdings",
			"Dingbat dec": "254",
			"Dingbat hex": "FE",
			"Unicode dec": "128505",
			"Unicode hex": "1F5F9"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "32",
			"Dingbat hex": "20",
			"Unicode dec": "32",
			"Unicode hex": "20"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "33",
			"Dingbat hex": "21",
			"Unicode dec": "128394",
			"Unicode hex": "1F58A"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "34",
			"Dingbat hex": "22",
			"Unicode dec": "128395",
			"Unicode hex": "1F58B"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "35",
			"Dingbat hex": "23",
			"Unicode dec": "128396",
			"Unicode hex": "1F58C"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "36",
			"Dingbat hex": "24",
			"Unicode dec": "128397",
			"Unicode hex": "1F58D"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "37",
			"Dingbat hex": "25",
			"Unicode dec": "9988",
			"Unicode hex": "2704"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "38",
			"Dingbat hex": "26",
			"Unicode dec": "9984",
			"Unicode hex": "2700"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "39",
			"Dingbat hex": "27",
			"Unicode dec": "128382",
			"Unicode hex": "1F57E"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "40",
			"Dingbat hex": "28",
			"Unicode dec": "128381",
			"Unicode hex": "1F57D"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "41",
			"Dingbat hex": "29",
			"Unicode dec": "128453",
			"Unicode hex": "1F5C5"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "42",
			"Dingbat hex": "2A",
			"Unicode dec": "128454",
			"Unicode hex": "1F5C6"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "43",
			"Dingbat hex": "2B",
			"Unicode dec": "128455",
			"Unicode hex": "1F5C7"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "44",
			"Dingbat hex": "2C",
			"Unicode dec": "128456",
			"Unicode hex": "1F5C8"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "45",
			"Dingbat hex": "2D",
			"Unicode dec": "128457",
			"Unicode hex": "1F5C9"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "46",
			"Dingbat hex": "2E",
			"Unicode dec": "128458",
			"Unicode hex": "1F5CA"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "47",
			"Dingbat hex": "2F",
			"Unicode dec": "128459",
			"Unicode hex": "1F5CB"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "48",
			"Dingbat hex": "30",
			"Unicode dec": "128460",
			"Unicode hex": "1F5CC"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "49",
			"Dingbat hex": "31",
			"Unicode dec": "128461",
			"Unicode hex": "1F5CD"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "50",
			"Dingbat hex": "32",
			"Unicode dec": "128203",
			"Unicode hex": "1F4CB"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "51",
			"Dingbat hex": "33",
			"Unicode dec": "128465",
			"Unicode hex": "1F5D1"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "52",
			"Dingbat hex": "34",
			"Unicode dec": "128468",
			"Unicode hex": "1F5D4"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "53",
			"Dingbat hex": "35",
			"Unicode dec": "128437",
			"Unicode hex": "1F5B5"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "54",
			"Dingbat hex": "36",
			"Unicode dec": "128438",
			"Unicode hex": "1F5B6"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "55",
			"Dingbat hex": "37",
			"Unicode dec": "128439",
			"Unicode hex": "1F5B7"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "56",
			"Dingbat hex": "38",
			"Unicode dec": "128440",
			"Unicode hex": "1F5B8"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "57",
			"Dingbat hex": "39",
			"Unicode dec": "128429",
			"Unicode hex": "1F5AD"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "58",
			"Dingbat hex": "3A",
			"Unicode dec": "128431",
			"Unicode hex": "1F5AF"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "59",
			"Dingbat hex": "3B",
			"Unicode dec": "128433",
			"Unicode hex": "1F5B1"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "60",
			"Dingbat hex": "3C",
			"Unicode dec": "128402",
			"Unicode hex": "1F592"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "61",
			"Dingbat hex": "3D",
			"Unicode dec": "128403",
			"Unicode hex": "1F593"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "62",
			"Dingbat hex": "3E",
			"Unicode dec": "128408",
			"Unicode hex": "1F598"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "63",
			"Dingbat hex": "3F",
			"Unicode dec": "128409",
			"Unicode hex": "1F599"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "64",
			"Dingbat hex": "40",
			"Unicode dec": "128410",
			"Unicode hex": "1F59A"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "65",
			"Dingbat hex": "41",
			"Unicode dec": "128411",
			"Unicode hex": "1F59B"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "66",
			"Dingbat hex": "42",
			"Unicode dec": "128072",
			"Unicode hex": "1F448"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "67",
			"Dingbat hex": "43",
			"Unicode dec": "128073",
			"Unicode hex": "1F449"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "68",
			"Dingbat hex": "44",
			"Unicode dec": "128412",
			"Unicode hex": "1F59C"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "69",
			"Dingbat hex": "45",
			"Unicode dec": "128413",
			"Unicode hex": "1F59D"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "70",
			"Dingbat hex": "46",
			"Unicode dec": "128414",
			"Unicode hex": "1F59E"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "71",
			"Dingbat hex": "47",
			"Unicode dec": "128415",
			"Unicode hex": "1F59F"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "72",
			"Dingbat hex": "48",
			"Unicode dec": "128416",
			"Unicode hex": "1F5A0"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "73",
			"Dingbat hex": "49",
			"Unicode dec": "128417",
			"Unicode hex": "1F5A1"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "74",
			"Dingbat hex": "4A",
			"Unicode dec": "128070",
			"Unicode hex": "1F446"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "75",
			"Dingbat hex": "4B",
			"Unicode dec": "128071",
			"Unicode hex": "1F447"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "76",
			"Dingbat hex": "4C",
			"Unicode dec": "128418",
			"Unicode hex": "1F5A2"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "77",
			"Dingbat hex": "4D",
			"Unicode dec": "128419",
			"Unicode hex": "1F5A3"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "78",
			"Dingbat hex": "4E",
			"Unicode dec": "128401",
			"Unicode hex": "1F591"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "79",
			"Dingbat hex": "4F",
			"Unicode dec": "128500",
			"Unicode hex": "1F5F4"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "80",
			"Dingbat hex": "50",
			"Unicode dec": "128504",
			"Unicode hex": "1F5F8"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "81",
			"Dingbat hex": "51",
			"Unicode dec": "128501",
			"Unicode hex": "1F5F5"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "82",
			"Dingbat hex": "52",
			"Unicode dec": "9745",
			"Unicode hex": "2611"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "83",
			"Dingbat hex": "53",
			"Unicode dec": "11197",
			"Unicode hex": "2BBD"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "84",
			"Dingbat hex": "54",
			"Unicode dec": "9746",
			"Unicode hex": "2612"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "85",
			"Dingbat hex": "55",
			"Unicode dec": "11198",
			"Unicode hex": "2BBE"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "86",
			"Dingbat hex": "56",
			"Unicode dec": "11199",
			"Unicode hex": "2BBF"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "87",
			"Dingbat hex": "57",
			"Unicode dec": "128711",
			"Unicode hex": "1F6C7"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "88",
			"Dingbat hex": "58",
			"Unicode dec": "10680",
			"Unicode hex": "29B8"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "89",
			"Dingbat hex": "59",
			"Unicode dec": "128625",
			"Unicode hex": "1F671"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "90",
			"Dingbat hex": "5A",
			"Unicode dec": "128628",
			"Unicode hex": "1F674"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "91",
			"Dingbat hex": "5B",
			"Unicode dec": "128626",
			"Unicode hex": "1F672"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "92",
			"Dingbat hex": "5C",
			"Unicode dec": "128627",
			"Unicode hex": "1F673"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "93",
			"Dingbat hex": "5D",
			"Unicode dec": "8253",
			"Unicode hex": "203D"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "94",
			"Dingbat hex": "5E",
			"Unicode dec": "128633",
			"Unicode hex": "1F679"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "95",
			"Dingbat hex": "5F",
			"Unicode dec": "128634",
			"Unicode hex": "1F67A"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "96",
			"Dingbat hex": "60",
			"Unicode dec": "128635",
			"Unicode hex": "1F67B"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "97",
			"Dingbat hex": "61",
			"Unicode dec": "128614",
			"Unicode hex": "1F666"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "98",
			"Dingbat hex": "62",
			"Unicode dec": "128612",
			"Unicode hex": "1F664"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "99",
			"Dingbat hex": "63",
			"Unicode dec": "128613",
			"Unicode hex": "1F665"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "100",
			"Dingbat hex": "64",
			"Unicode dec": "128615",
			"Unicode hex": "1F667"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "101",
			"Dingbat hex": "65",
			"Unicode dec": "128602",
			"Unicode hex": "1F65A"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "102",
			"Dingbat hex": "66",
			"Unicode dec": "128600",
			"Unicode hex": "1F658"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "103",
			"Dingbat hex": "67",
			"Unicode dec": "128601",
			"Unicode hex": "1F659"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "104",
			"Dingbat hex": "68",
			"Unicode dec": "128603",
			"Unicode hex": "1F65B"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "105",
			"Dingbat hex": "69",
			"Unicode dec": "9450",
			"Unicode hex": "24EA"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "106",
			"Dingbat hex": "6A",
			"Unicode dec": "9312",
			"Unicode hex": "2460"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "107",
			"Dingbat hex": "6B",
			"Unicode dec": "9313",
			"Unicode hex": "2461"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "108",
			"Dingbat hex": "6C",
			"Unicode dec": "9314",
			"Unicode hex": "2462"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "109",
			"Dingbat hex": "6D",
			"Unicode dec": "9315",
			"Unicode hex": "2463"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "110",
			"Dingbat hex": "6E",
			"Unicode dec": "9316",
			"Unicode hex": "2464"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "111",
			"Dingbat hex": "6F",
			"Unicode dec": "9317",
			"Unicode hex": "2465"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "112",
			"Dingbat hex": "70",
			"Unicode dec": "9318",
			"Unicode hex": "2466"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "113",
			"Dingbat hex": "71",
			"Unicode dec": "9319",
			"Unicode hex": "2467"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "114",
			"Dingbat hex": "72",
			"Unicode dec": "9320",
			"Unicode hex": "2468"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "115",
			"Dingbat hex": "73",
			"Unicode dec": "9321",
			"Unicode hex": "2469"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "116",
			"Dingbat hex": "74",
			"Unicode dec": "9471",
			"Unicode hex": "24FF"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "117",
			"Dingbat hex": "75",
			"Unicode dec": "10102",
			"Unicode hex": "2776"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "118",
			"Dingbat hex": "76",
			"Unicode dec": "10103",
			"Unicode hex": "2777"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "119",
			"Dingbat hex": "77",
			"Unicode dec": "10104",
			"Unicode hex": "2778"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "120",
			"Dingbat hex": "78",
			"Unicode dec": "10105",
			"Unicode hex": "2779"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "121",
			"Dingbat hex": "79",
			"Unicode dec": "10106",
			"Unicode hex": "277A"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "122",
			"Dingbat hex": "7A",
			"Unicode dec": "10107",
			"Unicode hex": "277B"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "123",
			"Dingbat hex": "7B",
			"Unicode dec": "10108",
			"Unicode hex": "277C"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "124",
			"Dingbat hex": "7C",
			"Unicode dec": "10109",
			"Unicode hex": "277D"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "125",
			"Dingbat hex": "7D",
			"Unicode dec": "10110",
			"Unicode hex": "277E"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "126",
			"Dingbat hex": "7E",
			"Unicode dec": "10111",
			"Unicode hex": "277F"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "128",
			"Dingbat hex": "80",
			"Unicode dec": "9737",
			"Unicode hex": "2609"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "129",
			"Dingbat hex": "81",
			"Unicode dec": "127765",
			"Unicode hex": "1F315"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "130",
			"Dingbat hex": "82",
			"Unicode dec": "9789",
			"Unicode hex": "263D"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "131",
			"Dingbat hex": "83",
			"Unicode dec": "9790",
			"Unicode hex": "263E"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "132",
			"Dingbat hex": "84",
			"Unicode dec": "11839",
			"Unicode hex": "2E3F"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "133",
			"Dingbat hex": "85",
			"Unicode dec": "10013",
			"Unicode hex": "271D"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "134",
			"Dingbat hex": "86",
			"Unicode dec": "128327",
			"Unicode hex": "1F547"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "135",
			"Dingbat hex": "87",
			"Unicode dec": "128348",
			"Unicode hex": "1F55C"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "136",
			"Dingbat hex": "88",
			"Unicode dec": "128349",
			"Unicode hex": "1F55D"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "137",
			"Dingbat hex": "89",
			"Unicode dec": "128350",
			"Unicode hex": "1F55E"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "138",
			"Dingbat hex": "8A",
			"Unicode dec": "128351",
			"Unicode hex": "1F55F"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "139",
			"Dingbat hex": "8B",
			"Unicode dec": "128352",
			"Unicode hex": "1F560"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "140",
			"Dingbat hex": "8C",
			"Unicode dec": "128353",
			"Unicode hex": "1F561"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "141",
			"Dingbat hex": "8D",
			"Unicode dec": "128354",
			"Unicode hex": "1F562"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "142",
			"Dingbat hex": "8E",
			"Unicode dec": "128355",
			"Unicode hex": "1F563"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "143",
			"Dingbat hex": "8F",
			"Unicode dec": "128356",
			"Unicode hex": "1F564"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "144",
			"Dingbat hex": "90",
			"Unicode dec": "128357",
			"Unicode hex": "1F565"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "145",
			"Dingbat hex": "91",
			"Unicode dec": "128358",
			"Unicode hex": "1F566"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "146",
			"Dingbat hex": "92",
			"Unicode dec": "128359",
			"Unicode hex": "1F567"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "147",
			"Dingbat hex": "93",
			"Unicode dec": "128616",
			"Unicode hex": "1F668"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "148",
			"Dingbat hex": "94",
			"Unicode dec": "128617",
			"Unicode hex": "1F669"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "149",
			"Dingbat hex": "95",
			"Unicode dec": "8901",
			"Unicode hex": "22C5"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "150",
			"Dingbat hex": "96",
			"Unicode dec": "128900",
			"Unicode hex": "1F784"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "151",
			"Dingbat hex": "97",
			"Unicode dec": "10625",
			"Unicode hex": "2981"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "152",
			"Dingbat hex": "98",
			"Unicode dec": "9679",
			"Unicode hex": "25CF"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "153",
			"Dingbat hex": "99",
			"Unicode dec": "9675",
			"Unicode hex": "25CB"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "154",
			"Dingbat hex": "9A",
			"Unicode dec": "128901",
			"Unicode hex": "1F785"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "155",
			"Dingbat hex": "9B",
			"Unicode dec": "128903",
			"Unicode hex": "1F787"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "156",
			"Dingbat hex": "9C",
			"Unicode dec": "128905",
			"Unicode hex": "1F789"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "157",
			"Dingbat hex": "9D",
			"Unicode dec": "8857",
			"Unicode hex": "2299"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "158",
			"Dingbat hex": "9E",
			"Unicode dec": "10687",
			"Unicode hex": "29BF"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "159",
			"Dingbat hex": "9F",
			"Unicode dec": "128908",
			"Unicode hex": "1F78C"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "160",
			"Dingbat hex": "A0",
			"Unicode dec": "128909",
			"Unicode hex": "1F78D"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "161",
			"Dingbat hex": "A1",
			"Unicode dec": "9726",
			"Unicode hex": "25FE"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "162",
			"Dingbat hex": "A2",
			"Unicode dec": "9632",
			"Unicode hex": "25A0"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "163",
			"Dingbat hex": "A3",
			"Unicode dec": "9633",
			"Unicode hex": "25A1"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "164",
			"Dingbat hex": "A4",
			"Unicode dec": "128913",
			"Unicode hex": "1F791"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "165",
			"Dingbat hex": "A5",
			"Unicode dec": "128914",
			"Unicode hex": "1F792"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "166",
			"Dingbat hex": "A6",
			"Unicode dec": "128915",
			"Unicode hex": "1F793"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "167",
			"Dingbat hex": "A7",
			"Unicode dec": "128916",
			"Unicode hex": "1F794"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "168",
			"Dingbat hex": "A8",
			"Unicode dec": "9635",
			"Unicode hex": "25A3"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "169",
			"Dingbat hex": "A9",
			"Unicode dec": "128917",
			"Unicode hex": "1F795"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "170",
			"Dingbat hex": "AA",
			"Unicode dec": "128918",
			"Unicode hex": "1F796"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "171",
			"Dingbat hex": "AB",
			"Unicode dec": "128919",
			"Unicode hex": "1F797"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "172",
			"Dingbat hex": "AC",
			"Unicode dec": "128920",
			"Unicode hex": "1F798"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "173",
			"Dingbat hex": "AD",
			"Unicode dec": "11049",
			"Unicode hex": "2B29"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "174",
			"Dingbat hex": "AE",
			"Unicode dec": "11045",
			"Unicode hex": "2B25"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "175",
			"Dingbat hex": "AF",
			"Unicode dec": "9671",
			"Unicode hex": "25C7"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "176",
			"Dingbat hex": "B0",
			"Unicode dec": "128922",
			"Unicode hex": "1F79A"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "177",
			"Dingbat hex": "B1",
			"Unicode dec": "9672",
			"Unicode hex": "25C8"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "178",
			"Dingbat hex": "B2",
			"Unicode dec": "128923",
			"Unicode hex": "1F79B"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "179",
			"Dingbat hex": "B3",
			"Unicode dec": "128924",
			"Unicode hex": "1F79C"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "180",
			"Dingbat hex": "B4",
			"Unicode dec": "128925",
			"Unicode hex": "1F79D"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "181",
			"Dingbat hex": "B5",
			"Unicode dec": "128926",
			"Unicode hex": "1F79E"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "182",
			"Dingbat hex": "B6",
			"Unicode dec": "11050",
			"Unicode hex": "2B2A"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "183",
			"Dingbat hex": "B7",
			"Unicode dec": "11047",
			"Unicode hex": "2B27"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "184",
			"Dingbat hex": "B8",
			"Unicode dec": "9674",
			"Unicode hex": "25CA"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "185",
			"Dingbat hex": "B9",
			"Unicode dec": "128928",
			"Unicode hex": "1F7A0"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "186",
			"Dingbat hex": "BA",
			"Unicode dec": "9686",
			"Unicode hex": "25D6"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "187",
			"Dingbat hex": "BB",
			"Unicode dec": "9687",
			"Unicode hex": "25D7"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "188",
			"Dingbat hex": "BC",
			"Unicode dec": "11210",
			"Unicode hex": "2BCA"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "189",
			"Dingbat hex": "BD",
			"Unicode dec": "11211",
			"Unicode hex": "2BCB"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "190",
			"Dingbat hex": "BE",
			"Unicode dec": "11200",
			"Unicode hex": "2BC0"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "191",
			"Dingbat hex": "BF",
			"Unicode dec": "11201",
			"Unicode hex": "2BC1"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "192",
			"Dingbat hex": "C0",
			"Unicode dec": "11039",
			"Unicode hex": "2B1F"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "193",
			"Dingbat hex": "C1",
			"Unicode dec": "11202",
			"Unicode hex": "2BC2"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "194",
			"Dingbat hex": "C2",
			"Unicode dec": "11043",
			"Unicode hex": "2B23"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "195",
			"Dingbat hex": "C3",
			"Unicode dec": "11042",
			"Unicode hex": "2B22"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "196",
			"Dingbat hex": "C4",
			"Unicode dec": "11203",
			"Unicode hex": "2BC3"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "197",
			"Dingbat hex": "C5",
			"Unicode dec": "11204",
			"Unicode hex": "2BC4"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "198",
			"Dingbat hex": "C6",
			"Unicode dec": "128929",
			"Unicode hex": "1F7A1"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "199",
			"Dingbat hex": "C7",
			"Unicode dec": "128930",
			"Unicode hex": "1F7A2"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "200",
			"Dingbat hex": "C8",
			"Unicode dec": "128931",
			"Unicode hex": "1F7A3"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "201",
			"Dingbat hex": "C9",
			"Unicode dec": "128932",
			"Unicode hex": "1F7A4"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "202",
			"Dingbat hex": "CA",
			"Unicode dec": "128933",
			"Unicode hex": "1F7A5"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "203",
			"Dingbat hex": "CB",
			"Unicode dec": "128934",
			"Unicode hex": "1F7A6"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "204",
			"Dingbat hex": "CC",
			"Unicode dec": "128935",
			"Unicode hex": "1F7A7"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "205",
			"Dingbat hex": "CD",
			"Unicode dec": "128936",
			"Unicode hex": "1F7A8"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "206",
			"Dingbat hex": "CE",
			"Unicode dec": "128937",
			"Unicode hex": "1F7A9"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "207",
			"Dingbat hex": "CF",
			"Unicode dec": "128938",
			"Unicode hex": "1F7AA"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "208",
			"Dingbat hex": "D0",
			"Unicode dec": "128939",
			"Unicode hex": "1F7AB"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "209",
			"Dingbat hex": "D1",
			"Unicode dec": "128940",
			"Unicode hex": "1F7AC"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "210",
			"Dingbat hex": "D2",
			"Unicode dec": "128941",
			"Unicode hex": "1F7AD"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "211",
			"Dingbat hex": "D3",
			"Unicode dec": "128942",
			"Unicode hex": "1F7AE"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "212",
			"Dingbat hex": "D4",
			"Unicode dec": "128943",
			"Unicode hex": "1F7AF"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "213",
			"Dingbat hex": "D5",
			"Unicode dec": "128944",
			"Unicode hex": "1F7B0"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "214",
			"Dingbat hex": "D6",
			"Unicode dec": "128945",
			"Unicode hex": "1F7B1"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "215",
			"Dingbat hex": "D7",
			"Unicode dec": "128946",
			"Unicode hex": "1F7B2"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "216",
			"Dingbat hex": "D8",
			"Unicode dec": "128947",
			"Unicode hex": "1F7B3"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "217",
			"Dingbat hex": "D9",
			"Unicode dec": "128948",
			"Unicode hex": "1F7B4"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "218",
			"Dingbat hex": "DA",
			"Unicode dec": "128949",
			"Unicode hex": "1F7B5"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "219",
			"Dingbat hex": "DB",
			"Unicode dec": "128950",
			"Unicode hex": "1F7B6"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "220",
			"Dingbat hex": "DC",
			"Unicode dec": "128951",
			"Unicode hex": "1F7B7"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "221",
			"Dingbat hex": "DD",
			"Unicode dec": "128952",
			"Unicode hex": "1F7B8"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "222",
			"Dingbat hex": "DE",
			"Unicode dec": "128953",
			"Unicode hex": "1F7B9"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "223",
			"Dingbat hex": "DF",
			"Unicode dec": "128954",
			"Unicode hex": "1F7BA"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "224",
			"Dingbat hex": "E0",
			"Unicode dec": "128955",
			"Unicode hex": "1F7BB"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "225",
			"Dingbat hex": "E1",
			"Unicode dec": "128956",
			"Unicode hex": "1F7BC"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "226",
			"Dingbat hex": "E2",
			"Unicode dec": "128957",
			"Unicode hex": "1F7BD"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "227",
			"Dingbat hex": "E3",
			"Unicode dec": "128958",
			"Unicode hex": "1F7BE"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "228",
			"Dingbat hex": "E4",
			"Unicode dec": "128959",
			"Unicode hex": "1F7BF"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "229",
			"Dingbat hex": "E5",
			"Unicode dec": "128960",
			"Unicode hex": "1F7C0"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "230",
			"Dingbat hex": "E6",
			"Unicode dec": "128962",
			"Unicode hex": "1F7C2"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "231",
			"Dingbat hex": "E7",
			"Unicode dec": "128964",
			"Unicode hex": "1F7C4"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "232",
			"Dingbat hex": "E8",
			"Unicode dec": "128966",
			"Unicode hex": "1F7C6"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "233",
			"Dingbat hex": "E9",
			"Unicode dec": "128969",
			"Unicode hex": "1F7C9"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "234",
			"Dingbat hex": "EA",
			"Unicode dec": "128970",
			"Unicode hex": "1F7CA"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "235",
			"Dingbat hex": "EB",
			"Unicode dec": "10038",
			"Unicode hex": "2736"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "236",
			"Dingbat hex": "EC",
			"Unicode dec": "128972",
			"Unicode hex": "1F7CC"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "237",
			"Dingbat hex": "ED",
			"Unicode dec": "128974",
			"Unicode hex": "1F7CE"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "238",
			"Dingbat hex": "EE",
			"Unicode dec": "128976",
			"Unicode hex": "1F7D0"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "239",
			"Dingbat hex": "EF",
			"Unicode dec": "128978",
			"Unicode hex": "1F7D2"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "240",
			"Dingbat hex": "F0",
			"Unicode dec": "10041",
			"Unicode hex": "2739"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "241",
			"Dingbat hex": "F1",
			"Unicode dec": "128963",
			"Unicode hex": "1F7C3"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "242",
			"Dingbat hex": "F2",
			"Unicode dec": "128967",
			"Unicode hex": "1F7C7"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "243",
			"Dingbat hex": "F3",
			"Unicode dec": "10031",
			"Unicode hex": "272F"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "244",
			"Dingbat hex": "F4",
			"Unicode dec": "128973",
			"Unicode hex": "1F7CD"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "245",
			"Dingbat hex": "F5",
			"Unicode dec": "128980",
			"Unicode hex": "1F7D4"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "246",
			"Dingbat hex": "F6",
			"Unicode dec": "11212",
			"Unicode hex": "2BCC"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "247",
			"Dingbat hex": "F7",
			"Unicode dec": "11213",
			"Unicode hex": "2BCD"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "248",
			"Dingbat hex": "F8",
			"Unicode dec": "8251",
			"Unicode hex": "203B"
		},
		{
			"Typeface name": "Wingdings 2",
			"Dingbat dec": "249",
			"Dingbat hex": "F9",
			"Unicode dec": "8258",
			"Unicode hex": "2042"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "32",
			"Dingbat hex": "20",
			"Unicode dec": "32",
			"Unicode hex": "20"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "33",
			"Dingbat hex": "21",
			"Unicode dec": "11104",
			"Unicode hex": "2B60"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "34",
			"Dingbat hex": "22",
			"Unicode dec": "11106",
			"Unicode hex": "2B62"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "35",
			"Dingbat hex": "23",
			"Unicode dec": "11105",
			"Unicode hex": "2B61"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "36",
			"Dingbat hex": "24",
			"Unicode dec": "11107",
			"Unicode hex": "2B63"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "37",
			"Dingbat hex": "25",
			"Unicode dec": "11110",
			"Unicode hex": "2B66"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "38",
			"Dingbat hex": "26",
			"Unicode dec": "11111",
			"Unicode hex": "2B67"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "39",
			"Dingbat hex": "27",
			"Unicode dec": "11113",
			"Unicode hex": "2B69"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "40",
			"Dingbat hex": "28",
			"Unicode dec": "11112",
			"Unicode hex": "2B68"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "41",
			"Dingbat hex": "29",
			"Unicode dec": "11120",
			"Unicode hex": "2B70"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "42",
			"Dingbat hex": "2A",
			"Unicode dec": "11122",
			"Unicode hex": "2B72"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "43",
			"Dingbat hex": "2B",
			"Unicode dec": "11121",
			"Unicode hex": "2B71"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "44",
			"Dingbat hex": "2C",
			"Unicode dec": "11123",
			"Unicode hex": "2B73"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "45",
			"Dingbat hex": "2D",
			"Unicode dec": "11126",
			"Unicode hex": "2B76"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "46",
			"Dingbat hex": "2E",
			"Unicode dec": "11128",
			"Unicode hex": "2B78"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "47",
			"Dingbat hex": "2F",
			"Unicode dec": "11131",
			"Unicode hex": "2B7B"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "48",
			"Dingbat hex": "30",
			"Unicode dec": "11133",
			"Unicode hex": "2B7D"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "49",
			"Dingbat hex": "31",
			"Unicode dec": "11108",
			"Unicode hex": "2B64"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "50",
			"Dingbat hex": "32",
			"Unicode dec": "11109",
			"Unicode hex": "2B65"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "51",
			"Dingbat hex": "33",
			"Unicode dec": "11114",
			"Unicode hex": "2B6A"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "52",
			"Dingbat hex": "34",
			"Unicode dec": "11116",
			"Unicode hex": "2B6C"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "53",
			"Dingbat hex": "35",
			"Unicode dec": "11115",
			"Unicode hex": "2B6B"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "54",
			"Dingbat hex": "36",
			"Unicode dec": "11117",
			"Unicode hex": "2B6D"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "55",
			"Dingbat hex": "37",
			"Unicode dec": "11085",
			"Unicode hex": "2B4D"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "56",
			"Dingbat hex": "38",
			"Unicode dec": "11168",
			"Unicode hex": "2BA0"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "57",
			"Dingbat hex": "39",
			"Unicode dec": "11169",
			"Unicode hex": "2BA1"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "58",
			"Dingbat hex": "3A",
			"Unicode dec": "11170",
			"Unicode hex": "2BA2"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "59",
			"Dingbat hex": "3B",
			"Unicode dec": "11171",
			"Unicode hex": "2BA3"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "60",
			"Dingbat hex": "3C",
			"Unicode dec": "11172",
			"Unicode hex": "2BA4"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "61",
			"Dingbat hex": "3D",
			"Unicode dec": "11173",
			"Unicode hex": "2BA5"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "62",
			"Dingbat hex": "3E",
			"Unicode dec": "11174",
			"Unicode hex": "2BA6"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "63",
			"Dingbat hex": "3F",
			"Unicode dec": "11175",
			"Unicode hex": "2BA7"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "64",
			"Dingbat hex": "40",
			"Unicode dec": "11152",
			"Unicode hex": "2B90"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "65",
			"Dingbat hex": "41",
			"Unicode dec": "11153",
			"Unicode hex": "2B91"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "66",
			"Dingbat hex": "42",
			"Unicode dec": "11154",
			"Unicode hex": "2B92"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "67",
			"Dingbat hex": "43",
			"Unicode dec": "11155",
			"Unicode hex": "2B93"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "68",
			"Dingbat hex": "44",
			"Unicode dec": "11136",
			"Unicode hex": "2B80"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "69",
			"Dingbat hex": "45",
			"Unicode dec": "11139",
			"Unicode hex": "2B83"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "70",
			"Dingbat hex": "46",
			"Unicode dec": "11134",
			"Unicode hex": "2B7E"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "71",
			"Dingbat hex": "47",
			"Unicode dec": "11135",
			"Unicode hex": "2B7F"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "72",
			"Dingbat hex": "48",
			"Unicode dec": "11140",
			"Unicode hex": "2B84"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "73",
			"Dingbat hex": "49",
			"Unicode dec": "11142",
			"Unicode hex": "2B86"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "74",
			"Dingbat hex": "4A",
			"Unicode dec": "11141",
			"Unicode hex": "2B85"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "75",
			"Dingbat hex": "4B",
			"Unicode dec": "11143",
			"Unicode hex": "2B87"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "76",
			"Dingbat hex": "4C",
			"Unicode dec": "11151",
			"Unicode hex": "2B8F"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "77",
			"Dingbat hex": "4D",
			"Unicode dec": "11149",
			"Unicode hex": "2B8D"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "78",
			"Dingbat hex": "4E",
			"Unicode dec": "11150",
			"Unicode hex": "2B8E"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "79",
			"Dingbat hex": "4F",
			"Unicode dec": "11148",
			"Unicode hex": "2B8C"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "80",
			"Dingbat hex": "50",
			"Unicode dec": "11118",
			"Unicode hex": "2B6E"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "81",
			"Dingbat hex": "51",
			"Unicode dec": "11119",
			"Unicode hex": "2B6F"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "82",
			"Dingbat hex": "52",
			"Unicode dec": "9099",
			"Unicode hex": "238B"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "83",
			"Dingbat hex": "53",
			"Unicode dec": "8996",
			"Unicode hex": "2324"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "84",
			"Dingbat hex": "54",
			"Unicode dec": "8963",
			"Unicode hex": "2303"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "85",
			"Dingbat hex": "55",
			"Unicode dec": "8997",
			"Unicode hex": "2325"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "86",
			"Dingbat hex": "56",
			"Unicode dec": "9251",
			"Unicode hex": "2423"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "87",
			"Dingbat hex": "57",
			"Unicode dec": "9085",
			"Unicode hex": "237D"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "88",
			"Dingbat hex": "58",
			"Unicode dec": "8682",
			"Unicode hex": "21EA"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "89",
			"Dingbat hex": "59",
			"Unicode dec": "11192",
			"Unicode hex": "2BB8"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "90",
			"Dingbat hex": "5A",
			"Unicode dec": "129184",
			"Unicode hex": "1F8A0"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "91",
			"Dingbat hex": "5B",
			"Unicode dec": "129185",
			"Unicode hex": "1F8A1"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "92",
			"Dingbat hex": "5C",
			"Unicode dec": "129186",
			"Unicode hex": "1F8A2"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "93",
			"Dingbat hex": "5D",
			"Unicode dec": "129187",
			"Unicode hex": "1F8A3"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "94",
			"Dingbat hex": "5E",
			"Unicode dec": "129188",
			"Unicode hex": "1F8A4"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "95",
			"Dingbat hex": "5F",
			"Unicode dec": "129189",
			"Unicode hex": "1F8A5"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "96",
			"Dingbat hex": "60",
			"Unicode dec": "129190",
			"Unicode hex": "1F8A6"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "97",
			"Dingbat hex": "61",
			"Unicode dec": "129191",
			"Unicode hex": "1F8A7"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "98",
			"Dingbat hex": "62",
			"Unicode dec": "129192",
			"Unicode hex": "1F8A8"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "99",
			"Dingbat hex": "63",
			"Unicode dec": "129193",
			"Unicode hex": "1F8A9"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "100",
			"Dingbat hex": "64",
			"Unicode dec": "129194",
			"Unicode hex": "1F8AA"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "101",
			"Dingbat hex": "65",
			"Unicode dec": "129195",
			"Unicode hex": "1F8AB"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "102",
			"Dingbat hex": "66",
			"Unicode dec": "129104",
			"Unicode hex": "1F850"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "103",
			"Dingbat hex": "67",
			"Unicode dec": "129106",
			"Unicode hex": "1F852"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "104",
			"Dingbat hex": "68",
			"Unicode dec": "129105",
			"Unicode hex": "1F851"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "105",
			"Dingbat hex": "69",
			"Unicode dec": "129107",
			"Unicode hex": "1F853"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "106",
			"Dingbat hex": "6A",
			"Unicode dec": "129108",
			"Unicode hex": "1F854"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "107",
			"Dingbat hex": "6B",
			"Unicode dec": "129109",
			"Unicode hex": "1F855"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "108",
			"Dingbat hex": "6C",
			"Unicode dec": "129111",
			"Unicode hex": "1F857"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "109",
			"Dingbat hex": "6D",
			"Unicode dec": "129110",
			"Unicode hex": "1F856"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "110",
			"Dingbat hex": "6E",
			"Unicode dec": "129112",
			"Unicode hex": "1F858"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "111",
			"Dingbat hex": "6F",
			"Unicode dec": "129113",
			"Unicode hex": "1F859"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "112",
			"Dingbat hex": "70",
			"Unicode dec": "9650",
			"Unicode hex": "25B2"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "113",
			"Dingbat hex": "71",
			"Unicode dec": "9660",
			"Unicode hex": "25BC"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "114",
			"Dingbat hex": "72",
			"Unicode dec": "9651",
			"Unicode hex": "25B3"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "115",
			"Dingbat hex": "73",
			"Unicode dec": "9661",
			"Unicode hex": "25BD"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "116",
			"Dingbat hex": "74",
			"Unicode dec": "9664",
			"Unicode hex": "25C0"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "117",
			"Dingbat hex": "75",
			"Unicode dec": "9654",
			"Unicode hex": "25B6"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "118",
			"Dingbat hex": "76",
			"Unicode dec": "9665",
			"Unicode hex": "25C1"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "119",
			"Dingbat hex": "77",
			"Unicode dec": "9655",
			"Unicode hex": "25B7"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "120",
			"Dingbat hex": "78",
			"Unicode dec": "9699",
			"Unicode hex": "25E3"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "121",
			"Dingbat hex": "79",
			"Unicode dec": "9698",
			"Unicode hex": "25E2"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "122",
			"Dingbat hex": "7A",
			"Unicode dec": "9700",
			"Unicode hex": "25E4"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "123",
			"Dingbat hex": "7B",
			"Unicode dec": "9701",
			"Unicode hex": "25E5"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "124",
			"Dingbat hex": "7C",
			"Unicode dec": "128896",
			"Unicode hex": "1F780"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "125",
			"Dingbat hex": "7D",
			"Unicode dec": "128898",
			"Unicode hex": "1F782"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "126",
			"Dingbat hex": "7E",
			"Unicode dec": "128897",
			"Unicode hex": "1F781"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "128",
			"Dingbat hex": "80",
			"Unicode dec": "128899",
			"Unicode hex": "1F783"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "129",
			"Dingbat hex": "81",
			"Unicode dec": "11205",
			"Unicode hex": "2BC5"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "130",
			"Dingbat hex": "82",
			"Unicode dec": "11206",
			"Unicode hex": "2BC6"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "131",
			"Dingbat hex": "83",
			"Unicode dec": "11207",
			"Unicode hex": "2BC7"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "132",
			"Dingbat hex": "84",
			"Unicode dec": "11208",
			"Unicode hex": "2BC8"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "133",
			"Dingbat hex": "85",
			"Unicode dec": "11164",
			"Unicode hex": "2B9C"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "134",
			"Dingbat hex": "86",
			"Unicode dec": "11166",
			"Unicode hex": "2B9E"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "135",
			"Dingbat hex": "87",
			"Unicode dec": "11165",
			"Unicode hex": "2B9D"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "136",
			"Dingbat hex": "88",
			"Unicode dec": "11167",
			"Unicode hex": "2B9F"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "137",
			"Dingbat hex": "89",
			"Unicode dec": "129040",
			"Unicode hex": "1F810"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "138",
			"Dingbat hex": "8A",
			"Unicode dec": "129042",
			"Unicode hex": "1F812"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "139",
			"Dingbat hex": "8B",
			"Unicode dec": "129041",
			"Unicode hex": "1F811"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "140",
			"Dingbat hex": "8C",
			"Unicode dec": "129043",
			"Unicode hex": "1F813"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "141",
			"Dingbat hex": "8D",
			"Unicode dec": "129044",
			"Unicode hex": "1F814"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "142",
			"Dingbat hex": "8E",
			"Unicode dec": "129046",
			"Unicode hex": "1F816"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "143",
			"Dingbat hex": "8F",
			"Unicode dec": "129045",
			"Unicode hex": "1F815"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "144",
			"Dingbat hex": "90",
			"Unicode dec": "129047",
			"Unicode hex": "1F817"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "145",
			"Dingbat hex": "91",
			"Unicode dec": "129048",
			"Unicode hex": "1F818"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "146",
			"Dingbat hex": "92",
			"Unicode dec": "129050",
			"Unicode hex": "1F81A"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "147",
			"Dingbat hex": "93",
			"Unicode dec": "129049",
			"Unicode hex": "1F819"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "148",
			"Dingbat hex": "94",
			"Unicode dec": "129051",
			"Unicode hex": "1F81B"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "149",
			"Dingbat hex": "95",
			"Unicode dec": "129052",
			"Unicode hex": "1F81C"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "150",
			"Dingbat hex": "96",
			"Unicode dec": "129054",
			"Unicode hex": "1F81E"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "151",
			"Dingbat hex": "97",
			"Unicode dec": "129053",
			"Unicode hex": "1F81D"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "152",
			"Dingbat hex": "98",
			"Unicode dec": "129055",
			"Unicode hex": "1F81F"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "153",
			"Dingbat hex": "99",
			"Unicode dec": "129024",
			"Unicode hex": "1F800"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "154",
			"Dingbat hex": "9A",
			"Unicode dec": "129026",
			"Unicode hex": "1F802"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "155",
			"Dingbat hex": "9B",
			"Unicode dec": "129025",
			"Unicode hex": "1F801"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "156",
			"Dingbat hex": "9C",
			"Unicode dec": "129027",
			"Unicode hex": "1F803"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "157",
			"Dingbat hex": "9D",
			"Unicode dec": "129028",
			"Unicode hex": "1F804"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "158",
			"Dingbat hex": "9E",
			"Unicode dec": "129030",
			"Unicode hex": "1F806"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "159",
			"Dingbat hex": "9F",
			"Unicode dec": "129029",
			"Unicode hex": "1F805"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "160",
			"Dingbat hex": "A0",
			"Unicode dec": "129031",
			"Unicode hex": "1F807"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "161",
			"Dingbat hex": "A1",
			"Unicode dec": "129032",
			"Unicode hex": "1F808"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "162",
			"Dingbat hex": "A2",
			"Unicode dec": "129034",
			"Unicode hex": "1F80A"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "163",
			"Dingbat hex": "A3",
			"Unicode dec": "129033",
			"Unicode hex": "1F809"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "164",
			"Dingbat hex": "A4",
			"Unicode dec": "129035",
			"Unicode hex": "1F80B"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "165",
			"Dingbat hex": "A5",
			"Unicode dec": "129056",
			"Unicode hex": "1F820"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "166",
			"Dingbat hex": "A6",
			"Unicode dec": "129058",
			"Unicode hex": "1F822"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "167",
			"Dingbat hex": "A7",
			"Unicode dec": "129060",
			"Unicode hex": "1F824"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "168",
			"Dingbat hex": "A8",
			"Unicode dec": "129062",
			"Unicode hex": "1F826"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "169",
			"Dingbat hex": "A9",
			"Unicode dec": "129064",
			"Unicode hex": "1F828"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "170",
			"Dingbat hex": "AA",
			"Unicode dec": "129066",
			"Unicode hex": "1F82A"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "171",
			"Dingbat hex": "AB",
			"Unicode dec": "129068",
			"Unicode hex": "1F82C"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "172",
			"Dingbat hex": "AC",
			"Unicode dec": "129180",
			"Unicode hex": "1F89C"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "173",
			"Dingbat hex": "AD",
			"Unicode dec": "129181",
			"Unicode hex": "1F89D"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "174",
			"Dingbat hex": "AE",
			"Unicode dec": "129182",
			"Unicode hex": "1F89E"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "175",
			"Dingbat hex": "AF",
			"Unicode dec": "129183",
			"Unicode hex": "1F89F"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "176",
			"Dingbat hex": "B0",
			"Unicode dec": "129070",
			"Unicode hex": "1F82E"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "177",
			"Dingbat hex": "B1",
			"Unicode dec": "129072",
			"Unicode hex": "1F830"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "178",
			"Dingbat hex": "B2",
			"Unicode dec": "129074",
			"Unicode hex": "1F832"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "179",
			"Dingbat hex": "B3",
			"Unicode dec": "129076",
			"Unicode hex": "1F834"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "180",
			"Dingbat hex": "B4",
			"Unicode dec": "129078",
			"Unicode hex": "1F836"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "181",
			"Dingbat hex": "B5",
			"Unicode dec": "129080",
			"Unicode hex": "1F838"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "182",
			"Dingbat hex": "B6",
			"Unicode dec": "129082",
			"Unicode hex": "1F83A"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "183",
			"Dingbat hex": "B7",
			"Unicode dec": "129081",
			"Unicode hex": "1F839"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "184",
			"Dingbat hex": "B8",
			"Unicode dec": "129083",
			"Unicode hex": "1F83B"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "185",
			"Dingbat hex": "B9",
			"Unicode dec": "129176",
			"Unicode hex": "1F898"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "186",
			"Dingbat hex": "BA",
			"Unicode dec": "129178",
			"Unicode hex": "1F89A"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "187",
			"Dingbat hex": "BB",
			"Unicode dec": "129177",
			"Unicode hex": "1F899"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "188",
			"Dingbat hex": "BC",
			"Unicode dec": "129179",
			"Unicode hex": "1F89B"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "189",
			"Dingbat hex": "BD",
			"Unicode dec": "129084",
			"Unicode hex": "1F83C"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "190",
			"Dingbat hex": "BE",
			"Unicode dec": "129086",
			"Unicode hex": "1F83E"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "191",
			"Dingbat hex": "BF",
			"Unicode dec": "129085",
			"Unicode hex": "1F83D"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "192",
			"Dingbat hex": "C0",
			"Unicode dec": "129087",
			"Unicode hex": "1F83F"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "193",
			"Dingbat hex": "C1",
			"Unicode dec": "129088",
			"Unicode hex": "1F840"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "194",
			"Dingbat hex": "C2",
			"Unicode dec": "129090",
			"Unicode hex": "1F842"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "195",
			"Dingbat hex": "C3",
			"Unicode dec": "129089",
			"Unicode hex": "1F841"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "196",
			"Dingbat hex": "C4",
			"Unicode dec": "129091",
			"Unicode hex": "1F843"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "197",
			"Dingbat hex": "C5",
			"Unicode dec": "129092",
			"Unicode hex": "1F844"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "198",
			"Dingbat hex": "C6",
			"Unicode dec": "129094",
			"Unicode hex": "1F846"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "199",
			"Dingbat hex": "C7",
			"Unicode dec": "129093",
			"Unicode hex": "1F845"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "200",
			"Dingbat hex": "C8",
			"Unicode dec": "129095",
			"Unicode hex": "1F847"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "201",
			"Dingbat hex": "C9",
			"Unicode dec": "11176",
			"Unicode hex": "2BA8"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "202",
			"Dingbat hex": "CA",
			"Unicode dec": "11177",
			"Unicode hex": "2BA9"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "203",
			"Dingbat hex": "CB",
			"Unicode dec": "11178",
			"Unicode hex": "2BAA"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "204",
			"Dingbat hex": "CC",
			"Unicode dec": "11179",
			"Unicode hex": "2BAB"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "205",
			"Dingbat hex": "CD",
			"Unicode dec": "11180",
			"Unicode hex": "2BAC"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "206",
			"Dingbat hex": "CE",
			"Unicode dec": "11181",
			"Unicode hex": "2BAD"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "207",
			"Dingbat hex": "CF",
			"Unicode dec": "11182",
			"Unicode hex": "2BAE"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "208",
			"Dingbat hex": "D0",
			"Unicode dec": "11183",
			"Unicode hex": "2BAF"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "209",
			"Dingbat hex": "D1",
			"Unicode dec": "129120",
			"Unicode hex": "1F860"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "210",
			"Dingbat hex": "D2",
			"Unicode dec": "129122",
			"Unicode hex": "1F862"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "211",
			"Dingbat hex": "D3",
			"Unicode dec": "129121",
			"Unicode hex": "1F861"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "212",
			"Dingbat hex": "D4",
			"Unicode dec": "129123",
			"Unicode hex": "1F863"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "213",
			"Dingbat hex": "D5",
			"Unicode dec": "129124",
			"Unicode hex": "1F864"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "214",
			"Dingbat hex": "D6",
			"Unicode dec": "129125",
			"Unicode hex": "1F865"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "215",
			"Dingbat hex": "D7",
			"Unicode dec": "129127",
			"Unicode hex": "1F867"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "216",
			"Dingbat hex": "D8",
			"Unicode dec": "129126",
			"Unicode hex": "1F866"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "217",
			"Dingbat hex": "D9",
			"Unicode dec": "129136",
			"Unicode hex": "1F870"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "218",
			"Dingbat hex": "DA",
			"Unicode dec": "129138",
			"Unicode hex": "1F872"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "219",
			"Dingbat hex": "DB",
			"Unicode dec": "129137",
			"Unicode hex": "1F871"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "220",
			"Dingbat hex": "DC",
			"Unicode dec": "129139",
			"Unicode hex": "1F873"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "221",
			"Dingbat hex": "DD",
			"Unicode dec": "129140",
			"Unicode hex": "1F874"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "222",
			"Dingbat hex": "DE",
			"Unicode dec": "129141",
			"Unicode hex": "1F875"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "223",
			"Dingbat hex": "DF",
			"Unicode dec": "129143",
			"Unicode hex": "1F877"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "224",
			"Dingbat hex": "E0",
			"Unicode dec": "129142",
			"Unicode hex": "1F876"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "225",
			"Dingbat hex": "E1",
			"Unicode dec": "129152",
			"Unicode hex": "1F880"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "226",
			"Dingbat hex": "E2",
			"Unicode dec": "129154",
			"Unicode hex": "1F882"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "227",
			"Dingbat hex": "E3",
			"Unicode dec": "129153",
			"Unicode hex": "1F881"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "228",
			"Dingbat hex": "E4",
			"Unicode dec": "129155",
			"Unicode hex": "1F883"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "229",
			"Dingbat hex": "E5",
			"Unicode dec": "129156",
			"Unicode hex": "1F884"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "230",
			"Dingbat hex": "E6",
			"Unicode dec": "129157",
			"Unicode hex": "1F885"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "231",
			"Dingbat hex": "E7",
			"Unicode dec": "129159",
			"Unicode hex": "1F887"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "232",
			"Dingbat hex": "E8",
			"Unicode dec": "129158",
			"Unicode hex": "1F886"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "233",
			"Dingbat hex": "E9",
			"Unicode dec": "129168",
			"Unicode hex": "1F890"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "234",
			"Dingbat hex": "EA",
			"Unicode dec": "129170",
			"Unicode hex": "1F892"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "235",
			"Dingbat hex": "EB",
			"Unicode dec": "129169",
			"Unicode hex": "1F891"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "236",
			"Dingbat hex": "EC",
			"Unicode dec": "129171",
			"Unicode hex": "1F893"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "237",
			"Dingbat hex": "ED",
			"Unicode dec": "129172",
			"Unicode hex": "1F894"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "238",
			"Dingbat hex": "EE",
			"Unicode dec": "129174",
			"Unicode hex": "1F896"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "239",
			"Dingbat hex": "EF",
			"Unicode dec": "129173",
			"Unicode hex": "1F895"
		},
		{
			"Typeface name": "Wingdings 3",
			"Dingbat dec": "240",
			"Dingbat hex": "F0",
			"Unicode dec": "129175",
			"Unicode hex": "1F897"
		}
	];
}));
//#endregion
//#region node_modules/dingbat-to-unicode/dist/index.js
var require_dist = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.hex = exports.dec = exports.codePoint = void 0;
	var dingbats_1 = __importDefault(require_dingbats());
	var dingbatsByCodePoint = {};
	var fromCodePoint = String.fromCodePoint ? String.fromCodePoint : fromCodePointPolyfill;
	for (var _i = 0, dingbats_2 = dingbats_1.default; _i < dingbats_2.length; _i++) {
		var dingbat = dingbats_2[_i];
		var codePoint_1 = parseInt(dingbat["Unicode dec"], 10);
		var scalarValue = {
			codePoint: codePoint_1,
			string: fromCodePoint(codePoint_1)
		};
		dingbatsByCodePoint[dingbat["Typeface name"].toUpperCase() + "_" + dingbat["Dingbat dec"]] = scalarValue;
	}
	function codePoint(typeface, codePoint) {
		return dingbatsByCodePoint[typeface.toUpperCase() + "_" + codePoint];
	}
	exports.codePoint = codePoint;
	function dec(typeface, dec) {
		return codePoint(typeface, parseInt(dec, 10));
	}
	exports.dec = dec;
	function hex(typeface, hex) {
		return codePoint(typeface, parseInt(hex, 16));
	}
	exports.hex = hex;
	function fromCodePointPolyfill(codePoint) {
		if (codePoint <= 65535) return String.fromCharCode(codePoint);
		else {
			var highSurrogate = Math.floor((codePoint - 65536) / 1024) + 55296;
			var lowSurrogate = (codePoint - 65536) % 1024 + 56320;
			return String.fromCharCode(highSurrogate, lowSurrogate);
		}
	}
}));
//#endregion
//#region node_modules/mammoth/lib/transforms.js
var require_transforms = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	exports.paragraph = paragraph;
	exports.run = run;
	exports._elements = elements;
	exports._elementsOfType = elementsOfType;
	exports.getDescendantsOfType = getDescendantsOfType;
	exports.getDescendants = getDescendants;
	function paragraph(transform) {
		return elementsOfType("paragraph", transform);
	}
	function run(transform) {
		return elementsOfType("run", transform);
	}
	function elementsOfType(elementType, transform) {
		return elements(function(element) {
			if (element.type === elementType) return transform(element);
			else return element;
		});
	}
	function elements(transform) {
		return function transformElement(element) {
			if (element.children) {
				var children = _.map(element.children, transformElement);
				element = _.extend(element, { children });
			}
			return transform(element);
		};
	}
	function getDescendantsOfType(element, type) {
		return getDescendants(element).filter(function(descendant) {
			return descendant.type === type;
		});
	}
	function getDescendants(element) {
		var descendants = [];
		visitDescendants(element, function(descendant) {
			descendants.push(descendant);
		});
		return descendants;
	}
	function visitDescendants(element, visit) {
		if (element.children) element.children.forEach(function(child) {
			visitDescendants(child, visit);
			visit(child);
		});
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/uris.js
var require_uris = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.uriToZipEntryName = uriToZipEntryName;
	exports.replaceFragment = replaceFragment;
	function uriToZipEntryName(base, uri) {
		if (uri.charAt(0) === "/") return uri.substr(1);
		else return base + "/" + uri;
	}
	function replaceFragment(uri, fragment) {
		var hashIndex = uri.indexOf("#");
		if (hashIndex !== -1) uri = uri.substring(0, hashIndex);
		return uri + "#" + fragment;
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/body-reader.js
var require_body_reader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.createBodyReader = createBodyReader;
	exports._readNumberingProperties = readNumberingProperties;
	var dingbatToUnicode = require_dist();
	var _ = require_underscore_node();
	var documents = require_documents();
	var Result = require_results().Result;
	var warning = require_results().warning;
	var xml = require_xml();
	var transforms = require_transforms();
	var uris = require_uris();
	function createBodyReader(options) {
		return {
			readXmlElement: function(element) {
				return new BodyReader(options).readXmlElement(element);
			},
			readXmlElements: function(elements) {
				return new BodyReader(options).readXmlElements(elements);
			}
		};
	}
	function BodyReader(options) {
		var complexFieldStack = [];
		var currentInstrText = [];
		var deletedParagraphContents = [];
		var relationships = options.relationships;
		var contentTypes = options.contentTypes;
		var docxFile = options.docxFile;
		var files = options.files;
		var numbering = options.numbering;
		var styles = options.styles;
		function readXmlElements(elements) {
			return combineResults(elements.map(readXmlElement));
		}
		function readXmlElement(element) {
			if (element.type === "element") {
				var handler = xmlElementReaders[element.name];
				if (handler) return handler(element);
				else if (!Object.prototype.hasOwnProperty.call(ignoreElements, element.name)) return emptyResultWithMessages([warning("An unrecognised element was ignored: " + element.name)]);
			}
			return emptyResult();
		}
		function readParagraphProperties(element) {
			return readParagraphStyle(element).map(function(style) {
				return {
					type: "paragraphProperties",
					styleId: style.styleId,
					styleName: style.name,
					alignment: element.firstOrEmpty("w:jc").attributes["w:val"],
					numbering: readNumberingProperties(style.styleId, element.firstOrEmpty("w:numPr"), numbering),
					indent: readParagraphIndent(element.firstOrEmpty("w:ind"))
				};
			});
		}
		function readParagraphIndent(element) {
			return {
				start: element.attributes["w:start"] || element.attributes["w:left"],
				end: element.attributes["w:end"] || element.attributes["w:right"],
				firstLine: element.attributes["w:firstLine"],
				hanging: element.attributes["w:hanging"]
			};
		}
		function readRunProperties(element) {
			return readRunStyle(element).map(function(style) {
				var fontSizeString = element.firstOrEmpty("w:sz").attributes["w:val"];
				var fontSize = /^[0-9]+$/.test(fontSizeString) ? parseInt(fontSizeString, 10) / 2 : null;
				return {
					type: "runProperties",
					styleId: style.styleId,
					styleName: style.name,
					verticalAlignment: element.firstOrEmpty("w:vertAlign").attributes["w:val"],
					font: element.firstOrEmpty("w:rFonts").attributes["w:ascii"],
					fontSize,
					isBold: readBooleanElement(element.first("w:b")),
					isUnderline: readUnderline(element.first("w:u")),
					isItalic: readBooleanElement(element.first("w:i")),
					isStrikethrough: readBooleanElement(element.first("w:strike")),
					isAllCaps: readBooleanElement(element.first("w:caps")),
					isSmallCaps: readBooleanElement(element.first("w:smallCaps")),
					highlight: readHighlightValue(element.firstOrEmpty("w:highlight").attributes["w:val"])
				};
			});
		}
		function readUnderline(element) {
			if (element) {
				var value = element.attributes["w:val"];
				return value !== void 0 && value !== "false" && value !== "0" && value !== "none";
			} else return false;
		}
		function readBooleanElement(element) {
			if (element) {
				var value = element.attributes["w:val"];
				return value !== "false" && value !== "0";
			} else return false;
		}
		function readBooleanAttributeValue(value) {
			return value !== "false" && value !== "0";
		}
		function readHighlightValue(value) {
			if (!value || value === "none") return null;
			else return value;
		}
		function readParagraphStyle(element) {
			return readStyle(element, "w:pStyle", "Paragraph", styles.findParagraphStyleById);
		}
		function readRunStyle(element) {
			return readStyle(element, "w:rStyle", "Run", styles.findCharacterStyleById);
		}
		function readTableStyle(element) {
			return readStyle(element, "w:tblStyle", "Table", styles.findTableStyleById);
		}
		function readStyle(element, styleTagName, styleType, findStyleById) {
			var messages = [];
			var styleElement = element.first(styleTagName);
			var styleId = null;
			var name = null;
			if (styleElement) {
				styleId = styleElement.attributes["w:val"];
				if (styleId) {
					var style = findStyleById(styleId);
					if (style) name = style.name;
					else messages.push(undefinedStyleWarning(styleType, styleId));
				}
			}
			return elementResultWithMessages({
				styleId,
				name
			}, messages);
		}
		function readFldChar(element) {
			var type = element.attributes["w:fldCharType"];
			if (type === "begin") {
				complexFieldStack.push({
					type: "begin",
					fldChar: element
				});
				currentInstrText = [];
			} else if (type === "end") {
				var complexFieldEnd = complexFieldStack.pop();
				if (complexFieldEnd.type === "begin") complexFieldEnd = parseCurrentInstrText(complexFieldEnd);
				if (complexFieldEnd.type === "checkbox") return elementResult(documents.checkbox({ checked: complexFieldEnd.checked }));
			} else if (type === "separate") {
				var complexField = parseCurrentInstrText(complexFieldStack.pop());
				complexFieldStack.push(complexField);
			}
			return emptyResult();
		}
		function currentHyperlinkOptions() {
			var topHyperlink = _.last(complexFieldStack.filter(function(complexField) {
				return complexField.type === "hyperlink";
			}));
			return topHyperlink ? topHyperlink.options : null;
		}
		function parseCurrentInstrText(complexField) {
			return parseInstrText(currentInstrText.join(""), complexField.type === "begin" ? complexField.fldChar : xml.emptyElement);
		}
		function parseInstrText(instrText, fldChar) {
			var linkResult = /^\s*HYPERLINK\s+(\\l\s+)?(?:"(.*)"|([^\\]\S*))/.exec(instrText);
			if (linkResult) {
				var location = linkResult[2] === void 0 ? linkResult[3] : linkResult[2];
				return {
					type: "hyperlink",
					options: linkResult[1] === void 0 ? { href: location } : { anchor: location }
				};
			}
			if (/\s*FORMCHECKBOX\s*/.exec(instrText)) {
				var checkboxElement = fldChar.firstOrEmpty("w:ffData").firstOrEmpty("w:checkBox");
				var checkedElement = checkboxElement.first("w:checked");
				return {
					type: "checkbox",
					checked: checkedElement == null ? readBooleanElement(checkboxElement.first("w:default")) : readBooleanElement(checkedElement)
				};
			}
			return { type: "unknown" };
		}
		function readInstrText(element) {
			currentInstrText.push(element.text());
			return emptyResult();
		}
		function readSymbol(element) {
			var font = element.attributes["w:font"];
			var char = element.attributes["w:char"];
			var unicodeCharacter = dingbatToUnicode.hex(font, char);
			if (unicodeCharacter == null && /^F0..$/.test(char)) unicodeCharacter = dingbatToUnicode.hex(font, char.substring(2));
			if (unicodeCharacter == null) return emptyResultWithMessages([warning("A w:sym element with an unsupported character was ignored: char " + char + " in font " + font)]);
			else return elementResult(new documents.Text(unicodeCharacter.string));
		}
		function noteReferenceReader(noteType) {
			return function(element) {
				var noteId = element.attributes["w:id"];
				return elementResult(new documents.NoteReference({
					noteType,
					noteId
				}));
			};
		}
		function readCommentReference(element) {
			return elementResult(documents.commentReference({ commentId: element.attributes["w:id"] }));
		}
		function readChildElements(element) {
			return readXmlElements(element.children);
		}
		var xmlElementReaders = {
			"w:p": function(element) {
				var paragraphPropertiesElement = element.firstOrEmpty("w:pPr");
				if (!!paragraphPropertiesElement.firstOrEmpty("w:rPr").first("w:del")) {
					element.children.forEach(function(child) {
						deletedParagraphContents.push(child);
					});
					return emptyResult();
				} else {
					var childrenXml = element.children;
					if (deletedParagraphContents.length > 0) {
						childrenXml = deletedParagraphContents.concat(childrenXml);
						deletedParagraphContents = [];
					}
					return ReadResult.map(readParagraphProperties(paragraphPropertiesElement), readXmlElements(childrenXml), function(properties, children) {
						return new documents.Paragraph(children, properties);
					}).insertExtra();
				}
			},
			"w:r": function(element) {
				return ReadResult.map(readRunProperties(element.firstOrEmpty("w:rPr")), readXmlElements(element.children), function(properties, children) {
					var hyperlinkOptions = currentHyperlinkOptions();
					if (hyperlinkOptions !== null) children = [new documents.Hyperlink(children, hyperlinkOptions)];
					return new documents.Run(children, properties);
				});
			},
			"w:fldChar": readFldChar,
			"w:instrText": readInstrText,
			"w:t": function(element) {
				return elementResult(new documents.Text(element.text()));
			},
			"w:tab": function(element) {
				return elementResult(new documents.Tab());
			},
			"w:noBreakHyphen": function() {
				return elementResult(new documents.Text("‑"));
			},
			"w:softHyphen": function(element) {
				return elementResult(new documents.Text("­"));
			},
			"w:sym": readSymbol,
			"w:hyperlink": function(element) {
				var relationshipId = element.attributes["r:id"];
				var anchor = element.attributes["w:anchor"];
				return readXmlElements(element.children).map(function(children) {
					function create(options) {
						var targetFrame = element.attributes["w:tgtFrame"] || null;
						return new documents.Hyperlink(children, _.extend({ targetFrame }, options));
					}
					if (relationshipId) {
						var href = relationships.findTargetByRelationshipId(relationshipId);
						if (anchor) href = uris.replaceFragment(href, anchor);
						return create({ href });
					} else if (anchor) return create({ anchor });
					else return children;
				});
			},
			"w:tbl": readTable,
			"w:tr": readTableRow,
			"w:tc": readTableCell,
			"w:footnoteReference": noteReferenceReader("footnote"),
			"w:endnoteReference": noteReferenceReader("endnote"),
			"w:commentReference": readCommentReference,
			"w:br": function(element) {
				var breakType = element.attributes["w:type"];
				if (breakType == null || breakType === "textWrapping") return elementResult(documents.lineBreak);
				else if (breakType === "page") return elementResult(documents.pageBreak);
				else if (breakType === "column") return elementResult(documents.columnBreak);
				else return emptyResultWithMessages([warning("Unsupported break type: " + breakType)]);
			},
			"w:bookmarkStart": function(element) {
				var name = element.attributes["w:name"];
				if (name === "_GoBack") return emptyResult();
				else return elementResult(new documents.BookmarkStart({ name }));
			},
			"mc:AlternateContent": function(element) {
				return readChildElements(element.firstOrEmpty("mc:Fallback"));
			},
			"w:sdt": function(element) {
				return readXmlElements(element.firstOrEmpty("w:sdtContent").children).map(function(content) {
					var checkbox = element.firstOrEmpty("w:sdtPr").first("wordml:checkbox");
					if (checkbox) {
						var checkedElement = checkbox.first("wordml:checked");
						var isChecked = !!checkedElement && readBooleanAttributeValue(checkedElement.attributes["wordml:val"]);
						var documentCheckbox = documents.checkbox({ checked: isChecked });
						var hasCheckbox = false;
						var replacedContent = content.map(transforms._elementsOfType(documents.types.text, function(text) {
							if (text.value.length > 0 && !hasCheckbox) {
								hasCheckbox = true;
								return documentCheckbox;
							} else return text;
						}));
						if (hasCheckbox) return replacedContent;
						else return documentCheckbox;
					} else return content;
				});
			},
			"w:ins": readChildElements,
			"w:object": readChildElements,
			"w:smartTag": readChildElements,
			"w:drawing": readChildElements,
			"w:pict": function(element) {
				return readChildElements(element).toExtra();
			},
			"v:roundrect": readChildElements,
			"v:shape": readChildElements,
			"v:textbox": readChildElements,
			"w:txbxContent": readChildElements,
			"wp:inline": readDrawingElement,
			"wp:anchor": readDrawingElement,
			"v:imagedata": readImageData,
			"v:group": readChildElements,
			"v:rect": readChildElements
		};
		return {
			readXmlElement,
			readXmlElements
		};
		function readTable(element) {
			var propertiesResult = readTableProperties(element.firstOrEmpty("w:tblPr"));
			return readXmlElements(element.children).flatMap(calculateRowSpans).flatMap(function(children) {
				return propertiesResult.map(function(properties) {
					return documents.Table(children, properties);
				});
			});
		}
		function readTableProperties(element) {
			return readTableStyle(element).map(function(style) {
				return {
					styleId: style.styleId,
					styleName: style.name
				};
			});
		}
		function readTableRow(element) {
			var properties = element.firstOrEmpty("w:trPr");
			if (!!properties.first("w:del")) return emptyResult();
			var isHeader = !!properties.first("w:tblHeader");
			return readXmlElements(element.children).map(function(children) {
				return documents.TableRow(children, { isHeader });
			});
		}
		function readTableCell(element) {
			return readXmlElements(element.children).map(function(children) {
				var properties = element.firstOrEmpty("w:tcPr");
				var gridSpan = properties.firstOrEmpty("w:gridSpan").attributes["w:val"];
				var colSpan = gridSpan ? parseInt(gridSpan, 10) : 1;
				var cell = documents.TableCell(children, { colSpan });
				cell._vMerge = readVMerge(properties);
				return cell;
			});
		}
		function readVMerge(properties) {
			var element = properties.first("w:vMerge");
			if (element) {
				var val = element.attributes["w:val"];
				return val === "continue" || !val;
			} else return null;
		}
		function calculateRowSpans(rows) {
			if (_.any(rows, function(row) {
				return row.type !== documents.types.tableRow;
			})) {
				removeVMergeProperties(rows);
				return elementResultWithMessages(rows, [warning("unexpected non-row element in table, cell merging may be incorrect")]);
			}
			if (_.any(rows, function(row) {
				return _.any(row.children, function(cell) {
					return cell.type !== documents.types.tableCell;
				});
			})) {
				removeVMergeProperties(rows);
				return elementResultWithMessages(rows, [warning("unexpected non-cell element in table row, cell merging may be incorrect")]);
			}
			var columns = {};
			rows.forEach(function(row) {
				var cellIndex = 0;
				row.children.forEach(function(cell) {
					if (cell._vMerge && columns[cellIndex]) columns[cellIndex].rowSpan++;
					else {
						columns[cellIndex] = cell;
						cell._vMerge = false;
					}
					cellIndex += cell.colSpan;
				});
			});
			rows.forEach(function(row) {
				row.children = row.children.filter(function(cell) {
					return !cell._vMerge;
				});
				row.children.forEach(function(cell) {
					delete cell._vMerge;
				});
			});
			return elementResult(rows);
		}
		function removeVMergeProperties(rows) {
			rows.forEach(function(row) {
				transforms.getDescendantsOfType(row, documents.types.tableCell).forEach(function(cell) {
					delete cell._vMerge;
				});
			});
		}
		function readDrawingElement(element) {
			return combineResults(element.getElementsByTagName("a:graphic").getElementsByTagName("a:graphicData").getElementsByTagName("pic:pic").getElementsByTagName("pic:blipFill").getElementsByTagName("a:blip").map(readBlip.bind(null, element)));
		}
		function readBlip(element, blip) {
			var propertiesElement = element.firstOrEmpty("wp:docPr");
			var properties = propertiesElement.attributes;
			var altText = isBlank(properties.descr) ? properties.title : properties.descr;
			var blipImageFile = findBlipImageFile(blip);
			if (blipImageFile === null) return emptyResultWithMessages([warning("Could not find image file for a:blip element")]);
			return readImage(blipImageFile, altText).map(function(imageElement) {
				var relationshipId = propertiesElement.firstOrEmpty("a:hlinkClick").attributes["r:id"];
				if (relationshipId) {
					var href = relationships.findTargetByRelationshipId(relationshipId);
					return new documents.Hyperlink([imageElement], { href });
				} else return imageElement;
			});
		}
		function isBlank(value) {
			return value == null || /^\s*$/.test(value);
		}
		function findBlipImageFile(blip) {
			var embedRelationshipId = blip.attributes["r:embed"];
			var linkRelationshipId = blip.attributes["r:link"];
			if (embedRelationshipId) return findEmbeddedImageFile(embedRelationshipId);
			else if (linkRelationshipId) {
				var imagePath = relationships.findTargetByRelationshipId(linkRelationshipId);
				return {
					path: imagePath,
					read: files.read.bind(files, imagePath)
				};
			} else return null;
		}
		function readImageData(element) {
			var relationshipId = element.attributes["r:id"];
			if (relationshipId) return readImage(findEmbeddedImageFile(relationshipId), element.attributes["o:title"]);
			else return emptyResultWithMessages([warning("A v:imagedata element without a relationship ID was ignored")]);
		}
		function findEmbeddedImageFile(relationshipId) {
			var path = uris.uriToZipEntryName("word", relationships.findTargetByRelationshipId(relationshipId));
			return {
				path,
				read: docxFile.read.bind(docxFile, path)
			};
		}
		function readImage(imageFile, altText) {
			var contentType = contentTypes.findContentType(imageFile.path);
			return elementResultWithMessages(documents.Image({
				readImage: imageFile.read,
				altText,
				contentType
			}), supportedImageTypes[contentType] ? [] : warning("Image of type " + contentType + " is unlikely to display in web browsers"));
		}
		function undefinedStyleWarning(type, styleId) {
			return warning(type + " style with ID " + styleId + " was referenced but not defined in the document");
		}
	}
	function readNumberingProperties(styleId, element, numbering) {
		var level = element.firstOrEmpty("w:ilvl").attributes["w:val"];
		var numId = element.firstOrEmpty("w:numId").attributes["w:val"];
		if (level !== void 0 && numId !== void 0) return numbering.findLevel(numId, level);
		if (styleId != null) {
			var levelByStyleId = numbering.findLevelByParagraphStyleId(styleId);
			if (levelByStyleId != null) return levelByStyleId;
		}
		if (numId !== void 0) return numbering.findLevel(numId, "0");
		return null;
	}
	var supportedImageTypes = {
		"image/png": true,
		"image/gif": true,
		"image/jpeg": true,
		"image/svg+xml": true,
		"image/tiff": true
	};
	var ignoreElements = {
		"office-word:wrap": true,
		"v:shadow": true,
		"v:shapetype": true,
		"w:annotationRef": true,
		"w:bookmarkEnd": true,
		"w:sectPr": true,
		"w:proofErr": true,
		"w:lastRenderedPageBreak": true,
		"w:commentRangeStart": true,
		"w:commentRangeEnd": true,
		"w:del": true,
		"w:footnoteRef": true,
		"w:endnoteRef": true,
		"w:pPr": true,
		"w:rPr": true,
		"w:tblPr": true,
		"w:tblGrid": true,
		"w:trPr": true,
		"w:tcPr": true
	};
	function emptyResultWithMessages(messages) {
		return new ReadResult(null, null, messages);
	}
	function emptyResult() {
		return new ReadResult(null);
	}
	function elementResult(element) {
		return new ReadResult(element);
	}
	function elementResultWithMessages(element, messages) {
		return new ReadResult(element, null, messages);
	}
	function ReadResult(element, extra, messages) {
		this.value = element || [];
		this.extra = extra || [];
		this._result = new Result({
			element: this.value,
			extra
		}, messages);
		this.messages = this._result.messages;
	}
	ReadResult.prototype.toExtra = function() {
		return new ReadResult(null, joinElements(this.extra, this.value), this.messages);
	};
	ReadResult.prototype.insertExtra = function() {
		var extra = this.extra;
		if (extra && extra.length) return new ReadResult(joinElements(this.value, extra), null, this.messages);
		else return this;
	};
	ReadResult.prototype.map = function(func) {
		var result = this._result.map(function(value) {
			return func(value.element);
		});
		return new ReadResult(result.value, this.extra, result.messages);
	};
	ReadResult.prototype.flatMap = function(func) {
		var result = this._result.flatMap(function(value) {
			return func(value.element)._result;
		});
		return new ReadResult(result.value.element, joinElements(this.extra, result.value.extra), result.messages);
	};
	ReadResult.map = function(first, second, func) {
		return new ReadResult(func(first.value, second.value), joinElements(first.extra, second.extra), first.messages.concat(second.messages));
	};
	function combineResults(results) {
		var result = Result.combine(_.pluck(results, "_result"));
		return new ReadResult(_.flatten(_.pluck(result.value, "element")), _.filter(_.flatten(_.pluck(result.value, "extra")), identity), result.messages);
	}
	function joinElements(first, second) {
		return _.flatten([first, second]);
	}
	function identity(value) {
		return value;
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/document-xml-reader.js
var require_document_xml_reader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.DocumentXmlReader = DocumentXmlReader;
	var documents = require_documents();
	var Result = require_results().Result;
	function DocumentXmlReader(options) {
		var bodyReader = options.bodyReader;
		function convertXmlToDocument(element) {
			var body = element.first("w:body");
			if (body == null) throw new Error("Could not find the body element: are you sure this is a docx file?");
			var result = bodyReader.readXmlElements(body.children).map(function(children) {
				return new documents.Document(children, {
					notes: options.notes,
					comments: options.comments
				});
			});
			return new Result(result.value, result.messages);
		}
		return { convertXmlToDocument };
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/relationships-reader.js
var require_relationships_reader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.readRelationships = readRelationships;
	exports.defaultValue = new Relationships([]);
	exports.Relationships = Relationships;
	function readRelationships(element) {
		var relationships = [];
		element.children.forEach(function(child) {
			if (child.name === "relationships:Relationship") {
				var relationship = {
					relationshipId: child.attributes.Id,
					target: child.attributes.Target,
					type: child.attributes.Type
				};
				relationships.push(relationship);
			}
		});
		return new Relationships(relationships);
	}
	function Relationships(relationships) {
		var targetsByRelationshipId = {};
		relationships.forEach(function(relationship) {
			targetsByRelationshipId[relationship.relationshipId] = relationship.target;
		});
		var targetsByType = {};
		relationships.forEach(function(relationship) {
			if (!targetsByType[relationship.type]) targetsByType[relationship.type] = [];
			targetsByType[relationship.type].push(relationship.target);
		});
		return {
			findTargetByRelationshipId: function(relationshipId) {
				return targetsByRelationshipId[relationshipId];
			},
			findTargetsByType: function(type) {
				return targetsByType[type] || [];
			}
		};
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/content-types-reader.js
var require_content_types_reader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.readContentTypesFromXml = readContentTypesFromXml;
	var fallbackContentTypes = {
		"png": "png",
		"gif": "gif",
		"jpeg": "jpeg",
		"jpg": "jpeg",
		"tif": "tiff",
		"tiff": "tiff",
		"bmp": "bmp"
	};
	exports.defaultContentTypes = contentTypes({}, {});
	function readContentTypesFromXml(element) {
		var extensionDefaults = {};
		var overrides = {};
		element.children.forEach(function(child) {
			if (child.name === "content-types:Default") extensionDefaults[child.attributes.Extension] = child.attributes.ContentType;
			if (child.name === "content-types:Override") {
				var name = child.attributes.PartName;
				if (name.charAt(0) === "/") name = name.substring(1);
				overrides[name] = child.attributes.ContentType;
			}
		});
		return contentTypes(overrides, extensionDefaults);
	}
	function contentTypes(overrides, extensionDefaults) {
		return { findContentType: function(path) {
			var overrideContentType = overrides[path];
			if (overrideContentType) return overrideContentType;
			else {
				var pathParts = path.split(".");
				var extension = pathParts[pathParts.length - 1];
				if (extensionDefaults.hasOwnProperty(extension)) return extensionDefaults[extension];
				else {
					var fallback = fallbackContentTypes[extension.toLowerCase()];
					if (fallback) return "image/" + fallback;
					else return null;
				}
			}
		} };
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/numbering-xml.js
var require_numbering_xml = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	exports.readNumberingXml = readNumberingXml;
	exports.Numbering = Numbering;
	exports.defaultNumbering = new Numbering({}, {});
	function Numbering(nums, abstractNums, styles) {
		var allLevels = _.flatten(_.values(abstractNums).map(function(abstractNum) {
			return _.values(abstractNum.levels);
		}));
		var levelsByParagraphStyleId = _.indexBy(allLevels.filter(function(level) {
			return level.paragraphStyleId != null;
		}), "paragraphStyleId");
		function findLevel(numId, level) {
			var num = nums[numId];
			if (num) {
				var abstractNum = abstractNums[num.abstractNumId];
				if (!abstractNum) return null;
				else if (abstractNum.numStyleLink == null) return abstractNums[num.abstractNumId].levels[level];
				else return findLevel(styles.findNumberingStyleById(abstractNum.numStyleLink).numId, level);
			} else return null;
		}
		function findLevelByParagraphStyleId(styleId) {
			return levelsByParagraphStyleId[styleId] || null;
		}
		return {
			findLevel,
			findLevelByParagraphStyleId
		};
	}
	function readNumberingXml(root, options) {
		if (!options || !options.styles) throw new Error("styles is missing");
		var abstractNums = readAbstractNums(root);
		return new Numbering(readNums(root, abstractNums), abstractNums, options.styles);
	}
	function readAbstractNums(root) {
		var abstractNums = {};
		root.getElementsByTagName("w:abstractNum").forEach(function(element) {
			var id = element.attributes["w:abstractNumId"];
			abstractNums[id] = readAbstractNum(element);
		});
		return abstractNums;
	}
	function readAbstractNum(element) {
		var levels = {};
		var levelWithoutIndex = null;
		element.getElementsByTagName("w:lvl").forEach(function(levelElement) {
			var levelIndex = levelElement.attributes["w:ilvl"];
			var isOrdered = levelElement.firstOrEmpty("w:numFmt").attributes["w:val"] !== "bullet";
			var paragraphStyleId = levelElement.firstOrEmpty("w:pStyle").attributes["w:val"];
			if (levelIndex === void 0) levelWithoutIndex = {
				isOrdered,
				level: "0",
				paragraphStyleId
			};
			else levels[levelIndex] = {
				isOrdered,
				level: levelIndex,
				paragraphStyleId
			};
		});
		if (levelWithoutIndex !== null && levels[levelWithoutIndex.level] === void 0) levels[levelWithoutIndex.level] = levelWithoutIndex;
		return {
			levels,
			numStyleLink: element.firstOrEmpty("w:numStyleLink").attributes["w:val"]
		};
	}
	function readNums(root) {
		var nums = {};
		root.getElementsByTagName("w:num").forEach(function(element) {
			var numId = element.attributes["w:numId"];
			nums[numId] = { abstractNumId: element.first("w:abstractNumId").attributes["w:val"] };
		});
		return nums;
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/styles-reader.js
var require_styles_reader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.readStylesXml = readStylesXml;
	exports.Styles = Styles;
	exports.defaultStyles = new Styles({}, {});
	function Styles(paragraphStyles, characterStyles, tableStyles, numberingStyles) {
		return {
			findParagraphStyleById: function(styleId) {
				return paragraphStyles[styleId];
			},
			findCharacterStyleById: function(styleId) {
				return characterStyles[styleId];
			},
			findTableStyleById: function(styleId) {
				return tableStyles[styleId];
			},
			findNumberingStyleById: function(styleId) {
				return numberingStyles[styleId];
			}
		};
	}
	Styles.EMPTY = new Styles({}, {}, {}, {});
	function readStylesXml(root) {
		var paragraphStyles = {};
		var characterStyles = {};
		var tableStyles = {};
		var numberingStyles = {};
		var styles = {
			"paragraph": paragraphStyles,
			"character": characterStyles,
			"table": tableStyles,
			"numbering": numberingStyles
		};
		root.getElementsByTagName("w:style").forEach(function(styleElement) {
			var style = readStyleElement(styleElement);
			var styleSet = styles[style.type];
			if (styleSet && styleSet[style.styleId] === void 0) styleSet[style.styleId] = style;
		});
		return new Styles(paragraphStyles, characterStyles, tableStyles, numberingStyles);
	}
	function readStyleElement(styleElement) {
		var type = styleElement.attributes["w:type"];
		if (type === "numbering") return readNumberingStyleElement(type, styleElement);
		else return {
			type,
			styleId: readStyleId(styleElement),
			name: styleName(styleElement)
		};
	}
	function styleName(styleElement) {
		var nameElement = styleElement.first("w:name");
		return nameElement ? nameElement.attributes["w:val"] : null;
	}
	function readNumberingStyleElement(type, styleElement) {
		var styleId = readStyleId(styleElement);
		return {
			type,
			numId: styleElement.firstOrEmpty("w:pPr").firstOrEmpty("w:numPr").firstOrEmpty("w:numId").attributes["w:val"],
			styleId
		};
	}
	function readStyleId(styleElement) {
		return styleElement.attributes["w:styleId"];
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/notes-reader.js
var require_notes_reader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var documents = require_documents();
	var Result = require_results().Result;
	exports.createFootnotesReader = createReader.bind(exports, "footnote");
	exports.createEndnotesReader = createReader.bind(exports, "endnote");
	function createReader(noteType, bodyReader) {
		function readNotesXml(element) {
			return Result.combine(element.getElementsByTagName("w:" + noteType).filter(isFootnoteElement).map(readFootnoteElement));
		}
		function isFootnoteElement(element) {
			var type = element.attributes["w:type"];
			return type !== "continuationSeparator" && type !== "separator";
		}
		function readFootnoteElement(footnoteElement) {
			var id = footnoteElement.attributes["w:id"];
			return bodyReader.readXmlElements(footnoteElement.children).map(function(body) {
				return documents.Note({
					noteType,
					noteId: id,
					body
				});
			});
		}
		return readNotesXml;
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/comments-reader.js
var require_comments_reader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var documents = require_documents();
	var Result = require_results().Result;
	function createCommentsReader(bodyReader) {
		function readCommentsXml(element) {
			return Result.combine(element.getElementsByTagName("w:comment").map(readCommentElement));
		}
		function readCommentElement(element) {
			var id = element.attributes["w:id"];
			function readOptionalAttribute(name) {
				return (element.attributes[name] || "").trim() || null;
			}
			return bodyReader.readXmlElements(element.children).map(function(body) {
				return documents.comment({
					commentId: id,
					body,
					authorName: readOptionalAttribute("w:author"),
					authorInitials: readOptionalAttribute("w:initials")
				});
			});
		}
		return readCommentsXml;
	}
	exports.createCommentsReader = createCommentsReader;
}));
//#endregion
//#region node_modules/path-is-absolute/index.js
var require_path_is_absolute = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	function posix(path) {
		return path.charAt(0) === "/";
	}
	function win32(path) {
		var result = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/.exec(path);
		var device = result[1] || "";
		var isUnc = Boolean(device && device.charAt(1) !== ":");
		return Boolean(result[2] || isUnc);
	}
	module.exports = process.platform === "win32" ? win32 : posix;
	module.exports.posix = posix;
	module.exports.win32 = win32;
}));
//#endregion
//#region node_modules/mammoth/lib/docx/files.js
var require_files = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var fs$1 = require("fs");
	var url = require("url");
	var os = require("os");
	var dirname = require("path").dirname;
	var resolvePath = require("path").resolve;
	var isAbsolutePath = require_path_is_absolute();
	var promises = require_promises();
	exports.Files = Files;
	exports.uriToPath = uriToPath;
	function Files(options) {
		options = options || {};
		if (!options.externalFileAccess) return { read: function(uri) {
			return promises.reject(/* @__PURE__ */ new Error("could not read external image '" + uri + "', external file access is disabled"));
		} };
		var base = options.relativeToFile ? dirname(options.relativeToFile) : null;
		function read(uri, encoding) {
			return resolveUri(uri).then(function(path) {
				return readFile(path, encoding).caught(function(error) {
					var message = "could not open external image: '" + uri + "' (document directory: '" + base + "')\n" + error.message;
					return promises.reject(new Error(message));
				});
			});
		}
		function resolveUri(uri) {
			var path = uriToPath(uri);
			if (isAbsolutePath(path)) return promises.resolve(path);
			else if (base) return promises.resolve(resolvePath(base, path));
			else return promises.reject(/* @__PURE__ */ new Error("could not find external image '" + uri + "', path of input document is unknown"));
		}
		return { read };
	}
	var readFile = promises.promisify(fs$1.readFile.bind(fs$1));
	function uriToPath(uriString, platform) {
		if (!platform) platform = os.platform();
		var uri = url.parse(uriString);
		if (isLocalFileUri(uri) || isRelativeUri(uri)) {
			var path = decodeURIComponent(uri.path);
			if (platform === "win32" && /^\/[a-z]:/i.test(path)) return path.slice(1);
			else return path;
		} else throw new Error("Could not convert URI to path: " + uriString);
	}
	function isLocalFileUri(uri) {
		return uri.protocol === "file:" && (!uri.host || uri.host === "localhost");
	}
	function isRelativeUri(uri) {
		return !uri.protocol && !uri.host;
	}
}));
//#endregion
//#region node_modules/mammoth/lib/docx/docx-reader.js
var require_docx_reader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.read = read;
	exports._findPartPaths = findPartPaths;
	var promises = require_promises();
	var documents = require_documents();
	var Result = require_results().Result;
	var zipfile = require_zipfile();
	var readXmlFromZipFile = require_office_xml_reader().readXmlFromZipFile;
	var createBodyReader = require_body_reader().createBodyReader;
	var DocumentXmlReader = require_document_xml_reader().DocumentXmlReader;
	var relationshipsReader = require_relationships_reader();
	var contentTypesReader = require_content_types_reader();
	var numberingXml = require_numbering_xml();
	var stylesReader = require_styles_reader();
	var notesReader = require_notes_reader();
	var commentsReader = require_comments_reader();
	var Files = require_files().Files;
	function read(docxFile, input, options) {
		input = input || {};
		options = options || {};
		var files = new Files({
			externalFileAccess: options.externalFileAccess,
			relativeToFile: input.path
		});
		return promises.props({
			contentTypes: readContentTypesFromZipFile(docxFile),
			partPaths: findPartPaths(docxFile),
			docxFile,
			files
		}).also(function(result) {
			return { styles: readStylesFromZipFile(docxFile, result.partPaths.styles) };
		}).also(function(result) {
			return { numbering: readNumberingFromZipFile(docxFile, result.partPaths.numbering, result.styles) };
		}).also(function(result) {
			return {
				footnotes: readXmlFileWithBody(result.partPaths.footnotes, result, function(bodyReader, xml) {
					if (xml) return notesReader.createFootnotesReader(bodyReader)(xml);
					else return new Result([]);
				}),
				endnotes: readXmlFileWithBody(result.partPaths.endnotes, result, function(bodyReader, xml) {
					if (xml) return notesReader.createEndnotesReader(bodyReader)(xml);
					else return new Result([]);
				}),
				comments: readXmlFileWithBody(result.partPaths.comments, result, function(bodyReader, xml) {
					if (xml) return commentsReader.createCommentsReader(bodyReader)(xml);
					else return new Result([]);
				})
			};
		}).also(function(result) {
			return { notes: result.footnotes.flatMap(function(footnotes) {
				return result.endnotes.map(function(endnotes) {
					return new documents.Notes(footnotes.concat(endnotes));
				});
			}) };
		}).then(function(result) {
			return readXmlFileWithBody(result.partPaths.mainDocument, result, function(bodyReader, xml) {
				return result.notes.flatMap(function(notes) {
					return result.comments.flatMap(function(comments) {
						return new DocumentXmlReader({
							bodyReader,
							notes,
							comments
						}).convertXmlToDocument(xml);
					});
				});
			});
		});
	}
	function findPartPaths(docxFile) {
		return readPackageRelationships(docxFile).then(function(packageRelationships) {
			var mainDocumentPath = findPartPath({
				docxFile,
				relationships: packageRelationships,
				relationshipType: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
				basePath: "",
				fallbackPath: "word/document.xml"
			});
			if (!docxFile.exists(mainDocumentPath)) throw new Error("Could not find main document part. Are you sure this is a valid .docx file?");
			return xmlFileReader({
				filename: relationshipsFilename(mainDocumentPath),
				readElement: relationshipsReader.readRelationships,
				defaultValue: relationshipsReader.defaultValue
			})(docxFile).then(function(documentRelationships) {
				function findPartRelatedToMainDocument(name) {
					return findPartPath({
						docxFile,
						relationships: documentRelationships,
						relationshipType: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/" + name,
						basePath: zipfile.splitPath(mainDocumentPath).dirname,
						fallbackPath: "word/" + name + ".xml"
					});
				}
				return {
					mainDocument: mainDocumentPath,
					comments: findPartRelatedToMainDocument("comments"),
					endnotes: findPartRelatedToMainDocument("endnotes"),
					footnotes: findPartRelatedToMainDocument("footnotes"),
					numbering: findPartRelatedToMainDocument("numbering"),
					styles: findPartRelatedToMainDocument("styles")
				};
			});
		});
	}
	function findPartPath(options) {
		var docxFile = options.docxFile;
		var relationships = options.relationships;
		var relationshipType = options.relationshipType;
		var basePath = options.basePath;
		var fallbackPath = options.fallbackPath;
		var validTargets = relationships.findTargetsByType(relationshipType).map(function(target) {
			return stripPrefix(zipfile.joinPath(basePath, target), "/");
		}).filter(function(target) {
			return docxFile.exists(target);
		});
		if (validTargets.length === 0) return fallbackPath;
		else return validTargets[0];
	}
	function stripPrefix(value, prefix) {
		if (value.substring(0, prefix.length) === prefix) return value.substring(prefix.length);
		else return value;
	}
	function xmlFileReader(options) {
		return function(zipFile) {
			return readXmlFromZipFile(zipFile, options.filename).then(function(element) {
				return element ? options.readElement(element) : options.defaultValue;
			});
		};
	}
	function readXmlFileWithBody(filename, options, func) {
		return xmlFileReader({
			filename: relationshipsFilename(filename),
			readElement: relationshipsReader.readRelationships,
			defaultValue: relationshipsReader.defaultValue
		})(options.docxFile).then(function(relationships) {
			var bodyReader = new createBodyReader({
				relationships,
				contentTypes: options.contentTypes,
				docxFile: options.docxFile,
				numbering: options.numbering,
				styles: options.styles,
				files: options.files
			});
			return readXmlFromZipFile(options.docxFile, filename).then(function(xml) {
				return func(bodyReader, xml);
			});
		});
	}
	function relationshipsFilename(filename) {
		var split = zipfile.splitPath(filename);
		return zipfile.joinPath(split.dirname, "_rels", split.basename + ".rels");
	}
	var readContentTypesFromZipFile = xmlFileReader({
		filename: "[Content_Types].xml",
		readElement: contentTypesReader.readContentTypesFromXml,
		defaultValue: contentTypesReader.defaultContentTypes
	});
	function readNumberingFromZipFile(zipFile, path, styles) {
		return xmlFileReader({
			filename: path,
			readElement: function(element) {
				return numberingXml.readNumberingXml(element, { styles });
			},
			defaultValue: numberingXml.defaultNumbering
		})(zipFile);
	}
	function readStylesFromZipFile(zipFile, path) {
		return xmlFileReader({
			filename: path,
			readElement: stylesReader.readStylesXml,
			defaultValue: stylesReader.defaultStyles
		})(zipFile);
	}
	var readPackageRelationships = xmlFileReader({
		filename: "_rels/.rels",
		readElement: relationshipsReader.readRelationships,
		defaultValue: relationshipsReader.defaultValue
	});
}));
//#endregion
//#region node_modules/mammoth/lib/docx/style-map.js
var require_style_map = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	var promises = require_promises();
	var xml = require_xml();
	exports.writeStyleMap = writeStyleMap;
	exports.readStyleMap = readStyleMap;
	var schema = "http://schemas.zwobble.org/mammoth/style-map";
	var styleMapPath = "mammoth/style-map";
	var styleMapAbsolutePath = "/" + styleMapPath;
	function writeStyleMap(docxFile, styleMap) {
		docxFile.write(styleMapPath, styleMap);
		return updateRelationships(docxFile).then(function() {
			return updateContentTypes(docxFile);
		});
	}
	function updateRelationships(docxFile) {
		var path = "word/_rels/document.xml.rels";
		var relationshipsUri = "http://schemas.openxmlformats.org/package/2006/relationships";
		var relationshipElementName = "{" + relationshipsUri + "}Relationship";
		return docxFile.read(path, "utf8").then(xml.readString).then(function(relationshipsContainer) {
			var relationships = relationshipsContainer.children;
			addOrUpdateElement(relationships, relationshipElementName, "Id", {
				"Id": "rMammothStyleMap",
				"Type": schema,
				"Target": styleMapAbsolutePath
			});
			var namespaces = { "": relationshipsUri };
			return docxFile.write(path, xml.writeString(relationshipsContainer, namespaces));
		});
	}
	function updateContentTypes(docxFile) {
		var path = "[Content_Types].xml";
		var contentTypesUri = "http://schemas.openxmlformats.org/package/2006/content-types";
		var overrideName = "{" + contentTypesUri + "}Override";
		return docxFile.read(path, "utf8").then(xml.readString).then(function(typesElement) {
			var children = typesElement.children;
			addOrUpdateElement(children, overrideName, "PartName", {
				"PartName": styleMapAbsolutePath,
				"ContentType": "text/prs.mammoth.style-map"
			});
			var namespaces = { "": contentTypesUri };
			return docxFile.write(path, xml.writeString(typesElement, namespaces));
		});
	}
	function addOrUpdateElement(elements, name, identifyingAttribute, attributes) {
		var existingElement = _.find(elements, function(element) {
			return element.name === name && element.attributes[identifyingAttribute] === attributes[identifyingAttribute];
		});
		if (existingElement) existingElement.attributes = attributes;
		else elements.push(xml.element(name, attributes));
	}
	function readStyleMap(docxFile) {
		if (docxFile.exists(styleMapPath)) return docxFile.read(styleMapPath, "utf8");
		else return promises.resolve(null);
	}
}));
//#endregion
//#region node_modules/mammoth/lib/html/ast.js
var require_ast = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var htmlPaths = require_html_paths();
	function nonFreshElement(tagName, attributes, children) {
		return elementWithTag(htmlPaths.element(tagName, attributes, { fresh: false }), children);
	}
	function freshElement(tagName, attributes, children) {
		return elementWithTag(htmlPaths.element(tagName, attributes, { fresh: true }), children);
	}
	function elementWithTag(tag, children) {
		return {
			type: "element",
			tag,
			children: children || []
		};
	}
	function text(value) {
		return {
			type: "text",
			value
		};
	}
	var forceWrite = { type: "forceWrite" };
	exports.freshElement = freshElement;
	exports.nonFreshElement = nonFreshElement;
	exports.elementWithTag = elementWithTag;
	exports.text = text;
	exports.forceWrite = forceWrite;
	var voidTagNames = {
		"br": true,
		"hr": true,
		"img": true,
		"input": true
	};
	function isVoidElement(node) {
		return node.children.length === 0 && voidTagNames[node.tag.tagName];
	}
	exports.isVoidElement = isVoidElement;
}));
//#endregion
//#region node_modules/mammoth/lib/html/simplify.js
var require_simplify = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var _ = require_underscore_node();
	var ast = require_ast();
	function simplify(nodes) {
		return collapse(removeEmpty(nodes));
	}
	function collapse(nodes) {
		var children = [];
		nodes.map(collapseNode).forEach(function(child) {
			appendChild(children, child);
		});
		return children;
	}
	function collapseNode(node) {
		return collapsers[node.type](node);
	}
	var collapsers = {
		element: collapseElement,
		text: identity,
		forceWrite: identity
	};
	function collapseElement(node) {
		return ast.elementWithTag(node.tag, collapse(node.children));
	}
	function identity(value) {
		return value;
	}
	function appendChild(children, child) {
		var lastChild = children[children.length - 1];
		if (child.type === "element" && !child.tag.fresh && lastChild && lastChild.type === "element" && child.tag.matchesElement(lastChild.tag)) {
			if (child.tag.separator) appendChild(lastChild.children, ast.text(child.tag.separator));
			child.children.forEach(function(grandChild) {
				appendChild(lastChild.children, grandChild);
			});
		} else children.push(child);
	}
	function removeEmpty(nodes) {
		return flatMap(nodes, function(node) {
			return emptiers[node.type](node);
		});
	}
	function flatMap(values, func) {
		return _.flatten(_.map(values, func), true);
	}
	var emptiers = {
		element: elementEmptier,
		text: textEmptier,
		forceWrite: neverEmpty
	};
	function neverEmpty(node) {
		return [node];
	}
	function elementEmptier(element) {
		var children = removeEmpty(element.children);
		if (children.length === 0 && !ast.isVoidElement(element)) return [];
		else return [ast.elementWithTag(element.tag, children)];
	}
	function textEmptier(node) {
		if (node.value.length === 0) return [];
		else return [node];
	}
	module.exports = simplify;
}));
//#endregion
//#region node_modules/mammoth/lib/html/index.js
var require_html = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var ast = require_ast();
	exports.freshElement = ast.freshElement;
	exports.nonFreshElement = ast.nonFreshElement;
	exports.elementWithTag = ast.elementWithTag;
	exports.text = ast.text;
	exports.forceWrite = ast.forceWrite;
	exports.simplify = require_simplify();
	function write(writer, nodes) {
		nodes.forEach(function(node) {
			writeNode(writer, node);
		});
	}
	function writeNode(writer, node) {
		toStrings[node.type](writer, node);
	}
	var toStrings = {
		element: generateElementString,
		text: generateTextString,
		forceWrite: function() {}
	};
	function generateElementString(writer, node) {
		if (ast.isVoidElement(node)) writer.selfClosing(node.tag.tagName, node.tag.attributes);
		else {
			writer.open(node.tag.tagName, node.tag.attributes);
			write(writer, node.children);
			writer.close(node.tag.tagName);
		}
	}
	function generateTextString(writer, node) {
		writer.text(node.value);
	}
	exports.write = write;
}));
//#endregion
//#region node_modules/mammoth/lib/styles/html-paths.js
var require_html_paths = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	var html = require_html();
	exports.topLevelElement = topLevelElement;
	exports.elements = elements;
	exports.element = element;
	function topLevelElement(tagName, attributes) {
		return elements([element(tagName, attributes, { fresh: true })]);
	}
	function elements(elementStyles) {
		return new HtmlPath(elementStyles.map(function(elementStyle) {
			if (_.isString(elementStyle)) return element(elementStyle);
			else return elementStyle;
		}));
	}
	function HtmlPath(elements) {
		this._elements = elements;
	}
	HtmlPath.prototype.wrap = function wrap(children) {
		var result = children();
		for (var index = this._elements.length - 1; index >= 0; index--) result = this._elements[index].wrapNodes(result);
		return result;
	};
	function element(tagName, attributes, options) {
		options = options || {};
		return new Element(tagName, attributes, options);
	}
	function Element(tagName, attributes, options) {
		var tagNames = {};
		if (_.isArray(tagName)) {
			tagName.forEach(function(tagName) {
				tagNames[tagName] = true;
			});
			tagName = tagName[0];
		} else tagNames[tagName] = true;
		this.tagName = tagName;
		this.tagNames = tagNames;
		this.attributes = attributes || {};
		this.fresh = options.fresh;
		this.separator = options.separator;
	}
	Element.prototype.matchesElement = function(element) {
		return this.tagNames[element.tagName] && _.isEqual(this.attributes || {}, element.attributes || {});
	};
	Element.prototype.wrap = function wrap(generateNodes) {
		return this.wrapNodes(generateNodes());
	};
	Element.prototype.wrapNodes = function wrapNodes(nodes) {
		return [html.elementWithTag(this, nodes)];
	};
	exports.empty = elements([]);
	exports.ignore = { wrap: function() {
		return [];
	} };
}));
//#endregion
//#region node_modules/mammoth/lib/images.js
var require_images = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	var promises = require_promises();
	var Html = require_html();
	exports.imgElement = imgElement;
	function imgElement(func) {
		return function(element, messages) {
			return promises.when(func(element)).then(function(result) {
				var attributes = {};
				if (element.altText) attributes.alt = element.altText;
				_.extend(attributes, result);
				return [Html.freshElement("img", attributes)];
			});
		};
	}
	exports.inline = exports.imgElement;
	exports.dataUri = imgElement(function(element) {
		return element.readAsBase64String().then(function(imageBuffer) {
			return { src: "data:" + element.contentType + ";base64," + imageBuffer };
		});
	});
}));
//#endregion
//#region node_modules/mammoth/lib/writers/html-writer.js
var require_html_writer = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	exports.writer = writer;
	function writer(options) {
		options = options || {};
		if (options.prettyPrint) return prettyWriter();
		else return simpleWriter();
	}
	var indentedElements = {
		div: true,
		p: true,
		ul: true,
		li: true
	};
	function prettyWriter() {
		var indentationLevel = 0;
		var indentation = "  ";
		var stack = [];
		var start = true;
		var inText = false;
		var writer = simpleWriter();
		function open(tagName, attributes) {
			if (indentedElements[tagName]) indent();
			stack.push(tagName);
			writer.open(tagName, attributes);
			if (indentedElements[tagName]) indentationLevel++;
			start = false;
		}
		function close(tagName) {
			if (indentedElements[tagName]) {
				indentationLevel--;
				indent();
			}
			stack.pop();
			writer.close(tagName);
		}
		function text(value) {
			startText();
			var text = isInPre() ? value : value.replace("\n", "\n" + indentation);
			writer.text(text);
		}
		function selfClosing(tagName, attributes) {
			indent();
			writer.selfClosing(tagName, attributes);
		}
		function insideIndentedElement() {
			return stack.length === 0 || indentedElements[stack[stack.length - 1]];
		}
		function startText() {
			if (!inText) {
				indent();
				inText = true;
			}
		}
		function indent() {
			inText = false;
			if (!start && insideIndentedElement() && !isInPre()) {
				writer._append("\n");
				for (var i = 0; i < indentationLevel; i++) writer._append(indentation);
			}
		}
		function isInPre() {
			return _.some(stack, function(tagName) {
				return tagName === "pre";
			});
		}
		return {
			asString: writer.asString,
			open,
			close,
			text,
			selfClosing
		};
	}
	function simpleWriter() {
		var fragments = [];
		function open(tagName, attributes) {
			var attributeString = generateAttributeString(attributes);
			fragments.push("<" + tagName + attributeString + ">");
		}
		function close(tagName) {
			fragments.push("</" + tagName + ">");
		}
		function selfClosing(tagName, attributes) {
			var attributeString = generateAttributeString(attributes);
			fragments.push("<" + tagName + attributeString + " />");
		}
		function generateAttributeString(attributes) {
			return _.map(attributes, function(value, key) {
				return " " + key + "=\"" + escapeHtmlAttribute(value) + "\"";
			}).join("");
		}
		function text(value) {
			fragments.push(escapeHtmlText(value));
		}
		function append(html) {
			fragments.push(html);
		}
		function asString() {
			return fragments.join("");
		}
		return {
			asString,
			open,
			close,
			text,
			selfClosing,
			_append: append
		};
	}
	function escapeHtmlText(value) {
		return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}
	function escapeHtmlAttribute(value) {
		return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}
}));
//#endregion
//#region node_modules/mammoth/lib/writers/markdown-writer.js
var require_markdown_writer = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	function symmetricMarkdownElement(end) {
		return markdownElement(end, end);
	}
	function markdownElement(start, end) {
		return function() {
			return {
				start,
				end
			};
		};
	}
	function markdownLink(attributes) {
		var href = attributes.href || "";
		if (href) return {
			start: "[",
			end: "](" + href + ")",
			anchorPosition: "before"
		};
		else return {};
	}
	function markdownImage(attributes) {
		var src = attributes.src || "";
		var altText = attributes.alt || "";
		if (src || altText) return { start: "![" + altText + "](" + src + ")" };
		else return {};
	}
	function markdownList(options) {
		return function(attributes, list) {
			return {
				start: list ? "\n" : "",
				end: list ? "" : "\n",
				list: {
					isOrdered: options.isOrdered,
					indent: list ? list.indent + 1 : 0,
					count: 0
				}
			};
		};
	}
	function markdownListItem(attributes, list, listItem) {
		list = list || {
			indent: 0,
			isOrdered: false,
			count: 0
		};
		list.count++;
		listItem.hasClosed = false;
		var bullet = list.isOrdered ? list.count + "." : "-";
		return {
			start: repeatString("	", list.indent) + bullet + " ",
			end: function() {
				if (!listItem.hasClosed) {
					listItem.hasClosed = true;
					return "\n";
				}
			}
		};
	}
	var htmlToMarkdown = {
		"p": markdownElement("", "\n\n"),
		"br": markdownElement("", "  \n"),
		"ul": markdownList({ isOrdered: false }),
		"ol": markdownList({ isOrdered: true }),
		"li": markdownListItem,
		"strong": symmetricMarkdownElement("__"),
		"em": symmetricMarkdownElement("*"),
		"a": markdownLink,
		"img": markdownImage
	};
	(function() {
		for (var i = 1; i <= 6; i++) htmlToMarkdown["h" + i] = markdownElement(repeatString("#", i) + " ", "\n\n");
	})();
	function repeatString(value, count) {
		return new Array(count + 1).join(value);
	}
	function markdownWriter() {
		var fragments = [];
		var elementStack = [];
		var list = null;
		var listItem = {};
		function open(tagName, attributes) {
			attributes = attributes || {};
			var element = (htmlToMarkdown[tagName] || function() {
				return {};
			})(attributes, list, listItem);
			elementStack.push({
				end: element.end,
				list
			});
			if (element.list) list = element.list;
			var anchorBeforeStart = element.anchorPosition === "before";
			if (anchorBeforeStart) writeAnchor(attributes);
			fragments.push(element.start || "");
			if (!anchorBeforeStart) writeAnchor(attributes);
		}
		function writeAnchor(attributes) {
			if (attributes.id) fragments.push("<a id=\"" + attributes.id + "\"></a>");
		}
		function close(tagName) {
			var element = elementStack.pop();
			list = element.list;
			var end = _.isFunction(element.end) ? element.end() : element.end;
			fragments.push(end || "");
		}
		function selfClosing(tagName, attributes) {
			open(tagName, attributes);
			close(tagName);
		}
		function text(value) {
			fragments.push(escapeMarkdown(value));
		}
		function asString() {
			return fragments.join("");
		}
		return {
			asString,
			open,
			close,
			text,
			selfClosing
		};
	}
	exports.writer = markdownWriter;
	function escapeMarkdown(value) {
		return value.replace(/\\/g, "\\\\").replace(/([\`\*_\{\}\[\]\(\)\#\+\-\.\!])/g, "\\$1");
	}
}));
//#endregion
//#region node_modules/mammoth/lib/writers/index.js
var require_writers = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var htmlWriter = require_html_writer();
	var markdownWriter = require_markdown_writer();
	exports.writer = writer;
	function writer(options) {
		options = options || {};
		if (options.outputFormat === "markdown") return markdownWriter.writer();
		else return htmlWriter.writer(options);
	}
}));
//#endregion
//#region node_modules/mammoth/lib/document-to-html.js
var require_document_to_html = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	var promises = require_promises();
	var documents = require_documents();
	var htmlPaths = require_html_paths();
	var results = require_results();
	var images = require_images();
	var Html = require_html();
	var writers = require_writers();
	exports.DocumentConverter = DocumentConverter;
	function DocumentConverter(options) {
		return { convertToHtml: function(element) {
			return new DocumentConversion(options, _.indexBy(element.type === documents.types.document ? element.comments : [], "commentId")).convertToHtml(element);
		} };
	}
	function DocumentConversion(options, comments) {
		var noteNumber = 1;
		var noteReferences = [];
		var referencedComments = [];
		options = _.extend({ ignoreEmptyParagraphs: true }, options);
		var idPrefix = options.idPrefix === void 0 ? "" : options.idPrefix;
		var ignoreEmptyParagraphs = options.ignoreEmptyParagraphs;
		var defaultParagraphStyle = htmlPaths.topLevelElement("p");
		var styleMap = options.styleMap || [];
		function convertToHtml(document) {
			var messages = [];
			var html = elementToHtml(document, messages, {});
			var deferredNodes = [];
			walkHtml(html, function(node) {
				if (node.type === "deferred") deferredNodes.push(node);
			});
			var deferredValues = {};
			return promises.mapSeries(deferredNodes, function(deferred) {
				return deferred.value().then(function(value) {
					deferredValues[deferred.id] = value;
				});
			}).then(function() {
				function replaceDeferred(nodes) {
					return flatMap(nodes, function(node) {
						if (node.type === "deferred") return deferredValues[node.id];
						else if (node.children) return [_.extend({}, node, { children: replaceDeferred(node.children) })];
						else return [node];
					});
				}
				var writer = writers.writer({
					prettyPrint: options.prettyPrint,
					outputFormat: options.outputFormat
				});
				Html.write(writer, Html.simplify(replaceDeferred(html)));
				return new results.Result(writer.asString(), messages);
			});
		}
		function convertElements(elements, messages, options) {
			return flatMap(elements, function(element) {
				return elementToHtml(element, messages, options);
			});
		}
		function elementToHtml(element, messages, options) {
			if (!options) throw new Error("options not set");
			var handler = elementConverters[element.type];
			if (handler) return handler(element, messages, options);
			else return [];
		}
		function convertParagraph(element, messages, options) {
			return htmlPathForParagraph(element, messages).wrap(function() {
				var content = convertElements(element.children, messages, options);
				if (ignoreEmptyParagraphs) return content;
				else return [Html.forceWrite].concat(content);
			});
		}
		function htmlPathForParagraph(element, messages) {
			var style = findStyle(element);
			if (style) return style.to;
			else {
				if (element.styleId) messages.push(unrecognisedStyleWarning("paragraph", element));
				return defaultParagraphStyle;
			}
		}
		function convertRun(run, messages, options) {
			var nodes = function() {
				return convertElements(run.children, messages, options);
			};
			var paths = [];
			if (run.highlight !== null) {
				var path = findHtmlPath({
					type: "highlight",
					color: run.highlight
				});
				if (path) paths.push(path);
			}
			if (run.isSmallCaps) paths.push(findHtmlPathForRunProperty("smallCaps"));
			if (run.isAllCaps) paths.push(findHtmlPathForRunProperty("allCaps"));
			if (run.isStrikethrough) paths.push(findHtmlPathForRunProperty("strikethrough", "s"));
			if (run.isUnderline) paths.push(findHtmlPathForRunProperty("underline"));
			if (run.verticalAlignment === documents.verticalAlignment.subscript) paths.push(htmlPaths.element("sub", {}, { fresh: false }));
			if (run.verticalAlignment === documents.verticalAlignment.superscript) paths.push(htmlPaths.element("sup", {}, { fresh: false }));
			if (run.isItalic) paths.push(findHtmlPathForRunProperty("italic", "em"));
			if (run.isBold) paths.push(findHtmlPathForRunProperty("bold", "strong"));
			var stylePath = htmlPaths.empty;
			var style = findStyle(run);
			if (style) stylePath = style.to;
			else if (run.styleId) messages.push(unrecognisedStyleWarning("run", run));
			paths.push(stylePath);
			paths.forEach(function(path) {
				nodes = path.wrap.bind(path, nodes);
			});
			return nodes();
		}
		function findHtmlPathForRunProperty(elementType, defaultTagName) {
			var path = findHtmlPath({ type: elementType });
			if (path) return path;
			else if (defaultTagName) return htmlPaths.element(defaultTagName, {}, { fresh: false });
			else return htmlPaths.empty;
		}
		function findHtmlPath(element, defaultPath) {
			var style = findStyle(element);
			return style ? style.to : defaultPath;
		}
		function findStyle(element) {
			for (var i = 0; i < styleMap.length; i++) if (styleMap[i].from.matches(element)) return styleMap[i];
		}
		function recoveringConvertImage(convertImage) {
			return function(image, messages) {
				return promises.attempt(function() {
					return convertImage(image, messages);
				}).caught(function(error) {
					messages.push(results.error(error));
					return [];
				});
			};
		}
		function noteHtmlId(note) {
			return referentHtmlId(note.noteType, note.noteId);
		}
		function noteRefHtmlId(note) {
			return referenceHtmlId(note.noteType, note.noteId);
		}
		function referentHtmlId(referenceType, referenceId) {
			return htmlId(referenceType + "-" + referenceId);
		}
		function referenceHtmlId(referenceType, referenceId) {
			return htmlId(referenceType + "-ref-" + referenceId);
		}
		function htmlId(suffix) {
			return idPrefix + suffix;
		}
		var defaultTablePath = htmlPaths.elements([htmlPaths.element("table", {}, { fresh: true })]);
		function convertTable(element, messages, options) {
			return findHtmlPath(element, defaultTablePath).wrap(function() {
				return convertTableChildren(element, messages, options);
			});
		}
		function convertTableChildren(element, messages, options) {
			var bodyIndex = _.findIndex(element.children, function(child) {
				return !child.type === documents.types.tableRow || !child.isHeader;
			});
			if (bodyIndex === -1) bodyIndex = element.children.length;
			var children;
			if (bodyIndex === 0) children = convertElements(element.children, messages, _.extend({}, options, { isTableHeader: false }));
			else {
				var headRows = convertElements(element.children.slice(0, bodyIndex), messages, _.extend({}, options, { isTableHeader: true }));
				var bodyRows = convertElements(element.children.slice(bodyIndex), messages, _.extend({}, options, { isTableHeader: false }));
				children = [Html.freshElement("thead", {}, headRows), Html.freshElement("tbody", {}, bodyRows)];
			}
			return [Html.forceWrite].concat(children);
		}
		function convertTableRow(element, messages, options) {
			var children = convertElements(element.children, messages, options);
			return [Html.freshElement("tr", {}, [Html.forceWrite].concat(children))];
		}
		function convertTableCell(element, messages, options) {
			var tagName = options.isTableHeader ? "th" : "td";
			var children = convertElements(element.children, messages, options);
			var attributes = {};
			if (element.colSpan !== 1) attributes.colspan = element.colSpan.toString();
			if (element.rowSpan !== 1) attributes.rowspan = element.rowSpan.toString();
			return [Html.freshElement(tagName, attributes, [Html.forceWrite].concat(children))];
		}
		function convertCommentReference(reference, messages, options) {
			return findHtmlPath(reference, htmlPaths.ignore).wrap(function() {
				var comment = comments[reference.commentId];
				var count = referencedComments.length + 1;
				var label = "[" + commentAuthorLabel(comment) + count + "]";
				referencedComments.push({
					label,
					comment
				});
				return [Html.freshElement("a", {
					href: "#" + referentHtmlId("comment", reference.commentId),
					id: referenceHtmlId("comment", reference.commentId)
				}, [Html.text(label)])];
			});
		}
		function convertComment(referencedComment, messages, options) {
			var label = referencedComment.label;
			var comment = referencedComment.comment;
			var body = convertElements(comment.body, messages, options).concat([Html.nonFreshElement("p", {}, [Html.text(" "), Html.freshElement("a", { "href": "#" + referenceHtmlId("comment", comment.commentId) }, [Html.text("↑")])])]);
			return [Html.freshElement("dt", { "id": referentHtmlId("comment", comment.commentId) }, [Html.text("Comment " + label)]), Html.freshElement("dd", {}, body)];
		}
		function convertBreak(element, messages, options) {
			return htmlPathForBreak(element).wrap(function() {
				return [];
			});
		}
		function htmlPathForBreak(element) {
			var style = findStyle(element);
			if (style) return style.to;
			else if (element.breakType === "line") return htmlPaths.topLevelElement("br");
			else return htmlPaths.empty;
		}
		var elementConverters = {
			"document": function(document, messages, options) {
				var children = convertElements(document.children, messages, options);
				var notesNodes = convertElements(noteReferences.map(function(noteReference) {
					return document.notes.resolve(noteReference);
				}), messages, options);
				return children.concat([Html.freshElement("ol", {}, notesNodes), Html.freshElement("dl", {}, flatMap(referencedComments, function(referencedComment) {
					return convertComment(referencedComment, messages, options);
				}))]);
			},
			"paragraph": convertParagraph,
			"run": convertRun,
			"text": function(element, messages, options) {
				return [Html.text(element.value)];
			},
			"tab": function(element, messages, options) {
				return [Html.text("	")];
			},
			"hyperlink": function(element, messages, options) {
				var attributes = { href: element.anchor ? "#" + htmlId(element.anchor) : element.href };
				if (element.targetFrame != null) attributes.target = element.targetFrame;
				var children = convertElements(element.children, messages, options);
				return [Html.nonFreshElement("a", attributes, children)];
			},
			"checkbox": function(element) {
				var attributes = { type: "checkbox" };
				if (element.checked) attributes["checked"] = "checked";
				return [Html.freshElement("input", attributes)];
			},
			"bookmarkStart": function(element, messages, options) {
				return [Html.freshElement("a", { id: htmlId(element.name) }, [Html.forceWrite])];
			},
			"noteReference": function(element, messages, options) {
				noteReferences.push(element);
				var anchor = Html.freshElement("a", {
					href: "#" + noteHtmlId(element),
					id: noteRefHtmlId(element)
				}, [Html.text("[" + noteNumber++ + "]")]);
				return [Html.freshElement("sup", {}, [anchor])];
			},
			"note": function(element, messages, options) {
				var children = convertElements(element.body, messages, options);
				var backLink = Html.elementWithTag(htmlPaths.element("p", {}, { fresh: false }), [Html.text(" "), Html.freshElement("a", { href: "#" + noteRefHtmlId(element) }, [Html.text("↑")])]);
				var body = children.concat([backLink]);
				return Html.freshElement("li", { id: noteHtmlId(element) }, body);
			},
			"commentReference": convertCommentReference,
			"comment": convertComment,
			"image": deferredConversion(recoveringConvertImage(options.convertImage || images.dataUri)),
			"table": convertTable,
			"tableRow": convertTableRow,
			"tableCell": convertTableCell,
			"break": convertBreak
		};
		return { convertToHtml };
	}
	var deferredId = 1;
	function deferredConversion(func) {
		return function(element, messages, options) {
			return [{
				type: "deferred",
				id: deferredId++,
				value: function() {
					return func(element, messages, options);
				}
			}];
		};
	}
	function unrecognisedStyleWarning(type, element) {
		return results.warning("Unrecognised " + type + " style: '" + element.styleName + "' (Style ID: " + element.styleId + ")");
	}
	function flatMap(values, func) {
		return _.flatten(values.map(func), true);
	}
	function walkHtml(nodes, callback) {
		nodes.forEach(function(node) {
			callback(node);
			if (node.children) walkHtml(node.children, callback);
		});
	}
	var commentAuthorLabel = exports.commentAuthorLabel = function commentAuthorLabel(comment) {
		return comment.authorInitials || "";
	};
}));
//#endregion
//#region node_modules/mammoth/lib/raw-text.js
var require_raw_text = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var documents = require_documents();
	function convertElementToRawText(element) {
		if (element.type === "text") return element.value;
		else if (element.type === documents.types.tab) return "	";
		else {
			var tail = element.type === "paragraph" ? "\n\n" : "";
			return (element.children || []).map(convertElementToRawText).join("") + tail;
		}
	}
	exports.convertElementToRawText = convertElementToRawText;
}));
//#endregion
//#region node_modules/lop/lib/TokenIterator.js
var require_TokenIterator = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var TokenIterator = module.exports = function(tokens, startIndex) {
		this._tokens = tokens;
		this._startIndex = startIndex || 0;
	};
	TokenIterator.prototype.head = function() {
		return this._tokens[this._startIndex];
	};
	TokenIterator.prototype.tail = function(startIndex) {
		return new TokenIterator(this._tokens, this._startIndex + 1);
	};
	TokenIterator.prototype.toArray = function() {
		return this._tokens.slice(this._startIndex);
	};
	TokenIterator.prototype.end = function() {
		return this._tokens[this._tokens.length - 1];
	};
	TokenIterator.prototype.to = function(end) {
		var start = this.head().source;
		var endToken = end.head() || end.end();
		return start.to(endToken.source);
	};
}));
//#endregion
//#region node_modules/lop/lib/parser.js
var require_parser = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var TokenIterator = require_TokenIterator();
	exports.Parser = function(options) {
		var parseTokens = function(parser, tokens) {
			return parser(new TokenIterator(tokens));
		};
		return { parseTokens };
	};
}));
//#endregion
//#region node_modules/option/index.js
var require_option = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.none = Object.create({
		value: function() {
			throw new Error("Called value on none");
		},
		isNone: function() {
			return true;
		},
		isSome: function() {
			return false;
		},
		map: function() {
			return exports.none;
		},
		flatMap: function() {
			return exports.none;
		},
		filter: function() {
			return exports.none;
		},
		toArray: function() {
			return [];
		},
		orElse: callOrReturn,
		valueOrElse: callOrReturn
	});
	function callOrReturn(value) {
		if (typeof value == "function") return value();
		else return value;
	}
	exports.some = function(value) {
		return new Some(value);
	};
	var Some = function(value) {
		this._value = value;
	};
	Some.prototype.value = function() {
		return this._value;
	};
	Some.prototype.isNone = function() {
		return false;
	};
	Some.prototype.isSome = function() {
		return true;
	};
	Some.prototype.map = function(func) {
		return new Some(func(this._value));
	};
	Some.prototype.flatMap = function(func) {
		return func(this._value);
	};
	Some.prototype.filter = function(predicate) {
		return predicate(this._value) ? this : exports.none;
	};
	Some.prototype.toArray = function() {
		return [this._value];
	};
	Some.prototype.orElse = function(value) {
		return this;
	};
	Some.prototype.valueOrElse = function(value) {
		return this._value;
	};
	exports.isOption = function(value) {
		return value === exports.none || value instanceof Some;
	};
	exports.fromNullable = function(value) {
		if (value == null) return exports.none;
		return new Some(value);
	};
}));
//#endregion
//#region node_modules/lop/lib/parsing-results.js
var require_parsing_results = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = {
		failure: function(errors, remaining) {
			if (errors.length < 1) throw new Error("Failure must have errors");
			return new Result({
				status: "failure",
				remaining,
				errors
			});
		},
		error: function(errors, remaining) {
			if (errors.length < 1) throw new Error("Failure must have errors");
			return new Result({
				status: "error",
				remaining,
				errors
			});
		},
		success: function(value, remaining, source) {
			return new Result({
				status: "success",
				value,
				source,
				remaining,
				errors: []
			});
		},
		cut: function(remaining) {
			return new Result({
				status: "cut",
				remaining,
				errors: []
			});
		}
	};
	var Result = function(options) {
		this._value = options.value;
		this._status = options.status;
		this._hasValue = options.value !== void 0;
		this._remaining = options.remaining;
		this._source = options.source;
		this._errors = options.errors;
	};
	Result.prototype.map = function(func) {
		if (this._hasValue) return new Result({
			value: func(this._value, this._source),
			status: this._status,
			remaining: this._remaining,
			source: this._source,
			errors: this._errors
		});
		else return this;
	};
	Result.prototype.changeRemaining = function(remaining) {
		return new Result({
			value: this._value,
			status: this._status,
			remaining,
			source: this._source,
			errors: this._errors
		});
	};
	Result.prototype.isSuccess = function() {
		return this._status === "success" || this._status === "cut";
	};
	Result.prototype.isFailure = function() {
		return this._status === "failure";
	};
	Result.prototype.isError = function() {
		return this._status === "error";
	};
	Result.prototype.isCut = function() {
		return this._status === "cut";
	};
	Result.prototype.value = function() {
		return this._value;
	};
	Result.prototype.remaining = function() {
		return this._remaining;
	};
	Result.prototype.source = function() {
		return this._source;
	};
	Result.prototype.errors = function() {
		return this._errors;
	};
}));
//#endregion
//#region node_modules/lop/lib/errors.js
var require_errors = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.error = function(options) {
		return new Error(options);
	};
	var Error = function(options) {
		this.expected = options.expected;
		this.actual = options.actual;
		this._location = options.location;
	};
	Error.prototype.describe = function() {
		return (this._location ? this._location.describe() + ":\n" : "") + "Expected " + this.expected + "\nbut got " + this.actual;
	};
	Error.prototype.lineNumber = function() {
		return this._location.lineNumber();
	};
	Error.prototype.characterNumber = function() {
		return this._location.characterNumber();
	};
}));
//#endregion
//#region node_modules/lop/lib/lazy-iterators.js
var require_lazy_iterators = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.fromArray = function(array) {
		var index = 0;
		var hasNext = function() {
			return index < array.length;
		};
		return new LazyIterator({
			hasNext,
			next: function() {
				if (!hasNext()) throw new Error("No more elements");
				else return array[index++];
			}
		});
	};
	var LazyIterator = function(iterator) {
		this._iterator = iterator;
	};
	LazyIterator.prototype.map = function(func) {
		var iterator = this._iterator;
		return new LazyIterator({
			hasNext: function() {
				return iterator.hasNext();
			},
			next: function() {
				return func(iterator.next());
			}
		});
	};
	LazyIterator.prototype.filter = function(condition) {
		var iterator = this._iterator;
		var moved = false;
		var hasNext = false;
		var next;
		var moveIfNecessary = function() {
			if (moved) return;
			moved = true;
			hasNext = false;
			while (iterator.hasNext() && !hasNext) {
				next = iterator.next();
				hasNext = condition(next);
			}
		};
		return new LazyIterator({
			hasNext: function() {
				moveIfNecessary();
				return hasNext;
			},
			next: function() {
				moveIfNecessary();
				var toReturn = next;
				moved = false;
				return toReturn;
			}
		});
	};
	LazyIterator.prototype.first = function() {
		var iterator = this._iterator;
		if (this._iterator.hasNext()) return iterator.next();
		else return null;
	};
	LazyIterator.prototype.toArray = function() {
		var result = [];
		while (this._iterator.hasNext()) result.push(this._iterator.next());
		return result;
	};
}));
//#endregion
//#region node_modules/lop/lib/rules.js
var require_rules = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	var options = require_option();
	var results = require_parsing_results();
	var errors = require_errors();
	var lazyIterators = require_lazy_iterators();
	exports.token = function(tokenType, value) {
		var matchValue = value !== void 0;
		return function(input) {
			var token = input.head();
			if (token && token.name === tokenType && (!matchValue || token.value === value)) return results.success(token.value, input.tail(), token.source);
			else return describeTokenMismatch(input, describeToken({
				name: tokenType,
				value
			}));
		};
	};
	exports.tokenOfType = function(tokenType) {
		return exports.token(tokenType);
	};
	exports.firstOf = function(name, parsers) {
		if (!_.isArray(parsers)) parsers = Array.prototype.slice.call(arguments, 1);
		return function(input) {
			return lazyIterators.fromArray(parsers).map(function(parser) {
				return parser(input);
			}).filter(function(result) {
				return result.isSuccess() || result.isError();
			}).first() || describeTokenMismatch(input, name);
		};
	};
	exports.then = function(parser, func) {
		return function(input) {
			var result = parser(input);
			if (!result.map) console.log(result);
			return result.map(func);
		};
	};
	exports.sequence = function() {
		var parsers = Array.prototype.slice.call(arguments, 0);
		var rule = function(input) {
			var result = _.foldl(parsers, function(memo, parser) {
				var result = memo.result;
				var hasCut = memo.hasCut;
				if (!result.isSuccess()) return {
					result,
					hasCut
				};
				var subResult = parser(result.remaining());
				if (subResult.isCut()) return {
					result,
					hasCut: true
				};
				else if (subResult.isSuccess()) {
					var values;
					if (parser.isCaptured) values = result.value().withValue(parser, subResult.value());
					else values = result.value();
					var remaining = subResult.remaining();
					var source = input.to(remaining);
					return {
						result: results.success(values, remaining, source),
						hasCut
					};
				} else if (hasCut) return {
					result: results.error(subResult.errors(), subResult.remaining()),
					hasCut
				};
				else return {
					result: subResult,
					hasCut
				};
			}, {
				result: results.success(new SequenceValues(), input),
				hasCut: false
			}).result;
			var source = input.to(result.remaining());
			return result.map(function(values) {
				return values.withValue(exports.sequence.source, source);
			});
		};
		rule.head = function() {
			var firstCapture = _.find(parsers, isCapturedRule);
			return exports.then(rule, exports.sequence.extract(firstCapture));
		};
		rule.map = function(func) {
			return exports.then(rule, function(result) {
				return func.apply(this, result.toArray());
			});
		};
		function isCapturedRule(subRule) {
			return subRule.isCaptured;
		}
		return rule;
	};
	var SequenceValues = function(values, valuesArray) {
		this._values = values || {};
		this._valuesArray = valuesArray || [];
	};
	SequenceValues.prototype.withValue = function(rule, value) {
		if (rule.captureName && rule.captureName in this._values) throw new Error("Cannot add second value for capture \"" + rule.captureName + "\"");
		else {
			var newValues = _.clone(this._values);
			newValues[rule.captureName] = value;
			return new SequenceValues(newValues, this._valuesArray.concat([value]));
		}
	};
	SequenceValues.prototype.get = function(rule) {
		if (rule.captureName in this._values) return this._values[rule.captureName];
		else throw new Error("No value for capture \"" + rule.captureName + "\"");
	};
	SequenceValues.prototype.toArray = function() {
		return this._valuesArray;
	};
	exports.sequence.capture = function(rule, name) {
		var captureRule = function() {
			return rule.apply(this, arguments);
		};
		captureRule.captureName = name;
		captureRule.isCaptured = true;
		return captureRule;
	};
	exports.sequence.extract = function(rule) {
		return function(result) {
			return result.get(rule);
		};
	};
	exports.sequence.applyValues = function(func) {
		var rules = Array.prototype.slice.call(arguments, 1);
		return function(result) {
			var values = rules.map(function(rule) {
				return result.get(rule);
			});
			return func.apply(this, values);
		};
	};
	exports.sequence.source = { captureName: "☃source☃" };
	exports.sequence.cut = function() {
		return function(input) {
			return results.cut(input);
		};
	};
	exports.optional = function(rule) {
		return function(input) {
			var result = rule(input);
			if (result.isSuccess()) return result.map(options.some);
			else if (result.isFailure()) return results.success(options.none, input);
			else return result;
		};
	};
	exports.zeroOrMoreWithSeparator = function(rule, separator) {
		return repeatedWithSeparator(rule, separator, false);
	};
	exports.oneOrMoreWithSeparator = function(rule, separator) {
		return repeatedWithSeparator(rule, separator, true);
	};
	var zeroOrMore = exports.zeroOrMore = function(rule) {
		return function(input) {
			var values = [];
			var result;
			while ((result = rule(input)) && result.isSuccess()) {
				input = result.remaining();
				values.push(result.value());
			}
			if (result.isError()) return result;
			else return results.success(values, input);
		};
	};
	exports.oneOrMore = function(rule) {
		return exports.oneOrMoreWithSeparator(rule, noOpRule);
	};
	function noOpRule(input) {
		return results.success(null, input);
	}
	var repeatedWithSeparator = function(rule, separator, isOneOrMore) {
		return function(input) {
			var result = rule(input);
			if (result.isSuccess()) {
				var mainRule = exports.sequence.capture(rule, "main");
				var remainingResult = zeroOrMore(exports.then(exports.sequence(separator, mainRule), exports.sequence.extract(mainRule)))(result.remaining());
				return results.success([result.value()].concat(remainingResult.value()), remainingResult.remaining());
			} else if (isOneOrMore || result.isError()) return result;
			else return results.success([], input);
		};
	};
	exports.leftAssociative = function(leftRule, rightRule, func) {
		var rights;
		if (func) rights = [{
			func,
			rule: rightRule
		}];
		else rights = rightRule;
		rights = rights.map(function(right) {
			return exports.then(right.rule, function(rightValue) {
				return function(leftValue, source) {
					return right.func(leftValue, rightValue, source);
				};
			});
		});
		var repeatedRule = exports.firstOf.apply(null, ["rules"].concat(rights));
		return function(input) {
			var start = input;
			var leftResult = leftRule(input);
			if (!leftResult.isSuccess()) return leftResult;
			var repeatedResult = repeatedRule(leftResult.remaining());
			while (repeatedResult.isSuccess()) {
				var remaining = repeatedResult.remaining();
				var source = start.to(repeatedResult.remaining());
				var right = repeatedResult.value();
				leftResult = results.success(right(leftResult.value(), source), remaining, source);
				repeatedResult = repeatedRule(leftResult.remaining());
			}
			if (repeatedResult.isError()) return repeatedResult;
			return leftResult;
		};
	};
	exports.leftAssociative.firstOf = function() {
		return Array.prototype.slice.call(arguments, 0);
	};
	exports.nonConsuming = function(rule) {
		return function(input) {
			return rule(input).changeRemaining(input);
		};
	};
	var describeToken = function(token) {
		if (token.value) return token.name + " \"" + token.value + "\"";
		else return token.name;
	};
	function describeTokenMismatch(input, expected) {
		var error;
		var token = input.head();
		if (token) error = errors.error({
			expected,
			actual: describeToken(token),
			location: token.source
		});
		else error = errors.error({
			expected,
			actual: "end of tokens"
		});
		return results.failure([error], input);
	}
}));
//#endregion
//#region node_modules/lop/lib/StringSource.js
var require_StringSource = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(string, description) {
		return {
			asString: function() {
				return string;
			},
			range: function(startIndex, endIndex) {
				return new StringSourceRange(string, description, startIndex, endIndex);
			}
		};
	};
	var StringSourceRange = function(string, description, startIndex, endIndex) {
		this._string = string;
		this._description = description;
		this._startIndex = startIndex;
		this._endIndex = endIndex;
	};
	StringSourceRange.prototype.to = function(otherRange) {
		return new StringSourceRange(this._string, this._description, this._startIndex, otherRange._endIndex);
	};
	StringSourceRange.prototype.describe = function() {
		var position = this._position();
		return (this._description ? this._description + "\n" : "") + "Line number: " + position.lineNumber + "\nCharacter number: " + position.characterNumber;
	};
	StringSourceRange.prototype.lineNumber = function() {
		return this._position().lineNumber;
	};
	StringSourceRange.prototype.characterNumber = function() {
		return this._position().characterNumber;
	};
	StringSourceRange.prototype._position = function() {
		var self = this;
		var index = 0;
		var nextNewLine = function() {
			return self._string.indexOf("\n", index);
		};
		var lineNumber = 1;
		while (nextNewLine() !== -1 && nextNewLine() < this._startIndex) {
			index = nextNewLine() + 1;
			lineNumber += 1;
		}
		var characterNumber = this._startIndex - index + 1;
		return {
			lineNumber,
			characterNumber
		};
	};
}));
//#endregion
//#region node_modules/lop/lib/Token.js
var require_Token = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = function(name, value, source) {
		this.name = name;
		this.value = value;
		if (source) this.source = source;
	};
}));
//#endregion
//#region node_modules/lop/lib/bottom-up.js
var require_bottom_up = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var rules = require_rules();
	var results = require_parsing_results();
	exports.parser = function(name, prefixRules, infixRuleBuilders) {
		var self = {
			rule,
			leftAssociative,
			rightAssociative
		};
		var infixRules = new InfixRules(infixRuleBuilders.map(createInfixRule));
		var prefixRule = rules.firstOf(name, prefixRules);
		function createInfixRule(infixRuleBuilder) {
			return {
				name: infixRuleBuilder.name,
				rule: lazyRule(infixRuleBuilder.ruleBuilder.bind(null, self))
			};
		}
		function rule() {
			return createRule(infixRules);
		}
		function leftAssociative(name) {
			return createRule(infixRules.untilExclusive(name));
		}
		function rightAssociative(name) {
			return createRule(infixRules.untilInclusive(name));
		}
		function createRule(infixRules) {
			return apply.bind(null, infixRules);
		}
		function apply(infixRules, tokens) {
			var leftResult = prefixRule(tokens);
			if (leftResult.isSuccess()) return infixRules.apply(leftResult);
			else return leftResult;
		}
		return self;
	};
	function InfixRules(infixRules) {
		function untilExclusive(name) {
			return new InfixRules(infixRules.slice(0, ruleNames().indexOf(name)));
		}
		function untilInclusive(name) {
			return new InfixRules(infixRules.slice(0, ruleNames().indexOf(name) + 1));
		}
		function ruleNames() {
			return infixRules.map(function(rule) {
				return rule.name;
			});
		}
		function apply(leftResult) {
			var currentResult;
			var source;
			while (true) {
				currentResult = applyToTokens(leftResult.remaining());
				if (currentResult.isSuccess()) {
					source = leftResult.source().to(currentResult.source());
					leftResult = results.success(currentResult.value()(leftResult.value(), source), currentResult.remaining(), source);
				} else if (currentResult.isFailure()) return leftResult;
				else return currentResult;
			}
		}
		function applyToTokens(tokens) {
			return rules.firstOf("infix", infixRules.map(function(infix) {
				return infix.rule;
			}))(tokens);
		}
		return {
			apply,
			untilExclusive,
			untilInclusive
		};
	}
	exports.infix = function(name, ruleBuilder) {
		function map(func) {
			return exports.infix(name, function(parser) {
				var rule = ruleBuilder(parser);
				return function(tokens) {
					return rule(tokens).map(function(right) {
						return function(left, source) {
							return func(left, right, source);
						};
					});
				};
			});
		}
		return {
			name,
			ruleBuilder,
			map
		};
	};
	var lazyRule = function(ruleBuilder) {
		var rule;
		return function(input) {
			if (!rule) rule = ruleBuilder();
			return rule(input);
		};
	};
}));
//#endregion
//#region node_modules/lop/lib/regex-tokeniser.js
var require_regex_tokeniser = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var Token = require_Token();
	var StringSource = require_StringSource();
	exports.RegexTokeniser = RegexTokeniser;
	function RegexTokeniser(rules) {
		rules = rules.map(function(rule) {
			return {
				name: rule.name,
				regex: new RegExp(rule.regex.source, "g")
			};
		});
		function tokenise(input, description) {
			var source = new StringSource(input, description);
			var index = 0;
			var tokens = [];
			while (index < input.length) {
				var result = readNextToken(input, index, source);
				index = result.endIndex;
				tokens.push(result.token);
			}
			tokens.push(endToken(input, source));
			return tokens;
		}
		function readNextToken(string, startIndex, source) {
			for (var i = 0; i < rules.length; i++) {
				var regex = rules[i].regex;
				regex.lastIndex = startIndex;
				var result = regex.exec(string);
				if (result) {
					var endIndex = startIndex + result[0].length;
					if (result.index === startIndex && endIndex > startIndex) {
						var value = result[1];
						var token = new Token(rules[i].name, value, source.range(startIndex, endIndex));
						return {
							token,
							endIndex
						};
					}
				}
			}
			var endIndex = startIndex + 1;
			var token = new Token("unrecognisedCharacter", string.substring(startIndex, endIndex), source.range(startIndex, endIndex));
			return {
				token,
				endIndex
			};
		}
		function endToken(input, source) {
			return new Token("end", null, source.range(input.length, input.length));
		}
		return { tokenise };
	}
}));
//#endregion
//#region node_modules/lop/index.js
var require_lop = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.Parser = require_parser().Parser;
	exports.rules = require_rules();
	exports.errors = require_errors();
	exports.results = require_parsing_results();
	exports.StringSource = require_StringSource();
	exports.Token = require_Token();
	exports.bottomUp = require_bottom_up();
	exports.RegexTokeniser = require_regex_tokeniser().RegexTokeniser;
	exports.rule = function(ruleBuilder) {
		var rule;
		return function(input) {
			if (!rule) rule = ruleBuilder();
			return rule(input);
		};
	};
}));
//#endregion
//#region node_modules/mammoth/lib/styles/document-matchers.js
var require_document_matchers = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.paragraph = paragraph;
	exports.run = run;
	exports.table = table;
	exports.bold = new Matcher("bold");
	exports.italic = new Matcher("italic");
	exports.underline = new Matcher("underline");
	exports.strikethrough = new Matcher("strikethrough");
	exports.allCaps = new Matcher("allCaps");
	exports.smallCaps = new Matcher("smallCaps");
	exports.highlight = highlight;
	exports.commentReference = new Matcher("commentReference");
	exports.lineBreak = new BreakMatcher({ breakType: "line" });
	exports.pageBreak = new BreakMatcher({ breakType: "page" });
	exports.columnBreak = new BreakMatcher({ breakType: "column" });
	exports.equalTo = equalTo;
	exports.startsWith = startsWith;
	function paragraph(options) {
		return new Matcher("paragraph", options);
	}
	function run(options) {
		return new Matcher("run", options);
	}
	function table(options) {
		return new Matcher("table", options);
	}
	function highlight(options) {
		return new HighlightMatcher(options);
	}
	function Matcher(elementType, options) {
		options = options || {};
		this._elementType = elementType;
		this._styleId = options.styleId;
		this._styleName = options.styleName;
		if (options.list) {
			this._listIndex = options.list.levelIndex;
			this._listIsOrdered = options.list.isOrdered;
		}
	}
	Matcher.prototype.matches = function(element) {
		return element.type === this._elementType && (this._styleId === void 0 || element.styleId === this._styleId) && (this._styleName === void 0 || element.styleName && this._styleName.operator(this._styleName.operand, element.styleName)) && (this._listIndex === void 0 || isList(element, this._listIndex, this._listIsOrdered)) && (this._breakType === void 0 || this._breakType === element.breakType);
	};
	function HighlightMatcher(options) {
		options = options || {};
		this._color = options.color;
	}
	HighlightMatcher.prototype.matches = function(element) {
		return element.type === "highlight" && (this._color === void 0 || element.color === this._color);
	};
	function BreakMatcher(options) {
		options = options || {};
		this._breakType = options.breakType;
	}
	BreakMatcher.prototype.matches = function(element) {
		return element.type === "break" && (this._breakType === void 0 || element.breakType === this._breakType);
	};
	function isList(element, levelIndex, isOrdered) {
		return element.numbering && element.numbering.level == levelIndex && element.numbering.isOrdered == isOrdered;
	}
	function equalTo(value) {
		return {
			operator: operatorEqualTo,
			operand: value
		};
	}
	function startsWith(value) {
		return {
			operator: operatorStartsWith,
			operand: value
		};
	}
	function operatorEqualTo(first, second) {
		return first.toUpperCase() === second.toUpperCase();
	}
	function operatorStartsWith(first, second) {
		return second.toUpperCase().indexOf(first.toUpperCase()) === 0;
	}
}));
//#endregion
//#region node_modules/mammoth/lib/styles/parser/tokeniser.js
var require_tokeniser = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var RegexTokeniser = require_lop().RegexTokeniser;
	exports.tokenise = tokenise;
	var stringPrefix = "'((?:\\\\.|[^'])*)";
	function tokenise(string) {
		var identifierCharacter = "(?:[a-zA-Z\\-_]|\\\\.)";
		return new RegexTokeniser([
			{
				name: "identifier",
				regex: new RegExp("(" + identifierCharacter + "(?:" + identifierCharacter + "|[0-9])*)")
			},
			{
				name: "dot",
				regex: /\./
			},
			{
				name: "colon",
				regex: /:/
			},
			{
				name: "gt",
				regex: />/
			},
			{
				name: "whitespace",
				regex: /\s+/
			},
			{
				name: "arrow",
				regex: /=>/
			},
			{
				name: "equals",
				regex: /=/
			},
			{
				name: "startsWith",
				regex: /\^=/
			},
			{
				name: "open-paren",
				regex: /\(/
			},
			{
				name: "close-paren",
				regex: /\)/
			},
			{
				name: "open-square-bracket",
				regex: /\[/
			},
			{
				name: "close-square-bracket",
				regex: /\]/
			},
			{
				name: "string",
				regex: new RegExp(stringPrefix + "'")
			},
			{
				name: "unterminated-string",
				regex: new RegExp(stringPrefix)
			},
			{
				name: "integer",
				regex: /([0-9]+)/
			},
			{
				name: "choice",
				regex: /\|/
			},
			{
				name: "bang",
				regex: /(!)/
			}
		]).tokenise(string);
	}
}));
//#endregion
//#region node_modules/mammoth/lib/style-reader.js
var require_style_reader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	var lop = require_lop();
	var documentMatchers = require_document_matchers();
	var htmlPaths = require_html_paths();
	var tokenise = require_tokeniser().tokenise;
	var results = require_results();
	exports.readHtmlPath = readHtmlPath;
	exports.readDocumentMatcher = readDocumentMatcher;
	exports.readStyle = readStyle;
	function readStyle(string) {
		return parseString(styleRule, string);
	}
	function createStyleRule() {
		return lop.rules.sequence(lop.rules.sequence.capture(documentMatcherRule()), lop.rules.tokenOfType("whitespace"), lop.rules.tokenOfType("arrow"), lop.rules.sequence.capture(lop.rules.optional(lop.rules.sequence(lop.rules.tokenOfType("whitespace"), lop.rules.sequence.capture(htmlPathRule())).head())), lop.rules.tokenOfType("end")).map(function(documentMatcher, htmlPath) {
			return {
				from: documentMatcher,
				to: htmlPath.valueOrElse(htmlPaths.empty)
			};
		});
	}
	function readDocumentMatcher(string) {
		return parseString(documentMatcherRule(), string);
	}
	function documentMatcherRule() {
		var sequence = lop.rules.sequence;
		var identifierToConstant = function(identifier, constant) {
			return lop.rules.then(lop.rules.token("identifier", identifier), function() {
				return constant;
			});
		};
		var paragraphRule = identifierToConstant("p", documentMatchers.paragraph);
		var runRule = identifierToConstant("r", documentMatchers.run);
		var elementTypeRule = lop.rules.firstOf("p or r or table", paragraphRule, runRule);
		var styleIdRule = lop.rules.sequence(lop.rules.tokenOfType("dot"), lop.rules.sequence.cut(), lop.rules.sequence.capture(identifierRule)).map(function(styleId) {
			return { styleId };
		});
		var styleNameMatcherRule = lop.rules.firstOf("style name matcher", lop.rules.then(lop.rules.sequence(lop.rules.tokenOfType("equals"), lop.rules.sequence.cut(), lop.rules.sequence.capture(stringRule)).head(), function(styleName) {
			return { styleName: documentMatchers.equalTo(styleName) };
		}), lop.rules.then(lop.rules.sequence(lop.rules.tokenOfType("startsWith"), lop.rules.sequence.cut(), lop.rules.sequence.capture(stringRule)).head(), function(styleName) {
			return { styleName: documentMatchers.startsWith(styleName) };
		}));
		var styleNameRule = lop.rules.sequence(lop.rules.tokenOfType("open-square-bracket"), lop.rules.sequence.cut(), lop.rules.token("identifier", "style-name"), lop.rules.sequence.capture(styleNameMatcherRule), lop.rules.tokenOfType("close-square-bracket")).head();
		var listTypeRule = lop.rules.firstOf("list type", identifierToConstant("ordered-list", { isOrdered: true }), identifierToConstant("unordered-list", { isOrdered: false }));
		var listRule = sequence(lop.rules.tokenOfType("colon"), sequence.capture(listTypeRule), sequence.cut(), lop.rules.tokenOfType("open-paren"), sequence.capture(integerRule), lop.rules.tokenOfType("close-paren")).map(function(listType, levelNumber) {
			return { list: {
				isOrdered: listType.isOrdered,
				levelIndex: levelNumber - 1
			} };
		});
		function createMatcherSuffixesRule(rules) {
			var matcherSuffix = lop.rules.firstOf.apply(lop.rules.firstOf, ["matcher suffix"].concat(rules));
			var matcherSuffixes = lop.rules.zeroOrMore(matcherSuffix);
			return lop.rules.then(matcherSuffixes, function(suffixes) {
				var matcherOptions = {};
				suffixes.forEach(function(suffix) {
					_.extend(matcherOptions, suffix);
				});
				return matcherOptions;
			});
		}
		var paragraphOrRun = sequence(sequence.capture(elementTypeRule), sequence.capture(createMatcherSuffixesRule([
			styleIdRule,
			styleNameRule,
			listRule
		]))).map(function(createMatcher, matcherOptions) {
			return createMatcher(matcherOptions);
		});
		var table = sequence(lop.rules.token("identifier", "table"), sequence.capture(createMatcherSuffixesRule([styleIdRule, styleNameRule]))).map(function(options) {
			return documentMatchers.table(options);
		});
		var bold = identifierToConstant("b", documentMatchers.bold);
		var italic = identifierToConstant("i", documentMatchers.italic);
		var underline = identifierToConstant("u", documentMatchers.underline);
		var strikethrough = identifierToConstant("strike", documentMatchers.strikethrough);
		var allCaps = identifierToConstant("all-caps", documentMatchers.allCaps);
		var smallCaps = identifierToConstant("small-caps", documentMatchers.smallCaps);
		var highlight = sequence(lop.rules.token("identifier", "highlight"), lop.rules.sequence.capture(lop.rules.optional(lop.rules.sequence(lop.rules.tokenOfType("open-square-bracket"), lop.rules.sequence.cut(), lop.rules.token("identifier", "color"), lop.rules.tokenOfType("equals"), lop.rules.sequence.capture(stringRule), lop.rules.tokenOfType("close-square-bracket")).head()))).map(function(color) {
			return documentMatchers.highlight({ color: color.valueOrElse(void 0) });
		});
		var commentReference = identifierToConstant("comment-reference", documentMatchers.commentReference);
		var breakMatcher = sequence(lop.rules.token("identifier", "br"), sequence.cut(), lop.rules.tokenOfType("open-square-bracket"), lop.rules.token("identifier", "type"), lop.rules.tokenOfType("equals"), sequence.capture(stringRule), lop.rules.tokenOfType("close-square-bracket")).map(function(breakType) {
			switch (breakType) {
				case "line": return documentMatchers.lineBreak;
				case "page": return documentMatchers.pageBreak;
				case "column": return documentMatchers.columnBreak;
				default:
			}
		});
		return lop.rules.firstOf("element type", paragraphOrRun, table, bold, italic, underline, strikethrough, allCaps, smallCaps, highlight, commentReference, breakMatcher);
	}
	function readHtmlPath(string) {
		return parseString(htmlPathRule(), string);
	}
	function htmlPathRule() {
		var capture = lop.rules.sequence.capture;
		var whitespaceRule = lop.rules.tokenOfType("whitespace");
		var freshRule = lop.rules.then(lop.rules.optional(lop.rules.sequence(lop.rules.tokenOfType("colon"), lop.rules.token("identifier", "fresh"))), function(option) {
			return option.map(function() {
				return true;
			}).valueOrElse(false);
		});
		var separatorRule = lop.rules.then(lop.rules.optional(lop.rules.sequence(lop.rules.tokenOfType("colon"), lop.rules.token("identifier", "separator"), lop.rules.tokenOfType("open-paren"), capture(stringRule), lop.rules.tokenOfType("close-paren")).head()), function(option) {
			return option.valueOrElse("");
		});
		var tagNamesRule = lop.rules.oneOrMoreWithSeparator(identifierRule, lop.rules.tokenOfType("choice"));
		var styleElementRule = lop.rules.sequence(capture(tagNamesRule), capture(lop.rules.zeroOrMore(attributeOrClassRule)), capture(freshRule), capture(separatorRule)).map(function(tagName, attributesList, fresh, separator) {
			var attributes = {};
			var options = {};
			attributesList.forEach(function(attribute) {
				if (attribute.append && attributes[attribute.name]) attributes[attribute.name] += " " + attribute.value;
				else attributes[attribute.name] = attribute.value;
			});
			if (fresh) options.fresh = true;
			if (separator) options.separator = separator;
			return htmlPaths.element(tagName, attributes, options);
		});
		return lop.rules.firstOf("html path", lop.rules.then(lop.rules.tokenOfType("bang"), function() {
			return htmlPaths.ignore;
		}), lop.rules.then(lop.rules.zeroOrMoreWithSeparator(styleElementRule, lop.rules.sequence(whitespaceRule, lop.rules.tokenOfType("gt"), whitespaceRule)), htmlPaths.elements));
	}
	var identifierRule = lop.rules.then(lop.rules.tokenOfType("identifier"), decodeEscapeSequences);
	var integerRule = lop.rules.tokenOfType("integer");
	var stringRule = lop.rules.then(lop.rules.tokenOfType("string"), decodeEscapeSequences);
	var escapeSequences = {
		"n": "\n",
		"r": "\r",
		"t": "	"
	};
	function decodeEscapeSequences(value) {
		return value.replace(/\\(.)/g, function(match, code) {
			return escapeSequences[code] || code;
		});
	}
	var attributeRule = lop.rules.sequence(lop.rules.tokenOfType("open-square-bracket"), lop.rules.sequence.cut(), lop.rules.sequence.capture(identifierRule), lop.rules.tokenOfType("equals"), lop.rules.sequence.capture(stringRule), lop.rules.tokenOfType("close-square-bracket")).map(function(name, value) {
		return {
			name,
			value,
			append: false
		};
	});
	var classRule = lop.rules.sequence(lop.rules.tokenOfType("dot"), lop.rules.sequence.cut(), lop.rules.sequence.capture(identifierRule)).map(function(className) {
		return {
			name: "class",
			value: className,
			append: true
		};
	});
	var attributeOrClassRule = lop.rules.firstOf("attribute or class", attributeRule, classRule);
	function parseString(rule, string) {
		var tokens = tokenise(string);
		var parseResult = lop.Parser().parseTokens(rule, tokens);
		if (parseResult.isSuccess()) return results.success(parseResult.value());
		else return new results.Result(null, [results.warning(describeFailure(string, parseResult))]);
	}
	function describeFailure(input, parseResult) {
		return "Did not understand this style mapping, so ignored it: " + input + "\n" + parseResult.errors().map(describeError).join("\n");
	}
	function describeError(error) {
		return "Error was at character number " + error.characterNumber() + ": Expected " + error.expected + " but got " + error.actual;
	}
	var styleRule = createStyleRule();
}));
//#endregion
//#region node_modules/mammoth/lib/options-reader.js
var require_options_reader = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	exports.readOptions = readOptions;
	var _ = require_underscore_node();
	var defaultStyleMap = exports._defaultStyleMap = [
		"p.Heading1 => h1:fresh",
		"p.Heading2 => h2:fresh",
		"p.Heading3 => h3:fresh",
		"p.Heading4 => h4:fresh",
		"p.Heading5 => h5:fresh",
		"p.Heading6 => h6:fresh",
		"p[style-name='Heading 1'] => h1:fresh",
		"p[style-name='Heading 2'] => h2:fresh",
		"p[style-name='Heading 3'] => h3:fresh",
		"p[style-name='Heading 4'] => h4:fresh",
		"p[style-name='Heading 5'] => h5:fresh",
		"p[style-name='Heading 6'] => h6:fresh",
		"p[style-name='heading 1'] => h1:fresh",
		"p[style-name='heading 2'] => h2:fresh",
		"p[style-name='heading 3'] => h3:fresh",
		"p[style-name='heading 4'] => h4:fresh",
		"p[style-name='heading 5'] => h5:fresh",
		"p[style-name='heading 6'] => h6:fresh",
		"p.Heading => h1:fresh",
		"p[style-name='Heading'] => h1:fresh",
		"r[style-name='Strong'] => strong",
		"p[style-name='footnote text'] => p:fresh",
		"r[style-name='footnote reference'] =>",
		"p[style-name='endnote text'] => p:fresh",
		"r[style-name='endnote reference'] =>",
		"p[style-name='annotation text'] => p:fresh",
		"r[style-name='annotation reference'] =>",
		"p[style-name='Footnote'] => p:fresh",
		"r[style-name='Footnote anchor'] =>",
		"p[style-name='Endnote'] => p:fresh",
		"r[style-name='Endnote anchor'] =>",
		"p:unordered-list(1) => ul > li:fresh",
		"p:unordered-list(2) => ul|ol > li > ul > li:fresh",
		"p:unordered-list(3) => ul|ol > li > ul|ol > li > ul > li:fresh",
		"p:unordered-list(4) => ul|ol > li > ul|ol > li > ul|ol > li > ul > li:fresh",
		"p:unordered-list(5) => ul|ol > li > ul|ol > li > ul|ol > li > ul|ol > li > ul > li:fresh",
		"p:ordered-list(1) => ol > li:fresh",
		"p:ordered-list(2) => ul|ol > li > ol > li:fresh",
		"p:ordered-list(3) => ul|ol > li > ul|ol > li > ol > li:fresh",
		"p:ordered-list(4) => ul|ol > li > ul|ol > li > ul|ol > li > ol > li:fresh",
		"p:ordered-list(5) => ul|ol > li > ul|ol > li > ul|ol > li > ul|ol > li > ol > li:fresh",
		"r[style-name='Hyperlink'] =>",
		"p[style-name='Normal'] => p:fresh",
		"p.Body => p:fresh",
		"p[style-name='Body'] => p:fresh"
	];
	var standardOptions = exports._standardOptions = {
		externalFileAccess: false,
		transformDocument: identity,
		includeDefaultStyleMap: true,
		includeEmbeddedStyleMap: true
	};
	function readOptions(options) {
		options = options || {};
		return _.extend({}, standardOptions, options, {
			customStyleMap: readStyleMap(options.styleMap),
			readStyleMap: function() {
				var styleMap = this.customStyleMap;
				if (this.includeEmbeddedStyleMap) styleMap = styleMap.concat(readStyleMap(this.embeddedStyleMap));
				if (this.includeDefaultStyleMap) styleMap = styleMap.concat(defaultStyleMap);
				return styleMap;
			}
		});
	}
	function readStyleMap(styleMap) {
		if (!styleMap) return [];
		else if (_.isString(styleMap)) return styleMap.split("\n").map(function(line) {
			return line.trim();
		}).filter(function(line) {
			return line !== "" && line.charAt(0) !== "#";
		});
		else return styleMap;
	}
	function identity(value) {
		return value;
	}
}));
//#endregion
//#region node_modules/mammoth/lib/unzip.js
var require_unzip = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var fs = require("fs");
	var promises = require_promises();
	var zipfile = require_zipfile();
	exports.openZip = openZip;
	var readFile = promises.promisify(fs.readFile);
	function openZip(options) {
		if (options.path) return readFile(options.path).then(zipfile.openArrayBuffer);
		else if (options.buffer) return promises.resolve(zipfile.openArrayBuffer(options.buffer));
		else if (options.file) return promises.resolve(options.file);
		else return promises.reject(/* @__PURE__ */ new Error("Could not find file in options"));
	}
}));
//#endregion
//#region node_modules/mammoth/lib/underline.js
var require_underline = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var htmlPaths = require_html_paths();
	var Html = require_html();
	exports.element = element;
	function element(name) {
		return function(html) {
			return Html.elementWithTag(htmlPaths.element(name), [html]);
		};
	}
}));
//#endregion
//#region node_modules/mammoth/lib/index.js
var require_lib = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var _ = require_underscore_node();
	var docxReader = require_docx_reader();
	var docxStyleMap = require_style_map();
	var DocumentConverter = require_document_to_html().DocumentConverter;
	var convertElementToRawText = require_raw_text().convertElementToRawText;
	var readStyle = require_style_reader().readStyle;
	var readOptions = require_options_reader().readOptions;
	var unzip = require_unzip();
	var Result = require_results().Result;
	exports.convertToHtml = convertToHtml;
	exports.convertToMarkdown = convertToMarkdown;
	exports.convert = convert;
	exports.extractRawText = extractRawText;
	exports.images = require_images();
	exports.transforms = require_transforms();
	exports.underline = require_underline();
	exports.embedStyleMap = embedStyleMap;
	exports.readEmbeddedStyleMap = readEmbeddedStyleMap;
	function convertToHtml(input, options) {
		return convert(input, options);
	}
	function convertToMarkdown(input, options) {
		var markdownOptions = Object.create(options || {});
		markdownOptions.outputFormat = "markdown";
		return convert(input, markdownOptions);
	}
	function convert(input, options) {
		options = readOptions(options);
		return unzip.openZip(input).tap(function(docxFile) {
			return docxStyleMap.readStyleMap(docxFile).then(function(styleMap) {
				options.embeddedStyleMap = styleMap;
			});
		}).then(function(docxFile) {
			return docxReader.read(docxFile, input, options).then(function(documentResult) {
				return documentResult.map(options.transformDocument);
			}).then(function(documentResult) {
				return convertDocumentToHtml(documentResult, options);
			});
		});
	}
	function readEmbeddedStyleMap(input) {
		return unzip.openZip(input).then(docxStyleMap.readStyleMap);
	}
	function convertDocumentToHtml(documentResult, options) {
		var styleMapResult = parseStyleMap(options.readStyleMap());
		var documentConverter = new DocumentConverter(_.extend({}, options, { styleMap: styleMapResult.value }));
		return documentResult.flatMapThen(function(document) {
			return styleMapResult.flatMapThen(function(styleMap) {
				return documentConverter.convertToHtml(document);
			});
		});
	}
	function parseStyleMap(styleMap) {
		return Result.combine((styleMap || []).map(readStyle)).map(function(styleMap) {
			return styleMap.filter(function(styleMapping) {
				return !!styleMapping;
			});
		});
	}
	function extractRawText(input) {
		return unzip.openZip(input).then(docxReader.read).then(function(documentResult) {
			return documentResult.map(convertElementToRawText);
		});
	}
	function embedStyleMap(input, styleMap) {
		return unzip.openZip(input).tap(function(docxFile) {
			return docxStyleMap.writeStyleMap(docxFile, styleMap);
		}).then(function(docxFile) {
			return docxFile.toArrayBuffer();
		}).then(function(arrayBuffer) {
			return {
				toArrayBuffer: function() {
					return arrayBuffer;
				},
				toBuffer: function() {
					return Buffer.from(arrayBuffer);
				}
			};
		});
	}
	exports.styleMapping = function() {
		throw new Error("Use a raw string instead of mammoth.styleMapping e.g. \"p[style-name='Title'] => h1\" instead of mammoth.styleMapping(\"p[style-name='Title'] => h1\")");
	};
}));
//#endregion
Object.defineProperty(exports, "default", {
	enumerable: true,
	get: function() {
		return require_lib();
	}
});
