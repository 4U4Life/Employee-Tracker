import axios from 'axios';
import { tokenKey } from './authService'

const apiEndpoint = `/api/projects/`;

const headers = {
  'Content-Type': 'application/json',
};

const loadProjectList = ({token}, page=1) => {
    return axios.get(
        apiEndpoint,
        {
            headers: {
                ...headers,
                "Authorization": `${tokenKey} ${token}`
            },
            params: {
                page: page
            }
        }
    );
};

const createNewProject = ({token}, data) => {
    return axios.post(
        apiEndpoint,
        data,
        {
            headers: {
                ...headers,
                "Authorization": `${tokenKey} ${token}`
            },
        }
    );
};

export {
    loadProjectList,
    createNewProject
}