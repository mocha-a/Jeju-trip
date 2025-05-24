import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

import '../styles/splash.scss'

function Splash() {
    const navigate = useNavigate();
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true); // animation 시작
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const animationComplete = () => {
        if(fadeOut) {
            navigate("/login", { replace: true });
        }
    }

    return (
        <motion.div
            className="spl-background"
            initial={{ opacity: 0 }}
            animate={fadeOut ? { opacity: 0 } : { opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={animationComplete}
        >
            <img src="/imgs/logo_white.svg" alt="떠나봅서logo" />
        </motion.div>
    )
}

export default Splash