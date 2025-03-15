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
    var version = "1.0.0"
    var selection = app.project.selection;
    var scriptName = "Find and Replace with Selection";
    var searchTerm = "";
    var replaceTerm = "";
    var palette;

    //Event Callbacks
    function onSearchChanged(){
        searchTerm = this.text;
    }

    function onReplaceChanged(){
        replaceTerm = this.text;
    }

    function onGo(){
        // update the selection
        selection = app.project.selection;
        if (searchTerm.length == 0){
            alert("Nothing to do.", scriptName);
        } else {
            // loop through selection
            app.beginUndoGroup("Find and Replace");
            var replaceCount = 0
            for (i = 0; i < selection.length; i++) {
                var original = selection[i].name
                selection[i].name =original.replace(searchTerm, replaceTerm);
                if (original != selection[i].name){
                    replaceCount ++;
                }
            }
            alert("Replaced " + replaceCount + " Item(s)")    
            app.endUndoGroup();
        }
        //palette.close();
        return;        
    }

    function onCancel(){
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
                SearchRow: Group { \
                    alignment:['right','top'], \
                    SearchLabel: StaticText { text:'Find:', alignment:['left','center'] }, \
                    SearchEditText: EditText { text:'', characters:20, alignment:['left','center'] }, \
                }, \
                ReplaceRow: Group { \
                    alignment:['right','top'], \
                    ReplaceLabel: StaticText { text:'New Replace:', alignment:['left','center'] }, \
                    ReplaceEditText: EditText { text:'', characters:20, alignment:['fill','center'] }, \
                }, \
                cmds: Group { \
                    alignment:['fill','top'], \
                    GoButton: Button { text:'Go', alignment:['fill','center'] }, \
                    CancelButton: Button { text:'Cancel', alignment:['fill','center'] }, \
                }, \
        }";
        
                    palette.margins = [10, 10, 10, 10];
                    palette.grp = palette.add(res);
        
                    // Workaround to ensure the editext text color is black, even at darker UI brightness levels
                    var winGfx = palette.graphics;
                    var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0, 0, 0], 1);
                    palette.grp.SearchRow.SearchEditText.graphics.foregroundColor = darkColorBrush;
                    palette.grp.ReplaceRow.ReplaceEditText.graphics.foregroundColor = darkColorBrush;
        
                    // events
                    palette.grp.SearchRow.SearchEditText.onChange = palette.grp.SearchRow.SearchEditText.onChanging = onSearchChanged;
                    palette.grp.ReplaceRow.ReplaceEditText.onChange = palette.grp.ReplaceRow.ReplaceEditText.onChanging = onReplaceChanged;
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

    // entry point
    if (selection.length > 0){
        buildPalette(this)
    } else {
        alert("Must have a project selection.", scriptName);
    }

}