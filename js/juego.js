'use strict'
var jugadorSecreto = null;
var nombreUsuario = '';
var intentosRestantes = 8;
var juegoIniciado = false; 
var historialIntentos = [];
var inputBusqueda = document.getElementById('input-busqueda');
var listaAutocompletado = document.getElementById('lista-autocompletado');
var formularioInicio = document.getElementById('formulario-inicio');
var inputNombre = document.getElementById('nombre-usuario');
var errorNombre = document.getElementById('error-nombre');
var pantallaRegistro = document.getElementById('pantalla-registro');
var pantallaJuego = document.getElementById('pantalla-juego');
var elementoIntentos = document.getElementById('intentos-restantes');
var botonReiniciar = document.getElementById('boton-reiniciar');

function inicializarJuego(){
    formularioInicio.addEventListener('submit', manejarInicioSesion);
    inputNombre.addEventListener('focus', limpiarErrorNombre);
    inputNombre.addEventListener('blur', validarNombreAlSalir);
    botonReiniciar.addEventListener('click', reiniciarPartida); 
}

function manejarInicioSesion(evento) {
    evento.preventDefault();
    var nombre = inputNombre.value.trim();
    if (nombre.length < 3) {
        errorNombre.classList.remove('clase-oculta');
        return;
    }
    nombreUsuario = nombre;
    solicitarJugadorSecreto();
}

function limpiarErrorNombre(){
    errorNombre.classList.add('clase-oculta');
}

function validarNombreAlSalir(){
    var nombre = inputNombre.value.trim();
    if (nombre.length > 0 && nombre.length < 3){
        errorNombre.classList.remove('clase-oculta');
    }
}

function solicitarJugadorSecreto() {
    obtenerJugadorSecreto(
        function(jugador) {
            jugadorSecreto = jugador;
            comenzarPartida();
        },
        function(error) {
            mostrarModal('Error de Conexión', 'No se pudo obtener el jugador secreto desde el servidor. Intente nuevamente.');
        }
    );
}

function comenzarPartida() {
    intentosRestantes = 8;
    juegoIniciado = false;
    historialIntentos = [];
    elementoIntentos.textContent = intentosRestantes;
    pantallaRegistro.classList.add('clase-oculta');
    pantallaJuego.classList.remove('clase-oculta');
    inputBusqueda.value = '';
    inputBusqueda.disabled = false;
    inputBusqueda.focus();
    document.getElementById('tablero-intentos').innerHTML = '';
    detenerTemporizador();
    document.getElementById('temporizador').textContent = '00:00';
    inicializarBuscador();
}

function reiniciarPartida() {
    solicitarJugadorSecreto();
}
inicializarJuego();

function inicializarBuscador() {
    inputBusqueda.addEventListener('input', manejarEscrituraBuscador);
    document.addEventListener('click', manejarClicFueraBuscardor);
}

function manejarEscrituraBuscador(){
    var consulta = inputBusqueda.value.trim();
    if (consulta.length < 2) {
        listaAutocompletado.innerHTML = '';
        listaAutocompletado.classList.add('clase-oculta');
        return;
    }
    buscarJugadores(
        consulta,
        function(jugadores) {
            renderizarAutocompletado(jugadores);
        },
        function(error) {
            mostrarModal('Error de búsqueda', 'Hubo un problema al buscar los jugadores.');
        }
    );
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

function crearManejadorSeleccion(jugador){
    return function() {
        seleccionarJugador(jugador);
    };
}

function manejarClicFueraBuscardor(evento){
    if (evento.target !== inputBusqueda && evento.target !== listaAutocompletado){
        listaAutocompletado.classList.add('clase-oculta')
    }
}

function seleccionarJugador(jugador){
    inputBusqueda.value = '';
    listaAutocompletado.innerHTML = '';
    listaAutocompletado.classList.add('clase-oculta');
    procesarIntento(jugador);
}

