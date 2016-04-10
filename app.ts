window.onload = () => {
    let el: any = document.getElementById("pane");
    let context: CanvasRenderingContext2D = el.getContext("2d");

    let width = el.width;
    let height = el.height;
    // context.strokeRect(0, 0, width, height);

    let g = new Generator(12, 10);
    let r = new Render(g, context);
    r.draw();
};

enum HubType {
    LL,
    LR,
    RL,
    RR
}


class Render {

    draw() {
        // const cw = 16;
        // const ch = 30;

        this._context.translate(0.5, 0.5);

        let h = this._generator.height;
        let w = this._generator.width;

        for (let y = 0; y < h; ++y) {
            for (let x = 0; x < w; ++x) {
                if ((x + y) % 2 === 1) {
                    continue;
                }

                this._drawThreads(x, y);
                this._drawHub(x, y);
            }
        }

    }

    constructor(generator: Generator, context: CanvasRenderingContext2D) {
        this._generator = generator;
        this._context = context;
    }

    private _generator: Generator;
    private _context: CanvasRenderingContext2D;

    private _step: number = 31;


    private _drawThreads(x: number, y: number) {
        let ctx = this._context;
        let step = this._step;
        const size = 6;

        let y1 = y + 1;
        let x1 = x + 1;
        let x_1 = x - 1;
        let vstep = (step);

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
    }

    private _drawHub(x: number, y: number) {
        let ctx = this._context;
        let step = this._step;
        const size = 6;

        ctx.fillStyle = "#fff";
        ctx.fillRect(
            x * step - size - 1,
            y * step - size * 2 - 1,
            size * 2 + 2,
            4 * size + 2);

        ctx.strokeRect(
            x * step - size - 1,
            y * step - size * 2 - 1,
            size * 2 + 2,
            4 * size + 2);
    }
}


class Generator {
    width: number;
    height: number;

    getHubType(x: number, y: number): HubType {
        this._validatePositon(x, y);
        return this._field[y][x];
    }

    setHubType(x: number, y: number, hubType: HubType) {
        this._validatePositon(x, y);
        this._field[y][x] = hubType;
    }

    getRowWidht(y: number): number {
        if (y % 2 === 0) {
            return this.width;
        }

        return this.width - 1;
    }

    constructor(width: number, heigth: number) {
        this.width = width;
        this.height = heigth;
        this._createField();
    }

    private _field: HubType[][];

    private _validatePositon(x: number, y: number) {

        if (x < 0 || x >= this.getRowWidht(y)) {
            throw new Error("Неверное задана ширина x");
        }

        if (y < 0 || y >= this.height) {
            throw new Error("Неверное задана высота y");
        }
    }

    private _createField() {
        this._field = [];
        for (let y = 0; y < this.height; ++y) {
            this._field.push([]);
            let width = this.getRowWidht(y);

            for (let x = 0; x < width; ++x) {
                this._field[y].push(HubType.LL);
            }
        }
    }
}