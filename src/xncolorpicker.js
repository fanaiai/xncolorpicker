//! XNColorPicker.js
//！ 仙女颜色选择器
//! https://github.com/fanaiai/xncolorpicker
//! version : 1.0.1
//! authors : 范媛媛
//! create date:2019/05/14
//! update date:2021/01/06 v1.0.0发布
//! update date:2021/01/06 v1.1.0发布
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
var csslist = [csspath + "/xncolorpicker.css", "//at.alicdn.com/t/font_2330183_pruflrov4th.css"]
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
        colorType: 'single',//single,linear-gradient,radial-gradient,初始化颜色类型
        colorTypeOption: ['single', 'linear-gradient', 'radial-gradient'],//可切换的颜色类型
    }

    function XNColorPicker(options) {
        // that = this;
        this.id = this.getRandomString();
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
        this.lastColor = this.option.color;//上一次的颜色值
        this.initCurrentColorBox();

    }

    XNColorPicker.prototype = {
        getRandomString(len) {
            len = len || 8;
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
            /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var pwd = '';
            for (let i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },
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
        changeShow(hide) {
            if ($(this.dom) && $(this.dom).css('display') == 'block' || hide) {
                $(this.dom).empty();
                $(this.dom).hide();
            } else {
                this.init();
                $(this.dom).show();
            }
        },
        init: function () {
            this.initDom();

            this.initColorFormat();
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
        rendGradientDom() {

        },
        initDom: function () {
            // var dom = document.createElement("div");
            var reRend = true;
            var container = document.body.querySelector('.fcolorpicker#' + this.id);
            if (!container) {
                container = document.createElement('div')
                container.classList.add('fcolorpicker')
                container.id = this.id;
                reRend = false;
            }
            var html =
                `
            <div class="color-type">
               <span class="single">纯色</span>
               <span class="linear-gradient">线性渐变</span>
               <span class="radial-gradient">径向渐变</span>
            </div>
            <div class="color-gradient">
                <div class="gradient-bar-container">
                    <div class="gradient-colors">
                        <div class="gradient-item iconfontcolorpicker iconcolorpicker1" style="left:10%">
                            <div class="color"></div>
                        </div>
                        <div class="gradient-item iconfontcolorpicker iconcolorpicker1" style="left:20%">
                            <div class="color"></div>
                        </div>
                    </div>
                    <div class="gradient-bar">
                    
                    </div>
                    <a class="add-gradient iconfontcolorpicker iconcolorpicker11"></a>
                </div>
                <div class="gradient-angle">
                    <div class="current-angle">
                      <div class="angle-bar"></div>
                      <span>30°</span>
</div>
</div>
            </div>
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
                <div class="color-preview">
                    <div class="current-color"></div>
                    <div class="current-color-value">
                        <input type="text" onfocus="this.select()">
                    </div>
                </div>
                
                <div class="color-btn-group">
                    <a class="cancel-color">${this.btns[this.option.lang][0]}</a>
                    <a class="confirm-color">${this.btns[this.option.lang][1]}</a>
                </div>
            </div>`
            // $(dom).append(html);
            container.innerHTML = html;

            this.dom = container;
            document.body.appendChild(this.dom);
            this.canvasSize = {
                width: 212,
                height: 129,
            }
            this.lightbar = this.dom.querySelector(".lightbar");
            this.huebar = this.dom.querySelector(".huebar");
            this.opacitybar = this.dom.querySelector(".opacitybar");
            if (!this.option.showprecolor) {
                $(this.dom).find(".color-recommend").hide();
            }
            if (!this.option.showhistorycolor) {
                $(this.dom).find(".color-latest").hide();
            }
            this.setPosition()
            if (!reRend) {
                this.addEvent();
            }
            this.addBlurEvent();
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
        addBlurEvent(){
            var that = this;
            this.dom.querySelector("input").onblur=(e) => {
                // if (e.target.nodeName == 'input') {
                    that.initColorFormat(that.dom.querySelector(".current-color-value input").value);
                    that.fillOpacity();
                    that.fillPalette();
                    that.addHistoryColors();
                // }
            }
        },
        addEvent: function () {
            var t = null;
            var that = this;
            var startpos = {
                top: 0,
                left: 0,
                bartop: 0,
                isGradientBar: false,
                $ele: null
            }
            that.dom.addEventListener("mousedown", (e) => {
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
                if ($t.parents(".gradient-item")[0]) {
                    $t = $t.parents('.gradient-item')
                }
                if ($t.hasClass("gradient-item")) {
                    startpos.isGradientBar = true;
                    this.gradientIndex = $t.index();
                    this.updateGradientBar();
                    this.setCurrentGradientColor();
                    startpos.$ele = $t;
                }
                if ($t.hasClass("add-gradient")) {
                    this.gradientColor.arry.colors.push({
                        per: 100,
                        color: '#ffffff'
                    })
                    this.gradientColor=this.revertGradientToString(this.gradientColor.arry)
                    this.gradientIndex = this.gradientColor.arry.colors.length-1;
                    this.rendInputValue();
                    this.rendGradientColors();
                    this.updateGradientBar();
                }
                if ($t.hasClass("angle-bar")) {
                    startpos.isGradientBar = false;
                    startpos.isAngleBar = true;
                }
            })
            document.addEventListener("mousemove", (e) => {
                // if ($(e.target).parents("." + t).length > 0) {
                if (t) {
                    that.changeColor(t, e, startpos);
                    that.option.onChange(that.color[that.option.format]);
                } else if (startpos.isGradientBar) {//如果移动渐变滑块
                    var per = ((e.clientX - $(this.dom).find(".gradient-colors")[0].getBoundingClientRect().left) * 100 / $(this.dom).find(".gradient-colors")[0].getBoundingClientRect().width).toFixed(1);
                    if(this.gradientColor.arry.colors.length<3){
                        if (per > 100) {
                            per = 100;
                        }
                        if (per < 0) {
                            per = 0;
                        }
                    }
                    else{
                        if (per > 100 && per <= 105) {
                            per = 100;
                        }
                        if (per >= -5 && per < 0) {
                            per = 0;
                        }
                    }

                    this.gradientColor.arry.colors[this.gradientIndex].per = per;
                    startpos.$ele.css({left: per + '%'})
                    this.updateGradientColors(true);
                    this.changeCurColorDom();

                    if(per<-5|| per>105){
                        startpos.$ele.addClass("deleting-item")
                    }
                    else{
                        startpos.$ele.removeClass("deleting-item")
                    }
                } else if (startpos.isAngleBar) {
                    var angle = ((e.clientX - $(this.dom).find(".gradient-angle")[0].getBoundingClientRect().left) * 360 / $(this.dom).find(".gradient-angle")[0].getBoundingClientRect().width).toFixed(1);
                    if (angle < 0) {
                        angle = 0
                    }
                    if (angle > 360) {
                        angle = 360
                    }
                    this.gradientColor.arry.angle = angle;
                    this.updateAngleBar();
                    this.updateGradientColors();
                    this.changeCurColorDom();
                }
                // }
            })
            document.addEventListener("mouseup", (e) => {
                if (startpos.isGradientBar) {
                    var per = ((e.clientX - $(this.dom).find(".gradient-colors")[0].getBoundingClientRect().left) * 100 / $(this.dom).find(".gradient-colors")[0].getBoundingClientRect().width).toFixed(1);
                    if(this.gradientColor.arry.colors.length>2){
                        if (per > 105 || per < -5) {
                            this.gradientColor.arry.colors.splice(this.gradientIndex, 1);
                            startpos.$ele.remove();
                            this.updateGradientBar();
                            this.gradientColor=this.revertGradientToString(this.gradientColor.arry)
                            this.rendInputValue();
                        }
                    }
                    else{

                    }


                }
                t = null;
                startpos.isGradientBar = false;
                startpos.isAngleBar = false;
            })
            this.dom.addEventListener("click", (e) => {
                e.stopPropagation();
                var $t = $(e.target);
                if ($t.hasClass("color-item")) {
                    that.getColorFormat($t.attr("data-color"));
                    that.fillOpacity();
                    that.fillPalette();
                    that.addHistoryColors();
                    if (this.currentColorType != 'single') {
                        this.updateGradientColors();
                        this.changeCurColorDom();
                    }
                    return;
                }
                if ($t.hasClass("cancel-color")) {
                    // that.getColorFormat(that.option.color);
                    that.initColorFormat(this.lastColor, true)
                    // that.fillOpacity();
                    // that.fillPalette();
                    var confirmcolor = {
                        colorType: this.currentColorType
                    };
                    if (this.currentColorType == 'single') {
                        confirmcolor.color = that.color;
                        this.lastColor = this.color.rgba;
                    } else {
                        confirmcolor.color = this.gradientColor;
                        this.lastColor = this.gradientColor.str;
                    }
                    this.changeCurColorDom()
                    that.option.onCancel(confirmcolor);
                    that.changeShow(true);
                    return;
                }
                if ($t.hasClass("confirm-color")) {
                    that.initColorFormat(that.dom.querySelector(".current-color-value input").value, true)
                    // that.getColorFormat(that.dom.querySelector(".current-color-value input").value);
                    // that.fillOpacity();
                    // that.fillPalette();
                    // that.addHistoryColors();
                    that.addHistoryColors();
                    var confirmcolor = {
                        colorType: this.currentColorType
                    };
                    if (this.currentColorType == 'single') {
                        confirmcolor.color = that.color;
                        this.lastColor = this.color.rgba;
                    } else {
                        confirmcolor.color = this.gradientColor;
                        this.lastColor = this.gradientColor.str;
                    }
                    that.option.onConfirm(confirmcolor);
                    that.changeShow(true);
                    this.changeCurColorDom()
                    return;
                }
                if ($t.parents('.color-type')[0] && !$t.hasClass("on")) {
                    var type = $t[0].className;
                    this.currentColorType = type;
                    this.changeColorType();
                }
            })
            var mousedownFunc = (e) => {
                e.stopPropagation();
                if (that.dom && e.target != that.dom && $(e.target).parents(".fcolorpicker")[0] != that.dom && $(e.target)[0] != that.curcolordom) {
                    // that.getColorFormat(that.option.color);
                    // that.fillOpacity();
                    // that.fillPalette();
                    if ($(that.dom).css('display') == 'block') {
                        that.option.onCancel(that.color[that.option.format]);
                        that.changeShow(true);
                    }
                }
            }
            this.removeMouseDownEvent = () => {
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

            if (startpos) {
                var changeY = (e.clientY - startpos.y) * 100 / this.canvasSize.height + startpos.bartop;
                if (changeY > 99.9 && t != 'lightness') {
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
                    var x = e.clientX - this.dom.querySelector('.lightness').getBoundingClientRect().left;
                    var y = e.clientY - this.dom.querySelector('.lightness').getBoundingClientRect().top;
                    if (x < 0) {
                        x = 0;
                    }
                    if (y < 0) {
                        y = 0;
                    }
                    if (x > this.dom.querySelector('.lightness canvas').getBoundingClientRect().width) {
                        x = this.dom.querySelector('.lightness canvas').getBoundingClientRect().width ;
                    }
                    if (y > this.dom.querySelector('.lightness canvas').getBoundingClientRect().height) {
                        y = this.dom.querySelector('.lightness canvas').getBoundingClientRect().height;
                    }
                    // var imageData = this['ctx' + t].getImageData(x, y, 1, 1).data;
                    // color = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',' + this.color.rgbav[3] + ')';
                    var h=this.color.hslav[0];
                    var s=x/this.canvasSize.width*100;
                    var b=100-y/this.canvasSize.height*100;
                    console.log(x,y,s,b)
                    var rgb = this.HSBToRGB({h:h, s:s, b:b});
                    color='rgba('+rgb.r+','+rgb.g+','+rgb.b+','+this.color.rgbav[3]+')';
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
            if (this.currentColorType != 'single') {
                this.updateGradientColors();
            }
            this.changeCurColorDom();
            // console.log(color)
        },
        HSBToRGB (hsb){
        var rgb = {};
        var h = hsb.h;
        var s = hsb.s*255/100;
        var b = hsb.b*255/100;
        if(s == 0){
            rgb.r = rgb.g = rgb.b = b;
        }else{
            var t1 = b;
            var t2 = (255 - s) * b /255;
            var t3 = (t1 - t2) * (h % 60) /60;
            if(h == 360) h = 0;
            if(h < 60) {rgb.r=t1; rgb.b=t2; rgb.g=t2+t3}
            else if(h < 120) {rgb.g=t1; rgb.b=t2; rgb.r=t1-t3}
            else if(h < 180) {rgb.g=t1; rgb.r=t2; rgb.b=t2+t3}
            else if(h < 240) {rgb.b=t1; rgb.r=t2; rgb.g=t1-t3}
            else if(h < 300) {rgb.b=t1; rgb.g=t2; rgb.r=t2+t3}
            else if(h < 360) {rgb.r=t1; rgb.g=t2; rgb.b=t1-t3}
            else {rgb.r=0; rgb.g=0; rgb.b=0}
        }
        return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
    },
        updateGradientColors(ismoveItem) {
            this.gradientColor.arry.colors[this.gradientIndex].color = this.color.rgba;
            this.updateGradientBar();
            this.updateGradientColorItem(this.gradientIndex, this.color.rgba)
            this.gradientColor = this.revertGradientToString(this.gradientColor.arry)
            this.rendInputValue();
            if (!ismoveItem) {
                this.rendGradientColors();
            }
        },
        rendInputValue(){
            if(this.currentColorType!='single'){
                this.dom.querySelector(".current-color").style.background = this.gradientColor.str;
                this.dom.querySelector(".current-color-value input").value = this.gradientColor.str;
            }
            else{
                this.dom.querySelector(".current-color").style.background = this.color[this.option.format];
                this.dom.querySelector(".current-color-value input").value = this.color[this.option.format];
            }
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
            this.updatelightbar();
        },
        updatelightbar(){
            this.lightbar = this.dom.querySelector(".lightbar");
            var hsb=this.RGBToHSB({r:this.color.rgbav[0],g:this.color.rgbav[1],b:this.color.rgbav[2],})
            var x=hsb['s']*this.canvasSize.width/100;
            var y=(100-hsb['b'])*this.canvasSize.height/100;
            this.lightbar.style.top = y + 'px';
            this.lightbar.style.left = x + 'px';
        },
        RGBToHSB(rgb){
        var hsb = {h:0, s:0, b:0};
        var min = Math.min(rgb.r, rgb.g, rgb.b);
        var max = Math.max(rgb.r, rgb.g, rgb.b);
        var delta = max - min;
        hsb.b = max;
        hsb.s = max != 0 ? 255*delta/max : 0;
        if(hsb.s != 0){
            if(rgb.r == max){
                hsb.h = (rgb.g - rgb.b) / delta;
            }else if(rgb.g == max){
                hsb.h = 2 + (rgb.b - rgb.r) / delta;
            }else{
                hsb.h = 4 + (rgb.r - rgb.g) / delta;
            }
        }else{
            hsb.h = -1;
        };
        if(max == min){
            hsb.h = 0;
        };
        hsb.h *= 60;
        if(hsb.h < 0) {
            hsb.h += 360;
        };
        hsb.s *= 100/255;
        hsb.b *= 100/255;
        return hsb;
        },
        setColor: function (color) {
            this.option.color = color;
            this.getColorFormat(color)
        },
        getColor: function (color) {
            return this.color;
        },
        initColorFormat(color,isConfirm) {
            var color = color || this.lastColor;
            if (typeof color == 'Object') {
                this.gradientColor = this.revertGradientToString(color)
                if (this.gradientColor.str.indexOf('linear-gradient') > -1) {
                    this.currentColorType = 'linear-gradient';
                } else {
                    this.currentColorType = 'radial-gradient';
                }
            } else if (color.toLowerCase().indexOf('linear-gradient') > -1 || color.toLowerCase().indexOf('radial-gradient') > -1) {
                this.gradientColor = this.revertGradientToArray(color)
                if (this.gradientColor.str.indexOf('linear-gradient') > -1) {
                    this.currentColorType = 'linear-gradient';
                } else {
                    this.currentColorType = 'radial-gradient';
                }
            } else {
                this.getColorFormat(color || "#000");
                this.currentColorType = 'single';
            }
            if(isConfirm){
                return;
            }
            this.changeColorType(true)
            if (this.currentColorType != 'single') {
                // this.dom.querySelector(".current-color").style.background = this.gradientColor.str;
                // this.dom.querySelector(".current-color-value input").value = this.gradientColor.str;
                // this.rendGradientColors();
                this.setCurrentGradientColor();
                this.updateAngleBar();
                this.updateGradientColors();
                this.rendGradientColors();
            }
        },
        setCurrentGradientColor() {
            console.log(this.gradientColor.arry.colors, this.gradientIndex)
            this.getColorFormat(this.gradientColor.arry.colors[this.gradientIndex].color)
        },
        updateAngleBar() {
            $(this.dom).find('.current-angle span').html(this.gradientColor.arry.angle + '°')
            $(this.dom).find('.current-angle .angle-bar').css('left', this.gradientColor.arry.angle / 3.6 + '%')
        },
        updateGradientColorItem(index, color) {
            $(this.dom).find('.gradient-item').eq(index).find('.color').css("background", color)
        },
        updateGradientBar() {
            var back = this.revertGradientToString(this.gradientColor.arry, true)
            $(this.dom).find('.gradient-bar').css("background", back.str)
            $(this.dom).find(".gradient-item").removeClass("on").eq(this.gradientIndex).addClass("on")
        },
        rendGradientColors() {
            var list = ''
            for (let i = 0; i < this.gradientColor.arry.colors.length; i++) {
                let html = `<div class="gradient-item iconfontcolorpicker iconcolorpicker1" style="left:${this.gradientColor.arry.colors[i].per}%">
                            <div class="color" style="background:${this.gradientColor.arry.colors[i].color}"></div>
                        </div>`
                list += html;
            }
            $(this.dom).find(".gradient-colors").empty().append(list)
            $(this.dom).find(".gradient-item").removeClass("on").eq(this.gradientIndex).addClass("on")
        },
        setColorTypeDom(){
            $(this.dom).find('.color-type span').removeClass('on')
            $(this.dom).find('.' + this.currentColorType).addClass('on')
        },
        changeColorType(justInit) {
            this.setColorTypeDom();
            this.gradientIndex = 0;
            if (this.currentColorType == 'single') {
                if(!justInit){
                this.getColorFormat(this.gradientColor.arry.colors[0].color);}
                $(this.dom).find('.color-gradient').hide();
            } else {
                if(!justInit){
                if (!this.gradientColor) {
                    this.gradientColor = {
                        type: this.currentColorType,
                    }
                    this.initColorFormat({type: this.currentColorType, angle: 0, colors: [this.color.rgba, 'rgba(0,0,0,0)']})
                }}
                if(this.gradientColor.arry.type!=this.currentColorType){
                this.gradientColor.arry.type=this.currentColorType;
                this.gradientColor=this.revertGradientToString(this.gradientColor.arry)
                }
                $(this.dom).find('.color-gradient').show();
                this.rendGradientColors();
                this.updateGradientBar();
                this.updateAngleBar();
                this.changeCurColorDom();
                // this.rend
                if(this.currentColorType=='linear-gradient'){
                    $(this.dom).find('.gradient-angle').show();
                }
                else{
                    $(this.dom).find('.gradient-angle').hide();
                }
            }
            this.rendInputValue();
            this.setPosition();
        },
        getColorFormat: function (color1) {
            this.color = this.getColorFormatFunc(color1);
            this.color.rgbav = this.color.rgba.slice(5, this.color.rgba.indexOf(')')).split(",")
            this.color.hslav = this.color.hsla.slice(5, this.color.hsla.indexOf(')')).split(",").map(function (ele) {
                if (ele.indexOf("%") > -1) {
                    return ele.slice(0, ele.indexOf("%"))
                } else {
                    return ele;
                }
            })
            if (!this.dom) {
                return;
            }
            if (this.currentColorType == 'single') {
                this.changeCurColorDom();
                this.dom.querySelector(".current-color").style.background = this.color.rgba;
                this.dom.querySelector(".current-color-value input").value = this.color[this.option.format];
            }
            this.setBarPos();
        },
        changeCurColorDom() {
            if (this.currentColorType == 'single') {
                this.curcolordom.style.background = this.color.rgba;
            } else {
                this.curcolordom.style.background = this.gradientColor.str;
            }
        },
        getColorFormatFunc(color1) {
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
            return color
        },
        setBarPos: function () {
            this.opacitybar.style.top = (1 - this.color.rgbav[3]) * 100 + "%";
            if (parseFloat(this.color.hslav[1]) != 0) {
                this.huebar.style.top = (this.color.hslav[0] * 100) / 360 + "%";
            }
        },
        replace(...args) {
            const string = `${args[0]}`
            return args.length < 3 ? string : string.replace(args[1], args[2])
        },
        revertGradientToArray: function (value) {
            var type = ''
            value = value.toLowerCase();
            var reg1 = /(rgba\(.*?\))/gi;
            var reg2 = /(hsla\(.*?\))/gi;
            value = (this.replace(value, reg1, (r) => {
                return this.getColorFormatFunc(r).hex;
            }))
            value = (this.replace(value, reg2, (r) => {
                return this.getColorFormatFunc(r).hex;
            }))
            if (value.toLowerCase().indexOf('radial-gradient') > -1) {
                type = 'radial-gradient';
            }
            if (value.toLowerCase().indexOf('linear-gradient') > -1) {
                type = 'linear-gradient';
            }
            var arry = value.slice(value.toLowerCase().indexOf(type) + 16, value.toLowerCase().lastIndexOf(')')).split(',').map((res) => {
                return res.trim()
            })

            var obj = {
                type: type,
                angle: type == 'linear-gradient'?(parseFloat(arry[0])).toFixed(0):0,
                colors: []
            }
            for (let i = (type == 'linear-gradient'?1:0); i < arry.length; i++) {
                let color = arry[i].split(' ')
                obj.colors.push(
                    {
                        color: color[0],
                        per: color[1] ? parseFloat(color[1]) : (100 * (i - 1) / (arry.length - 2))
                    }
                )
            }
            return {
                str: value,
                arry: obj
            }
        },
        revertGradientToString: function (value, isbar) {
            var gradient = (isbar?'linear-gradient':value.type) + '(';
            if (isbar) {
                gradient += 'to right,';
            } else if (value.type == 'linear-gradient') {
                gradient += parseFloat(value.angle).toFixed(1) + 'deg,';
            }
            for (let i = 0; i < value.colors.length; i++) {
                gradient += this.getColorFormatFunc(value.colors[i].color).rgba + ' ' + parseFloat(value.colors[i].per).toFixed(1);
                if (value.colors[i].per != '') {
                    gradient += '%'
                }
                if (i < value.colors.length - 1) {
                    gradient += ','
                }
            }
            gradient += ')';
            return {str: gradient, arry: value};
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
        destroy: function () {
            $(this.dom).remove();
            this.removeMouseDownEvent();
        },
    }
    window.XNColorPicker = XNColorPicker;
})(window)
