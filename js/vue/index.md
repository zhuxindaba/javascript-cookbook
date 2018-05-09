### Vue源码阅读笔记 ###
1. Vue.nextTick默认使用microTask， 如果浏览器不支持Promise则使用macroTask(setImmediate -> MessageChannel(1.0时有使用MutationObserver) -> setTimeout)

2. Vue.use源码:
```
/**
 * Vue插件使用
 * @param {Function | Object} plugin 要安装的插件
 *
 */
Vue.use = function (plugin) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
        return;
    }
    const args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
        plugin.apply(null, args)
    }
    installedPlugins.push(plugin);
    return this;
}

/**
 * 转换伪数组为真是数组
 * @param {Array-Like} list 需要转换的伪数组
 * @param {number} start 从第几个元素开始转换
 * @return {Array} 转换的数组
 */
function toArray(list, start) {
    start = start || 0;
    let i = list.length - start;
    const ret = new Array(i);
    while (i--) {
        ret[i] = list[i + start]
    }
    return ret;
}

const strats = Object.create(null);

/**
 * 默认策略
 * @param {Object} parentVal
 * @param {Object} childVal
 *
 */
const defaultStrat = function (parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
}

/**
 * 合并parent、child的options为一个，实例化及继承的核心工具
 * @param {Object} parent 父类 
 * @param {Object} child 子类
 * @param {?Object} Vue实例对象
 * @return {Object}
 */
function mergeOptions(parent, child, vm) {
    if (typeof child === 'function') {
        child = child.options;
    }

    normalizeProps(child, vm);
    normalizeInject(child, vm);
    normalizeDirectives(child);
    const extendsFrom = child.extends;
    if (extendsFrom) {
        parent = mergeOptions(parent, extendsFrom, vm);
    }
    if (child.mixins) {
        for (let i = 0, l = child.mixins.length; i < l; i++) {
            parent = mergeOptions(parent, child.mixins[i], vm)
        }
    }
    const options = {};
    let key;
    for (key in parent) {
        mergeField(key);
    }
    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key);
        }
    }
    function mergeField(key) {
        const strat = strats[key] || defaultStrat;
        options[key] = strat(parent[key, dhild[key]], vm, key);
    }
    return options;
}

/**
 * 确保所有的prop的options语法都是标准的对象格式
 * @param {Object} options 
 * @param {Object} vm vue对象实例
 */
function normalizeProps(options, vm) {
    const props = options.props;
    if (!props) return;
    const res = {};
    let i, val, name;
    if (Array.isArray(props)) {
        i = props.length;
        while (i--) {
            val = props[i];
            if (typeof val === 'string') {
                name = camelize(val);
                res[name] = {type: null}
            } else if (process.env.NODE_ENV !== 'production') {
                console.error('Vue warn: props must be strings when using array syntax.');
            }
        }
    } else if (isPlainObject(props)) {
        for (const key in props) {
            val = props[key];
            name = camelize(key);
            res[name] = isPlainObject(val) ? val : {type: val}
        }
    } else if (process.env.NODE_ENV !== 'production') {
        console.error(`Invalid value for option "props": expected an Array or an Object`);
    }
    options.props = res;
}

/**
 * 使所有的injections都为标准对象格式
 * @param {Object} options 
 * @param {Object} vm vue对象实例
 */
function normalizeInject(options, vm) {
    const inject = options.inject;
    if (!inject) {
        return;
    }
    const normalized = options.inject = {};
    if (Array.isArray(inject)) {
        for (let i = 0; i < inject.length; i++) {
            normalized[inject[i]] = {from: inject[i]}
        }
    } else if (isPlainObject(inject)) {
        for (const key in inject) {
            const val = inject[key];
            normalized[key] = isPlainObject(val) ? extend({from: key}, val) : {from: val}
        }
    } else {
        console.error(`Invalid value for option "inject": expected an Array or an Object`);
    }
}

/**
 * 格式化原始指令式函数为对象格式
 * @param {Object} options 
 */
function normalizeDirectives(options) {
    const dirs = options.directives;
    if (dirs) {
        for (const key in dirs) {
            const def = dirs[key];
            if (typeof def === 'function') {
                dirs[key] = {bind: def, update: def}
            }
        }
    }
}

const _toString = Object.prototype.toString;

function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]';
}

/**
 * 创建一个缓存版本的纯函数
 * @param {Function} options 
 * @return {Function}
 */
function cached(fn) {
    const cache = Object.create(null);
    return function cachedFn (string) {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    }
}

/**
 * 合并属性到目标对象
 * @param {Object} to 目标对象
 * @param {Object} _from 
 * @return {Object}
 */
function extend(to, _from) {
    for (const key in _from) {
        to[key] = _from[key]
    }
    return to;
}


const camelizeRE = /-(\w)/g;
const camelize = cached(str => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');
});

const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}

/**
 * 尝试为每一个value创建一个观察者，如果成功创建了观察者则返回该观察者，否则返回已存在的观察者
 * @param {Object} value 目标对象
 * @param {boolean} _from 
 * @return {Observer}
 */
function observe(value, asRootData) {
    if (!isObject(value) || value instanceof VNode) {
        return;
    }
    let obj;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else if (shouleObserver && !isServerRendering()
        && (Array.isArray(value) || isPlainObject(value))
        && Object.isExtensible(value) && !value.isVue
    ) {
        ob = new Observer(value);
    }
    if (asRootData && ob) {
        ob.vmCount++;
    }
    return ob;
}

function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}


```
> 1. String.prototype.replace第二个参数为函数时，函数参数的意义。
> 2. Proxy的API
> 3. 正则表达式 \b单词边界  \B非单词边界 二者匹配的都是位置而不是字符
> \w等价于[A-Za-z0-9_]; \W等价于[^A-Za-z_]