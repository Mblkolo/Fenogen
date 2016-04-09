window.onload = function () {
    var el = document.getElementById("pane");
    var context = el.getContext("2d");
    var width = el.width;
    var height = el.height;
    // context.strokeRect(0, 0, width, height);
    var g = new Generator(10, 50);
    var r = new Render(g, context);
    r.draw();
};
var HubType;
(function (HubType) {
    HubType[HubType["LL"] = 0] = "LL";
    HubType[HubType["LR"] = 1] = "LR";
    HubType[HubType["RL"] = 2] = "RL";
    HubType[HubType["RR"] = 3] = "RR";
})(HubType || (HubType = {}));
var Render = (function () {
    function Render(generator, context) {
        this._generator = generator;
        this._context = context;
    }
    Render.prototype.draw = function () {
        this._context.lineWidth = 2;
        var h = this._generator.height;
        for (var y = 0; y < h; ++y) {
            var w = this._generator.getRowWidht(y);
            var offset = (y % 2) * 6;
            for (var x = 0; x < w; ++x) {
                this._context.strokeRect(x * 12 + offset, y * 5, 6, 10);
            }
        }
    };
    return Render;
}());
var Generator = (function () {
    function Generator(width, heigth) {
        this.width = width;
        this.height = heigth;
        this._createField();
    }
    Generator.prototype.getHubType = function (x, y) {
        this._validatePositon(x, y);
        return this._field[y][x];
    };
    Generator.prototype.setHubType = function (x, y, hubType) {
        this._validatePositon(x, y);
        this._field[y][x] = hubType;
    };
    Generator.prototype.getRowWidht = function (y) {
        if (y % 2 === 0) {
            return this.width;
        }
        return this.width - 1;
    };
    Generator.prototype._validatePositon = function (x, y) {
        if (x < 0 || x >= this.getRowWidht(y)) {
            throw new Error("Неверное задана ширина x");
        }
        if (y < 0 || y >= this.height) {
            throw new Error("Неверное задана высота y");
        }
    };
    Generator.prototype._createField = function () {
        this._field = [];
        for (var y = 0; y < this.height; ++y) {
            this._field.push([]);
            var width = this.getRowWidht(y);
            for (var x = 0; x < width; ++x) {
                this._field[y].push(HubType.LL);
            }
        }
    };
    return Generator;
}());
//# sourceMappingURL=app.js.map