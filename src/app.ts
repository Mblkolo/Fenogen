import {Generator, HubType } from './generator'

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


class Render {

    draw() {
        // const cw = 16;
        // const ch = 30;

        this._context.translate(0.5, 0.5);

        let h = this._generator.height;
        let w = this._generator.width;

        for (let y = 0; y < h + 1; ++y) {
            for (let x = 0; x < w + 1; ++x) {
                this._drawThreads(x, y);
            }
        }

        for (let y = 0; y < h; ++y) {
            for (let x = 0; x < w; ++x) {
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

    private _step: number = 27;


    private _drawThreads(x: number, y: number) {
        let color = this._generator.getThreadNo(x, y);
        let ctx = this._context;
        let step = this._step;
        const size = 6;

        let y0 = (y + 0) * step - size;
        let y1 = (y + 1) * step - size;
        let y2 = (y + 1) * step + size;
        let y3 = (y + 0) * step + size;

        let x0: number, x1: number;
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
    }

    private _drawHub(x: number, y: number) {
        const ctx = this._context;
        const size = 8;
        const step = this._step;

        const hubType = this._generator.getHubType(x, y);
        if(hubType === HubType.None)
            return;

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000";
        ctx.fillStyle = this._generator.getHubNo(x, y);
        
        ctx.beginPath();
        ctx.arc((x + 1) * step, (y + 1) * step, size * 1.5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.lineCap = "round";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#fff";
        this.drawHubDirection(hubType, size, x, y);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        this.drawHubDirection(hubType, size, x, y);
    }

    private drawHubDirection(hubType: HubType, size: number, x: number, y: number )
    {
        const ctx = this._context;
        const step = this._step;
        
        ctx.beginPath();
        if (hubType === HubType.LL || hubType === HubType.LR) {
            ctx.moveTo((x + 1) * step - (size - 2), (y + 1) * step - (size - 2));
        }
        else {
            ctx.moveTo((x + 1) * step + (size - 2), (y + 1) * step - (size - 2));
        }

        ctx.lineTo((x + 1) * step, (y + 1) * step);

        if (hubType === HubType.LL || hubType == HubType.RL) {
            ctx.lineTo((x + 1) * step - (size - 2), (y + 1) * step + (size - 2));
        }
        else {
            ctx.lineTo((x + 1) * step + (size - 2), (y + 1) * step + (size - 2));
        }

        ctx.stroke();
    }
}


