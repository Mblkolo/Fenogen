
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

export default {
    Serialize
}