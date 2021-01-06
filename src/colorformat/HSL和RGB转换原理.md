# HSL和RGB转换原理 #

## HSL简介 ##

色调饱和度亮度模式：

 1. Hue(色调)。0(或360)表示红色，120表示绿色，240表示蓝色，也可取其他数值来指定颜色。取值为：0 - 360；
 2. Saturation(饱和度)。取值为：0.0% - 100.0% ；
 3. Lightness(亮度)。取值为：0.0% - 100.0% 。
 4. 不包含透明度：`hsl(210,100%,50%)`，包含透明度：`hsla(210,100%,50%,0.5)`

## RGB简介 ##

 1. 红绿蓝三个颜色通过不同亮度,外加alpha透明度，来组合成为需要的颜色；
 2. 0为最暗, 255为最亮，`rgb(0,0,0)`为黑色, `rgb(255,255,255)`为白色；
 3. 透明度表示：`rgba(255,0,0,0.5)`。

## 转换原理 ##

### `RGB`转`HSL`的算法描述 ###

 1. 把`RGB`值转成【0，1】中数值。
 2. 找出R,G和B中的最大值。
 3. 计算亮度：`L=(maxcolor + mincolor)/2`
 4. 如果最大和最小的颜色值相同，即表示灰色，那么S定义为0，而H未定义并在程序中通常写成0。
 5. 否则，根据亮度L计算饱和度S：
    ```JavaScript
    if(L<0.5){
        S=(maxcolor-mincolor)/(maxcolor + mincolor);
    }
    if(L>=0.5){
        S=(maxcolor-mincolor)/(2.0-maxcolor-mincolor);
    }
    ```
 6. 计算色调H：
    ```JavaScript
    if(R=maxcolor){
        H=(G-B)/(maxcolor-mincolor);
    }else if(G=maxcolor){
        H=2.0+(B-R)/(maxcolor-mincolor);
    }else if(B=maxcolor){
        H=4.0+(R-G)/(maxcolor-mincolor);
    }
    ```
    `H *= 60`，如果H为负值，则加360。

说明：

 1. 由步骤3的式子可以看出亮度仅与图像的最多颜色成分和最少的颜色成分的总量有关。亮度越小，图像越趋于黑色。亮度越高图像越趋于明亮的白色。
 2. 由步骤5的式子可以看出饱和度与图像的最多颜色成分和最少的颜色成分的差量有关。饱和度越小，图像越趋于灰度图像。饱和度越大，图像越鲜艳，给人的感觉是彩色的，而不是黑白灰的图像。
 3. 色调觉得了人对图像的不同的颜色感受。
 4. 从第6步的计算看，H分成0～6区域。RGB颜,色空间是一个立方体而HSL颜色空间是两个六角形锥体，其中的L是RGB立方体的主对角线。因此，RGB立方体的顶点：红、黄、绿、青、蓝和品红就成为HSL六角形的顶点，而数值0～6就告诉我们H在哪个部分。

### `HSL`转`RGB`的算法描述 ###

 1. `if(S==0)`,表示灰色，定义R,G和B都为L.
 2. 否则，测试L:
    ```JavaScript
    if(L<0.5){
        temp2=L*(1.0+S);
    }
    if(L>=0.5){
        temp2=L+S-L*S;
    }
    ```
 3. `temp1=2.0*L-temp2`
 4. 把H转换到0～1, `H /= 360`
 5. 对于R,G,B，计算另外的临时值temp3。方法如下：
    ```JavaScript
    for R, temp3=H+1.0/3.0
    for G, temp3=H
    for B, temp3=H-1.0/3.0
    if(temp3<0){
        temp3=temp3+1.0;
    }
    if(temp3>1){
        temp3=temp3-1.0;
    }
    ```
 6. 对于R,G,B做如下测试：
    ```JavaScript
    If(6.0*temp3<1){
        color=temp1+(temp2-temp1)*6.0*temp3;
    }else if(2.0*temp3<1){
        color=temp2;
    }else if(3.0*temp3<2){
        color=temp1+(temp2-temp1)*((2.0/3.0)-temp3)*6.0;
    }else{
        color=temp1;
    }
    ```

更详细可查看：<https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSL>

文中部分内容参考：<https://www.cnblogs.com/daiguagua/p/3311756.html>