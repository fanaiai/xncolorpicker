// CSS3下的147个颜色名称及对应颜色值:https://www.zhangxinxu.com/wordpress/2010/08/css3%E4%B8%8B%E7%9A%84147%E4%B8%AA%E9%A2%9C%E8%89%B2%E5%90%8D%E7%A7%B0%E5%8F%8A%E5%AF%B9%E5%BA%94%E9%A2%9C%E8%89%B2%E5%80%BC/
// 此方法IE9+浏览器支持，基于DOM特性实现
console.group('colorToRgb color转RGB');
    console.log("此方法IE9+浏览器支持，基于DOM特性实现");
    console.group('colorToRgb("red"):');
        console.dir(colorToRgb("red"));
    console.groupEnd();
console.groupEnd();
function colorToRgb(color) {
    var div = document.createElement('div');
    div.style.backgroundColor = color;
    document.body.appendChild(div);
    var rgb = window.getComputedStyle(div).backgroundColor;
    document.body.removeChild(div);
    return rgb;
};