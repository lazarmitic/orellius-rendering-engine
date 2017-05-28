import { StandardMesh } from "./../meshes/standard-mesh";
import { StandardGeometry } from "./../geometries/standard-geometry";
import { StandardMaterial } from "./../materials/standard-material";
import { StandardTexture } from "./../textures/standard-texture";

import * as glm from "gl-matrix";

export class AssetLoader {

	private _gl: WebGL2RenderingContext;

	private _meshName: string;
	private _vertices: any[];
	private _indieces: any[];
	private _diffuseTextureImage: HTMLImageElement;
	private _specularTextureImage: HTMLImageElement;
	private _normalTextureImage: HTMLImageElement;
	private _vbo: Float32Array;
	private _ebo: Uint16Array;
	private _callback: Function;
	private _mesh: StandardMesh;

	constructor(gl: WebGL2RenderingContext) {

		this._gl = gl;
		this._vertices = [];
		this._indieces = [];
	}

	public loadAsset(assetURL: string, callback: Function) {
		
		this._callback = callback;

		let xhttp = new XMLHttpRequest();

		xhttp.onreadystatechange = () => {

			if (xhttp.readyState === 4 && xhttp.status === 200) {

				this._mesh = this._createMeshFromFileData(xhttp.responseText);

				let diffuseTexture = new StandardTexture(this._gl);
				let specularTexture = new StandardTexture(this._gl);
				let normalTexture = new StandardTexture(this._gl);

				this._mesh.material.diffuseImage = this._diffuseTextureImage;
				this._mesh.material.diffuseTexture = diffuseTexture;
				this._mesh.material.specularImage = this._specularTextureImage;
				this._mesh.material.specularTexture = specularTexture;
				this._mesh.material.normalImage = this._normalTextureImage;
				this._mesh.material.normalTexture = normalTexture;

				this._mesh.material.createTextures();

				this._callback(this._mesh);

				//this._textureLoader.loadTextures([ this._diffuseTextureName ], this._texturesLoaded.bind(this));
			}
		};
		xhttp.open("GET", assetURL, true);
		xhttp.send();
	}

	/*private _texturesLoaded(images: HTMLImageElement[]) {

		let texture = new StandardTexture(this._gl);

		this._mesh.material.image = images[0];
		this._mesh.material.texture = texture;

		this._callback(this._mesh);
	}*/

	private _createMeshFromFileData(file: string): StandardMesh {

		this._parseFileData(file);
		this._generateVbo();
		this._generateEbo();
		this._generateTangentsAndBitangents();

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

			this._diffuseTextureImage = new Image();
			this._diffuseTextureImage.src = lineSplited[1];
		}
		else if(lineSplited[0] === "specularTexture") {

			this._specularTextureImage = new Image();
			this._specularTextureImage.src = lineSplited[1];
		}
		else if(lineSplited[0] === "normalTexture") {

			this._normalTextureImage = new Image();
			this._normalTextureImage.src = lineSplited[1];
		}
		else if(lineSplited[0] === "i") {

			let indieces = lineSplited[1].split(" ");

			for(let i = 0; i < indieces.length; i++) {

				this._indieces.push(indieces[i]);
			}
		}
	}

	private _generateVbo() {

		this._vbo = new Float32Array(this._vertices.length * 14);

		for(let i = 0; i < this._vertices.length; i++) {

			let vertexDataSplited = this._vertices[i].split(" ");

			this._vbo[i * 14] = vertexDataSplited[0];
			this._vbo[i * 14 + 1] = vertexDataSplited[1];
			this._vbo[i * 14 + 2] = vertexDataSplited[2];
			this._vbo[i * 14 + 3] = vertexDataSplited[3];
			this._vbo[i * 14 + 4] = vertexDataSplited[4];
			this._vbo[i * 14 + 5] = vertexDataSplited[5];
			this._vbo[i * 14 + 6] = vertexDataSplited[6];
			this._vbo[i * 14 + 7] = vertexDataSplited[7];
		}
	}

	private _generateEbo() {

		this._ebo = new Uint16Array(this._indieces.length);

		for(let i = 0; i < this._indieces.length; i++) {

			this._ebo[i] = this._indieces[i];
		}
	}

	private _generateTangentsAndBitangents() {

		for(var i = 0; i < this._ebo.length; i += 3) {

			let pos1 = glm.vec3.create();
			pos1 = glm.vec3.set(pos1, this._vbo[this._ebo[i] * 14], this._vbo[this._ebo[i] * 14 + 1], this._vbo[this._ebo[i] * 14 + 2]);
			let pos2 = glm.vec3.create();
			pos2 = glm.vec3.set(pos2, this._vbo[(this._ebo[i + 1]) * 14], this._vbo[(this._ebo[i + 1]) * 14 + 1], this._vbo[(this._ebo[i + 1]) * 14 + 2]);
			let pos3 = glm.vec3.create();
			pos3 = glm.vec3.set(pos3, this._vbo[(this._ebo[i + 2]) * 14], this._vbo[(this._ebo[i + 2]) * 14 + 1], this._vbo[(this._ebo[i + 2]) * 14 + 2]);

			let uv1 = glm.vec2.create();
			uv1 = glm.vec2.set(uv1, this._vbo[this._ebo[i] * 14 + 3], this._vbo[this._ebo[i] * 14 + 4]);
			let uv2 = glm.vec2.create();
			uv2 = glm.vec2.set(uv2, this._vbo[(this._ebo[i + 1]) * 14 + 3], this._vbo[(this._ebo[i + 1]) * 14 + 4]);
			let uv3 = glm.vec2.create();
			uv3 = glm.vec2.set(uv3, this._vbo[(this._ebo[i + 2]) * 14 + 3], this._vbo[(this._ebo[i + 2]) * 14 + 4]);

			var result = this._calculateVertexTangendAndBitangent(pos1, pos2, pos3, uv1, uv2, uv3);

			this._vbo[this._ebo[i] * 14 + 8] = result.tangent[0];
			this._vbo[this._ebo[i] * 14 + 9] = result.tangent[1];
			this._vbo[this._ebo[i] * 14 + 10] = result.tangent[2];
			this._vbo[this._ebo[i] * 14 + 11] = result.bitangent[0];
			this._vbo[this._ebo[i] * 14 + 12] = result.bitangent[1];
			this._vbo[this._ebo[i] * 14 + 13] = result.bitangent[2];

			this._vbo[(this._ebo[i + 1]) * 14 + 8] = result.tangent[0];
			this._vbo[(this._ebo[i + 1]) * 14 + 9] = result.tangent[1];
			this._vbo[(this._ebo[i + 1]) * 14 + 10] = result.tangent[2];
			this._vbo[(this._ebo[i + 1]) * 14 + 11] = result.bitangent[0];
			this._vbo[(this._ebo[i + 1]) * 14 + 12] = result.bitangent[1];
			this._vbo[(this._ebo[i + 1]) * 14 + 13] = result.bitangent[2];

			this._vbo[(this._ebo[i + 2]) * 14 + 8] = result.tangent[0];
			this._vbo[(this._ebo[i + 2]) * 14 + 9] = result.tangent[1];
			this._vbo[(this._ebo[i + 2]) * 14 + 10] = result.tangent[2];
			this._vbo[(this._ebo[i + 2]) * 14 + 11] = result.bitangent[0];
			this._vbo[(this._ebo[i + 2]) * 14 + 12] = result.bitangent[1];
			this._vbo[(this._ebo[i + 2]) * 14 + 13] = result.bitangent[2];
		}
	}

	private _calculateVertexTangendAndBitangent(pos1: glm.vec3, pos2: glm.vec3, pos3: glm.vec3,
												uv1: glm.vec2, uv2: glm.vec2, uv3: glm.vec2) {

		let triangleEdgeXY = glm.vec3.create();
		triangleEdgeXY = glm.vec3.subtract(triangleEdgeXY, pos2, pos1);
		let triangleEdgeXZ = glm.vec3.create();
		triangleEdgeXZ = glm.vec3.subtract(triangleEdgeXZ, pos3, pos1);

		let deltaUV1 = glm.vec2.create();
		deltaUV1 = glm.vec2.subtract(deltaUV1, uv2, uv1);
		let deltaUV2 = glm.vec2.create();
		deltaUV2 = glm.vec2.subtract(deltaUV2, uv3, uv1);

		let f = 1 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);

		let tangent = glm.vec3.create();
		tangent[0] = f * (deltaUV2[1] * triangleEdgeXY[0] - deltaUV1[1] * triangleEdgeXZ[0]);
		tangent[1] = f * (deltaUV2[1] * triangleEdgeXY[1] - deltaUV1[1] * triangleEdgeXZ[1]);
		tangent[2] = f * (deltaUV2[1] * triangleEdgeXY[2] - deltaUV1[1] * triangleEdgeXZ[2]);
		tangent = glm.vec3.normalize(tangent, tangent);

		let bitangent = glm.vec3.create();
		bitangent[0] = f * (-deltaUV2[0] * triangleEdgeXY[0] + deltaUV1[0] * triangleEdgeXZ[0]);
		bitangent[1] = f * (-deltaUV2[0] * triangleEdgeXY[1] + deltaUV1[0] * triangleEdgeXZ[1]);
		bitangent[2] = f * (-deltaUV2[0] * triangleEdgeXY[2] + deltaUV1[0] * triangleEdgeXZ[2]);
		bitangent = glm.vec3.normalize(bitangent, bitangent);

		return { tangent, bitangent };
	}
}
