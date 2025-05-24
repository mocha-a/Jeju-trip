import Close from '../icons/Close';

function CmSubject({ onClose, setSelectedItem, selectedItem }) {
  const handleItemClick = (item) => {
    setSelectedItem(item);
    localStorage.setItem('selectedCategory', item);
    onClose();
  };

  return (
    <div className="">
      <div className="container">
        <div className="close-button" onClick={onClose}>
          <Close className={"Sb-Close"} />
        </div>

        <div className="sbtitle"> 주제선택 </div>

        <div className="subject-list">
          {['자유톡', '질문', '맛집', '장소'].map((item, index) => (
            <div key={index} className={`subject-item ${item === '장소' ? "last-item" : ''}`}>
              <div className="subject-label" onClick={() => handleItemClick(item)}>
                <div className="radio-button">
                  {selectedItem === item && <div className="selected" />}
                </div>
                <span className="text">{item}</span>
              </div>

              <span className="description">
                {item === '자유톡' && '재밌는 여행 썰, 수다, 하소연, 소식 등을 공유해주세요!'}
                {item === '질문' && '여행 고수들에게 답변을 받을 수 있어요!'}
                {item === '맛집' && '나만의 맛집을 추천해주세요!'}
                {item === '장소' && '나만 아는 예쁜 장소를 자랑해주세요!'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CmSubject;