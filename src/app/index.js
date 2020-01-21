import angular from 'angular';
import template from './index.tpl.html';
import '../style/app.scss';

let component = {
    template // Use ES6 enhanced object literals.
};

angular.module('app', []).component('app', component);

document.addEventListener("DOMContentLoaded", ready);

function ready() {
    const cityList = document.getElementById("cityList");
    const cityName = document.getElementById("cityID");

    let timeout = null;


    cityName.oninput = function () {
        const currentTimeout = setTimeout(() => {
            if (currentTimeout !== timeout) return 0;

            fetch(`https://nominatim.openstreetmap.org/search?city=${cityName.value.toLowerCase()}&format=json&addressdetails=1&namedetails=1`).then(function (resp) {
                return resp.json()
            }).then(function (data) {

                while (cityList.firstChild) {
                    cityList.removeChild(cityList.firstChild);
                }
                let currentType = undefined;

                for (let i = 0; i < data.length; i++) {
                    let obj = data[i];

                    if (obj.type === 'village' || obj.type === 'city') {
                        currentType = obj.type;
                    } else {
                        continue;
                    }

                    let li = document.createElement("li");
                    li.innerHTML = obj.address[currentType] + ": " + obj.address.country;
                    cityList.appendChild(li);
                    li.onclick = listClickFunc.bind(null, obj.address[currentType], obj.address.country);
                }
            });
        }, 2000);
        timeout = currentTimeout;

        function listClickFunc(place, country) {
            fetch("http://api.openweathermap.org/data/2.5/weather?q=" + place + "," + country + "&lang=ru&appid=230ca844e2e63fb3ecd2958af66d3374").then(function (resp) {
                return resp.json()
            }).then(function (data) {
                console.log('Result:');
                console.log(data);
                document.getElementById("cityBlock").innerHTML = place + ",";
                document.getElementById("countryBlock").innerHTML = country;
                for (let i = 0; i < data.weather.length; i++){
                    if (data.weather[i]){
                        let iconWrap = document.getElementById("iconBlock");
                        let div = document.createElement("div");
                        let img = document.createElement("img");
                        div.id =i + "DivId";
                        img.id = i + "ImgId";
                        iconWrap.appendChild(div);
                        div.appendChild(img);
                        img.src = "http://openweathermap.org/img/wn/" + data.weather[i].icon + "@2x.png";
                        img.alt = data.weather[i].description;
                        img.title = data.weather[i].description;
                    }
                }
                const temp = document.getElementById("tempBlock");
                const pressure = document.getElementById("pressBlock");
                const humidity = document.getElementById("humBlock");
                const wind = document.getElementById("windBlock");
                temp.innerHTML = Math.round(data.main.temp - 273) + " °";
                pressure.innerHTML = Math.round(data.main.pressure / 1.3) + " мм";
                pressure.title = "Давление, мм рт. ст.";
                humidity.innerHTML = data.main.humidity + " %";
                humidity.title = "Влажность";
                wind.innerHTML = data.wind.speed + " м/с";
                wind.title = "Скорость ветра";
            });
            document.getElementById("prevBlockId").style.display = "none";
            document.getElementById("currentBlockId").style.display = "inline-block";
            document.getElementById("closeBlock").onclick = function () {
                while (document.getElementById("iconBlock").firstChild) {
                    document.getElementById("iconBlock").removeChild(document.getElementById("iconBlock").firstChild);
                }
                document.getElementById("currentBlockId").style.display = "none";
                document.getElementById("prevBlockId").style.display = "inline-block";
            }
        }
    };


    /*
    const cityApiKey = "da8e5ccc56661e5b739f1f9139e2dfe1";
    fetch("http://htmlweb.ru/geo/api.php?city_name=" + cityName + "&api_key=" + cityApiKey).then(function (resp) {return resp.text() }).then(function (data) {
        console.log(data);

    })
*/

}


