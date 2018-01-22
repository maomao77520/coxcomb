function mix(des, src) {
    for (var i in src) {
        if (! (i in des)) {
            des[i] = src[i];
        }
    }
    return des;
}

function Chart(svg) {
    this.svg = svg;
    this.defaultOptions = {
        width: 600,
        height: 600,
        scaleAngleRatio: 1.5,
        scaleNum: 5,
        totalSector: 8,
        outerRadius: 250,
        borderColor: '#f00',
        innerRadiusRadio: 0.2,
        scaleColor: 'rgba(25,25,25,0.5)',
        scaleFontSize: 14,
        scaleFontColor: 'rgba(255,255,255,0.3)',
        scaleFontWeight: 'normal',
        isShowXAsix: true,
        isShowYAsix: true,
        labelTextColor: 'rgba(255,255,255,0.3)',
        labelTextPos: 20,
        labelTextFontSize: 16,
        labelTextFontWeight: 'normal',
        classIntervalRatio: 0,
        barIntervalRatio: 0.05,
        barNum: 5,
        barColor: ['#00f', '#0ff', '#f00', '#ff0', '#fff'],
        isShowBarNum: true,
        barFloatNum: 0,
        barTextColor: '#aaa',
        barTextSize: 12,
        paddingLeft: 10,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        isShowLegend: true,
        legendFontColor: '#aaa',
        legendFontSize: 14,
        legendFontWeight: 'normal',
        legendWidth: 0,
        legendHeight: 0,
        legendPosition: 'topcenter',
        legendHeightRatio: 0.15,
        legendWidthRatio: 0.15,
        legendMargin: 4,
        legendTextPaddingLeft: 4,
        
    }
}

var statistics = [
    {
        className: '中间件',
        data: [100, 150, 120, 80, 180],
        barColor: '#f00',
        bgColor1: '#522366',
        bgColor2: '#362c7d'
    },
    {
        className: '应用',
        data: [200, 50, 100, 20, 160],
        barColor: '#ff0',
        bgColor1: '#522366',
        bgColor2: '#362c7d'
    },
    {
        className: '基础设施',
        data: [120, 70, 130, 65, 198],
        barColor: '#00f',
        bgColor1: '#522366',
        bgColor2: '#362c7d'
    },
    {
        className: '基础设施',
        data: [20, 70, 110, 65, 136],
        barColor: '#fff',
        bgColor1: '#522366',
        bgColor2: '#362c7d'
    },
    {
        className: '中间件',
        data: [100, 150, 120, 80, 180],
        barColor: '#0ff',
        bgColor1: '#376872',
        bgColor2: '#0f3763'
    },
    {
        className: '应用',
        data: [200, 50, 100, 20, 160],
        barColor: '#0f0',
        bgColor1: '#376872',
        bgColor2: '#0f3763'
    },
    {
        className: '基础设施',
        data: [100, 90, 30, 75, 115],
        barColor: '#f0f',
        bgColor1: '#376872',
        bgColor2: '#0f3763'
    },
    {
        className: '基础设施',
        data: [120, 70, 130, 65, 198],
        barColor: '#fff',
        bgColor1: '#376872',
        bgColor2: '#0f3763'
    }
];
var legendData = [
    {name: '测试测试测试测试测试测试', color: '#00f'},
    {name: '数据', color: '#0ff'},
    {name: 'series333', color: '#f00'},
    {name: 'series4444', color: '#ff0'},
    {name: 'series5', color: '#fff'},
];

Chart.prototype = {
    init: function (params) {
        this.data = mix(params || {}, this.defaultOptions);
        this.contentWrap = this.svg.append('svg:g');

        if (this.data.isShowLegend) {
            this.data.legendWidth = this.data.legendWidthRatio * this.data.width;
            this.data.legendHeight = this.data.legendHeightRatio * this.data.height;
        }
        var w = this.data.width - this.data.paddingLeft - this.data.paddingRight;
        var h = this.data.height - this.data.paddingTop -this.data.paddingBottom;

        if (this.data.legendPosition.indexOf('left') > -1 || this.data.legendPosition.indexOf('right') > -1) {
            w = w - this.data.legendWidth * 2;
        }
        if (this.data.legendPosition.indexOf('top') > -1 || this.data.legendPosition.indexOf('bottom') > -1) {
            h = h - this.data.legendHeight * 2;
        }

        var r = w > h ? h / 2 : w / 2;
        this.data.outerRadius = r - this.data.labelTextPos - 3 / 2 * this.data.labelTextFontSize;
        this.data.innerRadius = this.data.outerRadius * this.data.innerRadiusRadio;
        this.data.center = {
            x: this.data.width / 2, 
            y: this.data.height / 2
        };
console.log(this.data.outerRadius, this.data.center, '<<')      
        this.data.sectorAngle = this.getSectorAngle();
        this.data.scaleAngle = this.data.sectorAngle * this.data.scaleAngleRatio;
        this.data.barIntervalAngle = this.data.sectorAngle * this.data.barIntervalRatio;
        this.data.classIntervalAngle = this.data.sectorAngle * this.data.classIntervalRatio;
        this.data.barAngle = (this.data.sectorAngle - this.data.barIntervalAngle * (this.data.barNum + 1)) / this.data.barNum;

        this.data.maxY = 200;
        this.data.minY = 0;

        // this.renderCircle();
        this.renderSectors();
        if (this.data.isShowXAsix) {
            this.getXAsix();
        }
        if (this.data.isShowYAsix) {
            this.getYAsix();
        }
        this.renderYText();
        this.renderBar();

        // this.getLegendSize();
        if (this.data.isShowLegend) {
            this.renderLegend();
        }
    },

    getSectorAngle: function () {
        var data = this.data;
        // totalSector*x+(totalSector-1)*classIntervalRatio*x + scaleAngleRatio * x = 360;
        var temp = data.totalSector + data.totalSector * data.classIntervalRatio
        - data.classIntervalRatio + data.scaleAngleRatio;
        return 360 / temp;
    },

    // 渲染最外层边框
    renderCircle: function () {
        this.circle = this.contentWrap.append('circle')
            .attr('class', 'circleWrap')
            .attr('cx', this.data.center.x)
            .attr('cy', this.data.center.y)
            .attr('r', this.data.outerRadius)
            .attr('stroke', this.data.borderColor)
            .attr('fill', 'none')
    },

    // 计算x轴（圆环轴）刻度（半径）
    getXAsix: function () {
        var len = this.data.scaleNum - 2;
        var interval = (this.data.outerRadius - this.data.innerRadius) / (len + 1);
        this.contentWrap.append('g').attr('id', 'xasix')
        for (var i = 1; i <= len; i++) {
            this.renderXAsix(interval * i + this.data.innerRadius);
        }
    },

    // 计算y轴（放射线轴）刻度（终点坐标）
    getYAsix: function () {
        var vAngle1 = 0;
        var vAngle2 = 0;
        var startV1 = {};
        var startV2 = {};
        var endV1 = {};
        var endV2 = {};
        var preV = {};
        var len = this.data.classIntervalRatio ? this.data.totalSector-1 : this.data.totalSector;
        this.contentWrap.append('g').attr('id', 'yasix')
        for (var i = 0; i <= len; i++) {
            preV.x = startV2.x;
            preV.y = startV2.y;
            vAngle1 = this.data.scaleAngle / 2 + this.data.sectorAngle * i + i * this.data.classIntervalAngle;
            startV1.x = this.data.center.x + this.data.innerRadius * Math.sin(vAngle1/180*Math.PI);
            startV1.y = this.data.center.y - this.data.innerRadius * Math.cos(vAngle1/180*Math.PI);
            startV2.x = (this.data.outerRadius + this.data.labelTextPos) * Math.sin(vAngle1/180*Math.PI) + this.data.center.x;
            startV2.y = this.data.center.y - (this.data.outerRadius + this.data.labelTextPos) * Math.cos(vAngle1/180*Math.PI);
            this.renderYAsix(startV1, startV2);

            if (this.data.classIntervalRatio > 0) {
                vAngle2 = this.data.scaleAngle / 2 + this.data.sectorAngle * (i+1) + i * this.data.classIntervalAngle;
                endV1.x = this.data.innerRadius * Math.sin(vAngle2/180*Math.PI) + this.data.center.x;
                endV1.y = this.data.center.y - this.data.innerRadius * Math.cos(vAngle2/180*Math.PI);
                endV2.x = (this.data.outerRadius  + this.data.labelTextPos) * Math.sin(vAngle2/180*Math.PI) + this.data.center.x;
                endV2.y = this.data.center.y - (this.data.outerRadius + 10) * Math.cos(vAngle2/180*Math.PI);
                this.renderYAsix(endV1, endV2);

                this.renderLabelText(startV2, endV2, i);
            }
            else if (i > 0) {
                this.renderLabelText(preV, startV2, i-1);
            }
        }
    },

    // 根据角度渲染圆环轴刻度线
    renderXAsix: function (r) {
        var me = this;
        var data = this.data;
        var d = d3.arc()({
            innerRadius: 0,
            outerRadius: r,
            startAngle: data.scaleAngle / 2 / 180 * Math.PI,
            endAngle: (360-data.scaleAngle / 2) / 180 * Math.PI
        });

        var me = this;
        this.contentWrap.select('#xasix').append('path')
        .attr('d', d.split('L')[0])
        .attr('transform', 'translate(' + data.center.x + ',' + data.center.y + ')')
        .attr('stroke', data.scaleColor)
        .attr('fill', 'none')
    },

    // 两点连线渲染放射线轴刻度线
    renderYAsix: function (v1, v2) {
        var data = this.data;
        var d = 'M ' + v1.x + ' ' + v1.y + ' L ' + v2.x + ' ' + v2.y;

        this.contentWrap.select('#yasix').append('path')
        .attr('d', d)
        .attr('stroke', this.data.scaleColor)
        .attr('fill', 'none')
    },

    // 渲染每个类区域，填充渐变色
    renderSectors: function () {
        var data = this.data;
        var start = 360-data.sectorAngle / 2;
        var intervalStart = 360 - data.classIntervalAngle / 2;
        this.contentWrap.append('g').attr('id', 'sectorwrap');
        var arc = d3.arc();
        var d = arc({
            innerRadius: data.innerRadius,
            outerRadius: data.outerRadius,
            startAngle: start / 180 * Math.PI,
            endAngle: (start + data.sectorAngle) / 180 * Math.PI
        });
        var dInterval = arc({
            innerRadius: data.innerRadius,
            outerRadius: data.outerRadius,
            startAngle: intervalStart / 180 * Math.PI,
            endAngle: (intervalStart + data.classIntervalAngle) / 180 * Math.PI
        });
        for (var i = 0; i < data.totalSector; i++) {
            var gradientData = [
                {
                    offset: '0%',
                    stopColor: statistics[i].bgColor1
                },
                {
                    offset: '100%',
                    stopColor: statistics[i].bgColor2
                }
            ];
            var defs = this.contentWrap.select('#sectorwrap').append('defs').append('radialGradient')
                .attr('id', 'sector-lineGradient-' + i)
                .attr('cx', '50%')
                .attr('cy', '100%')
                .attr('fx', '50%')
                .attr('fy', '100%')
                .attr('r', '100%')
                .selectAll('stop')
                .data(gradientData)
                .enter()
                .append('stop')
                .attr('offset', function (d) {return d.offset})
                .attr('stop-color', function (d) {return d.stopColor})

            this.contentWrap.select('#sectorwrap').append('path')
                // .attr('id', 'text-path-' + i)
                .attr('d', d)
                .attr('transform', 'translate(' + data.center.x + ',' + data.center.y + ') rotate(' + (data.scaleAngle + (data.sectorAngle - data.scaleAngle)/2 +i*data.sectorAngle + i * data.classIntervalAngle) +')')
                .attr('fill', 'url(#sector-lineGradient-'+ i + ')')

            this.contentWrap.select('#sectorwrap').append('path')
                .attr('d', dInterval)
                // .attr('transform', 'translate(300,300) rotate(' + (data.scaleAngle + (data.classIntervalAngle - data.scaleAngle)/2 +i*data.sectorAngle) +')')
                .attr('transform', 'translate(' + data.center.x + ',' + data.center.y + ') rotate(' + ((data.scaleAngle - data.classIntervalAngle)/2 + data.classIntervalAngle + (i+1) * data.sectorAngle + i*data.classIntervalAngle) + ')')
                .attr('fill', 'none')
        }
    },

    // 渲染圆环轴刻度文字
    renderYText: function () {

        var scaleLen = (this.data.outerRadius - this.data.innerRadius) / (this.data.scaleNum - 1);
        var textInterval = this.data.maxY / (this.data.scaleNum - 1);
        var x = this.data.center.x;
        var y = this.data.center.y - this.data.innerRadius;
        this.contentWrap.append('g').attr('id', 'ytext');
        for (var i = 1; i < this.data.scaleNum; i++) {
            y = y - scaleLen;
            this.contentWrap.select('#ytext').append('text')
                .attr('class', 'scale-text')
                .attr('x', x)
                .attr('y', y)
                .attr('font-size', this.data.scaleFontSize)
                .attr('font-weight', this.data.scaleFontWeight)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'text-before-edge')
                .attr('fill', this.data.scaleFontColor)
                .text(parseInt(textInterval*i))
        }
    },

    renderLabelText: function (v1, v2, i) {
        var data = this.data;
        var direction = 1;
        var me = this;
        var d = 'M' + v1.x + ' ' + v1.y + ' A ' + data.outerRadius + ' ' + data.outerRadius
            + ',0,0,1,' + v2.x + ',' + v2.y;
        
        if (v1.y >= data.center.y) {
            d = 'M' + v2.x + ' ' + v2.y + ' A ' + data.outerRadius + ' ' + data.outerRadius
                + ',0,0,0,' + v1.x + ',' + v1.y;
            direction = 2;
        }
        this.contentWrap.append('g').attr('id', 'outertext');
        
        this.contentWrap.select('#outertext')
            .append('defs')
            .append('path')
            .attr('d', d)
            .attr('id', 'coxcomb-text-path-' + i);

        this.contentWrap.select('#outertext').append('text')
            .attr('dy', function () {
                if (direction == 1) {
                    return -data.labelTextFontSize / 2;
                }
                return data.labelTextFontSize/2;
            })
            .attr('dominant-baseline', function () {
                return 'middle'
            })
            .append("textPath")
            .text(statistics[i].className)
            .attr('font-size', data.labelTextFontSize)
            .attr('fill', data.labelTextColor)
            .attr('font-weight', data.labelTextFontWeight)
            .attr('xlink:href', '#coxcomb-text-path-' + (i))
            .attr('startOffset', function () {
                var box = d3.select(this).node().getBBox();
                var pathLength = d3.select('#coxcomb-text-path-' + i).node().getTotalLength();
                return (pathLength - box.width)/2;
            });    
    },

    renderBar: function () {
        var data =this.data;
        var me = this;
        var arc = d3.arc();
        this.contentWrap.append('g').attr('id', 'barwrap');
        this.contentWrap.append('g').attr('id', 'bartextwrap');
        var startV = {};
        var s, e, barOuterR;
        for (var i = 0; i < data.totalSector; i++) {
            var startAngle = data.scaleAngle / 2 + i * data.sectorAngle + i * data.classIntervalAngle;
            var endAngle = startAngle + data.sectorAngle;
            var lineScale = d3.scaleLinear()
                .domain([1, data.barNum])
                .range([startAngle + data.barIntervalAngle, endAngle - data.barAngle - data.barIntervalAngle]);
     
            var avg = (data.outerRadius - data.innerRadius) / data.maxY;
            for (var n = 1; n <= data.barNum; n++) {
                s = lineScale(n);
                e = s + data.barAngle;
                barOuterR = statistics[i].data[n-1] * avg + data.innerRadius;
                var arcD = arc({
                    innerRadius: data.innerRadius + 4,
                    outerRadius: barOuterR,
                    startAngle: s/180*Math.PI,
                    endAngle: e/180*Math.PI
                });
                this.contentWrap.select('#barwrap').append('path')
                    .attr('d', arcD)
                    .attr('id', 'coxcomb-bar-text-path-' + i + '-' + n)
                    .attr('transform', 'translate(' + data.center.x + ',' + data.center.y + ')')
                    .attr('fill', data.barColor[n - 1])
                    .attr('data-start', function () {
                        startV = d3.select(this).node().getPointAtLength(0);
                    });
                var arcLength = 2 * Math.PI * barOuterR * data.barAngle / 360;
                if (this.data.isShowBarNum) {
                    this.contentWrap.select('#bartextwrap').append('g')
                        .attr('transform', function () {
                            
                            var rotateAngle = data.scaleAngle / 2 + i * data.sectorAngle
                                + (i-1)*data.classIntervalAngle + n * data.barAngle
                                + (n-1) * data.barIntervalAngle;
                            return 'translate('
                                + (data.center.x + startV.x) + ',' + (data.center.y + startV.y)
                                + ') rotate(' + rotateAngle + ')'
                        })
                        .append('text')
                        .text(Number(statistics[i].data[n-1]).toFixed(data.barFloatNum))
                        .attr('x', arcLength / 2)
                        .attr('dy', data.barTextSize)
                        .attr('text-anchor', 'middle')
                        .attr('fill', data.barTextColor)
                        .attr('font-size', data.barTextSize);
                }
            }
        }
    },

    renderLegend: function () {
        var data =this.data;
        var item;
        var me = this;
        var box;
        var pos = this.getLegendPosition();
        var itemSize = data.legendHeight / legendData.length - data.legendMargin;
        this.legend = this.contentWrap.append('g').attr('id', 'legendwrap')
            .attr('transform', 'translate(' + pos.x + ',' + pos.y +')');

        this.legend
            .append('defs')
            .append('path')
            .attr('d', 'M ' + (itemSize + data.legendTextPaddingLeft) + ' ' + pos.y + ' L ' + (data.legendWidth) + ' ' + pos.y)
            .attr('id', 'coxcomb-legend-text-path')

        for (var i = 0; i < legendData.length; i++) {
            item = this.legend.append('g')
                .attr('text-anchor', 'start')
                .attr('transform', 'translate(0, ' + (itemSize + data.legendMargin) * i + ')');

            item.append('text')
                .append('textPath')
                .attr('xlink:href', '#coxcomb-legend-text-path')
                .text(legendData[i].name)
                .attr('dominant-baseline', 'middle')
                .attr('fill', data.legendFontColor)
                .attr('font-size', data.legendFontSize)
                .attr('font-weight', data.legendFontWeight)

            item.append('rect')
                .attr('width', itemSize)
                .attr('height', itemSize)
                .attr('fill', legendData[i].color)
        }
    },

    getLegendPosition: function () {
        var data = this.data;
        var pos = data.legendPosition;
        var res = {
            x: data.paddingLeft,
            y: data.paddingTop
        };
        if (pos.indexOf('center') > -1) {
            res.x = data.width / 2 - data.legendWidth / 2;
        }
        else if (pos.indexOf('right') > -1) {
            res.x = data.width - data.paddingRight - data.legendWidth;
        }

        if (pos.indexOf('middle') > -1) {
            res.y = data.height / 2 - data.legendHeight / 2;
        }
        else if (pos.indexOf('bottom') > -1) {
            res.y = data.height - data.paddingBottom - data.legendHeight;
        }
        console.log(data.width,data.paddingRight, data.legendWidth, res)
        return res;
    },
};