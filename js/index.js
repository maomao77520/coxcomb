
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

function Stacked(svg) {
    this.svg = svg;
    this.defaultOptions = {
        width: 600,
        height: 600,
        titleHeight: 30,
        totalAngle: 360,
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
        legendRatio: 0.02,
        legendItemWidth: 15,
        legendItemHeight: 9,
        legendMargin: 4,
        legendTextPaddingLeft: 4,
        legendItemMargin: 30,
        innerText: 88,
        innerTextColor: '#fff',
        innerTextSize: 30,
        innerTextWeight: 'bold',
        dasharray: 10
    }
}

Stacked.prototype = {
    init: function (params) {
        this.data = Common.mix(params || {}, this.defaultOptions);
        this.initData();

        this.data.totalSector = this.data.statistics.length;
        this.data.barNum = this.data.legendData.length;
        this.data.sectorAngle = Common.getSectorAngle(this.data);
        this.data.scaleAngle = this.data.sectorAngle * this.data.scaleAngleRatio;
        this.data.barAngle = this.data.sectorAngle / (1 + 2 * this.data.classIntervalRatio);
        this.data.classIntervalAngle = this.data.barAngle * this.data.classIntervalRatio;
        
        this.data.maxY = this.data.maxY || Common.getMaxY(this.data.statistics);
        this.data.minY = 0;


        if (+this.data.rotate == 0) {
            this.data.translateX = 0;
            this.data.translateY = 0;
        }
        else {
            Common.resetCenter(this.data);
            console.log(this.data)
        }

        this.data.oriOuterRadius = this.data.outerRadius;
        this.data.oriWidth = this.data.width;
        this.data.oriHeight = this.data.height;

        this.render();
        
    },

    initData: function () {
        if (~~this.data.isShowLegend == 1) {
            this.getLegendSize();
        }
        if (this.data.outerRadius == undefined) {
            this.data.outerRadius = this.getOuterRadius();
        }
        else {
            this.data.outerRadius = Number(this.data.outerRadius);
        } 
        this.data.innerRadius = this.data.outerRadius * this.data.innerRadiusRatio - this.data.innerRadiusMargin;
        this.data.center = {
            x: this.data.width / 2 + Number(this.data.paddingLeft) - this.data.paddingRight, 
            y: this.data.height / 2 + Number(this.data.paddingTop) - this.data.paddingBottom
        };

        // if (this.data.legendPosition == 'topcenter') {
        //     this.data.center.y += this.data.legendHeight / 2;
        // }
        // else if (this.data.legendPosition == 'bottomcenter') {
        //     this.data.center.y -= this.data.legendHeight / 2;
        // }
        // else if (this.data.legendPosition.indexOf('left') > -1) {
        //     this.data.center.x += this.data.legendWidth / 2;
        // }
        // else if (this.data.legendPosition.indexOf('right') > -1) {
        //     this.data.center.x -= this.data.legendWidth / 2;
        // }
        this.data.oriCenterX = this.data.center.x;
        this.data.oriCenterY = this.data.center.y;

        this.sortData();
    },

    sortData: function () {
        var d = this.data.statistics;
        for (var i = 0; i < d.length; i++) {
            d[i].data = d[i].data.sort(function (a, b) {
                return b.numberValue - a.numberValue;
            });
        }
    },

    getLegendSize: function () {
        if (this.data.legendPosition.indexOf('center') > -1) {
            this.data.legendHeight = this.data.height * this.data.legendRatio;
        }
        else {
            this.data.legendWidth = this.data.width * this.data.legendRatio;
        }
    },

    getOuterRadius: function () {
        var w = this.data.width - this.data.paddingLeft - this.data.paddingRight;
        var h = this.data.height - this.data.paddingTop -this.data.paddingBottom - this.data.titleHeight;

        if (this.data.legendPosition.indexOf('center') > -1) {
            h = h - this.data.legendHeight;
        }
        else {
            w = w - this.data.legendWidth;
        }

        var r = w > h ? h / 2 : w / 2;
        return r - this.data.labelTextPos - 3 / 2 * this.data.labelTextFontSize;
    },

    render: function () {
        var data = this.data;
        this.svg.select('g').remove();
        this.contentWrap = this.svg.append('svg:g')
            .attr('transform', function () {
                return 'translate(' + data.translateX + ',' + data.translateY
                  + ') rotate(' + data.rotate + ')';
            });
              
        if (~~this.data.isShowTitle == 1) {
            Common.renderTitle(this.contentWrap, this.data);
        }
        
        if (~~this.data.isShowLegend == 1) {
            Common.renderLegend(this);
            // data.center.y = ++data.center.y + Number(data.legendHeight)
            console.log(data.center, data.legendHeight)
        }

        Common.getYAsix(this.contentWrap, this.data);
        if (this.data.borderType !== 'none') {
            Common.renderCircleBorder(this.contentWrap, this.data);
        }
        Common.renderInnerCircle(this);
        Common.renderSectors(this.contentWrap, this.data);
        if (~~this.data.isShowXAsix == 1) {
            Common.renderXAsix(this.contentWrap, this.data);
        }
        if (~~this.data.isShowYText == 1) {
            Common.renderYText(this.contentWrap, this.data);
        }

        this.renderBar();


    },

    update: function (params) {
        var d = this.data;
        var diffW = params.width - d.oriWidth;
        var diffH = params.height - d.oriHeight;
        if (diffW < 0 && diffH < 0) {
            var diff = Math.abs(diffW) < Math.abs(diffH) ? diffH : diffW;
        }
        else {
            var diff = diffW > diffH ? diffH : diffW;
        }
        this.data.outerRadius = (+d.oriOuterRadius + diff/2) > 0 ? (+d.oriOuterRadius + diff/2) : 0;
        this.data.innerRadius = this.data.outerRadius * this.data.innerRadiusRatio;
        this.data.center.x = this.data.oriCenterX + diffW / 2;
        this.data.center.y = this.data.oriCenterY + diffH / 2;

        this.render();
    },

    renderBar: function () {
        var data = this.data;
        var me = this;
        var arc = d3.arc();
        this.contentWrap.append('g').attr('id', 'barwrap');
        this.contentWrap.append('g').attr('id', 'bartextwrap');
        var startV = {};
        var s, e, barOuterR, arcLength;
        var fillColor, direction, rotateAngle;
        for (var i = 0; i < data.totalSector; i++) {
            var startAngle = data.scaleAngle / 2 + i * data.sectorAngle;
            var endAngle = startAngle + data.sectorAngle;
            var avg = (data.outerRadius - data.innerRadius) / data.maxY;
            for (var n = 1; n <= data.barNum; n++) {
                if (data.statistics[i].data[n-1].numberValue == undefined) {
                    continue;
                }
                s = startAngle + data.classIntervalAngle;
                e = s + data.barAngle;
                barOuterR = data.statistics[i].data[n-1].numberValue > 0 
                    ? data.statistics[i].data[n-1].numberValue * avg + data.innerRadius
                    : data.innerRadius + data.innerRadiusMargin;
                arcLength = 2 * Math.PI * barOuterR * data.barAngle / 360;

                fillColor = data.legendColor[data.legendData.indexOf(data.statistics[i].data[n-1][data.legendType])]

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
                    .attr('fill', fillColor)
                    .attr('data-start', function () {
                        startV = d3.select(this).node().getPointAtLength(0);
                    });
                direction = 1;
                if (s > 90 && s < 270) {
                    direction = 2;
                }
                rotateAngle = s + data.barAngle / 2;

                if (~~this.data.isShowBarNum == 1) {
                    this.contentWrap.select('#bartextwrap').append('g')
                        .attr('transform', function () {
                            if (direction == 2) {
                                rotateAngle = rotateAngle - 180;
                            }
                            return 'translate('
                                + (data.center.x + startV.x) + ',' + (data.center.y + startV.y)
                                // + ')'
                                + ') rotate(' + rotateAngle + ')'; 
                        })
                        .append('text')
                        .text(Number(data.statistics[i].data[n-1].numberValue).toFixed(data.barFloatNum))
                        .attr('x', function () {
                            return direction == 1 ? arcLength / 2 : -arcLength / 2;
                        })
                        .attr('dy', function () {
                            if (direction == 2) {
                                return data.barTextSize
                            }
                        })
                        .attr('text-anchor', 'middle')
                        .attr('fill', data.barTextColor)
                        .attr('font-size', data.barTextSize);
                }
            }
        }
    }
};


function Cluster(svg) {
    this.svg = svg;
    this.defaultOptions = {
        width: 600,
        height: 600,
        totalAngle: 360,
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
        legendRatio: 0.02,
        legendItemWidth: 15,
        legendItemHeight: 9,
        legendMargin: 4,
        legendTextPaddingLeft: 4,
        legendItemMargin: 20,
        innerText: '',
        innerTextColor: 'none',
        innerTextSize: 30,
        innerTextWeight: 'bold',
        borderType: 'none',
        dasharray: 10
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
        this.data.barAngle = this.getBarAngle();
        this.data.barIntervalAngle = this.data.barAngle * this.data.barIntervalRatio;
        this.data.classIntervalAngle = this.data.barAngle * this.data.classIntervalRatio;
        this.data.maxY = this.data.maxY || Common.getMaxY(this.data.statistics);
        this.data.minY = 0;

        this.data.oriOuterRadius = this.data.outerRadius;
        this.data.oriWidth = this.data.width;
        this.data.oriHeight = this.data.height;

        this.render();
        

    },

    initData: function () {
        if (~~this.data.isShowLegend == 1) {
            this.getLegendSize();
            // this.data.legendWidth = this.data.legendWidthRatio * this.data.width;
            // this.data.legendHeight = this.data.legendHeightRatio * this.data.height;
        }
        if (this.data.outerRadius == undefined) {
            this.data.outerRadius = this.getOuterRadius();
        }
        else {
            this.data.outerRadius = Number(this.data.outerRadius);
        } 
        this.data.innerRadius = this.data.outerRadius * this.data.innerRadiusRatio - this.data.innerRadiusMargin;
        this.data.center = {
            x: this.data.width / 2 + Number(this.data.paddingLeft) - this.data.paddingRight, 
            y: this.data.height / 2 + Number(this.data.paddingTop) - this.data.paddingBottom
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
        this.data.oriCenterX = this.data.center.x;
        this.data.oriCenterY = this.data.center.y;
    },

    getLegendSize: function () {
        if (this.data.legendPosition.indexOf('center') > -1) {
            this.data.legendHeight = this.data.height * this.data.legendRatio;
        }
        else {
            this.data.legendWidth = this.data.width * this.data.legendRatio;
        }
    },

    getOuterRadius: function () {
        var w = this.data.width - this.data.paddingLeft - this.data.paddingRight;
        var h = this.data.height - this.data.paddingTop -this.data.paddingBottom;

        if (this.data.legendPosition.indexOf('center') > -1) {
            h = h - this.data.legendHeight;
        }
        else {
            w = w - this.data.legendWidth;
        }

        var r = w > h ? h / 2 : w / 2;
        return r - this.data.labelTextPos - 3 / 2 * this.data.labelTextFontSize;
    },

    getBarAngle: function () {
        var data = this.data;
        //2*classIntervalRatio*barAngle + barNum*barAngle + (barNum-1)*barIntervalRatio*barAngle = sectorAngle
        return data.sectorAngle / (2 * data.classIntervalRatio + data.barNum + (data.barNum - 1) * data.barIntervalRatio);
    },

    render: function () {
        this.svg.select('g').remove();
        this.contentWrap = this.svg.append('svg:g');

        Common.renderInnerCircle(this);
        Common.renderSectors(this.contentWrap, this.data);
        Common.getYAsix(this.contentWrap, this.data);

        if (~~this.data.isShowTitle == 1) {
            Common.renderTitle(this.contentWrap, this.data);
        }
        if (~~this.data.isShowXAsix == 1) {
            Common.renderXAsix(this.contentWrap, this.data);
        }
        if (~~this.data.isShowYText == 1) {
            Common.renderYText(this.contentWrap, this.data);
        }

        if (~~this.data.isShowLegend == 1) {
            Common.renderLegend(this);
        }

        if (this.data.borderType !== 'none') {
            Common.renderCircleBorder(this.contentWrap, this.data);
        }
        this.renderBar();
    },

    update: function (params) {
        var d = this.data;
        var diffW = params.width - d.oriWidth;
        var diffH = params.height - d.oriHeight;
        if (diffW < 0 && diffH < 0) {
            var diff = Math.abs(diffW) < Math.abs(diffH) ? diffH : diffW;
        }
        else {
            var diff = diffW > diffH ? diffH : diffW;
        }
        this.data.outerRadius = (+d.oriOuterRadius + diff/2) > 0 ? (+d.oriOuterRadius + diff/2) : 0;
        this.data.innerRadius = this.data.outerRadius * this.data.innerRadiusRatio;
        this.data.center.x = this.data.oriCenterX + diffW / 2;
        this.data.center.y = this.data.oriCenterY + diffH / 2;

        this.render();
    },

    renderBar: function () {
        var data = this.data;
        var me = this;
        var arc = d3.arc();
        this.contentWrap.append('g').attr('id', 'barwrap');
        this.contentWrap.append('g').attr('id', 'bartextwrap');
        var startV = {};
        var s, e, barOuterR, arcLength;
        for (var i = 0; i < data.totalSector; i++) {
            var startAngle = data.scaleAngle / 2 + i * data.sectorAngle;
            var endAngle = startAngle + data.sectorAngle;
     
            var avg = (data.outerRadius - data.innerRadius) / data.maxY;
            for (var n = 1; n <= data.barNum; n++) {
                if (data.statistics[i].data[n-1].numberValue == undefined) {
                    continue;
                }
                s = startAngle + data.classIntervalAngle + (n-1) * data.barAngle + (n-1) * data.barIntervalAngle;
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

