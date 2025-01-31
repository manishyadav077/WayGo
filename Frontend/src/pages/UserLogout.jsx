import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const UserLogout = () => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    axios.get('/api/users/logout', {
        headers: {
            Authorization: `Bear ${token}`
        }
    }).then((response)=> {
        if(response.status === 200){
            localStorage.removeItem('token')
            navigate('/login')
        }
    })
  return (
    <div>
      UserLogout
    </div>
  )
}

export default UserLogout
