# colorFormat #

![](https://img.shields.io/badge/language-javascript-green.svg)
![](https://img.shields.io/badge/license-MIT-blue.svg)

## 介绍 ##

colorFormat.js是将颜色值转换为你需要格式的JavaScript库，现在仅支持浏览器支持的HEX/RGB/RGBA/HSL/HSLA等5种格式，任意格式之间互相转换。

可能颜色互转的时候有些微差距，这是由于JavaScript在小数计算时不够精确或者对数据进行了四舍五入导致的结果，不过转换的结果与在浏览器开发者工具中转换的结果保持一致(除了个别小数位)。

## 参数 ##

|参数|类型|默认值|描述|
|----|----|----|----|
|color|String|`"#f00"`|待转换的颜色值，支持`HEX/RGB/RGBA/HSL/HSLA` 5 种格式，并且支持`red`/`orange`/`yellow`/`green`/`cyan`/`blue`/`violet`/`black`/`white`|
|format|String|`"rgb"`|你希望将待转换的颜色值转换为哪种格式的颜色，支持`HEX/RGB/RGBA/HSL/HSLA` 5种格式|

**注意**：
 1. 请自行保证输入的待转换色值的正确性，本插件暂未对待转换色值的正确性进行判断，后期考虑添加。
 2. 如果是带有透明度的待转换色值强制转换为`RGB/HSL`时，转换结果除`complete`其他都正确，`complete`会严格按照`format`转换格式，所以会将透明度去除，看着感觉颜色不一致。
 3. color参数暂时仅支持`red`/`orange`/`yellow`/`green`/`cyan`/`blue`/`violet`/`black`/`white` 这几种默认颜色值，如果需要添加更多的参数，请自行在colorFormat.js源代码的`defineColor`上添加您需要自定义的颜色，需要和已有的格式保持一致。

**返回值**：

```JavaScript
// 返回值一般包括 5 个值，
// format 为 hex/rgb/rgba
// {
//    r: 红色（如果format为rgb/rgba，r为0~255之间的10进制数，如果format为hex，r为00~ff之间的16进制数）, 
//    g: 绿色（同上）, 
//    b: 蓝色（同上）, 
//    o: 透明度（同上）,
//    complete: 将上述 4 个值拼接成可直接使用的值，在format为hex时，complete如果可以简写，是会直接转为简写的
// }
// 或者 format 为 hsl/hsla
// {
//     h: 色调,
//     s: 饱和度,
//     l: 亮度,
//     o: 透明度,
//     complete: 将上述 4 个值拼接成可直接使用的值
// }
```


## 使用 ##

首先引入`colorFormat.js`或者`colorFormat.min.js`:

```HTML
<script src="colorFormat.min.js"></script>
```

会在全局变量上面定义一个`colorFormat`的方法，你可以直接执行：

```JavaScript
colorFormat(); // {r: 255, g: 0, b: 0, o: 1, complete: "rgb(255,0,0)"}
colorFormat({}); // {r: 255, g: 0, b: 0, o: 1, complete: "rgb(255,0,0)"}
// 因为有默认值，所以上述两行执行结果一致

colorFormat({color: "red", format: "rgb"}); // {r: 255, g: 0, b: 0, o: 1, complete: "rgb(255,0,0)"}

colorFormat({color: "#ffffff", format: "hex"}); // {r: "ff", g: "ff", b: "ff", o: "ff", complete: "#fff"}

colorFormat({color: "#0080ff", format: "hex"}); // {r: "00", g: "80", b: "ff", o: "ff", complete: "#0080ff"}

colorFormat({color: "#0080ff80", format: "rgba"}); // {r: 0, g: 128, b: 255, o: 0.5, complete: "rgba(0,128,255,0.5)"}

colorFormat({color: "#0080ff80", format: "hsl"}); // {h: 210, s: "100%", l: "50%", o: 0.5, complete: "hsl(210,100%,50%)"}

colorFormat({color: "#0080ff80", format: "hsla"}); // {h: 210, s: "100%", l: "50%", o: 0.5, complete: "hsla(210,100%,50%,0.5)"}

colorFormat({color: "rgba(0,128,255,0.5)", format: "hex"}); // {r: "00", g: "80", b: "ff", o: "80", complete: "#0080ff80"}

colorFormat({color: "rgba(0,128,255,0.5)", format: "hsl"}); // {h: 210, s: "100%", l: "50%", o: 0.5, complete: "hsl(210,100%,50%)"}

colorFormat({color: "rgba(0,128,255,0.5)", format: "hsl"}); // {h: 210, s: "100%", l: "50%", o: 0.5, complete: "hsla(210,100%,50%,0.5)"}

colorFormat({color: "hsla(210,100%,50%,0.5)", format: "hex"}); // {r: "00", g: "7f", b: "ff", o: "80", complete: "#007fff80"}


colorFormat({color: "hsla(210,100%,50%,0.5)", format: "rgba"}); // {r: 0, g: 127, b: 255, o: 0.5, complete: "rgba(0,127,255,0.5)"}
```

上述仅是列举了部分例子，更多的例子需要自己去探索。

simpleFun 文件夹内是各个转换方法的单独实现，除了上述 5 种格式，还支持`rgb`和`hsb`转换，不过由于这两种方式之间的转换暂不支持透明度（我暂时还没理清楚），所以暂未添加到colorFormat中。
