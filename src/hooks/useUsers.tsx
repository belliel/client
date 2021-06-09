import { instance } from "../helpers/api"
import { API_URI, FindUserInput } from "../utils/constants"
import { User } from "./UserContext"

export default function useUsers() {


    const findUser = async (email: string, phone: string) => {
        const data: FindUserInput = {
            email,
            phone
        }
        return await instance.post(
            `${API_URI}/users/find`,
            data,
            {

            }
        )
        .then(res => [res.data as User, null])
        .catch(err => {
            return [null, (err.response?.data?.error || err.message) as string]
        })
    }

    const getUser = async (userID: string) => {
        return await instance.get(
            `${API_URI}/users/${userID}`,
        )
        .then(res => [res.data as User, null])
        .catch(err => {
            return [null, (err.response?.data?.error || err.message) as string]
        })
    }

    return {
        findUser,
        getUser,
    }
}