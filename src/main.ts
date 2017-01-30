import { WebGLRenderer } from "./lib/renderer/webgl-renderer";
import { PointMesh } from "./lib/meshes/point-mesh"
import { PointMaterial } from "./lib/materials/point-material"
import { Scene } from "./lib/scene/scene"

function main(): void {

    let canvas = <HTMLCanvasElement>document.getElementById("webgl-canvas");

    let webGLRenderer = new WebGLRenderer(canvas);
    webGLRenderer.setClearColor(0.39, 0.58, 0.93, 1);
    
    let pointMaterial = new PointMaterial(webGLRenderer.getContext());
    pointMaterial.setColor(1, 0, 0, 1);

    let pointMesh = new PointMesh();
    pointMesh.setPosition(0, 0, 0);
    pointMesh.setMaterial(pointMaterial);

    let scene = new Scene();
    scene.add(pointMesh);

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