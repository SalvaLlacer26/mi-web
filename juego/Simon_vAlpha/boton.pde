class boton {

  int id; 

  float x;
  float y;
  float tam;

  color Color;
  color ColorOff;

  boolean botonEncendido = false;

  boton(int tempId, float tempX, float tempY, float tempSize, color tempColor) {

    id = tempId;
    x = tempX;
    y = tempY;
    tam = tempSize;
    Color = tempColor;

    ColorOff = lerpColor(0, Color, 0.5);
  }

  void display() {
    
    ellipseMode(CENTER);
    strokeWeight(20);

    float radioSec = 100;
    float distSec = dist(mouseX, mouseY, 400, 400);

    if (botonEncendido) {
      fill(Color);
    } else {
      fill(ColorOff);
    }

    rect(x, y, tam, tam);

if(turnoSimon==false){
    if (distSec > radioSec) {
      if (mouseX > x && mouseX < (x + tam) && mouseY > y && mouseY < (y + tam)) {
        fill(255, 30); //OJOOOO
        rect(x, y, tam, tam);
      }
    }
  }
    image(fondo, 0, 0, 800, 800);
  }

  boolean ratonEncima() {

    if (mouseX > x && mouseX < (x + tam) && mouseY > y && mouseY < (y + tam)) {
      return true;
    } else {
      return false;
    }
  }

  void sonidoON_simon() {

    if (id==0) nota1.play();
    if (id==1) nota2.play();
    if (id==2) nota3.play();
    if (id==3) nota4.play();
  }


  void sonidoOFF_simon() {

    if (id==0) {
      nota1.pause();
      nota1.rewind();
    }
    if (id==1) {
      nota2.pause();
      nota2.rewind();
    }
    if (id==2) { 
      nota3.pause();
      nota3.rewind();
    }
    if (id==3) {
      nota4.pause();
      nota4.rewind();
    }
  }

  void sonidoON_player() {

    if (id==0) { 
      nota5.play();
    }
    if (id==1) { 
      nota6.play();
    }
    if (id==2) { 
      nota7.play();
    }
    if (id==3) { 
      nota8.play();
    }
  }

  void sonidoOFF_player() {

    if (id==0) {
      nota5.pause();
      nota5.rewind();
    }
    if (id==1) {
      nota6.pause();
      nota6.rewind();
    }
    if (id==2) { 
      nota7.pause();
      nota7.rewind();
    }
    if (id==3) {
      nota8.pause();
      nota8.rewind();
    }
  }
}
