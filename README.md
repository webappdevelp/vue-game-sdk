# h5sdk

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

## 项目注意事项
本SDK集合了深圳、广分及其他第三方的需求，文件内也包含了各自所需的图片、图标等。

### ico 文件修改
如SDK针对深圳游戏使用时，则修改vue.config.js 内 html-webpack-plugin 的 favicon 配置，指向 'public/shenzhen.ico' 文件。

### 其他尺寸 ico 文件修改
如SDK针对深圳游戏使用时，则修改 public -> img 下面的 shenzhen.icons 目录名称为 icons ，使得编译时能正确生成不同尺寸的 ico 文件。

### SDK 拖拽图标修改
如SDK针对不同渠道或者不同游戏有定制的拖拽图标要求，则需在对应的 assets/scenes 目录下面存放一个定制的图标，并在 views/scenes/xxx/Index.vue 下面设置 hy-control 的样式，指定背景图片为当前定制的图标。

### 游戏设备初始化
针对不同的渠道号，设备初始化调用的接口会不同，154、155则采用api来初始化，其他的根据实际情况处理。可参考mixins里面的 deviceInit 方法传参；

### 登录校验
如果当前游戏是针对IOS客户端模式的，则登录校验使用checkApiToken，否则使用 checkU9Token.

### 接口请求的域名注意事项
定制游戏有属于自己的接口域，广分和深圳也有自己的接口域，api层通过 sdkOptions 里面的 startOrigin 来区分走哪个域去请求数据。

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
