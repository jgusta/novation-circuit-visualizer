import anime from 'animejs'
import WebMidi from 'webmidi'
import * as THREE from 'three';
// this line requires @wildpeaks/three-webpack-plugin
import { OrbitControls } from 'three/examples/js/controls/OrbitControls'

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
var yScale = 0.1;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

new OrbitControls(camera, renderer.domElement);
camera.position.z = 10;


var lightBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true });
var lightBoxGeometry = new THREE.SphereGeometry(1, 16, 16);

const synth1 = new THREE.Mesh(lightBoxGeometry, new THREE.MeshBasicMaterial({ color: 0xF85BFD, wireframe: true }));
synth1.position.set(-5, 0, 0);
scene.add(synth1);

const synth2 = new THREE.Mesh(lightBoxGeometry, new THREE.MeshBasicMaterial({ color: 0x60FA8A, wireframe: true }));
synth2.position.set(-3, 0, 0);
scene.add(synth2);

const drum1 = new THREE.Mesh(lightBoxGeometry, new THREE.MeshBasicMaterial({ color: 0xFF9B43, wireframe: true }));
drum1.position.set(-1, 0, 0);
scene.add(drum1);

const drum2 = new THREE.Mesh(lightBoxGeometry, new THREE.MeshBasicMaterial({ color: 0xFF9B43, wireframe: true }));
drum2.position.set(1, 0, 0);
scene.add(drum2);

const drum3 = new THREE.Mesh(lightBoxGeometry, new THREE.MeshBasicMaterial({ color: 0xE8FF24, wireframe: true }));
drum3.position.set(3, 0, 0);
scene.add(drum3);

const drum4 = new THREE.Mesh(lightBoxGeometry, new THREE.MeshBasicMaterial({ color: 0xE8FF24, wireframe: true }));
drum4.position.set(5, 0, 0);
scene.add(drum4);

// game logic
var update = function () {

};

//draw scene
var render = function () {
    renderer.render(scene, camera);
};

// run game loop (update, render, repeat)
var GameLoop = function () {
    requestAnimationFrame(GameLoop);
    update();
    render();
};

GameLoop();

WebMidi.enable(function (err) {

    if (err) {
        console.log("WebMidi could not be enabled.", err);
    } else {
        console.log("WebMidi enabled!");
    }
    console.log(WebMidi.inputs);
    console.log(WebMidi.outputs);

    const input = WebMidi.getInputByName("Circuit");

    input.addListener('noteon', 1, function (e) {
        console.log("Synth 1 on " + e.note.number);
        synthOn(synth1, e.note.number)
    });

    input.addListener('noteon', 2, function (e) {
        console.log("Synth 2 on " + e.note.number);
        synthOn(synth2, e.note.number)
    });

    input.addListener('noteoff', 1, function (e) {
        console.log("Synth 1 off " + e.note.number);
        synthOff(synth1, e.note.number)
    });

    input.addListener('noteoff', 2, function (e) {
        console.log("Synth 2 off " + e.note.number);
        synthOff(synth2, e.note.number)
    });

    input.addListener('noteon', 10, function (e) {
        switch (e.note.number) {
            case 60:
                drumOn(drum1);
                console.log('Drum 1 on');
                break;
            case 62:
                drumOn(drum2);
                console.log('Drum 2 on');
                break;
            case 64:
                drumOn(drum3);
                console.log('Drum 3 on');
                break;
            case 65:
                drumOn(drum4);
                console.log('Drum 4 on');
                break;
            default:
                break;
        }
    });


    input.addListener('noteoff', 10, function (e) {
        switch (e.note.number) {
            case 60:
                drumOff(drum1);
                console.log('Drum 1 off');
                break;
            case 62:
                drumOff(drum2);
                console.log('Drum 2 off');
                break;
            case 64:
                drumOff(drum3);
                console.log('Drum 3 off');
                break;
            case 65:
                drumOff(drum4);
                console.log('Drum 4 off');
                break;
            default:
                break;
        }
    });
});

function synthOn(myTarget, number) {
    (function (myTarget) {
        anime.remove(myTarget.position);
        anime({
            targets: myTarget.position,
            y: number * yScale
        })
    })(myTarget)
}

function synthOff(myTarget, number) {
    (function (myTarget) {
        anime.remove(myTarget.position);
        anime({
            targets: myTarget.position,
            y: 0
        })
    })(myTarget)
}

function drumOn(myTarget) {
    (function (myTarget) {
        myTarget.restartAnime = myTarget.restartAnime || anime({
            targets: myTarget.position,
            duration: 100,
            loop: 2,
            direction: 'alternate',
            y: 100 * yScale
        })
        myTarget.restartAnime.restart();
    })(myTarget)
}

function drumOff(myTarget) {
    // (function (myTarget) {
    //     anime.remove(myTarget.position);
    //     anime({
    //         targets: myTarget.position,
    //         y: 0
    //     })
    // })(myTarget)
}