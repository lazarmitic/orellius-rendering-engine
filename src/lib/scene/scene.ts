import { StandardMesh } from "../meshes/standard-mesh"
import { DirectionalLight } from "../lights/directional-light";
import { PointLight } from "../lights/point-light";

export class Scene {

	private _meshes: StandardMesh[];
	private _directionalLights: DirectionalLight[];
	private _pointLights: PointLight[];

	constructor() {

		this._meshes = [];
		this._directionalLights = [];
		this._pointLights = [];
	}

	public addMesh(mesh: StandardMesh) {

		this._meshes.push(mesh);
	}

	public addDirectionalLight(directionalLight: DirectionalLight) {

		this._directionalLights.push(directionalLight);
	}

	public addPointLight(pointLight: PointLight) {

		this._pointLights.push(pointLight);
	}

	get meshes(): StandardMesh[] {
		return this._meshes;
	}
	get directionalLights(): DirectionalLight[] {
		return this._directionalLights;
	}
	get pointLights(): PointLight[] {
		return this._pointLights;
	}
}