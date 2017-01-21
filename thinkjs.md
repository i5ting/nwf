# 我看Thinkjs

- 官网 https://thinkjs.org
- 代码 https://github.com/75team/thinkjs
- 作者 李成银 @welefen

## 安装

安装命令行工具

```
$ npm install -g thinkjs
```

README里说使用`thinkjs new demo --es`，但实际上并没有es这个选项

```
$ thinkjs new demo
  create : demo
  create : demo/package.json
  create : demo/.babelrc
  create : demo/.thinkjsrc
  create : demo/nginx.conf
  create : demo/pm2.json
  create : demo/.gitignore
  create : demo/README.md
  create : demo/www
  create : demo/www/development.js
  create : demo/www/production.js
  create : demo/www/testing.js
  create : demo/www/README.md
  create : demo/www/static
  create : demo/www/static/js
  create : demo/www/static/css
  create : demo/www/static/img
  create : demo/src
  create : demo/src/common/bootstrap
  create : demo/src/common/bootstrap/middleware.js
  create : demo/src/common/bootstrap/global.js
  create : demo/src/common/config
  create : demo/src/common/config/config.js
  create : demo/src/common/config/view.js
  create : demo/src/common/config/db.js
  create : demo/src/common/config/hook.js
  create : demo/src/common/config/session.js
  create : demo/src/common/config/error.js
  create : demo/src/common/config/env
  create : demo/src/common/config/env/development.js
  create : demo/src/common/config/env/testing.js
  create : demo/src/common/config/env/production.js
  create : demo/src/common/config/locale
  create : demo/src/common/config/locale/en.js
  create : demo/src/common/controller
  create : demo/src/common/controller/error.js
  create : demo/view/common
  create : demo/view/common/error_400.html
  create : demo/view/common/error_403.html
  create : demo/view/common/error_404.html
  create : demo/view/common/error_500.html
  create : demo/view/common/error_503.html
  create : demo/src/home/config
  create : demo/src/home/config/config.js
  create : demo/src/home/controller
  create : demo/src/home/controller/base.js
  create : demo/src/home/controller/index.js
  create : demo/src/home/logic
  create : demo/src/home/logic/index.js
  create : demo/src/home/model
  create : demo/src/home/model/index.js
  create : demo/view/home
  create : demo/view/home/index_index.html

  enter path:
  $ cd demo

  install dependencies:
  $ npm install

  run the app:
  $ npm start

```

这一步还是很帅的，依次按照说明

```
  $ cd demo
  $ npm install
  $ npm start
```

装了好多babel的东西，有点大和慢，细看一下package.json

```
  "dependencies": {
    "thinkjs": "2.2.x",
    "babel-runtime": "6.x.x",
    "source-map-support": "0.4.0"
  },
```

问题就出来了

- 首先全局安装了thinkjs
- 生成的代码里再次安装thinkjs

这其实是不经济的。sails做的就比较好，采用软连接的形式复用已安装的模块。

## 目录

```
.
├── README.md
├── app
│   ├── common
│   │   ├── bootstrap
│   │   ├── config
│   │   └── controller
│   └── home
│       ├── config
│       ├── controller
│       ├── logic
│       └── model
├── nginx.conf
├── package.json
├── pm2.json
├── src
│   ├── common
│   │   ├── bootstrap
│   │   ├── config
│   │   └── controller
│   └── home
│       ├── config
│       ├── controller
│       ├── logic
│       └── model
├── tree.txt
├── view
│   ├── common
│   │   ├── error_400.html
│   │   ├── error_403.html
│   │   ├── error_404.html
│   │   ├── error_500.html
│   │   └── error_503.html
│   └── home
│       └── index_index.html
└── www
    ├── README.md
    ├── development.js
    ├── production.js
    ├── static
    │   ├── css
    │   ├── img
    │   └── js
    └── testing.js

388 directories, 1381 files
```

## 启动流程分析

1）启动命令

```
npm start
```

那就看看start里做了什么

```
  "scripts": {
    "start": "node www/development.js",
    "compile": "babel src/ --out-dir app/",
    "watch-compile": "node -e \"console.log('<npm run watch-compile> no longer need, use <npm start> command direct.');console.log();\"",
    "watch": "npm run watch-compile"
  },
```

即使用Node执行www/development.js

这是env环境处理，thinkjs采用了3中env，比较常见的

- development 开发模式
- production 线上模式
- testing 测试模式

和rails类似，很好奇的是为啥没有使用NODE_ENV来读取，而是直接配置，大概是为了方便吧。另外有些框架会增加staging模式。

还有一点不是很舒服的是，把`www/development.js`这个Node.js文件放到www目录里。感觉有点怪怪的，一般理解www是apache或者nginx的静态目录，或者php的执行目录。这样放感觉还是很有php的痕迹的。

thinkjs是把www当成node项目目录，而www下的static才是静态资源文件目录。

2) www/development.js

```
var instance = new thinkjs({
  APP_PATH: rootPath + path.sep + 'app',
  RUNTIME_PATH: rootPath + path.sep + 'runtime',
  ROOT_PATH: rootPath,
  RESOURCE_PATH: __dirname,
  env: 'development'
});
```

此处配置有点啰嗦，APP_PATH指的是寻找模块的路径，就是上面的app目录。


```
$ tree src -L 3         
src
├── common
│   ├── bootstrap
│   │   ├── global.js
│   │   └── middleware.js
│   ├── config
│   │   ├── config.js
│   │   ├── db.js
│   │   ├── env
│   │   ├── error.js
│   │   ├── hook.js
│   │   ├── locale
│   │   ├── session.js
│   │   └── view.js
│   └── controller
│       └── error.js
├── home
│   ├── config
│   │   └── config.js
│   ├── controller
│   │   ├── base.js
│   │   └── index.js
│   ├── logic
│   │   └── index.js
│   └── model
│       └── index.js


16 directories, 19 files
```

home和common是很thinkphp风格的。thinkjs把runtime抽到单独的thinkjs模块里。比php的要好一些。

直白点说，common是配置项，所有业务模块公用的。而home是业务模块.如果我再想加一个模块

```
$ thinkjs module topic(能创建不能删除，略遗憾)

  create : src/topic/config
  create : src/topic/config/config.js
  create : src/topic/controller
  create : src/topic/controller/base.js
  create : src/topic/controller/index.js
  create : src/topic/logic
  create : src/topic/logic/index.js
  create : src/topic/model
  create : src/topic/model/index.js
  exist : /Users/sang/workspace/github/nodewebframework/demo/view/topic/index_index.html
```

此时目录

```
src
├── common
├── home
└── topic
```

以前有过争论，到底是如何目录更好

类似于rails的目录结构，项目大的时候会非常麻烦

```
// DON'T
.
├── controllers
|   ├── product.js
|   └── user.js
├── models
|   ├── product.js
|   └── user.js
├── views
|   ├── product.hbs
|   └── user.hbs
```

现在大部分都推荐这种

```
// DO
.
├── product
|   ├── index.js
|   ├── product.js
|   └── product.hbs
├── user
|   ├── index.js
|   ├── user.js
|   └── user.hbs
```

3）业务模块目录

再看一下具体业务模块目录

```
├── home
│   ├── config
│   │   └── config.js
│   ├── controller
│   │   ├── base.js
│   │   └── index.js
│   ├── logic
│   │   └── index.js
│   └── model
│       └── index.js
```

base这种方式是非常好的。老司机比较喜欢这样干。model和controller在业务模块里，而view在最外层的view模块里。这样感觉怪怪的。从目录设计上来说，分离的不够彻底。我的理解是放到一个目录里好寻址，无他，既然完全自己写，实际上放到业务模块里也是非常简单的可以实现的。express和koa也有这个问题，不过人家好歹可以每个app做子模块。

这里的logic目录，是业务逻辑的一个单独类。类似于java里的service概念。可圈可点。

- 生成器比较弱，只能创建，无法删除
- 目录结构清晰，还是不错的，我php写的少，命名上稍有不适

在模块这里做的比较细，比如设置默认模块，禁用模块等，都有相关操作。https://thinkjs.org/zh-cn/doc/2.2/module.html

下面我关心的就是我如何能自己写个页面，跑起来。

4）路由和view识别

路由识别，默认根据 `模块/控制器/操作/参数1/参数1值/参数2/参数2值` 其实就是一个约定。

比如`/`解析为

- 默认模块是home
- 控制是index
- 操作是indexAction

如果再来一个呢？

```
'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file index_index.html
    return this.display();
  }
  
  myAction(){
    //auto render template file index_index.html
    return this.display();
  }
}
```

增加myAction，报错[Error] Error: can't find template file `/Users/sang/workspace/github/nodewebframework/demo/view/home/index_my.html`

将view/home/index_index.html复制为view/home/index_my.html。原理是my要对应index_my.html模块。即index是controller，而my是action。

理解了这个，你就会觉得index_index这样的命名也不是很怪异了。剩下的就是view编写之类的，此处就不在熬述


总结一下

- 路由的约定和view的约定还是不错的，只要掌握了约定，开发是非常快速的。
- 这种约定会导致学习成本稍高，不看文档很难去理解的。

## 性能

前面提到了，开发阶段采用babel写的，所以效率不会很高。

```
$ autocannon -c 100 -d 5 -p 10 localhost:8360
Running 5s test @ http://localhost:8360
100 connections with 10 pipelining factor

Stat         Avg       Stdev    Max       
Latency (ms) 108.9     201.32   866       
Req/Sec      891.8     148.37   1000      
Bytes/Sec    417.79 kB 50.76 kB 458.75 kB 

4k requests in 5s, 2.09 MB read
```

有点惨，是吧？但是这是开发模式啊，我们肯定要拿线上的production模式来测试。

```
$ npm run compile
$ node www/production.js 
$ autocannon -c 100 -d 5 -p 10 localhost:8360
Running 5s test @ http://localhost:8360
100 connections with 10 pipelining factor

Stat         Avg       Stdev     Max       
Latency (ms) 61.76     124.71    763       
Req/Sec      1567.2    734.94    1993      
Bytes/Sec    679.12 kB 242.25 kB 884.74 kB 

8k requests in 5s, 3.4 MB read

$ autocannon -c 100 -d 5 -p 10 localhost:8360
Running 5s test @ http://localhost:8360
100 connections with 10 pipelining factor

Stat         Avg       Stdev     Max      
Latency (ms) 54.65     105.47    707      
Req/Sec      1813.4    368.21    1999     
Bytes/Sec    807.73 kB 156.09 kB 917.5 kB 

9k requests in 5s, 4.09 MB read

$ autocannon -c 100 -d 5 -p 10 localhost:8360
Running 5s test @ http://localhost:8360
100 connections with 10 pipelining factor

Stat         Avg       Stdev     Max     
Latency (ms) 54.14     89.81     465     
Req/Sec      1816.4    319.14    2000    
Bytes/Sec    914.23 kB 145.96 kB 1.05 MB 

9k requests in 5s, 4.55 MB read
```

下面以同样的功能express + ejs模板的方式

```
$ autocannon -c 100 -d 5 -p 10 localhost:3000
Running 5s test @ http://localhost:3000
100 connections with 10 pipelining factor

Stat         Avg       Stdev     Max       
Latency (ms) 53.85     177.72    1309      
Req/Sec      1728      385.85    2075      
Bytes/Sec    702.87 kB 159.56 kB 851.97 kB 

9k requests in 5s, 3.53 MB read

$ autocannon -c 100 -d 5 -p 10 localhost:3000
Running 5s test @ http://localhost:3000
100 connections with 10 pipelining factor

Stat         Avg       Stdev     Max       
Latency (ms) 46.06     141.52    739       
Req/Sec      2061.2    320.53    2275      
Bytes/Sec    842.14 kB 134.95 kB 950.27 kB 

10k requests in 5s, 4.2 MB read

$ autocannon -c 100 -d 5 -p 10 localhost:3000
Running 5s test @ http://localhost:3000
100 connections with 10 pipelining factor

Stat         Avg       Stdev    Max       
Latency (ms) 45.97     139.58   620       
Req/Sec      2059.4    122.93   2167      
Bytes/Sec    829.03 kB 52.43 kB 884.74 kB 

10k requests in 5s, 4.2 MB read
```

单就view渲染上看，thinkjs比express要低一点，大约10%左右。但功能比express能处理的要多。翻源码的时候看到view上也有hook。而且src/core/view里的render貌似没有做缓存优化，但在src/adapter/template里做了fileCache。

## controller

支持2种

- 普通的控制器
- 多级控制器

配合router写起来，是写框架里比较耗时的。

支持`__before`和`__after`这样的回调钩子，对于app和controller控制来说是非常实用的。使用co来实现也是可圈可点，此处如果使用koa可以更加优雅。

之前曾经这样写过

```
class PathController extends BaseController {
  constructor(app, ctx, next) {
    super(app, ctx, next)
    
    this.path = '/c'
    // this.global_filter.push('custom_filter')
    this.post_filter = [this.log]
  }
  
  before() {
  
  }
  
  log(ctx, next) {
    ctx.someText = 'some'
    // console.log('before')
    return next().then(function(){
      // console.log('after')
    })
  }

  post(req, res) {
    console.log(this.ctx.someText)
    var a = this.reqbody.a
    
    return res.body = this.ctx.someText
  } 
  
  after() {
  }
}
```

这里的before和after和thinkjs的一样。对于action的处理是通过promise处理，也可以。

唯一看起来稍稍不那么爽的是rest部分，有点怪，很容易写坏了。而且文档也比较少，估计是thinkjs不太想主推吧。

## 路由

完全自己正则，是quick偷懒写法。默认约定，如果想配置就自己正则，也是够用的。

## 各种adapter，db，中间件，hook，插件

这些都是非常好的概念，thinkjs做了很多内置。这是把双刃剑

- 方便，简单
- 臃肿，变更麻烦

## 总结

Thinkjs的特点

- 完全自己实现，对已有框架很少借鉴
- 内置各种adapter，db，中间件，hook，插件，非常丰富，all in one 比组装更适合新手
- 遵循mvc和coc
- 使用最潮的es6/es7/ts特性，对aysnc函数，exports等都非常好的支持
- 支持i18n等实用功能
- 内置pm2和nginx集成，部署方便
- 有自己的脚手架，稍弱
- 性能不错，虽然比express稍弱，但功能强大许多
- 测试丰富，代码质量有保障
- 文档健全，是经过设计的，支持多语言
- 背后有75团和李成银支持，最近一周内有更新，代码提交2600+，35人贡献，整体来说算健康

不足也是有的

- 参考Thinkphp，对于熟悉rails类的人不太舒服，熟悉php的人应该上手极其简单
- babel安装包还是比较大啊，虽然很多人已经标配
- 代码完全自己实现，难免有些命名，习惯上的问题
- 很难复用开发者已有的经验，跟express、koa几乎是另外一条路

> 结语：在目前来看，对于最潮的es6/es7/ts特性上，Thinkjs几乎是唯一的选型。如果用户是新手或者有php开发经验，将会是一款快速开发的利器。