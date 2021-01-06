console.group('rgbToHex RGB转HEX');
    console.group('rgbToHex(getRgb("rgb(255,10,50)")):');
        console.dir(rgbToHex(getRgb("rgb(255,10,50)")));
    console.groupEnd();
    console.group('rgbToHex(getRgb("rgba(255,10,50,0.5)")):');
        console.dir(rgbToHex(getRgb("rgba(255, 10, 50, 0.5)")));
    console.groupEnd();
console.groupEnd();
function rgbToHex(rgb) {
    var red = Number(rgb.r).toString(16),
        green = Number(rgb.g).toString(16),
        blue = Number(rgb.b).toString(16),
        opacity = Math.round(rgb.o * 255).toString(16),
        simpleType = 0; // 转换之后的HEX是否可以简化，也就是说6位转为3位，或者8位转为4位
    red.length < 2 && (red = 0 + red);
    green.length < 2 && (green = 0 + green);
    blue.length < 2 && (blue = 0 + blue);
    opacity.length < 2 && (opacity = 0 + opacity);
    red[0] == red[1] && green[0] == green[1] && blue[0] == blue[1] && opacity[0] == opacity[1] && (simpleType = 1);
    return {
        r: red,
        g: green,
        b: blue,
        o: opacity,
        complete: simpleType ?
        ("#" + red[0] + green[0] + blue[0] + (rgb.o == 1 ? "" : opacity)) :
        ("#" + red + green + blue + (rgb.o == 1 ? "" : opacity))
    }
}