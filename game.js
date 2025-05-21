import { addNote } from "./addNote.js";
import { destroyNote } from "./destroyNote.js";
import { addScore } from "./addScore.js";
import { gameState, lanePositionsX } from "./gameState.js";
import { removeScore } from "./removeScore.js";
import { increaseDifficulty } from "./increaseDifficulty.js";
import { resetGameAfterGameOver } from "./resetGameAfterGameOver.js";
import { pauseGame } from "./pauseGame.js";

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: "#050510",
  parent: "game",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);

let notes;
const hitZoneHeight = 60;
const hitZoneY = 450;

function preload() {
  //load the track
  this.load.image("pista", "assets/pista.png");

  //load the buttons
  this.load.image("button-a", "assets/buttons/button-A.png");
  this.load.image("button-s", "assets/buttons/button-S.png");
  this.load.image("button-d", "assets/buttons/button-D.png");
  this.load.image("button-f", "assets/buttons/button-F.png");

  // load the notes
  this.load.image("note-a", "assets/notes/note-A.png");
  this.load.image("note-s", "assets/notes/note-S.png");
  this.load.image("note-d", "assets/notes/note-D.png");
  this.load.image("note-f", "assets/notes/note-F.png");

  //load pause modal
  this.load.image("pause-modal", "assets/modals/pause-modal.png");

  //load game over modal
  this.load.image("game-over-modal", "assets/modals/gameover-modal.png");

  //load audio
  this.load.audio("note-a", "assets/audios/sound-a.wav");
  this.load.audio("note-s", "assets/audios/sound-s.wav");
  this.load.audio("gameover-sound", "assets/audios/gameover-sound.wav");
}

function create() {
  this.add
    .image(config.width / 2, config.height / 2, "pista")
    .setOrigin(0.5, 0.5)
    .setScale(0.5);

  //add the buttons
  this.add
    .image(lanePositionsX[0], 450, "button-a")
    .setOrigin(0, 0)
    .setScale(0.05);
  this.add
    .image(lanePositionsX[1], 450, "button-s")
    .setOrigin(0, 0)
    .setScale(0.05);
  this.add
    .image(lanePositionsX[2], 450, "button-d")
    .setOrigin(0, 0)
    .setScale(0.05);
  this.add
    .image(lanePositionsX[3], 450, "button-f")
    .setOrigin(0, 0)
    .setScale(0.05);

  //create audio
  this.noteSound = {
    a: this.sound.add("note-a"),
    s: this.sound.add("note-s"),
  };

  //create notes
  notes = this.physics.add.group();

  //create note event
  this.noteEvent = this.time.addEvent({
    delay: gameState.delayTimeCreateNote,
    callback: () => {
      const randomLane = Phaser.Math.Between(0, 3);
      addNote(randomLane, notes);
    },
    callbackScope: this,
    loop: true,
  });

  //create score
  gameState.score = 0;
  gameState.scoreText = this.add.text(190, 10, "Score: 0", {
    fontSize: "24px",
    fill: "#fff",
  });
}

function update() {
  //create keys
  this.keys = this.input.keyboard.addKeys({
    a: Phaser.Input.Keyboard.KeyCodes.A,
    s: Phaser.Input.Keyboard.KeyCodes.S,
    d: Phaser.Input.Keyboard.KeyCodes.D,
    f: Phaser.Input.Keyboard.KeyCodes.F,
    esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
  });

  //check if the key is pressed
  const isA = Phaser.Input.Keyboard.JustDown(this.keys.a);
  const isS = Phaser.Input.Keyboard.JustDown(this.keys.s);
  const isD = Phaser.Input.Keyboard.JustDown(this.keys.d);
  const isF = Phaser.Input.Keyboard.JustDown(this.keys.f);
  const isEsc = Phaser.Input.Keyboard.JustDown(this.keys.esc);
  const isEnter = Phaser.Input.Keyboard.JustDown(this.keys.enter);

  // pause game
  pauseGame(isEsc, this);


  let didHitNote = false;

  //check if the note is in the hit zone
  notes.getChildren().forEach((note) => {
    const inHitZone =
      note.y > hitZoneY && note.y < hitZoneY + hitZoneHeight / 2;

    if (inHitZone) {
      console.log("En hit zone");
      if (
        isA &&
        Math.abs(note.x - lanePositionsX[0]) < 30 &&
        note.texture.key === "note-a"
      ) {
        this.noteSound.a.play();
        destroyNote(note, notes);
        addScore();
        didHitNote = true;
      } else if (
        isS &&
        Math.abs(note.x - lanePositionsX[1]) < 30 &&
        note.texture.key === "note-s"
      ) {
        this.noteSound.s.play();
        destroyNote(note, notes);
        addScore();
        didHitNote = true;
      } else if (
        isD &&
        Math.abs(note.x - lanePositionsX[2]) < 30 &&
        note.texture.key === "note-d"
      ) {
        this.noteSound.a.play();
        destroyNote(note, notes);
        addScore();
        didHitNote = true;
      } else if (
        isF &&
        Math.abs(note.x - lanePositionsX[3]) < 30 &&
        note.texture.key === "note-f"
      ) {
        this.noteSound.s.play();
        destroyNote(note, notes);
        addScore();
        didHitNote = true;
      }
    }

    if (note.y > this.cameras.main.height + 50) {
      destroyNote(note, notes);
      removeScore(this, notes);
      gameState.failedNotes += 1;
      console.log("Nota perdida", gameState.failedNotes);
    }
  });

  //check if the note is not in the hit zone
  if (
    (isA && !didHitNote) ||
    (isS && !didHitNote) ||
    (isD && !didHitNote) ||
    (isF && !didHitNote)
  ) {
    console.log("A incorrecto");
    removeScore(this);
  }
  didHitNote = false;

  //increment difficulty
  increaseDifficulty(notes, this);

  //reset game
  resetGameAfterGameOver(isEnter, this);
}
