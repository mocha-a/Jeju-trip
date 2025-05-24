import { mode } from '../../../api';
import TicketItem from '../ticket/TicketItem';

function PlannerTicket({tripDay, ticketDate}) {
    const { isEditMode } = mode();

    return (
        <div className='ticket_content'>
            
            { tripDay?.map((day, idx)=>
                <div key={idx}>
                <TicketItem
                    idx={idx}
                    topBarBtn={isEditMode ? "일정 순서 변경" : ""}
                    btnName={isEditMode ? "장소 추가" : undefined}
                    ticketdate={ticketDate[idx]}
                />
            </div>
            )}
        </div>
    )
}

export default PlannerTicket