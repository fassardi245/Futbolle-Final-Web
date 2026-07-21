# Futbolle ⚽

Juego web de adivinanza de futbolistas desarrollado como proyecto final individual para la materia **Desarrollo y Arquitecturas Web 2026**.

El sistema selecciona un jugador secreto obtenido desde una API y permite que el usuario intente descubrirlo mediante un buscador con autocompletado. Después de cada intento, el juego compara distintos atributos y muestra pistas visuales mediante colores y flechas.

## Github Pages y repositorio

- **Repositorio:** https://github.com/fassardi245/Futbolle-Final-Web
- **GitHub Page Principal:** https://fassardi245.github.io/Futbolle-Final-Web/
- **Page de contacto:** https://fassardi245.github.io/Futbolle-Final-Web/contacto.html

## Cómo funciona

Al comenzar la partida, el usuario debe ingresar su nombre y elegir una dificultad. El sistema solicita un jugador aleatorio a la API y habilita el buscador.

Cada intento compara los siguientes atributos:

- Nacionalidad
- Club
- Posición
- Edad
- Valoración general
- Altura

Los atributos coincidentes aparecen en verde. Los que no coinciden aparecen en rojo y, en los valores numéricos, una flecha indica si el dato del jugador secreto es mayor o menor.

El usuario dispone de **8 intentos**. Si acierta, gana la partida. Si agota todos los intentos, el juego revela el nombre del jugador secreto.

## Niveles de dificultad

### Fácil

Muestra la fotografía desenfocada del jugador secreto. La imagen se revela progresivamente después de cada intento fallido.

### Medio

No muestra la fotografía. A medida que disminuyen los intentos restantes, se revelan pistas adicionales sobre la edad, la altura y la valoración general.

### Difícil

No incluye pistas adicionales. El jugador debe resolver la partida únicamente mediante el resultado de las comparaciones.

## Funcionalidades

- Jugador secreto aleatorio obtenido desde una API.
- Buscador con autocompletado dinámico.
- Tablero de intentos generado con JavaScript.
- Comparación visual de seis atributos.
- Prevención de intentos vacíos, inválidos o repetidos.
- Contador de intentos restantes.
- Temporizador iniciado con el primer intento.
- Reinicio de partida sin recargar la página.
- Tres niveles de dificultad.
- Sistema de puntuación según dificultad, intentos y tiempo.
- Historial de partidas mediante `LocalStorage`.
- Ordenamiento del historial por fecha o cantidad de intentos.
- Modo claro y modo oscuro con preferencia persistente.
- Sonidos para aciertos, errores y derrotas.
- Formulario de contacto con validaciones realizadas en JavaScript.
- Apertura del cliente de correo predeterminado mediante `mailto:`.
- Diseño adaptable construido con Flexbox.
- Manejo de errores de red mediante modales.

## Sistema de puntuación

El puntaje se calcula únicamente cuando el usuario gana:

```text
Puntaje = puntos base - penalización por intentos + bonus por tiempo
```

Puntos base:

- Fácil: 60 puntos
- Medio: 80 puntos
- Difícil: 100 puntos

Penalización:

- Se restan 10 puntos por cada intento utilizado después del primero.

Bonus por tiempo:

- Menos de 60 segundos: +20 puntos
- Menos de 120 segundos: +10 puntos
- 120 segundos o más: sin bonus

El puntaje mínimo de una partida ganada es de 10 puntos. Una derrota registra 0 puntos.

## API utilizada

El proyecto consume los endpoints provistos por la cátedra:

```text
GET https://futbolle-daw-uai-2026.onrender.com/api/players/random
```

Obtiene un jugador aleatorio completo para utilizarlo como jugador secreto.

```text
GET https://futbolle-daw-uai-2026.onrender.com/api/players/search?q=&limit=8
```

Busca jugadores por coincidencia parcial de nombre y alimenta el autocompletado.

Toda la comunicación se realiza mediante `fetch`. El dataset no se encuentra almacenado dentro del proyecto.

## Tecnologías

- HTML5
- CSS3
- JavaScript ES5
- Fetch API
- LocalStorage
- Git
- GitHub
- GitHub Pages

## Estructura del proyecto

```text
Futbolle-Final-Web/
├── audio/
│   ├── derrota.mp3
│   ├── error.mp3
│   └── exito.mp3
├── css/
│   ├── estilos.css
│   └── reset.css
├── js/
│   ├── api.js
│   ├── contacto.js
│   ├── juego.js
│   └── utils.js
├── .gitignore
├── contacto.html
├── index.html
└── README.md
```

## Ejecución local

No requiere instalación de dependencias.

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto.
3. Ejecutar `index.html` desde un servidor local, por ejemplo Live Server.
4. Verificar que exista conexión a Internet para consultar la API.

Para clonar el repositorio:

```bash
git clone https://github.com/fassardi245/Futbolle-Final-Web.git
```

## Formulario de contacto

La página `contacto.html` incluye validaciones realizadas con JavaScript:

- Nombre alfanumérico y no vacío.
- Correo electrónico con formato válido.
- Mensaje de más de 5 caracteres.

Cuando el formulario es válido, se abre la aplicación de correo configurada en el sistema operativo.

## Persistencia

El proyecto utiliza `LocalStorage` para conservar:

- Nombre del usuario.
- Resultado de la partida.
- Cantidad de intentos.
- Duración.
- Puntaje.
- Fecha y hora.
- Preferencia de tema claro u oscuro.

Los datos permanecen guardados en el navegador hasta que el usuario elimina el almacenamiento local.

## Autor

**Teo Fassardi**

Proyecto final individual — Desarrollo y Arquitecturas Web 2026.
