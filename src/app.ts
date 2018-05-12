import {Generator, HubType, GeneratorState } from './generator'
import {EditorRender, PreviewRender} from './render';
import Serializer from './stateSerializator';
import * as $ from "jquery"


import colorpickers from "./color-pickers"
import { isNullOrUndefined } from 'util';



window.onload = () => {
    
    const el  = document.getElementById("pane") as HTMLCanvasElement;
    const context = el.getContext("2d");
    if(context === null)
        return;

    let width = el.width;
    let height = el.height;
    context.strokeRect(0, 0, width, height);
    context.translate(0.5, 0.5);
    context.strokeRect(0, 0, width, height);

    let g = new Generator(13, 10);

    const hash = window.location.hash;
    if(hash.indexOf('#') === 0) {
        const state: GeneratorState = JSON.parse(decodeURIComponent(hash.slice(1)));
        g = new Generator(state.width, state.height);
        state.colors.forEach((color, index) => g.setThreadColor(index, color))
        state.hubs.forEach((row, rowIndex) => {
            row.forEach((hubType, hubNo) => g.setHubType(hubNo, rowIndex, hubType ))
        });
    }


    let r = new EditorRender(g, context);
    const pr = new PreviewRender(g, context);

    draw();

    colorpickers.setSelectColorCallback((position, color) => {
        g.setThreadColor(position, color);

        draw();
    });

    $('#remove-thread').click(() => {
        g.removeThread();
        draw();
    });

    $('#add-thread').click(() => {
        g.addThread();
        draw();
    });

    $('#add-hub-row').click(() => {
        g.addHubRow();
        draw();
    });

    $('#remove-hub-row').click(() => {
        g.removeHubRow();
        draw();
    });


    el.addEventListener('click', (e) => {
        console.log({offsetX: e.offsetX, step: r.step});
        const hub = {
            x: Math.floor((e.offsetX - r.step / 2) / (r.step)),
            y: Math.floor((e.offsetY - r.step / 2) / (r.step))
        }
        
        if(hub.x < 0 || g.width <= hub.x || hub.y < 0 || g.height <= hub.y)
            return

        if(hub.x < g.width && hub.y < g.height) {
            g.nextHubType(hub.x, hub.y);
            draw()
        }
    })

    function draw() {
        if(context == null)
            return;

        r.draw();
        context.translate(400, 0);
        pr.draw();
        context.translate(-400, 0);

        const offset = $(el).offset();
        if(offset === undefined)
            return;

        colorpickers.refreshPickers(g.getColors(), {x: offset.left, y: 0}, {x: r.step, y: 0});

        const state = g.getState();
        const stringState = Serializer.Serialize(state);
        window.location.hash =  stringState;
    }

};







