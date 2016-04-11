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
                this._drawThreads(x, y);
            }
        }
        for (var y = 0; y < h - 1; ++y) {
            for (var x = 0; x < w - 1; ++x) {
                if ((x + y) % 2 === 1) {
                    continue;
                }
                this._drawHub(x, y);
            }
        }
    };
    Render.prototype._drawThreads = function (x, y) {
        var color = this._generator.getThreadNo(x, y);
        var ctx = this._context;
        var step = this._step;
        var size = 6;
        var y0 = (y + 0) * step - size;
        var y1 = (y + 1) * step - size;
        var y2 = (y + 1) * step + size;
        var y3 = (y + 0) * step + size;
        var x0, x1;
        if ((x + y) % 2 === 0) {
            x0 = (x + 0) * step;
            x1 = (x + 1) * step;
        }
        else {
            x0 = (x + 1) * step;
            x1 = (x + 0) * step;
        }
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x0, y3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    Render.prototype._drawHub = function (x, y) {
        var ctx = this._context;
        var step = this._step;
        var size = 6;
        ctx.fillStyle = this._generator.getHubNo(x, y);
        ctx.fillRect((x + 1) * step - size - 1, (y + 1) * step - size * 2 - 1, size * 2 + 2, 4 * size + 2);
        ctx.strokeRect((x + 1) * step - size - 1, (y + 1) * step - size * 2 - 1, size * 2 + 2, 4 * size + 2);
        var hubType = this._generator.getHubType(x, y);
        ctx.beginPath();
        if (hubType === HubType.LL && hubType === HubType.RL) {
            ctx.moveTo((x + 1) * step - (size - 2), (y + 1) * step - (size - 2));
        }
        else {
            ctx.moveTo((x + 1) * step + (size - 2), (y + 1) * step - (size - 2));
        }
        ctx.lineTo((x + 1) * step, (y + 1) * step);
        if (hubType === HubType.LL && hubType === HubType.RL) {
            ctx.lineTo((x + 1) * step - (size - 2), (y + 1) * step + (size - 2));
        }
        else {
            ctx.lineTo((x + 1) * step + (size - 2), (y + 1) * step + (size - 2));
        }
        ctx.stroke();
    };
    return Render;
}());
var Generator = (function () {
    function Generator(width, heigth) {
        this.width = width;
        this.height = heigth;
        //this._createField();
    }
    Generator.prototype.getHubType = function (x, y) {
        this._validatePositon(x, y);
        return HubType.LL;
        //return this._field[y][x];
    };
    Generator.prototype.getHubNo = function (x, y) {
        return "#ded";
    };
    Generator.prototype.setHubType = function (x, y, hubType) {
        this._validatePositon(x, y);
        this._field[y][x] = hubType;
    };
    Generator.prototype.getThreadNo = function (x, y) {
        return "#ddd";
    };
    Generator.prototype._validatePositon = function (x, y) {
        if (x < 0 || x >= this.width) {
            throw new Error("Неверное задана ширина x");
        }
        if (y < 0 || y >= this.height) {
            throw new Error("Неверное задана высота y");
        }
    };
    return Generator;
}());
//# sourceMappingURL=app.js.map