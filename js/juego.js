'use strict'
var jugadorSecreto = null;
var nombreUsuario = '';
var intentosRestantes = 8;
var juegoIniciado = false; 
var historialIntentos = [];
var dificultadSeleccionada = 'facil';
var puntosPartida = 0;
var selectDificultad = document.getElementById('selector-dificultad');
var inputBusqueda = document.getElementById('input-busqueda');
var listaAutocompletado = document.getElementById('lista-autocompletado');
var formularioInicio = document.getElementById('formulario-inicio');
var inputNombre = document.getElementById('nombre-usuario');
var errorNombre = document.getElementById('error-nombre');
var pantallaRegistro = document.getElementById('pantalla-registro');
var pantallaJuego = document.getElementById('pantalla-juego');
var elementoIntentos = document.getElementById('intentos-restantes');
var botonReiniciar = document.getElementById('boton-reiniciar');
var fotoJugadorSecreto = document.getElementById('foto-jugador-secreto');

function limpiarErrorNombre(){
    errorNombre.classList.add('clase-oculta');
}

function validarNombreAlSalir(){
    var nombre = inputNombre.value.trim();
    if (nombre.length > 0 && nombre.length < 3){
        errorNombre.classList.remove('clase-oculta');
    }
}

function actualizarDesenfoqueFoto() {
    var pxBlur = intentosRestantes * 2.5;
    fotoJugadorSecreto.style.filter = 'blur(' + (pxBlur) + 'px)';
}

function comprobarJugadorRepetido(id) {
    var i;
    for(i = 0; i < historialIntentos.length; i++){
        if(historialIntentos[i] === id){
            return true;
        }
    }
    return false;
}

function calcularPuntuacion(haGanado, intentosUsados, tiempoSegundos) {
    if (!haGanado) {
        return 0;
    }
    var puntosBase = 60;
    if (dificultadSeleccionada === 'medio') {
        puntosBase = 80;
    } else if (dificultadSeleccionada === 'dificil') {
        puntosBase = 100;
    }
    var restaIntentos = (intentosUsados - 1) * 10;
    var bonusTiempo = 0;
    if (tiempoSegundos < 60) {
        bonusTiempo = 20;
    } else if (tiempoSegundos < 120) {
        bonusTiempo = 10;
    }
    var total = puntosBase - restaIntentos + bonusTiempo;
    return total < 10 ? 10 : total;
}

function guardarPartidaEnHistorial(haGanado, intentosUsados, tiempoSegundos) {
    var historial = JSON.parse(localStorage.getItem('futbolle_historial')) || [];
    var nuevaPartida = {
        usuario: nombreUsuario,
        resultado: haGanado ? 'Ganó' : 'Perdió',
        intentos: intentosUsados,
        tiempo: formatearTiempo(tiempoSegundos),
        puntos: calcularPuntuacion(haGanado, intentosUsados, tiempoSegundos),
        fecha: new Date().toLocaleString()
    };
    historial.push(nuevaPartida);
    localStorage.setItem('futbolle_historial', JSON.stringify(historial));
}

function finalizarPartida(haGanado) {
    detenerTemporizador();
    inputBusqueda.disabled = true;
    if (dificultadSeleccionada === 'facil') {
        fotoJugadorSecreto.style.filter = 'blur(0px)';
    }
    var segundosTotales = obtenerSegundosTranscurridos();
    var intentosUsados = 8 - intentosRestantes;
    var tiempoTotal = formatearTiempo(segundosTotales);
    var score = calcularPuntuacion(haGanado, intentosUsados, segundosTotales);
    guardarPartidaEnHistorial(haGanado, intentosUsados, segundosTotales);
    if (haGanado) {
        mostrarModal('¡Ganaste! 🎉', 'Adivinaste a ' + jugadorSecreto.name + ' en ' + intentosUsados + ' intentos. Puntos: ' + score + '. Tiempo: ' + tiempoTotal + '.');
    } else {
        mostrarModal('Fin de la partida 😢', 'Te quedaste sin intentos. El jugador secreto era: ' + jugadorSecreto.name + '.');
    }
}

function crearCeldaAtributo(etiqueta, valor, coincide) {
    var celda = document.createElement('div');
    celda.className = 'celda-atributo ' + (coincide ? 'celda-correcto' : 'celda-incorrecto');
    var spanEtiqueta = document.createElement('span');
    spanEtiqueta.className = 'etiqueta-celda';
    spanEtiqueta.textContent = etiqueta;
    var spanValor = document.createElement('span');
    spanValor.className = 'valor-celda';
    spanValor.textContent = valor;
    celda.appendChild(spanEtiqueta);
    celda.appendChild(spanValor);
    return celda;
}

function crearCellicaNumerica(etiqueta, valorIntentado, valorSecreto) {
    var celda = document.createElement('div');
    var coincide = valorIntentado === valorSecreto;
    celda.className = 'celda-atributo ' + (coincide ? 'celda-correcto' : 'celda-incorrecto');
    var spanEtiqueta = document.createElement('span');
    spanEtiqueta.className = 'etiqueta-celda';
    spanEtiqueta.textContent = etiqueta;
    var spanValor = document.createElement('span');
    spanValor.className = 'valor-celda';
    if (coincide) {
        spanValor.textContent = valorIntentado;
    } else if (valorSecreto > valorIntentado) {
        spanValor.textContent = valorIntentado + ' 🠝';
    } else {
        spanValor.textContent = valorIntentado + ' 🠟';
    }
    celda.appendChild(spanEtiqueta);
    celda.appendChild(spanValor);
    return celda;
}

function crearFilaIntentoEnTablero(jugador) {
    var tablero = document.getElementById('tablero-intentos');
    var fila = document.createElement('div');
    fila.className = 'fila-intento';
    var celdaNac = crearCeldaAtributo('Nac', jugador.nationality, jugador.nationality === jugadorSecreto.nationality);
    var celdaClub = crearCeldaAtributo('Club', dificultadSeleccionada === 'dificil' ? '???' : jugador.club, jugador.club === jugadorSecreto.club);
    var celdaPos = crearCeldaAtributo('Pos', jugador.position, jugador.position === jugadorSecreto.position);
    var celdaEdad = crearCellicaNumerica('Edad', jugador.age, jugadorSecreto.age);
    var celdaOverall = crearCellicaNumerica('Ov', jugador.overall, jugadorSecreto.overall);
    var celdaAltura = crearCellicaNumerica('Alt', jugador.heightCm, jugadorSecreto.heightCm);
    fila.appendChild(celdaNac);
    fila.appendChild(celdaClub);
    fila.appendChild(celdaPos);
    fila.appendChild(celdaEdad);
    fila.appendChild(celdaOverall);
    fila.appendChild(celdaAltura);
    tablero.appendChild(fila);
}

function procesarIntento(jugadorIntentado){
    if(!juegoIniciado) {
        juegoIniciado = true;
        iniciarTemporizador();
    }
    if(comprobarJugadorRepetido(jugadorIntentado.id)){
        mostrarModal('Jugador Repetido', 'Ya intentaste con este jugador en esta partida.');
        return;
    }
    historialIntentos.push(jugadorIntentado.id);
    intentosRestantes = intentosRestantes - 1;
    elementoIntentos.textContent = intentosRestantes;
    actualizarDesenfoqueFoto();
    crearFilaIntentoEnTablero(jugadorIntentado);
    if(jugadorIntentado.id === jugadorSecreto.id){
        finalizarPartida(true);
        return;
    }
    if(intentosRestantes === 0){
        finalizarPartida(false);
    }
}

function seleccionarJugador(jugador){
    inputBusqueda.value = '';
    listaAutocompletado.innerHTML = '';
    listaAutocompletado.classList.add('clase-oculta');
    procesarIntento(jugador);
}

function manejarClicFueraBuscardor(evento){
    if (evento.target !== inputBusqueda && evento.target !== listaAutocompletado){
        listaAutocompletado.classList.add('clase-oculta')
    }
}

function crearManejadorSeleccion(jugador){
    return function() {
        seleccionarJugador(jugador);
    };
}

function renderizarAutocompletado(jugadores){
    listaAutocompletado.innerHTML = '';
    if(jugadores.length === 0) {
        listaAutocompletado.classList.add('clase-oculta');
        return;
    }
    var i;
    for(i = 0; i < jugadores.length; i++){
        var jugador = jugadores[i];
        var elementoLi = document.createElement('li');
        elementoLi.textContent = jugador.name;
        elementoLi.setAttribute('data-id', jugador.id);
        elementoLi.addEventListener('click', crearManejadorSeleccion(jugador));
        listaAutocompletado.appendChild(elementoLi);
    }
    listaAutocompletado.classList.remove('clase-oculta');
}

function manejarEscrituraBuscador(){
    var consulta = inputBusqueda.value.trim();
    if (consulta.length < 2) {
        listaAutocompletado.innerHTML = '';
        listaAutocompletado.classList.add('clase-oculta');
        return;
    }
    buscarJugadores(consulta, function(jugadores) { renderizarAutocompletado(jugadores); }, function(error) { mostrarModal('Error de búsqueda', 'Hubo un problema al buscar los jugadores.'); });
}

function inicializarBuscador() {
    inputBusqueda.addEventListener('input', manejarEscrituraBuscador);
    document.addEventListener('click', manejarClicFueraBuscardor);
}

function comenzarPartida() {
    intentosRestantes = 8;
    juegoIniciado = false;
    historialIntentos = [];
    elementoIntentos.textContent = intentosRestantes;
    pantallaRegistro.classList.add('clase-oculta');
    pantallaJuego.classList.remove('clase-oculta');
    if (dificultadSeleccionada === 'facil') {
        fotoJugadorSecreto.src = jugadorSecreto.photo;
        fotoJugadorSecreto.style.filter = 'blur(20px)';
        fotoJugadorSecreto.classList.remove('clase-oculta');
    } else {
        fotoJugadorSecreto.classList.add('clase-oculta');
    }
    inputBusqueda.value = '';
    inputBusqueda.disabled = false;
    inputBusqueda.focus();
    document.getElementById('tablero-intentos').innerHTML = '';
    detenerTemporizador();
    document.getElementById('temporizador').textContent = '00:00';
    inicializarBuscador();
}

function solicitarJugadorSecreto() {
    obtenerJugadorSecreto(function(jugador) { jugadorSecreto = jugador; comenzarPartida(); }, function(error) { mostrarModal('Error de Conexión', 'No se pudo obtener el jugador secreto desde el servidor. Intente nuevamente.'); });
}

function manejarInicioSesion(evento) {
    evento.preventDefault();
    var nombre = inputNombre.value.trim();
    if (nombre.length < 3) {
        errorNombre.classList.remove('clase-oculta');
        return;
    }
    nombreUsuario = nombre;
    dificultadSeleccionada = selectDificultad.value;
    solicitarJugadorSecreto();
}

function reiniciarPartida() {
    solicitarJugadorSecreto();
}

function inicializarJuego(){
    formularioInicio.addEventListener('submit', manejarInicioSesion);
    inputNombre.addEventListener('focus', limpiarErrorNombre);
    inputNombre.addEventListener('blur', validarNombreAlSalir);
    botonReiniciar.addEventListener('click', reiniciarPartida); 
}

inicializarJuego();