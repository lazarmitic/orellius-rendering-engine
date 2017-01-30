import { WebGLRenderer } from "./lib/renderer/webgl-renderer";
import { PointMesh } from "./lib/meshes/point-mesh"
import { PointMaterial } from "./lib/materials/point-material"
import { Scene } from "./lib/scene/scene"

function main(): void {

	let canvas = <HTMLCanvasElement>document.getElementById("webgl-canvas");

	let webGLRenderer = new WebGLRenderer(canvas);
	webGLRenderer.setClearColor(0.0, 0.0, 0.0, 1);
	
	let pointMaterial = new PointMaterial(webGLRenderer.getContext());
	pointMaterial.setColor(1, 0, 0, 1);

	let pointMaterial2 = new PointMaterial(webGLRenderer.getContext());
	pointMaterial.setColor(0, 1, 0, 1);

	let pointMesh = new PointMesh();
	pointMesh.setPosition(0, 0.5, 0);
	pointMesh.setMaterial(pointMaterial);
	pointMesh.setSize(50);

	let pointMesh2 = new PointMesh();
	pointMesh2.setPosition(0.5, 0, 0);
	pointMesh2.setMaterial(pointMaterial2);
	pointMesh2.setSize(3);

	let scene = new Scene();
	scene.add(pointMesh);
	scene.add(pointMesh2);

	let render = function() {

		webGLRenderer.clearColor();
		webGLRenderer.render(scene);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

window.onload = () => {

	main();
}

// page 30;