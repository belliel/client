import { useContext, useState } from "react";
import history from "../helpers/history";
import { UserContext } from "./UserContext";
import { instance } from "../helpers/api"
import { API_URI, forgetPasswordInput, restorePasswordInput, signInInput, signUpInput } from "../utils/constants";
import { Auth, AuthContext } from "./AuthContext";

export default function useAuth() {

    const { user, setUser } = useContext(UserContext)
    const { auth, setAuth } = useContext(AuthContext)
    const [ error, setError ] = useState<string|null>(null)


    const setUserContext = async (redirect?: string) => {
        const auhtData: Auth = JSON.parse(localStorage.getItem("auth") || "{}") as Auth

        return await instance.get(
            `${API_URI}/users/me`,
            {
                headers: {
                    "Authorization": `Bearer ${auhtData.token}`
                }
            }
        )
        .then(res => {
            setUser(res.data)
            setAuth(auhtData)
            if (redirect && redirect.length > 0) {
                history.push(decodeURIComponent(redirect));
            }
        })
        .catch(err => setError(err.response.error || "error"))
    }

    const logOut = () => {
        localStorage.removeItem("auth");
        setUser(null);
        history.push("/", "replace")
    };

    const registerUser = async (
        data: signUpInput,
        redirect?: string
    ) => {
        return await instance.post(
            `${API_URI}/users/signUp`,
            data,
            {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            },
        )
        .then(res => {
            if (res.data.token) {
                const authData = res.data as Auth
                localStorage.setItem("auth", JSON.stringify(authData))
                setUserContext(redirect)
            } 
        })
        .catch(err => {
            setError(err.response.error || "error")
        })
    }

    const loginUser = async (
        data: signInInput,
        redirect?: string
    ) => {
        return await instance.post(
            `${API_URI}/users/signIn`,
            data,
        )
        .then(res => {
            if (res.data.token) {
                const authData = res.data as Auth
                localStorage.setItem("auth", JSON.stringify(authData))
                setUserContext(redirect)
            } 
        })
        .catch(err => {
            setError(err.response.error || "error")
        })
    }

    const forgetPassword = async (
        data: forgetPasswordInput
    ) => {
        return await instance.post(
            `${API_URI}/users/forget`,
            data
        )
        .then(res => {})
        .catch(err => {
            setError(err.response.error || "error")
        })
    }

    const restorePassword = async (
        data: restorePasswordInput,
        redirect?: string
    ) => {
        return await instance.post(
            `${API_URI}/users/restore`,
            data
        )
        .then(res => {
            if (res.data.token) {
                const authData = res.data as Auth
                localStorage.setItem("auth", JSON.stringify(authData))
                setUserContext(redirect)
            } 
        })
        .catch(err => {
            setError(err.response.error || "error")
        })
    }

    return {
        error,
        registerUser,
        loginUser,
        logOut,
        forgetPassword,
        restorePassword,
    }
}