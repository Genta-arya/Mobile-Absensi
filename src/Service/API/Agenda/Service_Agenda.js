import axios from "axios"
import { API_URL } from "../../../Constant/Constant"



export const getAgenda = async (data) => {


    try {
        const response = await axios.post(API_URL + `/find/agenda`, {
            groupId: data.groupId,
            userId: data.userId
        })
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}