# [样例地址](https://www.jq22.com/yanshi23671) (样例不是最新代码哦)

# V1.2.6 2021/11/25
## 本次更新功能点
+ 修改更新历史颜色的触发事件

# V1.2.5 2021/04/22
## 本次更新功能点
+ 修复bug，给body设置color和font-size被继承
+ 增加颜色单词与色值的转换，共支持148个单词，数据来源 https://www.w3schools.cn/colors/colors_2019.asp

# V1.2.3 2021/03/29
## 本次更新功能点
+ 修复bug，点击渐变色色块，不拖拽就触发change事件

# V1.2.3 2021/03/17
## 本次更新功能点
+ colorpicker实例挂载到dom元素上
+ 如：获取页面所有选择器的当前颜色

    
    $(".colorpicker").each((i,e)=>{
        var color=e.colorpicker.$getCurColor();
        console.log(color)
    })

# V1.2.2 2021/03/16
## 本次更新功能点
+ 增加方法获取当前颜色 var color=xncolorpickerins.$getCurColor()
+ 去掉当autoconfirm设置为true时，change的回调
+ 增加配置项，hideInputer 隐藏输入框，hideCancelButton 隐藏取消按钮，hideConfirmButton隐藏确定按钮
+ iconfont放置本地，不再引用cdn


# V1.2.1 2021/02/09
## 本次更新功能点
+ 选择器隐藏时删除dom元素
+ 去掉初始化时执行change和confirm的回调

# V1.2.0 2021/01/26
## 本次更新功能点
+ 删除jquery依赖

## 本次更新功能点
+ 修改webpack打包配置


# V1.1.0 2021/01/21
## 更新功能点
+ 新增对渐变色的支持-径向渐变、线性渐变
+ 修复鼠标事件的bug
+ 新增色彩格式的切换
+ ui升级
+ 新增选择器拖拽事件

# V1.0.0
## 功能说明
漂亮的颜色选择器支持 
+ rgba hex hsla 三种色彩格式
+ 支持自定义输入
+ 支持历史颜色


# 选择器样式
![avatar](https://raw.githubusercontent.com/fanaiai/xncolorpicker/main/4.png)

# 试用
+ 下载代码
+ 打开文件test.html即可

# 使用步骤
## 下载代码
## 将src目录放置您的项目中
## 引用js文件，例如：
    <script src="./dist/xncolorpicker.min.js"></script>
    
    
    
    
## 初始化选择器
    var xncolorpicker = new XNColorPicker({
            color: "#ff0000", 
            selector: "#colorpicker",
            onError: function (e) {
    
            },
            onCancel:function(color){
                console.log("cancel",color)
            },
            onChange:function(color){
                console.log("change",color)
            },
            onConfirm:function(color){
                console.log("confirm",color)
            }
        })
        
## 选择器配置项
    {
            color:'#ffffff',//初始颜色
            selector: "",//选择器容器
            showprecolor: true,//显示预制颜色
            prevcolors: null,//预制颜色,不填为默认
            showhistorycolor: true,//显示历史
            historycolornum: 16,//历史条数
            format: 'rgba',//rgba hex hsla,初始颜色类型
            showPalette: true,//显示色盘
            show: false, //初始化显示
            lang: 'cn',// 中英文 cn en
            colorTypeOption:'single,linear-gradient,radial-gradient',//颜色选择器可选类型，纯色，线性渐变，径向渐变
            canMove:true,//默认为true
            autoConfirm:true,//改变颜色时自动确认
            onError: function (e) {
            
            },
            onCancel:function(color){
                console.log("cancel",color)
            },
            onChange:function(color){
                console.log("change",color)
            },
            onConfirm:function(color){
                console.log("confirm",color)
            }
        }

## 方法
+ 销毁实例 xncolorpicker.destroy()
+ 清空历史颜色 xncolorpicker.clearHistoryColors()

## 待开发功能
+ 渐变色支持
