// Get the selected compositions
var selectedComps = app.project.selection;

for (var i = 0; i < selectedComps.length; i++) {
  var comp = selectedComps[i];
  if (comp.typeName != "Composition")
    continue;

  // Set the work area start and end times to the beginning and end of the composition
  comp.workAreaStart = 0;
  comp.workAreaDuration = comp.duration;
}
