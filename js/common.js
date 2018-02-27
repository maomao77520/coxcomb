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

    getMinY: function (data) {
        if (data.length <= 0 || data[0].data.length <= 0 || data[0].data[0].numberValue === undefined) {
            return 0;
        }
        var min = data[0].data[0].numberValue;
        for (var i = 0; i < data.length; i++) {
            for (var n = 0; n < data[i].data.length; n++) {
                if (data[i].data[n].numberValue  < min) {
                    min = data[i].data[n].numberValue;
                }
            }
        }
        return Math.floor(min / 50) * 50;
    },

	// 计算每个扇形的角度
	getSectorAngle: function (data) {
        // totalSector*x + scaleAngleRatio * x = 360;
        var temp = data.totalAngle / (data.totalSector + Number(data.scaleAngleRatio));
        return temp;
    },

    // 计算x轴（圆环轴）刻度（半径）
    getXAsix: function () {
        var len = data.scaleNum - 2;
        var interval = (data.outerRadius - data.innerRadius) / (len + 1);
        contentWrap.append('g').attr('id', 'coxcomb-component-xasix')
        for (var i = 1; i <= len; i++) {
            this.renderXAsix(interval * i + data.innerRadius);
        }
    },
    // 根据角度渲染圆环轴刻度线
    renderXAsix: function (contentWrap, data) {
        var me = this;
        var len = data.scaleNum - 2;
        var interval = (data.outerRadius - data.innerRadius) / (len + 1);
        contentWrap.append('g').attr('id', 'coxcomb-component-xasix-wrap');
        var d, r;
        for (var i = 1; i <= len; i++) {
            r = interval * i + data.innerRadius;
            d = d3.arc()({
	            innerRadius: 0,
	            outerRadius: r,
	            startAngle: data.scaleAngle / 2 / 180 * Math.PI,
	            endAngle: (data.totalAngle-data.scaleAngle / 2) / 180 * Math.PI
	        });
	        contentWrap.select('#coxcomb-component-xasix-wrap').append('path')
	        .attr('d', d.split('L')[0])
	        .attr('transform', function () {
                return 'translate(' + data.center.x + ',' + data.center.y + ') rotate('
                   + data.rotate + ')'
            })
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
        contentWrap.append('g').attr('id', 'coxcomb-component-yasix')
        for (var i = 0; i <= data.totalSector; i++) {
            preV.x = startV2.x;
            preV.y = startV2.y;
            vAngle1 = data.scaleAngle / 2 + data.sectorAngle * i;
            startV1.x = data.center.x + data.innerRadius * Math.sin(vAngle1 / 180 * Math.PI);
            startV1.y = data.center.y - data.innerRadius * Math.cos(vAngle1 / 180 * Math.PI);
            startV2.x = data.center.x + (data.outerRadius + data.labelTextPos) * Math.sin(vAngle1 / 180 * Math.PI);
            startV2.y = data.center.y - (data.outerRadius + data.labelTextPos) * Math.cos(vAngle1 / 180 * Math.PI);
            if (~~data.isShowYAsix == 1) {
                this.renderYAsix(contentWrap, data, startV1, startV2);
            }

            if (i > 0 && ~~data.isShowLabel == 1) {
                this.renderLabelText(contentWrap, data, preV, startV2, i-1);
            }
        }
    },
     // 两点连线渲染放射线轴刻度线
    renderYAsix: function (contentWrap, data, v1, v2) {
        var d = 'M ' + v1.x + ' ' + v1.y + ' L ' + v2.x + ' ' + v2.y;

        contentWrap.select('#coxcomb-component-yasix').append('path')
	        .attr('d', d)
	        .attr('stroke', data.scaleColor)
	        .attr('fill', 'none')
            .attr('transform', function () {
                return 'rotate(' + data.rotate + ',' + data.center.x + ' ' + data.center.y + ')'
            })
    },

    renderLabelText: function (contentWrap, data, v1, v2, i) {
        var direction = 1;
        var d = 'M' + v1.x + ' ' + v1.y + ' A ' + data.outerRadius + ' ' + data.outerRadius
            + ',0,0,1,' + v2.x + ',' + v2.y;
    
        if (data.rotate != 180 && (Math.abs(v1.y-v2.y) / 2 + Math.min(v1.y, v2.y)) >= data.center.y) {
            d = 'M' + v2.x + ' ' + v2.y + ' A ' + data.outerRadius + ' ' + data.outerRadius
                + ',0,0,0,' + v1.x + ',' + v1.y;
            direction = 2;
        }

         if (data.rotate == 180 && (Math.abs(v1.y-v2.y) / 2 + Math.min(v1.y, v2.y)) <= data.center.y) {
            d = 'M' + v2.x + ' ' + v2.y + ' A ' + data.outerRadius + ' ' + data.outerRadius
                + ',0,0,0,' + v1.x + ',' + v1.y;
            direction = 2;
        }

        var outertext = contentWrap.append('g').attr('id', 'coxcomb-component-outertext');
        
        contentWrap.select('#coxcomb-component-outertext')
            .append('defs')
            .append('path')
            .attr('d', d)
            .attr('id', 'coxcomb-text-path-' + i)

        contentWrap.select('#coxcomb-component-outertext').append('text')
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
                var textLength = d3.select(this).node().getComputedTextLength()
                var pathLength = d3.select('#coxcomb-text-path-' + i).node().getTotalLength();
                return (pathLength - textLength) / 2;
            })


        outertext.attr('transform', function () {
            return 'rotate(' + data.rotate
            + ',' + data.center.x + ' ' + data.center.y + ')'
        }) 

    },

    // 渲染圆环轴刻度文字
    renderYText: function (contentWrap, data) {
        var scaleLen = (data.outerRadius - data.innerRadius) / (data.scaleNum - 1);
        var textInterval = (data.maxY - data.minY) / (data.scaleNum - 1);
        var x = data.center.x;
        var y = data.center.y - data.innerRadius;
        contentWrap.append('g').attr('id', 'coxcomb-component-ytext-wrap')
            .attr('transform', 'rotate(' + data.rotate + ',' + data.center.x + ' ' + data.center.y + ')')
        var box;
        for (var i = 0; i < data.scaleNum; i++) {
            
            contentWrap.select('#coxcomb-component-ytext-wrap').append('text')
                .attr('class', 'coxcomb-component-scale-text')
                .attr('x', x)
                .attr('y', y)
                .attr('dy', '0.1em')
                .attr('font-size', data.scaleFontSize)
                .attr('font-weight', data.scaleFontWeight)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', data.scaleFontColor)
                .text(parseInt(textInterval * i) + Number(data.minY))
                .attr('transform', function () {
                    box = d3.select(this).node().getBBox();
                    if (data.rotate % 180 == 0) {
                        return 'rotate(' + data.rotate
                        + ',' + (box.x + box.width / 2) + ' ' + (box.y + box.height/2) + ')'
                    }
                })
            y = y - scaleLen;
        }
    },

    renderLegend: function (that) {
    	var data = that.data;
        var item;
        var me = this;
        var box, item;
        var posx = data.width / 2;
        var posy = +data.paddingTop + Number(data.titleHeight);
        that.legend = that.contentWrap.append('g').attr('id', 'coxcomb-legend-wrap')
            .attr('transform', 'translate(' + posx + ',' + posy +')');

        if (data.legendPosition.indexOf('center') > -1) {
            var len = 0, b, textPos, textLength;
            var y = 0;
            for (var i = 0; i < data.legendData.length; i++) {
                item = that.legend.append('g')

                item.append('text')
                    .text(data.legendData[i])
                    .attr('dominant-baseline', 'text-before-edge')
                    .attr('fill', data.legendFontColor)
                    .attr('font-size', data.legendFontSize)
                    .attr('font-weight', data.legendFontWeight)
                    .attr('x', function () {
                        textLength = d3.select(this).node().getComputedTextLength();
                        len = len + data.legendItemWidth + data.legendTextPaddingLeft + textLength;
                        if (i !== 0 && len > data.width * 0.8) {
                            y = y + Number(data.legendFontSize) + Number(data.legendMargin);
                            len = data.legendItemWidth + data.legendTextPaddingLeft + textLength;
                        }
                        else if (i!==0) {
                            len = len + data.legendItemMargin;
                        }
                        return len - textLength;
                    })
                    .attr('y', function () {
                        b = d3.select(this).node().getBBox();
                        return y;
                    })

                item.append('rect')
                    .attr('width', data.legendItemWidth)
                    .attr('height', data.legendItemHeight)
                    .attr('fill', data.legendColor[i % data.legendColor.length])
                    .attr('x', len - data.legendItemWidth - data.legendTextPaddingLeft - textLength)
                    .attr('y', function () {
                        return y + (b.height - data.legendItemHeight) / 2;
                    });
                item.attr('transform', function () {
                    return 'translate(0,' + -d3.select(this).node().getBBox().height/2 + ')';
                })
                
            }

            var  wrapSize = d3.select('#coxcomb-legend-wrap').node().getBBox();

            that.contentWrap.select('#coxcomb-legend-wrap')
                .attr('transform', function () {
                    posx = (data.width - wrapSize.width) / 2 + Number(data.legendX);
                    if (data.legendPosition.indexOf('top') > -1) {
                        posy = posy + b.height / 2 + Number(data.legendY);
                    }
                    else {
                        posy = data.height - wrapSize.height + b.height / 2 - data.paddingBottom + Number(data.legendY)
                    }
                    return 'translate(' + posx + ',' + posy + ')';
                });
            return wrapSize;
        }
        else { 
            var y = 0, len, b, textLength, splitIndex;
            var text, maxLen=0, line=1, totalLen, res;
            for (var i = 0; i < data.legendData.length; i++) {
                item = that.legend.append('g')
                text = data.legendData[i];
                item.append('text')
                    .text(text)
                    .attr('dominant-baseline', 'text-before-edge')
                    .attr('fill', data.legendFontColor)
                    .attr('font-size', data.legendFontSize)
                    .attr('font-weight', data.legendFontWeight)
                    .attr('x', function () {
                        textLength = d3.select(this).node().getComputedTextLength();
                        len = textLength + Number(data.legendItemWidth) + Number(data.legendTextPaddingLeft)
                        b = d3.select(this).node().getBBox(); 

                        if (line === 1) {
                            res = +data.legendItemWidth + Number(data.legendTextPaddingLeft);
                            if (len > data.width * 0.5) {
                                splitIndex = (len - data.width * 0.5) / textLength * text.length
                                text = text.substring(0, text.length - Math.ceil(splitIndex))
                            }
                            if (b.height * (i + 1) > data.height - data.titleHeight) {
                                y = 0;
                                line = 2;
                                totalLen = len + maxLen + Number(data.legendItemWidth) + Number(data.legendTextPaddingLeft) + Number(data.legendItemMargin);
                                if (len + maxLen + Number(data.legendItemMargin) + Number(data.legendItemWidth) > data.width*0.5) {
                                    text = '';
                                }
                                if (totalLen > data.width * 0.5) {
                                    splitIndex = (totalLen - data.width * 0.5) / textLength * text.length
                                    text = text.substring(0, text.length - Math.ceil(splitIndex))
                                }
                                else {
                                    res = maxLen + Number(data.legendItemMargin) + Number(data.legendItemWidth) + Number(data.legendTextPaddingLeft);
                                }
                            }
                            maxLen = len > maxLen ? len : maxLen;
                            return res;
                        }
                        else {
                            res = maxLen + Number(data.legendItemMargin) + Number(data.legendItemWidth + Number(data.legendTextPaddingLeft));
                            totalLen = len + maxLen + Number(data.legendItemWidth) + Number(data.legendTextPaddingLeft) + Number(data.legendItemMargin);
                            if (len + maxLen + Number(data.legendItemMargin) + Number(data.legendItemWidth) > data.width*0.5) {
                                text = ''
                            }
                            if (totalLen > data.width * 0.5) {
                                splitIndex = (totalLen - data.width * 0.5) / textLength * text.length
                                text = text.substring(0, text.length - Math.ceil(splitIndex))
                            }
                                return res;
                        }

                    })
                    .text(text)
                    .attr('y', function () {
                        return y;
                    });
                if (text !== '') {
                    item.append('rect')
                        .attr('width', data.legendItemWidth)
                        .attr('height', data.legendItemHeight)
                        .attr('fill', data.legendColor[i % data.legendColor.length])
                        .attr('x', function () {
                            if (line == 2) {
                                return maxLen + Number(data.legendItemMargin);
                            }
                            return 0;
                        })
                        .attr('y', function () {
                            return y + (b.height - data.legendItemHeight) / 2;
                        });
                }
                
                item.attr('transform', function () {
                    return 'translate(0,' + -d3.select(this).node().getBBox().height/2 + ')';
                })
                y = y + Number(data.legendFontSize) + Number(data.legendMargin);
            }
            var  wrapSize = d3.select('#coxcomb-legend-wrap').node().getBBox();
            if (data.legendPosition.indexOf('left') > -1) {
                posx = data.paddingLeft;
            }
            else if (data.legendPosition.indexOf('right') > -1) {
                posx = data.width - wrapSize.width - data.paddingRight;
            }
            if (data.legendPosition.indexOf('middle') > -1) {
                posy = (data.height - wrapSize.height)/2;
            }
            else if (data.legendPosition.indexOf('bottom') > -1) {
                posy = data.height - wrapSize.height - data.paddingBottom;
            }

            that.contentWrap.select('#coxcomb-legend-wrap')
                .attr('transform', function () {
                    posx = +posx + Number(data.legendX);
                    posy = +posy + b.height / 2 + Number(data.legendY);
                    return 'translate(' + posx + ',' + posy + ')';
                });

            return wrapSize;            
        }
        
    },

    // 渲染每个类区域，填充渐变色
    renderSectors: function (contentWrap, data) {
        var start = 360 - data.sectorAngle / 2;
        contentWrap.append('g').attr('id', 'coxcomb-sector-wrap');
        var arc = d3.arc();
        var d = arc({
            innerRadius: data.innerRadius,
            outerRadius: data.outerRadius,
            startAngle: start / 180 * Math.PI,
            endAngle: (start + data.sectorAngle) / 180 * Math.PI
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
            var defs = contentWrap.select('#coxcomb-sector-wrap').append('defs').append('radialGradient')
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

            contentWrap.select('#coxcomb-sector-wrap').append('path')
                .attr('d', d)
                .attr('transform', 'translate(' + data.center.x + ',' + data.center.y
                    + ') rotate(' + (data.scaleAngle + (data.sectorAngle - data.scaleAngle) / 2
                    + i * data.sectorAngle + Number(data.rotate)) + ')')
                .attr('fill', 'url(#sector-lineGradient-'+ i + ')')
        }

        contentWrap.select('#coxcomb-sector-wrap').append('path')
            .attr('d', arc({
                innerRadius: data.innerRadius,
                outerRadius: data.outerRadius,
                startAngle: (360-data.scaleAngle/2) / 180 * Math.PI,
                endAngle: (360+data.scaleAngle / 2) / 180 * Math.PI
            }))
            .attr('transform', 'translate(' + data.center.x + ',' + data.center.y
                + ') rotate(' + data.rotate + ',' + data.center.x + ' ' + data.center.y + ')')
            .attr('fill', data.backgroundColor)
    },

    renderInnerCircle: function (me) {
        var data = me.data;
        me.innerCircle = me.contentWrap.append('g')
            .attr('id', 'coxcomb-inner-circle');
        me.innerCircle.append('circle')
            .attr('cx', data.center.x)
            .attr('cy', data.center.y)
            .attr('r', data.innerRadius)
            .attr('fill', function () {
                return data.innerBackgound || 'none';
            });
        me.innerCircle.append('text')
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

    // 渲染最外层边框
    renderCircleBorder: function (contentWrap, data) {
        contentWrap.append('circle')
            .attr('cx', data.center.x)
            .attr('cy', data.center.y)
            .attr('r', data.outerRadius)
            .attr('stroke', data.borderColor)
            .attr('stroke-width', data.borderWidth)
            .attr('fill', 'none')
            .attr('stroke-dasharray', function () {
                if (data.borderType === 'dash') {
                    return data.dasharray
                }
            })
    },

    renderTitle: function (contentWrap, data) {
        contentWrap.append('rect')
            .attr('width', data.width)
            .attr('height', data.titleHeight)
            .attr('fill', data.titleBackground)
            .attr('stroke', data.titleBorder)
        contentWrap.append('text')
            .text(data.titleContent)
            .attr('x', function () {
                if (data.titlePosition === 'left') {
                    return 0;
                }
                if (data.titlePosition === 'right') {
                    return data.width;
                }
                return data.width / 2;
            })
            .attr('fill', data.titleFontColor)
            .attr('font-size', data.titleFontSize)
            .attr('font-weight', data.titleFontWeight)
            .attr('y', function () {
                return data.titleHeight / 2 - d3.select(this).node().getBBox().height/2;
            })
            .attr('dominant-baseline', 'text-before-edge')
            .attr('text-anchor', function () {
                if (data.titlePosition === 'left') {
                    return 'start';
                }
                if (data.titlePosition === 'right') {
                    return 'end';
                }
                return 'middle';
            })
    },

    resetCenter: function (d, box) {
        var params = {
            x: 0,
            y: 0
        }
        if (d.rotate == 0) {
            return params;
        }
        var temp = Math.PI / 2 - d.rotate*Math.PI/180 - Math.atan(box.height/box.width);
        var r = Math.sqrt(box.width/2 * box.width/2 + box.height/2 * box.height/2);
        var tempL = Math.sin(temp) * r;
        var tempT = Math.cos(temp) * r;

        var t = Math.atan(box.x/box.y) - d.rotate *Math.PI/180;
        var r = Math.sqrt(box.x*box.x + box.y*box.y);
        var diffx = box.x - Math.sin(t) * r;
        var diffy = box.y - Math.cos(t) * r;        
        return {x: diffx + box.width/2 - tempL, y: diffy + box.height/2 - tempT};

    },

    sortData: function (data) {
        var d = data.statistics;
        for (var i = 0; i < d.length; i++) {
            d[i].data = d[i].data.sort(function (a, b) {
                return b.numberValue - a.numberValue;
            });
        }
    },
};