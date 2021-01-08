//! XNColorPicker.js
//！ 仙女颜色选择器
//! https://github.com/fanaiai/xncolorpicker
//! version : 1.0.1
//! authors : 范媛媛
//! create date:2019/05/14
//! update date:2021/01/06
function dynamicLoadJs(urllist) {
    for (let i = 0; i < urllist.length; i++) {

        let url = urllist[i];
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('script');
        link.src = url;
        var finelurl = '<script type="text/javascript" src=' + url + '><\/script>'
        document.write(finelurl)
    }
}

function dynamicLoadCss(urllist) {
    for (let i = 0; i < urllist.length; i++) {
        let url = urllist[i];
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        head.appendChild(link);
    }
}
var scripts = document.getElementsByTagName("script")
var script = scripts[scripts.length - 1];
var s = document.querySelector ? script.src : script.getAttribute("src", 4)//IE8直接.src
// var s =currentlyAddingScript?currentlyAddingScript: document.currentScript.src;
var csspath = s.substr(0, s.lastIndexOf('/') - 0);
var jslist = [csspath + "/jquery.min.js", csspath + "/lib/colorformat/colorFormat.js"]
dynamicLoadJs(jslist);
var csslist = [csspath + "/xncolorpicker.css"]
dynamicLoadCss(csslist);
(function (window) {
    // var that;
    var option = {
        showprecolor: true,//显示预制颜色
        prevcolors: [
            '#EF534F', '#BA69C8', '#FFD54F', '#81C784', '#7FDEEA', '#90CAF9',
            '#F44436', '#AB47BC', '#FFC106', '#66BB6A', '#25C6DA', '#4EC3F7',
            '#E53934', '#9D27B0', '#FFA726', '#4CAF50', '#00ACC1', '#29B6F6',
            '#D32E30', '#8F24AA', '#FB8C01', '#378E3C', '#0097A7', '#02AAF4',
            '#C62928', '#7B1FA2', '#F57C02', '#2F7D31', '#00838F', '#029BE5',
            '#B71B1C', '#6A1B9A', '#EF6C00', '#34691D', '#006164', '#0388D1',
            '#980A0B', '#4A148C', '#E65100', '#1A5E20', '#004D41', '#01579B',
            'rgba(0,0,0,0)', '#FFFFFF', '#DBDBDB', '#979797', '#606060', '#000000',
        ],//预制颜色
        showhistorycolor: true,//显示历史
        historycolornum: 16,//历史条数
        format: 'hsla',//rgba hex hsla
        showPalette: true,//显示色盘
        show: true, //初始化显示
        lang: 'cn',// cn 、en
    }

    function XNColorPicker(options) {
        // that = this;
        this.btns = {
            "cn": ["取消", "确定"],
            "en": ["Cancel", "OK"],
        }
        this.option = $.extend(true, {}, option, options);
        if (typeof this.option.selector == 'string') {
            this.$el = $(this.option.selector);
        } else {
            this.$el = $(this.option.selector)
        }
        this.initCurrentColorBox();
    }

    XNColorPicker.prototype = {
        initCurrentColorBox: function () {
            var that = this;
            this.curcolordom = document.createElement("div");
            this.curcolordom.classList.add("fcolorpicker-curbox");
            this.curcolordom.style.background = this.option.color;
            this.$el.empty().append(this.curcolordom);
            that.init();
            this.curcolordom.onclick = function (e) {
                that.changeShow();
            }
            if (this.option.show) {
                $(that.dom).show();
            }
        },
        changeShow(hide){
            if ($(this.dom).css('display')=='block' || hide) {
                $(this.dom).hide();
            } else {
                $(this.dom).css({"opacity":0,"display":"block"})
                this.setPosition()
                $(this.dom).animate({"opacity":1},200)
            }
        },
        init: function () {
            this.initDom();
            this.addEvent();
            this.getColorFormat(this.option.color || "#000");
            if (this.option.showPalette) {
                this.initPalette();
                this.initColorBand();
                this.initOpacity();
            } else {
                this.dom.querySelector(".color-palette").style.display = 'none'
            }
            this.setPrevColors();
            this.getHistoryColors();
            this.setPosition();
            this.addPosEvent();
            $(this.dom).hide();
        },
        initDom: function () {
            // var dom = document.createElement("div");
            var html = `<div class="fcolorpicker">
            <div class="color-palette">
                <div class="lightness">
                    <div class="lightbar"></div>
                </div>
                <div class="hue">
                    <div class="huebar"></div>
                </div>
                <div class="opacity">
                    <div class="opacitybar"></div>
                </div>
            </div>
            <!--            <p>最近使用</p>-->
            <div class="color-latest fcolor-list">
            </div>
<!--            <p>预置颜色</p>-->
            <div class="color-recommend fcolor-list">
            </div>

            <div class="color-btns">
                <div class="current-color"></div>
                <div class="current-color-value">
                    <input type="text">
                </div>
                <div class="color-btn-group">
                    <a class="cancel-color">${this.btns[this.option.lang][0]}</a>
                    <a class="confirm-color">${this.btns[this.option.lang][1]}</a>
                </div>
            </div>
        </div>`
            // $(dom).append(html);
            this.dom = $(html)[0];
            document.body.appendChild(this.dom);
            this.canvasSize = {
                width: $(this.dom.querySelector(".lightness")).width(),
                height: $(this.dom.querySelector(".lightness")).height(),
            }
            this.lightbar = this.dom.querySelector(".lightbar");
            this.huebar = this.dom.querySelector(".huebar");
            this.opacitybar = this.dom.querySelector(".opacitybar");
            // if(this.option.show){
            //     $(dom).show();
            // }
            // else{
            //     $(dom).find(".fcolorpicker").hide();
            // }
            if (!this.option.showprecolor) {
                $(this.dom).find(".color-recommend").hide();
            }
            if (!this.option.showhistorycolor) {
                $(this.dom).find(".color-latest").hide();
            }
            this.setPosition()
        },
        addPosEvent: function () {
            var that = this;
            window.addEventListener("scroll", function () {
                that.setPosition();
            })
            window.addEventListener("resize", function () {
                that.setPosition();
            })
        },
        setPosition: function () {
            // console.log(this.curcolordom.getBoundingClientRect(),document.documentElement.clientWidth,document.documentElement.clientHeight)
            if (!this.dom) {
                return;
            }
            var wwidth = document.documentElement.clientWidth;
            var wheight = document.documentElement.clientHeight;
            var curcolordom = this.$el[0].querySelector("div")
            var top = curcolordom.getBoundingClientRect().top;
            var left = curcolordom.getBoundingClientRect().left;
            // console.log(this.curcolordom,top)
            var domwidth = $(this.dom).outerWidth();
            var domheight = $(this.dom).outerHeight();
            if (wwidth - left <= domwidth) {
                left = left - domwidth - 10;
            } else {
                left = left + 10 + curcolordom.offsetWidth;
            }
            if (wheight - top < domheight) {
                top = top - domheight - curcolordom.offsetHeight;
            } else {
                top = top
            }
            if (top < 10) {
                top = 10
            }
            this.dom.style.top = top + "px";
            this.dom.style.left = left + "px";
        },

        addHistoryColors: function () {
            for (let i = 0; i < this.hiscolors.length; i++) {
                if (colorFormat({color: this.hiscolors[i], format: "rgba"}).complete == this.color.rgba) {
                    this.hiscolors.splice(i, 1);
                    break;
                }
            }
            this.hiscolors.unshift(this.color.rgba);
            window.localStorage.setItem("fcolorpicker", this.hiscolors.join(";"));
            //this.option.onChange(this.color[this.option.format]);
            this.rendHisColors();
            this.setPosition();
        },
        getHistoryColors: function () {
            // var hiscolors=window.localStorage.clear("fcolorpicker");
            var hiscolors = window.localStorage.getItem("fcolorpicker");
            this.hiscolors = (hiscolors || "").split(";");
            this.rendHisColors();
        },
        rendHisColors: function () {
            if (!this.option.showhistorycolor) {
                return;
            }
            $(this.dom).find(".color-latest").empty();
            for (let i = 0; i < (this.option.historycolornum < 0 ? this.hiscolors.length : this.option.historycolornum); i++) {
                if (this.hiscolors[i] && this.hiscolors[i] != '') {
                    let html = `
                    <div class="color-item" style="background:${this.hiscolors[i]}" data-color="${this.hiscolors[i]}"></div>
                `
                    $(this.dom).find(".color-latest").append(html);
                }
            }
        },
        setPrevColors: function () {
            if (!this.option.showprecolor) {
                return;
            }
            for (let i = 0; i < this.option.prevcolors.length; i++) {
                let html = `
                    <div class="color-item" style="background:${this.option.prevcolors[i]}" data-color="${this.option.prevcolors[i]}"></div>
                `
                $(this.dom).find(".color-recommend").append(html);
            }
        },
        addEvent: function () {
            var t = null;
            var that = this;
            this.dom.querySelector(".current-color-value input").addEventListener("blur", function (e) {
                that.getColorFormat(that.dom.querySelector(".current-color-value input").value);
                that.fillOpacity();
                that.fillPalette();
                that.addHistoryColors();
                return;
            }, false)
            var startpos = {
                top: 0,
                left: 0,
                bartop: 0
            }
            that.dom.addEventListener("mousedown", function (e) {
                var $t = $(e.target);

                t = null;
                if ($t.parents(".lightness").length > 0) {
                    t = 'lightness';
                }
                if ($t.parents(".hue").length > 0) {
                    t = 'hue';
                    var changeY = e.offsetY * 100 / that.canvasSize.height;
                    that.huebar.style.top = changeY.toFixed(2) + '%';
                    startpos.bartop = parseFloat(that.huebar.style.top);

                }
                if ($t.parents(".opacity").length > 0) {
                    t = 'opacity';
                    var changeY = (e.offsetY * 100 / that.canvasSize.height);
                    that.opacitybar.style.top = changeY.toFixed(2) + '%';
                    startpos.bartop = parseFloat(that.opacitybar.style.top);
                }
                startpos.x = e.clientX;
                startpos.y = e.clientY;
                that.changeColor(t, e, null);
                that.option.onChange(that.color[that.option.format]);
            })
            this.dom.addEventListener("mousemove", function (e) {
                // if ($(e.target).parents("." + t).length > 0) {
                if (t) {
                    that.changeColor(t, e, startpos);
                    that.option.onChange(that.color[that.option.format]);
                }
                // }
            })
            this.dom.addEventListener("mouseup", function (e) {
                t = null;
            })
            this.dom.addEventListener("click", function (e) {
                e.stopPropagation();
                var $t = $(e.target);
                if ($t.hasClass("color-item")) {
                    that.getColorFormat($t.attr("data-color"));
                    that.fillOpacity();
                    that.fillPalette();
                    that.addHistoryColors();
                    return;
                }
                if ($t.hasClass("cancel-color")) {
                    that.getColorFormat(that.option.color);
                    that.fillOpacity();
                    that.fillPalette();
                    that.option.onCancel(that.color[that.option.format]);
                    that.changeShow(true);
                    return;
                }
                if ($t.hasClass("confirm-color")) {
                    that.getColorFormat(that.dom.querySelector(".current-color-value input").value);
                    that.fillOpacity();
                    that.fillPalette();
                    // that.addHistoryColors();
                    that.addHistoryColors();
                    that.option.onConfirm(that.color[that.option.format]);
                    that.option.color = that.color[that.option.format];
                    that.changeShow(true);
                    return;
                }
            })
            var mousedownFunc=(e)=>{
                e.stopPropagation();
                if (that.dom && e.target != that.dom && $(e.target).parents(".fcolorpicker")[0] != that.dom && $(e.target)[0] != that.curcolordom) {
                    that.getColorFormat(that.option.color);
                    that.fillOpacity();
                    that.fillPalette();
                    if($(that.dom).css('display')=='block'){
                    that.option.onCancel(that.color[that.option.format]);
                    that.changeShow(true);}
                }
            }
            this.removeMouseDownEvent=()=>{
                document.removeEventListener("mousedown", mousedownFunc)
            }
            document.addEventListener("mousedown", mousedownFunc)
        },

        changeColor: function (t, e, startpos) {
            if (!t) {
                return;
            }
            var x = e.offsetX;
            var y = e.offsetY;
            var color;
            var imageData = this['ctx' + t].getImageData(x, y, 1, 1).data;
            if (startpos) {
                var changeY = (e.clientY - startpos.y) * 100 / this.canvasSize.height + startpos.bartop;
                if (changeY > 99.9) {
                    return;
                }
                if (changeY < 0) {
                    changeY = 0;
                }
            } else {
                changeY = (e.offsetY * 100 / this.canvasSize.height).toFixed(2);
            }
            switch (t) {
                case 'hue':
                    this.huebar.style.top = changeY + '%';
                    color = 'hsla(' + (changeY * 360 / 100) + ',' + this.color.hslav[1] + '%,' + this.color.hslav[2] + '%,' + this.color.hslav[3] + ')';
                    break;
                case 'lightness':
                    // console.log(x,y)
                    if (x < 0) {
                        x = 0;
                    }
                    if (y < 0) {
                        y = 0;
                    }
                    color = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',' + this.color.rgbav[3] + ')';
                    this.lightbar.style.top = y + 'px';
                    this.lightbar.style.left = x + 'px';
                    break;
                case 'opacity':
                    changeY = changeY > 99.2 ? 100 : changeY
                    this.opacitybar.style.top = changeY + '%';
                    color = 'rgba(' + this.color.rgbav[0] + ',' + this.color.rgbav[1] + ',' + this.color.rgbav[2] + ',' + ((100 - changeY) / 100).toFixed(2) + ')';
                    break;
            }
            this.getColorFormat(color);
            if (t == 'hue') {
                this.fillOpacity();
                this.fillPalette();
            }
            this.setPosition()
            // console.log(color)
        },
        initColorBand: function () {
            var canvas = document.createElement("canvas");
            this.ctxhue = canvas.getContext("2d");
            canvas.width = 10;
            canvas.height = this.canvasSize.height;
            this.dom.querySelector(".color-palette .hue").appendChild(canvas)
            this.ctxhue.rect(0, 0, 10, this.canvasSize.height);
            var grd1 = this.ctxhue.createLinearGradient(0, 0, 0, this.canvasSize.height);
            grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
            grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
            grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
            grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
            grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
            grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
            grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
            this.ctxhue.fillStyle = grd1;
            this.ctxhue.fill();
        },
        initOpacity: function () {
            var canvas = document.createElement("canvas");
            this.ctxopacity = canvas.getContext("2d");
            canvas.width = 10;
            canvas.height = this.canvasSize.height;
            this.dom.querySelector(".color-palette .opacity").appendChild(canvas)
            this.fillOpacity();
        },
        fillOpacity: function () {
            this.ctxopacity.clearRect(0, 0, 10, this.canvasSize.height)
            var grdWhite = this.ctxlightness.createLinearGradient(0, 0, 10, this.canvasSize.height);
            grdWhite.addColorStop(0, 'rgba(' + this.color.rgbav[0] + ',' + this.color.rgbav[1] + ',' + this.color.rgbav[2] + ',1)');
            grdWhite.addColorStop(1, 'rgba(' + this.color.rgbav[0] + ',' + this.color.rgbav[1] + ',' + this.color.rgbav[2] + ',0)');
            this.ctxopacity.fillStyle = grdWhite;
            this.ctxopacity.fillRect(0, 0, 10, this.canvasSize.height);

        },
        initPalette: function () {
            this.canvas = document.createElement("canvas");
            this.ctxlightness = this.canvas.getContext("2d");
            this.canvas.width = this.canvasSize.width;
            this.canvas.height = this.canvasSize.height;
            this.dom.querySelector(".color-palette .lightness").appendChild(this.canvas)
            this.fillPalette();

        },
        fillPalette() {
            this.ctxlightness.fillStyle = "hsla(" + this.color.hslav[0] + ",100%,50%,1)";
            var width1 = this.canvasSize.width;
            var height1 = this.canvasSize.height;
            this.ctxlightness.fillRect(0, 0, width1, height1);
            var grdWhite = this.ctxlightness.createLinearGradient(0, 0, width1, 0);
            grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
            grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
            this.ctxlightness.fillStyle = grdWhite;
            this.ctxlightness.fillRect(0, 0, width1, height1);

            var grdBlack = this.ctxlightness.createLinearGradient(0, 0, 0, height1);
            grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
            grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
            this.ctxlightness.fillStyle = grdBlack;
            this.ctxlightness.fillRect(0, 0, width1, height1);
        },
        setColor: function (color) {
            this.option.color = color;
            this.getColorFormat(color)
        },
        getColor: function (color) {
            return this.color;
        },
        getColorFormat: function (color1) {

            if (color1.indexOf("rgb") < 0 && color1.indexOf("#") < 0 && color1.indexOf("hsl") < 0) {
                color1 = 'rgba(0,0,0,0)'
            }
            var color = {
                "rgba": colorFormat({color: color1, format: "rgba"}).complete,
                "hsla": colorFormat({color: color1, format: "hsla"}).complete,
                "hex": colorFormat({color: color1, format: "hex"}).complete,
            };
            if ((!color.rgba || color.rgba.indexOf("NaN") > -1)) {
                if (this.dom) {
                    this.dom.querySelector(".current-color-value input").value = this.color[this.option.format];
                    return;
                } else {
                    return;
                }
            }
            this.color = color;
            // console.log(color)
            // console.log(color1,colorFormat({color: 'hsla(133.95348837209303,0%,20%,1)', format: "hsla"}).complete)
            this.color.rgbav = this.color.rgba.slice(5, this.color.rgba.indexOf(')')).split(",")
            this.color.hslav = this.color.hsla.slice(5, this.color.hsla.indexOf(')')).split(",").map(function (ele) {
                if (ele.indexOf("%") > -1) {
                    return ele.slice(0, ele.indexOf("%"))
                } else {
                    return ele;
                }
            })
            this.curcolordom.style.background = this.color.rgba;

            if (!this.dom) {
                return;
            }
            this.dom.querySelector(".current-color").style.background = this.color.rgba;
            this.dom.querySelector(".current-color-value input").value = this.color[this.option.format];
            this.setBarPos();
        },
        setBarPos: function () {
            this.opacitybar.style.top = (1 - this.color.rgbav[3]) * 100 + "%";
            if (parseFloat(this.color.hslav[1]) != 0) {
                this.huebar.style.top = (this.color.hslav[0] * 100) / 360 + "%";
            }
        },
        $copy: function (text) {
            // if (text.indexOf('-') !== -1) {
            //     let arr = text.split('-');
            //     text = arr[0] + arr[1];
            // }
            var textArea = document.createElement("textarea");
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
                layer.msg(msg, {skin: "suclayer"});
            } catch (err) {
                layer.msg('该浏览器不支持点击复制到剪贴板', {skin: "errorlayer"});
            }

            document.body.removeChild(textArea);
        },
        destroy:function(){
            $(this.dom).remove();
            this.removeMouseDownEvent();
        },
    }
    window.XNColorPicker = XNColorPicker;
})(window)
