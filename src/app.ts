import {Generator, HubType } from './generator'
import {EditorRender, PreviewRender} from './render';
import * as $ from "jquery"


import colorpickers from "./color-pickers"



window.onload = () => {
    
    // $("#colorpicker").spectrum({
    //     color: "#f00"
    // });

    // $("#colorpicker").offset({left: 100, top: 100});

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
    let r = new EditorRender(g, context);
    const pr = new PreviewRender(g, context);
    r.draw();

    //context.translate(-0.5, -0.5);
    context.translate(400, 0);
    pr.draw();
    context.translate(-400, 0);

    const offset = $(el).offset();
    if(offset === undefined)
        return;
    
    colorpickers.refreshPickers(g.getColors(), {x: offset.left, y: 0}, {x: r.step, y: 0})

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
            r.draw();

            context.translate(400, 0);
            pr.draw();
            context.translate(-400, 0);
        }
    })
};





