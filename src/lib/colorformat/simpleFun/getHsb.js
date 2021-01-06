// 获取hsb的每个参数值
console.group('getHsb 获取hsb的各个参数值');
    console.group('getHsb("hsb(350,96%,100%)"):');
        console.dir(getHsb("hsb(350,96%,100%)"));
    console.groupEnd();
console.groupEnd();
function getHsb(hsb){
    hsb = hsb.toLowerCase();
    var hsb = hsb.replace("hsb", "");
        hsb = hsb.replace(/\s/g, "").split(",");
    var h = Number(hsb[0].slice(1)),
        s = parseInt(hsb[1]),
        b = parseInt(hsb[2].slice(0, -1));
    return {
        h: h,
        s: s / 100,
        b: b / 100
    }
}