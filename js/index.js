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
        scaleAngle: 60,
        scaleNum: 4,
        scaleColor: 'rgba(25,25,25,0.5)',
        totalSector: 8,
        outerRadius: 250,
        borderColor: '#f00',
        innerRadiusRadio: 0.2,
        scaleFontSize: 14,
        scaleFontColor: 'rgba(255,255,255,0.3)',
        outerTextColor: 'rgba(255,255,255,0.3)',
        outerTextPos: 10,
        barNum: 5,
        barIntervalAngle: 3,
        barColor: ['#00f', '#0ff', '#f00', '#ff0', '#fff'],
        paddingLeft: 10,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        legendFontColor: '#aaa',
        legendFontSize: 14,
        legendWidth: 15,
        legendHeight: 15,
        legendPosition: 'topleft',
        legendHeightRatio: 0.05,
        legendWidthRatio: 0.05,
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
    {name: '测试测试', color: '#00f'},
    {name: 'series22', color: '#0ff'},
    {name: 'series333', color: '#f00'},
    {name: 'series4444', color: '#ff0'},
    {name: 'series5', color: '#fff'},
];

Chart.prototype = {
    init: function (params) {
        this.data = mix(params || {}, this.defaultOptions);
        this.contentWrap = this.svg.append('svg:g');

        var w = this.data.width - this.data.paddingLeft - this.data.paddingRight;
        var h = this.data.height - this.data.paddingTop -this.data.paddingBottom;
        this.data.outerRadius = w > h ? h / 2 : w / 2;
        this.data.outerRadius = this.data.outerRadius - 2 * this.data.outerTextPos;
console.log(this.data.outerRadius)
        this.data.innerRadius = this.data.outerRadius * this.data.innerRadiusRadio;
        this.data.center = {x: this.data.width / 2, y: this.data.height / 2};
        
        this.data.sectorAngle = (360 - this.data.scaleAngle) / this.data.totalSector;
        this.data.maxY = 200;
        this.data.minY = 0;
        // this.renderCircle();
        this.renderSectors();
        this.getXAsix();
        this.getYAsix();
        this.renderYText();
        this.renderOuterText();
        this.renderBar();

        // this.getLegendSize();
        this.renderLegend();
    },

    // 渲染最外层边框
    renderCircle: function () {
        this.circle = this.contentWrap.append('circle')
            .attr('class', 'circleWrap')
            .attr('cx', this.data.width / 2)
            .attr('cy', this.data.height / 2)
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
        var vAngle = 0;
        var vertice1 = {};
        var vertice2 = {};
        this.contentWrap.append('g').attr('id', 'yasix')
        for (var i = 0; i <= this.data.totalSector; i++) {
            vAngle = this.data.scaleAngle / 2 + this.data.sectorAngle * i;
            vertice1.x = this.data.innerRadius * Math.sin(vAngle/180*Math.PI) + this.data.center.x;
            vertice1.y = this.data.center.y - this.data.innerRadius * Math.cos(vAngle/180*Math.PI);
            vertice2.x = (this.data.outerRadius + 10) * Math.sin(vAngle/180*Math.PI) + this.data.center.x;
            vertice2.y = this.data.center.y - (this.data.outerRadius + 10) * Math.cos(vAngle/180*Math.PI);
            this.renderYAsix(vertice1, vertice2);
        }
    },

    // 根据角度渲染圆环轴刻度线
    renderXAsix: function (r) {
        var me = this
        var d = d3.arc()({
            innerRadius: 0,
            outerRadius: r,
            startAngle: me.data.scaleAngle / 2 / 180 * Math.PI,
            endAngle: (360-me.data.scaleAngle / 2) / 180 * Math.PI
        });

        var me = this;
        this.contentWrap.select('#xasix').append('path')
        .attr('d', d.split('L')[0])
        .attr('transform', 'translate(300,300)')
        .attr('stroke', this.data.scaleColor)
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
        this.contentWrap.append('g').attr('id', 'sectorwrap');
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
                .attr('id', 'text-path-' + i)
                .attr('d', d)
                .attr('transform', 'translate(300,300) rotate(' + (data.scaleAngle + (data.sectorAngle - data.scaleAngle)/2 +i*data.sectorAngle) +')')
                .attr('fill', 'url(#sector-lineGradient-'+ i + ')')
        }
    },

    // 渲染圆环轴刻度文字
    renderYText: function () {
        
        var scaleLen = (this.data.outerRadius - this.data.innerRadius) / (this.data.scaleNum - 1);
console.log(scaleLen)
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
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'text-before-edge')
                .attr('fill', this.data.scaleFontColor)
                .text(parseInt(textInterval*i))
        }
    },

    renderOuterText: function () {
        var pathLength = d3.select('#text-path-0').node().getTotalLength();
        var sectorOuterLength = 2 * Math.PI * this.data.outerRadius * this.data.sectorAngle / 360;
        this.contentWrap.append('g').attr('id', 'outertext');
        for (var i = 1; i <= this.data.totalSector; i++) {
            var angle = this.data.scaleAngle / 2 + this.data.sectorAngle * 1;
            this.contentWrap.select('#outertext').append('text')
                .attr('class', 'outer-text')
                .attr('dy', -this.data.outerTextPos)
                .append("textPath")
                .text(statistics[i-1].className)
                .attr('fill', this.data.outerTextColor)
                .attr('text-anchor', 'start')
                .attr('xlink:href', '#text-path-' + (i-1))
                .attr('transform', 'rotate(180)')
                .attr('startOffset', function () {
                    var box = d3.select(this).node().getBBox();
                    var w = box.width * Math.sin(angle/180*Math.PI)
                    return (sectorOuterLength - w) / 2 / pathLength * 100 + '%'
                })
        }     
    },

    renderBar: function () {
        var data =this.data;
        var me = this;
        var arc = d3.arc();
        this.contentWrap.append('g').attr('id', 'barwrap');
        for (var i = 0; i < data.totalSector; i++) {
            var startAngle = data.scaleAngle / 2 + i * data.sectorAngle;
            var endAngle = startAngle + data.sectorAngle;
            var barAngle = (data.sectorAngle - data.barIntervalAngle * (data.barNum + 1)) / data.barNum;
            var lineScale = d3.scaleLinear()
                .domain([1, data.barNum])
                .range([startAngle + data.barIntervalAngle, endAngle - barAngle - data.barIntervalAngle]);
     
            var avg = (data.outerRadius - data.innerRadius) / data.maxY;
            for (var n = 1; n <= data.barNum; n++) {
                var s = lineScale(n);
                var e = s + barAngle;
                var arcD = arc({
                    innerRadius: data.innerRadius + 4,
                    outerRadius: statistics[i].data[n-1] * avg + data.innerRadius,
                    startAngle: s/180*Math.PI,
                    endAngle: e/180*Math.PI
                });
                this.contentWrap.select('#barwrap').append('path')
                    .attr('d', arcD)
                    .attr('transform', 'translate(300,300)')
                    .attr('fill', data.barColor[n - 1]);
            }
        }  
    },

    renderLegend: function () {
        var data =this.data;
        this.legend = this.contentWrap.append('g').attr('id', 'legendwrap');
        var item;
        var me = this;
        var box;
        var pos;
        for (var i = 0; i < legendData.length; i++) {
            item = this.legend.append('g')
                .attr('text-anchor', 'start')
                .attr('transform', 'translate(0, ' + (data.legendHeight + 5) * i + ')');

            item.append('text')
                .text(legendData[i].name)
                .attr('x', function () {
                    box = d3.select(this).node().getBBox();
                    pos = me.getLegendPosition(box);
                    return pos.x + data.legendWidth + 5;
                })
                // .attr('x', data.paddingLeft + data.legendWidth + 5)
                .attr('y', data.paddingTop + (data.legendHeight - data.legendFontSize) / 2)
                .attr('dy', '0.5em')
                .attr('dominant-baseline', 'middle')
                .attr('fill', data.legendFontColor)
                .attr('font-size', data.legendFontSize)
            item.append('rect')
                .attr('width', data.legendWidth)
                .attr('height', data.legendHeight)
                .attr('x', pos.x)
                // .attr('x', data.paddingLeft)
                .attr('y', data.paddingTop)
                .attr('fill', legendData[i].color)
        }
    },

    getLegendPosition: function (box) {
        var data = this.data;
        var pos = data.legendPosition;
        var res = {
            x: data.paddingLeft,
            y: data.paddingTop
        };
        switch (pos) {
            case 'topleft':
                break;
            case 'topcenter':
                res.x = data.width / 2 - box.width / 2;
                break;
            case 'topright':
                res.x = data.width - box.width - data.paddingRight - data.legendWidth - 5;
                break;
            case 'middleleft':
                // res.y = 
            case 'middleright':
            case 'bottomleft':
            case 'bottomcenter':
            case 'bottomright':
        }
        return res;
    },
};