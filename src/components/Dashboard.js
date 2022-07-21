import React, { useState, useEffect } from 'react'
// import { Card, Button, Alert } from 'react-bootstrap'
// import { useAuth } from "../contexts/AuthContext"
// import {Link, useNavigate} from "react-router-dom"
import TaskCard from "./TaskCard"
import { useAuth } from '../contexts/AuthContext'
import { doc, getDoc } from "firebase/firestore";
import {db} from "../firebase";
import { collection, getDocs } from "firebase/firestore";


export default function Dashboard() {

  const {currentUser} = useAuth()
  const [user, setUser] = useState(null)
  const [isCompany, setIsCompany] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if(currentUser != null){
      getDoc(doc(db, "users", currentUser.uid))
      .then(user => {
          setUser(user.data())
      })
    }
  }, []);

  useEffect(()=>{
      if(user){
          setIsCompany(user.isCompany)
          setLoaded(true)
      }
  }, [user]);

  const TaskView = () => {
    const[data, setData] = useState([]);

    useEffect(()=>{
      const fetchData = async ()=>{
        let list = [];
        try{
          const querySnapshot = await getDocs(collection(db, "tasks"));
          querySnapshot.forEach((doc) => {
            list.push({id: doc.id, ...doc.data()})
          });
          setData(list);
        }
        catch(error){
          console.log(error)
        } 
      };
      fetchData()
    }, []);

    return data.map((task)=>(
      <TaskCard task = {task} isCompany = {isCompany}/>
    )) 
  }


  function Dashboard() {
    return <>
    <div className='container1'> 
      <header className="header">
          Available Projects: 
        </header>

       <div className="gridContainer">
          <TaskView></TaskView>
        </div>
        </div>
    </>
  }

  return (
    <>
    {!loaded ? <div></div> : <Dashboard></Dashboard>}    
    {currentUser == null ? <div>Login to see projects</div> : <div></div>}    
    </>
  )
}
