/*
 Highstock JS v9.2.2 (2021-08-24)

 Indicator series type for Highcharts Stock

 (c) 2010-2021 Wojciech Chmiel

 License: www.highcharts.com/license
*/
'use strict';(function(a){"object"===typeof module&&module.exports?(a["default"]=a,module.exports=a):"function"===typeof define&&define.amd?define("highcharts/indicators/chaikin",["highcharts","highcharts/modules/stock"],function(e){a(e);a.Highcharts=e;return a}):a("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(a){function e(a,b,f,r){a.hasOwnProperty(b)||(a[b]=r.apply(null,f))}a=a?a._modules:{};e(a,"Mixins/IndicatorRequired.js",[a["Core/Utilities.js"]],function(a){var b=a.error;return{isParentLoaded:function(a,
r,n,e,h){if(a)return e?e(a):!0;b(h||this.generateMessage(n,r));return!1},generateMessage:function(a,b){return'Error: "'+a+'" indicator type requires "'+b+'" indicator loaded before. Please read docs: https://api.highcharts.com/highstock/plotOptions.'+a}}});e(a,"Stock/Indicators/AD/ADIndicator.js",[a["Core/Series/SeriesRegistry.js"],a["Core/Utilities.js"]],function(a,b){var f=this&&this.__extends||function(){var a=function(b,p){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,d){a.__proto__=
d}||function(a,d){for(var c in d)d.hasOwnProperty(c)&&(a[c]=d[c])};return a(b,p)};return function(b,p){function q(){this.constructor=b}a(b,p);b.prototype=null===p?Object.create(p):(q.prototype=p.prototype,new q)}}(),e=a.seriesTypes.sma,n=b.error,t=b.extend,h=b.merge;b=function(a){function b(){var b=null!==a&&a.apply(this,arguments)||this;b.data=void 0;b.options=void 0;b.points=void 0;return b}f(b,a);b.populateAverage=function(a,b,d,c,g){g=b[c][1];var k=b[c][2];b=b[c][3];d=d[c];return[a[c],b===g&&
b===k||g===k?0:(2*b-k-g)/(g-k)*d]};b.prototype.getValues=function(a,q){var d=q.period,c=a.xData,g=a.yData,k=q.volumeSeriesID,m=a.chart.get(k);q=m&&m.yData;var e=g?g.length:0,f=[],h=[],l=[];if(!(c.length<=d&&e&&4!==g[0].length)){if(m){for(k=d;k<e;k++)a=f.length,m=b.populateAverage(c,g,q,k,d),0<a&&(m[1]+=f[a-1][1]),f.push(m),h.push(m[0]),l.push(m[1]);return{values:f,xData:h,yData:l}}n("Series "+k+" not found! Check `volumeSeriesID`.",!0,a.chart)}};b.defaultOptions=h(e.defaultOptions,{params:{index:void 0,
volumeSeriesID:"volume"}});return b}(e);t(b.prototype,{nameComponents:!1,nameBase:"Accumulation/Distribution"});a.registerSeriesType("ad",b);"";return b});e(a,"Stock/Indicators/Chaikin/ChaikinIndicator.js",[a["Mixins/IndicatorRequired.js"],a["Core/Series/SeriesRegistry.js"],a["Core/Utilities.js"]],function(a,b,f){var e=this&&this.__extends||function(){var a=function(b,c){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,b){a.__proto__=b}||function(a,b){for(var c in b)b.hasOwnProperty(c)&&
(a[c]=b[c])};return a(b,c)};return function(b,c){function g(){this.constructor=b}a(b,c);b.prototype=null===c?Object.create(c):(g.prototype=c.prototype,new g)}}(),n=b.seriesTypes,t=n.ad,h=n.ema,v=f.correctFloat;n=f.extend;var u=f.merge,p=f.error;f=function(b){function d(){var a=null!==b&&b.apply(this,arguments)||this;a.data=void 0;a.options=void 0;a.points=void 0;return a}e(d,b);d.prototype.init=function(){var b=arguments,g=this;a.isParentLoaded(h,"ema",g.type,function(a){a.prototype.init.apply(g,
b)})};d.prototype.getValues=function(a,b){var c=b.periods,d=b.period,e=[],f=[],g=[],l;if(2!==c.length||c[1]<=c[0])p('Error: "Chaikin requires two periods. Notice, first period should be lower than the second one."');else if(b=t.prototype.getValues.call(this,a,{volumeSeriesID:b.volumeSeriesID,period:d}))if(a=h.prototype.getValues.call(this,b,{period:c[0]}),b=h.prototype.getValues.call(this,b,{period:c[1]}),a&&b){c=c[1]-c[0];for(l=0;l<b.yData.length;l++)d=v(a.yData[l+c]-b.yData[l]),e.push([b.xData[l],
d]),f.push(b.xData[l]),g.push(d);return{values:e,xData:f,yData:g}}};d.defaultOptions=u(h.defaultOptions,{params:{index:void 0,volumeSeriesID:"volume",period:9,periods:[3,10]}});return d}(h);n(f.prototype,{nameBase:"Chaikin Osc",nameComponents:["periods"]});b.registerSeriesType("chaikin",f);"";return f});e(a,"masters/indicators/chaikin.src.js",[],function(){})});
//# sourceMappingURL=chaikin.js.map