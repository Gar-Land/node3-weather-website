const path = require("path");
const express = require("express");

const getUserCoordinates = require("./utils/geocode.js");
const getUserWeather = require("./utils/forecast.js");
/* Básicamente el modulo npm es un módulo que facilita
muchísimo la creación de servidores web que sirvan
cosas como: 

documentos html
css para estilizar
código js para interacción en el lado del cliente
Datos JSON

Para tanto sitios web estáticos como para servir a
nuestras propias API HTTP complejas basadas JSON.

Cómo tal lo que require() extrae del módulo npm 
express es una sola función. Dicha función no toma
ningún tipo de argumento.

No como en otros casos que require() extrae algún 
objeto literal. */

const hbs = require("hbs"); // extraemos las
// funcionalidades de hbs, plugin de handleBars para
// integrar y servir fácilmente recursos dinámicos y 
// reutilizables a nuestro servidor

/* Con el módulo npm hbs, nos permitirá crear partials,
es decir, templates que podemos reutilizar para toda
página web servida por nuestro servidor, como: headers o 
footers

Con el objetivo de conseguir una experiencia de usuario
cohesiva.

LO QUE HAREMOS ES INDICARLE A hbs DÓNDE HEMOS ALOJADO
NUESTROS PARTIALS, que también son files con la extensión
.hbs  */  
 
const partialsPath = path.join(__dirname, "../templates/partials");
hbs.registerPartials(partialsPath);
// el método registerPartials, TOMA COMO AARGUMENTO el 
// path DONDE ESTÁN ALOJADOS NUESTROS PARTIALS. 

// console.log(__dirname); variable muy útil 
// proporcionada por NodeJS para CONSEGUIR 
// LA URL ABSOLUTA DEL DIRECTORIO EN EL QUE
// RESIDE ESTE JS SCRIPT

// console.log(__filename); variable muy útil
// proporcionada por NodeJS para CONSEGUIR
// LA URL ABSOLUTA DE ESTE JS SRCIPT
 
/* esta es una función proporcionada por nodejs 
dentro de un módulo llamado path.

Esta función sirve para unir todos los segmentos 
de las rutas (urls) dadas (primer argumento).

Puedes subir de directorio usando ".." 
(segundo parámetro).

Puedes usar el 2do parámetro no solo para subir 
entre directorios, sino que también puedes acceder
a otros archivos.

LUEGO NORMALIZA LA RUTA RESULTANTE

console.log(path.join(__dirname, "../public")); */

const app = express(); // esta línea lo que hace
// es GENERAR TU APLICACIÓN

app.get("", (req, res) => {
    res.render("index", {
        title: "Weather",
        name: "Jeronimo"
    });
    /* En este caso usamos el método render en lugar 
    de send (que manda recursos), PORQUE NOS PERMITE
    RENDERIZAR UNA DE NUESTRAS VIEWS (recursos 
    dinámicos), HEMOS CONFIGURADO A EXPRESS PARA QUE 
    USE EL TEMPLATE ENGINE hbs
    
    El método render acepta un parámtero, string, que
    representa el nombre del archivo dentro de nuestro
    directorio views.
    
    El 2do parámetro acepta un objeto literal que 
    contiene atributos que representan valores dinámicos 
    que pueden ser inyectados a tu view. */
});

const public_dir = path.join(__dirname, "../public");

app.use(express.static(public_dir)); // por el momento 
// definamos app.use como una manera de 
// personalizar tu servidor 

// express.static() ES UNA FUNCIÓN QUE CUYO
// VALOR DE RETORNO LO PASAMOS A app.use()
// static TOMA COMO ARGUMENTO EL PATH DEL 
// FOLDER QUE QUEREMOS SERVIR

/* AHORA USAMOS VARIOS MÉTODOS PARA CONFIGURAR 
NUESTRA APLICACIÓN QUE SON PROPORCIONADOS POR 
LA VARIALBE APP. 

Imagina que tenemos el dominio app.com
en el que queremos mostrar algo como la página
de nuestra compañía

Pero también tendremos otras páginas como:
app.com/help
app.com/about

AQUÍ TENEMOS UN SOLO DOMINIO Y TODAS ESTAS SERÁN 
EJECUTADAS EN UN MISMO SERVIDOR EXPRESSS

LO ÚNICO QUE HEMOS AJUSTADO CON app.com 
app.com/helpl, app.com/about SON MÚLTIPLES RUTAS

AHORA CÓMO CONFIGURAMOS A NUESTRO SERVIDOR PARA 
ENVIAR UNA RESPUESTA CUANDO ALGUIEN QUIERA CONSEGUIR
ALGO DE UNA RUTA EN PARTICULAR? Hacemos esto usando 
un método proporcionado por nuestra variable app. */

// app.get(); esto le dice al servidor qué hacer 
// cuando alguien quiera conseguir recursos de una url 
// en particular tal ves tengamos que mandar html o 
// json

/* get toma dos argumentos, lo primero es la ruta 
(url relativa) y una función QUE DICE LO QUE DEBERÍA
DE HACER EL SERVIDOR CUANDO ALGUIEN VISITA
ESTA RUTA EN PARTICULAR. 

La función callback tomará dos argumentos:

1. UN OBJETO QUE CONTIENE INFROMACIÓN ACERCA DE LA 
SOLICITUD ENTRANTE AL SERVIDOR, comunmente es llamado 
req

2. EL OTRO ARGUMENTO ES UNA RESPUESTA QUE CONTIENE 
UN MONTÓN DE MÉTODOS QUE NOS PERMITEN PERSONALIZAR LO
QUE ENVIARÉMOS COMO RESPUESTA A LA SOLICITUD ENTRANTE. 
Comunmente es llamado res.

Podría ser leer datos de alguna base de datos
o proporcionar html.

Aquí estamos mandando algo a app.com

app.get('', (req, res) => {
    res.send("<h1>Weather</h1>") // para mandar texto 
    // al buscador usamos el método send de regreso 
    // al cliente
});

app.get("/help", (req, res) => {
    res.send({
        name: "Andrew",
        age: 27
    }); // AUTOMÁTICAMENTE send VA A STRINGIFICAR 
    // NUESTRO OBJETO LITERAL A UNA REPRESENTACIÓN
    // STRING DE UN JSON
}); */

/* Como inicializas o arrancas tu servidor? Pues 
tenemos que invocar un método sobre app, QUE SOLO 
USAREMOS UNA SOLA VEZ EN NUESTRA APPLICACIÓN

app.get("/about.html", (req, res) => {
    const htmlDocument = path.join(__dirname, "../public/about.html");
    res.send(app.use(express.static(htmlDocument)));

    Como puedes ver se vuelve engorroso trabajar 
    con html, ASÍ QUE SERÍA MUY COMODO ESCRIBIR 
    DOCUMENTOS HTML SEPARADAMENTE Y SERVIRLO A LA 
    PÁGINA WEB CON EL SERVIDOR, así que 
    configuraremos nuestro servidor para que sea capaz 
    de servir una variedad de recursos. que puede 
    contener archivos html, archivos css, videos, 
    imágenes y código client-side JavaScript y más. 
    
    En un directorio llamado public residirán todos 
    los recursos que el servidor va a servir.
}); */

// esta ruta en particular se encargará de renderizar el
// pronóstico del clima del usuario, basado en su 
// dirección proporcionada atrvés de un formulario
app.get("/weather", (req, res) => {
    const apiKey = "0d0fc430ed31d222c2c9d97888fdbdc4";

    /* Empezemos hablando sobre las query string
    una query string es algo que proporcionará el buscador
    COMO PARTE DE LA URL.
    
    Luego el servidor leerá el valor de la query string
    para conseguir información.  */

    const {city, state, country} = req.query;

    if (!(city && state && country)) {
        return res.send({
            error: "You must provide a valid address for a weather forecast"
        });
    }

    // key value pairs a usar serían: city, state, country
    getUserCoordinates(apiKey, req.query, (error, {lat, lon} = {}) => {
        if (error) {
            return res.send({error});
        }

        getUserWeather(apiKey, lat, lon, (error, forecast) => {
            if (error) {
                return res.send({error});
            }

            res.send({
                lat,
                lon,
                forecast
            });
        });
    });
}); 
 
// Creemos una url QUE ENVÍA JSON
// estámos creando un endpoint que ENVÍA PRODUCTOS
// DE NUESTRO COMERCIO ELECTRÓNICO QUE SE MOSTRARÁN EN EL
// NAVEGADOR
app.get("/products", (req, res) => {
    /* al visitar esta ruta en partiuclar, el json nunca va
    a cambiar. Si quisieramos implementar una función de
    búsqueda, USARIAMOS UNA QUERY STRING, RECUERDA QUE LAS
    QUERY STRINGS SERÁN PROPORCIONADAS AL FINAL DE LA URL.
    
    Usando el caracter ?, seguido de pares key value, para 
    pasar información adicional que queremos proporcionar 
    al servidor

    Ejemplo: localhost:3000/products?search=games

    ESTO VA A INICIALIZAR OTRA NUEVA SOLICITUD ENTRANTE A 
    NUESTRO SERVIDOR PERO PASARÁ LA INFORMACIÓN ADICIONAL
    DE NUESTRO ÚNICO PAR KEY VALUE (search=games).

    Ahora como somos los que están constuyendo el back-end 
    somos libres de escoger cuantos key value pairs podemos
    admitir. 

    Ejemplo: localhost:3000/products?search=games&rating=5

    AHORA CÓMO ES QUE EL SERVIDOR OBTIENE ESTA INFROMACIÓN?

    PUES ESTÁ DISPONIBLE DESDE LOS ARGUMENTOS QUE SON 
    PASADOS A NUESTRA CALLBACK FUNCTION QUE ES PASADA COMO
    ARGUMENTO PARA EL 2DO PARÁMETRO DEL MÉTODO get(). 

    Ahora la infromación o el valor de la query string, 
    VIVE EN EL OBJETO LITERAL req. Puedes acceder a los 
    valores de los key value pairs ACCEDIENDO A LA 
    PROPIEDAD query (también es un objeto) DE req. 

    req.query ES UN OBJETO CUYOS ATRIBUTOS TIENEN LOS 
    NOMBRES DE LAS KEY (DE LOS PARES KEY-VALUE) Y CUYOS
    VALORES CORRESPONDIENTES SON LOS VALUE (DE LOS PARES
    KEY-VALUE). */
    const {search, rating} = req.query;
    if (!search) {
        return res.send({
            error: "You must provide a search term",
        }); // primer respuesta
    }

    res.send({
        products: []
    }) // segunda respuesta
 
    // NO PUEDES RESPONDER DOS VECES A LA MISMA SOLICITUD 
    // HTTP. LAS SOLICITUDES HTTP TIENEN UNA SOLA SOLICITUD
    // QUE VA AL SERVIDOR Y UNA SOLA RESPUESTA QUE REGRESA
    // Si alguna vez ves el error:
    // Cannot set headers after thery are sent to the 
    // client es por que estás realizando dos respuesta 
    // para alguna solicitud http 

    // en este caso un patron compún de express es usar un 
    // return para la respuesta (línea 253).
});

const viewsPath = path.join(__dirname, "../templates/views");
app.set("views", viewsPath);

/* Las dos líneas de arriba son para MODIFICAR UNO DE LOS 
AJUSTES PREDETERMINAMOS QUE TIENE EXPRESS. 

Este ajuste está relacionado con la línea: 
app.set("view engine", "hbs");

Que le indica a express que estámos usando el template
engine "hbs". Para poder renderizar contenido dinámico 

Regresando a las dos líneas de arriba, estas son 
necesarias porque el directorio predeterminado en el que 
express busca tus recursos dinámicos para poder servirlos;
SE LLAMAN VIEWS. Si quisieramos personalizar esto, 
tendríamos que usar las dos líneas de arriba que 
configuran a express para que en lugar de buscar en el 
directorio views, haga la búsqueda en el directorio 
templates. 

En caso de no haber escrito:
const viewsPath = path.join(__dirname, "../templates");
app.set("views", viewsPath);

Y haber llamado a nuestro directorio "templates", 
nuestro servidor arrojaría un error. */

app.set('view engine', 'hbs') 
// le indica a express qué template engine vamos a usar

// Expresss ESPERA QUE TODAS TUS VIEW, ES DECIR TUS 
// TEMPLATES, VIVAN EN UN FOLDER EN ESPECÍFICO.

/* el método set invocado sobre app, te permite AJUSTAR
UN VALOR PARA ALGUNA CONFIGURACIÓN DE EXPRESS DADA,
el primer argumento es una key (EL NOMBRE DA LA 
CONFIGURACIÓN) y el segundo al valor para la 
configuración*/

app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help",
        name: "Jeronimo"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        titles: ["What we do", "Our history", "About me"],
        name: "Jeronimo"
    });
});

app.get("/help/*", (req, res) => {
    res.render("404", {
        notFound: "Help article not found",
        name: "Jeronimo"
    });
});

app.get('*', (req, res) => {
    res.render("404", {
        notFound: "Page not found",
        name: "Jeronimo"
    });
}); /* AQUÍ EL CARACTER '*' EXPRESS LO LLAMA WILD CARD 
CHARACTER (COMODÍN) QUE QUIRE DECIR, CUALQUIER OTRA RUTA
QUE NO HA SIDO CORRESPONDIDA por algún otro método get.

AHORA, ESTE app.get EN PARTICULAR TIENE QUE IR AL FINAL
ES PORQUE LA MANERA EN QUE EXPRESS EMPAREJA LA RUTA DE LA
SOLICITUD ENTRANTE CON EL app.get CORRESPONDIENTE. 

Cuando express recibe una nueva solicitud entrante, 
express empieza a hacer una busqueda por algúna 
coincidencia. Express corrobora en el orden en el que 
escribiste tus app.get() (que le indican cómo y qúe debe
de servir en caso de que express reciba alguna solicitud 
entrante desde alguna ruta en particular).

En caso de que nosotros hayamos escrito este último 
app.get() entonces para rutas como localhost:300/about 
(ruta para la que hemos escrito un app.get()), la 
respuesta de nuestro servidor sería la string
"My 404 page". */

app.listen(3000, () => {
    console.log("Server is up on port 3000");
}); 

/* escucha en un puerto en específico por el momento 
lo usaremos en un puetro en el que se desarrolla 
comúnmente: 3000.

Otro argumento comúnmente pasado ES UNA FUNCIÓN 
CALLBACK QUE SOLAMENTE SE EJECUTA CUANDO EL SERVIDOR 
ESTÁ EN FUNCIONAMIENTO. 

El proceso de inicializar el servidor es un proceso 
SÍNCRONO que sucederá casi instantáneamente. */

// Podemos inicializar el servidor al usar:
// node src/app.js

// El trabajo de un servidor web es nunca parar
// así que permanecerá en funcionamiento para
// servir nuesvas solicitudes entrantes.
// para apagarlo podemos usar ctrl c

/* Luego vermeos COMO CREAR PÁGINAS 404 PARA 
RECURSOS QUE NO EXISTEN DENTRO DE NUESTRO SERVIDOR.
Lo menciono ya que al tratar de ingresar a la ruta
localhost:3000/about, el servidor desplegará:

Cannot GET / about 

Esto sucede ya que no hemos configurado al servidor 
para poder servir a alguna ruta en particular. 
Es decir no hemos escrito:

app.get('/about', (req, res) => {
    res.send("About page");
}); 

Challenge: Setup two new routes

1. Setup an about route and render a page title
2. Setup a weather route and render a page title
3. Test your work by visiting both in the borwser. 

Challenge: Update routes

1. Setup about route to render a title with HTML
2. Setup a weather route to send back JSON
    - Object with forecast and location strings
3. Test your work by visiting both in the headebrowser 

Challenge: 

1. Create a html page for about with "About" title
2. Create a html page ofr help with "Help" title
3. Remove the old route handlers for both
4. Visit both in the browser to test your work 

Challenge: Create a template for help page

1. Setup a help template to render a help message to the 
screen.
2. Setup the help route and render the template with an 
example message.
3. Visit the route in the browser and see your help 
message print. 

Challenge: Create a partial for the footer

1. Setup the tmplate for the footer partial 
"Created by Some Name"
2. Render the partial at the bottom of all three pages
3. Test your work by visiting all three pages

Challenge: Create an render a 404 page with handleBars

1. Setup the template to render the header and footer
2. Setup the template to render an error message in a
paragraph
3. Render the template for both 404 routes
    - Page not found
    - Help article not found
4. Test your work. Visit /what and /help/units 

Challenge: Update weather endpoint to accept address

1. No address? Send back an error message
2. Address? Sen back the static JSON
    - Add address property into JSON wich return the 
    provided address
3. Test /weather and /weather?address=philadelphia

Challenge: Wire up /weather

1. Require geocode/forecast into app.js
2. Use the address to geocode
3. Use the cooordinates to get forecast
4. Send back the real forecast and location */

/* Hasta el momento ya sabes como servir recursos 
estáticos, como para páginas web estáticas. AHORA
APRENDEREMOS A USAR UN TEMPLATE ENGINE QUE NOS PERMITA
HACER PÁGINAS WEB DINÁMICAS. 

Usaremos el template engine llamado handle bars, NOS
PERMITIRÁ RENDERIZAR DOCUMENTOS DINÁMICOS EN LUGAR DE 
ESTÁTICOS Y NOS PERMITIRÁ FÁCILMENTE CREAR CÓDIGO QUE
PODEMOS REHUSAR A LO LARGO DE TODAS NUESTRAS PÁGINAS.

Para que nuestro template engine, hay dos módulos NPM
que tenemos que instalar. Handle bars es una librería 
de bajo nivel que implementa handle bars en JavaScript. */