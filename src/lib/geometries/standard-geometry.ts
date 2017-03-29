export class StandardGeometry {

	private _vertices: Float32Array;
	private _indices: Uint16Array;

	constructor() {

		this._indices = new Uint16Array([
			0, 1, 2,
			3, 4, 5,
			6, 7, 8,
			9, 10, 11,
			12, 13, 14,
			15, 16, 17,
			18, 19, 20,
			21, 22, 23,
			24, 25, 26,
			27, 28, 29,
			30, 31, 32,
			33, 34, 35
		]);
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
}