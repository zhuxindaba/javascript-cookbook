### FastClick源码阅读笔记 #
```
/**
*
* 在特定的dom层监听事件
* @param {Element} layer 被监听的dom层
* @param {Object} 需要覆盖默认处理的选项设置
*/
(
    function FastClick(layer, options) {
        var olcOnClick;
        
        options = options || {};

        // 当前click是否被追踪
        this.trackingClick = false;

        // click被追踪的开始时间戳
        this.trackingClickStart = 0;

        //  追踪的click触发元素
        this.targetElement = null;

        // touch事件的X轴坐标
        this.touchStartX = 0;

        // touch事件的Y轴坐标
        this.touchStartY = 0;

        // 从Touch.identifier中检索最后一次touch的id
        this.lastTouchIdentifier = 0;

        // Touchmove的边界， 超过该边界click将会被取消
        this.touchBoundary = options.touchBoundary || 10;

        // 被监听的dom层
        this.layer = layer;

        // 在tap(touchstart和touchend)事件之间的最小时间
        this.tapDelay = options.tapDelay || 200;

        // tap事件的最大时间
        this.tapTimeout = options.tapTimeout || 700;

        if (FastClick.notNeeded(layer)) {
            return;
        }

        // 由于某些浏览器不支持Function.prototype.bind
        function bind(method, context) {
            return method.apply(context, arguments);
        }

        var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
        var context = this;
        for (var i = 0, l = methods.length; i < len; i++) {
            var method = methods[i];
            context[method] = bind(context[method], context);
        }

        // Set uo event handlers as required
        if (deviceIsAndroid) {
            layer.addEventListener('mouseover', this.onMouse, true);
            layer.addEventListener('mousedown', this.onMouse, true);
            layer.addEventListener('mouseup', this.onMouse, true);
        }
        layer.addEventListener('click', this.onClick, true);
        layer.addEventListener('touchstart', this.onTouchStart, false);
        layer.addEventListener('touchmove', this.onTouchMove, false);
        layer.addEventListener('touchend', this.onTouchEnd, false);
        layer.addEventListener('touchcancel', this.onTouchCancel, false);

        // 兼容性解决， 解决事件冒泡
        if (!Event.prototype.stopImmediatePropagation) {
            layer.removeEventListener = function (type, callback, capture) {
                var rmv = Node.prototype.removeEventListener;
                if (type === 'click') {
                    rmv.call(layer, type, callback.hijacked || callback, capture);
                } else {
                    rmv.call(layer, type, callback, capture);
                }
            }

            layer.addEventListener = function (type, callback, capture) {
                var adv = Node.prototype.addEventListener;
                if (type === click) {
                    adv.call(layer, type, );
                }
            }
        }

        if (typeof layer.onclick === 'function') {
            oldOnClick = layer.onclick;
            layer.addEventListener('click', function (event) {
                oldOnClick(event);
            }, false);
            layer.onclick = null;
        }
    }

    var deviceIsWindowPhone = navigator.userAgent.indexOf('Windows Phone') >= 0;

    var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;

    var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;

    // 监察是否需要FastClick
    FastClick.notNeeded = function (layer) {

    }

    /**
	 * 将click事件传递给特定的元素
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
    FastClick.prototype.sendClick = function (targetElement, event) {
        var clickEvent, touch;

    }

    /**
	 * 决定鼠标事件是否被允许
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
    FastClick.prototype.onMouse = function (event) {

        // 如果目标元素尚未设置则允许触发该事件(因为touch事件没有被触发)
        if (!this.targetElement) {
            return true;
        }

        // Programmatically generated events targeting a specific element should be permitted
        if (!event.cancelable) {
            return true;
        }

        // 获取并检查目标元素mouse事件是否被允许，除非明确的可用，
        if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

        }
    }

    FastClick.prototype.onClick = function (event) {
        var permitted;
        if (this.trackingClick) {
            this.targetElement = null;
            this.trackingClick = false;
            return true;
        }

        if (event.target.type === 'submit' && event.detail === 0) {
            return true;
        }

        permitted = this.onMouse(event);
    }
)();

    /**
     * 判断鼠标事件是否允许
     */
    FastClick.prototype.onMouse = function (event) {
        if (!this.targetElement) {
            return true;
        }
    }
```