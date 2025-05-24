import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SwipeAction from '../_common/SwipeAction';
import AddCheckItem from './AddCheckItem';

import "../../styles/05-mypage/check/checkDetail.scss";

function CheckItem({ list, setList, isEdit, type, trashClick, trash, setIsPopupOpen }) {

  return (
      <div>
        <FormGroup>
          {
            list.map((item, i)=>(
              !trashClick[i] && (
                <div key={`${i}-${Math.random()}`} style={{ pointerEvents: isEdit ? 'auto' : 'none' }}>
                  <SwipeAction 
                    setTrashClick={() => trash(i, type)} 
                    setIsPopupOpen={setIsPopupOpen}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled={!isEdit}
                          checked={item.checked}
                          onChange={() => {
                            const newList = [...list];
                            newList[i].checked = !newList[i].checked;
                            setList(newList);
                          }}
                          icon={<RadioButtonUncheckedIcon/>}
                          checkedIcon={<CheckCircleIcon/>}
                          sx={{
                            color: 'rgba(0, 0, 0, 0.3)',
                            '&.Mui-checked': {color: '#2288FD'},
                            py: '16px',
                          }}
                        />
                      }
                      label={item.name}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'NanumSquare, Roboto'
                        },
                      }}
                      className='checkitem'
                    />
                  </SwipeAction>
                </div>
              )
            ))}
        </FormGroup>
        
        {/* 아이템 추가 */}
        {isEdit && (
          <AddCheckItem onAdd={(newItem) => {
            if (newItem.trim()){
              setList((prev) => [...prev, { name: newItem, checked: false }])
            }
          }} />
        )}
      </div>
  )
}

export default CheckItem