//! XNColorPicker.js
//！ 仙女颜色选择器
//! https://github.com/fanaiai/xncolorpicker
//! version : 1.2.3
//! authors : 范媛媛
//! create date:2019/05/14
//! update date:2021/01/06 v1.0.0发布
//! update date:2021/01/06 v1.1.0发布
//! update date:2021/01/27 v1.2.0发布
//! update date:2021/02/09 v1.2.1发布
//! update date:2021/03/16 v1.2.2发布
//! update date:2021/03/17 v1.2.3发布
//! update date:2021/03/29 v1.2.4发布
//! update date:2021/04/22 v1.2.5发布
//! update date:2021/11/25 v1.2.6发布
//! v1.2.1 剔除jquery
import './xnquery.js'
import colorFormat from './colorFormat.min.js'
import './xncolorpicker.css'
import './iconfont/iconfont.css'
import {colorwords} from './xncolorwords'
(function (window, $) {
    var option = {
        color: '#ffffff',//初始颜色
        selector: "",//选择器容器
        showprecolor: true,//显示预制颜色
        prevcolors: ["#EF534F", "#BA69C8", "#FFD54F", "#81C784", "#7FDEEA", "#90CAF9", "#F44436", "#AB47BC", "#FFC106", "#66BB6A", "#25C6DA", "#4EC3F7", "#E53934", "#9D27B0", "#FFA726", "#4CAF50", "#00ACC1", "#29B6F6", "#D32E30", "#8F24AA", "#FB8C01", "#378E3C", "#0097A7", "#02AAF4", "#C62928", "#7B1FA2", "#F57C02", "#2F7D31", "#00838F", "#029BE5", "#B71B1C", "#6A1B9A", "#EF6C00", "#34691D", "#006164", "#0388D1", "#980A0B", "#4A148C", "#E65100", "#1A5E20", "#004D41", "#01579B", "#00000000", "#FFFFFF", "#DBDBDB", "#979797", "#606060", "#000000"],//预制颜色
        showhistorycolor: true,//显示历史
        historycolornum: 16,//历史条数
        format: 'rgba',//rgba hex hsla,初始颜色类型
        showPalette: true,//显示色盘
        show: false, //初始化显示
        alwaysShow: false,//选择器是否一直显示
        lang: 'cn',// 中英文 cn en
        colorTypeOption: 'single,linear-gradient,radial-gradient',//颜色选择器可选类型
        canMove: true,//默认为true
        autoConfirm: false,//改变颜色，自动确定
        hideInputer:false,//隐藏输入框
        hideCancelButton:false,//隐藏取消按钮
        hideConfirmButton:false,//隐藏确认按钮

    }

    function XNColorPicker(options) {
        this.pos = {
            left: 0, top: 0
        }
        this.moved = false;
        this.id = this.getRandomString();
        this.btns = {
            "cn": ["取消", "确定"],
            "en": ["Cancel", "OK"],
        }
        this.colorTypeList = {
            "cn": {
                "single": "纯色",
                "linear-gradient": "线性渐变",
                "radial-gradient": "径向渐变",
            },
            "en": {
                "single": "Solid",
                "linear-gradient": "Linear",
                "radial-gradient": "Radial",
            }
        }
        this.show = false;
        this.option = $.extend({}, option, options);
        // this.option.prevcolors=((this.option.prevcolors||option.prevcolors).split(','));
        if (!options.prevcolors) {
            this.option.prevcolors = option.prevcolors;
        } else {
            this.option.prevcolors = options.prevcolors;
        }
        this.option.colorTypeOption = this.option.colorTypeOption ? this.option.colorTypeOption.split(',') : ['single', 'linear-gradient', 'radial-gradient']
        this.currentColorFormat = this.option.format;
        if (typeof this.option.selector == 'string') {
            this.$el = $(this.option.selector);
        } else {
            this.$el = $(this.option.selector)
        }
        this.lastColor = this.option.color;//上一次的颜色值
        this.initCurrentColorBox();
        this.addPosEvent();

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
            this.curcolordom.onclick = function (e) {
                that.changeShow();
            }
            if (this.option.show) {
                that.init();
                $(that.dom).show();
            }
            else{
                that.initColorFormat();
            }
            this.$el.get(0).colorpicker=this;
            // console.log(this.$el.get(0))
        },
        changeShow(hide) {
            if (this.dom && $(this.dom).css('display') == 'block' || hide) {
                if (!this.option.alwaysShow) {
                    $(this.dom).remove();
                    // $(this.dom).hide();
                    this.dom = null;
                    this.moved = false;
                    this.show = false;
                }
            } else {
                this.init();
                $(this.dom).show();
                this.show = true;
                this.setPosition()
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
            this.changeColorFormatType(true);
            $(this.dom).hide();
        },
        initDom: function () {
            // var dom = document.createElement("div");
            var reRend = true;
            var container = document.body.querySelector('.fcolorpicker#' + this.id);
            if (!container) {
                container = document.createElement('div')
                container.classList.add('fcolorpicker')
                if (this.option.canMove) {
                    container.classList.add('canmove')
                }
                container.id = this.id;
                reRend = false;
            }
            var colortypehtml = ''
            for (let i = 0; i < this.option.colorTypeOption.length; i++) {
                var type = this.option.colorTypeOption[i];
                colortypehtml += `<li class="color-type-item" data-type="${type}">${this.colorTypeList[this.option.lang][type]}</li>`
            }
            var html =
                `
            <div class="color-type color-slidedown iconfontcolorpicker iconcolorpickerxiala">
               <p class="color-slidedown-curbox"></p>
               <ul>
                   ${colortypehtml}
               </ul>
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
                        <span></span>
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
                    <div class="color-format-type color-slidedown iconfontcolorpicker iconcolorpickerxiala">
                       <p class="color-slidedown-curbox">RGBA</p>
                       <ul>
                        <li class="color-format-type-item" data-type="rgba">RGBA</li>
                        <li class="color-format-type-item" data-type="hex">HEX</li>
                        <li class="color-format-type-item" data-type="hsla">HSLA</li>
                       </ul>
                    </div>
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
            if (this.option.colorTypeOption.length < 2) {
                $(this.dom).find(".color-type").remove();
            }
            if (this.option.hideInputer) {
                $(this.dom).find(".color-preview").hide();
            }
            if (this.option.hideCancelButton) {
                $(this.dom).find(".cancel-color").remove();
            }
            if (this.option.hideConfirmButton) {
                $(this.dom).find(".confirm-color").remove();
                if (this.option.hideCancelButton) {
                    $(this.dom).find(".color-btn-group").remove();
                }
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
        moveDom(startpos, e) {
            if (!this.dom) {
                return;
            }
            this.moved = true;
            var newleft = e.clientX - startpos.x + this.pos.left;
            var newtop = e.clientY - startpos.y + this.pos.top;
            this.dom.style.top = newtop + "px";
            this.dom.style.left = newleft + "px";
        },
        setPosition: function () {
            if (!this.dom || this.moved || !this.show) {
                return;
            }
            var wwidth = document.documentElement.clientWidth;
            var wheight = document.documentElement.clientHeight;
            var curcolordom = this.$el.get(0).querySelector("div")
            var top = curcolordom.getBoundingClientRect().top;
            var left = curcolordom.getBoundingClientRect().left;
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
            this.pos = {
                left: left,
                top: top
            }
        },
        addHistoryColors: function () {
            var currentColor = this.color[this.currentColorFormat];
            if(!this.hiscolors){
                this.hiscolors=[];
            }
            // if(this.currentColorType!='single'){
            //     currentColor=this.gradientColor.str;
            // }
            for (let i = 0; i < this.hiscolors.length; i++) {
                // if(this.currentColorType=='single'){
                if (colorFormat({color: this.hiscolors[i], format: this.currentColorFormat}).complete == currentColor) {
                    this.hiscolors.splice(i, 1);
                    break;
                }
                // }
                //     else{
                //         if(this.hiscolors[i]==currentColor){
                //             this.hiscolors.splice(i, 1);
                //             break;
                //         }
                //     }
            }
            this.hiscolors.unshift(currentColor);
            window.localStorage.setItem("fcolorpicker", this.hiscolors.join(";"));
            this.rendHisColors();
            this.setPosition();
        },
        getHistoryColors: function () {
            // var hiscolors=window.localStorage.clear("fcolorpicker");
            var hiscolors = window.localStorage.getItem("fcolorpicker");
            this.hiscolors = (hiscolors || "").split(";");
            this.rendHisColors();
        },
        clearHistoryColors() {
            this.hiscolors = [];
            window.localStorage.setItem("fcolorpicker", this.hiscolors.join(";"));
            this.rendHisColors();
            this.setPosition();
        },
        rendHisColors: function () {
            if (!this.option.showhistorycolor) {
                return;
            }
            $(this.dom).find(".color-latest").empty();
            for (let i = 0; i < (this.option.historycolornum < 0 ? this.hiscolors.length : this.option.historycolornum); i++) {
                if (this.hiscolors[i] && this.hiscolors[i] != '') {
                    let html = `
                    <div class="color-item" data-color="${this.hiscolors[i]}">
                    <span style="background:${this.hiscolors[i]}"></span>
</div>
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
                    <div class="color-item" data-color="${this.option.prevcolors[i]}">
                    <span style="background:${this.option.prevcolors[i]}"></span>
</div>
                `
                $(this.dom).find(".color-recommend").append(html);
            }
        },
        addBlurEvent() {
            var that = this;
            this.dom.querySelector("input").onblur = (e) => {
                // if (e.target.nodeName == 'input') {
                that.setColor(that.dom.querySelector(".current-color-value input").value)

                // }
            }
        },
        cancleFun() {
            var that = this;
            if(!that.option.autoConfirm){
            that.initColorFormat(this.lastColor, true)
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
            that.option.onCancel(confirmcolor);}
            that.changeShow(true);
            return;
        },
        getCurrentColor(isConfirm) {
            var that = this;
            that.initColorFormat(that.dom.querySelector(".current-color-value input").value, true)
            // that.addHistoryColors();
            var confirmcolor = {
                colorType: this.currentColorType
            };
            if (this.currentColorType == 'single') {
                confirmcolor.color = that.color;
                if (isConfirm) {
                    this.lastColor = this.color.rgba;
                }
            } else {
                confirmcolor.color = this.gradientColor;
                if (isConfirm) {
                    this.lastColor = this.gradientColor.str;
                }
            }
            this.changeCurColorDom()
            return confirmcolor;
        },
        addEvent: function () {
            var t = null;
            var that = this;
            var startpos = {
                top: 0,
                left: 0,
                bartop: 0,
                isGradientBar: false,
                $ele: null,
                hasChange:false
            }
            that.dom.addEventListener("mousedown", (e) => {
                var $t = $(e.target);
                t = null;
                if ($t.parents(".lightness").length() > 0) {
                    t = 'lightness';
                }
                if ($t.parents(".hue").length() > 0) {
                    t = 'hue';
                    var changeY = e.offsetY * 100 / that.canvasSize.height;
                    that.huebar.style.top = changeY.toFixed(2) + '%';
                    startpos.bartop = parseFloat(that.huebar.style.top);

                }
                if ($t.parents(".opacity").length() > 0) {
                    t = 'opacity';
                    var changeY = (e.offsetY * 100 / that.canvasSize.height);
                    that.opacitybar.style.top = changeY.toFixed(2) + '%';
                    startpos.bartop = parseFloat(that.opacitybar.style.top);
                }
                startpos.x = e.clientX;
                startpos.y = e.clientY;
                if (t) {
                    that.changeColor(t, e, null);
                    // var confirmcolor=that.getCurrentColor()
                    // that.option.onChange(confirmcolor);
                }
                if ($t.parents(".gradient-item").get(0)) {
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
                    this.gradientColor = this.revertGradientToString(this.gradientColor.arry)
                    this.gradientIndex = this.gradientColor.arry.colors.length - 1;
                    this.rendInputValue();
                    this.rendGradientColors();
                    this.updateGradientBar();
                }
                if ($t.hasClass("angle-bar")) {
                    startpos.isGradientBar = false;
                    startpos.isAngleBar = true;
                }
                if ($t.get(0) == this.dom && this.option.canMove) {
                    startpos.isMove = true;
                } else {
                    startpos.isMove = false;
                }
            })
            document.addEventListener("mousemove", (e) => {
                if (t) {
                    that.changeColor(t, e, startpos);
                } else if (startpos.isGradientBar) {//如果移动渐变滑块
                    var per = ((e.clientX - $(this.dom).find(".gradient-colors").get(0).getBoundingClientRect().left) * 100 / $(this.dom).find(".gradient-colors").get(0).getBoundingClientRect().width).toFixed(1);
                    if (this.gradientColor.arry.colors.length < 3) {
                        if (per > 100) {
                            per = 100;
                        }
                        if (per < 0) {
                            per = 0;
                        }
                    } else {
                        if (per > 100 && per <= 105) {
                            per = 100;
                        }
                        if (per >= -5 && per < 0) {
                            per = 0;
                        }
                    }
                    if(per != this.gradientColor.arry.colors[this.gradientIndex].per){
                        startpos.hasChange=true;
                    }

                    this.gradientColor.arry.colors[this.gradientIndex].per = per;
                    startpos.$ele.css({left: per + '%'})
                    this.updateGradientColors(true);
                    this.changeCurColorDom();
                    if (per < -5 || per > 105) {
                        startpos.$ele.addClass("deleting-item")
                    } else {
                        startpos.$ele.removeClass("deleting-item")
                    }
                } else if (startpos.isAngleBar) {
                    var angle = ((e.clientX - $(this.dom).find(".gradient-angle").get(0).getBoundingClientRect().left) * 360 / $(this.dom).find(".gradient-angle").get(0).getBoundingClientRect().width).toFixed(1);
                    if (angle < 0) {
                        angle = 0
                    }
                    if (angle > 360) {
                        angle = 360
                    }
                    if(angle != this.gradientColor.arry.angle){
                        startpos.hasChange=true;
                    }
                    this.gradientColor.arry.angle = angle;
                    this.updateAngleBar();
                    this.updateGradientColors();
                    this.changeCurColorDom();
                }
                if (startpos.isMove) {
                    this.moveDom(startpos, e);
                }
            })
            document.addEventListener("mouseup", (e) => {
                if (startpos.isGradientBar) {
                    var per = ((e.clientX - $(this.dom).find(".gradient-colors").get(0).getBoundingClientRect().left) * 100 / $(this.dom).find(".gradient-colors").get(0).getBoundingClientRect().width).toFixed(1);

                    if (this.gradientColor.arry.colors.length > 2) {
                        if (per > 105 || per < -5) {
                            this.gradientColor.arry.colors.splice(this.gradientIndex, 1);
                            startpos.$ele.remove();
                            this.updateGradientBar();
                            this.gradientColor = this.revertGradientToString(this.gradientColor.arry)
                            this.rendInputValue();
                            startpos.hasChange=true;
                        }

                    }
                    if(startpos.hasChange){
                    var confirmcolor = that.getCurrentColor(this.option.autoConfirm)
                    that.option.onChange(confirmcolor);
                    if (this.option.autoConfirm) {
                        this.option.onConfirm(confirmcolor)
                    }}
                }
                if ((t || startpos.isAngleBar) && startpos.hasChange) {
                    var confirmcolor = that.getCurrentColor(this.option.autoConfirm)
                    that.option.onChange(confirmcolor);
                    if (this.option.autoConfirm) {
                        this.option.onConfirm(confirmcolor)
                    }
                }
                t = null;
                startpos.isGradientBar = false;
                startpos.isAngleBar = false;
                if (startpos.isMove) {
                    var newleft = e.clientX - startpos.x + this.pos.left;
                    var newtop = e.clientY - startpos.y + this.pos.top;
                    this.pos.left = newleft;
                    this.pos.top = newtop;
                }
                startpos.isMove = false;
                startpos.hasChange=false;
            })
            this.dom.addEventListener("click", (e) => {
                e.stopPropagation();
                var $t = $(e.target);
                if ($t.hasClass("color-item")) {
                    that.getColorFormat($t.attr("data-color"));
                    that.fillOpacity();
                    that.fillPalette();
                    // that.addHistoryColors();
                    if (this.currentColorType != 'single') {
                        this.updateGradientColors();
                        this.changeCurColorDom();
                    }
                    var confirmcolor = that.getCurrentColor(this.option.autoConfirm)
                    that.option.onChange(confirmcolor);
                    if (this.option.autoConfirm) {
                        that.addHistoryColors()
                        this.option.onConfirm(confirmcolor)
                    }
                    return;
                }
                if ($t.hasClass("cancel-color")) {
                    this.cancleFun();
                }
                if ($t.hasClass("confirm-color")) {
                    var confirmcolor = that.getCurrentColor(true);
                    that.option.onConfirm(confirmcolor);
                    that.addHistoryColors()
                    that.changeShow(true);
                    return;
                }
                if ($t.hasClass('color-slidedown-curbox')) {
                    $t = $t.parent()
                }
                if ($t.hasClass('color-slidedown')) {
                    if ($t.hasClass('down')) {
                        $t.removeClass('down')
                    } else {
                        $t.addClass('down')
                    }
                }
                if ($t.hasClass('color-type-item')) {
                    if (!$t.hasClass("on")) {
                        var type = $t.attr('data-type');
                        this.currentColorType = type;
                        this.changeColorType();
                    } else {
                        $t.parents('.color-slidedown').removeClass('down')
                    }
                }
                if ($t.hasClass('color-format-type-item')) {
                    if (!$t.hasClass("on")) {
                        var type = $t.attr('data-type');
                        this.currentColorFormat = type;
                        this.changeColorFormatType();
                    } else {
                        $t.parents('.color-slidedown').removeClass('down')
                    }
                }
            })
            var mousedownFunc = (e) => {
                e.stopPropagation();
                if (that.dom && e.target != that.dom && $(e.target).parents(".fcolorpicker").get(0) != that.dom && $(e.target).get(0) != that.curcolordom) {
                    if ($(that.dom).css('display') == 'block') {
                        that.cancleFun();
                    }
                }
                $(this.dom).find(".color-slidedown").not($(e.target).parents('.color-slidedown').get(0)).removeClass('down')
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
                        x = this.dom.querySelector('.lightness canvas').getBoundingClientRect().width;
                    }
                    if (y > this.dom.querySelector('.lightness canvas').getBoundingClientRect().height) {
                        y = this.dom.querySelector('.lightness canvas').getBoundingClientRect().height;
                    }
                    // var imageData = this['ctx' + t].getImageData(x, y, 1, 1).data;
                    // color = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',' + this.color.rgbav[3] + ')';
                    var h = this.color.hslav[0];
                    var s = x / this.canvasSize.width * 100;
                    var b = 100 - y / this.canvasSize.height * 100;
                    var rgb = this.HSBToRGB({h: h, s: s, b: b});
                    color = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + this.color.rgbav[3] + ')';
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
        HSBToRGB(hsb) {
            var rgb = {};
            var h = hsb.h;
            var s = hsb.s * 255 / 100;
            var b = hsb.b * 255 / 100;
            if (s == 0) {
                rgb.r = rgb.g = rgb.b = b;
            } else {
                var t1 = b;
                var t2 = (255 - s) * b / 255;
                var t3 = (t1 - t2) * (h % 60) / 60;
                if (h == 360) h = 0;
                if (h < 60) {
                    rgb.r = t1;
                    rgb.b = t2;
                    rgb.g = t2 + t3
                } else if (h < 120) {
                    rgb.g = t1;
                    rgb.b = t2;
                    rgb.r = t1 - t3
                } else if (h < 180) {
                    rgb.g = t1;
                    rgb.r = t2;
                    rgb.b = t2 + t3
                } else if (h < 240) {
                    rgb.b = t1;
                    rgb.r = t2;
                    rgb.g = t1 - t3
                } else if (h < 300) {
                    rgb.b = t1;
                    rgb.g = t2;
                    rgb.r = t2 + t3
                } else if (h < 360) {
                    rgb.r = t1;
                    rgb.g = t2;
                    rgb.b = t1 - t3
                } else {
                    rgb.r = 0;
                    rgb.g = 0;
                    rgb.b = 0
                }
            }
            return {r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b)};
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
        rendInputValue() {
            if (!this.dom || !this.dom.querySelector(".current-color")) {
                return;
            }
            if (this.currentColorType != 'single') {
                this.dom.querySelector(".current-color").style.background = this.gradientColor.str;
                this.dom.querySelector(".current-color-value input").value = this.gradientColor.str;
            } else {
                this.dom.querySelector(".current-color").style.background = this.color[this.currentColorFormat];
                this.dom.querySelector(".current-color-value input").value = this.color[this.currentColorFormat];
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
            if (!this.ctxopacity) {
                return;
            }
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
            if (!this.ctxlightness) {
                return;
            }
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
        updatelightbar() {
            if(!this.dom){
                return;
            }
            this.lightbar = this.dom.querySelector(".lightbar");
            if (!this.lightbar) {
                return;
            }
            var hsb = this.RGBToHSB({r: this.color.rgbav[0], g: this.color.rgbav[1], b: this.color.rgbav[2],})
            var x = hsb['s'] * this.canvasSize.width / 100;
            var y = (100 - hsb['b']) * this.canvasSize.height / 100;
            this.lightbar.style.top = y + 'px';
            this.lightbar.style.left = x + 'px';
        },
        RGBToHSB(rgb) {
            var hsb = {h: 0, s: 0, b: 0};
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
            }
            ;
            if (max == min) {
                hsb.h = 0;
            }
            ;
            hsb.h *= 60;
            if (hsb.h < 0) {
                hsb.h += 360;
            }
            ;
            hsb.s *= 100 / 255;
            hsb.b *= 100 / 255;
            return hsb;
        },
        setColor: function (color) {
            this.initColorFormat(color);
            this.fillOpacity();
            this.fillPalette();
            this.addHistoryColors();
            this.changeCurColorDom();
            this.lastColor = color;
        },
        getColor: function (color) {
            return this.color;
        },
        initColorFormat(color, isConfirm) {
            var color = color || this.lastColor;
            if (typeof color == 'object') {
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
            if (isConfirm) {
                return;
            }
            this.changeColorType(true)
            if (this.currentColorType != 'single') {
                this.setCurrentGradientColor();
                this.updateAngleBar();
                this.updateGradientColors();
                this.rendGradientColors();
            }
        },
        setCurrentGradientColor() {
            this.getColorFormat(this.gradientColor.arry.colors[this.gradientIndex].color)
            this.fillPalette();
        },
        updateAngleBar() {
            $(this.dom).find('.current-angle span').html(this.gradientColor.arry.angle + '°')
            $(this.dom).find('.current-angle .angle-bar').css({'left': this.gradientColor.arry.angle / 3.6 + '%'})
        },
        updateGradientColorItem(index, color) {
            $(this.dom).find('.gradient-item').eq(index).find('.color').css({"background": color})
        },
        updateGradientBar() {
            var back = this.revertGradientToString(this.gradientColor.arry, true)
            $(this.dom).find('.gradient-bar span').css({"background": back.str})
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
        setColorTypeDom() {
            if (!$(this.dom).find('.color-type').get(0)) {
                return;
            }
            $(this.dom).find('.color-type li').removeClass('on')
            $(this.dom).find('.color-type-item[data-type=' + this.currentColorType + ']').addClass('on')
            $(this.dom).find('.color-type').removeClass('down');
            $(this.dom).find('.color-type .color-slidedown-curbox').get(0).innerHTML = $(this.dom).find('.color-type-item[data-type=' + this.currentColorType + ']').get(0).innerHTML;
        },
        changeColorFormatType(isinit) {
            $(this.dom).find('.color-format-type li').removeClass('on')
            $(this.dom).find('.color-format-type-item[data-type=' + this.currentColorFormat + ']').addClass('on')
            $(this.dom).find('.color-format-type').removeClass('down');
            $(this.dom).find('.color-format-type .color-slidedown-curbox').get(0).innerHTML = $(this.dom).find('.color-format-type-item[data-type=' + this.currentColorFormat + ']').get(0).innerHTML;
            var confirmcolor = this.getCurrentColor(this.option.autoConfirm)
            this.rendInputValue();
            if (!isinit) {
                this.option.onChange(confirmcolor);
                if (this.option.autoConfirm) {
                    this.option.onConfirm(confirmcolor)
                }
            }
        },
        changeColorType(justInit) {
            this.gradientIndex = 0;
            var mustChange = this.option.colorTypeOption.indexOf(this.currentColorType) < 0;
            if (mustChange) {
                this.currentColorType = this.option.colorTypeOption[0]
            }
            if (this.currentColorType == 'single') {
                if (!justInit || mustChange) {
                    this.getColorFormat(this.gradientColor ? this.gradientColor.arry.colors[0].color : '#ffffff');
                }
                $(this.dom).find('.color-gradient').hide();
            } else {
                if (!justInit || mustChange) {
                    if (!this.gradientColor) {
                        this.gradientColor = {
                            type: this.currentColorType,
                        }
                        this.initColorFormat({
                            type: this.currentColorType,
                            angle: 0,
                            colors: [{per: 0, color: this.color.rgba}, {per: 100, color: 'rgba(0,0,0,0)'}]
                        })
                    }
                }
                if (this.gradientColor.arry.type != this.currentColorType) {
                    this.gradientColor.arry.type = this.currentColorType;
                    this.gradientColor = this.revertGradientToString(this.gradientColor.arry)
                }
                $(this.dom).find('.color-gradient').show();
                this.rendGradientColors();
                this.updateGradientBar();
                this.updateAngleBar();
                this.changeCurColorDom();
                if (this.currentColorType == 'linear-gradient') {
                    $(this.dom).find('.gradient-angle').show();
                } else {
                    $(this.dom).find('.gradient-angle').hide();
                }
            }
            this.setColorTypeDom();
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
                if (!this.show) {
                    return;
                }
                this.dom.querySelector(".current-color").style.background = this.color.rgba;
                this.dom.querySelector(".current-color-value input").value = this.color[this.currentColorFormat];
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
                color1 = colorwords[color1.toLowerCase()]||'rgba(0,0,0,0)'
            }
            var color = {
                "rgba": colorFormat({color: color1, format: "rgba"}).complete,
                "hsla": colorFormat({color: color1, format: "hsla"}).complete,
                "hex": colorFormat({color: color1, format: "hex"}).complete,
            };
            if ((!color.rgba || color.rgba.indexOf("NaN") > -1)) {
                if (this.dom) {
                    this.dom.querySelector(".current-color-value input").value = this.color[this.currentColorFormat];
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
                angle: type == 'linear-gradient' ? (parseFloat(arry[0])).toFixed(0) : 0,
                colors: []
            }
            for (let i = (type == 'linear-gradient' ? 1 : 0); i < arry.length; i++) {
                let color = arry[i].split(' ')
                obj.colors.push(
                    {
                        color: color[0],
                        per: color[1] ? parseFloat(color[1]) : (100 * (i - 1) / (arry.length - 2))
                    }
                )
            }
            return {
                str: this.revertGradientToString(obj).str,
                arry: obj
            }
        },
        revertGradientToString: function (value, isbar) {
            var gradient = (isbar ? 'linear-gradient' : value.type) + '(';
            if (isbar) {
                gradient += 'to right,';
            } else if (value.type == 'linear-gradient') {
                gradient += parseFloat(value.angle).toFixed(1) + 'deg,';
            }
            for (let i = 0; i < value.colors.length; i++) {
                let color = this.getColorFormatFunc(value.colors[i].color)[this.currentColorFormat]
                value.colors[i].color = color;
                gradient += color + ' ' + parseFloat(value.colors[i].per).toFixed(1);
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
            try{
                $(this.dom).remove();
                if(this.removeMouseDownEvent){
                    this.removeMouseDownEvent();
                }
                this.curcolordom.onclick = null;
            }
            catch (e) {

            }
        },
        $getCurColor(){
            var color;
            if (this.currentColorType == 'single') {
                color= {type:'single',color:this.color};
            } else {
                color= {type:this.currentColorType,color:this.gradientColor};
            }
            return color
        }
    }
    window.XNColorPicker = XNColorPicker;
})(window, XNQuery)

export default window.XNColorPicker

