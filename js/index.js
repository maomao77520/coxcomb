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
        scaleAngle: 30,
        scaleNum: 4,
        scaleColor: 'rgba(25,25,25,0.5)',
        totalSector: 8,
        outerRadius: 250,
        borderColor: '#f00',
        innerRadiusRadio: 0.2,
        scaleFontSize: 14,
        scaleFontColor: 'rgba(255,255,255,0.3)',
        outerTextColor: 'rgba(255,255,255,0.3)',
        barNum: 5,
        barIntervalAngle: 3,
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

Chart.prototype = {
    init: function (params) {
        this.data = mix(params || {}, this.defaultOptions);
        this.contentWrap = this.svg.append('svg:g');
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
        for (var i = 1; i <= len; i++) {
            this.renderXAsix(interval * i + this.data.innerRadius);
        }
    },

    // 计算y轴（放射线轴）刻度（终点坐标）
    getYAsix: function () {
        var vAngle = 0;
        var vertice1 = {};
        var vertice2 = {};
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
        this.contentWrap.append('path')
        .attr('d', d.split('L')[0])
        .attr('transform', 'translate(300,300)')
        .attr('stroke', this.data.scaleColor)
        .attr('fill', 'none')
    },

    // 两点连线渲染放射线轴刻度线
    renderYAsix: function (v1, v2) {
        var data = this.data;
        var d = 'M ' + v1.x + ' ' + v1.y + ' L ' + v2.x + ' ' + v2.y;
        console.log(d)
        this.contentWrap.append('path')
        .attr('d', d)
        .attr('stroke', this.data.scaleColor)
        .attr('fill', 'none')
    },

    // 渲染每个类区域，填充渐变色
    renderSectors: function () {
        var data = this.data;
        var start = data.scaleAngle / 2
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
            var defs = this.contentWrap.append('defs').append('linearGradient')
                .attr('id', 'sector-lineGradient-' + i)
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '0%')
                .attr('y2', '100%')
                .attr('gradientTransform', 'rotate(' + data.scaleAngle / 2 + ')')
                .selectAll('stop')
                .data(gradientData)
                .enter()
                .append('stop')
                .attr('offset', function (d) {return d.offset})
                .attr('stop-color', function (d) {return d.stopColor})

            this.contentWrap.append('path')
                .attr('id', 'text-path-' + i)
                .attr('d', d)
                .attr('transform', 'translate(300,300) rotate(' + i*data.sectorAngle +')')
                .attr('fill', 'url(#sector-lineGradient-'+ i + ')')
        }
    },

    // 渲染圆环轴刻度文字
    renderYText: function () {
        
        var scaleLen = (this.data.outerRadius - this.data.innerRadius) / (this.data.scaleNum - 1);
        var textInterval = this.data.maxY / (this.data.scaleNum - 1);
        var x = this.data.center.x;
        var y = this.data.center.y - this.data.innerRadius;
        for (var i = 1; i < this.data.scaleNum; i++) {
            y = y - scaleLen;
            this.contentWrap.append('text')
                .attr('class', 'scale-text')
                .attr('x', x)
                .attr('y', y)
                .attr('font-size', this.data.scaleFontSize)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', this.data.scaleFontColor)
                .text(parseInt(textInterval*i))
        }
    },

    renderOuterText: function () {
        var pathLength = d3.select('#text-path-0').node().getTotalLength();
        var sectorOuterLength = 2 * Math.PI * this.data.outerRadius * this.data.sectorAngle / 360;
        console.log(pathLength, sectorOuterLength)
        for (var i = 1; i <= this.data.totalSector; i++) {
            var angle = this.data.scaleAngle / 2 + this.data.sectorAngle * 1;
            this.contentWrap.append('text')
                .attr('class', 'outer-text')
                .attr('dy', -10)
                .append("textPath")
                .text(statistics[i-1].className)
                .attr('fill', this.data.outerTextColor)
                .attr('text-anchor', 'start')
                .attr('xlink:href', '#text-path-' + (i-1))
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
                this.contentWrap.append('path')
                    .attr('d', arcD)
                    .attr('transform', 'translate(300,300)')
                    .attr('fill', statistics[i].barColor)
            }
        }
        
    },
};