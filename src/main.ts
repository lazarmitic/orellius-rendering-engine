import { WebGL2Renderer } from "./lib/renderer/webgl-renderer";
import { Scene } from "./lib/scene/scene";
import { StandardMaterial } from "./lib/materials/standard-material";
import { StandardMesh } from "./lib/meshes/standard-mesh";

function main(): void {

	let canvas = <HTMLCanvasElement>document.getElementById("webgl-2-canvas");

	let webGL2Renderer = new WebGL2Renderer(canvas);
	webGL2Renderer.setClearColor(0.0, 0.0, 0.0, 1);
	
	/*let pointMaterial = new PointMaterial(webGL2Renderer.getContext());
	pointMaterial.color = new Color4(0, 1, 0, 1);

	let pointMaterial2 = new PointMaterial(webGL2Renderer.getContext());
	pointMaterial2.color = new Color4(1, 0, 0, 1);*/

	/*let pointMesh = new PointMesh();
	pointMesh.setPosition(0, 0.5, 0);
	pointMesh.setMaterial(pointMaterial);
	pointMesh.setSize(50);

	let pointMesh2 = new PointMesh();
	pointMesh2.setPosition(0.5, 0, 0);
	pointMesh2.setMaterial(pointMaterial2);
	pointMesh2.setSize(20);*/

	let standardMaterial = new StandardMaterial(webGL2Renderer.getContext());

	let standardMesh = new StandardMesh(webGL2Renderer.getContext());
	standardMesh.setMaterial(standardMaterial);
	standardMesh.setPosition(0, 0, 0);

	let scene = new Scene();
	scene.add(standardMesh);
	//scene.add(pointMesh2);

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