import { useEffect, useRef, useState } from "react"

export default function App () {
	const [date, setDate] = useState(new Date())
	const day = date.toLocaleString('fr-FR', {
		weekday: 'long'
	})
	const time = date.toLocaleString('fr-FR', {
			hour: 'numeric',
			minute: 'numeric'
	})
	const [data, setData] = useState()
	const intervalRef = useRef()

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(pos => {
			fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=bcacfae3308438a0e113b76026287620&lang=fr&exclude=alerts&units=metric`)
				.then(res => res.json())
				.then(res => setData(res))
			const interval = setInterval(() => {
				fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=bcacfae3308438a0e113b76026287620&lang=fr&exclude=alerts&units=metric`)
					.then(res => res.json())
					.then(res => setData(res))
				setDate(new Date())
			}, 60000);
			intervalRef.current = interval
		})
		return function cleanup(){
			clearInterval(intervalRef.current)
		}
	}, [])

	if(!data){
		return <h1>Chargement...</h1>
	}

	return (
		<div>
			<h1>Temps ce {day} à {time}</h1>
			<ul className="ul-current">
				<li><img src={`http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`} alt="image temps actuel" /></li>
				<li className="deg-meteo">
					<p className="current-deg">{Math.round(data.current.temp)}°C</p>
					<p className="current-meteo">{data.current.weather[0].description}</p>
				</li>
				<li className="p-h-v">
					<p>Précipitations: {data.current.clouds}% de chances</p>
					<p>Humidité: {data.current.humidity}%</p>
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
						<li key={index}>
							<p>{day}</p>
							<img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="image temps du jour" />
							<p>{Math.round(data.temp.day)}°C</p>
							<p>({Math.round(data.temp.min)}-{Math.round(data.temp.max)}°C)</p>
							<p>{data.weather[0].description}</p>
						</li>
					)
				})}
			</ul>
		</div>
	);
};