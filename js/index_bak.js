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
        scaleNum: 4,
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
        classIntervalRatio: 0.05,
        barIntervalRatio: 0.05,
        isShowBarNum: true,
        barFloatNum: 0,
        barTextColor: '#aaa',
        barTextSize: 12,
        paddingLeft: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        isShowLegend: true,
        legendFontColor: '#aaa',
        legendFontSize: 14,
        legendFontWeight: 'normal',
        legendWidth: 0,
        legendHeight: 0,
        legendPosition: 'topleft',
        legendHeightRatio: 0.02,
        legendWidthRatio: 0.15,
        legendMargin: 4,
        legendTextPaddingLeft: 4,
        legendItemMargin: 20,
        innerText: 88,
        innerTextColor: '#fff',
        innerTextSize: 30,
        innerTextWeight: 'bold',
        
    }
}

Chart.prototype = {
    init: function (params) {
        this.data = mix(params || {}, this.defaultOptions);
        this.contentWrap = this.svg.append('svg:g');

        this.data.totalSector = this.data.statistics.length;
        this.data.barNum = this.data.legendData.length;
        if (this.data.isShowLegend) {
            this.data.legendWidth = this.data.legendWidthRatio * this.data.width;
            this.data.legendHeight = this.data.legendHeightRatio * this.data.height;
        }
        var w = this.data.width - this.data.paddingLeft - this.data.paddingRight;
        var h = this.data.height - this.data.paddingTop -this.data.paddingBottom;

        if (this.data.legendPosition.indexOf('center') > -1) {
            h = h - this.data.legendHeight;
        }
        else if (this.data.legendPosition.indexOf('left') > -1 || this.data.legendPosition.indexOf('right') > -1) {
            w = w - this.data.legendWidth;
        }

        var r = w > h ? h / 2 : w / 2;
        this.data.outerRadius = r - this.data.labelTextPos - 3 / 2 * this.data.labelTextFontSize;
        this.data.innerRadius = this.data.outerRadius * this.data.innerRadiusRadio;
        this.data.center = {
            x: this.data.width / 2, 
            y: this.data.height / 2
        };
        if (this.data.legendPosition == 'topcenter') {
            this.data.center.y += this.data.legendHeight / 2;
        }
        else if (this.data.legendPosition == 'bottomcenter') {
            this.data.center.y -= this.data.legendHeight / 2;
        }
        else if (this.data.legendPosition.indexOf('left') > -1) {
            this.data.center.x += this.data.legendWidth / 2;
        }
        else if (this.data.legendPosition.indexOf('right') > -1) {
            this.data.center.x -= this.data.legendWidth / 2;
        }
   
   console.log(this.data.legendHeight, this.data.center, this.data.outerRadius)  
        this.data.sectorAngle = this.getSectorAngle(this.data);
        this.data.scaleAngle = this.data.sectorAngle * this.data.scaleAngleRatio;
        this.data.barIntervalAngle = this.data.sectorAngle * this.data.barIntervalRatio;
        this.data.classIntervalAngle = this.data.sectorAngle * this.data.classIntervalRatio;
        this.data.barAngle = (this.data.sectorAngle - this.data.barIntervalAngle * (this.data.barNum + 1)) / this.data.barNum;

        this.data.maxY = this.getMaxY(this.data.statistics);
        this.data.minY = 0;

        // this.renderCircleBorder();
        this.renderSectors();
        this.renderInnerCircle();
        this.renderYText();
        if (this.data.isShowXAsix) {
            this.renderXAsix();
        }
        if (this.data.isShowYAsix) {
            this.getYAsix();
        }
        if (this.data.isShowLegend) {
            this.renderLegend();
        }
        this.renderBar();

    },

    getMaxY: function (data) {
        var max = 0;
        for (var i = 0; i < data.length; i++) {
            for (var n = 0; n < data[i].data.length; n++) {
                if (data[i].data[n].numberValue > max) {
                    max = data[i].data[n].numberValue;
                }
            }
        }
        return Math.ceil(max / 50) * 50;
    },
    // 计算每个扇形的角度
    getSectorAngle: function (data) {
        // totalSector*x+(totalSector-1)*classIntervalRatio*x + scaleAngleRatio * x = 360;
        var temp = data.totalSector + data.totalSector * data.classIntervalRatio
        - data.classIntervalRatio + data.scaleAngleRatio;
        return 360 / temp;
    },

    // 渲染最外层边框
    renderCircleBorder: function () {
        this.circleBorder = this.contentWrap.append('circle')
            // .attr('class', 'coxcomb-circle-wrap')
            .attr('cx', this.data.center.x)
            .attr('cy', this.data.center.y)
            .attr('r', this.data.outerRadius)
            .attr('stroke', this.data.borderColor)
            .attr('fill', 'none')
    },

    renderInnerCircle: function () {
        var data = this.data;
        this.innerCircle = this.contentWrap.append('g')
            .attr('id', 'coxcomb-inner-circle');
        this.innerCircle.append('circle')
            .attr('cx', data.center.x)
            .attr('cy', data.center.y)
            .attr('r', data.innerRadius)
            .attr('fill', function () {
                return data.innerCircleBg || 'none';
            });
        this.innerCircle.append('text')
            .attr('fill', data.innerTextColor)
            .attr('font-size', data.innerTextSize)
            .attr('font-weight', data.innerTextWeight)
            .text(data.innerText)
            .attr('dominant-baseline', 'text-after-edge')
            .attr('text-anchor', 'middle')
            .attr('x', data.center.x)
            .attr('y', function () {
                var b = d3.select(this).node().getBBox();
                return data.center.y + b.height / 2;
            });
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
                endV2.y = this.data.center.y - (this.data.outerRadius + this.data.labelTextPos) * Math.cos(vAngle2/180*Math.PI);
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
                    stopColor: data.sectorBgColor[i % data.sectorBgColor.length].start
                },
                {
                    offset: '100%',
                    stopColor: data.sectorBgColor[i % data.sectorBgColor.length].end
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
                .attr('d', d)
                .attr('transform', 'translate(' + data.center.x + ',' + data.center.y
                    + ') rotate(' + (data.scaleAngle + (data.sectorAngle - data.scaleAngle) / 2
                    + i * data.sectorAngle + i * data.classIntervalAngle) + ')')
                .attr('fill', 'url(#sector-lineGradient-'+ i + ')')

            // this.contentWrap.select('#sectorwrap').append('path')
            //     .attr('d', dInterval)
            //     .attr('transform', 'translate(' + data.center.x + ',' + data.center.y
            //         + ') rotate(' + ((data.scaleAngle - data.classIntervalAngle)/2
            //         + data.classIntervalAngle + (i+1) * data.sectorAngle
            //         + i * data.classIntervalAngle) + ')')
            //     .attr('fill', 'red')
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
            .text(statistics[i].name)
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
        var s, e, barOuterR, arcLength;
        for (var i = 0; i < data.totalSector; i++) {
            var startAngle = data.scaleAngle / 2 + i * data.sectorAngle + i * data.classIntervalAngle;
            var endAngle = startAngle + data.sectorAngle;
            var lineScale = d3.scaleLinear()
                .domain([1, data.barNum])
                .range([startAngle + data.barIntervalAngle, endAngle - data.barAngle - data.barIntervalAngle]);
     
            var avg = (data.outerRadius - data.innerRadius) / data.maxY;
            for (var n = 1; n <= data.barNum; n++) {
                if (!data.statistics[i].data[n-1].numberValue) {
                    continue;
                }
                s = lineScale(n);
                e = s + data.barAngle;
                barOuterR = data.statistics[i].data[n-1].numberValue * avg + data.innerRadius;
                arcLength = 2 * Math.PI * barOuterR * data.barAngle / 360;
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
                    .attr('fill', data.legendColor[(n-1) % data.legendColor.length])
                    .attr('data-start', function () {
                        startV = d3.select(this).node().getPointAtLength(0);
                    });
                
                

                if (this.data.isShowBarNum) {
                    this.contentWrap.select('#bartextwrap').append('g')
                        .attr('transform', function () {
                            var rotateAngle = data.scaleAngle / 2 + i * data.sectorAngle
                                + (i-1) * data.classIntervalAngle + n * data.barAngle
                                + (n-1) * data.barIntervalAngle;
                            return 'translate('
                                + (data.center.x + startV.x) + ',' + (data.center.y + startV.y)
                                + ') rotate(' + rotateAngle + ')'
                        })
                        .append('text')
                        .text(Number(data.statistics[i].data[n-1].numberValue).toFixed(data.barFloatNum))
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
        var item, itemSize;
        var me = this;
        var box;
        var pos = this.getLegendPosition();
        this.legend = this.contentWrap.append('g').attr('id', 'coxcomb-legend-wrap')
            .attr('transform', 'translate(' + pos.x + ',' + pos.y +')');

        if (data.legendPosition.indexOf('center') > -1) {
            var len = 0, b, textPos;
            var y = 0;
            itemSize = data.legendHeight;
            for (var i = 0; i < data.legendData.length; i++) {
                if (len > data.width * 0.8) {
                    len = 0;
                    y = y + itemSize + data.legendMargin;
                }
                var item = this.legend.append('g')

                item.append('rect')
                    .attr('width', itemSize)
                    .attr('height', itemSize)
                    .attr('fill', data.legendColor[i % data.legendColor.length])
                    .attr('x', len)
                    .attr('y', y)
                    
                item.append('text')
                    .text(data.legendData[i])
                    .attr('dominant-baseline', 'text-before-edge')
                    .attr('fill', data.legendFontColor)
                    .attr('font-size', data.legendFontSize)
                    .attr('font-weight', data.legendFontWeight)
                    .attr('y', y)
                    .attr('x', function () {
                        b = d3.select(this).node().getBBox();
                        textPos = len + itemSize + data.legendTextPaddingLeft;
                        len = textPos + b.width + data.legendItemMargin;
                        return textPos;
                    });
            }
            this.contentWrap.select('#coxcomb-legend-wrap')
                .attr('transform', function () {
                    var b = d3.select(this).node().getBBox();
                    var x = (data.width - b.width) / 2;
                    return 'translate(' + x + ',' + pos.y + ')';
                });

        }
        else {
            
            itemSize = data.legendHeight / data.legendData.length - data.legendMargin;
            this.legend
                .append('def')
                .append('path')
                .attr('d', 'M ' + (itemSize + data.legendTextPaddingLeft) + ' 0 L ' + (data.legendWidth) + ' 0')
                .attr('id', 'coxcomb-legend-text-path');

            for (var i = 0; i < data.legendData.length; i++) {
                item = this.legend.append('g')
                    .attr('text-anchor', 'start')
                    .attr('transform', 'translate(0, ' + (itemSize + data.legendMargin) * i + ')');

                item.append('text')
                    .append('textPath')
                    .attr('xlink:href', '#coxcomb-legend-text-path')
                    .text(data.legendData[i])
                    .attr('dominant-baseline', 'text-before-edge')
                    .attr('fill', data.legendFontColor)
                    .attr('font-size', data.legendFontSize)
                    .attr('font-weight', data.legendFontWeight)

                item.append('rect')
                    .attr('width', itemSize)
                    .attr('height', itemSize)
                    .attr('fill', data.legendColor[i % data.legendColor.length])
            }
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
        return res;
    },
};