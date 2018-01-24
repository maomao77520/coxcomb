
function Chart(type, svg) {
	return this.init(type, svg);
}

Chart.prototype = {
	init: function (type, svg) {
		var chart;
		if (type === 'cluster') {
		    chart = new Cluster(svg);
		}
		else {
			chart = new Stacked(svg);
		}
	    return chart;
	},
};


function Cluster(svg) {
    this.svg = svg;
    this.defaultOptions = {
        width: 600,
        height: 600,
        scaleAngleRatio: 1.5,
        scaleNum: 5,
        borderColor: '#f00',
        innerRadiusRatio: 0.2,
        innerRadiusMargin: 4,
        scaleColor: 'rgba(25,25,25,0.5)',
        scaleFontSize: 14,
        scaleFontColor: 'rgba(255,255,255,0.3)',
        scaleFontWeight: 'normal',
        isShowXAsix: true,
        isShowYAsix: true,
        isShowLabel: true,
        labelTextColor: 'rgba(255,255,255,0.3)',
        labelTextPos: 20,
        labelTextFontSize: 16,
        labelTextFontWeight: 'normal',
        classIntervalRatio: 0,
        barIntervalRatio: 0.05,
        isShowBarNum: true,
        barFloatNum: 0,
        barTextColor: '#aaa',
        barTextSize: 12,
        paddingLeft: 0,
        paddingTop: 10,
        paddingRight: 0,
        paddingBottom: 0,
        isShowLegend: true,
        legendFontColor: '#aaa',
        legendFontSize: 14,
        legendFontWeight: 'normal',
        legendWidth: 0,
        legendHeight: 0,
        legendPosition: 'topcenter',
        legendHeightRatio: 0.02,
        legendWidthRatio: 0.15,
        legendMargin: 4,
        legendTextPaddingLeft: 4,
        legendItemMargin: 20,
        innerText: 88,
        innerTextColor: '#fff',
        innerTextSize: 30,
        innerTextWeight: 'bold'
    }
}

Cluster.prototype = {
    init: function (params) {
        this.data = Common.mix(params || {}, this.defaultOptions);
        this.initData();

        this.data.totalSector = this.data.statistics.length;
        this.data.barNum = this.data.legendData.length;
        this.data.sectorAngle = Common.getSectorAngle(this.data);
        this.data.scaleAngle = this.data.sectorAngle * this.data.scaleAngleRatio;
        this.data.barIntervalAngle = this.data.sectorAngle * this.data.barIntervalRatio;
        this.data.classIntervalAngle = this.data.sectorAngle * this.data.classIntervalRatio;
        this.data.barAngle = (this.data.sectorAngle - this.data.barIntervalAngle * (this.data.barNum + 1)) / this.data.barNum;

        this.data.maxY = Common.getMaxY(this.data.statistics);
        this.data.minY = 0;

        this.render();
        

    },

    initData: function () {
        if (~~this.data.isShowLegend == 1) {
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
        this.data.innerRadius = this.data.outerRadius * this.data.innerRadiusRatio - this.data.innerRadiusMargin;
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
    },

    render: function () {
        this.svg.select('g').remove();
        this.contentWrap = this.svg.append('svg:g');
        // this.renderCircleBorder();
        // this.renderInnerCircle();
        this.renderSectors();
        Common.renderYText(this.contentWrap, this.data);
        Common.getYAsix(this.contentWrap, this.data);
        if (~~this.data.isShowXAsix == 1) {
            Common.renderXAsix(this.contentWrap, this.data);
        }
        
        if (~~this.data.isShowLegend == 1) {
            Common.renderLegend(this);
        }
        this.renderBar();
    },

    update: function (params) {
        this.data = params;
        this.initData();
        this.render();
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
                if (data.statistics[i].data[n-1].numberValue == undefined) {
                    continue;
                }
                s = lineScale(n);
                e = s + data.barAngle;
                barOuterR = data.statistics[i].data[n-1].numberValue > 0 
                    ? data.statistics[i].data[n-1].numberValue * avg + data.innerRadius
                    : data.innerRadius + data.innerRadiusMargin;
                arcLength = 2 * Math.PI * barOuterR * data.barAngle / 360;
                var arcD = arc({
                    innerRadius: data.innerRadius + data.innerRadiusMargin,
                    outerRadius: barOuterR,
                    startAngle: s / 180 * Math.PI,
                    endAngle: e / 180 * Math.PI
                });
                this.contentWrap.select('#barwrap').append('path')
                    .attr('d', arcD)
                    .attr('id', 'coxcomb-bar-text-path-' + i + '-' + n)
                    .attr('transform', 'translate(' + data.center.x + ',' + data.center.y + ')')
                    .attr('fill', data.legendColor[(n-1) % data.legendColor.length])
                    .attr('data-start', function () {
                        startV = d3.select(this).node().getPointAtLength(0);
                    });
                var direction = 1;
                if (s > 90 && s < 270) {
                    direction =2;
                }
                if (~~this.data.isShowBarNum == 1) {
                    this.contentWrap.select('#bartextwrap').append('g')
                        .attr('transform', function () {
                            var rotateAngle = data.scaleAngle / 2 + i * data.sectorAngle
                                + (i-1) * data.classIntervalAngle + n * data.barAngle
                                + (n-1) * data.barIntervalAngle;
                            if (direction == 2) {
                                rotateAngle = rotateAngle - 180;
                            }
                            return 'translate('
                                + (data.center.x + startV.x) + ',' + (data.center.y + startV.y)
                                + ') rotate(' + rotateAngle + ')'; 
                        })
                        .append('text')
                        .text(Number(data.statistics[i].data[n-1].numberValue).toFixed(data.barFloatNum))
                        .attr('x', function () {
                            return direction == 1 ? arcLength / 2 : -arcLength / 2;
                        })
                        .attr('dy', function () {
                            if (direction == 1) {
                                return d3.select(this).node().getBBox().height / 2;
                            }
                            return -(d3.select(this).node().getBBox().height - data.barTextSize) / 2;
                        })
                        .attr('text-anchor', 'middle')
                        .attr('fill', data.barTextColor)
                        .attr('font-size', data.barTextSize);
                }
            }
        }
    }
};

