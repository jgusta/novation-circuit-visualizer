import * as THREE from 'three'
// this line requires @wildpeaks/three-webpack-plugin
import { OrbitControls } from 'three/examples/js/controls/OrbitControls'

class AbstractApplication {
    constructor() {
        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize(window.innerWidth, window.innerHeight)
        this._scene = new THREE.Scene();
        this._controls = new OrbitControls(this._camera, this._renderer.domElement)
        document.body.appendChild(this._renderer.domElement)
        window.addEventListener('resize', this.onWindowResize.bind(this), false)
    }

    start() {
        const self = this;
        this._gameLoop = function () {
            requestAnimationFrame(self._gameLoop);
            self.update();
            self.render();
        }
        this._gameLoop();
    }

    // game logic
    update() {

    }

    //draw scene
    render () {
        this._renderer.render(this._scene, this._camera);
    }

    onWindowResize() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        this._renderer.setSize(width, height);
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
    }

    get renderer() {
        return this._renderer
    }

    get camera() {
        return this._camera
    }

    get scene() {
        return this._scene
    }
}

export default AbstractApplication
