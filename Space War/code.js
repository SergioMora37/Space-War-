//Animacion Inicial
window.onload = function () {
    $("#onload").fadeOut();
    $("body").removeClass("hidden");
}

//Objetos importantes de canvas
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

//Crear objetos
var juego = {
    estado: "Iniciando"
};

var textoRespuesta = {
    contador: -1, // -1 Para que no dibuje el texto sin que nosotros lo deseemos 
    titulo: "",
    subtitulo: ""
}
var teclado = {}

var nave = {
    x: 100,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    url: "nave.png",
    cargaOK: false,
    contador: 0
}

var naveEnemigo = {
    url: "enemigo.png",
    cargaOK: false
};

var disparoNave = {
    url: "disparo.png",
    cargaOK: false
};

var disparoEnemigo = {
    url: "disparoEnemigo.png",
    cargaOK: false
};

naveEnemigo.imagen = new Image();
naveEnemigo.imagen.src = naveEnemigo.url;
naveEnemigo.imagen.addEventListener("load", cargarNaveEnemigo);

nave.imagen = new Image();
nave.imagen.src = nave.url;
nave.imagen.addEventListener("load", cargarNave);

disparoNave.imagen = new Image();
disparoNave.imagen.src = disparoNave.url;
disparoNave.imagen.addEventListener("load", cargarDisparoNave);

disparoEnemigo.imagen = new Image();
disparoEnemigo.imagen.src = disparoEnemigo.url;
disparoEnemigo.imagen.addEventListener("load", cargarDisparoEnemigo);

//Variables para el sonido 
var soundShoot, soundInvaderShoot, soundDeadSpace, soundDeadInvader, soundEndGame, soundLoser;

//Declarar un nuevo elemento de audio
soundShoot = document.createElement("audio");
document.body.appendChild(soundShoot);
soundShoot.setAttribute("src", "disparo.mp3");

soundInvaderShoot = document.createElement("audio");
document.body.appendChild(soundInvaderShoot);
soundInvaderShoot.setAttribute("src", "disparoEnemigo.mp3");

soundDeadSpace = document.createElement("audio");
document.body.appendChild(soundDeadSpace);
soundDeadSpace.setAttribute("src", "spaceship.mp3");

soundDeadInvader = document.createElement("audio");
document.body.appendChild(soundDeadInvader);
soundDeadInvader.setAttribute("src", "enemies.mp3");

soundEndGame = document.createElement("audio");
document.body.appendChild(soundEndGame);
soundEndGame.setAttribute("src", "chewbacca.mp3");

soundLoser = document.createElement("audio");
document.body.appendChild(soundLoser);
soundLoser.setAttribute("src", "EndGame.mp3");

function cargarNaveEnemigo() {
    naveEnemigo.cargaOK = true;
    dibujarEnemigos();
}

function cargarNave() {
    nave.cargaOK = true;
    dibujarNave();
}

function cargarDisparoNave() {
    disparoNave.cargaOK = true;
    dibujar();
}

function cargarDisparoEnemigo() {
    disparoEnemigo.cargaOK = true;
    dibujarDisparosEnemigos();
}
//Array para los disparos, enemigos y sus disparos
var disparos = [];
var enemigos = [];
var disparosEnemigos = [];

//Definir variables parta las imagenes
var fondo;
var imagenes = ["nave.png"];

//Definicion de Funciones
function loadMedia() {
    fondo = new Image();
    fondo.src = "WPspace.jpg";
    fondo.onload = function () {
        //Ajustar velocidad del juego
        var intervalo = window.setInterval(frameLoop, 1000 / 33);
    }
}

function dibujarFondo() {
    ctx.drawImage(fondo, 0, 0);
}

function dibujarNave() {
    if (nave.cargaOK) {
        ctx.save();
        ctx.drawImage(nave.imagen, nave.x, nave.y, nave.width, nave.height);
        ctx.restore();
    }
}

function dibujarEnemigos() {
    if (naveEnemigo.cargaOK) {
        for (var i in enemigos) {
            var enemigo = enemigos[i];
            ctx.save();
            if (enemigo.estado == "Vivo") ctx.drawImage(naveEnemigo.imagen, enemigo.x, enemigo.y, enemigo.width, enemigo.height);
            if (enemigo.estado == "Muerto") ctx.fillStyle = "black";
        }
    }
}


function dibujarDisparos() {
    ctx.save();
    ctx.fillStyle = "white";
    for (var i in disparos) {
        var disparo = disparos[i];
        ctx.drawImage(disparoNave.imagen, disparo.x, disparo.y, disparo.width, disparo.height);
    }
    ctx.restore();
}

function dibujarTexto() {
    if (textoRespuesta.contador == -1) return;
    var alpha = textoRespuesta.contador / 50.0; //Efecto Transparencia junto ctx.globalAlpha = alpha;
    if (alpha > 1) {
        for (var i in enemigos) {
            delete enemigos[i];
        }
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    if (juego.estado == "Perdido") {
        ctx.fillStyle = "white";
        ctx.font = "Bold 35pt Arial";
        ctx.fillText(textoRespuesta.titulo, 280, 200);
        ctx.font = "14pt Arial";
        ctx.fillText(textoRespuesta.subtitulo, 270, 250);
    }
    if (juego.estado == "Victoria") {
        ctx.fillStyle = "white";
        ctx.font = "Bold 35pt Arial";
        ctx.fillText(textoRespuesta.titulo, 100, 200);
        ctx.font = "14pt Arial";
        ctx.fillText(textoRespuesta.subtitulo, 220, 250);

    }
}

function actualizarEstadoJuego() {
    if (juego.estado == "Jugando" && enemigos.length == 0) {
        soundEndGame.currentTime = 0;
        soundEndGame.play();
        juego.estado = "Victoria";
        textoRespuesta.titulo = " Victoria, Naves Destruidas";
        textoRespuesta.subtitulo = " Presiona la tecla R para reiniciar el juego";
        textoRespuesta.contador = 0;
    }
    if (textoRespuesta.contador >= 0) {
        textoRespuesta.contador++;
    }
    if ((juego.estado == "Perdido" || juego.estado == "Victoria") && teclado[82]) {
        juego.estado = "Iniciando";
        nave.estado = "Vivo";
        textoRespuesta.contador = -1;
    }
}

function agregarEventosTeclado() {
    agregarEvento(document, "keydown", function (e) {
        //Ponemos en true la tecla presionada 
        teclado[e.keyCode] = true;
    });
    agregarEvento(document, "keyup", function (e) {
        //Ponemos en false la tecla presionada 
        teclado[e.keyCode] = false;
    });

    function agregarEvento(elemento, nombreEvento, funcion) {
        if (elemento.addEventListener) {
            elemento.addEventListener(nombreEvento, funcion, false);
        }
    }
}

function moverNave() {
    var movimiento = 5;
    if (teclado[37]) {
        //Movimiento izquierda (10 es la velocidad nave)
        nave.x -= movimiento;
        if (nave.x < 0) nave.x = 0; //Nave no se salga del canvas
    }
    if (teclado[39]) {
        //Movimiento derecha
        var limite = canvas.width - nave.width;
        nave.x += movimiento;
        if (nave.x > limite) nave.x = limite; //Nave no se salga del canvas
    }
    if (teclado[32]) {
        //Disparos
        if (!teclado.fuego) {
            fuego();
            teclado.fuego = true;
        }
    } else teclado.fuego = false;
    if (nave.estado == "Hit") {
        nave.contador++;
        if (nave.contador >= 20) {
            soundLoser.currentTime = 0;
            soundLoser.play();
            nave.contador = 0;
            nave.estado = "Muerto";
            juego.estado = "Perdido";
            textoRespuesta.titulo = "Game Over";
            textoRespuesta.subtitulo = "Presiona la tecla R de Revancha";
            textoRespuesta.contador = 0;
        }
    }
}

function dibujarDisparosEnemigos() {
    for (var i in disparosEnemigos) {
        var disparo = disparosEnemigos[i];
        ctx.save();
        ctx.fillStyle = "yellow";
        ctx.drawImage(disparoEnemigo.imagen, disparo.x, disparo.y, disparo.width, disparo.height);
        ctx.restore();
    }
}

function moverDisparosEnemigos() {
    for (var i in disparosEnemigos) {
        var disparo = disparosEnemigos[i];
        disparo.y += 3;
    }
    disparosEnemigos = disparosEnemigos.filter(function (disparo) {
        return disparo.y <= canvas.height;
    });
}

function actualizarEnemigos() {
    function agregarDisparosEnemigos(enemigo) {
        return {
            x: enemigo.x,
            y: enemigo.y,
            width: 10,
            height: 33,
            contador: 0
        }
    }
    var numEnemigos = 10;
    if (juego.estado == "Iniciando") {
        for (var i = 0; i < numEnemigos; i++) {
            enemigos.push({
                x: 10 + (i * 50), //Posicionarse Separados
                y: 10,
                width: 40,
                height: 40,
                estado: "Vivo",
                contador: 0
            });
        }
        juego.estado = "Jugando";
    }
    for (var i in enemigos) {
        var enemigo = enemigos[i];
        if (!enemigo) continue;
        if (enemigo && enemigo.estado == "Vivo") {
            enemigo.contador++;
            enemigo.x += Math.sin(enemigo.contador * Math.PI / 90) * 5; //Funcion matematica para calcular el seno y que los enemigos llgueen hasta el tope del canvas

            if (aleatorio(0, enemigos.length * 10) == 4) {
                soundInvaderShoot.pause();
                soundInvaderShoot.currentTime = 0;
                soundInvaderShoot.play();
                disparosEnemigos.push(agregarDisparosEnemigos(enemigo));
            }
        }
        if (enemigo && enemigo.estado == "Hit") {
            enemigo.contador++;
            if (enemigo.contador >= 20) {
                enemigo.estado = "Muerto";
                enemigo.contador = 0;
            }
        }
    }
    enemigos = enemigos.filter(function (enemigo) {
        if (enemigo && enemigo.estado != "Muerto") return true;
        return false;
    });
}

function moverDisparos() {
    //Ejecutar ciclo por cada uno de los disparos
    for (var i in disparos) {
        var disparo = disparos[i];
        disparo.y -= 2;
    }
    //Devuelve un arreglo/variable que cumpla con cierta condicion
    disparos = disparos.filter(function (disparo) {
        return disparo.y > 0;
    });
}

function fuego() {
    soundShoot.pause();
    soundShoot.currentTime = 0;
    soundShoot.play();
    disparos.push({
        x: nave.x + 20,
        y: nave.y - 10,
        width: 10,
        height: 30
    });
}

function hit(a, b) {
    var hit = false;
    if (b.x + b.width >= a.x && b.x < a.x + a.width) {
        if (b.y + b.height >= a.y && b.y < a.y + a.height) {
            hit = true;
        }
    }
    if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
        if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
            hit = true;
        }
    }
    if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
        if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
            hit = true;
        }
    }
    return hit;
}

function verificarContacto() {
    for (var i in disparos) {
        var disparo = disparos[i];
        for (j in enemigos) {
            var enemigo = enemigos[j];
            if (hit(disparo, enemigo)) {
                soundDeadInvader.pause();
                soundDeadInvader.currentTime = 0;
                soundDeadInvader.play();
                enemigo.estado = "Hit";
                enemigo.contador = 0;
            }
        }
    }
    if (nave.estado == "Hit" || nave.estado == "Muerto") return;
    for (var i in disparosEnemigos) {
        var disparo = disparosEnemigos[i];
        if (hit(disparo, nave)) {
            soundDeadSpace.currentTime = 0;
            soundDeadSpace.play();
            nave.estado = "Hit";
        }
    }
}

function aleatorio(min, max) {
    var posibilidades = max - min;
    var a = Math.random() * posibilidades;
    a = Math.floor(a);
    return parseInt(min) + a;
}
// Esta funcion se encargara de actualizar todas las posiciones de los jugadores y los va a redibujar para el movimiento entre otros...
function frameLoop() {
    actualizarEstadoJuego();
    moverNave();
    actualizarEnemigos();
    moverDisparos();
    moverDisparosEnemigos();
    dibujarFondo();
    verificarContacto();
    dibujarNave();
    dibujarEnemigos();
    dibujarDisparosEnemigos();
    dibujarDisparos();
    dibujarTexto();
}

//Ejecucion de Funciones
window.addEventListener("load", init)

function init() {
    agregarEventosTeclado();
    loadMedia();
}