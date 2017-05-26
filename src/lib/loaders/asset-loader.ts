import { StandardMesh } from "./../meshes/standard-mesh";
import { StandardGeometry } from "./../geometries/standard-geometry";
import { StandardMaterial } from "./../materials/standard-material";
import { TextureLoader } from "./texture-loader";
import { StandardTexture } from "./../textures/standard-texture";

export class AssetLoader {

	private _gl: WebGL2RenderingContext;

	private _meshName: string;
	private _vertices: any[];
	private _indieces: any[];
	private _diffuseTextureName: string;
	private _vbo: Float32Array;
	private _ebo: Uint16Array;
	private _callback: Function;
	private _mesh: StandardMesh;
	private _textureLoader: TextureLoader;

	constructor(gl: WebGL2RenderingContext) {

		this._gl = gl;
		this._vertices = [];
		this._indieces = [];
		this._textureLoader = new TextureLoader();
	}

	public loadAsset(assetURL: string, callback: Function) {
		
		this._callback = callback;

		let xhttp = new XMLHttpRequest();

		xhttp.onreadystatechange = () => {

			if (xhttp.readyState === 4 && xhttp.status === 200) {

				this._mesh = this._createMeshFromFileData(xhttp.responseText);

				this._textureLoader.loadTextures([ this._diffuseTextureName ], this._texturesLoaded.bind(this));
			}
		};
		xhttp.open("GET", assetURL, true);
		xhttp.send();
	}

	private _texturesLoaded(images: HTMLImageElement[]) {

		let texture = new StandardTexture(this._gl);

		this._mesh.material.image = images[0];
		this._mesh.material.texture = texture;

		this._callback(this._mesh);
	}

	private _createMeshFromFileData(file: string): StandardMesh {

		this._parseFileData(file);
		this._generateVbo();
		this._generateEbo();

		let standardMaterial = new StandardMaterial(this._gl);
		let standardGeometry = new StandardGeometry();
		standardGeometry.vertices = this._vbo;
		standardGeometry.indices = this._ebo;

		let standardMesh = new StandardMesh(this._gl, standardMaterial, standardGeometry);

		return standardMesh;
	}

	private _parseFileData(file: string) {

		let textFileLines = file.split("\n");

		for(let i = 0; i < textFileLines.length; i++) {

			this._parseLineData(textFileLines[i]);
		}
	}

	private _parseLineData(line: string) {

		let lineSplited = line.split(/ (.+)/);

		if(lineSplited[0] === "mesh") {

			this._meshName = lineSplited[1];
		}
		else if(lineSplited[0] === "v") {

			this._vertices.push(lineSplited[1]);
		}
		else if(lineSplited[0] === "diffuseTexture") {

			this._diffuseTextureName = lineSplited[1];
		}
		else if(lineSplited[0] === "i") {

			let indieces = lineSplited[1].split(" ");

			for(let i = 0; i < indieces.length; i++) {

				this._indieces.push(indieces[i]);
			}
		}
	}

	private _generateVbo() {

		this._vbo = new Float32Array(this._vertices.length * 8);

		for(let i = 0; i < this._vertices.length; i++) {

			let vertexDataSplited = this._vertices[i].split(" ");

			this._vbo[i * 8] = vertexDataSplited[0];
			this._vbo[i * 8 + 1] = vertexDataSplited[1];
			this._vbo[i * 8 + 2] = vertexDataSplited[2];
			this._vbo[i * 8 + 3] = vertexDataSplited[3];
			this._vbo[i * 8 + 4] = vertexDataSplited[4];
			this._vbo[i * 8 + 5] = vertexDataSplited[5];
			this._vbo[i * 8 + 6] = vertexDataSplited[6];
			this._vbo[i * 8 + 7] = vertexDataSplited[7];
		}
	}

	private _generateEbo() {

		this._ebo = new Uint16Array(this._indieces.length);

		for(let i = 0; i < this._indieces.length; i++) {

			this._ebo[i] = this._indieces[i];
		}
	}
}
