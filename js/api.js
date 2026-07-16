'use strict';

var API_BASE_URL = 'https://futbolle-daw-uai-2026.onrender.com/api/players';

function obtenerJugadorSecreto(callbackExito, callbackError) {
    fetch(API_BASE_URL + '/random')
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error('Error al obtener el jugador secreto');
            }
            return respuesta.json();
        })
        .then(function (datos) {
            callbackExito(datos);
        })
        .catch(function (error) {
            callbackError(error);
        });
}

function buscarJugadores(consulta, callbackExito, callbackError) {
    if(consulta.length < 2) {
        callbackExito([]);
        return;
    }

    var url = API_BASE_URL + '/search?q=' + encodeURIComponent(consulta) + '&limit=8';

    fetch(url)
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error('Error al buscar jugadores');
            }
            return respuesta.json();
        })
        .then(function (datos) {
            callbackExito(datos);
        })
        .catch(function (error) {
            callbackError(error);
        });
}