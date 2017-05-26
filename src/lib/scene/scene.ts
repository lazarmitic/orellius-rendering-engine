import { StandardMesh } from "../meshes/standard-mesh"
import { Light } from "../lights/abstract/light";

export class Scene {

	private _meshes: StandardMesh[];
	private _directionalLights: Light[];

	constructor() {

		this._meshes = [];
		this._directionalLights = [];
	}

	public addMesh(mesh: StandardMesh) {

		this._meshes.push(mesh);
	}

	public addDirectionalLight(light: Light) {

		this._directionalLights.push(light);
	}

	get meshes(): StandardMesh[] {
		return this._meshes;
	}
	get directionalLights(): Light[] {
		return this._directionalLights;
	}
}