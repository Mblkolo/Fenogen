
import {GeneratorState, HubType} from './generator'


function Serialize(state: GeneratorState) : string {
    return [
        "1",
        encodeWidth(state.width),
        encodeHeigth(state.height),
        encodeThreadColors(state.colors),
        encodeHubs(state.hubs)
    ]
    .join('.')
}

function encodeWidth(width: number) {
    return width.toString();
}

function encodeHeigth(heigth: number) {
    return heigth.toString();
}

function encodeThreadColors(colors: string[]) {
    return colors.map(x => x.slice(1)).join('');
}

function encodeHubs(hubs: HubType[][]) {
    return hubs.map(x => x.filter(x => x !== HubType.None).map(y => y.toString()).join('')).join('')
}

function Deserialize(data: string) : GeneratorState {
    const parts = data.split('.');

    const width = parseWidth(parts[1]);
    const height = parseHeigth(parts[2]);
    
    return {
        width,
        height,
        colors: parseColors(parts[3]),
        hubs: parseHubs(width, height, parts[4])
    };
}

function parseWidth(width: string) {
    return parseInt(width, 10);
}

function parseHeigth(height: string) {
    return parseInt(height, 10);
}

function parseColors(colors: string) {
    const result: string[] = [];
    while(colors.length > 0) 
    {
        result.push('#' + colors.slice(0, 6));
        colors = colors.slice(6);
    }
    return result;
}

function parseHubs(width: number, height: number, hubs: string) {
    const hubsArray = hubs.split('');

    const result: HubType[][] = [];
    for (let y = 0; y < height; y++) {
        const hubRow: HubType[] = [];
        for (let x = 0; x < width; x++) {
            const isNone = (x + y) % 2 == 1;
            if(isNone)
                hubRow.push(HubType.None);
            else {
                const o = hubsArray.shift()
                if(o === undefined)
                    throw new Error();
                
                const hubType = parseInt(o);
                hubRow.push(hubType);
            }
        }
        result.push(hubRow);
    }

    return result;
}


export default {
    Serialize,
    Deserialize
}