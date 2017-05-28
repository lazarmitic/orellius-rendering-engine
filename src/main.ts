import { WebGL2Renderer } from "./lib/renderer/webgl-2-renderer";
import { Scene } from "./lib/scene/scene";
import { OrbitCamera } from "./lib/cameras/orbit-camera";
import { AssetLoader } from "./lib/loaders/asset-loader";
import { StandardMesh } from "./lib/meshes/standard-mesh";
import { DirectionalLight } from "./lib/lights/directional-light";
//import { PointLight } from "./lib/lights/point-light";
//import { SpotLight } from "./lib/lights/spot-light";

import * as glm from "gl-matrix";

function main(): void {

	let canvas = <HTMLCanvasElement>document.getElementById("webgl-2-canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	let webGL2Renderer = new WebGL2Renderer(canvas);
	webGL2Renderer.setClearColor(0.2, 0.2, 0.2, 1);
	webGL2Renderer.setViewport(0, 0, canvas.width, canvas.height);

	let camera = new OrbitCamera(glm.vec3.create(), 25, 5, 0, 0, canvas);
	let scene = new Scene();
	
	let lightDirectionVector = glm.vec3.create();
	glm.vec3.set(lightDirectionVector, -0.5, -1.0, 0.5);
	glm.vec3.normalize(lightDirectionVector, lightDirectionVector);
	let lightAmbientColor = glm.vec3.create();
	glm.vec3.set(lightAmbientColor, 0.1, 0.1, 0.1);
	let lightDiffuseColor = glm.vec3.create();
	glm.vec3.set(lightDiffuseColor, 1.0, 1.0, 1.0);
	let lightSpecularColor = glm.vec3.create();
	glm.vec3.set(lightSpecularColor, 0.5, 0.5, 0.5);

	let lightDirectionVector2 = glm.vec3.create();
	glm.vec3.set(lightDirectionVector2, -0.5, -1, -0.5);
	let lightAmbientColor2 = glm.vec3.create();
	glm.vec3.set(lightAmbientColor2, 0.1, 0.1, 0.1);
	let lightDiffuseColor2 = glm.vec3.create();
	glm.vec3.set(lightDiffuseColor2, 1.0, 0.0, 1.0);
	let lightSpecularColor2 = glm.vec3.create();
	glm.vec3.set(lightSpecularColor2, 0.5, 0.5, 0.5);

	let pointLightPosition1 = glm.vec3.create();
	glm.vec3.set(pointLightPosition1, 0, 10, 0);

	let pointLightPosition2 = glm.vec3.create();
	glm.vec3.set(pointLightPosition2, -5, 5, -5);

	/*let pointLightConstant = 1;
	let pointLightLinear = 0.022;
	let pointLightQuadratic = 0.0019;*/

	let mesh: StandardMesh;
	let directionalLight = new DirectionalLight(lightDirectionVector, lightAmbientColor, lightDiffuseColor, lightSpecularColor);
	/*let directionalLight2 = new DirectionalLight(lightDirectionVector2, lightAmbientColor2, lightDiffuseColor2, lightSpecularColor2);

	let pointLight1 = new PointLight(pointLightPosition1, pointLightConstant, pointLightLinear, pointLightQuadratic,
										lightAmbientColor, lightDiffuseColor, lightSpecularColor);
	let pointLight2 = new PointLight(pointLightPosition2, pointLightConstant, pointLightLinear, pointLightQuadratic,
										lightAmbientColor2, lightDiffuseColor2, lightSpecularColor2);
	
	let spotLight1 = new SpotLight(pointLightPosition1, lightDirectionVector, Math.cos(0.2181662), Math.cos(0.3054326), 1.0, 0.09, 0.032,
									lightAmbientColor, lightDiffuseColor, lightSpecularColor);*/


	let assetsLoaded = function(asset: StandardMesh) {

		mesh = asset;

		mesh.setPosition(0, 0, 0);
		scene.addMesh(asset);
		scene.addDirectionalLight(directionalLight);
		//scene.addDirectionalLight(directionalLight2);
		//scene.addPointLight(pointLight1);
		//scene.addPointLight(pointLight2);
		//scene.addSpotLight(spotLight1);

		requestAnimationFrame(render);
	}

	var loader = new AssetLoader(webGL2Renderer.getContext());
	loader.loadAsset("/assets/models/base64-test.orl", assetsLoaded);

	let render = function() {

		webGL2Renderer.clearColor();
		webGL2Renderer.render(scene, camera);

		requestAnimationFrame(render);
	}
}

window.onload = () => {

	main();
}
