# V1.1.1 2021/01/25
## 待优化/开发功能点
+ 删除jquery
+ 增加修改option方法

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
![avatar](https://github.com/fanaiai/xncolorpicker/blob/main/4.png)


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
