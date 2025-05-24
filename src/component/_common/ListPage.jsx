import { useState } from 'react'
import ListItem from './ListItem'
import SwipeAction from './SwipeAction'
import SwipeHand from './SwipeHand';
import DataLoading from './DataLoading';
import Btn1Popup from '../popups/Btn1Popup';
import Btn2Popup from '../popups/Btn2Popup';

function ListPage({listData, page, trashClick, trash, onConfirm, isDonePopupOpen, setIsDonePopupOpen, loading = false}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openSwipeId, setOpenSwipeId] = useState(null);

  let title = '';

  if(page === 'check') {
    title = '체크리스트';
  } else if(page === 'plan') {
    title = '나의 여행 보기';
  }

  // 연도별로 데이터 구분
  const groupedData = listData.reduce((acc, item) => {
    const year = item?.date[0].split('.')[0];
    if(!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(item);
    return acc;
  }, {});
  const years = Object.keys(groupedData).sort((a,b)=>b-a); // 연도 배열

  // 각 연도 안 데이터 최신순 정렬
  years.forEach((year) => {
    groupedData[year].sort((a, b) => {
      const aDate = new Date(a.date[0].replace(/\./g, '-'));
      const bDate = new Date(b.date[0].replace(/\./g, '-'));
      return bDate - aDate;
    });
  });
  
  return (
    <div className='listpage'>
      <h2>{title}</h2>
      {loading ? (
        <DataLoading className={'listpage-loading'}/>
      ) : (
        <>
          {listData.length !== 0 && (
            <div className='listpage-swipehand-wrap'>
              <div className='listpage-swipehand'>
                <SwipeHand />
              </div>
            </div>
          )}

          {years.map((year) => (
            <div key={year} className='listpage-year'>
              <h3>{year}</h3>
              {groupedData[year].map((item) => (
                !trashClick?.[item.id] && (
                  <SwipeAction
                    key={item.id}
                    setTrashClick={() => {
                      setOpenSwipeId(item.id);
                      trash(item.id);
                    }}
                    setIsPopupOpen={setIsPopupOpen}
                    resetSwipe={openSwipeId === item.id}
                  >
                    <ListItem
                      id={item.id}
                      title={item.title}
                      date={item.date}
                      page={page}
                    />
                  </SwipeAction>
                )
              ))}
            </div>
          ))}
        </>
      )}

      <Btn2Popup
        isOpen={isPopupOpen}
        setIsOpen={setIsPopupOpen}
        type={'delete'}
        onCancel={() => {
          setOpenSwipeId(null);
        }}
        onConfirm={() => {
          onConfirm();
          setIsPopupOpen(false);
        }}
      />
      <Btn1Popup
        isOpen={isDonePopupOpen}
        setIsOpen={setIsDonePopupOpen}
        type={'delete'}
      />
    </div>
  );
}

export default ListPage