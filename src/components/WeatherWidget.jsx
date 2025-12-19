import React, { useState, useEffect } from 'react'
import './WeatherWidget.css'

// Open-Meteo API (free, no API key required)
const API_BASE = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'

function WeatherWidget({ location }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!location || location.trim() === '') {
      setLoading(false)
      return
    }

    const fetchWeather = async () => {
      try {
        setLoading(true)
        setError(null)

        // 1. Geocoding: City name to coordinates
        const geoResponse = await fetch(
          `${API_BASE}?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
        )
        const geoData = await geoResponse.json()

        if (!geoData.results || geoData.results.length === 0) {
          throw new Error('Location not found')
        }

        const { latitude, longitude } = geoData.results[0]

        // 2. Fetch weather data
        const weatherResponse = await fetch(
          `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
        )
        const weatherData = await weatherResponse.json()

        if (weatherData.current) {
          setWeather({
            temperature: Math.round(weatherData.current.temperature_2m),
            weatherCode: weatherData.current.weather_code,
            location: geoData.results[0].name
          })
        }
      } catch (err) {
        setError(err.message)
        console.error('Weather error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [location])

  const getWeatherIcon = (code) => {
    // WMO Weather interpretation codes (WW)
    if (code === 0) return '☀️' // Clear sky
    if (code >= 1 && code <= 3) return '🌤️' // Mainly clear, partly cloudy
    if (code >= 45 && code <= 48) return '🌫️' // Fog
    if (code >= 51 && code <= 67) return '🌧️' // Drizzle, rain
    if (code >= 71 && code <= 77) return '❄️' // Snow
    if (code >= 80 && code <= 82) return '🌦️' // Rain showers
    if (code >= 85 && code <= 86) return '🌨️' // Snow showers
    if (code >= 95 && code <= 99) return '⛈️' // Thunderstorm
    return '☁️'
  }

  if (!location || location.trim() === '') {
    return null
  }

  return (
    <div className="weather-widget">
      {loading && <div className="weather-loading">Loading...</div>}
      {error && <div className="weather-error">{error}</div>}
      {weather && !loading && !error && (
        <>
          <div className="weather-icon">{getWeatherIcon(weather.weatherCode)}</div>
          <div className="weather-info">
            <div className="weather-temp">{weather.temperature}°C</div>
            <div className="weather-location">{weather.location}</div>
          </div>
        </>
      )}
    </div>
  )
}

export default WeatherWidget

