### 洋葱模型

* 方便对后续中间件返回结果进行处理

<img src="https://image-static.segmentfault.com/289/215/2892151181-5ab48de7b5013_articlex" alt="图示" style="zoom:50%;" />



### 中间件为什么加`async`

* next() 本身返回的即为`Promise`
* 中间件内部使用`await`，如不写`async`会报错

* 加`async`, `await`保证洋葱模型，除最后一中间件外，`next()`前必须加`await`

### 常见的四种传参方式

1. header --> `ctx.request.header`
2. body --> 使用`koa-bodyparser`，`ctx.request.body`
3. url路径内 --> `ctx.params`
4. url问号后 --> `ctx.request.query`

### 以中间件的形式调用校验器（类）

* 仅在项目启动时，实例化1次 --> 全局只有1个
*  各请求间不独立，易造成变量错乱

### `uid`通过`body`传递给服务端

* 客户端可通过篡改`uid`获取别的用户数据，安全性低
* 非权限问题

### 缓存

* 前端缓存解决性能最有效，存在条件限制

### 代码重构

* 重复代码建议3次以上，再考虑重构
* 注意考虑灵活性，业务逻辑会发生变化

### 易错

* 出现 `Internal Server Error`, 可能是漏加`await`， 
* 循环查询数据库，查询次数不可控，要避免
* 使用`body`传递数字，实际为传递`JSON`，`JSON`可以识别为数字还是字符串，故取出时不需要装换类型
* 通过`url`方式传递（例，`/article/1`，`?param=1`），不转型，为字符串
* `Object`对象的`key`为字符串，注意转型
* 如果导入出现`undefined`，检查是否出现循环导入
* 出现循环导入，由模块导入，变为局部导入
* `forEach `中别用 `async`, `await`
* `axios`请求中有中文，会报错，需要编码，如`encodeURI`
