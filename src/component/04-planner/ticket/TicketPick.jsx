import { useState } from 'react'
import { NavLink } from 'react-router-dom';
import Plane from '../../icons/Plane'
import Btn2Popup from '../../popups/Btn2Popup';
import CardItem from './CardItem'
import SvgMiddleLine from './SvgMiddleLine';
import SvgVerticalLine from './SvgVerticalLine';

function TicketPick({idx, topBarBtn, ticketdate, data}) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    return (
    <div className="ticketline" style={{overflow:'hidden', borderRadius:"10px"}}>
        <div className='ticket'>
            <div className='tickettop'>
                <div className='ticketpadding'>
                <div className='topbar'>
                <span>{`Day ${idx+1}`}</span>
                <span className='ticketdate'>{ticketdate}</span>
                <Plane className={"plane"}/>
                <div className='right_box_pick'><button className='topBarBtn'>{topBarBtn}</button></div>
            </div>
            {data?.days[idx]?.plans?.map((item, i) => {
                
                let type;
                switch(item.contents_label){
                    case '관광지' : type='tour'; break;
                    case '쇼핑' : type='shopping'; break;
                    case '음식점' : type='food'; break;
                    case '축제&행사' : type='festival'; break;
                }

            return (
                <ul className="tickebox" key={`item-${i}`}>
                    <li className="liItem">
                        <div className="liLine">
                        <div className="liNum">
                            <span>{i + 1}</span>
                        </div>
                        <SvgVerticalLine/>
                        </div>
                        <NavLink className="pick_read" to={`/trip/triplist/${type}/tripdetail/${item.contents_id}`}>
                        <CardItem item={item} />
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
        <Btn2Popup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} type={"trip"} />
    </div>
    )
}

export default TicketPick