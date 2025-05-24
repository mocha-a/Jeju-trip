import { NavLink } from 'react-router-dom';
import { plan } from '../../../api';
import Plane from '../../icons/Plane'
import SvgMiddleLine from './SvgMiddleLine';
import SvgVerticalLine from './SvgVerticalLine';
import CardItem from './CardItem'

function TicketRead({idx, topBarBtn, ticketdate}) {
    const { planData } = plan();

    return (
    <div className="ticketline" style={{overflow:'hidden', borderRadius:"10px"}}>
        <div className='ticket'>
            <div className='tickettop'>
                <div className='ticketpadding'>
                    <div className='topbar'>
                        <span>{`Day ${idx+1}`}</span>
                        <span className='ticketdate'>{ticketdate}</span>
                        <Plane className={"plane"}/>
                        <div className='right_box'><span className='topBarBtn'>{topBarBtn}</span></div>
                    </div>
                    {planData?.item?.days[idx]?.plans?.map((list, i) => {
                        const labelToKey = {
                            "관광지": "tour",
                            "음식점": "food",
                            "축제/행사": "festival",
                            "쇼핑": "shopping",
                        };
                        const type = labelToKey[list.contents_label];
                        return (
                            <ul className='tickebox' key={`item-${i}`}>
                                <li className='liItem'>
                                    <div className='liLine'>
                                    <div className='liNum'><span>{i + 1}</span></div>
                                    <SvgVerticalLine />
                                    </div>
                                    <NavLink className="pick_read" to={`/trip/triplist/${type}/tripdetail/${list.contents_id}`}>
                                    <CardItem item={list} />
                                    </NavLink>
                                </li>
                            </ul>
                        );
                        })}
                </div>
            </div>
            <SvgMiddleLine/>
            <div className='ticketbottom'>
                <div className='ticketpadding'>
                    <div className='barcode'>
                    <img className='barcode_img' src='/imgs/Letsgo_barcode.svg' alt='바코드' />
                    </div>
                </div>
            </div>
        </div>
    </div>
)
}

export default TicketRead