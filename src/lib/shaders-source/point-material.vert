precision highp float;

attribute vec3 a_Position;
attribute float a_Size;

void main() {

	gl_Position = vec4(a_Position.x, a_Position.y, a_Position.z, 1.0);
	gl_PointSize = a_Size;
}
