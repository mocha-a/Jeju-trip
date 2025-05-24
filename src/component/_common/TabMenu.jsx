import { useEffect, useState } from 'react'

function TabMenu({ tabTitle, onTabChange, selectedTab }) {
    const [addClass, setAddClass] = useState(0);
    
    useEffect(() => {
        if (selectedTab !== undefined) {
            setAddClass(selectedTab);
        }
    }, [selectedTab]);

    function clickEvent(index) {
        setAddClass(index);
        if(onTabChange) {
            onTabChange(index);
        }
    }

    return (
        <div className='tabmenu'>
            {
                tabTitle.map((item, i) => (
                    <div key={i}
                         className={i === addClass ? 'active' : ''}
                         onClick={() => clickEvent(i)}>
                        {item}
                    </div>
                ))
            }
        </div>
    )
}

export default TabMenu