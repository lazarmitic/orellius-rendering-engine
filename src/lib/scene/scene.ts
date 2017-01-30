import { Mesh } from "../meshes/mesh"

export class Scene {

    private _objects: Mesh[];

    constructor() {

        this._objects = [];
    }

    public add(mesh: Mesh) {

        this._objects.push(mesh);
    }

    public getMeshes() {

        return this._objects;
    }
}