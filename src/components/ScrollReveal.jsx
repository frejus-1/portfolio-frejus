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
                if (!entry.isIntersecting) {
                    return;
                }

                setVisible(true);
                observer.unobserve(entry.target);
            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -40px 0px",
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
            className={[
                "scroll-reveal",
                `scroll-reveal-${direction}`,
                visible ? "scroll-reveal-visible" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{
                "--reveal-delay": `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

export default ScrollReveal;

