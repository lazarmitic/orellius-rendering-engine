import { WebGL2Renderer } from "./lib/renderer/webgl-2-renderer";
import { Scene } from "./lib/scene/scene";
import { StandardMaterial } from "./lib/materials/standard-material";
import { StandardGeometry } from "./lib/geometries/standard-geometry";
import { StandardMesh } from "./lib/meshes/standard-mesh";
import { PerspectiveCamera } from "./lib/cameras/perspective-camera";
import { TextureLoader } from "./lib/loaders/texture-loader";
import { StandardTexture } from "./lib/textures/standard-texture";

function main(): void {

	let canvas = <HTMLCanvasElement>document.getElementById("webgl-2-canvas");

	let webGL2Renderer = new WebGL2Renderer(canvas);
	webGL2Renderer.setClearColor(0.0, 0.3, 0.0, 1);
	webGL2Renderer.setViewport(0, 0, canvas.width, canvas.height);

	let catTexture = new StandardTexture(webGL2Renderer.getContext());
	let loadedImage: HTMLImageElement;

	let onTexturesLoaded = function(images: HTMLImageElement[]) {

		loadedImage = images[0];

		requestAnimationFrame(render);
	}

	let textureLoader = new TextureLoader();
	textureLoader.loadTextures(["/assets/images/cat.jpg"], onTexturesLoaded);

	let standardMaterial = new StandardMaterial(webGL2Renderer.getContext());
	let standardGeometry = new StandardGeometry();

	let standardMesh1 = new StandardMesh(webGL2Renderer.getContext(), standardMaterial, standardGeometry);
	standardMesh1.setPosition(-0.5, 0.0, 0.0);

	let standardMesh2 = new StandardMesh(webGL2Renderer.getContext(), standardMaterial, standardGeometry);
	standardMesh2.setPosition(0.5, 0.0, 0.0);

	let scene = new Scene();
	scene.add(standardMesh1);
	scene.add(standardMesh2);

	let camera = new PerspectiveCamera(canvas.width / canvas.height);

	let render = function() {

		webGL2Renderer.clearColor();
		webGL2Renderer.render(scene, camera, catTexture, loadedImage);

		requestAnimationFrame(render);
	}
}

window.onload = () => {

	main();
}

// page 163 -> Sample Program
