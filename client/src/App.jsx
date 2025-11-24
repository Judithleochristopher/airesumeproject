import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'

import api from './configs/api'
import { login, setLoading } from './app/features/authSlice'  // <- add setLoading\
import {Toaster} from 'react-hot-toast'


const App = () => {
  const dispatch=useDispatch()
  const getUserData = async () => {
  const token = localStorage.getItem('token')
  try {
    if (token) {
      // send Bearer token (common pattern)
      const { data } = await api.get('/api/users/data', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data?.user) {
        dispatch(login({ token, user: data.user }))
      }
    }
  } catch (error) {
    console.error('getUserData error:', error?.message || error)
  } finally {
    dispatch(setLoading(false))
  }
}


  useEffect(()=>{
    getUserData()
  },[]) 
  return (
    <>
    <Toaster/>
    <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />          {/* <-- login route */}
  <Route path="app" element={<Layout />}>
    <Route index element={<Dashboard />} />
    <Route path="builder/:resumeId" element={<ResumeBuilder />} />
  </Route>
  <Route path="view/:resumeId" element={<Preview />} />
</Routes>

      
    </>
  )
}

export default App
