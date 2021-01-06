console.group('rgbToHsl RGB转HSL');
    console.group('rgbToHsl(getRgb("rgb(255,10,50)")):');
        console.dir(rgbToHsl(getRgb("rgb(255,10,50)")));
    console.groupEnd();
    console.group('rgbToHsl(getRgb("rgba(255,10,50,0.5)")):');
        console.dir(rgbToHsl(getRgb("rgba(255,10,50,0.5)")));
    console.groupEnd();
console.groupEnd();
function rgbToHsl(rgb) {
    var r = Number(rgb.r) / 255,
        g = Number(rgb.g) / 255,
        b = Number(rgb.b) / 255,
        o = Number(rgb.o),
        max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = l < 0.5 ? d / (max + min) : d / (2 - max - min);
        switch (max) {
            case r: h = (g - b) / d; break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h = h * 60;
        h = h < 0 ? h + 360 : h;
    }
    h = Math.round(h);
    s = Math.round(s * 100) + "%";
    l = Math.round(l * 100) + "%";
    return {
        h: h, 
        s: parseInt(s) / 100, 
        l: parseInt(l) / 100, 
        o: o,
        complete: o == 1 ? 
            ("hsl(" + [h, s, l].join(",") + ")") :
            ("hsla(" + [h, s, l, o].join(",") + ")")
    }
}
