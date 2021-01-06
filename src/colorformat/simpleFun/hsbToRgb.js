console.group('hsbToRgb HSB转RGB');
    console.group('hsbToRgb(getHsb("hsb(350,96%,100%)")):');
        console.dir(hsbToRgb(getHsb("hsb(350,96%,100%)")));
    console.groupEnd();
console.groupEnd();
function hsbToRgb(hsb) {
    var rgb = {};
    var h = hsb.h;
    var s = hsb.s * 255;
    var b = hsb.b * 255;
    if (s == 0) {
        rgb.r = rgb.g = rgb.b = b;
    } else {
        var t1 = b;
        var t2 = (255 - s) * b / 255;
        var t3 = (t1 - t2) * (h % 60) / 60;
        if (h == 360) h = 0;
        if (h < 60) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3 }
        else if (h < 120) { rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3 }
        else if (h < 180) { rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3 }
        else if (h < 240) { rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3 }
        else if (h < 300) { rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3 }
        else if (h < 360) { rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3 }
        else { rgb.r = 0; rgb.g = 0; rgb.b = 0 }
    }
    rgb.r = Math.round(rgb.r);
    rgb.g = Math.round(rgb.g);
    rgb.b = Math.round(rgb.b);
    rgb.complete = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
    return rgb;
}