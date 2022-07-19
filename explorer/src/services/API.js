import axios from 'axios'

export default (url, pid) => {
    return axios.create({
        baseURL: url,
        headers: {
            project_id: pid
        }
    })
}