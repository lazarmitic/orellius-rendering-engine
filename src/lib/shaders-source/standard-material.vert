#version 300 es

precision highp float;

layout (location = 0) in vec3 a_Position;
layout (location = 1) in vec2 a_UV;
layout (location = 2) in vec3 a_Normal;
layout (location = 3) in vec3 a_Tangent;
layout (location = 4) in vec3 a_Bitangent;

uniform mat4 u_ModelMatrix;
uniform mat4 u_ProjectionMatrix;
uniform mat4 u_ViewMatrix;

out vec2 v_UV;
out vec3 v_Normal;
out vec3 v_FragmentPosition;
out mat3 v_TBNMatrix;

void main() {

	gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position.x, a_Position.y, a_Position.z, 1);
	v_UV = a_UV;
	v_Normal = a_Normal;
	v_FragmentPosition = vec3(u_ModelMatrix * vec4(a_Position, 1));

	vec3 T = normalize(vec3(u_ModelMatrix * vec4(a_Tangent, 0.0)));
	vec3 B = normalize(vec3(u_ModelMatrix * vec4(a_Bitangent, 0.0)));
	vec3 N = normalize(vec3(u_ModelMatrix * vec4(a_Normal, 0.0)));
	v_TBNMatrix = mat3(T, B, N);
}
