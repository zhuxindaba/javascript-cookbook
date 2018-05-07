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


const camelizeRE = /-(\w)/g;
const camelize = cached(str => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');
});
```
> String.prototype.replace第二个参数为函数时，函数参数的意义。