uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float colorOffset;
uniform float colorMultiplier;

varying float vElevation;

//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//



void main() {
    float colorStregth = (vElevation * colorMultiplier) + colorOffset;
    vec3 color = mix(uDepthColor, uSurfaceColor, colorStregth);
    
    gl_FragColor = vec4(color, 1.0);
}