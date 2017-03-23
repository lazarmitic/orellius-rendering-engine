precision highp float;

attribute vec3 a_Position;

uniform mat4 u_ModelMatrix;

void main() {

	gl_Position = u_ModelMatrix * vec4(a_Position.x, a_Position.y, a_Position.z, 1);
}
