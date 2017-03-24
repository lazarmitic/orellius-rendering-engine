import { StandardMesh } from "../meshes/standard-mesh"

export class Scene {

    private _objects: StandardMesh[];

    constructor() {

        this._objects = [];
    }

    public add(mesh: StandardMesh) {

        this._objects.push(mesh);
    }

    public getMeshes() {

        return this._objects;
    }
}