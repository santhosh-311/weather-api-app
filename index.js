const userLocation =document.getElementById("user-location"),
converter = document.getElementById("converter"),
weatherIcon= document.querySelector('.weather-icon'),
temperature= document.querySelector('.temperature'),
feelslike= document.querySelector('.feelslike'),
description= document.querySelector('.description'),
date= document.querySelector('.date'),
city= document.querySelector('.city'),

HValue=document.getElementById('HValue'),
WValue=document.getElementById('WValue'),
SSValue=document.getElementById('SSValue'),
SRValue=document.getElementById('SRValue'),
PValue=document.getElementById('PValue'),
CValue=document.getElementById('CValue'),
UVValue=document.getElementById('UVValue'),

forecast=document.querySelector('.forecast');

WEATHER_API_ENDPOINT=`https://api.openweathermap.org/data/2.5/weather?appid=90d91a987abd8a340e0a766aeb44f62b&q=`;
WEATHER_DATA_ENDPOINT=`https://api.openweathermap.org/data/3.0/onecall?appid=90d91a987abd8a340e0a766aeb44f62b&exclude=minutely&units=metric&`;
function findUserLocation(){
    forecast.innerHTML="";
    fetch(WEATHER_API_ENDPOINT+userLocation.value).then((response)=>response.json()).then((data)=>
    {
        if (data.cod!="" && data.cod!=200){
            alert(data.message);
            return;
        }
        console.log(data);
        city.innerHTML=data.name+", "+data.sys.country;
        weatherIcon.style.background=`url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
        fetch(WEATHER_DATA_ENDPOINT+`lon=${data.coord.lon}&lat=${data.coord.lat}`).then((response)=>response.json()).then((data)=>
        {
            console.log(data);
            temperature.innerHTML=tempConverter(data.current.temp);
            feelslike.innerHTML="Feels like "+tempConverter(data.current.feels_like);
            description.innerHTML=`<i class='fa-brands fa-cloudversify'></i> &nbsp;`+data.current.weather[0].description;
            option={
                weekday:"long",
                month:"long",
                day:"numeric",
                hour:"numeric",
                minute:"numeric",
                hour12:true
            };
            date.innerHTML=getLongFormatDate(data.current.dt,data.timezone_offset,option);
            HValue.innerHTML=Math.round(data.current.humidity)+"<span>%</span>";
            WValue.innerHTML=Math.round(data.current.wind_speed)+"<span>m</span>"
            options1={
                hours:"numeric",
                minutes:"numeric",
                hour12:true,
            };
            SRValue.innerHTML=getLongFormatDate(data.current.sunrise,data.timezone_offset,options1);
            SSValue.innerHTML=getLongFormatDate(data.current.sunset,data.timezone_offset,options1);
            CValue.innerHTML=data.current.clouds+"<span>%</span>";
            UVValue.innerHTML=data.current.uvi;
            PValue.innerHTML=data.current.pressure+"<span>hPa</span>";

            console.log(data.daily);
            data.daily.forEach((weather)=>{
                let div= document.createElement('div');
                const options={
                    weekday:"long",
                    month:"long",
                    day:"numeric",

                }
                let daily=getLongFormatDate(weather.dt,0,options).split(" at ")[0];
                div.innerHTML=`<p class="day">${daily}</p>`;
                div.innerHTML+=`<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png"/>`
                div.innerHTML+=`<p class="forecast-description">${weather.weather[0].description}</p>`;
                div.innerHTML+=`<span><span>${tempConverter(weather.temp.min)}</span>&nbsp;&nbsp;<span>${tempConverter(weather.temp.max)}</span></span>`
                forecast.append(div);
            })
        })
    })
}
function formatUnixTime(dtValue,offset,options={}){
    const date=new Date((dtValue+offset)*1000)
    return date.toLocaleTimeString([],{ timeZone:"UTC", ...options })
}

function getLongFormatDate(dtValue,offset,options={}){
    return formatUnixTime(dtValue,offset,options);
}

function tempConverter(temp){
    let tempValue=Math.round(temp);
    let message="";
    if (converter.value=="C"){
        message=tempValue+"<span> \xB0C </span>";
    }
    else{
        tempNew=(tempValue*9)/5+32;
        message=tempNew+"<span> \xB0F </span>";
    }
    return message;
}