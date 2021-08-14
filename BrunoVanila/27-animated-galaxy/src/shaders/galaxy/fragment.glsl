varying vec3 vColor;

void main() {

    // Disc
    // float strength = distance(gl_PointCoord, vec2(0.5)); //odległość od środka
    // strength = step(0.5, strength); //ograniczamy do max 0.5 od środka aby powstało kółko
    // strength = strength; //odwracamy kolory
     
     // Difuse disc
    //   float strength = distance(gl_PointCoord, vec2(0.5));
    //   strength *=2.0; //rozproszenie
    //   strength = 1.0 -strength; // odwracamy kolory

    // Light point
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 5.0);

    vec3 color = mix(vec3(0.0,0.0,0.0), vColor, strength);

     gl_FragColor = vec4(color, 1.0);
}