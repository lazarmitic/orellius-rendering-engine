import { WebGL2Renderer } from "./lib/renderer/webgl-renderer";
import { Scene } from "./lib/scene/scene";
import { StandardMaterial } from "./lib/materials/standard-material";
import { StandardGeometry } from "./lib/geometries/StandardGeometry"
import { StandardMesh } from "./lib/meshes/standard-mesh";

function main(): void {

	let canvas = <HTMLCanvasElement>document.getElementById("webgl-2-canvas");

	let webGL2Renderer = new WebGL2Renderer(canvas);
	webGL2Renderer.setClearColor(0.0, 0.0, 0.0, 1);
	
	let standardMaterial = new StandardMaterial(webGL2Renderer.getContext());
	let standardGeometry = new StandardGeometry();

	let standardMesh1 = new StandardMesh(webGL2Renderer.getContext(), standardMaterial, standardGeometry);
	standardMesh1.setPosition(-0.5, 0.0, 0.0);

	let standardMesh2 = new StandardMesh(webGL2Renderer.getContext(), standardMaterial, standardGeometry);
	standardMesh2.setPosition(0.5, 0.0, 0.0);

	let scene = new Scene();
	scene.add(standardMesh1);
	scene.add(standardMesh2);

	let render = function() {

		webGL2Renderer.clearColor();
		webGL2Renderer.render(scene);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

window.onload = () => {

	main();
}

// page 30;