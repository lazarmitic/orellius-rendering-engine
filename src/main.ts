import { WebGL2Renderer } from "./lib/renderer/webgl-2-renderer";
import { Scene } from "./lib/scene/scene";
import { OrbitCamera } from "./lib/cameras/orbit-camera";
import { AssetLoader } from "./lib/loaders/asset-loader";
import { StandardMesh } from "./lib/meshes/standard-mesh";

import * as glm from "gl-matrix";

function main(): void {

	let canvas = <HTMLCanvasElement>document.getElementById("webgl-2-canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	let webGL2Renderer = new WebGL2Renderer(canvas);
	webGL2Renderer.setClearColor(0.0, 0.3, 0.0, 1);
	webGL2Renderer.setViewport(0, 0, canvas.width, canvas.height);

	let cameraTarget = glm.vec3.create();
	glm.vec3.set(cameraTarget, 0, 0, 0);
	let camera = new OrbitCamera(cameraTarget, 30, 10, 0, 0, canvas);

	let scene = new Scene();

	let mesh: StandardMesh;

	let assetsLoaded = function(asset: StandardMesh) {

		mesh = asset;

		asset.setPosition(0, 0, 0);
		scene.add(asset);

		requestAnimationFrame(render);
	}

	var loader = new AssetLoader(webGL2Renderer.getContext());
	loader.loadAsset("/assets/models/cube_complex.orl", assetsLoaded);

	let render = function() {

		webGL2Renderer.clearColor();
		webGL2Renderer.render(scene, camera);

		//mesh.rotate();

		requestAnimationFrame(render);
	}
}

window.onload = () => {

	main();
}

// page 163 -> Sample Program
