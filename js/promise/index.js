function Promise(fn) {
    
    /**
     * Promise状态
     * 0: pending 等待态
     * 1: resolved 执行态
     * 2: rejected 拒绝态
     */
    this._state = 0;

    /**
     * promise的执行结果
     */
    this._value = null;

    /**
     * 延迟执行函数队列也就是then(...)注册回掉函数队列
     */
    this._deferreds = [];

    // 立即执行fn函数
    try {
        fn(value => {
            resolve(this, value);
        }, reason => {
            reject(this. reason);
        });
    } catch (e) {
        reject(this, reason);
    }
}

Promise.prototype.then = function(onResolved, onRejected) {
    var res = new Promise(function () {});
    var deferred = new Handler(onResolved, onRejected, res);

    if (this._state === 0) {
        this._deferreds.push(deferred);
        return res;
    }

    handleResolved(this, deferred);
    return res;
}

function Handler(onResolved, onRejected, promise) {
    this.onResolved = typeof onResolved === 'function' ? onResolved : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
}