import * as THREE from 'three'
import AbstractApplication from './views/AbstractApplication'
import WebMidi from 'webmidi'
import anime from 'animejs'

class Main extends AbstractApplication {
    constructor() {
        super()
        
        this.yScale = 0.1;
        let geometry = new THREE.SphereGeometry(1, 16, 16);
        
        this._buildDrums(geometry)
        this._buildSynths(geometry)

        this._camera.position.z = 10;

        WebMidi.enable(this.webMidiEnable);
        this.start()
    }

    _buildDrums(geometry) {
        this.drums = [];

        this.drums[0] = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xFF9B43, wireframe: true }));
        this.drums[0].position.set(-1, 0, 0);
        this._scene.add(this.drums[0]);

        this.drums[1] = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xFF9B43, wireframe: true }));
        this.drums[1].position.set(1, 0, 0);
        this._scene.add(this.drums[1]);

        this.drums[2] = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xE8FF24, wireframe: true }));
        this.drums[2].position.set(3, 0, 0);
        this._scene.add(this.drums[2]);

        this.drums[3] = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xE8FF24, wireframe: true }));
        this.drums[3].position.set(5, 0, 0);
        this._scene.add(this.drums[3]);
    }

    _buildSynths(geometry){
        this.synths = [];

        this.synths[0] = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xF85BFD, wireframe: true }));
        this.synths[0].position.set(-5, 0, 0);
        this._scene.add(this.synths[0]);

        this.synths[1] = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x60FA8A, wireframe: true }));
        this.synths[1].position.set(-3, 0, 0);
        this._scene.add(this.synths[1]);
    }

    webMidiEnable(err) {
        if (err) {
            console.log("WebMidi could not be enabled.", err);
            return;
        } else {
            console.log("WebMidi enabled!");
        }
        console.log(WebMidi.inputs);
        console.log(WebMidi.outputs);

        this._midiInput = WebMidi.getInputByName("Circuit");

        if (!this._midiInput) return

        this._midiInput.addListener('noteon', 1, function (e) {
            console.log("Synth 1 on " + e.note.number);
            this.synthOn(this.synths[0], e.note.number)
        });

        this._midiInput.addListener('noteon', 2, function (e) {
            console.log("Synth 2 on " + e.note.number);
            this.synthOn(this.synths[1], e.note.number)
        });

        this._midiInput.addListener('noteoff', 1, function (e) {
            console.log("Synth 1 off " + e.note.number);
            this.synthOff(this.synths[0], e.note.number)
        });

        this._midiInput.addListener('noteoff', 2, function (e) {
            console.log("Synth 2 off " + e.note.number);
            this.synthOff(this.synths[1], e.note.number)
        });

        this._midiInput.addListener('noteon', 10, function (e) {
            switch (e.note.number) {
                case 60:
                    this.drumOn(this.drums[0]);
                    console.log('Drum 1 on');
                    break;
                case 62:
                    this.drumOn(this.drums[1]);
                    console.log('Drum 2 on');
                    break;
                case 64:
                    this.drumOn(this.drums[2]);
                    console.log('Drum 3 on');
                    break;
                case 65:
                    this.drumOn(this.drums[3]);
                    console.log('Drum 4 on');
                    break;
                default:
                    break;
            }
        });


        this._midiInput.addListener('noteoff', 10, function (e) {
            switch (e.note.number) {
                case 60:
                    this.drumOff(this.drums[0]);
                    console.log('Drum 1 off');
                    break;
                case 62:
                    this.drumOff(this.drums[1]);
                    console.log('Drum 2 off');
                    break;
                case 64:
                    this.drumOff(this.drums[2]);
                    console.log('Drum 3 off');
                    break;
                case 65:
                    this.drumOff(this.drums[3]);
                    console.log('Drum 4 off');
                    break;
                default:
                    break;
            }
        });
    }

    synthOn(myTarget, number) {
        (function (myTarget) {
            anime.remove(myTarget.position);
            anime({
                targets: myTarget.position,
                y: number * this.yScale
            })
        })(myTarget)
    }

    synthOff(myTarget, number) {
        (function (myTarget) {
            anime.remove(myTarget.position);
            anime({
                targets: myTarget.position,
                y: 0
            })
        })(myTarget)
    }

    drumOn(myTarget) {
        (function (myTarget) {
            myTarget.restartAnime = myTarget.restartAnime || anime({
                targets: myTarget.position,
                duration: 100,
                loop: 2,
                direction: 'alternate',
                y: 100 * this.yScale
            })
            myTarget.restartAnime.restart();
        })(myTarget)
    }

    drumOff(myTarget) {
        // (function (myTarget) {
        //     anime.remove(myTarget.position);
        //     anime({
        //         targets: myTarget.position,
        //         y: 0
        //     })
        // })(myTarget)
    }
}

export default Main
