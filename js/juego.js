'use strict';
var jugadorSecreto = null;
var nombreUsuario = '';
var intentosRestantes = 8;
var juegoIniciado = false; 
var historialIntentos = [];
var dificultadSeleccionada = 'facil';
var jugadoresSugeridos = [];
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
var btnVerHistorial = document.getElementById('boton-ver-historial');
var modalHistorial = document.getElementById('modal-historial');
var btnCerrarHistorial = document.getElementById('modal-historial-cerrar');
var btnOrdenFecha = document.getElementById('ordenar-fecha');
var btnOrdenIntentos = document.getElementById('ordenar-intentos');
var listaPartidasContenedor = document.getElementById('lista-partidas');
var formularioBusqueda = document.getElementById('formulario-busqueda');
var contenedorPistasMedio = document.getElementById('contenedor-pistas-medio');
var textoPistaMedio = document.getElementById('texto-pista-medio');

function limpiarErrorNombre(){
    errorNombre.classList.add('clase-oculta');
}

function validarNombreAlSalir(){
    var nombre = inputNombre.value.trim();
    if (nombre.length > 0 && nombre.length < 3){
        errorNombre.classList.remove('clase-oculta');
    }
}

function actualizarPistasPasivas() {
    var pxBlur;
    if (dificultadSeleccionada === 'facil') {
        pxBlur = intentosRestantes * 2.5;
        fotoJugadorSecreto.style.filter = 'blur(' + (pxBlur) + 'px)';
    } else if (dificultadSeleccionada === 'medio') {
        if (intentosRestantes === 6) {
            textoPistaMedio.textContent = 'Pista extra: El jugador secreto tiene una Edad de ' + jugadorSecreto.age + ' años.';
        } else if (intentosRestantes === 4) {
            textoPistaMedio.textContent = 'Pistas extras: Edad: ' + jugadorSecreto.age + ' | Altura: ' + jugadorSecreto.heightCm + ' cm.';
        } else if (intentosRestantes === 2) {
            textoPistaMedio.textContent = 'Pistas extras: Edad: ' + jugadorSecreto.age + ' | Altura: ' + jugadorSecreto.heightCm + ' cm | Overall: ' + jugadorSecreto.overall + '.';
        }
    }
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
    var puntosBase;
    var restaIntentos;
    var bonusTiempo;
    var total;
    if (!haGanado) {
        return 0;
    }
    puntosBase = 60;
    if (dificultadSeleccionada === 'medio') {
        puntosBase = 80;
    } else if (dificultadSeleccionada === 'dificil') {
        puntosBase = 100;
    }
    restaIntentos = (intentosUsados - 1) * 10;
    bonusTiempo = 0;
    if (tiempoSegundos < 60) {
        bonusTiempo = 20;
    } else if (tiempoSegundos < 120) {
        bonusTiempo = 10;
    }
    total = puntosBase - restaIntentos + bonusTiempo;
    return total < 10 ? 10 : total;
}

function guardarPartidaEnHistorial(haGanado, intentosUsados, tiempoSegundos) {
    var historial;
    var nuevaPartida;
    var ahora;
    historial = JSON.parse(localStorage.getItem('futbolle_historial')) || [];
    ahora = new Date();
    nuevaPartida = {
        usuario: nombreUsuario,
        resultado: haGanado ? 'Ganó' : 'Perdió',
        intentos: intentosUsados,
        tiempo: formatearTiempo(tiempoSegundos),
        puntos: calcularPuntuacion(
            haGanado,
            intentosUsados,
            tiempoSegundos
        ),
        fecha: ahora.toLocaleString(),
        timestamp: ahora.getTime()
    };
    historial.push(nuevaPartida);
    localStorage.setItem(
        'futbolle_historial',
        JSON.stringify(historial)
    );
}

function finalizarPartida(haGanado) {
    var segundosTotales;
    var intentosUsados;
    var tiempoTotal;
    var puntaje;
    detenerTemporizador();
    inputBusqueda.disabled = true;
    if (dificultadSeleccionada === 'facil') {
        fotoJugadorSecreto.style.filter = 'blur(0px)';
    }
    segundosTotales = obtenerSegundosTranscurridos();
    intentosUsados = 8 - intentosRestantes;
    tiempoTotal = formatearTiempo(segundosTotales);
    puntaje = calcularPuntuacion(haGanado, intentosUsados, segundosTotales);
    guardarPartidaEnHistorial(haGanado, intentosUsados, segundosTotales);
    if (haGanado) {
        reproducirSonido('exito');
        mostrarModal('¡Ganaste! 🎉', 'Adivinaste a ' + jugadorSecreto.name + ' en ' + intentosUsados + ' intento/s. Puntos: ' + puntaje + '. Tiempo: ' + tiempoTotal + '.');
    } else {
        reproducirSonido('derrota');
        mostrarModal('Fin de la partida 😢', 'Te quedaste sin intentos. El jugador secreto era: ' + jugadorSecreto.name + '.');
    }
}

function crearCeldaAtributo(etiqueta, valor, coincide) {
    var celda = document.createElement('div');
    var spanEtiqueta = document.createElement('span');
    var spanValor;
    celda.className = 'celda-atributo ' + (coincide ? 'celda-correcto' : 'celda-incorrecto');
    spanEtiqueta.className = 'etiqueta-celda';
    spanEtiqueta.textContent = etiqueta;
    spanValor = document.createElement('span');
    spanValor.className = 'valor-celda';
    spanValor.textContent = valor;
    celda.appendChild(spanEtiqueta);
    celda.appendChild(spanValor);
    return celda;
}

function crearCeldaNumerica(etiqueta, valorIntentado, valorSecreto) {
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
    var tablero;
    var fila;
    var celdaNac;
    var celdaClub;
    var celdaPos;
    var celdaEdad;
    var celdaOverall;
    var celdaAltura;
    tablero = document.getElementById('tablero-intentos');
    fila = document.createElement('div');
    fila.className = 'fila-intento';
    celdaNac = crearCeldaAtributo('Nac', jugador.nationality, jugador.nationality === jugadorSecreto.nationality);
    celdaClub = crearCeldaAtributo('Club', jugador.club, jugador.club === jugadorSecreto.club);
    celdaPos = crearCeldaAtributo('Pos', jugador.position, jugador.position === jugadorSecreto.position);
    celdaEdad = crearCeldaNumerica('Edad', jugador.age, jugadorSecreto.age);
    celdaOverall = crearCeldaNumerica('Ov', jugador.overall, jugadorSecreto.overall);
    celdaAltura = crearCeldaNumerica('Alt', jugador.heightCm, jugadorSecreto.heightCm);
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
    actualizarPistasPasivas();
    crearFilaIntentoEnTablero(jugadorIntentado);
    if(jugadorIntentado.id === jugadorSecreto.id){
        finalizarPartida(true);
        return;
    }
    if (jugadorIntentado.id !== jugadorSecreto.id && intentosRestantes > 0) {
        reproducirSonido('error');
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

function realizarProcesamientoBusqueda(jugadores) {
    jugadoresSugeridos = jugadores;
    renderizarAutocompletado(jugadores);
}

function manejarErrorBusqueda(error) {
    mostrarModal('Error de búsqueda', 'Hubo un problema al buscar los jugadores.');
}

function manejarEscrituraBuscador() {
    var consulta;
    consulta = inputBusqueda.value.trim();
    if (consulta.length < 2) {
        jugadoresSugeridos = [];
        listaAutocompletado.innerHTML = '';
        listaAutocompletado.classList.add('clase-oculta');
        return;
    }
    buscarJugadores(consulta, realizarProcesamientoBusqueda, manejarErrorBusqueda);
}

function manejarClicFueraBuscardor(evento) {
    if (evento.target !== inputBusqueda && evento.target !== listaAutocompletado) {
        listaAutocompletado.classList.add('clase-oculta');
    }
}

function manejarClicAutocompletado(evento) {
    var elementoSeleccionado;
    var idJugador;
    var i;
    elementoSeleccionado = evento.target;
    if (elementoSeleccionado.tagName !== 'LI') {
        return;
    }
    idJugador = Number(
        elementoSeleccionado.getAttribute('data-id')
    );
    for (i = 0; i < jugadoresSugeridos.length; i = i + 1) {
        if (jugadoresSugeridos[i].id === idJugador) {
            seleccionarJugador(jugadoresSugeridos[i]);
            return;
        }
    }
}

function renderizarAutocompletado(jugadores) {
    var i;
    var jugador;
    var elementoLi;
    listaAutocompletado.innerHTML = '';
    if (jugadores.length === 0) {
        listaAutocompletado.classList.add('clase-oculta');
        return;
    }
    for (i = 0; i < jugadores.length; i = i + 1) {
        jugador = jugadores[i];
        elementoLi = document.createElement('li');
        elementoLi.textContent = jugador.name;
        elementoLi.setAttribute('data-id', jugador.id);
        listaAutocompletado.appendChild(elementoLi);
    }
    listaAutocompletado.classList.remove('clase-oculta');
}

function inicializarBuscador() {
    inputBusqueda.addEventListener(
        'input',
        manejarEscrituraBuscador
    );

    listaAutocompletado.addEventListener(
        'click',
        manejarClicAutocompletado
    );

    document.addEventListener(
        'click',
        manejarClicFueraBuscardor
    );
}

function manejarSubmitBuscador(evento) {
    var consulta;
    var i;
    var jugadorEncontrado;
    evento.preventDefault();
    consulta = inputBusqueda.value.trim().toLowerCase();
    if (consulta === '') {
        mostrarModal('Intento Vacío', 'Por favor, escribe el nombre de un jugador.');
        return;
    }
    jugadorEncontrado = null;
    for (i = 0; i < jugadoresSugeridos.length; i = i + 1) {
        if (jugadoresSugeridos[i].name.toLowerCase() === consulta) {
            jugadorEncontrado = jugadoresSugeridos[i];
        }
    }
    if (jugadorEncontrado !== null) {
        seleccionarJugador(jugadorEncontrado);
    } else {
        mostrarModal('Jugador No Válido', 'El jugador ingresado no coincide con las sugerencias. Por favor, selecciónalo de la lista desplegable.');
    }
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
        contenedorPistasMedio.classList.add('clase-oculta');
    } else if (dificultadSeleccionada === 'medio') {
        fotoJugadorSecreto.classList.add('clase-oculta');
        contenedorPistasMedio.classList.remove('clase-oculta');
        textoPistaMedio.textContent = 'Pistas reveladas: Ninguna aún. Realiza intentos para desbloquear cualidades.';
    } else {
        fotoJugadorSecreto.classList.add('clase-oculta');
        contenedorPistasMedio.classList.add('clase-oculta');
    }
    inputBusqueda.value = '';
    inputBusqueda.disabled = false;
    inputBusqueda.focus();
    document.getElementById('tablero-intentos').innerHTML = '';
    detenerTemporizador();
    document.getElementById('temporizador').textContent = '00:00';
    actualizarPistasPasivas();
}

function manejarJugadorSecretoObtenido(jugador) {
    jugadorSecreto = jugador;
    comenzarPartida();
}

function manejarErrorJugadorSecreto() {
    mostrarModal(
        'Error de Conexión',
        'No se pudo obtener el jugador secreto desde el servidor. Intente nuevamente.'
    );
}

function solicitarJugadorSecreto() {
    obtenerJugadorSecreto(
        manejarJugadorSecretoObtenido,
        manejarErrorJugadorSecreto
    );
}

function manejarInicioSesion(evento) {
    var nombre = inputNombre.value.trim();
    evento.preventDefault();
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

function renderizarHistorial() {
    var i;
    var historial;
    var sinDatos;
    var partida;
    var tarjeta;
    var tituloPartida;
    var spanResultado;
    var infoContenedor;
    var spanDetalles;
    var spanFecha;
    historial = JSON.parse(localStorage.getItem('futbolle_historial')) || [];
    listaPartidasContenedor.innerHTML = '';
    if (historial.length === 0) {
        sinDatos = document.createElement('p');
        sinDatos.textContent = 'No hay partidas registradas aún.';
        listaPartidasContenedor.appendChild(sinDatos);
        return;
    }
    for (i = 0; i < historial.length; i = i + 1) {
        partida = historial[i];
        tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-partida';
        tituloPartida = document.createElement('strong');
        tituloPartida.textContent = partida.usuario + ' - ';
        spanResultado = document.createElement('span');
        spanResultado.textContent = partida.resultado;
        spanResultado.className = partida.resultado === 'Ganó' ? 'texto-gano' : 'texto-perdio';
        tituloPartida.appendChild(spanResultado);
        infoContenedor = document.createElement('div');
        infoContenedor.className = 'tarjeta-partida-info';
        spanDetalles = document.createElement('span');
        spanDetalles.textContent = 'Intentos: ' + partida.intentos + ' | Puntos: ' + partida.puntos + ' | Tiempo: ' + partida.tiempo;
        spanFecha = document.createElement('span');
        spanFecha.textContent = partida.fecha;
        infoContenedor.appendChild(spanDetalles);
        infoContenedor.appendChild(spanFecha);
        tarjeta.appendChild(tituloPartida);
        tarjeta.appendChild(infoContenedor);
        listaPartidasContenedor.appendChild(tarjeta);
    }
}

function abrirHistorial() {
    renderizarHistorial();
    modalHistorial.classList.remove('clase-oculta');
}

function cerrarHistorial() {
    modalHistorial.classList.add('clase-oculta');

}

function ordenarPorFecha() {
    var historial;
    var timestampActual;
    var timestampSiguiente;
    var temporal;
    var i;
    var j;

    historial = JSON.parse(
        localStorage.getItem('futbolle_historial')
    ) || [];

    for (i = 0; i < historial.length - 1; i = i + 1) {
        for (j = 0; j < historial.length - 1 - i; j = j + 1) {
            timestampActual = historial[j].timestamp || 0;
            timestampSiguiente = historial[j + 1].timestamp || 0;
            if (timestampActual < timestampSiguiente) {
                temporal = historial[j];
                historial[j] = historial[j + 1];
                historial[j + 1] = temporal;
            }
        }
    }

    localStorage.setItem(
        'futbolle_historial',
        JSON.stringify(historial)
    );

    renderizarHistorial();
}

function ordenarPorIntentos() {
    var historial = JSON.parse(localStorage.getItem('futbolle_historial')) || [];
    var i;
    var j;
    var temporal;
    for (i = 0; i < historial.length - 1; i = i + 1) {
        for (j = 0; j < historial.length - 1 - i; j = j + 1) {
            if (historial[j].intentos > historial[j + 1].intentos) {
                temporal = historial[j];
                historial[j] = historial[j + 1];
                historial[j + 1] = temporal;
            }
        }
    }
    localStorage.setItem('futbolle_historial', JSON.stringify(historial));
    renderizarHistorial();
}

function manejarErrorSonido(error) {
    console.log(
        'No se pudo reproducir el sonido: '
        + error.message
    );
}

function reproducirSonido(tipo) {
    var audio;
    if (tipo === 'exito') {
        audio = new Audio('audio/exito.mp3');
    } else if (tipo === 'error') {
        audio = new Audio('audio/error.mp3');
    } else if (tipo === 'derrota') {
        audio = new Audio('audio/derrota.mp3');
    }
    if (audio) {
        audio.play().catch(manejarErrorSonido);
    }
}

function inicializarJuego() {
    formularioInicio.addEventListener('submit', manejarInicioSesion);
    formularioBusqueda.addEventListener('submit', manejarSubmitBuscador);
    inputNombre.addEventListener('focus', limpiarErrorNombre);
    inputNombre.addEventListener('blur', validarNombreAlSalir);
    botonReiniciar.addEventListener('click', reiniciarPartida);
    btnVerHistorial.addEventListener('click', abrirHistorial);
    btnCerrarHistorial.addEventListener('click', cerrarHistorial);
    btnOrdenFecha.addEventListener('click', ordenarPorFecha);
    btnOrdenIntentos.addEventListener('click', ordenarPorIntentos);
    document.getElementById('boton-tema').addEventListener('click', conmutarTema);
    inicializarBuscador();
    cargarTemaPreferido();
}

inicializarJuego();