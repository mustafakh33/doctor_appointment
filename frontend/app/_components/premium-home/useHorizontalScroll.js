import { useCallback, useEffect, useRef, useState } from "react";

function useHorizontalScroll() {
    const containerRef = useRef(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const updateScrollState = useCallback(() => {
        const element = containerRef.current;
        if (!element) return;

        const maxScrollLeft = element.scrollWidth - element.clientWidth;
        const epsilon = 2;

        setCanScrollPrev(element.scrollLeft > epsilon);
        setCanScrollNext(element.scrollLeft < maxScrollLeft - epsilon);
    }, []);

    const scrollByDirection = useCallback((direction = "next") => {
        const element = containerRef.current;
        if (!element) return;

        const amount = Math.max(element.clientWidth * 0.82, 260);
        element.scrollBy({
            left: direction === "next" ? amount : -amount,
            behavior: "smooth",
        });
    }, []);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        updateScrollState();

        const handleScroll = () => updateScrollState();
        const handleResize = () => updateScrollState();

        element.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleResize);

        return () => {
            element.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, [updateScrollState]);

    return {
        containerRef,
        canScrollPrev,
        canScrollNext,
        scrollByDirection,
        updateScrollState,
    };
}

export default useHorizontalScroll;
