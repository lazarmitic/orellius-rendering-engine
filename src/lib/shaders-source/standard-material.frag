#version 300 es

precision highp float;

struct DirectionalLight {

	vec3 directionVector;
	vec3 ambientColor;
	vec3 diffuseColor;
	vec3 specularColor;
};
uniform DirectionalLight directionalLights[5];
uniform int numberOfActiveDirectionalLights;

vec3 calculateDirectionalLight(DirectionalLight directionalLight, vec3 normal, vec3 fragmentToCameraDirection);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

uniform sampler2D u_DiffuseTexture;
uniform vec3 u_viewPosition;

in vec2 v_UV;
in vec3 v_Normal;
in vec3 v_FragmentPosition;

out vec4 o_fragColor;

// specify this as light uniform values
//vec3 lightColor = vec3(1.0, 1.0, 1.0);
//vec3 lightPosition = vec3(3.0, 3.0, 3.0);
//vec3 ambientColor = vec3(0.3, 0.3, 0.3);

// specify this as material uniform values
//vec3 objectColor = vec3(0.3, 0.3, 0.0);
//float specularStrength = 1.0;

void main() {

	vec3 normalizedNormal = normalize(v_Normal);
	//vec3 fragmentToLightDirection = normalize(lightPosition - v_FragmentPosition);
	//float diffuseImpact = max(dot(normalizedNormal, fragmentToLightDirection), 0.0);
	//vec3 diffuseColor = diffuseImpact * lightColor;

	vec3 fragmentToViewDirection = normalize(u_viewPosition - v_FragmentPosition);
	//vec3 reflectDirection = reflect(-fragmentToLightDirection, normalizedNormal);
	//float spec = pow(max(dot(fragmentToViewDirection, reflectDirection), 0.0), 32.0);
	//vec3 specular = specularStrength * spec * lightColor;

	//vec3 finalColor = ambientColor + diffuseColor + specular;

	//o_fragColor = vec4(finalColor, 1.0) * texture(u_DiffuseTexture, v_UV);

	//o_fragColor = vec4(u_viewPosition.x / 10.0, u_viewPosition.y / 10.0, u_viewPosition.z / 10.0, 1.0);

	vec3 result = vec3(0.0, 0.0, 0.0);

	for(int i = 0; i < numberOfActiveDirectionalLights; i++) {

		result += calculateDirectionalLight(directionalLights[i], normalizedNormal, fragmentToViewDirection);
	}

	o_fragColor = vec4(result, 1.0);
}

vec3 calculateDirectionalLight(DirectionalLight directionalLight, vec3 fragmentNormal, vec3 fragmentToCameraDirection) {

	vec3 fragmentToLightDirection = normalize(-directionalLight.directionVector);
	vec3 fragmentToLightDirectionReflected = reflect(-fragmentToLightDirection, fragmentNormal);

	// Diffuse factor
	float diffuseFactor = max(dot(fragmentNormal, fragmentToLightDirection), 0.0);

	// Specular factor
	float specularFactor = pow(max(dot(fragmentToCameraDirection, fragmentToLightDirectionReflected), 0.0), 32.0);

	// Combine results
	vec3 ambient = directionalLight.ambientColor * vec3(texture(u_DiffuseTexture, v_UV));
	vec3 diffuse = directionalLight.diffuseColor * diffuseFactor * vec3(texture(u_DiffuseTexture, v_UV));
	vec3 specular = directionalLight.specularColor * specularFactor * vec3(0.5, 0.5, 0.5);

	return ambient + diffuse + specular;
}


// Ideas for lightning 

// 1. Every light in scene should have ambient farctor, more light in scene = stringer ambient light.
//    If all lights have different colors, resulting ambient should be combination of those colors,
//    based on ambient factor.