import { useEffect } from "react"

export function useTitle(title: string) {
    useEffect(() => {
        const prevTitle = document.title
        document.title = prevTitle + ' - ' + title
        return () => {
            document.title = prevTitle
        }
    })
}