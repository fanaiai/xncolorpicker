console.group('hslToRgb HSL转RGB');
    console.group('hslToRgb(getHsl("hsl(350,100%,52%)")):');
        console.dir(hslToRgb(getHsl("hsl(350,100%,52%)")));
    console.groupEnd();
    console.group('hslToRgb(getHsl("HSLA(350, 100%, 52%, 0.5)")):');
        console.dir(hslToRgb(getHsl("HSLA(350, 100%, 52%, 0.5)")));
    console.groupEnd();
console.groupEnd();
function hslToRgb(hsl) {
    var h = Number(hsl.h),
        s = Number(hsl.s),
        l = Number(hsl.l),
        o = Number(hsl.o),
        r, g, b;
    if (s == 0) {
        r = g = b = l;
    } else {
        var temp2 = l < 0.5 ? l * (1 + s) : l + s - l * s,
            temp1 = 2 * l - temp2;
        h /= 360;
        var hue2rgb = function (p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        r = hue2rgb(temp1, temp2, h + 1 / 3);
        g = hue2rgb(temp1, temp2, h);
        b = hue2rgb(temp1, temp2, h - 1 / 3);
    }
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    return {
        r: r,
        g: g, 
        b: b, 
        o: o,
        complete: o == 1 ?
            ("rgb(" + [r, g, b].join(",") + ")") : 
            ("rgba(" + [r, g, b, o].join(",") + ")")
    }
}