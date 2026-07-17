'use strict';
var formulario = document.getElementById('formulario-contacto');
var inputNombre = document.getElementById('contacto-nombre');
var inputEmail = document.getElementById('contacto-email');
var inputMensaje = document.getElementById('contacto-mensaje');
var errorNombre = document.getElementById('error-contacto-nombre');
var errorEmail = document.getElementById('error-contacto-email');
var errorMensaje = document.getElementById('error-contacto-mensaje');

function esLetraONumero(caracter) {
    var codigo = caracter.charCodeAt(0);
    if ((codigo > 47 && codigo < 58) || (codigo > 64 && codigo < 91) || (codigo > 96 && codigo < 123) || caracter === ' ') {
        return true;
    }
    return false;
}

function esNombreAlfanumerico(nombre) {
    if (nombre.length === 0) {
        return false;
    }
    var i;
    for (i = 0; i < nombre.length; i++) {
        if (!esLetraONumero(nombre.charAt(i))) {
            return false;
        }
    }
    return true;
}

function esEmailValido(email) {
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        return false;
    }
    return true;
}

function validarNombre() {
    var valor = inputNombre.value.trim();
    if (!esNombreAlfanumerico(valor)) {
        errorNombre.classList.remove('clase-oculta');
        return false;
    }
    errorNombre.classList.add('clase-oculta');
    return true;
}

function validarEmail() {
    var valor = inputEmail.value.trim();
    if (!esEmailValido(valor)) {
        errorEmail.classList.remove('clase-oculta');
        return false;
    }
    errorEmail.classList.add('clase-oculta');
    return true;
}

function validarMensaje() {
    var valor = inputMensaje.value.trim();
    if (valor.length <= 5) {
        errorMensaje.classList.remove('clase-oculta');
        return false;
    }
    errorMensaje.classList.add('clase-oculta');
    return true;
}

function limpiarErrorNombre() {
    errorNombre.classList.add('clase-oculta');
}

function limpiarErrorEmail() {
    errorEmail.classList.add('clase-oculta');
}

function limpiarErrorMensaje() {
    errorMensaje.classList.add('clase-oculta');
}

function manejarEnvioFormulario(evento) {
    evento.preventDefault();
    var nombreEsValido = validarNombre();
    var emailEsValido = validarEmail();
    var mensajeEsValido = validarMensaje();
    if (nombreEsValido && emailEsValido && mensajeEsValido) {
        var destinatario = 'Tomas.ariaskarle@uai.edu.ar';

        var asunto = 'Contacto Futbolle - ' + inputNombre.value.trim();

        var cuerpo = 'Nombre: ' + inputNombre.value.trim() + '\n' + 'Email: ' + inputEmail.value.trim() + '\n\n' + 'Mensaje:\n' + inputMensaje.value.trim();

        var mailtoUrl = 'mailto:' + encodeURIComponent(destinatario) + '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);

        window.location.href = mailtoUrl;

        mostrarModal('¡Formulario Validado!', 'Se abrirá tu gestor de correo electrónico para enviar el mensaje.');

    } else {
        mostrarModal('Formulario Inválido', 'Por favor, corrige los campos con errores antes de enviar.');
    }
}

function inicializarContacto() {
    formulario.addEventListener('submit', manejarEnvioFormulario);
    inputNombre.addEventListener('focus', limpiarErrorNombre);
    inputEmail.addEventListener('focus', limpiarErrorEmail);
    inputMensaje.addEventListener('focus', limpiarErrorMensaje);
    inputNombre.addEventListener('blur', validarNombre);
    inputEmail.addEventListener('blur', validarEmail);
    inputMensaje.addEventListener('blur', validarMensaje);
}
inicializarContacto();