'use strict';
var API_BASE_URL = 'https://futbolle-daw-uai-2026.onrender.com/api/players';

function procesarRespuestaJugadorSecreto(respuesta) {
    if (!respuesta.ok) {
        throw new Error('Error al obtener el jugador secreto');
    }
    return respuesta.json();
}

function procesarRespuestaBusqueda(respuesta) {
    if (!respuesta.ok) {
        throw new Error('Error al buscar jugadores');
    }
    return respuesta.json();
}

function obtenerJugadorSecreto(callbackExito, callbackError) {
    fetch(API_BASE_URL + '/random')
        .then(procesarRespuestaJugadorSecreto)
        .then(callbackExito)
        .catch(callbackError);
}

function buscarJugadores(
    consulta,
    callbackExito,
    callbackError
) {
    var url;
    if (consulta.length < 2) {
        callbackExito([]);
        return;
    }
    url = API_BASE_URL
        + '/search?q='
        + encodeURIComponent(consulta)
        + '&limit=8';
    fetch(url)
        .then(procesarRespuestaBusqueda)
        .then(callbackExito)
        .catch(callbackError);
}