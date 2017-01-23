# hapi

- https://hapijs.com/tutorials
- https://github.com/hapijs/hapi
- Lead Maintainer: Eran Hammer

你可能不知道hapi，我猜你可能用过joi这个模块，它们都是[沃尔玛团队](http://www.walmartlabs.com/innovation/open-source/)开发的，joi是很好用的验证模块，我们有理由相信这个团队的核心项目hapi也是不错的。

2011年8月5日，WalmartLabs的一位成员Eran Hammer提交了Hapi的第一次commit。Hapi原本是Postmile的一部分，并且最开始是基于Express构建的。后来它发展成自己自己的框架，正如Eran在他的博客里面所说的：

> Hapi基于这么一个想法：配置优于编码，业务逻辑必须和传输层进行分离..

Hapi最新版本为16.1.0（版本帝，而且尤其喜欢升大版本），拥有4879次commits，并且仍然由Eran Hammer维护。

## hapi简介

Hapi的发音是happy，一般我都读成h-api，哈哈

一句话

> Web and services application framework

（web和服务）应用框架，开篇名义，非常好理解，对于web和service开发都是非常好的框架。一般我们见到的到多是web框架，很少有强调服务的，hapi里的api大概就是起名之初就确定了它的定位。一直以来我都喜欢把hapi和restify放到一起，从名字和框架功能上看，他们对于api服务的支持要好于哪些所谓的web框架。

再看一下更详细的定义

> hapi is a simple to use configuration-centric framework with built-in support for input validation, caching, authentication, and other essential facilities for building web and services applications. hapi enables developers to focus on writing reusable application logic in a highly modular and prescriptive approach.

- configuration-centric是以配置为中心
- 内置用于构建web和service应用的：验证, 缓存, 鉴权, 和其他基础设施
- hapi让开发者更加专注编写可重用的应用逻辑

## 优点

- 高性能 - WalmartLabs的那些人开发Hapi的时候，遵守Benchmark Driven Development，其结果hapi是一个high-performance的框架
- 安全 - Eran Hammer（Hapi开发者组长）是OAuth (安全授权) 规范的最初作者。 他有关注hapi安全的意识，并review所有Hapi包含的代码。很多[Node Security 项目](https://nodesecurity.io/)的成员是是Hapi的核心贡献者，这意味着非常多关注安全的眼睛在关注代码安全
- 可扩展性 - 应对高并发还是非常好的
- Mobile 优化 (轻量级 - 为移动电商而构建)
- 插件架构 - 扩展/增加 你自己的模块 (良好的生态)
- 对 DevOps 友好 - 基于配置的开发和强大的stats/logging
- 内置缓存 (Redis, MongoDB 或 Memcached) 
- 核心代码做了100% 测试/代码覆盖率 - 严格的方法来保证质量
- 可测试性 - hapi内置端到端测试，因为它包含了[shot](https://github.com/hapijs/shot)模块
- 核心功能内置，而其他特性以插件的形式展现: http://hapijs.com/plugins

## hello world

准备工作

```
mkdir myproject
cd myproject
npm init -y
npm install --save hapi
touch app.js
```

app.js代码

```
'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
```

reply和koa里的ctx.body类似，会根据类型进行判断，比如是object类型就会返回json，还是比较方便的。

过程

- connection
- route
- start

还是比较好理解的，尤其是路由，显式声明，跟express类似。在具名路由写法上，稍有不同，
express里是`/:name`，而hapi里是`/{name}`，大同小异。


执行

```
node app
Server running at: http://localhost:3000
```

总结，表象很简单，明显比express坚决，但当系统复杂到一定程度的时候，其实是一样的，hapi无非将这些实现进行插件化，延时到你用的时候再学，lazy到你看着美好，但实际是类似的。具有一定的迷惑性。换另一个角度看，作为主打api的框架，不就该这样设计么？想复杂你就复杂去，想简单弄个微服务默认就很简单，是很多人心中比较理想的框架。

## 依赖

```
  "dependencies": {
    "accept": "2.x.x",
    "ammo":  "2.x.x",
    "boom": "4.x.x",
    "call": "4.x.x",
    "catbox": "7.x.x",
    "catbox-memory": "2.x.x",
    "cryptiles": "3.x.x",
    "heavy": "4.x.x",
    "hoek": "4.x.x",
    "iron": "4.x.x",
    "items": "2.x.x",
    "joi": "10.x.x",
    "mimos": "3.x.x",
    "podium": "^1.2.x",
    "shot": "3.x.x",
    "statehood": "5.x.x",
    "subtext": "^4.3.x",
    "topo": "2.x.x"
  },
  "devDependencies": {
    "code": "4.x.x",
    "handlebars": "4.x.x",
    "inert": "4.x.x",
    "lab": "11.x.x",
    "vision": "4.x.x",
    "wreck": "10.x.x"
  },
```


- accept: HTTP Accept-* headers parsing.

https://github.com/hapijs/accept

另外一个类似的express和koa用的是https://github.com/jshttp/accepts，Higher-level content negotiation，所以二者类似的东西

只想说accept的代码太丑了。。。

- ammo


是HTTP Range 处理工具

https://github.com/hapijs/ammo

相当于express里的https://github.com/jshttp/range-parser

- boom

HTTP友好的 error 对象

https://github.com/hapijs/boom

举个例子

```
Boom.notFound('missing');
```

Generates the following response payload:

```
{
    "statusCode": 404,
    "error": "Not Found",
    "message": "missing"
}
```

感觉就是个体力活

- call

HTTP 路由。

https://github.com/hapijs/call

```
const router = new Call.Router();
router.add({ method: 'get', path: '/a{b?}c{d}' }, '/a{b?}c{d}');
```

简单点说就是所谓的配置中心化里对路由的配置。所谓的正则看起来也怪怪的，跟express完全不一样，原因是没有path-to-regexp作为依赖。凑合用吧

- catbox

多策略对象缓存服务，支持memory cache, Redis, MongoDB, Memcached, Riak, Amazon S3, RethinkDB, Couchbase, Aerospike 和 LevelDB。基本上就是xxStore。

https://github.com/hapijs/catbox

- catbox-memory

Memory adapter for catbox，即默认缓存实现为内存。

https://github.com/hapijs/catbox-memory

- cryptiles

通用目的crypto工具，简单点说就是crypto和boom的封装。仅提供3个方法而已

https://github.com/hapijs/cryptiles

- heavy

衡量进程负载的模块，统计服务器信息用的。

https://github.com/hapijs/heavy

- hoek

Node utilities shared amongst the extended hapi universe

提供各种辅助方法，无依赖，类似于lodash或underscore，都是比较实用的方法。但看起来当堆叠而成的，毫无设计感。

如果当新手入门练习还是很不错的。

- iron

对json对象加解密（MAC）的工具模块

https://github.com/hueniverse/iron

- items

是[async](https://github.com/caolan/async)精简版的实现，提供serial，parallel等方法，有点蛋疼

https://github.com/hapijs/items

- joi

Object schema validation，大概是hapi里最出名的模块的，对于express等项目也是通用的。简单易用。

https://github.com/hapijs/joi

- mimos

Mime database interface，是对mime-db的封装

https://github.com/hapijs/mimos

- podium

Node (semi) compatible event emitter with extra features.是对Node.js默认的事件发射器不满意，想自己写一个功能更强大的，很多人都做过这样的事儿，据说是因为Node.js为了保证效率，不肯增加额外功能。

https://github.com/hapijs/podium

- shot

Injects a fake HTTP request/response into a node HTTP server for simulating server logic, writing tests, or debugging. 

简单点说，就是为e2e测试提供的工具，fake是伪造的意思，大家就应该知道它的意图了吧！

https://github.com/hapijs/shot

- statehood

HTTP 状态管理工具,对header、cookie，加解密，格式化等提供方法

https://github.com/hapijs/statehood

- subtext

HTTP payload parser，跟express里的body-parser类似，但功能上更多一些

https://github.com/hapijs/subtext

- topo

带分组排序的工具模块

https://github.com/hapijs/topo


- code

BDD风格的断言库，expect式的，不明白为啥其这个名字，八竿子打不着啊。。。。

https://github.com/hapijs/code

- inert

和https://github.com/expressjs/serve-static类似，但集成了更多，比如etag、compress等

吐槽一下，这命名。。。。

https://github.com/hapijs/inert

- vision 视觉

Templates rendering support for hapi.js


和https://github.com/tj/consolidate.js类似，都是模板渲染相关的，不明白为啥发明个轮子。。。大概是为了统一hoek处理错误？

https://github.com/hapijs/vision

- wreck

HTTP Client Utilities，简单说就是http客户端。类似request模块

https://github.com/hapijs/wreck


总结一下

- 命名比较难受，类似code、inert这种，让人无比绝望
- 代码比较难受，完全没有doc，设计感缺乏
- 很多轮子，大概是历史原因，比如2011年很多库不是那么健全，索性就自己造了。
- 没有复用社区已有内容

## 插件

https://hapijs.com/plugins

代码上并无太多可借鉴性，那就看看hapi比较强大的插件吧。从官方文档上看，共分12类，授权、鉴权、文档、国际化、日志、安全、session、模板、工具、验证、hapi自用的扩展。看上去还是相当不错的，我们试着通过某一类来管中窥豹，看看它的插件是否真的足够强大、丰富。

- 授权

有2个插件，分别rbac和acl，如果大家做过权限管理，应该对这2个概念不陌生。

acl是最早也是最基本的一种访问控制机制，它的原理非常简单：每一项资源，都配有一个列表，这个列表记录的就是哪些用户可以对这项资源执行CRUD中的那些操作。当系统试图访问这项资源时，会首先检查这个列表中是否有关于当前用户的访问权限，从而确定当前用户可否执行相应的操作。

rbac是把用户按角色进行归类，通过用户的角色来确定用户能否针对某项资源进行某项操作。rbac相对于acl最大的优势就是它简化了用户与权限的管理，通过对用户进行分类，使得角色与权限关联起来，而用户与权限变成了间接关联。rbac模型使得访问控制，特别是对用户的授权管理变得非常简单和易于维护，因此有广泛的应用。

如果做一些后台管理的系统，acl或rbac至少要选一个，可以说，hapi可以开箱即用，可以省去我们许多麻烦。express里虽然也有类似的功能，但貌似都是特别强，大部分都是自己写的。

- 鉴权

先说我比较熟悉的

- hapi-auth-basic & hapi-auth-cookie  常见
- hapi-auth-jwt & hapi-auth-jwt2 说一下jwt，是实现成本最小的token授权机制，应用还是比较广的
- hapi-passport-saml 看名字就知道，这是对著名的passport模块的扩展，passport主要提供的是对oauth授权的支持，支持google、github、twitter、facebook、OpenID、BrowserID、HTML form等各种授权，是非常强大模块
- hapi-session-mongo 使用mongodb存储session，并集成auth，以前为了偷懒，确实这样做过。

还有一些不太熟悉的

- bell 和passport模块做的事儿类似
- hapi-auth-anonymous 针对移动做的，匿名用户策略，有点意思
- hapi-tiny-auth 必须提供用户名和密码才能查看api，弱弱的

鉴权分类下面总计16个插件，整体上来看是非常丰富的，集成了我们日常应用的绝大部分功能。想想hapi从2011到现在将近6年的时间，提供这么多插件，也是可圈可点的。

## Boilerplates

hapi有很多Boilerplate，既然它主要提供的是api service，那么我们就挑一个api相关的Boilerplate，看看它的最佳实践

https://github.com/rjmreis/hapi-api

目录结构

```
.
├── api/
|   ├── handlers/
|   |   └── home.js   * Sample handler
|   └── index.js      * REST routes
├── config/
|   ├── manifest.js   * Server configuration
|   └── secret.js     * Secret key
├── test/
|   └── api.js        * API test
├── server.js         * Server definition (uses the Glue plugin to read a manifest)
├── auth.js           * Auth strategies
└── package.json
```

以server.js作为入口，配合auth.js的授权策略，将具体的api丢到api目录，结构还是相当清晰的。config和test遵循了大部分框架的配置，比较有意思的config/secret.js，Secret key在部署的时候需要配置的，很多框架是没有做这个的。

从这个目录看，比较适合微服务类的小而美的api服务。

Plugins

- glue - Server composer for hapi.js. https://github.com/hapijs/glue
- hapi-auth-jwt2 - Secure Hapi.js authentication plugin using JSON Web Tokens (JWT) in Headers, Query or Cookies. https://github.com/dwyl/hapi-auth-jwt2
- blipp - Simple hapi plugin to display the routes table at startup. https://github.com/danielb2/blipp
- good - Hapi process monitor. It listens for events emitted by Hapi Server instances and allows custom reporters to be registered that output subscribed events. https://github.com/hapijs/good
- good-console - Console reporting for Good process monitor. https://github.com/hapijs/good-console
- good-squeeze - Simple transform stream for event filtering with good. https://github.com/hapijs/good-squeeze
- lab - Node test utility. https://github.com/hapijs/lab
- code - BDD assertion library. https://github.com/hapijs/code
- nodemon - Monitor for any changes in your node.js application and automatically restart the server. https://github.com/remy/nodemon
- eslint - A fully pluggable tool for identifying and reporting on patterns in JavaScript. https://github.com/eslint/eslint
- eslint-plugin-import - ESLint plugin with rules that help validate proper imports. https://github.com/benmosher/eslint-plugin-import
- npm-run-all - A CLI tool to run multiple npm-scripts in parallel or sequential. https://github.com/mysticatea/npm-run-all

归纳

- glue是一个按照配置进行装配的工具，hapi的以配置为中心，也有glue的一分功劳
- hapi-auth-jwt2 用于鉴权
- blipp是一个打印路由列表的模块，如果大家熟悉rails，一定知道`rake routes`
- good系列是进程监控用的，也是插件机制，支持console、squeeze等。
- 测试部分，采用的hapi默认的lab + code
- elint，nodemon，npm-run-all都是比较中规中矩的

## 总结

hapi好的点

- 定位非常准，以api作为切入点，区别express等传统web框架
- 背后有沃尔玛公司应用、支持，项目也还是比较健康的，是经过大规模应用的
- 基本可以做到开箱即用，和thinkjs差不多，但比thinkjs的插件要丰富很多
- 文档还算可以
- 辅助性的工具还是非常完善的，尤其是devops相关的，比express等要好很多

不好的点

- 框架的api和代码具有沃尔玛风格，不是很规范
- 对于新特性没有内置，也还是算比较传统

hapi里处处是配置，处处插件化，毁誉参半吧，对它的view部分设计不是很喜欢，有兴趣的可以以测测性能，应该不会比express好。

> 如果说作为api类的服务，hapi是一个不错的选择
