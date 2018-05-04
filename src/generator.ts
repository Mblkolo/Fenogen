
export enum HubType {
    None,
    LL,
    LR,
    RL,
    RR
}

export enum ThreadType {
    Down,
    Left,
    Right
}

export class Generator {
    width: number;
    height: number;

    getHubType(x: number, y: number): HubType {
        this._validateHubPositon(x, y);
        return this._hubsField[y][x];
    }

    getHubNo(x: number, y: number): string {
        this._validateHubPositon(x, y);
        const hubType = this._hubsField[y][x];
        if(hubType === HubType.LL || hubType === HubType.LR)
            return this._threadField[y][x];
        else
            return this._threadField[y][x+1];
    }

    setHubType(x: number, y: number, hubType: HubType) {
        this._validateHubPositon(x, y);
        this._hubsField[y][x] = hubType;
    }

    getThreadNo(x: number, y: number): string {
        return this._threadField[y][x];
    }


    //Размеры задаются в хабах
    constructor(width: number, heigth: number) {
        this.width = width;
        this.height = heigth;
        this._createField();
        this.recalculateThreadColors();
    }

    private _hubsField: HubType[][] = [];
    private _threadField: string[][] = [];

    private _validateHubPositon(x: number, y: number) {

        if (x < 0 || x >= this.width) {
            throw new Error("Неверное задана ширина x");
        }

        if (y < 0 || y >= this.height) {
            throw new Error("Неверное задана высота y");
        }
    }

    private _createField() {
        const hubTypes = [HubType.LL, HubType.LR, HubType.RL, HubType.RR];

        for (let y = 0; y < this.height; ++y) {
            this._hubsField.push([]);
            for (let x = 0; x < this.width; ++x) {
                const isNone = (x + y) % 2 == 1;
                this._hubsField[y].push(isNone ? HubType.None : getRandom(hubTypes));
            }
        }

        const colors = ['#fff', '#0ff', '#f0f', '#ff0', '#00f', '#f00']

        for (let y = 0; y < this.height + 1; ++y) {
            this._threadField.push([]);
            for (let x = 0; x < this.width + 1; ++x) {
                this._threadField[y].push( getRandom(colors));
            }
        }
    }

    private recalculateThreadColors()
    {
        console.log(this._hubsField);
        for (let y = 1; y < this.height + 1; ++y) {
            for (let x = 0; x < this.width + 1; ++x) {
                this._threadField[y][x] = this.getParentColor(x, y)
            }
        }
    }

    private getParentColor(x: number, y: number) : string
    {
        if(x > 0){
            const leftTopHub = this.getHubType(x-1, y-1);

            if(x == this.width)
                console.log({leftTopHub, x, y});
            if(leftTopHub === HubType.LR || leftTopHub === HubType.RL)
                 return this._threadField[y-1][x-1];
        }

        if(x < this.width){
            const rightTopHub = this.getHubType(x, y-1);
            if(rightTopHub === HubType.LR || rightTopHub === HubType.RL)
                 return this._threadField[y-1][x+1];
        }

        return this._threadField[y-1][x];
    }
}

function getRandom<T>(data: T[])
{
    return data[Math.floor(Math.random()*data.length)] 
}