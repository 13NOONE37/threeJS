precision mediump float;

// varying float vRandom;

uniform vec3 uColor;
uniform sampler2D uTexture;
varying vec2 vUV;
varying float vElevation;

void main()
{
  vec4 textureColor = texture2D(uTexture, vUV);
  textureColor.r*=vElevation*2.0+0.9;
  textureColor.g*=vElevation*2.0+0.9;
  textureColor.b*=vElevation*2.0+0.9;

  gl_FragColor = textureColor;

    // vec3 purpleColor = vec3(0.0);
    // purpleColor.r = 0.5;
    // purpleColor.b = 1.0;
        // gl_FragColor = vec4(uColor, 1.0);
    // gl_FragColor = vec4(vRandom, vRandom *0.8, 1.0, 1.0);
}