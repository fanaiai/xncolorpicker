// 获取rgba的每个参数值
console.group('getRgb 获取rgba的各个参数值');
    console.group('getRgb("rgb(255,10,50)"):');
        console.dir(getRgb("rgb(255,10,50)"));
    console.groupEnd();
    console.group('getRgb("RGBA(255, 10, 50, 0.5)"):');
        console.dir(getRgb("RGBA(255, 10, 50, 0.5)"));
    console.groupEnd();
console.groupEnd();
function getRgb(rgb){
    rgb = rgb.toLowerCase();
    var flag = rgb.indexOf("rgba") == -1 ? 0 : 1; // flag 0表示rgb，1表示rgba
        rgb = flag ? rgb.replace("rgba", "") : rgb.replace("rgb", "");
        rgb = rgb.replace(/\s/g, "").split(",");
    var red = Number(rgb[0].slice(1)),
        green = Number(rgb[1]),
        blue = flag ? Number(rgb[2]) : Number(rgb[2].slice(0, -1)),
        opacity = flag ? (Number(rgb[3].slice(0, -1)) > 1 ? 1 : Number(rgb[3].slice(0, -1))) : 1;
    return {
        r: red,
        g: green,
        b: blue,
        o: opacity
    }
}