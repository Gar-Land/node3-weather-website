/* NOS CONECNTRAREMOS EN RECUPERAR INFOMACIÓN INTRODUCIDA 
POR EL USUARIO através de un formulario, con código js
clinet side, USANDO LA API FETCH (QUE NO ES PARTE DE JS) 
es UNA API QUE PROPORCIONA EL NAVEGADOR, pero no es
accesible en NodeJS, O SEA QUE EL CÓDIGO QUE USAREMOS
NO ES CÓDIGO FUNCIONAL PARA UN SRIPT DE BACK-END.

usaremos una api de juguete que manda un json simple
nuestro trabajo es saber CÓMO EXTRAER ESTOS DATOS 
CON CÓDIGO JS DESDE EL LADO DEL CLIENTE. 

fetch("https://puzzle.mead.io/puzzle").then((response) => {
    response.json().then((data) => {
        console.log(data);
    });
});

Como primer, supongo que único, argumento de fetch
es la url de la API de la que queremos recuperar alguna
respuesta (valro de retorno). Usamos then para proporcionar
una callback function, QUE TOMA COMO PARÁMETRO a response,
donde response REPRESENTA LA RESPUESTA RETORNADA POR EL 
ENDPOINT (URL) DE LA API. 

Invocamos el método json sobre response PARA PARSEAR
la representación string del JSON retornado por fetch y
volvemos a mandar a llamar then PARA PROPORCIONAR OTRA
CALLBACK FUNCTION y hacer alguna operación que accede a
data (respons parseado a JSON).

Usar fecth VA A ACTIVAR UNA OPERACIÓN (PROCESO) I/O 
ASÍNCRONO, como cuando mandamos a llamar la función 
request (del módulo npm request), ES DECIR NO PODEMOS 
ACCEDER A LOS DATOS EXTRAÍDOS DE MANERA INSTANTÁNEA, ESTO 
QUIERE DECIR QUE TENEMOS QUE PROPORCIONAR UNA CALLBACK 
FUNCTION PARA QUE SEA TRANSERIDA AL CALLBACK QUEE Y EL 
EVENT LOOP LA TRANSFIERA AL STACK, VACÍO, PARA SER 
EJECUTADA. 

Pero con la api fetch (código js client-side) es diferente
, en lugar de eso, USAMOS EL MÉTODO then PARA PROPORCIONAR
NUESTRA FUNCIÓN. 

Challenge: Fetch weather

1. Setup a call to fetch weather for Xalapa
2. Get the parse JSON response
    - If error property, print error
    - If no error property, print location and forecast
3. Refresh the browser and test your work */

const weatherForm = document.querySelector("form");
const forecastHeader = document.getElementsByTagName("h2")[1];
const forecast = document.getElementById("forecast");

const fetchWeather = ({city, state, country} = {}) => {
    if (!(city && state && country)) {
        return console.error("You didn't fill the form correctly");
    }

    fetch(`http://localhost:3000/weather?city=${city}&state=${state}&country=${country}`).then(response => {
        response.json().then(data => {
            if (response.error) {
                forecastHeader.textContent = error;
                forecast.textContent = "";
                return;
            }
                const forecastInfo = JSON.stringify(data.forecast);
                forecastHeader.textContent = "Here is your weather!";
                forecast.textContent = forecastInfo.substring(1, forecastInfo.length - 1);
        });
    });
};

weatherForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const city = e.target.elements.city.value;
    const state = e.target.elements.state.value;
    const country = e.target.elements.country.value;
    
    const location = {city, state, country};
    fetchWeather(location);
    e.stopPropagation();
})