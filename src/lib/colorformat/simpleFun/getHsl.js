// 获取hsla的每个参数值
console.group('getHsl 获取hsla的各个参数值');
    console.group('getHsl("hsl(350,100%,52%)"):');
        console.dir(getHsl("hsl(350,100%,52%)"));
    console.groupEnd();
    console.group('getHsl("HSLA(350, 100%, 52%, 0.5)"):');
        console.dir(getHsl("HSLA(350, 100%, 52%, 0.5)"));
    console.groupEnd();
console.groupEnd();
function getHsl(hsl){
    hsl = hsl.toLowerCase();
    var flag = hsl.indexOf("hsla") == -1 ? 0 : 1; // flag 0表示hsl，1表示hsla
        hsl = flag ? hsl.replace("hsla", "") : hsl.replace("hsl", "");
        hsl = hsl.replace(/\s/g, "").split(",");
    var h = Number(hsl[0].slice(1)),
        s = parseInt(hsl[1]),
        l = flag ? parseInt(hsl[2]) : parseInt(hsl[2].slice(0, -1)),
        opacity = flag ? (Number(hsl[3].slice(0, -1)) > 1 ? 1 : Number(hsl[3].slice(0, -1))) : 1;
    return {
        h: h,
        s: s / 100,
        l: l / 100,
        o: opacity
    }
}