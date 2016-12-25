angular.module('myApp')
.factory('Rhombus',['$log', function ($log) {

    function Rhombus(side, rows, columns, unit) {
        var rotate = '45deg';

        var self = this;

        this.unit = unit || 'px';
        this.side = side;
        this.rows = rows;
        this.columns = columns;

        this.wiper = {
            "font-size": this.side / 3 + this.unit,
            "width": this.side - 1 + this.unit,
            "height": this.side - 1 + this.unit,
            "display": "inline-block",
            "color": "#ff0000",
            "padding-top": "0"
        };

        this.cellsHeadStyles = function (index, head) {
            var style = {
                "font-size": "5px",
                "display": "inline-block",
                "border": "1px solid #000",
                "text-align": "center",
                "width": this.side + this.unit,
                "height": this.side + this.unit
            };
            if ( ( index % 2 == 1 ) || ( index == 0) ){
                //false odd
                if(head == 'column')
                    style['width'] = ( (this.side * Math.SQRT2) - this.side) + this.unit;
                else if (head == 'row')
                    style['height'] = ( (this.side * Math.SQRT2) - this.side) + this.unit;
                return style;
            }else{
                //true even
                return style;
            }
        };

        this.wrapper = function (overflow) {
            return {
                "position": "relative",
                "overflow": overflow || "hidden",
                "height": this.side * this.columns + this.unit
            };
        };

        this.containerStyles = function (display, obj) {
            var styles = {"display": display || "inline-block"};
            if (obj)
                for (var key in obj)
                    styles[key] = obj[key];
            return styles;
        };

        this.gridRight = {
            "display": "flex",
            "width": this.side * this.columns + this.side + this.unit,
            "overflow": "hidden"
        };


        /**
         *
         * @param index integer
         * @returns {display: string, margin-left: string}
         */
        this.rowStyles = function (index) {
            var styles = {"display": "flex", "margin-left": -2 + this.unit};
            if(index % 2 == 0) styles["margin-left"] = Math.ceil( (this.side * Math.SQRT1_2 + 1) ) * -1 + this.unit;
            return styles;
        };
        this.cellStyles = function (color) {
            return {
                "display": "inline-block",
                "transform": "rotate(" + rotate + ")",
                "margin":  this.side / 5 + this.unit,
                "margin-top": (this.side / 2) * -1 + this.unit,
                "border": "1px solid #000",
                "width": this.side + this.unit,
                "height": this.side + this.unit,
                "background-color": color || ''
            };
        };
        this.cellInnerStyles = {
            "transform": "rotate(-" + rotate + ")",
            "position": "absolute",
            "top": 0,
            "left": 0,
            "width": "100%",
            "height": "100%"
        };
    }
    return Rhombus;

}]);
