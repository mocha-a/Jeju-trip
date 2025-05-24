import { useState } from 'react'
import TagBtn from '../../_common/TagBtn'

function CategoryItem({data, title, onClick }) {
    const [check, setCheck] = useState(null);

    return (
        <form>
            <div className='searchbox'>
                {title.map((item, i) =>
                <div key={i}>
                    <h3 className='address'>{item}</h3>
                    {data[item].map((city)=>
                    <label key={city}>
                        <input 
                        className="taginput"
                        type="radio"
                        name={item} 
                        checked={check === city} 
                        onChange={() => setCheck(city)} 
                        onClick={() => onClick(city)}
                        />
                        <TagBtn className={"city_name"} tagbtn={city}/>
                    </label>
                    )}
                </div>
                )}
            </div>
        </form>
    )
}
export default CategoryItem