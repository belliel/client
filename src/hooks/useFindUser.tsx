import { useState, useEffect } from "react";
import { instance } from "../helpers/api";
import history from "../helpers/history";
import { API_URI } from "../utils/constants";
import { Auth } from "./AuthContext";
import { User } from "./UserContext";

export default function useFindUser() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        async function findUser() {
            const auth: Auth = JSON.parse(localStorage.getItem("auth") || "{}") as Auth

            if (!auth.token) {
                console.info("no token")
                return
            }

            console.info(`token is: ${auth.token}`)
            await instance
                .get(`${API_URI}/users/me`, {
                    headers: {
                        Accept: "*/*",
                        Authorization: `Bearer ${auth.token}`,
                    },
                })
                .then((res) => {
                    console.info(res.data)
                    setUser(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
        findUser();
    }, []);

    return {
        user,
        setUser,
        isLoading,
    };
}