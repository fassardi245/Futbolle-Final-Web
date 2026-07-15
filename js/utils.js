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

function iniciarTemporizador() {
    var elementoTemporizador = document.getElementById('temporizador');
    if(intervaloTemporizador !== null){
        clearInterval(intervaloTemporizador);
    }
    segundosTranscurridos = 0;
    elementoTemporizador.textContent = '00:00'
    intervaloTemporizador = setInterval(function() {
        segundosTranscurridos = segundosTranscurridos + 1;
        elementoTemporizador.textContent = formatearTiempo(segundosTranscurridos);
    }, 1000);
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

document.getElementById('modal-boton-cerrar').addEventListener('click', cerrarModal);