import { useEffect } from "react";

export function useCloseModal(cb:()=>void, ref:React.RefObject<HTMLElement>) {


    useEffect(()=>{
    function handleClick(event:MouseEvent) {
        if (event.target instanceof Node && !ref.current?.contains(event.target)) {
            cb();
        }
    }

    function handleKeydownEsc(event:KeyboardEvent) {
        if (event.key === 'Escape') {
            cb();
        }
    }
    
    document.addEventListener('mousedown', handleClick)

    document.addEventListener('keydown', handleKeydownEsc)

    return () => {
        document.removeEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKeydownEsc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
}