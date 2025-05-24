import { useState } from 'react'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

function AddCheckItem({ onAdd }) {
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!value.trim()) return
        onAdd(value)
        setValue('')
      }
    
    return (
        <form onSubmit={handleSubmit} className='Addcheckitem-form'>
            <div className="Addcheckitem-icon">
                <RadioButtonUncheckedIcon className="add-icon" />
            </div>
            <input
                type="text"
                placeholder="아이템 추가"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className='Addcheckitem-input'
            />
        </form>
    )
}

export default AddCheckItem