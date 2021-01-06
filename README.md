# 功能说明
漂亮的颜色选择器支持 
+ rgba hex hsla 三种色彩格式
+ 支持自定义输入
+ 支持历史颜色

# 选择器样式
![avatar](https://raw.githubusercontent.com/fanaiai/xndatepicker/main/img/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_16098368986650.png)

# 使用步骤
## 下载代码
## 将src目录放置您的项目中
## 引用js文件，例如：
    <script src="fcolorpicker.js"></script>
    
## 初始化选择器
    var fcolorpicker = new FColorPicker({
            color: "red", 
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
            color:"#ff0000",//初始颜色，只能是rgba hex hsla，不能是red，green等单词哦
            selector: "#colorpicker",
            showprecolor: true,//显示预制颜色
            prevcolors: [],//预制颜色，有默认
            showhistorycolor: true,//显示历史
            historycolornum: 16,//历史条数
            format: 'hsla',//rgba hex hsla
            showPalette:true,//显示色盘
            show:true, //初始化显示
            lang:'cn',// cn 、en
            onError: function (e) {},//错误回调
            onCancel:function(color){
                console.log("cancel",color)
            },//取消选择
            onChange:function(color){
                console.log("change",color)
            },//修改颜色
            onConfirm:function(color){
                console.log("confirm",color)
            }//选择确认
        }
