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
        scaleNum: 5,
        scaleColor: 'rgba(25,25,25,0.5)',
        totalSector: 10,
        outerRadius: 200,
        borderColor: '#f00',
        innerRadiusRadio: 0.3,
        scaleFontSize: 14,
        scaleFontColor: 'rgba(255,255,255,0.3)',
        outerTextColor: 'rgba(255,255,255,0.3)',
        barNum: 4,
        barIntervalAngle: 2,
    }
}


Chart.prototype = {
    
    init: function (params) {
        this.data = mix(params || {}, this.defaultOptions);
        this.contentWrap = this.svg.append('svg:g');
        this.data.innerRadius = this.data.outerRadius * this.data.innerRadiusRadio;
        this.data.center = {x: this.data.width / 2, y: this.data.height / 2};
        this.data.sectorAngle = (360 - this.data.scaleAngle) / this.data.totalSector;
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
                    stopColor: '#522366'
                },
                {
                    offset: '100%',
                    stopColor: '#362c7d'
                    // stopColor: '#fff'
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
        this.data.maxY = 200;
        this.data.minY = 0;
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
                .text(textInterval*i)
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
                .text('hello')
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
        var i = 0;
        var startAngle = data.scaleAngle / 2 + i * data.sectorAngle;
        var endAngle = startAngle + data.sectorAngle;
        var barAngle = (data.sectorAngle - data.barIntervalAngle * (data.barNum + 1)) / data.barNum;
        var lineScale = d3.scaleLinear()
            .domain([1, data.barNum])
            .range([startAngle + data.barIntervalAngle, endAngle - barAngle - data.barIntervalAngle]);

        // var v1 ={};
        // var v2 ={};

        // v1.x = data.innerRadius * Math.sin(startAngle/180*Math.PI) + data.center.x;
        // v1.y = data.center.y - data.innerRadius * Math.cos(startAngle/180*Math.PI);

        // v2.x = data.innerRadius * Math.sin(endAngle/180*Math.PI) + data.center.x;
        // v2.y = data.center.y - data.innerRadius * Math.cos(endAngle/180*Math.PI);
        // var d = 'M ' + v1.x + ' ' + v1.y + ' A ' + data.innerRadius + ' ' + data.innerRadius
        // + ',0,0,1,' + v2.x + ' ' + v2.y + '';


        // var path = this.contentWrap.append('path')
        //     .attr('d', d)
        //     .attr('stroke', '#fff')
        //     .attr('stroke-width', 2)
        //     .attr('fill', 'none');

        // var pathLength = path.node().getTotalLength();


        var statistics = [
            {tag: 1, value: 100},
            {tag: 2, value: 150},
            {tag: 3, value: 120},
            {tag: 4, value: 80}
        ];
    console.log(lineScale(2))  
        
        var arc = d3.arc()
            // .innerRadius(data.innerRadius)
            // .outerRadius(120)
            // .startAngle(16/180*Math.PI)
            // .endAngle(23/180*Math.PI)

        for (var n = 1; n <= data.barNum; n++) {
            var s = lineScale(n);
            var e = s + barAngle;
            console.log(s,e)
            var arcD = arc({
                innerRadius: data.innerRadius + 4,
                outerRadius: statistics[n-1].value,
                startAngle: s/180*Math.PI,
                endAngle: e/180*Math.PI
            });
            this.contentWrap.append('path')
                .attr('d', arcD)
                .attr('transform', 'translate(300,300)')
                .attr('fill', '#ff0')
        }





        // var N = 5;
        // var barWidth = (pathLength / N) - 1;
        // var someData = [];
        // var color = d3.scaleOrdinal(d3.schemeCategory10);
        // for (var i = 0; i < N; i++) {
        //     var currentDate = new Date();
        //     currentDate.setDate(currentDate.getDate() + i);
        //     someData.push({
        //         date: currentDate,
        //         value: Math.random(),
        //         group: currentDate.getMonth()
        //     });
        // }

        // var timeScale = d3.scaleTime()
        //     .domain(d3.extent(someData, function (d) {
        //         return d.date;
        //     }))
        //     .range([0, pathLength]);

        // var me = this;
        // svg.selectAll("rect")
        //     .data(someData)
        //     .enter()
        //     .append("rect")
        //     .attr("x", function (d, i) {

        //         var linePer = timeScale(d.date);
        //         var posOnLine = path.node().getPointAtLength(linePer);
        //         var angleOnLine = path.node().getPointAtLength(linePer - barWidth);

        //         d.linePer = linePer; // % distance are on the spiral
        //         d.x = posOnLine.x; // x postion on the spiral
        //         d.y = posOnLine.y; // y position on the spiral

        //         d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) + 180 - me.data.scaleAngle / 2; // angle at the spiral position

        //         return d.x;
        //     })
        //     .attr("y", function (d) {
        //         return d.y;
        //     })
        //     .attr("width", function (d) {
        //         return barWidth;
        //     })
        //     .attr("height", function (d) {
        //         return 30;
        //     })
        //     .style("fill", function (d) {
        //         return color(d.group);
        //     })
        //     .style("stroke", "none")
        //     .attr("transform", function (d) {
        //         return "rotate(" + d.a + "," + d.x + "," + d.y + ")"; // rotate the bar
        //     });
    },
};