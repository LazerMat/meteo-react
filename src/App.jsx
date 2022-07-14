import axios from "axios"
import { useEffect, useState } from "react"

export default function App() {

const date = new Date()

const day = date.toLocaleString('fr-FR', {
    weekday: 'long'
})

const time = date.toLocaleString('fr-FR', {
    hour: 'numeric',
    minute: 'numeric'
})

const [data, setData] = useState()

useEffect(() => {
        navigator.geolocation.getCurrentPosition(pos => {
            axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=bcacfae3308438a0e113b76026287620&lang=fr&exclude=alerts&units=metric`)
            .then(res => setData(res.data))
        })
}, [])

    if(!data) {
        return <p>chargement...</p>
    }

  return (
        <div>
            <h1>Temps ce {day} à {time}</h1>
            <ul className="ul-current">
            {/* src={"http://openweathermap.org/img/wn/"+data.current.weather.icon+"@2x.png"} */}
                <li><img src={"http://openweathermap.org/img/wn/"+data.current.weather[0].icon+"@2x.png"} alt="image temps actuel" /></li>
                <li className="deg-meteo">
                    {/* Math.round(data.current.temp) */}
                    <p className="current-deg">{Math.round(data.current.temp)}°C</p>
                    {/* data.current.weather.description */}
                    <p className="current-meteo">{data.current.weather[0].description}</p>
                </li>
                <li className="p-h-v">
                    {/* data.current.clouds */}
                    <p>Précipitations: {data.current.clouds}% de chances</p>
                    {/* data.current.humidity */}
                    <p>Humidité: {data.current.humidity}%</p>
                    {/* data.current.wind_speed */}
                    <p>Vent: {Math.round(data.current.wind_speed)} km/h</p>
                </li>
            </ul>
            <ul className="ul-hours">
              {data.hourly.slice(0,8).map((data, index) => {
                const hour = new Date(data.dt*1000)
                .toLocaleString('fr-FR', {
                  hour: 'numeric',
                  minute: 'numeric'
                })
                return (
                  <li key={index}>
                    <p className='hour-hours'>{hour}</p>
                    <p className="temp-hours">{Math.round(data.temp)}°C</p>
                  </li>
                )
              })}
            </ul>
            <ul className="ul-days">
              {data.daily.slice(0, 7).map((data, index) => {
                const day = new Date(data.dt*1000)
                .toLocaleString('fr-FR', {
                  weekday: 'short',
                  day: 'numeric'
                })
                return (
                  <li>
                    <p>{day}</p>
                    <img src={"http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png"} alt="image temps du jour" />
                    <p>{Math.round(data.temp.day)}°C</p>
                    <p>({Math.round(data.temp.min)}-{Math.round(data.temp.max)}°C)</p>
                    <p>{data.weather[0].description}</p>
                  </li>
                )
              })}
            </ul>
        </div>
  );
}