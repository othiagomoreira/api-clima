// Evente de submit no formulário
// Async indica que iremos executar código assincrono(não ordenado)
document.querySelector('.form').addEventListener('submit', async (event) => {
    event.preventDefault(); //previne o evento padrão

    // Pega oque foi digitado no input
    const input = document.querySelector('#searchInput');

    // Algo foi digitado ou não
    if(input.value !== ''){
        clearInfo(); // Limpa

        input.style.border = 'none'; //Retira a border que é ativada quando o input está vazio
        showWarning('Loading...')

        //URL da API
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(input.value)}&appid=393134eedb6c188d1460ca78f22ca9b1&units=metric&lang=pt_br`
       
        const results = await fetch(url);
        const json = await results.json();
        
        //Verifica se a cidade digitada foi entrontrada com base na propriedade cod que a API fornece(cod 200 true / cod '404' false);
        if(json.cod === 200) {
            console.log(json);
            // Monta um objeto com as informações da API, e os exibi usando a function showInfo
            showInfo({
                name: json.name,
                country: json.sys.country,
                temp: json.main.temp,
                tempIncon: json.weather[0].icon,
                tempDescription: json.weather[0].description,
                windSpedd: json.wind.speed,
                windAngle: json.wind.deg
            });

        } else {
            clearInfo();
            showWarning(json.message); /*A API fornece uma propriedade com uma mensagem caso a city não seja encrontrada */
        }

    } else {
        clearInfo();
        
    }
});

// Responsavel por mostrar o nome objeto com as infomarções da API
function showInfo(json) {
    showWarning(''); // Seta como vazio para que não exiba mais a mensagem de loading
    
    document.querySelector('.content__localization').innerText = `${json.name}, ${json.country}`;
    document.querySelector('.temp__graus').innerHTML = `${json.temp} <sup>ºC</sup>`;
    document.querySelector('.wind__info').innerHTML = `${json.windSpedd} <span>Km/h</span>`;
    
    // Exibi icones diferentes conforme o tempo, para isso é preciso pegar a url fornecida pela API e trocar somente a parte onde fica o icone por nossa proprieda tempIcon
    document.querySelector('.content__temp img').setAttribute('src', `http://openweathermap.org/img/wn/${json.tempIncon}@2x.png`);
    
    // Ponteiro dinamico que muda sua posiçao conforme a velocidade do vento(windSpeed), é preciso diminuir 90 graus para compensar e ficar na posição correta
    document.querySelector('.wind__pointer').style.transform = `rotate(${json.windAngle - 90}deg)`;

    // Exibi todos na tela
    document.querySelector('.content').style.display = 'block';
}

function clearInfo() {
    showWarning('');
    document.querySelector('.content').style.display = 'none';
}

// Mostrar ou remover avisos
function showWarning(msg) {
    document.querySelector('.warning').innerText = msg;
}