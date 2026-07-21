'use strict';
var intervaloTemporizador = null;
var segundosTranscurridos = 0;

function mostrarModal(titulo, mensaje) {
    var modal = document.getElementById('modal-alerta');
    var modalTitulo = document.getElementById('modal-titulo');
    var modalMensaje = document.getElementById('modal-mensaje');
    modalTitulo.textContent = titulo;
    modalMensaje.textContent = mensaje;
    modal.classList.remove('clase-oculta');
}

function cerrarModal() {
    var modal = document.getElementById('modal-alerta');
    modal.classList.add('clase-oculta');
}

function formatearTiempo(segundos) {
    var minutos = Math.floor(segundos/60);
    var segundosRestantes = segundos % 60;
    var strMinutos = minutos < 10 ? '0' + minutos : minutos;
    var strSegundos = segundosRestantes < 10 ? '0' + segundosRestantes : segundosRestantes;
    return strMinutos + ':' + strSegundos;
}

function actualizarTemporizador() {
    var elementoTemporizador;

    elementoTemporizador = document.getElementById('temporizador');
    segundosTranscurridos = segundosTranscurridos + 1;

    elementoTemporizador.textContent = formatearTiempo(
        segundosTranscurridos
    );
}

function iniciarTemporizador() {
    var elementoTemporizador;

    elementoTemporizador = document.getElementById('temporizador');

    if (intervaloTemporizador !== null) {
        clearInterval(intervaloTemporizador);
    }

    segundosTranscurridos = 0;
    elementoTemporizador.textContent = '00:00';

    intervaloTemporizador = setInterval(
        actualizarTemporizador,
        1000
    );
}

function detenerTemporizador(){
    if(intervaloTemporizador !== null){
        clearInterval(intervaloTemporizador);
        intervaloTemporizador = null;
    }
}

function obtenerSegundosTranscurridos() {
    return segundosTranscurridos;
}

function conmutarTema() {
    var cuerpo;
    cuerpo = document.body;

    if (cuerpo.classList.contains('modo-claro')) {
        cuerpo.classList.remove('modo-claro');
        localStorage.setItem('futbolle_tema', 'oscuro');
    } else {
        cuerpo.classList.add('modo-claro');
        localStorage.setItem('futbolle_tema', 'claro');
    }
}

function cargarTemaPreferido() {
    var temaGuardado;
    var cuerpo;

    temaGuardado = localStorage.getItem('futbolle_tema');
    cuerpo = document.body;

    if (temaGuardado === 'claro') {
        cuerpo.classList.add('modo-claro');
    } else {
        cuerpo.classList.remove('modo-claro');
    }
}

document.getElementById('modal-boton-cerrar').addEventListener('click', cerrarModal);