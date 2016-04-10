window.onload = function () {
    var el = document.getElementById("pane");
    var context = el.getContext("2d");
    var width = el.width;
    var height = el.height;
    // context.strokeRect(0, 0, width, height);
    var g = new Generator(12, 10);
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
        this._step = 31;
        this._generator = generator;
        this._context = context;
    }
    Render.prototype.draw = function () {
        // const cw = 16;
        // const ch = 30;
        this._context.translate(0.5, 0.5);
        var h = this._generator.height;
        var w = this._generator.width;
        for (var y = 0; y < h; ++y) {
            for (var x = 0; x < w; ++x) {
                if ((x + y) % 2 === 1) {
                    continue;
                }
                this._drawThreads(x, y);
                this._drawHub(x, y);
            }
        }
    };
    Render.prototype._drawThreads = function (x, y) {
        var ctx = this._context;
        var step = this._step;
        var size = 6;
        var y1 = y + 1;
        var x1 = x + 1;
        var x_1 = x - 1;
        var vstep = (step);
        ctx.beginPath();
        ctx.moveTo(x * step, y * vstep - size);
        ctx.lineTo(x1 * step, y1 * vstep - size);
        ctx.lineTo(x1 * step, y1 * vstep + size);
        ctx.lineTo(x * step, y * vstep + size);
        ctx.lineTo(x * step, y * vstep - size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x * step, y * vstep - size);
        ctx.lineTo(x_1 * step, y1 * vstep - size);
        ctx.lineTo(x_1 * step, y1 * vstep + size);
        ctx.lineTo(x * step, y * vstep + size);
        ctx.lineTo(x * step, y * vstep - size);
        ctx.stroke();
        // ctx.stroke();
    };
    Render.prototype._drawHub = function (x, y) {
        var ctx = this._context;
        var step = this._step;
        var size = 6;
        ctx.fillStyle = "#fff";
        ctx.fillRect(x * step - size - 1, y * step - size * 2 - 1, size * 2 + 2, 4 * size + 2);
        ctx.strokeRect(x * step - size - 1, y * step - size * 2 - 1, size * 2 + 2, 4 * size + 2);
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