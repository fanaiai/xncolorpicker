console.group('rgbToHsb RGB转HSB');
    console.log("HSB暂不清楚可否设置透明度，所以转换中暂不支持透明度");
    console.group('rgbToHsb(getRgb("rgb(255,10,50)")):');
        console.dir(rgbToHsb(getRgb("rgb(255,10,50)")));
    console.groupEnd();
    console.group('rgbToHsb(getRgb("rgba(255,10,50,0.5)")):');
        console.dir(rgbToHsb(getRgb("rgba(255,10,50,0.5)")));
    console.groupEnd();
console.groupEnd();
function rgbToHsb(rgb) {
    var hsb = { h: 0, s: 0, b: 0 };
    var min = Math.min(rgb.r, rgb.g, rgb.b);
    var max = Math.max(rgb.r, rgb.g, rgb.b);
    var delta = max - min;
    hsb.b = max;
    hsb.s = max != 0 ? 255 * delta / max : 0;
    if (hsb.s != 0) {
        if (rgb.r == max) {
            hsb.h = (rgb.g - rgb.b) / delta;
        } else if (rgb.g == max) {
            hsb.h = 2 + (rgb.b - rgb.r) / delta;
        } else {
            hsb.h = 4 + (rgb.r - rgb.g) / delta;
        }
    } else {
        hsb.h = -1;
    };
    if (max == min) {
        hsb.h = 0;
    };
    hsb.h *= 60;
    if (hsb.h < 0) {
        hsb.h += 360;
    };
    hsb.s *= 100 / 255;
    hsb.b *= 100 / 255;
    hsb.h = Math.round(hsb.h);
    hsb.s = Math.round(hsb.s) / 100;
    hsb.b = Math.round(hsb.b) / 100;
    hsb.complete = "hsb(" + hsb.h + "," + hsb.s * 100 + "%," + hsb.b * 100 + "%" + ")";
    return hsb;
}