import { mode } from '../../../api';
import TicketEdit from './TicketEdit';
import TicketRead from './TicketRead';
import TicketPick from './TicketPick';

function TicketItem({idx, topBarBtn, btnName, ticketdate, data }) {
    const { isEditMode } = mode();

    return (
    <>
    { isEditMode === true && ( //수정모드 
        <TicketEdit idx={idx} topBarBtn={topBarBtn} ticketdate={ticketdate} btnName={btnName}/>
    )}
    { isEditMode === false && ( //읽기모드
        <TicketRead idx={idx} topBarBtn={topBarBtn} ticketdate={ticketdate}/>
    )}
    { isEditMode === null && ( //추천모드
        <TicketPick idx={idx} topBarBtn={topBarBtn} ticketdate={ticketdate} btnName={btnName} data={data}/>
    )}
    </>
    )
}

export default TicketItem