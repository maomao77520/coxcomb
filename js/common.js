var Common = {
	mix: function (des, src) {
	    for (var i in src) {
	        if (! (i in des)) {
	            des[i] = src[i];
	        }
	    }
	    return des;
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
        - data.classIntervalRatio + Number(data.scaleAngleRatio);
        return 360 / temp;
    },

    // 计算x轴（圆环轴）刻度（半径）
    getXAsix: function () {
        var len = data.scaleNum - 2;
        var interval = (data.outerRadius - data.innerRadius) / (len + 1);
        contentWrap.append('g').attr('id', 'xasix')
        for (var i = 1; i <= len; i++) {
            this.renderXAsix(interval * i + data.innerRadius);
        }
    },
    // 根据角度渲染圆环轴刻度线
    renderXAsix: function (contentWrap, data) {
        var me = this;
        var len = data.scaleNum - 2;
        var interval = (data.outerRadius - data.innerRadius) / (len + 1);
        contentWrap.append('g').attr('id', 'xasix');
        var d, r;
        for (var i = 1; i <= len; i++) {
            r = interval * i + data.innerRadius;
            d = d3.arc()({
	            innerRadius: 0,
	            outerRadius: r,
	            startAngle: data.scaleAngle / 2 / 180 * Math.PI,
	            endAngle: (360-data.scaleAngle / 2) / 180 * Math.PI
	        });
	        contentWrap.select('#xasix').append('path')
	        .attr('d', d.split('L')[0])
	        .attr('transform', 'translate(' + data.center.x + ',' + data.center.y + ')')
	        .attr('stroke', data.scaleColor)
	        .attr('fill', 'none')
        }
    },

    getYAsix: function (contentWrap, data) {
        var vAngle1 = 0;
        var vAngle2 = 0;
        var startV1 = {};
        var startV2 = {};
        var endV1 = {};
        var endV2 = {};
        var preV = {};
        var len = data.classIntervalRatio ? data.totalSector-1 : data.totalSector;
        contentWrap.append('g').attr('id', 'yasix')
        for (var i = 0; i <= len; i++) {
            preV.x = startV2.x;
            preV.y = startV2.y;
            vAngle1 = data.scaleAngle / 2 + data.sectorAngle * i + i * data.classIntervalAngle;
            startV1.x = data.center.x + data.innerRadius * Math.sin(vAngle1 / 180 * Math.PI);
            startV1.y = data.center.y - data.innerRadius * Math.cos(vAngle1 / 180 * Math.PI);
            startV2.x = data.center.x + (data.outerRadius + data.labelTextPos) * Math.sin(vAngle1 / 180 * Math.PI);
            startV2.y = data.center.y - (data.outerRadius + data.labelTextPos) * Math.cos(vAngle1 / 180 * Math.PI);
            if (~~data.isShowYAsix == 1) {
                this.renderYAsix(contentWrap, data, startV1, startV2);
            }

            if (data.classIntervalRatio > 0) {
                vAngle2 = data.scaleAngle / 2 + data.sectorAngle * (i + 1) + i * data.classIntervalAngle;
                endV1.x = data.center.x + data.innerRadius * Math.sin(vAngle2 / 180 * Math.PI);
                endV1.y = data.center.y - data.innerRadius * Math.cos(vAngle2 / 180 * Math.PI);
                endV2.x = data.center.x + (data.outerRadius  + data.labelTextPos) * Math.sin(vAngle2 / 180 * Math.PI);
                endV2.y = data.center.y - (data.outerRadius + data.labelTextPos) * Math.cos(vAngle2 / 180 * Math.PI);
                if (~~data.isShowYAsix == 1) {
                    this.renderYAsix(contentWrap, data, endV1, endV2);
                }

                this.renderLabelText(contentWrap, data, startV2, endV2, i);
            }
            else if (i > 0) {
                this.renderLabelText(contentWrap, data, preV, startV2, i-1);
            }
        }
    },
     // 两点连线渲染放射线轴刻度线
    renderYAsix: function (contentWrap, data, v1, v2) {
        var d = 'M ' + v1.x + ' ' + v1.y + ' L ' + v2.x + ' ' + v2.y;

        contentWrap.select('#yasix').append('path')
	        .attr('d', d)
	        .attr('stroke', data.scaleColor)
	        .attr('fill', 'none')
    },

    renderLabelText: function (contentWrap, data, v1, v2, i) {
        var direction = 1;
        var d = 'M' + v1.x + ' ' + v1.y + ' A ' + data.outerRadius + ' ' + data.outerRadius
            + ',0,0,1,' + v2.x + ',' + v2.y;
        
        if (v1.y >= data.center.y) {
            d = 'M' + v2.x + ' ' + v2.y + ' A ' + data.outerRadius + ' ' + data.outerRadius
                + ',0,0,0,' + v1.x + ',' + v1.y;
            direction = 2;
        }
        contentWrap.append('g').attr('id', 'outertext');
        
        contentWrap.select('#outertext')
            .append('defs')
            .append('path')
            .attr('d', d)
            .attr('id', 'coxcomb-text-path-' + i);

        contentWrap.select('#outertext').append('text')
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
            .text(data.statistics[i].name)
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

    // 渲染圆环轴刻度文字
    renderYText: function (contentWrap, data) {
        var scaleLen = (data.outerRadius - data.innerRadius) / (data.scaleNum - 1);
        var textInterval = data.maxY / (data.scaleNum - 1);
        var x = data.center.x;
        var y = data.center.y - data.innerRadius;
        contentWrap.append('g').attr('id', 'ytext');
        for (var i = 1; i < data.scaleNum; i++) {
            y = y - scaleLen;
            contentWrap.select('#ytext').append('text')
                .attr('class', 'scale-text')
                .attr('x', x)
                .attr('y', y)
                .attr('font-size', data.scaleFontSize)
                .attr('font-weight', data.scaleFontWeight)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'text-before-edge')
                .attr('fill', data.scaleFontColor)
                .text(parseInt(textInterval * i))
        }
    },

    renderLegend: function (that) {
    	var data = that.data;
        var item, itemSize;
        var me = this;
        var box;
        var pos = this.getLegendPosition(that.data);
        that.legend = that.contentWrap.append('g').attr('id', 'coxcomb-legend-wrap')
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
                var item = that.legend.append('g')

                item.append('rect')
                    .attr('width', itemSize)
                    .attr('height', itemSize)
                    .attr('fill', data.legendColor[i % data.legendColor.length])
                    .attr('x', len)
                    .attr('y', y)
                    
                item.append('text')
                    .text(data.legendData[i])
                    .attr('dominant-baseline', 'middle')
                    .attr('fill', data.legendFontColor)
                    .attr('font-size', data.legendFontSize)
                    .attr('font-weight', data.legendFontWeight)
                    .attr('y', function () {
                        b = d3.select(this).node().getBBox();
                        return y + b.height/ 2 + (itemSize - b.height) / 2
                    })
                    .attr('x', function () {
                        textPos = len + itemSize + data.legendTextPaddingLeft;
                        len = textPos + b.width + data.legendItemMargin;
                        return textPos;
                    });
            }
            that.contentWrap.select('#coxcomb-legend-wrap')
                .attr('transform', function () {
                    var b = d3.select(this).node().getBBox();
                    var x = (data.width - b.width) / 2;
                    return 'translate(' + x + ',' + pos.y + ')';
                });

        }
        else {
            
            itemSize = data.legendHeight / data.legendData.length - data.legendMargin;
            that.legend
                .append('def')
                .append('path')
                // .attr('stroke', 'red')
                .attr('d', 'M ' + (itemSize + data.legendTextPaddingLeft) + ' ' + itemSize / 2
                    + ' L ' + (data.legendWidth) + ' ' + itemSize / 2)
                .attr('id', 'coxcomb-legend-text-path');

            for (var i = 0; i < data.legendData.length; i++) {
                item = that.legend.append('g')
                    .attr('text-anchor', 'start')
                    .attr('transform', 'translate(0, ' + (itemSize + data.legendMargin) * i + ')');

                item.append('text')
                    .append('textPath')
                    .attr('xlink:href', '#coxcomb-legend-text-path')
                    .text(data.legendData[i])
                    .attr('dominant-baseline', 'middle')
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

    getLegendPosition: function (data) {
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