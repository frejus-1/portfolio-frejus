
import { useEffect, useRef, useState } from "react";

function ScrollReveal({
    children,
    className = "",
    delay = 0,
    direction = "up",
}) {
    const elementRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = elementRef.current;

        if (!element) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(element);
                }
            },
            {
                threshold: 0.12,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div
            ref={elementRef}
            className={`scroll-reveal scroll-reveal-${direction} ${
                visible ? "scroll-reveal-visible" : ""
            } ${className}`}
            style={{
                "--reveal-delay": `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

export default ScrollReveal