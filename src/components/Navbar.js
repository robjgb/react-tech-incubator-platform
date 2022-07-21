import React, { useState, useEffect } from 'react'
import { useAuth } from "../contexts/AuthContext"
import { Outlet } from 'react-router';
import {useNavigate} from "react-router-dom"
import { doc, updateDoc, getDoc } from "firebase/firestore";
import {db} from "../firebase"


export default function Navbar(){
    const {currentUser, logout} = useAuth()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [isCompany, setIsCompany] = useState(false)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if(currentUser != null)
        getDoc(doc(db, "users", currentUser.uid))
            .then(user => {
                setUser(user.data())
            })
      }, []);

    useEffect(()=>{
        if(user){
            console.log(user.isCompany)
            setIsCompany(user.isCompany)
            setLoaded(true)
        }
    }, [user]);

    async function handleLogout(){        
        try{
             await logout()
             navigate('/login')
    
        } catch (error){
            const errorMessage = error.message;
            console.log("Failed to log out: " + errorMessage)
        }
      }

    function Profile(){
        return <><a className="profile-parent" href="/profile"> Profile </a>

        <ul className="nav-user-menu">
            <li className="nav-user-item">
                <a href="/profile"> Profile </a>
            </li>
            <li className="nav-user-item">
                <a href="/update-profile"> Edit Profile </a>
            </li>
            <li className="nav-user-item">
                <a href="/account"> Account Settings </a>
            </li>
            <li className="nav-user-item">
                <button onClick={handleLogout}> Log Out </button>
            </li>
        </ul>
        </>
    }

    function NavBar(){
        return <>
        <nav className="nav">
        <a href="/" className="site-title"> Hatchery </a>
        <ul>
            <li>
                <a href="/about">About</a>
            </li>
            <li>
                {
                    currentUser != null ? <Profile></Profile>: <a href="/login"> Login</a>
                }
 
            </li>
                {currentUser != null ? null: <li><a href="/signup"> Create Account</a></li>}
                {isCompany ? <li><a href="/create-task"> Create Task</a></li>: null}
        </ul>

        </nav>
        <Outlet />
        </>
    }

    return ( 
        <>  
        {!loaded ? <div></div> : <NavBar></NavBar>}        
        {currentUser == null ? <NavBar></NavBar> : <div></div>} 
        </>   
    );
}