import { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { mode, plan } from '../../../api';
import SwipeActionMemo from '../SwipeActionMemo';
import Plane from '../../icons/Plane';
import List from '../../icons/List';
import Button from '../../_common/Button';
import SvgMiddleLine from './SvgMiddleLine';
import SvgVerticalLine from './SvgVerticalLine';
import CardItem from './CardItem';

function TicketEdit({idx, btnName, ticketdate}) {
    const { planData, setPlanData } = plan();
    const { enterEditMode } = mode();
    const [drag, setDrag] = useState(false); // 일정 순서 버튼 클릭 상태
    const { id } = useParams(); // url에서 id 가져오기

    const path = btnName === "장소 추가" ? `/planner/plannerdetail/${id}/place/${idx}` : "#"
    
    const trash = (index) => {
        // 배열에서 해당 아이템 삭제
        const updatedPlans = planData.item.days[idx].plans.filter((_, i) => i !== index);
    
        const updated = structuredClone(planData);
        updated.item.days[idx].plans = updatedPlans;
        setPlanData(updated); // 상태 업데이트
    };

    //순서변경 버튼 함수
    const handleToggleDrag = () => {
        setDrag((prev) => !prev); // 버튼 클릭 시 드래그 상태 토글
    };

    // 드래그 완료 핸들러
    const handleDragEnd = (result) => {
        if (!result.destination) return;

    // 원본 배열 복사 후, 드래그된 아이템을 새로운 위치로 재배치
    const items = Array.from(planData.item.days[idx].plans);
    const [reorderedItem] = items.splice(result.source.index, 1); // 기존 아이템 제거
    items.splice(result.destination.index, 0, reorderedItem); // 새로운 위치에 삽입

    // 상태 업데이트 (zustand 사용)
    const updated = structuredClone(planData);
    updated.item.days[idx].plans = items;
    setPlanData(updated); // 상태 업데이트
    enterEditMode()
    };
    
    return (
    <div className="ticketline" style={{overflow:'hidden', borderRadius:"10px"}}>
        <div className='ticket'>
            <div className='tickettop'>
                <div className='ticketpadding'>
                    <div className='topbar'>
                        <span>{`Day ${idx+1}`}</span>
                        <span className='ticketdate'>{ticketdate}</span>
                        <Plane className={"plane"}/>
                        <div className='right_box'>
                            <button className='topBarBtn'onClick={handleToggleDrag}>
                                {drag ? "완료" : "일정 순서 변경"}
                            </button>
                        </div>
                    </div>
                    {drag ? ( //여기는 순서변경 모드
                    <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="plan-list">
                        {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {planData?.item?.days[idx]?.plans?.map((item, i) => (
                            <Draggable
                                key={item.id || `item-${i}`}
                                draggableId={item.id?.toString() || `item-${i}`}
                                index={i}
                            >
                                {(provided) => (
                                <ul
                                    className='tickebox'
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <li className='liItem'>
                                    <div className='liLine'>
                                        <div className='liNum'><span>{i + 1}</span></div>
                                        <SvgVerticalLine/>
                                    </div>
                                    <CardItem item={item} />
                                    <List className={"plnner_drag"}/>
                                    </li>
                                </ul>
                                )}
                            </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                        )}
                    </Droppable>
                    </DragDropContext>
                    ):( //여기가 바로 편집 모드
                        <>
                            {planData?.item?.days[idx]?.plans?.map((item, i) => (
                            <SwipeActionMemo
                                key={`item-${i}`}
                                className={"swipeactionmemo"}
                                setTrashClick={() => { trash(i); }}
                            >
                                <ul className='tickebox'> {/* Day 1 */}
                                <li className='liItem'>
                                    <div className='liLine'>
                                    <div className='liNum'><span>{i + 1}</span></div>
                                    <SvgVerticalLine />
                                    </div>
                                    <CardItem item={item} />
                                </li>
                                </ul>
                            </SwipeActionMemo>
                            ))}
                        </>
                    )}
                </div>
            </div>
            <SvgMiddleLine/>
            <div className='ticketbottom'>
                <div className='ticketpadding'>
                    <NavLink to={path} className='ticketbtn'>
                        <Button btn={btnName} />
                    </NavLink>
                </div>
            </div>
        </div>
    </div>
    )
}

export default TicketEdit