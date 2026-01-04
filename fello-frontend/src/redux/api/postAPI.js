import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})
export const createPost = async (postData) => {
    const response = await api.post('/post', postData);
    return response.data;
};

export const updatePost = async (id, postData) => {
    const response = await api.patch(`/${id}`, postData);
    return response.data;
};

export const deletePost = async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
};

export const getPost = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
};



export default api;