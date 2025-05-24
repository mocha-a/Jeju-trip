import WeatherTemp from '../../_common/WeatherTemp';

function WeatherItem({tmn, tmx, icon, date}) {

    function weatherIcon(wf){
        switch (wf){
            case "맑음":
                return <img src='/imgs/weather_clear_01.png'/>
            case "구름많음":
                return <img src='/imgs/weather_partly_cloudy_01.png'/>
            case "흐림":
                return <img src='/imgs/weather_cloudy_01.png'/>
            case "흐리고 비":
                return <img src='/imgs/weather_cloudy_rain_01.png'/>
            case "흐리고 비나 눈":
                return <img src='/imgs/weather_sleet_01.png'/>
            case "흐리고 눈":
                return <img src='/imgs/weather_snow_01.png'/>
            case "흐리고 소나기":
                return <img src='/imgs/weather_cloudy_rain_01.png'/>
            case "구름많고 비":
                return <img src='/imgs/weather_cloudy_rain_01.png'/>
            case "구름많고 비나 눈":
                return <img src='/imgs/weather_sleet_01.png'/>
            case "구름많고 눈":
                return <img src='/imgs/weather_snow_01.png'/>
            case "구름많고 소나기":
                return <img src='/imgs/weather_clear_01.png'/>
        }
    }

    return (
        <div>
            <div className='weather_date'>{date}</div>
            <div className='weather_icon'>{weatherIcon(icon)}</div>
            <div><WeatherTemp tmn={tmn} tmx={tmx} className={"temp_item"}/></div>
        </div>
    )
}

export default WeatherItem