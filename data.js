var initData = {
	'width': 600,
    'height': 600,
    'sectorBgColor': [   // 类扇形背景色
        {start: '#522366', end: '#362c7d'},
        {start: '#522366', end: '#362c7d'},
        {start: '#522366', end: '#362c7d'},
        {start: '#522366', end: '#362c7d'},
        {start: '#376872', end: '#0f3763'},
        {start: '#376872', end: '#0f3763'},
        {start: '#376872', end: '#0f3763'},
        {start: '#376872', end: '#0f3763'}
    ],
    statistics: [    // 柱状图数据
        {
            name: '中间件',  // 类名称（类标签）
            data: [{
                CPI: '中间件-cpi',
                instance: '中间件-1',
                kpi: '中间件-kpi',
                numberValue: 100   // 柱状图数值
            }, {
                CPI: '中间件-cpi',
                instance: '中间件-1',
                kpi: '中间件-kpi',
                numberValue: 450
            }, {
                CPI: '中间件-cpi',
                instance: '中间件-1',
                kpi: '中间件-kpi',
                numberValue: 250
            },{
                numberValue: 150
            }],
        }, {
            name: '基础设备',
            data: [{
                CPI: '基础设备-cpi',
                instance: '基础设备-1',
                kpi: '基础设备-kpi',
                numberValue: 119
            }, {
                CPI: '基础设备-cpi',
                instance: '基础设备-1',
                kpi: '基础设备-kpi',
                numberValue: 79
            }, {
                CPI: '基础设备-cpi',
                instance: '基础设备-1',
                kpi: '基础设备-kpi',
                numberValue: 230
            },{}]
        }, {
            name: '应用',
            data: [{
                CPI: '应用-cpi',
                instance: '应用-1',
                kpi: '应用-kpi',
                numberValue: 403
            }, {
                CPI: '应用-cpi',
                instance: '应用-1',
                kpi: '应用-kpi',
                numberValue: 201
            }, {
                CPI: '应用-cpi',
                instance: '应用-1',
                kpi: '应用-kpi',
                numberValue: 356
            }, {
                CPI: '应用-cpi',
                instance: '应用-1',
                kpi: '应用-kpi',
                numberValue: 306
            }]
        }, {
            name: '中间件',
            data: [{
                CPI: '中间件-cpi',
                instance: '中间件-1',
                kpi: '中间件-kpi',
                numberValue: 211
            }, {
                CPI: '中间件-cpi',
                instance: '中间件-1',
                kpi: '中间件-kpi',
                numberValue: 321
            }, {
                CPI: '中间件-cpi',
                instance: '中间件-1',
                kpi: '中间件-kpi',
                numberValue: 250
            }, {}],
        }, {
            name: '基础设备',
            data: [{
                CPI: '基础设备-cpi',
                instance: '基础设备-1',
                kpi: '基础设备-kpi',
                numberValue: 119
            }, {
                CPI: '基础设备-cpi',
                instance: '基础设备-1',
                kpi: '基础设备-kpi',
                numberValue: 79
            }, {
                CPI: '基础设备-cpi',
                instance: '基础设备-1',
                kpi: '基础设备-kpi',
                numberValue: 230
            }, {
                CPI: '基础设备-cpi',
                instance: '基础设备-1',
                kpi: '基础设备-kpi',
                numberValue: 270
            }]
        }, {
            name: '应用',
            data: [{
                CPI: '应用-cpi',
                instance: '应用-1',
                kpi: '应用-kpi',
                numberValue: 290
            }, {
                CPI: '应用-cpi',
                instance: '应用-1',
                kpi: '应用-kpi',
                numberValue: 201
            }, {
                CPI: '应用-cpi',
                instance: '应用-1',
                kpi: '应用-kpi',
                numberValue: 356
            }, {
                CPI: '应用-cpi',
                instance: '应用-1',
                kpi: '应用-kpi',
                numberValue: 286
            }]
        }, {
            name: '基础设备',
            data: [{
                CPI: '基础设备-cpi',
                instance: '基础设备-1',
                kpi: '基础设备-kpi',
                numberValue: 119
            }, {
                CPI: '基础设备-cpi',
                instance: '基础设备-1',
                kpi: '基础设备-kpi',
                numberValue: 79
            }, {
                CPI: '基础设备-cpi',
                instance: '基础设备-1',
                kpi: '基础设备-kpi',
                numberValue: 230
            }, {
                CPI: '基础设备-cpi',
                instance: '基础设备-1',
                kpi: '基础设备-kpi',
                numberValue: 150
            }]
        }, {
            name: '应用',
            data: [{
                CPI: '应用-cpi',
                instance: '应用-1',
                kpi: '应用-kpi',
                numberValue: 290
            }, {
                CPI: '应用-cpi',
                instance: '应用-1',
                kpi: '应用-kpi',
                numberValue: 201
            }, {
                CPI: '应用-cpi',
                instance: '应用-1',
                kpi: '应用-kpi',
                numberValue: 356
            }, {
                CPI: '应用-cpi',
                instance: '应用-1',
                kpi: '应用-kpi',
                numberValue: 300
            }]
        }
    ],  

    legendData: ['测试测试测试测试测试测试','数据','series333','series4444'],  // 图例内容
    legendColor: ['#ff0', '#f00', '#f0f', '#0f0', '#0ff'], // 图例颜色，对应柱状图颜色
    
    scaleAngleRatio: 1.2,  // 坐标轴刻度区域
    scaleNum: 4,  // 坐标轴刻度数量
    borderColor: '#f00', // 外圆边框颜色 
    innerRadiusRadio: 0.2,  // 内圆半径占比
    innerRadiusMargin: 4,   // 柱状图距离内圆边界的距离
    scaleColor: 'rgba(25,25,25,0.5)',  // 坐标轴线（网格线）颜色
    scaleFontSize: 14, //坐标轴字体大小
    scaleFontColor: 'rgba(255,255,255,0.3)',  // 坐标轴字体颜色
    scaleFontWeight: 'normal',   // 坐标轴字体加粗
    isShowXAsix: true,   // 是否显示x轴
    isShowYAsix: true,   // 是否显示y轴
    labelTextColor: 'rgba(255,255,255,0.3)',  // 分类标签字体颜色
    labelTextPos: 20,   // 分类标签距离外圆环距离，y轴超出外圆长度
    labelTextFontSize: 16,   // 分类标签字体大小
    labelTextFontWeight: 'normal',   // 分类标签字体加粗
    classIntervalRatio: 0,   // 类间距
    barIntervalRatio: 0.05,   // 系列间距
    isShowBarNum: true,   // 是否展示柱状数值
    barFloatNum: 0,   // 柱状数值保留小数位数
    barTextColor: '#aaa',   // 柱状数值字体颜色
    barTextSize: 12,   // 柱状字体大小
    paddingLeft: 0,   // 左边距
    paddingTop: 10,   // 上边距
    paddingRight: 0,  // 右边距
    paddingBottom: 0,   // 下边距
    isShowLegend: true,   // 是否显示图例
    legendFontColor: '#aaa',   // 图例文字颜色
    legendFontSize: 14,      // 图例文字大小
    legendFontWeight: 'normal',   // 图例文字加粗
    legendPosition: 'topcenter',   // 图例位置：topleft,topcenter,topright,middleleft,middleright,bottomleft,bottomcenter,bottomright
    legendHeightRatio: 0.02, // 图例高度
    legendWidthRatio: 0.15,   // 图例宽度
    legendMargin: 4,   // 图例上下间距
    legendTextPaddingLeft: 4,   // 图例文字
    legendItemMargin: 20, // 横向排列时 图例左右间距 
    innerText: 88,  // 圆心数值
    innerTextColor: '#fff',  // 圆心数值颜色
    innerTextSize: 30,   // 圆心数值大小
    innerTextWeight: 'bold'  // 圆心数值加粗

};