console.group('hexToRgb HEX转RGB');
    console.group('hexToRgb("#fff"):');
        console.dir(hexToRgb("#fff"));
    console.groupEnd();
    console.group('hexToRgb("#ffff"):');
        console.dir(hexToRgb("#ffff"));
    console.groupEnd();
    console.group('hexToRgb("#FF0000"):');
        console.dir(hexToRgb("#FF0000"));
    console.groupEnd();
    console.group('hexToRgb("#FF0000fa"):');
        console.dir(hexToRgb("#FF0000fa"));
    console.groupEnd();
console.groupEnd();
function hexToRgb(hex) {
    hex = hex.replace("#", "");
    var red, green, blue, opacity, flag; // flag 0表示rgb，1表示rgba
    var hexsplit = hex.split("");
    if (hex.length == 3) {
        red = parseInt(hexsplit[0] + hexsplit[0], 16);
        green = parseInt(hexsplit[1] + hexsplit[1], 16);
        blue = parseInt(hexsplit[2] + hexsplit[2], 16);
        opacity = 1;
        flag = 0;
    }else if(hex.length == 4){
        red = parseInt(hexsplit[0] + hexsplit[0], 16);
        green = parseInt(hexsplit[1] + hexsplit[1], 16);
        blue = parseInt(hexsplit[2] + hexsplit[2], 16);
        opacity = Math.round(parseInt(hexsplit[3] + hexsplit[3], 16) / 255 * 100) / 100;
        flag = 1;
    }else if(hex.length == 6){
        red = parseInt(hexsplit[0] + hexsplit[1], 16);
        green = parseInt(hexsplit[2] + hexsplit[3], 16);
        blue = parseInt(hexsplit[4] + hexsplit[5], 16);
        opacity = 1;
        flag = 0;
    }else if(hex.length == 8){
        red = parseInt(hexsplit[0] + hexsplit[1], 16);
        green = parseInt(hexsplit[2] + hexsplit[3], 16);
        blue = parseInt(hexsplit[4] + hexsplit[5], 16);
        opacity = Math.round(parseInt(hexsplit[6] + hexsplit[7], 16) / 255 * 100) / 100;
        flag = 1;
    }
    return {
        r: red,
        g: green,
        b: blue,
        o: opacity,
        complete: flag ? 
            ("rgba(" + [red, green, blue, opacity].join(",") + ")") : 
            ("rgb(" + [red, green, blue].join(",") + ")")
    }
}