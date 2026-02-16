import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newBlog) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (id, updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
  return response.data
}

const remove = async (id) => {
  const config = { headers: { Authorization: token } }
  await axios.delete(`${baseUrl}/${id}`, config)
}

const like = async (id, userId) => {
  const response = await axios.put(`${baseUrl}/${id}/like`, { userId })
  return response.data
}

const dislike = async (id, userId) => {
  const response = await axios.put(`${baseUrl}/${id}/dislike`, { userId })
  return response.data
}

export default { getAll, create, update, remove, like, dislike, setToken }
