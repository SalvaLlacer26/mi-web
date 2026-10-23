//VARIABLES GLOBALES
//Cargar biblioteca de sonidos Minim

import ddf.minim.*;              
import ddf.minim.analysis.*;
import ddf.minim.effects.*;
import ddf.minim.signals.*;
import ddf.minim.spi.*;
import ddf.minim.ugens.*;

//Fuentes
PFont titulo;
PFont play;

//Arrays: botones y rondas de cada partida
boton [] botones = new boton[4];
int [] partida = new int[30];

//Variables que controlan el recorrido a través del array
int posicionPartida=0;
int longitudActualPartida = 0;

//Control del tiempo
int tiempo;

//flecha animada del menú principal
float y=100;
float Ydir = 3;

//Booleans de control
boolean gameOver = true; //Pierdes
boolean win = false; //Ganas
boolean inicio = true; //Inicio por primera vez
boolean turnoSimon = false; //Turno de Simon/usuario

//Colores para los botones
color color_r = color(255, 0, 0);
color color_g = color(0, 255, 0);
color color_b = color(0, 0, 255);
color color_a = color(255, 255, 0);

//Sonidos y música
Minim minim;
AudioPlayer nota1;
AudioPlayer nota2;
AudioPlayer nota3;
AudioPlayer nota4;
AudioPlayer nota5;
AudioPlayer nota6;
AudioPlayer nota7;
AudioPlayer nota8;
AudioPlayer musica;
AudioPlayer fallo;

//Imagenes PNG
PImage fondo;
PImage flecha;

void setup() {

  size(800, 800);
  ellipseMode(CENTER);
  strokeWeight(20);

  minim = new Minim(this);        //Cargar Minim
  titulo = loadFont("arti.vlw");  //Cargar fuentes
  play = loadFont("bunny.vlw"); 

  //Se asigna un número aleatorio del 0 al 3 a cada espacio del array "partida"
  for (int k=0; k<partida.length; k++) {
    partida[k] = (int)(random(0, 4));
  }

  //Se crean 4 objetos BOTON. Cada uno con su ID y características como el color
  botones[0] = new boton(0, 0, 0, 400, color_r);
  botones[1] = new boton(1, 400, 0, 400, color_g);
  botones[2] = new boton(2, 0, 400, 400, color_b);
  botones[3] = new boton(3, 400, 400, 400, color_a);

  //Cargar sonidos
  nota1 = minim.loadFile("nota1.wav");
  nota2 = minim.loadFile("nota2.wav");
  nota3 = minim.loadFile("nota3.wav");
  nota4 = minim.loadFile("nota4.wav");
  nota5 = minim.loadFile("nota5.wav");
  nota6 = minim.loadFile("nota6.wav");
  nota7 = minim.loadFile("nota7.wav");
  nota8 = minim.loadFile("nota8.wav");
  musica = minim.loadFile("Creatividad.wav");
  fallo = minim.loadFile("error.wav");
  musica.loop(20);

  //Establecer volumen por defecto de la música y de cada sonido
  nota1.setGain(-15);
  nota2.setGain(-15);
  nota3.setGain(-15);
  nota4.setGain(-15);
  nota5.setGain(-10);
  nota6.setGain(-10);
  nota7.setGain(-10);
  nota8.setGain(-10);
  musica.setGain(-15);
  fallo.setGain(-15);
}

void draw () {

  println(frameRate); //Muestra en consola los FPS

  //Se cargan los PNG del fondo y la flecha
  fondo = loadImage("fondo.png");
  flecha = loadImage("flecha.png");

  //Si GameOver es TRUE - Menu ppal / Si es FALSE - Inicio del juego (SIMON empieza a hablar)
  if (gameOver) {
    musica.play();
    y += Ydir;
    game_over();
  } else {
    musica.pause();
    if (turnoSimon) {
      simonSalida();
      tiempo++;
    }

    // Se visualizan los objetos botón creados anteriormente, llamando a su función DISPLAY
    for (int i=0; i<botones.length; i++) {
      botones[i].display();
    }
  }
}

void mouseReleased() { //AL SOLTAR EL BOTON DEL RATON

  if (gameOver == false) { //Si GAMEOVER es falso, es decir NO estamos en el menú ppal

    if (turnoSimon==false) { //Si NO es el turno de SIMON

      //Para cada boton: Si, el raton está encima del boton, al hacer clic - apaga los botones y su sonido asignado
      for (int h=0; h<botones.length; h++) {    
        if (botones[h].ratonEncima() == true) {          
          botones[h].botonEncendido = false;
          botones[h].sonidoOFF_player();

/*La variable posicionPartida trabaja con la posición actual en el array partida.
La variable longitudPartida es como un TOPE que avanza a través del array partida a razón de UN HUECO MAS por cada acierto del usuario
Así pues, en la ronda 1 la posicionPartida está en el primer hueco del array, al igual que el mencionado TOPE (longitudPartida); 
Cuando el usuario acierta: el TOPE avanza hasta el segundo hueco del array y posición partida vuelve al primer hueco del array partida
después se pasa el turno a SIMON que mostrará dos colores, ya que el TOPE está situado en el hueco 2 del array partida*/

//Si la posición actual en el array partida es menor que el TOPE (longitudArray) - posicionPartida avanza un hueco en el array partida
          if (posicionPartida < longitudActualPartida) {
            posicionPartida++;
          } else {

            /*SI NO: Si la posicionPartida es la misma que el ULTIMO hueco del array partida
            por lo que se activa el menú principal*/
            if (longitudActualPartida == partida.length-1) {
              musica.shiftGain(musica.getGain(), -15, 1200); //Se sube progresivamente el volumen de la música del menú ppal
              gameOver=true;
              win=true;
            } else {

              //SI NO se cumple la condición anterior, sucede lo siguiente:
              turnoSimon = true;        //Se pasa el turno a 
              posicionPartida = 0;      //posicionPartida vuelve al principio del array partida
              longitudActualPartida++;  //Se adelanta un hueco más el TOPE en el array partida
              tiempo=0;                 //Se reinicia el tiempo
            }
          }
        }
      }
    }
  }
}

void mousePressed() { //A

  if (gameOver == false) {

    if (turnoSimon==false) {

      for (int j=0; j<botones.length; j++) {
        if (botones[j].ratonEncima() == true) {          
          botones[j].botonEncendido = true;
          botones[j].sonidoON_player();
          //image(fondo, 0, 0, 800, 800);

          if (partida[posicionPartida] != botones[j].id) {

            for (int z=0; z<botones.length; z++) {              
              botones[z].botonEncendido = false;
              botones[z].sonidoOFF_player();
            }
            fallo.play();
            gameOver = true;
            musica.shiftGain(musica.getGain(), -15, 1200);
          }
        }
      }
    }
  }
}

void simonSalida() { 

  if (gameOver == false) {

    if (turnoSimon) {

      int nuevoColor = partida[posicionPartida];

      if (tiempo>10 && tiempo<35) {

        botones[nuevoColor].botonEncendido = true;
        botones[nuevoColor].sonidoON_simon();
      }
      if (tiempo>35 && tiempo<45) {
        botones[nuevoColor].botonEncendido = false;
        botones[nuevoColor].sonidoOFF_simon();
      }

      if (tiempo>=45) {
        if (posicionPartida < longitudActualPartida) {    
          posicionPartida++;
          tiempo=0;
        } else {
          posicionPartida = 0;
          turnoSimon = false;
        }
      }

      //println(partida[0] + " " + partida[1] + " " + partida[2] + " " + partida[3] + " " + partida[4]);
      //println(longitudActualPartida);

      println("turnosimon" + turnoSimon);
      println("longitudactualpartida" + longitudActualPartida);
      println("posicionpartida" + posicionPartida);
      println("partida[posicionpartida]" + partida[posicionPartida]); 
      //println(tiempo);
    }
  }
}

void game_over() {

  float radioSec = 100;
  float distSec = dist(mouseX, mouseY, 400, 400);
  boolean jugar = false;

  if (y>=130 || y<=100)  Ydir = -Ydir;

  //FONDO BLANCO
  fill(255);
  rect(0, 0, 800, 800);
  //BOTON CENTRAL
  fill(255, 0, 0);
  ellipse(width/2, height/2, 200, 200);
  //FLECHAS
  image(flecha, 70, y, 192.8, 272.8);
  //TEXTOS
  textAlign(CENTER);
  textFont(titulo, 200); 
  fill(0);
  text("SIMON", 400, 240);
  textFont(play, 50);
  fill(0);
  text("Jugar!", 400, 565);

  if (inicio==false && win==false) {
    textFont(titulo, 75);
    fill(0);
    text("Vuelve a intentarlo!", 400, 700);
  }

  if (inicio==false && win==true) {
    textFont(titulo, 75);
    fill(0);
    text("Has ganado!", 400, 700);
  }

  if (distSec < radioSec) {
    if (mousePressed) jugar = true;

    if (jugar==true) {

      musica.shiftGain(musica.getGain(), -80, 2000);
      fallo.pause();
      fallo.rewind();

      for (int k=0; k<partida.length; k++) {
        partida[k] = (int)(random(0, 4));
      }  
      posicionPartida=0;
      longitudActualPartida = 0;
      gameOver = false;
      turnoSimon = true;                    
      win=false;
      jugar = false;
      inicio = false;

      for (int z=0; z<botones.length; z++) {              
        botones[z].botonEncendido = false;
        botones[z].sonidoOFF_player();
      }
    }
  }
}
