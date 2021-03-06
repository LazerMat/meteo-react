import { useEffect, useRef, useState } from "react"

export default function App () {
	const [date, setDate] = useState(new Date())
	const [data, setData] = useState()
	const intervalRef = useRef()
	const [verifCoords, setVerifCoords] = useState(false)

	function apireq(pos) {
		fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=bcacfae3308438a0e113b76026287620&lang=fr&exclude=alerts&units=metric`)
			.then(res => res.json())
			.then(res => setData(res))
	}

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((pos) => {
			setVerifCoords(true)
			apireq(pos)
			intervalRef.current = setInterval(() => {
				apireq(pos)
				setDate(new Date())
			}, 10000);
		})
		return function cleanup(){
			clearInterval(intervalRef.current)
		}
	}, [])

	if(!verifCoords){
		return <h1>Veuillez autoriser l'accès à votre localisation</h1>
	}

	if(!data){
		return <h1>Chargement...</h1>
	}

	return (
		<div>
			<h1>Temps ce {
				date.toLocaleString('fr-FR', {
					weekday: 'long'
				})
				} à {
					date.toLocaleString('fr-FR', {
						hour: 'numeric',
						minute: 'numeric'
				})
				}
			</h1>
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