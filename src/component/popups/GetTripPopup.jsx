import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { format } from 'date-fns';
import { mode } from '../../api';
import Close from '../icons/Close';
import Btn1Popup from './Btn1Popup';

function GetTripPopup({ isOpen, setIsOpen, planData, checkData }) {
    const [selectedValue, setSelectedValue] = useState('');
    const [openSelectPopup, setOpenSelectPopup] = useState(false);
    const { enterEditMode } = mode();

    const navigate = useNavigate();

    const generateId = () => {
        const datePart = Date.now().toString(36);
        const randPart = Math.random().toString(36).substring(2, 5);
        return `${datePart}${randPart}`;
    }

    function generateTitle(checkData) {
        const titles = checkData.map(item => item.title);
        let i = 1;
        while (titles.includes(`체크리스트 ${i}`)) {
            i++;
        }
        return `체크리스트 ${i}`;
    }

    function checkSelect() {
        if(selectedValue) {
            handleSelectPlan();
        } else {
            setOpenSelectPopup(true);
        }
    }

    // 여행 선택 후 체크리스트 생성
    function handleSelectPlan() {
        const selectedPlan = planData.find(item => item.id === selectedValue);
        const newId = generateId();
        const date = format(new Date(), 'yyyy.MM.dd');
        
        // Zustand에서 직접 편집 모드로 전환
        enterEditMode();

        setIsOpen(false);
        navigate(`/my/checklist/checkdetail/${newId}`, { 
            state: { 
                isEdit: true,
                id: newId,
                planId: selectedPlan.id,
                title: selectedPlan.title,
                date: [date]
            } 
        });
    };

    // 여행 선택하지 않고 체크리스트 생성
    function handleNoPlan() {
        const newId = generateId();
        const title = generateTitle(checkData);
        const date = format(new Date(), 'yyyy.MM.dd');

        // Zustand에서 직접 편집 모드로 전환
        enterEditMode();

        setIsOpen(false);
        navigate(`/my/checklist/checkdetail/${newId}`, { 
            state: { 
                isEdit: true,
                id: newId,
                title,
                date: [date]
            } 
        });

    };

    // 팝업 배경 클릭 시 팝업 닫힘
    function closePopup(e) {
        if(e.target.classList.contains('popup-box')) {
            setIsOpen(false);
        }
    }

    // 팝업이 닫혀있으면 랜더링 하지 않음.
    if (!isOpen) return null;    
    
    return (
        <>
            <div className='popup-box' onClick={closePopup}>
                <div className='closepopup'>
                    <div className='popup-title'>
                        <p>여행 선택</p>
                        <div onClick={() => setIsOpen(false)}>
                            <Close className={'popup-closeicon'}/>
                        </div>
                    </div>
            
                    <div className='popup-cont'>
                        <p>체크리스트를 추가할 여행을 선택해주세요.</p>
            
                        <FormControl sx={{ mt: 2, mb: 3, minWidth: 120, zIndex: 10001 }} size="small">
                            <InputLabel id="dropdown-label">선택</InputLabel>
                            <Select
                                labelId="dropdown-label"
                                id="dropdown"
                                value={selectedValue}
                                label="선택"
                                onChange={(e) => setSelectedValue(e.target.value)}
                                MenuProps={{
                                    sx: { zIndex: 10002 }, // ✅ 팝업보다 앞에 배치
                                }}
                            >
                                {planData.map((item, i) => (
                                    <MenuItem key={i} value={item.id} className='popup-select-item'>
                                        {item.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
            
                        <button
                            className='no-select-btn'
                            onClick = {()=>handleNoPlan()}
                        >
                            여행 선택하지 않고 추가하기 →
                        </button>
                    </div>
            
                    <div className='closepopup-btns-box'>
                        <button className='btn2popup-btn' onClick={() => setIsOpen(false)}>
                        취소
                        </button>
                        <button className='btn1popup-btn' onClick={checkSelect}>
                        확인
                        </button>
                    </div>
                </div>
            </div>

            {openSelectPopup && (
                <Btn1Popup
                    isOpen={true}
                    setIsOpen={() => setOpenSelectPopup(false)}
                    type={'select'}
                />
            )}
        </>
    )
}

export default GetTripPopup