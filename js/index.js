
function Chart(params, svg) {
	return this.init(params.type, svg);
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
        rotate: 0,
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
        legendX:0,
        legendY:0,
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

        this.render();
        
    },

    render: function () {
        var data = this.data;
        this.svg.select('g').remove();
        this.contentWrap = this.svg.append('svg:g')
        this.contentWrap.append('rect')
            .attr('width', data.width)
            .attr('height', data.height)
            .attr('fill', data.backgroundColor);

        this.rotateWrap = this.contentWrap.append('g')
            .attr('id', 'my-coxcomb-component-rotate-wrap')

        if (~~this.data.isShowTitle == 1) {
            Common.renderTitle(this.contentWrap, this.data);
        }
        
        if (~~this.data.isShowLegend == 1) {
            this.data.legendSize = Common.renderLegend(this);
            this.data.legendHeight = this.data.legendSize.height;
            this.data.legendWidth = this.data.legendSize.width;
        }

        this.initData();

        if (this.data.borderType !== 'none') {
            Common.renderCircleBorder(this.rotateWrap, this.data);
        }
        Common.renderInnerCircle(this);
        Common.renderSectors(this.rotateWrap, this.data);
        if (~~this.data.isShowXAsix == 1) {
            Common.renderXAsix(this.rotateWrap, this.data);
        }
        if (~~this.data.isShowYText == 1) {
            Common.renderYText(this.rotateWrap, this.data);
        }

        this.renderBar();
        Common.getYAsix(this.rotateWrap, this.data);

        // this.rotateWrap.attr('transform', 'rotate(' + data.rotate + ')')
        //     .attr('transform-origin', data.center.x + ' ' + data.center.y);
        
    },

    initData: function () {

        var w = this.data.width - this.data.paddingLeft - this.data.paddingRight;
        var h = this.data.height - this.data.paddingTop -this.data.paddingBottom;

        this.data.center = {
            x: this.data.width / 2 + Number(this.data.paddingLeft) - this.data.paddingRight, 
            y: this.data.height / 2 + Number(this.data.paddingTop) - this.data.paddingBottom
        };
        if (~~this.data.isShowTitle== 1) {
            this.data.center.y += this.data.titleHeight / 2;
            h -= this.data.titleHeight;
        }
        if (~~this.data.isShowLegend == 1) {
            if (this.data.legendPosition.indexOf('left')>-1) {
                this.data.center.x += this.data.legendWidth / 2;
                w = w - this.data.legendWidth;
            }
            else if (this.data.legendPosition.indexOf('right')>-1) {
                this.data.center.x -= this.data.legendWidth / 2;
                w = w - this.data.legendWidth;
            }
            else if (this.data.legendPosition.indexOf('bottom')>-1) {
                this.data.center.y -= this.data.legendHeight / 2;
                h -= this.data.legendHeight;
            }
            else if (this.data.legendPosition.indexOf('top')>-1) {
                this.data.center.y += this.data.legendHeight / 2;
                h -= this.data.legendHeight;
            }
        }

        var r = w > h ? h / 2 : w / 2;
        if (this.data.outerRadius === undefined || this.data.outerRadius === '') {
            this.data.outerRadius = r - this.data.labelTextPos - 3 / 2 * this.data.labelTextFontSize;
        }
        else {
            this.data.outerRadius = Number(this.data.outerRadius);
        }

        this.data.innerRadius = this.data.outerRadius * this.data.innerRadiusRatio - this.data.innerRadiusMargin;
        this.data.innerRadius = this.data.innerRadius > 0 ? this.data.innerRadius : 0;

        this.data.totalSector = this.data.statistics.length;
        this.data.barNum = this.data.legendData.length;
        this.data.sectorAngle = Common.getSectorAngle(this.data);
        this.data.scaleAngle = this.data.sectorAngle * this.data.scaleAngleRatio;
        this.data.barAngle = this.data.sectorAngle / (1 + 2 * this.data.classIntervalRatio);
        this.data.classIntervalAngle = this.data.barAngle * this.data.classIntervalRatio;
        
        this.data.maxY = this.data.maxY || Common.getMaxY(this.data.statistics);
        this.data.minY = this.data.minY || Common.getMinY(this.data.statistics);

        this.data.oriOuterRadius = this.data.outerRadius;
        this.data.oriWidth = this.data.width;
        this.data.oriHeight = this.data.height;

        this.data.oriCenterX = this.data.center.x;
        this.data.oriCenterY = this.data.center.y;

        this.data.innerTextSizeRatio = this.data.innerTextSize / this.data.width;
        this.data.scaleFontSizeRatio = this.data.scaleFontSize / this.data.width;
        this.data.labelTextFontSizeRatio = this.data.labelTextFontSize / this.data.width;
        this.data.barTextSizeRatio = this.data.barTextSize / this.data.width;
        this.data.legendFontSizeRatio = this.data.legendFontSize / this.data.width;

        Common.sortData(this.data);
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
        this.data.innerRadius = this.data.outerRadius * this.data.innerRadiusRatio - this.data.innerRadiusMargin;
        this.data.innerRadius = this.data.innerRadius > 0 ? this.data.innerRadius : 0;
        this.data.center.x = this.data.oriCenterX + diffW / 2;
        this.data.center.y = this.data.oriCenterY + diffH / 2;

        this.data.innerTextSize = this.data.innerTextSizeRatio * this.data.width;
        this.data.scaleFontSize = this.data.scaleFontSizeRatio * this.data.width;
        this.data.labelTextFontSize = this.data.labelTextFontSizeRatio * this.data.width;
        this.data.barTextSize = this.data.barTextSizeRatio * this.data.width;
        this.data.legendFontSize = this.data.legendFontSizeRatio * this.data.width;

        this.render();
    },

    renderBar: function () {
        var data = this.data;
        var me = this;
        var arc = d3.arc();
        this.rotateWrap.append('g').attr('id', 'coxcomb-component-barwrap');
        this.rotateWrap.append('g').attr('id', 'coxcomb-component-bartextwrap');
        var startV = {};
        var s, e, barOuterR, arcLength;
        var fillColor, direction, rotateAngle;
        var color, hoverPop, hoverRect, hoverSize, hoverText;
        for (var i = 0; i < data.totalSector; i++) {
            var startAngle = data.scaleAngle / 2 + i * (data.sectorAngle);
            var endAngle = startAngle + data.sectorAngle;
            var avg = (data.outerRadius - data.innerRadius) / (data.maxY - data.minY);
            for (var n = 1; n <= data.barNum; n++) {
                if (data.statistics[i].data[n-1].numberValue == undefined) {
                    continue;
                }
                s = startAngle + data.classIntervalAngle;
                e = s + data.barAngle;
                barOuterR = data.statistics[i].data[n-1].numberValue - data.minY > 0 
                    ? (data.statistics[i].data[n-1].numberValue - data.minY) * avg + data.innerRadius
                    : data.innerRadius + data.innerRadiusMargin;
                arcLength = 2 * Math.PI * barOuterR * data.barAngle / 360;

                fillColor = data.legendColor[data.legendData.indexOf(data.statistics[i].data[n-1][data.legendType])]

                color = color = d3.rgb(fillColor);
                data.statistics[i].data[n-1].tipBg = d3.rgb(
                        Math.round(color.r + 0.8*(255-color.r)),
                        Math.round(color.g + 0.8*(255-color.g)),
                        Math.round(color.b + 0.8*(255-color.b))
                    )
                var arcD = arc({
                    innerRadius: data.innerRadius + data.innerRadiusMargin,
                    outerRadius: barOuterR,
                    startAngle: s / 180 * Math.PI,
                    endAngle: e / 180 * Math.PI
                });
                (function (i, n) {
                    me.rotateWrap.select('#coxcomb-component-barwrap').append('path')
                        .attr('d', arcD)
                        .attr('id', 'coxcomb-bar-text-path-' + i + '-' + n)
                        .attr('transform', 'translate(' + data.center.x + ',' + data.center.y + ')')
                        .attr('fill', fillColor)
                        .attr('data-start', function () {
                            startV = d3.select(this).node().getPointAtLength(0);
                        })
                        .on('mouseenter', function () {
                            hoverPop = me.rotateWrap.append('g')
                                .attr('transform', 'translate(' + d3.event.offsetX + ',' + d3.event.offsetY + ')')
                            hoverRect = hoverPop.append('rect')
                                .attr('x', 0)
                                .attr('y', 0)
                                .attr('rx', 3)
                                .attr('ry', 3)
                                .attr('fill', data.statistics[i].data[n-1].tipBg)
                            hoverText = hoverPop.append('text')
                                .attr('fill', '#000')
                                .attr('font-size', 12)
                                .attr('font-family', 'microsoft yahei')
                                .attr('dominant-baseline', 'middle')
                            hoverText.append('tspan').text(data.statistics[i].name)
                                .attr('dy', 14)
                                .attr('x', 5)
                            hoverText.append('tspan').text(data.statistics[i].data[n-1][data.legendType]
                                + ': ' + data.statistics[i].data[n-1].numberValue)
                                .attr('dy', 14)
                                .attr('x', 5)
                            hoverRect.attr('width', function () {
                                    hoverSize = hoverText.node().getBBox();
                                    return hoverSize.width + 10;
                                })
                                .attr('height', hoverSize.height + 10)
                            
                        })
                        .on('mouseleave', function () {
                            hoverPop.remove();
                        });
                })(i, n)
                
                direction = 1;
                if (s > 90 && s < 270) {
                    direction = 2;
                }
                rotateAngle = s + data.barAngle / 2;

                if (~~this.data.isShowBarNum == 1) {
                    (function (i, n) {
                        me.rotateWrap.select('#coxcomb-component-bartextwrap').append('g')
                            .attr('transform', function () {
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
                                if (direction == 2) {
                                    return data.barTextSize
                                }
                            })
                            .attr('text-anchor', 'middle')
                            .attr('fill', data.barTextColor)
                            .attr('font-size', data.barTextSize)
                            .attr('transform', function () {
                                if (data.rotate == 180) {
                                    b = d3.select(this).node().getBBox();
                                    return 'rotate(180,' + (b.x + b.width/2) + ' ' + (b.y+ b.height/2) + ')'
                                }
                            })
                            .on('mouseenter', function () {
                                    hoverPop = me.rotateWrap.append('g')
                                        .attr('transform', 'translate(' + d3.event.offsetX + ',' + d3.event.offsetY + ')')
                                    hoverRect = hoverPop.append('rect')
                                        .attr('x', 0)
                                        .attr('y', 0)
                                        .attr('rx', 3)
                                        .attr('ry', 3)
                                        .attr('fill', data.statistics[i].data[n-1].tipBg)
                                    hoverText = hoverPop.append('text')
                                        .attr('fill', '#000')
                                        .attr('font-size', 12)
                                        .attr('font-family', 'microsoft yahei')
                                        .attr('dominant-baseline', 'middle')
                                    hoverText.append('tspan').text(data.statistics[i].name)
                                        .attr('dy', 14)
                                        .attr('x', 5)
                                    hoverText.append('tspan').text(data.statistics[i].data[n-1][data.legendType]
                                        + ': ' + data.statistics[i].data[n-1].numberValue)
                                        .attr('dy', 14)
                                        .attr('x', 5)
                                    hoverRect.attr('width', function () {
                                            hoverSize = hoverText.node().getBBox();
                                            return hoverSize.width + 10;
                                        })
                                        .attr('height', hoverSize.height + 10)
                                    
                                })
                                .on('mouseleave', function () {
                                    hoverPop.remove();
                                });
                        })(i, n)
                }
            }
        }

        me.rotateWrap.select('#coxcomb-component-barwrap')
            .attr('transform', 'rotate(' + data.rotate + ',' + data.center.x + ' ' + data.center.y + ')')
        me.rotateWrap.select('#coxcomb-component-bartextwrap')
            .attr('transform', 'rotate(' + data.rotate + ',' + data.center.x + ' ' + data.center.y + ')')
    }
};


function Cluster(svg) {
    this.svg = svg;
    this.defaultOptions = {
        width: 600,
        height: 600,
        totalAngle: 360,
        rotate: 0,
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
        paddingTop: 0,
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
        legendX: 0,
        legendY: 0,
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


        console.log(params)
        this.data = Common.mix(params || {}, this.defaultOptions);
        
        this.render();
        

    },

    initData: function () {

        var w = this.data.width - this.data.paddingLeft - this.data.paddingRight;
        var h = this.data.height - this.data.paddingTop -this.data.paddingBottom;

        this.data.center = {
            x: this.data.width / 2 + Number(this.data.paddingLeft) - this.data.paddingRight, 
            y: this.data.height / 2 + Number(this.data.paddingTop) - this.data.paddingBottom
        };
        if (~~this.data.isShowTitle== 1) {
            this.data.center.y += this.data.titleHeight / 2;
            h -= this.data.titleHeight;
        }
        if (~~this.data.isShowLegend == 1) {
            if (this.data.legendPosition.indexOf('left')>-1) {
                this.data.center.x += this.data.legendWidth / 2;
                w = w - this.data.legendWidth;
            }
            else if (this.data.legendPosition.indexOf('right')>-1) {
                this.data.center.x -= this.data.legendWidth / 2;
                w = w - this.data.legendWidth;
            }
            else if (this.data.legendPosition.indexOf('bottom')>-1) {
                this.data.center.y -= this.data.legendHeight / 2;
                h -= this.data.legendHeight;
            }
            else if (this.data.legendPosition.indexOf('top')>-1) {
                this.data.center.y += this.data.legendHeight / 2;
                h -= this.data.legendHeight;
            }
        }

        var r = w > h ? h / 2 : w / 2;
        if (this.data.outerRadius === undefined || this.data.outerRadius === '') {
            this.data.outerRadius = r - this.data.labelTextPos - 3 / 2 * this.data.labelTextFontSize;
        }
        else {
            this.data.outerRadius = Number(this.data.outerRadius);
        }

        this.data.innerRadius = this.data.outerRadius * this.data.innerRadiusRatio - this.data.innerRadiusMargin;
        this.data.innerRadius = this.data.innerRadius > 0 ? this.data.innerRadius : 0;

        this.data.totalSector = this.data.statistics.length;
        this.data.barNum = this.data.legendData.length;
        this.data.sectorAngle = Common.getSectorAngle(this.data);
        this.data.scaleAngle = this.data.sectorAngle * this.data.scaleAngleRatio;
        this.data.barAngle = this.getBarAngle();
        this.data.barIntervalAngle = this.data.barAngle * this.data.barIntervalRatio;
        this.data.classIntervalAngle = this.data.barAngle * this.data.classIntervalRatio;
        this.data.maxY = this.data.maxY || Common.getMaxY(this.data.statistics);
        this.data.minY = this.data.minY || Common.getMinY(this.data.statistics);

        this.data.oriOuterRadius = this.data.outerRadius;
        this.data.oriWidth = this.data.width;
        this.data.oriHeight = this.data.height;

        this.data.oriCenterX = this.data.center.x;
        this.data.oriCenterY = this.data.center.y;

        this.data.innerTextSizeRatio = this.data.innerTextSize / this.data.width;
        this.data.scaleFontSizeRatio = this.data.scaleFontSize / this.data.width;
        this.data.labelTextFontSizeRatio = this.data.labelTextFontSize / this.data.width;
        this.data.barTextSizeRatio = this.data.barTextSize / this.data.width;
        this.data.legendFontSizeRatio = this.data.legendFontSize / this.data.width;
    },

    getBarAngle: function () {
        var data = this.data;
        //2*classIntervalRatio*barAngle + barNum*barAngle + (barNum-1)*barIntervalRatio*barAngle = sectorAngle
        return data.sectorAngle / (2 * data.classIntervalRatio + data.barNum + (data.barNum - 1) * data.barIntervalRatio);
    },



    render: function () {
        var data = this.data;
        this.svg.select('g').remove();
        this.contentWrap = this.svg.append('svg:g');
            
        this.contentWrap.append('rect')
            .attr('width', data.width)
            .attr('height', data.height)
            .attr('fill', data.backgroundColor);

        this.rotateWrap = this.contentWrap.append('g')
            .attr('id', 'my-coxcomb-component-rotate-wrap')
            

        if (~~this.data.isShowTitle == 1) {
            Common.renderTitle(this.contentWrap, this.data);
        }
        
        if (~~this.data.isShowLegend == 1) {
            this.data.legendSize = Common.renderLegend(this);
            this.data.legendHeight = this.data.legendSize.height;
            this.data.legendWidth = this.data.legendSize.width;
        }

        this.initData();

        if (this.data.borderType !== 'none') {
            Common.renderCircleBorder(this.rotateWrap, this.data);
        }
        Common.renderInnerCircle(this);
        Common.renderSectors(this.rotateWrap, this.data);
        if (~~this.data.isShowXAsix == 1) {
            Common.renderXAsix(this.rotateWrap, this.data);
        }
        if (~~this.data.isShowYText == 1) {
            Common.renderYText(this.rotateWrap, this.data);
        }

        this.renderBar();
        Common.getYAsix(this.rotateWrap, this.data);

        // this.rotateWrap.attr('transform', 'rotate(' + data.rotate + ')')
        //     .attr('transform-origin', data.center.x + ' ' + data.center.y);

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
        this.data.innerRadius = this.data.outerRadius * this.data.innerRadiusRatio - this.data.innerRadiusMargin;
        this.data.innerRadius = this.data.innerRadius > 0 ? this.data.innerRadius : 0;
        this.data.center.x = this.data.oriCenterX + diffW / 2;
        this.data.center.y = this.data.oriCenterY + diffH / 2;

        this.data.innerTextSize = this.data.innerTextSizeRatio * this.data.width;
        this.data.scaleFontSize = this.data.scaleFontSizeRatio * this.data.width;
        this.data.labelTextFontSize = this.data.labelTextFontSizeRatio * this.data.width;
        this.data.barTextSize = this.data.barTextSizeRatio * this.data.width;
        this.data.legendFontSize = this.data.legendFontSizeRatio * this.data.width;
        this.render();
    },

    renderBar: function () {
        var data = this.data;
        var me = this;
        var arc = d3.arc();
        this.rotateWrap.append('g').attr('id', 'coxcomb-component-barwrap');
        this.rotateWrap.append('g').attr('id', 'coxcomb-component-bartextwrap');
        var startV = {};
        var s, e, barOuterR, arcLength, b;
        var hoverPop, color, hoverRect, hoverSize, hoverText;

        for (var i = 0; i < data.totalSector; i++) {
            var startAngle = data.scaleAngle / 2 + i * data.sectorAngle;
            var endAngle = startAngle + data.sectorAngle;
     
            var avg = (data.outerRadius - data.innerRadius) / (data.maxY - data.minY);
            for (var n = 1; n <= data.barNum; n++) {
                if (data.statistics[i].data[n-1].numberValue == undefined) {
                    continue;
                }
                s = startAngle + data.classIntervalAngle + (n-1) * data.barAngle + (n-1) * data.barIntervalAngle;
                e = s + data.barAngle;
                barOuterR = data.statistics[i].data[n-1].numberValue - data.minY > 0 
                    ? (data.statistics[i].data[n-1].numberValue - data.minY) * avg + data.innerRadius
                    : data.innerRadius + data.innerRadiusMargin;
                arcLength = 2 * Math.PI * barOuterR * data.barAngle / 360;

                fillColor = data.legendColor[data.legendData.indexOf(data.statistics[i].data[n-1][data.legendType])];
                color = color = d3.rgb(fillColor);
                data.statistics[i].data[n-1].tipBg = d3.rgb(
                        Math.round(color.r + 0.8*(255-color.r)),
                        Math.round(color.g + 0.8*(255-color.g)),
                        Math.round(color.b + 0.8*(255-color.b))
                    )
                var arcD = arc({
                    innerRadius: data.innerRadius + data.innerRadiusMargin,
                    outerRadius: barOuterR,
                    startAngle: s / 180 * Math.PI,
                    endAngle: e / 180 * Math.PI
                });
                (function (i, n) {
                    
                    me.rotateWrap.select('#coxcomb-component-barwrap').append('path')
                        .attr('d', arcD)
                        .attr('id', 'coxcomb-bar-text-path-' + i + '-' + n)
                        .attr('transform', 'translate(' + data.center.x + ',' + data.center.y + ')')
                        .attr('fill', fillColor)
                        .attr('data-start', function () {
                            startV = d3.select(this).node().getPointAtLength(0);
                        })
                        .on('mouseenter', function () {
                            hoverPop = me.rotateWrap.append('g')
                                .attr('transform', 'translate(' + d3.event.offsetX + ',' + d3.event.offsetY + ')')
                            hoverRect = hoverPop.append('rect')
                                .attr('x', 0)
                                .attr('y', 0)
                                .attr('rx', 3)
                                .attr('ry', 3)
                                .attr('fill', data.statistics[i].data[n-1].tipBg)
                            hoverText = hoverPop.append('text')
                                .attr('fill', '#000')
                                .attr('font-size', 12)
                                .attr('font-family', 'microsoft yahei')
                                .attr('dominant-baseline', 'middle')
                            hoverText.append('tspan').text(data.statistics[i].name)
                                .attr('dy', 14)
                                .attr('x', 5)
                            hoverText.append('tspan').text(data.statistics[i].data[n-1][data.legendType]
                                + ': ' + data.statistics[i].data[n-1].numberValue)
                                .attr('dy', 14)
                                .attr('x', 5)
                            hoverRect.attr('width', function () {
                                    hoverSize = hoverText.node().getBBox();
                                    return hoverSize.width + 10;
                                })
                                .attr('height', hoverSize.height + 10)
                            
                        })
                        .on('mouseleave', function () {
                            hoverPop.remove();
                        });
                })(i, n);
                var direction = 1;
                if (s > 90 && s < 270) {
                    direction =2;
                }
                if (~~this.data.isShowBarNum == 1) {
                    (function (i, n) {
                        me.rotateWrap.select('#coxcomb-component-bartextwrap').append('g')
                            .attr('transform', function () {
                                var rotateAngle = data.scaleAngle / 2 + i * data.sectorAngle
                                    + data.classIntervalAngle + (n-1) * data.barAngle
                                    + (n-1) * data.barIntervalAngle;
                                if (direction == 2) {
                                    rotateAngle = rotateAngle + 180;
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
                            .attr('font-size', data.barTextSize)
                            .attr('transform', function () {
                                if (data.rotate == 180) {
                                    b = d3.select(this).node().getBBox();
                                    return 'rotate(180,' + (b.x + b.width/2) + ' ' + (b.y+ b.height/2) + ')'
                                }
                            })
                            .on('mouseenter', function () {
                                hoverPop = me.rotateWrap.append('g')
                                    .attr('transform', 'translate(' + d3.event.offsetX + ',' + d3.event.offsetY + ')')
                                hoverRect = hoverPop.append('rect')
                                    .attr('x', 0)
                                    .attr('y', 0)
                                    .attr('rx', 3)
                                    .attr('ry', 3)
                                    .attr('fill', data.statistics[i].data[n-1].tipBg)
                                hoverText = hoverPop.append('text')
                                    .attr('fill', '#000')
                                    .attr('font-size', 12)
                                    .attr('font-family', 'microsoft yahei')
                                    .attr('dominant-baseline', 'middle')
                                hoverText.append('tspan').text(data.statistics[i].name)
                                    .attr('dy', 14)
                                    .attr('x', 5)
                                hoverText.append('tspan').text(data.statistics[i].data[n-1][data.legendType]
                                    + ': ' + data.statistics[i].data[n-1].numberValue)
                                    .attr('dy', 14)
                                    .attr('x', 5)
                                hoverRect.attr('width', function () {
                                        hoverSize = hoverText.node().getBBox();
                                        return hoverSize.width + 10;
                                    })
                                    .attr('height', hoverSize.height + 10)
                                
                            })
                            .on('mouseleave', function () {
                                hoverPop.remove();
                            });
                    })(i, n)
                    
                }
            }
        }

        me.rotateWrap.select('#coxcomb-component-barwrap')
            .attr('transform', 'rotate(' + data.rotate + ',' + data.center.x + ' ' + data.center.y + ')')
        me.rotateWrap.select('#coxcomb-component-bartextwrap')
            .attr('transform', 'rotate(' + data.rotate + ',' + data.center.x + ' ' + data.center.y + ')')
    }
};

