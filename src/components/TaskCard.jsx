import React, { useRef, useState, useEffect } from 'react'
import { Form, Button, Card, Alert, Modal } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {db} from "../firebase"
import { useAuth } from '../contexts/AuthContext'
import userEvent from '@testing-library/user-event';

function MyVerticallyCenteredModal(props) {
    const [id, setId] = useState()
    const [user, setUser] = useState(null)
    const [name, setName] = useState()
    const {currentUser} = useAuth()

    useEffect(()=> {
        setId(props.task.worker)
    }, [])

    useEffect(() => {
        if(id){
            getDoc(doc(db, "users", props.task.worker))
            .then(user => {
                setUser(user.data())
            })
        }
      }, [id]);

    useEffect(()=>{
        if(user){
            console.log(user.name)
            setName(user.name)
        }
    }, [user])

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            This task is being completed:
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Information: </h4>
          <p>
            {props.task.isTaken ? name + " is completing the task" : "Task is not accepted"}
          </p>
          <p>
            {props.task.isCompleted ? " The task is completed" : "The task is not completed"}
          </p>
          <p>
            {props.task.url ? <>"URL link will show here: " <a href={props.task.url} target="_blank"> {props.task.url} </a></> : "url link will show here: "}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

const TaskCard = ({ task, isCompany}) =>{
    const estimatedCompletionRef = useRef()
    const isCompletedRef = useRef()
    const urlRef = useRef()
    const [loading, setLoading] = useState(false)
    const [isAuthor, setIsAuthor] = useState(false)
    const [isTaken, setIsTaken] = useState(false)
    const {currentUser} = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    const [modalShow, setModalShow] = React.useState(false);

    useEffect(()=>{
        setIsAuthor(currentUser.uid === task.members[0])
    })

    useEffect(()=> {
        setIsTaken(task.isTaken)
    }, [])

    async function handleSubmit(e){
        e.preventDefault()
        try{
            if(estimatedCompletionRef.current.value !== ""){
            await updateDoc(doc(db, "tasks", task.id), {
                estimatedCompletion : estimatedCompletionRef.current.value,
            });
            }
            if(isCompletedRef.current.checked !== ""){
                console.log(isCompletedRef)
                await updateDoc(doc(db, "tasks", task.id), {
                    isCompleted : isCompletedRef.current.checked,
                });
            }
            if(urlRef.current.value !== ""){
                await updateDoc(doc(db, "tasks", task.id), {
                    url : urlRef.current.value,
                });
            }
            setMessage('Changes were made successfully.')
            window.alert("You have made changes")
            window.location.reload()
        } catch(error){
            const errorMessage = error.message;
            console.log("Failed to log out: " + errorMessage)
            setError(error.message)
        }
    }

    async function handleAccept(e){
        e.preventDefault()
        try{
            await updateDoc(doc(db, "tasks", task.id), {
                isTaken : true,
                worker: currentUser.uid
            });
            setIsTaken(true)
        } catch(error){
            const errorMessage = error.message;
            console.log("Failed to log out: " + errorMessage)
        }
    }

    async function handleRemove(e){
        e.preventDefault()
        try{
            if(window.confirm("Are you sure you want to leave? This will remove all progress information")){
                await updateDoc(doc(db, "tasks", task.id), {
                    isTaken : false,
                });        
                await updateDoc(doc(db, "tasks", task.id), {
                    estimatedCompletion : "",
                });
                await updateDoc(doc(db, "tasks", task.id), {
                    isCompleted : false,
                });
                await updateDoc(doc(db, "tasks", task.id), {
                    url : "",
                });
                await updateDoc(doc(db, "tasks", task.id), {
                    worker : "",
                });
                setIsTaken(false)
            }
        } catch(error){
            const errorMessage = error.message;
            console.log("Failed to log out: " + errorMessage)
        }
    }

    async function HandleEdit(e){    
        e.preventDefault()    
        try{
             navigate('/edit-task', {state: {task: {task}}})
        } catch (error){
            const errorMessage = error.message;
            console.log("Failed to log out: " + errorMessage)
        }
      }

    function TaskAccepted(){
        return <Form className ="OnboardingForm" onSubmit ={handleSubmit}>
            <Form.Group id = "displayName">
                <Form.Label> Enter estimated time of completion:</Form.Label>
                <Form.Control ref={estimatedCompletionRef} placeholder={task.hasOwnProperty('estimatedCompletion') ? "Currently: " + task.estimatedCompletion : "Enter an estimated time"} />
            </Form.Group>
            <Form.Group id = "displayName">
                <Form.Label> Mark completion status: Leave unchecked for false </Form.Label>
                <Form.Control type="checkbox" ref={isCompletedRef} value = "true"/>
                <p> {task.isCompleted ? "Current Status Marked as: Complete" : "Current Status Marked as: Not Completed"} </p>

            </Form.Group>
            <Form.Group id = "displayName">
                <Form.Label>Enter a url when finished: </Form.Label>
                <Form.Control type="url" ref={urlRef} pattern="https://.*" placeholder={task.hasOwnProperty('url') ? "Currently: " + task.url + " Note: use (https://)": "Enter a url link with the format (https://.)"}/>
            </Form.Group>
            {error && <Alert variant = "danger">{error}</Alert>}
            {message && <Alert variant = "success">{message}</Alert>}
            <div className='ButtonGroup'>
            <Button className="button" disabled = {loading} type="submit">Update</Button>
            <Button className="button" disabled = {loading} onClick={handleRemove}>Leave Task</Button>
            </div>
        </Form>
    }


    return (<>
            <div className='task'>
                <div className='taskDetails'>
                <p id="name">{task.hasOwnProperty('author') ? task.author : ""}</p>
                <p id="name">{task.hasOwnProperty('title') ? task.title : ""}</p>
                <div className="taskHeader">
                    <p className='contacts'>{task.hasOwnProperty('dateCreated') ? 
                      (new Date(task.dateCreated.seconds*1000).getUTCMonth() + 1) + '/' + new Date(task.dateCreated.seconds*1000).getUTCDate() + '/' + new Date(task.dateCreated.seconds*1000).getUTCFullYear()
                     : ""}</p>
                    <p className='contacts'>{task.hasOwnProperty('duration') ? task.duration : ""}</p>
                    <p className='contacts'>{task.hasOwnProperty('experienceLevel') ? task.experienceLevel : ""}</p>
                    <p className='contacts'>{task.hasOwnProperty('role') ? task.role : ""}</p>
                </div>

                <p id="description">{task.hasOwnProperty('description') ? task.description : ""}</p>
                <p id="skills">Skills: {task.hasOwnProperty('skills') ? task.skills.map((skill)=>(skill + "  ")) : ""}</p>
                </div>

                <div className='footer'> 
                {!isCompany ? <div>
                    {isTaken ? <TaskAccepted/> :<button className="button" onClick={handleAccept}>Accept</button>}
                    </div> 
                :
                    <div>
                    {!isAuthor ? <div></div> : <button className="button" onClick={HandleEdit}>Edit
                    </button>}
                    {isTaken ? <button className='button' onClick={() => setModalShow(true)}> View Progress</button> : <div/>}
                    <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)} task={task}/>
                    </div>
                }
                </div>

            </div>

        </>
    )

}

export default TaskCard;

