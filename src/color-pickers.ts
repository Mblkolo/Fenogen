import "spectrum-colorpicker";
import "spectrum-colorpicker/spectrum.css";
import {Point} from './geometry';
import * as $ from 'jquery'

const pickers: JQuery<HTMLElement>[] = [];



export default {
    refreshPickers(colors: string[], stratwith: Point, step: Point) {
        while(pickers.length < colors.length) {
            const newPicker = $(`<div class="picker-handler"></div>`).appendTo('#colorpickers').spectrum({
                color: "#f00",
                showInitial: true,
                showInput: true,
                showButtons: false,
                preferredFormat: "hex",  
                showPalette: true,
                showSelectionPalette: false,
                palette: []
            });

            pickers.push(newPicker);
        }
        while(pickers.length > colors.length) {
            const removedPicker = pickers.pop();
            if(removedPicker != undefined) {
                const container = removedPicker.spectrum('container');
                removedPicker.spectrum('destroy');
                $(container).remove();
            }
        }

        const uniqueColors: string[] = [];
        for (let i = 0; i < colors.length; i++) {
            if(uniqueColors.indexOf(colors[i]) === -1)
                uniqueColors.push(colors[i]);
        }
        const paltette = uniqueColors.map(x => [x]);

        for (let i = 0; i < colors.length; i++) {
            pickers[i].spectrum("set", colors[i]);
            pickers[i].spectrum("option", "palette", paltette);
        }

        const position = {...stratwith};
        for (let i = 0; i < pickers.length; i++) {
            const picker = pickers[i];
            picker.css({
                'background-color': picker.spectrum('get'),
                top: position.y,
                left: position.x
            });

            position.x += step.x;
            position.y += step.y;
        }
    }
}