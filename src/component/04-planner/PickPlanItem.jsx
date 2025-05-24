import TicketItem from './ticket/TicketItem';

function PickPlanItem({planData, tagBtn}) {
  return (
    <div className='pickplan_item'>
      <div className='pickplan_card'>
        {planData?.days.map((day, idx)=>
        <div ref={(e)=>{tagBtn.current[idx] = e }} key={idx}>
          <TicketItem
            idx={idx}
            day={day}
            ticketdate={""}
            topBarBtn={""}
            data={planData}
          />
        </div>
        )}
      </div>
    </div>
  )
}

export default PickPlanItem