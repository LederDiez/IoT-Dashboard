(function (window, document) {

    var init = function () {

        var s, e, W, H;
        var connections = new Array();
        var nodes = new Array();
        var circles = new Array();
        var textpaths = new Array();
        var lastd = new Array();

        // Dibuja las lineas que conectan los circulos
        function drawConnector(s, x1, y1, x2, y2, name) {
                
            var line = s.line(x1, y1, x2, y2);
            line.attr({
                stroke: "#e4e4e4",
                strokeWidth: 1
            });

            var arrayElements = new Array();

            for (let i = 1; i <= 8; i++) {

                // 8 pixeles maximo
                // Circulo azul
                var id = name + i;
                var c = s.circle(x1, y1, 5).attr({
                    fill : "#ffffff00",
                    id   : id
                });

                // 125 por segundo de duracion de la animacion
                var duration = 4000;
                var delay = Math.floor(i * ((duration * 12.5) / 100));
                var tx = x2 - x1;
                var ty = y2 - y1;

                var element = document.getElementById(id);
                
                element.tx = tx;
                element.ty = ty;

                arrayElements.push(element);

            }
            return arrayElements;
        }

        // Dibuja la barra de porcentaje y su texto superior
        function drawGauge(snap, id , index, x, y) {
                
            var yt = y - 37.2;
            var d1 = "M"+x+" "+yt+" a 30 30 0 0 1 0 74.4 a 30 30 0 0 1 0 -74.4";
            var graphic = snap.path({
                path        : d1,
                stroke      : '#e0e0e0',
                fill        : '#00000000',
                strokeDasharray: '175.5, 251.2',
                strokeWidth : 17.4,
            });
            graphic.transform('r45,'+x+','+y);
            var clone = graphic.clone();
            clone.attr({
                id          : id,
                stroke      : '#9e9e9e',
                strokeDasharray : '0,251.2'
            });
            var element = document.getElementById(id);
            element.setAttribute("stroke-linecap","butt");
            element.lasV = 0;

            var d2 = "M "+(x-24)+" "+(y-24)+" c 7 -6 28 -15 48 0 z ";
            var graphic2 = snap.path({
                path        : d2,
                fill        : '#00000000',
                strokeWidth : 0
            });
            var text = s.text(0, 0,'').attr({
                id : id + "text",
                textpath: graphic2,
                fill: "gray",
                //fontSize:15
            });
            // Solo funciona en Chrome
            //text.select('textpath').node.setAttribute('startOffset', '14.5%'); // 14.5 //16.75 // 19 
            var elemen = document.getElementById(id + "text");
            textpaths[index] = elemen;

            return element;
        }

        // Draws a chart node
        function drawNode(s, x, y, color, con, id, index, image) {

            var gauge = {};

            var externalRadio = 47;
            var internalRadio = 28;
            var angulos = [0, 30, 60, 90, 120, 240, 270, 300, 330];

            var externalCircle = s.circle(x, y, externalRadio)
            externalCircle.attr({
                fill : "#FFFFFFFF",
                stroke : "#bdbdbd",
                strokeWidth : 1,
            })

            if (con) {
                gauge = drawGauge(s, id, index, x, y);
            } else {
                textpaths[id] = null;
                gauge.lasV = null;
            }

            var internalCircle = s.circle(x, y, internalRadio)
            internalCircle.attr({
                fill : color, // #616161 #00c853 #f57c00 #d50000
            })

            circles[index] = internalCircle;

            var imagen = s.image(image, x-20, y-20 , 40, 40);

            for (let i = 0; i < angulos.length; i++) {
                
                const angulo = angulos[i];

                var sin = Math.sin(angulo * (Math.PI / 180));
                var cos = Math.cos(angulo * (Math.PI / 180));

                var x2 = sin * (internalRadio) + x;
                var y2 = cos * (internalRadio) + y;
                var x3 = sin * (externalRadio - 1) + x;
                var y3 = cos * (externalRadio - 1) + y;
                var t1 = s.line(x2, y2, x3, y3);
                t1.attr({
                    stroke      : "white",
                    strokeWidth : 0.5
                });
            }
            return gauge;
        }

        // Calcula en tamaño de los curculos que se mueven
        function calculateCirclesPixels(value) {
            var pixels = value / (100 / 5);
            return pixels;
        }

        var a = {
            chart : function (c, n) {

                s = new Snap('#' + c);
                e = document.getElementById(c); // or other selector like querySelector()
                var rect = e.getBoundingClientRect(); // get the bounding rectangle
                W = rect.width;
                H = rect.height;

                for (let i = 0; i < n.length; i++) {

                    var nodeX = (W*n[i].position.x)/100;
                    var nodeY = (H*n[i].position.y)/100;
                    if (n[i].connection != null) {
                        var connX = (W*n[i].connection.x)/100;
                        var connY = (H*n[i].connection.y)/100;
                        connections[i] = drawConnector(s, nodeX, nodeY, connX, connY, "ball"+nodeX+nodeY+connX+connY);
                    }
                }

                for (let i = 0; i < n.length; i++) {
                    var nodeX = (W*n[i].position.x)/100;
                    var nodeY = (H*n[i].position.y)/100;
                    nodes[i] = drawNode(s, nodeX, nodeY, n[i].color, n[i].gauge, "gauge"+nodeX+nodeY, i, n[i].image);
                }

                return this;
            },
            updateNode : function (id, v, d, c, r = 0, nc = "#616161") { // id valor "direccion color radio" (circulos) color (centro)
                
                var t = 4000;

                for (let i = 0; i < connections[id].length; i++) {
                    const element = connections[id][i];
                    var tx = element.tx;
                    var ty = element.ty;
                    var delay = Math.floor(i * ((t * 12.5) / 100));
                    
                    var array = new Array();
                    
                    if (lastd[id] != null) {
                        array = lastd[id];
                    }

                    if (array[i] != d) {
                        element.setAttribute("r", calculateCirclesPixels(r))
                        element.setAttribute("fill", c);
                        if (d == 1) {
                            element.animate([
                                {   // from
                                    transform : 'translate(0px, 0px)'
                                },
                                {   // to
                                    transform : 'translate('+tx+'px, '+ty+'px)'
                                }
                            ], {
                                delay     : delay,
                                duration  : t,
                                iterations: Infinity
                            });
                        } else if (d == 0) {
                            element.animate([
                                {   // from
                                    transform : 'translate('+tx+'px, '+ty+'px)'
                                },
                                {   // to
                                    transform : 'translate(0px, 0px)'
                                }
                            ], {
                                delay     : delay,
                                duration  : t,
                                iterations: Infinity
                            });
                        } else {
                            element.animate([], {});
                        }
                        array[i] = d
                    }
                    lastd[id] = array;
                }

                circles[id].attr({
                    fill : nc, // #616161 #00c853 #f57c00 #d50000
                })

                if (textpaths[id] != null) {
                    textpaths[id].childNodes[0].innerHTML = Math.round(v) + "%"
                    textpaths[id].childNodes[0].setAttribute('startOffset', '14.5%');
                }
                
                if (nodes[id].lasV != null) {
                    var lasV = nodes[id].lasV;
                    var gauge = s.select('#' + nodes[id].id);
                    v = (175.5 * v)/100;
                    Snap.animate(lasV, v, function( value ) {
                        gauge.attr({
                            strokeDasharray : value+',251.2'
                        });
                    }, 500);
                    nodes[id].lasV = v;
                }
            },
        }
        return a;
    }();

    window.ConnectionGraph = init;
    
})(window, document);