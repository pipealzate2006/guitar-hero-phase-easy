export function destroyNote(note, notes) {
  notes.killAndHide(note);
  note.destroy();
  console.log("Nota destruida");
}
