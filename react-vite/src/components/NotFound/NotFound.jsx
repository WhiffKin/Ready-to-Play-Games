import { useRouteError } from "react-router-dom"

function NotFound() {
    const err = useRouteError();

    return (
        <>
            <h1>{err.status}: {err.statusText}</h1>
            <h3>{err.data}, try adding cookies?</h3>
        </>
    )
}
export default NotFound;