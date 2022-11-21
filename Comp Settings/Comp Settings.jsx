// Copyright 2022 Down Right Technical Inc.

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do
// so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

{
    var selection = app.project.selection;
    var scriptName = "Comp Settings";
    var newFrames = 0;
    var newCompFPS = 0;
    var newColor = [0,0,0];
    var palette;
    
    var enableFrames = false;
    var enableFPS = false;
    var enableColor = false;

    // Event Callbacks
    function onFramesChanged() {
        newFrames = parseInt(this.text);
    }

    function onFPSChanged() {
        newCompFPS = parseFloat(this.text)
    }

    function onFramesEnablel(){
        enableFrames = this.value;
    }

    function onFPSEnablel(){
        enableFPS = this.value;
    }

    function onColorEnablel(){
        enableColor = this.value;
    }

    function onColor(){
        var color = $.colorPicker();
        var _red = ((color >> 16) & 255) / 255;
        var _green = ((color >> 8) & 255) / 255;
        var _blue = (color & 255) / 255;
        newColor = [_red, _green, _blue]
    }

    function onGo() {
        if (enableFPS && newCompFPS > 999 | newCompFPS <= 0 || isNaN(newCompFPS)) {
            alert("Invalid FPS", scriptName);
            return;
        }
        if (enableFrames && newFrames > 10789200 || newFrames <= 0 || isNaN(newFrames)) {
            alert("Invalid Duration", scriptName);
            return;
        }

        app.beginUndoGroup("Comp Length");

        for (i = 0; i < selection.length; i++) {
            if (selection[i].typeName != "Composition")
                continue;
             if (enableFPS)
                selection[i].frameRate = newCompFPS;
             if (enableFrames)
                selection[i].duration = newFrames / selection[i].frameRate;
            if (enableColor)
                selection[i].bgColor = newColor;
        }

        app.endUndoGroup();
        palette.close();
    }

    function onCancel() {
        // set vars back to 0
        newFrames = 0;
        newCompFPS = 0;
        // close the palette
        palette.close();
        return;
    }

    function buildPalette(thisObj) {
        // Create and show a floating palette
        palette = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, undefined, { resizeable: false });
        if (palette != null) {
            var res =
"group { \
    orientation:'column', alignment:['fill','fill'], alignChildren:['left','top'], spacing:5, margins:[0,0,0,0], \
        fpsRow: Group { \
            alignment:['right','top'], \
            fpsStr: StaticText { text:'FPS:', alignment:['left','center'] }, \
            fpsEditText: EditText { text:'', characters:6, alignment:['left','center'] }, \
            fpsEnable:  Checkbox {},\
        }, \
        framesRow: Group { \
            alignment:['right','top'], \
            framesStr: StaticText { text:'New Duration (Frames):', alignment:['left','center'] }, \
            framesEditText: EditText { text:'', characters:6, alignment:['fill','center'] }, \
            framesEnable:  Checkbox {},\
        }, \
        colorRow: Group { \
            alignment:['right','top'], \
            colorStr: StaticText { text:'BG Color:', alignment:['left','center'] }, \
            colorButton: Button { text:'Color', alignment:['fill','center'] }, \
            colorEnable:  Checkbox {},\
        }, \
        cmds: Group { \
            alignment:['fill','top'], \
            GoButton: Button { text:'Go', alignment:['fill','center'] }, \
            CancelButton: Button { text:'Cencel', alignment:['fill','center'] }, \
        }, \
}";

            palette.margins = [10, 10, 10, 10];
            palette.grp = palette.add(res);

            // Workaround to ensure the editext text color is black, even at darker UI brightness levels
            var winGfx = palette.graphics;
            var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0, 0, 0], 1);
            palette.grp.fpsRow.fpsEditText.graphics.foregroundColor = darkColorBrush;
            palette.grp.framesRow.framesEditText.graphics.foregroundColor = darkColorBrush;

            // events
            palette.grp.fpsRow.fpsEditText.onChange = palette.grp.fpsRow.fpsEditText.onChanging = onFPSChanged;
            palette.grp.framesRow.framesEditText.onChange = palette.grp.framesRow.framesEditText.onChanging = onFramesChanged;
            palette.grp.colorRow.colorButton.onClick = onColor;
            palette.grp.cmds.GoButton.onClick = onGo;
            palette.grp.cmds.CancelButton.onClick = onCancel;
            
            palette.grp.framesRow.framesEnable.onClick = onFramesEnablel;            
            palette.grp.fpsRow.fpsEnable.onClick = onFPSEnablel;            
            palette.grp.colorRow.colorEnable.onClick = onColorEnablel;            
           

            //my_palette.onResizing = my_palette.onResize = function () { this.layout.resize(); }

            if (palette instanceof Window) {
                palette.center();
                palette.show();
            } else {
                palette.layout.layout(true);
                palette.layout.resize();
            }
        }
        else {
            alert("Could not open the user interface.", scriptName);
        }
    }



    // Entry Point
    var compFoundinSelection = false;
    // loop though the selection making sure we have at least one comp selected.
    for (i = 0; i < selection.length; i++) {
        if (selection[i].typeName != "Composition")
            continue;
        compFoundinSelection = true;
        break;
    }
    if (compFoundinSelection)
    {
        buildPalette(this)
    }
    else
    {
        alert("Select at least 1 Comp to change duration")
    }
}

