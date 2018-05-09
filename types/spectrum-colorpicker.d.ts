interface JQuery<TElement> {
    spectrum(options: SpectrumOptions | 'container'): JQuery<TElement>;
    spectrum(method: 'destroy') : void;
    spectrum(method: 'get') : string;

    spectrum(method: "set", color: string): JQuery<TElement>;
    spectrum(method: "option", param: "palette", palette: string[][]): JQuery<TElement>;
}

interface TinyColor {
    toHexString(): string;
}


interface SpectrumOptions {
    color: string,
    showInitial: boolean,
    showInput: boolean,
    showButtons: boolean,
    preferredFormat: "hex",  
    showPalette: boolean,
    showSelectionPalette: boolean,
    palette: string[][],
    change(color: TinyColor): void
}