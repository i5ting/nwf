# hapi

- https://hapijs.com/tutorials
- https://github.com/hapijs/hapi
- Lead Maintainer: Eran Hammer

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