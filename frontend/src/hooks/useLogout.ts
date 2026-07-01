import {useNavigate} from "react-router-dom";
import {logOut} from "../api/fetch.ts";

export function useLogout() {
    const navigate = useNavigate();
    return async () => {
        await logOut();
        navigate("/login", { replace: true });
    }
}