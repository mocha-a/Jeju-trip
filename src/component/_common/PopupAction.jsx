import { motion, AnimatePresence } from "framer-motion";

function PopupAction({className, useState, children}) {
    // 해당 컴포넌트 실행할지 말지 를 위해서 상태값이 필요해요 
    // 부모 컴포넌트에서 useState={}로 값 보내주세요 ! !

    return (
        <AnimatePresence>
            {useState && (
            <>
            <motion.div
            initial={{ opacity: 0, transform: 'translate(-50%, 100%)' }} // 아래에서 시작
            animate={{ opacity: 1, transform: 'translate(-50%, 0%)' }} // 위로 올라오면서 나타남
            exit={{ opacity: 0, transform: 'translate(-50%, 100%)' }} // 사라질 땐 다시 아래로
            transition={{ duration: 0.3 }}
            className={className}
            >
            {children}
            </motion.div>
            </>
            )}
        </AnimatePresence>
    )
}

export default PopupAction