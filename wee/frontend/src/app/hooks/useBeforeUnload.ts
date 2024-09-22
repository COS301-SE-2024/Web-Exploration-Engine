import { useEffect } from "react";

const useBeforeUnload = () => {
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
        };

        // add event listeners for refresh/close and route changes
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);
};

export default useBeforeUnload;