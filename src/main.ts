import { WebGL2Renderer } from "./lib/renderer/webgl-2-renderer";
import { Scene } from "./lib/scene/scene";
import { OrbitCamera } from "./lib/cameras/orbit-camera";
import { AssetLoader } from "./lib/loaders/asset-loader";
import { StandardMesh } from "./lib/meshes/standard-mesh";
import { DirectionalLight } from "./lib/lights/directional-light";

import * as glm from "gl-matrix";

function main(): void {

	let canvas = <HTMLCanvasElement>document.getElementById("webgl-2-canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	let webGL2Renderer = new WebGL2Renderer(canvas);
	webGL2Renderer.setClearColor(0.2, 0.2, 0.2, 1);
	webGL2Renderer.setViewport(0, 0, canvas.width, canvas.height);

	let camera = new OrbitCamera(glm.vec3.create(), 5, 5, 0, 0, canvas);
	let scene = new Scene();
	
	let lightDirectionVector = glm.vec3.create();
	glm.vec3.set(lightDirectionVector, 0.5, -1, 0.5);
	let lightAmbientColor = glm.vec3.create();
	glm.vec3.set(lightAmbientColor, 0.2, 0.2, 0.2);
	let lightDiffuseColor = glm.vec3.create();
	glm.vec3.set(lightDiffuseColor, 2.0, 2.0, 2.0);
	let lightSpecularColor = glm.vec3.create();
	glm.vec3.set(lightSpecularColor, 0.5, 0.5, 0.5);

	let mesh: StandardMesh;
	let directionalLight = new DirectionalLight(lightDirectionVector, lightAmbientColor, lightDiffuseColor, lightSpecularColor);

	let assetsLoaded = function(asset: StandardMesh) {

		mesh = asset;

		mesh.setPosition(0, 0, 0);
		scene.addMesh(asset);
		scene.addDirectionalLight(directionalLight);

		requestAnimationFrame(render);
	}

	var loader = new AssetLoader(webGL2Renderer.getContext());
	loader.loadAsset("/assets/models/cube-normals-test.orl", assetsLoaded);

	let render = function() {

		webGL2Renderer.clearColor();
		webGL2Renderer.render(scene, camera);

		requestAnimationFrame(render);
	}
}

window.onload = () => {

	main();
}

// page 163 -> Sample Program
