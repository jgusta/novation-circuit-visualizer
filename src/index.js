import anime from 'animejs'
import WebMidi from 'webmidi'
import * as THREE from 'three';

// three-full has modular versions of the three examples folder
// Importing the file directly keeps webpack from bundling the entire three-full library
import { OrbitControls } from 'three-full/sources/controls/OrbitControls'

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
var yScale = 0.1;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

var controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 10;


var lightBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true });
var lightBoxGeometry = new THREE.SphereGeometry(1, 16, 16);

var synth1 = new THREE.Mesh(lightBoxGeometry, new THREE.MeshBasicMaterial({ color: 0xF85BFD, wireframe: true }));
synth1.position.set(-5, 0, 0);
scene.add(synth1);

var synth2 = new THREE.Mesh(lightBoxGeometry, new THREE.MeshBasicMaterial({ color: 0x60FA8A, wireframe: true }));
synth2.position.set(-3, 0, 0);
scene.add(synth2);

var drum1 = new THREE.Mesh(lightBoxGeometry, new THREE.MeshBasicMaterial({ color: 0xFF9B43, wireframe: true }));
drum1.position.set(-1, 0, 0);
scene.add(drum1);

var drum2 = new THREE.Mesh(lightBoxGeometry, new THREE.MeshBasicMaterial({ color: 0xFF9B43, wireframe: true }));
drum2.position.set(1, 0, 0);
scene.add(drum2);

var drum3 = new THREE.Mesh(lightBoxGeometry, new THREE.MeshBasicMaterial({ color: 0xE8FF24, wireframe: true }));
drum3.position.set(3, 0, 0);
scene.add(drum3);

var drum4 = new THREE.Mesh(lightBoxGeometry, new THREE.MeshBasicMaterial({ color: 0xE8FF24, wireframe: true }));
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

    var input = WebMidi.getInputByName("Circuit");

    input.addListener('noteon', 1, function (e) {
        synthOneOn(e.note.number);
    });

    input.addListener('noteon', 2, function (e) {
        synthTwoOn(e.note.number);
    });

    input.addListener('noteoff', 1, function (e) {
        synthOneOff(e.note.number);
    });

    input.addListener('noteoff', 2, function (e) {
        synthTwoOff(e.note.number);
    });

    input.addListener('noteon', 10, function (e) {
        switch (e.note.number) {
            case 60:
                drumOneOn();
                break;
            case 62:
                drumTwoOn();
                break;
            case 64:
                drumThreeOn();
                break;
            case 65:
                drumFourOn();
                break;
            default:
                break;
        }
    });


    input.addListener('noteoff', 10, function (e) {
        switch (e.note.number) {
            case 60:
                drumOneOff();
                break;
            case 62:
                drumTwoOff();
                break;
            case 64:
                drumThreeOff();
                break;
            case 65:
                drumFourOff();
                break;
            default:
                break;
        }
    });
});

function synthOneOn(number) {
    console.log('Synth 1 on ' + number);
    synth1.position.y = number * yScale;
}

function synthTwoOn(number) {
    console.log('Synth 2 on ' + number);
    synth2.position.y = number * yScale;
}

function synthOneOff(number) {
    console.log('Synth 1 off ' + number);
    synth1.position.y = 0;
}

function synthTwoOff(number) {
    console.log('Synth 2 off ' + number);
    synth2.position.y = 0;
}

function drumOneOn() {
    console.log('Drum 1 on');
    drum1.position.y = 100 * yScale;
}

function drumTwoOn() {
    console.log('Drum 2 on');
    drum2.position.y = 100 * yScale;
}

function drumThreeOn() {
    console.log('Drum 3 on');
    drum3.position.y = 100 * yScale;
}

function drumFourOn() {
    console.log('Drum 4 on');
    drum4.position.y = 100 * yScale;
}

function drumOneOff() {
    console.log('Drum 1 off');
    drum1.position.y = 0;
}

function drumTwoOff() {
    console.log('Drum 2 off');
    drum2.position.y = 0;
}

function drumThreeOff() {
    console.log('Drum 3 off');
    drum3.position.y = 0;
}

function drumFourOff() {
    console.log('Drum 4 off');
    drum4.position.y = 0;
}