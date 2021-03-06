var initData = {
	'width': 600,
    'height': 600,
    'sectorBgColor': [   // 类扇形背景色
        {start: 'rgba(55,60,185,1)', end: 'rgba(130,45,143,1)'},
        {start: 'rgba(55,60,185,1)', end: 'rgba(130,45,143,1)'},
        {start: 'rgba(55,60,185,1)', end: 'rgba(130,45,143,1)'},
        {start: 'rgba(55,60,185,1)', end: 'rgba(130,45,143,1)'},
        {start: 'rgba(21,92,113,1)', end: 'rgba(18,61,112,1)'},
        {start: 'rgba(21,92,113,1)', end: 'rgba(18,61,112,1)'},
        {start: 'rgba(21,92,113,1)', end: 'rgba(18,61,112,1)'},
        {start: 'rgba(21,92,113,1)', end: 'rgba(18,61,112,1)'},
    ],
    statistics: [    // 柱状图数据
        {
            name: '中间件中间件中间件',  // 类名称（类标签）
            data: [{
                CPI: '系列1',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列1',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列1',
                numberValue: 500   // 柱状图数值
            }, {
                CPI: '内存总量_系列2',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列2',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列2',
                numberValue: 0
            }, {
                CPI: '系列3',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列3',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列3',
                numberValue: 5
            }],
        }, {
            name: '基础设备基础设备基础设备',
            data: [{
                CPI: '系列1',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列1',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列1',
                numberValue: 119   // 柱状图数值
            }, {
                CPI: '内存总量_系列2',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列2',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列2',
                numberValue: 79
            }, {
                CPI: '系列3',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列3',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列3',
                numberValue: 230
            }]
        }, {
            name: '应用应用应用应用应用',
            data: [{
                CPI: '系列1',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列1',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列1',
                numberValue: 403   // 柱状图数值
            }, {
                CPI: '内存总量_系列2',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列2',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列2',
                numberValue: 201
            }, {
                CPI: '系列3',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列3',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列3',
                numberValue: 350
            }]
        }, {
            name: '中间件2中间件2中间件2',
            data: [{
                CPI: '系列1',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列1',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列1',
                numberValue: 1   // 柱状图数值
            }, {
                CPI: '内存总量_系列2',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列2',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列2',
                numberValue: 321
            }, {
                CPI: '系列3',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列3',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列3',
                numberValue: 2
            },{
                CPI: '系列4',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列4',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列4',
                numberValue: 220
            }],
        }, {
            name: '基础设备2基础设备2基础设备2',
            data: [{
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列1',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列1',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列1',
                numberValue: 130   // 柱状图数值
            }, {
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列2',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列2',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列2',
                numberValue: 420
            }, {
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列3',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列3',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列3',
                numberValue: 235
            },{
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列4',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列4',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列4',
                numberValue: 119
            }]
        }, {
            name: '应用3应用3应用3应用3',
            data: [{
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列1',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列1',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列1',
                numberValue: 10   // 柱状图数值
            }, {
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列2',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列2',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列2',
                numberValue: 4
            }, {
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列3',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列3',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列3',
                numberValue: 250
            },{
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列4',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列4',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列4',
                numberValue: 150
            }]
        }, {
            name: '基础设备7基础设备7基础设备7',
            data: [{
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列1',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列1',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列1',
                numberValue: 210   // 柱状图数值
            }, {
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列2',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列2',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列2',
                numberValue: 345
            }, {
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列3',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列3',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列3',
                numberValue: 292
            },{
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列4',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列4',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列4',
                numberValue: 150
            }]
        }, {
            name: '应用8应用8应用8',
            data: [{
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列1',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列1',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列1',
                numberValue: 192   // 柱状图数值
            }, {
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列2',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列2',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列2',
                numberValue: 406
            }, {
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列3',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列3',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列3',
                numberValue: 235
            },{
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列4',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列4',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列4',
                numberValue: 200
            }]
        }, {
            name: '应用9应用9应用9应用9',
            data: [{
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列1',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列1',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列1',
                numberValue: 192   // 柱状图数值
            }, {
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列2',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列2',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列2',
                numberValue: 406
            }, {
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列3',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列3',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列3',
                numberValue: 235
            },{
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列4',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列4',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列4',
                numberValue: 200
            }]
        }, {
            name: '应用10应用10应用10',
            data: [{
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列1',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列1',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列1',
                numberValue: 192   // 柱状图数值
            }, {
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列2',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列2',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列2',
                numberValue: 406
            }, {
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列3',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列3',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列3',
                numberValue: 235
            },{
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列4',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列4',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列4',
                numberValue: 200
            }]
        }, {
            name: '应用11应用11应用11',
            data: [{
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列1',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列1',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列1',
                numberValue: 192   // 柱状图数值
            }, {
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列2',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列2',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列2',
                numberValue: 406
            }, {
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列3',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列3',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列3',
                numberValue: 235
            },{
                CPI: '新版网站测试服务器2_内存_内存总量MB_系列4',
                instance: '新版网站测试服务器2_内存_内存总量MB_系列4',
                kpi: '新版网站测试服务器2_内存_内存总量MB_系列4',
                numberValue: 200
            }]
        }
    ],  
    // legendData: ['系列1', '系列2', '系列3'],
    legendData: ['新版网站测试服务器2_内存_内存总量MB_系列1','新版网站测试服务器2_内存_内存总量MB_系列2','新版网站测试服务器2_内存_内存总量MB_系列3'],  // 图例内容
    legendColor: [
        'rgba(60,90,240,1)', 
        'rgba(35,120,200,1)', 
        'rgba(255,185,0,1)', 
        'rgba(255,35, 0,1)'], // 图例颜色，对应柱状图颜色
    legendType: 'kpi',  
    
    backgroundColor: '#333',
    rotate: 0,
    isShowTitle: true,
    titleContent: '南丁格尔组件标题',
    titleHeight: 30,
    titlePosition: 'center',
    titleFontSize: 20,
    titleFontColor: '#f00',
    titleFontWeight: 'bold',
    titleBackground: '#fff',
    titleBorder: '#999',
    scaleAngleRatio: 1.2,  // 坐标轴刻度区域
    scaleNum: 4, // 坐标轴刻度数量
    borderColor: '#f00', // 外圆边框颜色 
    borderWidth: 2,
    borderType: 'none',
    dasharray: 10,
    innerRadiusRatio: 0.2,  // 内圆半径占比
    innerRadiusMargin: 4,   // 柱状图距离内圆边界的距离
    scaleColor: 'rgba(25,25,25,0.5)',  // 坐标轴线（网格线）颜色
    scaleFontSize: 14, //坐标轴字体大小
    scaleFontColor: 'rgba(255,255,255,0.3)',  // 坐标轴字体颜色
    scaleFontWeight: 'normal',   // 坐标轴字体加粗
    maxY: 500,
    minY: 0,
    isShowXAsix: true,   // 是否显示x轴
    isShowYAsix: true,   // 是否显示y轴
    isShowYText: true,   //  是否显示刻度值
    labelTextColor: 'rgba(255,255,255,0.3)',  // 分类标签字体颜色
    labelTextPos: 20,   // 分类标签距离外圆环距离，y轴超出外圆长度
    labelTextFontSize: 16,   // 分类标签字体大小
    labelTextFontWeight: 'normal',   // 分类标签字体加粗
    classIntervalRatio: 0.3,   // 类间距
    barIntervalRatio: 0.2,   // 系列间距
    isShowBarNum: true,   // 是否展示柱状数值
    barFloatNum: 0,   // 柱状数值保留小数位数
    barTextColor: '#aaa',   // 柱状数值字体颜色
    barTextSize: 12,   // 柱状字体大小
    paddingLeft: 0,   // 左边距
    paddingTop: 0,   // 上边距
    paddingRight: 0,  // 右边距
    paddingBottom: 0,   // 下边距
    isShowLegend: true,   // 是否显示图例
    legendFontColor: '#aaa',   // 图例文字颜色
    legendFontSize: 14,      // 图例文字大小
    legendFontWeight: 'normal',   // 图例文字加粗
    legendPosition: 'topcenter',   // 图例位置：topleft,topcenter,topright,middleleft,middleright,bottomleft,bottomcenter,bottomright
    legendRatio: 0.2, // 图例高度
    legendMargin: 4,   // 图例上下间距
    legendTextPaddingLeft: 4,   // 图例文字
    legendItemMargin: 30, // 横向排列时 图例左右间距 
    innerBackgound:'',
    innerText: '',  // 圆心数值
    innerTextColor: '#f00',  // 圆心数值颜色
    innerTextSize: 30,   // 圆心数值大小
    innerTextWeight: 'bold'  // 圆心数值加粗

};