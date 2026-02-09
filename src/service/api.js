import axios from 'axios';

const API_URL = 'http://localhost:3001/api/blogs';

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(API_URL, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${API_URL}/${id}`, newObject)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${API_URL}/${id}`, config)
  return response.data
}

export default { getAll, create, update, remove, setToken };
