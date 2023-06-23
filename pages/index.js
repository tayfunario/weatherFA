import Head from 'next/head'
import { Layout } from '../components/layout'
import { useState, useEffect } from 'react'
import { ThreeDots } from 'react-loader-spinner'


export default function Home() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [index, setIndex] = useState(0)
  let hour = new Date().getHours()

  useEffect(() => {
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        handleWeather()
      }
    })
  }, [])

  const handleWeather = async () => {
    setIsLoading(true)
    const city = document.getElementById('weather-input').value
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=b6acb7309ef04058aa4113214231206 &q=${city}&days=5&aqi=no&alerts=no`)
      .then(res => res.json())
      .then(data => {
        if (data.hasOwnProperty('error')) {
          setData(null)
          handleAlert()
        } else {
          setData(data)
        }
        setIsLoading(false)
      })
      .catch(err => {
        setData(null)
        setIsLoading(false)
      })
  }

  const handleDay = (str) => {
    const date = new Date(str);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  }

  const handleMonth = (str) => {
    const date = new Date(str);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[date.getMonth()];
  }

  const getDay = (str) => {
    return str.slice(8)
  }

  const getCelcius = temp => {
    const celsius = Math.round(temp);
    return String(celsius) + '°';
  }

  const handleAlert = () => {
    document.getElementById('alert').classList.add('block')
    document.getElementById('alert').classList.remove('hidden')
    setTimeout(() => {
      document.getElementById('alert').classList.remove('block')
      document.getElementById('alert').classList.add('hidden')
    }, 1000)
  }

  return (
    <Layout>
      <Head>
        <title>WeatherFA</title>
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Head>

      <h1 className='pt-28 pb-8 text-gray-200 text-7xl text-center font-light'>WeatherFA</h1>
      <div className='lg:w-3/5 md:w-4/5 w-full mx-auto'>
        {/* search bar */}
        <div className='flex justify-center h-20 mb-3 py-4 bg-gray-700 bg-opacity-40 border-4 border-cyan-800 rounded-lg'>
          <input id='weather-input' className='w-3/5 text-gray-100 placeholder-gray-300 bg-gray-400 bg-opacity-20 rounded px-2 py-1' placeholder='Enter your city here.' />
          {isLoading ?
            <button className='flex justify-center w-1/5 text-gray-200 font-bold ml-5 px-3 py-1 border hover:bg-gray-600'><ThreeDots height="30" width="30" color="white" /></button> :
            <button className='w-1/5 text-gray-200 font-bold ml-5 px-3 py-1 border rounded hover:bg-gray-600' onClick={handleWeather}>Search</button>}
        </div>
        {/* search bar */}


        <div className='min-h-80 bg-gray-800 px-10 py-5 bg-opacity-50 rounded-r-3xl rounded-s-3xl'>
          <p id='alert' className='hidden text-center text-white text-2xl'>No match found</p>
          {data &&
            <>
              <div className='text-white grid grid-cols-3'>
                <div>
                  <span className='md:text-4xl text-2xl'>{data.location.name}, </span>
                  <span className='text-xl'>{data.location.country}</span>
                </div>

                <span className='text-center text-3xl text-gray-300 font-light'>{`${getDay(data.forecast.forecastday[index].date)} ${handleMonth(data.forecast.forecastday[index].date)} ${handleDay(data.forecast.forecastday[index].date)}`}</span>

                <div className='text-end'>
                  <p className='text-lg font-semibold'>{index === 0 ? data.forecast.forecastday[0].hour[hour].condition.text : data.forecast.forecastday[index].day.condition.text}</p>
                  <p className='text-gray-300'>Chance of rain: <span className='text-gray-100'>{index === 0 ? data.forecast.forecastday[index].hour[hour].chance_of_rain : data.forecast.forecastday[index].day.daily_chance_of_rain}%</span></p>
                  <p className='text-gray-300'>Humidity: <span className='text-gray-100'>{index === 0 ? data.forecast.forecastday[index].hour[hour].humidity : data.forecast.forecastday[index].day.avghumidity}%
                  </span></p>
                  <p className='text-gray-300'>Wind: <span className='text-gray-100'>{data.forecast.forecastday[index].hour[hour].wind_kph} km/h</span></p>
                </div>
              </div>

              <hr className='mt-5 border border-gray-500' />

              <div className='flex justify-center items-center flex-wrap text-gray-100 mt-5 md:px-2 px-2'>
                <div className='weather-border w-32 h-36 md:mx-2 mx-1' onClick={() => setIndex(0)}>
                  <span className='text-xl font-semibold'>{`${handleDay(data.forecast.forecastday[0].date)} ${getDay(data.forecast.forecastday[0].date)}`}</span>
                  <img src={data.forecast.forecastday[0].hour[hour].condition.icon} />
                  <span>{getCelcius(data.forecast.forecastday[0].hour[hour].temp_c)}</span>
                </div>

                {data.forecast.forecastday.slice(1).map((elem, i) => {
                  return (
                    <div key={i + 1} className='weather-border weather-day-box' onClick={() => setIndex(i + 1)}>
                      <span>{`${handleDay(elem.date)} ${getDay(elem.date)}`}</span>
                      <img src={elem.day.condition.icon} />
                      <span>{getCelcius(elem.day.avgtemp_c)}</span>
                    </div>
                  )
                }
                )}
              </div>
            </>
          }
        </div>
      </div>
    </Layout>
  )
}