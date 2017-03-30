export class StandardGeometry {

	private _vertices: Float32Array;
	private _indices: Uint16Array;

	constructor() {

	}

	get vertices(): Float32Array {
		return this._vertices;
	}
	set vertices(vertices: Float32Array) {
		this._vertices = vertices;
	}

	get indices(): Uint16Array {
		return this._indices;
	}
	set indices(indices: Uint16Array) {
		this._indices = indices;
	}
}