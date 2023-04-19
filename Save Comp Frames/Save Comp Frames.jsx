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
    // logging
    var Log = {};
    Log.message = "";
    Log.add = function (str) {
        Log.message += str + "\n";
    }
    Log.print = function () {
        alert(Log.message)
    }

    var version = "1.0.2"
    var selection = app.project.selection;
    var scriptName = "Save Comp Frames";
    var frame = 0;
    var newColor = [0, 0, 0];
    var palette;
    var path;
    var folder;
    Log.add("Starting " + scriptName + " Frames v" + version);
    Log.add("-----------------------------")


    // Event Callbacks

    function onFramesChanged() {
        frame = parseInt(this.text);
    }

    function onGo() {
        if (frame < 0 || isNaN(frame)) {
            Log.add("Frame must be a number 0 or greater")
            Log.print()
            return;
        }

        path = Folder.selectDialog("Select a render output folder...");
        if (!path) {
            Log.add("No path selected")
            Log.print()
            return
        }


        app.beginUndoGroup("Save Frames");

        for (i = 0; i < selection.length; i++) {

            // skip if not a comp
            if (selection[i].typeName != "Composition")
                continue;

            if (frame > selection[i].duration){
                Log.add("❌Skipped " + selection[i].name + " because frame is greater the comp duration")
                continue;
            }
            // reset the scaling to 1:1
            selection[i].resolutionFactor = [1,1];
            
            // save the file as a png
            var result = selection[i].saveFrameToPng(frame / selection[i].frameRate, new File(path.toString() + "/" + selection[i].name + ".png"))
            if (result._hasException)
                Log.add("❌Failed - " + path.toString() + "/" + selection[i].name + ".png (" + result._exception + ")");
                else
                Log.add("✅ Saved - " + path.toString() + "/" + selection[i].name + ".png")
        }
        Log.print();
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
            frameRow: Group { \
                alignment:['right','top'], \
                frameStr: StaticText { text:'Frame:', alignment:['left','center'] }, \
                frameEditText: EditText { text:'', characters:6, alignment:['left','center'] }, \
            }, \
            cmds: Group { \
                alignment:['fill','top'], \
                GoButton: Button { text:'Go', alignment:['fill','center'] }, \
                CancelButton: Button { text:'Cancel', alignment:['fill','center'] }, \
            }, \
    }";

            palette.margins = [10, 10, 10, 10];
            palette.grp = palette.add(res);

            // Workaround to ensure the edit text text color is black, even at darker UI brightness levels
            var winGfx = palette.graphics;
            var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0, 0, 0], 1);
            palette.grp.frameRow.frameEditText.graphics.foregroundColor = darkColorBrush;

            // events
            palette.grp.frameRow.frameEditText.onChange = palette.grp.frameRow.frameEditText.onChanging = onFramesChanged;

            palette.grp.cmds.GoButton.onClick = onGo;
            palette.grp.cmds.CancelButton.onClick = onCancel;


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
    if (compFoundinSelection) {
        buildPalette(this)
    }
    else {
        alert("Select at least 1 Comp to change duration")
    }

}