//objetos importantes de canvas
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

//crear el objeto de la nave
var nave = {
    x: 100,//posicion en x del inicio
    y: canvas.height - 100,//posicion en y del inicio
    width: 50,//anchura
    height: 50,//altura de la nave
    contador: 0
};

//estado del juego
var juego = {
    estado: 'iniciando'
};

//texto presentado por pantalla
var textoRespuesta = {
    contador: -1,
    titulo: '',
    subtitulo: ''
};

var teclado = {};

//array para los disparos
var disparos = [];
var disparosEnemigos = [];
//array que almacena los enemigos
var enemigos = [];

//definir variables para las imagenes
var fondo, imgNave, imgEnemigo, imgDisparo, imgDisparoE;
//variables para el sonido
var sounddisparo, /*sounddisparoE,*/ soundGameOver, soundVictoria;
//variable global que tenga las imagenes
var imagenes = [''];
//variable para el precargado
var preloader;

var tiempo = 0;

//definicion de funciones
function loadMedia() {
    //crea un objeto preloaderjs de la clase del preloader.js
    preloader = new PreloadJS();
    preloader.onProgress = progresoCarga;
    cargar();
}

function cargar(){
    while(imagenes.length > 0){
        //con shift sacamos el ultimo elemento del array y se almacena en imagen
        var imagen = imagenes.shift();
        //para cargar un archivo
        preloader.loadFile(imagen);
    }
}

function pantallaCompleta() {
          canvas.style.width = window.innerWidth + "px";
          canvas.style.height = window.innerHeight + "px";
     };

function progresoCarga(){
    //Para ver el porcentaje de carga, pero por consola
    console.log(parseInt(preloader.progress * 100) +"%");
    //Para saber si se carga todo
    if(preloader.progress == 1){
        //aqui se pone la funcion de carga
        var interval = window.setInterval(frameLoop,1000/30);
        //aqui se devlara el fondo
        fondo = new Image();
        fondo.src = 'fondo.jpg';
        imgNave = new Image();
        imgNave.src = 'submarine1.png';
        
        imgDisparo = new Image();
        imgDisparo.src = 'disparos.png';
        
        imgDisparoE = new Image();
        imgDisparoE.src = 'disparoEnemigos.png';
        
        imgEnemigo = new Image();
        imgEnemigo.src = 'enemigo.png';   
        
        sounddisparo = document.createElement('audio');
        document.body.appendChild(sounddisparo);
        sounddisparo.setAttribute('src','shoot.wav');
        /*
        sounddisparoE = document.createElement('audio');
        document.body.appendChild(sounddisparoE);
        sounddisparoE.setAttribute('src','disparoE.wav');
        */
        soundGameOver = document.createElement('audio');
        document.body.appendChild(soundGameOver);
        soundGameOver.setAttribute('src','gameOver.wav');
        
        soundVictoria = document.createElement('audio');
        document.body.appendChild(soundVictoria);
        soundVictoria.setAttribute('src','victoria.mp3');
    }
}

//caracteristicas de los enemigos
function dibujarEnemigos() {
    for (var i in enemigos){
        var enemigo = enemigos[i];
        ctx.drawImage(imgEnemigo,enemigo.x,enemigo.y,enemigo.width,enemigo.height);
    }
}

//fondo en movimiento
function dibujarFondo() {
    //ctx.drawImage(fondo, 0, 0); Fondo sin movimiento 
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    ctx.drawImage(fondo,tiempo,0);
    ctx.drawImage(fondo,tiempo-5828,0);//ancho:949, alto: 534 o 800,450
    tiempo--;
    
    if(tiempo<0){
        tiempo = tiempo + 5828;	
    }
}
//-----------------------------Boton Disparar---------------------
function botonDisparar(){ 
 ctx.strokeStyle = "rgba(15, 96, 12, 0.6)";
 ctx.lineWidth = 5;
 ctx.strokeRect(730, 320, 50, 50);//eje x, eje y, ancho y alto
 /*ctx.save();
 ctx.strokeStyle = "rgba(15, 96, 12, 0.6)";//color con transparencia
 ctx.lineWidth = 5;
 ctx.arc(730, 330, 25, 0, (Math.PI/180)*360);//eje x, eje y, radio , inicio, fin circulo
 ctx.stroke();
 ctx.restore();*/
}

function clickDisparar(){
//Añadimos un addEventListener al canvas, para reconocer el click
canvas.addEventListener("click",   
 //Una vez se haya clickado se activará la siguiente función
 function(e){
  /*Las siguientes 2 líneas lo que hacen és saber en que parte del canvas se ha clickado. Si ha clickado dentro del cuadrado se activará mover(). La operación que utilizamos es restar la parte izquierda que sobra desdel canvas hasta el explorador (cancas.offsetLeft) con el click (e.clientY)*/
  if(e.clientX-canvas.offsetLeft > 730
   && e.clientX-canvas.offsetLeft < 780){
   //Aqui lo mismo que en la anterior sólo que miramos alto y ancho del cuadrado
   if(e.clientY-canvas.offsetTop > 320
    && e.clientY-canvas.offsetTop < 380){
    //si ha clickado dentro del cuadro verde
    fire();   
   }
  }
 }
 ,false);}

//-------------Botones Movimiento +--------------------------------
function botonArriba(){ 
 ctx.strokeStyle = "rgba(15, 96, 12, 0.6)";
 ctx.lineWidth = 5;
 ctx.strokeRect(70, 280, 50, 50);//eje x, eje y, ancho y alto
}
function botonAbajo(){ 
 ctx.strokeStyle = "rgba(15, 96, 12, 0.6)";
 ctx.lineWidth = 5;
 ctx.strokeRect(70, 340, 50, 50);//eje x, eje y, ancho y alto
}
function botonDerecha(){ 
 ctx.strokeStyle = "rgba(15, 96, 12, 0.6)";
 ctx.lineWidth = 5;
 ctx.strokeRect(130, 310, 50, 50);//eje x, eje y, ancho y alto
}
function botonIzquierda(){ 
 ctx.strokeStyle = "rgba(15, 96, 12, 0.6)";
 ctx.lineWidth = 5;
 ctx.strokeRect(10, 310, 50, 50);//eje x, eje y, ancho y alto
}
//Arriba ctx.strokeRect(70, 280, 50, 50); eje x, eje y, ancho y alto
function clickArriba(){canvas.addEventListener("click",function(e){
  if(e.clientX-canvas.offsetLeft > 70 //igual eje x 
  && e.clientX-canvas.offsetLeft < 120){ //igualeje x + ancho
    if(e.clientY-canvas.offsetTop > 280 //igual eje y 
    && e.clientY-canvas.offsetTop < 330){ //igualeje y + alto
        //movimiento a a la arriba
        nave.y -= 30;
        if(nave.y < 0){nave.y = 0;}
   } 
  }
 }
 ,false);}
//Abajo ctx.strokeRect(70, 340, 50, 50); eje x, eje y, ancho y alto
function clickAbajo(){canvas.addEventListener("click",function(e){
  if(e.clientX-canvas.offsetLeft > 70 //igual eje x 
  && e.clientX-canvas.offsetLeft < 120){ //igualeje x + ancho
    if(e.clientY-canvas.offsetTop > 340 //igual eje y 
    && e.clientY-canvas.offsetTop < 390){ //igualeje y + alto
        
        //movimiento a a la abajo
        var limitey = canvas.height - nave.height;
        nave.y += 30;
        if(nave.y > limitey){nave.y = limitey;}
   } 
  }
 }
 ,false);}  

//Derecha ctx.strokeRect(130, 310, 50, 50); eje x, eje y, ancho y alto
function clickDerecha(){canvas.addEventListener("click",function(e){
   if(e.clientX-canvas.offsetLeft > 130 //igual eje x 
  && e.clientX-canvas.offsetLeft < 180){ //igualeje x + ancho
    if(e.clientY-canvas.offsetTop > 310 //igual eje y 
    && e.clientY-canvas.offsetTop < 360){ //igualeje y + alto
       
        //movimineto a a la derecha
        var limitex = canvas.width - nave.width;
        nave.x += 30;
        if(nave.x > limitex){nave.x = limitex;}
   } 
  }
 }
 ,false);}   

//izq ctx.strokeRect(10, 310, 50, 50); eje x, eje y, ancho y alto
function clickIzquierda(){canvas.addEventListener("click",function(e){
    if(e.clientX-canvas.offsetLeft > 10 //igual eje x 
  && e.clientX-canvas.offsetLeft < 60){ //igualeje x + ancho
    if(e.clientY-canvas.offsetTop > 310 //igual eje y 
    && e.clientY-canvas.offsetTop < 360){ //igualeje y + alto
  
       
        //movimineto a a la izquierda
        nave.x -= 30;
        if(nave.x <0){nave.x = 0;}
   } 
  }
 }
 ,false);}

//-----------------------------Boton Reiniciar---------------------
//Tamaño (190, 180, 370, 90); sin dibujar
function clickReiniciar(){canvas.addEventListener("click", function(e){
   if(e.clientX-canvas.offsetLeft > 190 //igual eje x 
   && e.clientX-canvas.offsetLeft < 560){ //igualeje x + ancho
        if(e.clientY-canvas.offsetTop > 180 //igual eje y 
        && e.clientY-canvas.offsetTop < 270){ //igualeje y + alto
            if((juego.estado == 'perdido' || juego.estado == 'victoria')){
                juego.estado = 'iniciando';
                nave.estado = 'vivo';
                textoRespuesta.contador = -1;
            }  
   } 
  }
 }
 ,false);}
//--------------------------------------------------------------------

//caracteristicas de la nave
function dibujarNave() {
     ctx.drawImage(imgNave, nave.x, nave.y, nave.width, nave.height);
}

//introducir la condiciones de las teclas
function agregarEventosTeclado() {
    agregarEvento(document, "keydown", function (e) {
                    //ponemos en true la tecla presionada
                   teclado[e.keyCode] = true;//evento que identifica la tecla que se ha pulsado
                   });
    agregarEvento(document, "keyup", function (e) {
                    //ponemos en false la tecla que dejo de ser presionada
                   teclado[e.keyCode] = false;
                   });
}

//evento para los tipos de navegador
function agregarEvento(elemento, nombreEvento, funcion) {  
        if (elemento.addEventListener) {
           //Navegadores de verdad 
            elemento.addEventListener(nombreEvento, funcion, false);
        } 
    else if (elemento.attachEvent) {
        //Internet explorer
        elemento.attachEvent(nombreEvento,funcion);
    }
}

function moverNave() {
    //movimiento a a la izquierda
    if (teclado[37] ) {
        nave.x -= 15;
        if(nave.x <0) {
            nave.x = 0;
        }
    }
    //movimiento a a la derecha
    if (teclado[39] ) {
        var limitex = canvas.width - nave.width;
        nave.x += 15;
        if(nave.x > limitex) {
            nave.x = limitex;
        }
    }
    if (teclado[38] ) {
        //movimiento a a la arriba
        nave.y -= 15;
        if(nave.y < 0) {
            nave.y = 0;
        }
    }
    if (teclado[40] ) {
        //movimiento a a la abajo
        var limitey = canvas.height - nave.height;
        nave.y += 15;
        if(nave.y > limitey) {
            nave.y = limitey;
        }
    }
    if (teclado[32] ) {
        //disparos
        if(!teclado.fire){
            fire();
            teclado.fire = true;
        }
    }
   else teclado.fire = false;
if(nave.estado == 'hit'){
        nave.contador++;
        if(nave.contador >= 20){
            nave.contador = 0;
            nave.estado = 'muerto';
            juego.estado = 'perdido';
                
    //Reproducir sonido
    soundGameOver.play();
    
            textoRespuesta.titulo= 'Game Over';
            textoRespuesta.subtitulo = 'Presiona aqui o pulsa R para volver a intentarlo.';
            textoRespuesta.contador = 0;
        }
    }
}

//caracteristicas disparos de los enemigos
function dibujarDisparosEnemigos(){
    for(var i in disparosEnemigos){
        var disparo = disparosEnemigos[i];
        ctx.drawImage(imgDisparoE,disparo.x,disparo.y,disparo.width,disparo.height);
    }
}

function moverDisparosEnemigos(){
    for(var i in disparosEnemigos){
        var disparo = disparosEnemigos[i];
        disparo.y += 5;//velocidad disparo
    }
    disparosEnemigos = disparosEnemigos.filter(function(disparo){
        return disparo.y < canvas.height;
    });
}

function actualizarEnemigos(){
    function agregarDisparosEnemigos(enemigo){
        //agrega un disparo
        return {
            x: enemigo.x,
            y: enemigo.y,
            width: 17,
            height: 24,
            contador: 0
        }
    }
    //moverlos
    if (juego.estado == 'iniciando'){
        for(var i =0;i<10;i++){//numero de enemigos 10
            enemigos.push({
               x: 10 + (i*50),
               y: 10,
               height: 40,
               width: 40,
               estado: 'vivo',
               contador: 0
            });
        }
        juego.estado = 'jugando';
    }
    //movemos los elementos
    for(var i in enemigos){
        var enemigo = enemigos[i];
        if(!enemigo) continue;
        if(enemigo && enemigo.estado == 'vivo'){
            //si el enemigo esta vivo lo movemos
            enemigo.contador++;
            enemigo.x += Math.sin(enemigo.contador * Math.PI /90)*5;
                
        if(aleatorio(0,enemigos.length * 10) == 4){
           //agregamos un disparo
            disparosEnemigos.push(agregarDisparosEnemigos(enemigo));
                }
        }
        if(enemigo && enemigo.estado == 'hit'){
            enemigo.contador++;
            if(enemigo.contador <= 20){
                enemigo.contador = 0;
                enemigo.estado = 'muerto';
            }
        }

    enemigos = enemigos.filter(function(enemigo){
        if(enemigo && enemigo.estado != 'muerto') 
            return true;
        else 
            return false;
    });
}
}
function moverDisparos(){
    for(var i in disparos){
        var disparo = disparos[i];
        disparo.y -= 4;//velocidad disparo
        disparo.contador++;
    }
    disparos = disparos.filter(function(disparo){
        return disparo.y > 0;
    });
}
    
function fire(){
   //Reproducir sonido y pararlo
   sounddisparo.pause();
   sounddisparo.currentTime = 0;
   sounddisparo.play();
        disparos.push({
           x: nave.x + 20, 
           y: nave.y - 10,
           width: 16,
           height: 28
        });
    }

function dibujarDisparos(){
    for(var i in disparos){
        var disparo = disparos[i];
        ctx.drawImage(imgDisparo, disparo.x,disparo.y,disparo.width,disparo.height);
    }
}

function dibujaTexto(){
    if(textoRespuesta.contador == -1) return;
    var alpha = textoRespuesta.contador/50.0;//crear ilusion de transparente a solido
    if(alpha<1){
        for (var i in enemigos){
            delete enemigos[i];    
            delete disparos[i];  
            delete disparosEnemigos[i];
        }
        
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    if(juego.estado == 'perdido'){
        ctx.fillStyle = 'white';
        ctx.font ='Bold 40pt Arial';
        ctx.fillText(textoRespuesta.titulo, 140, 200);
        ctx.font ='14pt Arial';
        ctx.fillText(textoRespuesta.subtitulo, 190, 250);
    }
    if(juego.estado == 'victoria'){
        ctx.fillStyle = 'white';
        ctx.font ='Bold 40pt Arial';
        ctx.fillText(textoRespuesta.titulo, 140, 200);
        ctx.font ='14pt Arial';
        ctx.fillText(textoRespuesta.subtitulo, 190, 250);
    }
}

function actualizarEstadoJuego(){
    if(juego.estado == 'jugando' && enemigos.length == 0){
        juego.estado ='victoria';
        textoRespuesta.titulo = '¡¡Vencistes!!';
            
    //Reproducir sonido
    soundVictoria.play();
    
        textoRespuesta.subtitulo = 'Presiona aqui o pulsa R para reiniciar.';
        textoRespuesta.contador = 0;
        
    }
    if(textoRespuesta.contador >= 0){
        textoRespuesta.contador++;
    }
    if((juego.estado == 'perdido' || juego.estado == 'victoria')  && teclado[82]){
        juego.estado = 'iniciando';
        nave.estado = 'vivo';
        textoRespuesta.contador = -1;
    }
}

function hit(a,b){
    var hit = false;
    if(b.x + b.width >= a.x && b.x < a.x + a.width){
        if(b.y + b.height >= a.y && b.y < a.y + a.height
          ){
          hit = true;  
        }
    }
    if(b.x <= a.x && b.x + b.width >= a.x + a.width){
        if(b.y <= a.y && b.y + b.height >= a.y + a.height){
            hit = true;
        }
    }
    if(a.x <= b.x && a.x + a.width >= b.x + b.width){
        if(a.y <= b.y && a.y + a.height >= b.y + b.height){
            hit = true;
        }
    }
    return hit;
}

function verificarContacto(){
    for(var i in disparos){
        var disparo = disparos[i];
        for(j in enemigos){
            var enemigo = enemigos[j];
            if(hit(disparo,enemigo)){
                enemigo.estado = 'hit';
                enemigo.contador = 0;
            }
        }
    }
    if (nave.estado == 'hit' || nave.estado == 'muerto') return;
    for (var i in disparosEnemigos){
        var disparo = disparosEnemigos[i];
        if (hit(disparo,nave)){
            nave.estado = 'hit';
        }
    }
}

function aleatorio(inferior,superior){
    var posibilidades = superior - inferior;
    var a = Math.random() * posibilidades;
    a = Math.floor(a);
    return parseInt(inferior) + a;
}

function frameLoop(){ //encargarse de actualizar la posiciones de los jugadores y redibujar los elementos del juego para el movimiento. Ademas de dibujar el backgroung
    dibujarFondo();
    actualizarEstadoJuego();
    moverNave();
    moverDisparos();
    moverDisparosEnemigos();
    verificarContacto();
    actualizarEnemigos();
    dibujarEnemigos();
    dibujarDisparosEnemigos();
    dibujarDisparos();
    dibujaTexto();
    dibujarNave();
    botonArriba();
    botonAbajo();
    botonDerecha();
    botonIzquierda();
    botonDisparar();
}

//Cuando se haya cargado la pantalla
window.addEventListener('load',init)
function init(){
    //ejecucion de funciones
    agregarEventosTeclado();
    loadMedia();//para cargar las imagenes
    clickArriba();
    clickAbajo();
    clickDerecha();
    clickIzquierda();
    clickDisparar();
    clickReiniciar();
}
