### 快格式化上下文(BFC) #    
> BFC(Block Formatting Context),是布局过程中生成块级盒子的区域，也是浮动元素与其它元素的交互限定区> 域

### 下列方式会创建块格式化上下文 #     
1. 根元素(html)
2. 浮动元素(float不为none)
3. position值为absolute或fixed
4. display值为inline-block, table-cell, table-caption
5. overflow值不为visible的元素