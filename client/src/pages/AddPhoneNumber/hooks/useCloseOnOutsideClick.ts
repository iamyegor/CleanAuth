import { useEffect } from "react";

export default function useCloseOnOutsideClick(
    wrapper: HTMLDivElement | null,
    setIsOpen: (isOpen: boolean) => void,
): void {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapper && !wrapper.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapper]);
}
