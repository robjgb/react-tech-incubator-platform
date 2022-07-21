import React, { useState, useEffect } from 'react'
// import { Card, Button, Alert } from 'react-bootstrap'
// import { useAuth } from "../contexts/AuthContext"
// import {Link, useNavigate} from "react-router-dom"
import TaskCard from "./TaskCard"
import { useAuth } from '../contexts/AuthContext'
import { doc, getDoc } from "firebase/firestore";
import {db} from "../firebase"
import { collection, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";

export default function Dashboard() {
  let { id } = useParams(); 
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

  const TaskView = () => {    const[data, setData] = useState([]);

    useEffect(()=>{
      const fetchData = async ()=>{
        let list = [];
        try{
          const querySnapshot = await getDocs(collection(db, "tasks"));
          querySnapshot.forEach((doc) => {
            if(user.name == doc.data().author){
              list.push({id: doc.id, ...doc.data()})
            }
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
    {!isCompany ?   
        <header className="profileHeader">
            <p> {user.name}</p>
            <p1> {user.biography}</p1>
            <div className='pContainer'>
                <p2> {user.location}</p2>
                <div className='contactsContainer'>
                    <p2> {user.email}</p2>
                </div>
            </div>
        </header> 
        :
        <header className="profileHeader">
            <p> {user.name}</p>
            <p1> {user.description}</p1>
            <div className='pContainer'>
                <p2> {user.location}</p2>
                <div className='contactsContainer'>
                    <p2> {user.email}</p2>
                    <p2> {user.phone}</p2>
                </div>
            </div>
        </header> }
    
       <div className="gridContainer">
          <TaskView></TaskView>
        </div>
        </div>
    </>
  }

  return (
    <>
    {!loaded ? <div></div> : <Dashboard></Dashboard>}    
    {currentUser == null ? <Dashboard></Dashboard> : <div></div>}    
    </>
  )
}
