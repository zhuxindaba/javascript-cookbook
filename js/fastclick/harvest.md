### FastClick源码收获    

1. stopPropagation与stopImmediatePropagation的区别
2. 需研究DOM的*Event对象*, *Node对象*
3. event.currentTarget是事件处理函数附加到的元素， event.target是事件发生的元素
4. event.targetToches 列出与触摸界面接触的所有touch对象，并且事件的target和currentTarget相同
5. NodeSelector的querySelectorAll()返回的节点*不是动态时时的*, querySelector()返回匹配到的第一个元素，找不到则返回null
6. Element和Node的区别
7. window.getSelection() 返回一个Selection对象，标识用户选择的文本或光标的当前位置