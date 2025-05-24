import { useNavigate } from 'react-router-dom';
import Activity from '../icons/Activity';
import My_like from '../icons/My_like';
import Check from '../icons/Check';

function MyMenu({ isLoggedIn, openPopup }) {

  const navigate = useNavigate();
  const mymenuContent = [
    {
      type: 'check',
      url: 'checklist',
      icon: <Check className={'my-menuicon'}/>,
      txt: '체크리스트'
    },
    {
      type: 'like',
      url: 'like',
      icon: <My_like className={'my-menuicon-like'}/>,
      txt: '좋아요'
    },
    {
      type: 'activity',
      url: 'activity',
      icon: <Activity className={'my-menuicon'}/>,
      txt: '나의활동'
    }
  ];

  const handleClick = (url) => {
    if (!isLoggedIn) {
      openPopup('login');
    } else {
      navigate(`/my/${url}`);
    }
  };

  return (
    <div className='my-menu1'>
      {
        mymenuContent.map(item => (
          <div key={item.type} className={`my-menu-${item.type}`}
               onClick={() => {handleClick(item.url)}}
               style={{cursor: 'pointer'}}
          >
            {item.icon}
            <span>{item.txt}</span>
          </div>          
        ))
      }
    </div>
  )
}

export default MyMenu