import { useState } from 'react';
import Down_black from '../../icons/Down_black';
import Up_black from '../../icons/Up_black';

function TripFilter({onFilterChange}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('오름차순');

  // 리스트 보이기/숨기기 토글 함수
  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  const handleFilter = (filterOption) => {
    setSelectedFilter(filterOption); //선택항목 저장
    setIsOpen(false); //선택하면 리스트 닫기
    onFilterChange(filterOption); //상위 컴포넌트로 값을 전달
  };

  return (
    <div className="tripfilter">
      <div className="updown">
        <button onClick={toggleList} className="order-button">
          {selectedFilter}
        </button>
        {!isOpen ? (
          <div onClick={toggleList}>
            <Down_black className={'trip_down'}/>
          </div>
        ) : (
          <div onClick={toggleList}>
            <Up_black className={'trip_up'} />
          </div>
        )}
      </div>

      {isOpen && (
        <ul className="filter-list">
          {
            ['오름차순', '내림차순', '좋아요순'].map((item) => (
            <li
              key={item}
              onClick={() => handleFilter(item)}
              className={selectedFilter === item ? 'selected' : ''}
            >
              {item}
            </li>
            ))
          }
        </ul>
      )}
    </div>
  );
}

export default TripFilter;
