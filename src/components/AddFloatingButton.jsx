// File: src/components/FloatingAddButton.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react"; // npm i lucide-react
import { twMerge } from "tailwind-merge";

/**
 * Floating, round, draggable "+" button (FAB).
 * Why: Quick access action that users can reposition; persists across sessions.
 */
export default function FloatingAddButton({
    onClick,
    size = 56, // px
    edgeMargin = 16, // px
    storageKey = "fab-pos",
    className = "",
    ariaLabel = "Add",
}) {
    const btnRef = useRef(null);
    const draggingRef = useRef(false);
    const pointerIdRef = useRef(null);
    const startRef = useRef({ x: 0, y: 0, px: 0, py: 0 });
    const [pos, setPos] = useState({ x: null, y: null });

    // Compute default bottom-right position
    const computeDefault = useCallback(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        return {
            x: Math.max(edgeMargin, w - size - edgeMargin),
            y: Math.max(edgeMargin, h - size - edgeMargin),
        };
    }, [edgeMargin, size]);

    const clampToViewport = useCallback(
        (x, y) => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const minX = edgeMargin;
            const minY = edgeMargin;
            const maxX = Math.max(edgeMargin, w - size - edgeMargin);
            const maxY = Math.max(edgeMargin, h - size - edgeMargin);
            return { x: Math.min(Math.max(x, minX), maxX), y: Math.min(Math.max(y, minY), maxY) };
        },
        [edgeMargin, size]
    );

    // Load saved position or default
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const { x, y } = JSON.parse(saved);
                const c = clampToViewport(x, y);
                setPos(c);
                return;
            }
        } catch (error) {
            console.log(error)
        }
        setPos(computeDefault());
    }, [clampToViewport, computeDefault, storageKey]);

    // Persist on change
    useEffect(() => {
        if (pos.x == null || pos.y == null) return;
        try {
            localStorage.setItem(storageKey, JSON.stringify(pos));
        } catch (error) {
            console.log(error)
        }
    }, [pos, storageKey]);

    // Re-clamp on resize
    useEffect(() => {
        const onResize = () => setPos((p) => (p.x == null ? p : clampToViewport(p.x, p.y)));
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [clampToViewport]);

    // Pointer events for drag
    const onPointerDown = (e) => {
        if (!btnRef.current) return;
        draggingRef.current = false;
        pointerIdRef.current = e.pointerId;
        btnRef.current.setPointerCapture(e.pointerId);
        startRef.current = {
            x: e.clientX,
            y: e.clientY,
            px: pos.x ?? 0,
            py: pos.y ?? 0,
        };
    };

    const onPointerMove = (e) => {
        if (pointerIdRef.current !== e.pointerId) return;
        const dx = e.clientX - startRef.current.x;
        const dy = e.clientY - startRef.current.y;
        if (!draggingRef.current && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
            // why: threshold avoids accidental clicks
            draggingRef.current = true;
        }
        if (draggingRef.current) {
            const next = clampToViewport(startRef.current.px + dx, startRef.current.py + dy);
            setPos(next);
        }
    };

    const onPointerUp = (e) => {
        if (pointerIdRef.current !== e.pointerId) return;
        try { btnRef.current?.releasePointerCapture(e.pointerId); } catch (error) {
            console.log(error)
        }
        const wasDragging = draggingRef.current;
        draggingRef.current = false;
        pointerIdRef.current = null;
        if (!wasDragging) {
            onClick?.();
        }
    };

    // Keyboard support
    const onKeyDown = (e) => {
        const step = 8;
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            e.preventDefault();
            const delta =
                e.key === "ArrowUp" ? { x: 0, y: -step } :
                    e.key === "ArrowDown" ? { x: 0, y: step } :
                        e.key === "ArrowLeft" ? { x: -step, y: 0 } : { x: step, y: 0 };
            const next = clampToViewport((pos.x ?? 0) + delta.x, (pos.y ?? 0) + delta.y);
            setPos(next);
        }
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
        }
    };

    const style = pos.x == null ? {} : { left: pos.x, top: pos.y };

    return (
        <button
            ref={btnRef}
            type="button"
            aria-label={ariaLabel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onKeyDown={onKeyDown}
            className={twMerge(`fixed z-50 flex items-center justify-center rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20`,    className)}
            style={{ width: size, height: size, ...style }}
        >
            <Plus className="w-6 h-6" />
        </button>
    );
}

// Example usage
// <FloatingAddButton onClick={() => console.log('Add!')} />
