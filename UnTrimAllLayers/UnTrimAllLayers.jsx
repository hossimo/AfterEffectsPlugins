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
    var scriptName = "UnTrim Selection";

    // Event Callbacks
    function onGo(){
        if (!checkSelection())
            return;
        for (compIndex = 0; compIndex < selection.length; compIndex++) {
            comp = selection[compIndex]
            if (comp.typeName != "Composition")
                continue;
            // zoom out the selection ; This either does not work or I don't understand it
            // comp.workAreaStart.timeSpanStart = 0;
            // comp.workAreaDuration.timeSpanDuration = comp.duration;

            for (layerIndex = 1; layerIndex <= comp.layers.length; layerIndex++) { // layers start at 1
                layer = comp.layers[layerIndex]
                sourceDuration = layer.source.duration
                layer.inPoint = 0
                if (sourceDuration == 0) {
                    //layer is probably an image, extend to the comp duration
                    layer.outPoint = comp.duration
                }
                else {
                    layer.outPoint = sourceDuration
                }
            }
        }
    }

    function checkSelection(){
        var compFoundInSelection = false;
        var layerFoundInSelection = false;

        // loop though the selection making sure we have at least one comp selected.
        for (compIndex = 0; compIndex < selection.length; compIndex++) {
            if (selection[compIndex].typeName == "Composition")
                compFoundInSelection = true;
        }

        if (!(compFoundInSelection || layerFoundInSelection))
        {
            alert("Select at least 1 Comp or Layer")
        }
        return compFoundInSelection || layerFoundInSelection
    }
    
    //Entry Point
    onGo()

}