### Observer观察者类

```
    /**
    * 观察者附加在每一个被观察的对象上，观察者将目标对象的属性转变为getter/setter的形式
    *  然后进行依赖收集以及派发更新
    */
    class Observer {
        constructor (value) {
            this.value = value;
            this.dep = new Dep();

        }
    }
```

### Dependency依赖收集类

```
```