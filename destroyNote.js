export function destroyNote(note) {
  try {
    note.destroy();
  } catch (error) {
    console.log(error);
  }
}
