import { StandardMesh } from "../meshes/standard-mesh"
import { DirectionalLight } from "../lights/directional-light";
import { PointLight } from "../lights/point-light";
import { SpotLight } from "../lights/spot-light";

export class Scene {

	private _meshes: StandardMesh[];
	private _directionalLights: DirectionalLight[];
	private _pointLights: PointLight[];
	private _spotLights: SpotLight[];

	constructor() {

		this._meshes = [];
		this._directionalLights = [];
		this._pointLights = [];
		this._spotLights = [];
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

	public addSpotLight(spotLight: SpotLight) {

		this._spotLights.push(spotLight);
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
	get spotLights(): SpotLight[] {
		return this._spotLights;
	}
}