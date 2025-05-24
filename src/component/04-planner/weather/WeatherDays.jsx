import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import axios from 'axios';
import WeatherTemp from '../../_common/WeatherTemp';
import DataLoading from '../../_common/DataLoading';
import WeatherItem from './WeatherItem'

import "swiper/css";

function WeatherDays() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const instance = axios.create({
    baseURL : `${process.env.REACT_APP_APIURL}/weather`,
  });

  useEffect(()=>{
    instance.get("./")
    .then((res)=>{
        setData(res.data)
        setLoading(false)
    })
  },[])

  const weatherMap = {
    "구름많음 / 비": "구름많고 비",
    "구름많음 / 비/눈": "구름많고 비나 눈",
    "구름많음 / 눈": "구름많고 눈",
    "구름많음 / 소나기": "구름많고 소나기",
    "흐림 / 비": "흐리고 비",
    "흐림 / 비/눈": "흐리고 비나 눈",
    "흐림 / 눈": "흐리고 눈",
    "흐림 / 소나기": "흐리고 소나기"
  };

  function formatWeather(text) {
    return weatherMap[text] || text;
  }

  return (
    <div>
        { loading? (
          <div className="detail_loading">
            <b><span>기상캐스터</span>님께 묻는 중</b>
            <DataLoading className={"weather_loading"}/>
          </div>
        ) : (
          <>
          <div className='weather_wf'>
            <WeatherTemp tmn={data[0]?.tmn} tmx={data[0]?.tmx} className={"planner_weather"}/>
            <span className='weather_text'>{formatWeather(data[0]?.fcstValue)}</span>
      </div>
          </>
        )}
      <Swiper 
      slidesPerView={4}
      className="mySwiper">
        {
          data?.map((item)=>
            <SwiperSlide key={item.fcstDate}>
              <div className='weather_item'>
                <WeatherItem
                  date={item.fcstDate}
                  tmn={item.tmn}
                  tmx={item.tmx}
                  icon={formatWeather(item.fcstValue)}
                />
              </div>
          </SwiperSlide>
          )
        }
      </Swiper>
    </div>
  )
}

export default WeatherDays