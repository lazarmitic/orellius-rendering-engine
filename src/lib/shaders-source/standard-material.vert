#version 300 es

precision highp float;

layout (location = 0) in vec3 a_Position;
layout (location = 1) in vec2 a_UV;
layout (location = 2) in vec3 a_Normal;

uniform mat4 u_ModelMatrix;
uniform mat4 u_ProjectionMatrix;
uniform mat4 u_ViewMatrix;

out vec2 v_UV;
out vec3 v_Normal;
out vec3 v_FragmentPosition;

void main() {

	gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position.x, a_Position.y, a_Position.z, 1);
	v_UV = a_UV;
	v_Normal = a_Normal;
	v_FragmentPosition = vec3(u_ModelMatrix * vec4(a_Position, 1));
}
