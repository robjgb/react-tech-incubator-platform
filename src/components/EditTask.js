import React, { useRef, useState, useEffect } from 'react'
import { Form, Button, Card, Alert, InputGroup } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import {db} from "../firebase"
import { useNavigate, useLocation } from 'react-router-dom'

export default function EditTask() {
    const {state} = useLocation();
    const {task} = state;
    const nameRef = useRef()
    const bioRef = useRef()
    const roleRef = useRef()
    const durationRef = useRef()
    const experienceRef = useRef()
    const skill1Ref = useRef()
    const skill2Ref = useRef()
    const skill3Ref = useRef()
    const skills = []
    const members = []
    const {currentUser} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [isCompany, setIsCompany] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const navigate = useNavigate()
    const [message, setMessage] = useState('')


    useEffect(() => {
        getDoc(doc(db, "users", currentUser.uid))
            .then(user => {
                setUser(user.data())
            })
      }, []);

    useEffect(()=>{
        if(user){
            setIsCompany(user.isCompany)
            setLoaded(true)
        }
    }, [user]);

    function combineSkills(){
        skills[0] = skill1Ref.current.value;
        skills[1] = skill2Ref.current.value;
        skills[2] = skill3Ref.current.value;
    }

    async function handleDelete(e){
        e.preventDefault()
        try{
            if(window.confirm("Are you sure you want to delete?")){
                await deleteDoc(doc(db, "tasks", task.task.id));
                navigate('/');
            }
        }
        catch(error){
            var errorMessage = error.message
            setError(error.message)
        }
    }

    async function handleSubmit(e){
        e.preventDefault()

        try{
            setMessage('')
            setError('')
            setLoading(true)
            if(isCompany){
                combineSkills()

                const promises = []

                if(nameRef.current.value !== ""){
                    promises.push(updateDoc(doc(db, "tasks", task.task.id), {
                        title : nameRef.current.value,
                    }))
                }

                if(bioRef.current.value !== ""){
                    promises.push(updateDoc(doc(db, "tasks", task.task.id), {
                        description : bioRef.current.value,
                    }))
                }

                if(roleRef.current.value !== ""){
                    promises.push(updateDoc(doc(db, "tasks", task.task.id), {
                        role : roleRef.current.value,
                    }))
                }

                if(experienceRef.current.value !== ""){
                    promises.push(updateDoc(doc(db, "tasks", task.task.id), {
                        experienceLevel : experienceRef.current.value,
                    }))

                if(durationRef.current.value !== ""){
                    promises.push(updateDoc(doc(db, "tasks", task.task.id), {
                        duration : durationRef.current.value,
                    }))   
                }

                if(skills.length != 0){
                    promises.push(updateDoc(doc(db, "tasks", task.task.id), {
                        skills : skills,
                    }))   
                } 
                Promise.all(promises).then(()=>{
                    setMessage('All changes were made successfully.')
                    navigate('/')
                });
            }
        }
            else{
                navigate('/')
                };
        } catch (error) {
            var errorMessage = error.message
            // var str = errorMessage.substr(errorMessage.indexOf(":") + 1);
            // str = str.substring(0, str.lastIndexOf(" "));
            setError(error.message)
        }
        setLoading(false)
    }

    function CreateTask() {
        return (
            <>
            {!isCompany ? <div/> :
            <div className= "OnboardingBody">
            <Card className ="TaskCreate">
                <Card.Body>
                    <h2 className ="Onboarding"> Edit Task Information</h2>
                    <h3>  Edit the information inside the task, Leave blank to keep the same </h3>
                    {error && <Alert variant = "danger">{error}</Alert>}
                    {message && <Alert variant = "success">{message}</Alert>}
                    <Form className ="OnboardingForm" onSubmit ={handleSubmit}>
                        <Form.Group id = "displayName">
                            <Form.Label>Change title for the task</Form.Label>
                            <Form.Control ref={nameRef} placeholder={task.task.title} />
                        </Form.Group>
                        <Form.Group id = "displayName">
                            <Form.Label> Change description about the task</Form.Label>
                            <Form.Control ref={bioRef} placeholder={task.task.description} />
                        </Form.Group>
                        <Form.Group id = "displayName">
                            <Form.Label> Change role</Form.Label>
                            <Form.Control ref={roleRef} placeholder={task.task.role} />
                        </Form.Group>
                        <Form.Group id = "displayName">
                            <Form.Label>Change experience level</Form.Label>
                            <select ref={experienceRef} class="form-select form-select-sm">
                            <option selected>{task.task.experienceLevel}</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            </select>
                        </Form.Group>
                      <Form.Group id = "displayName">
                            <Form.Label>Change estimated duration to finish</Form.Label>
                            <Form.Control ref={durationRef} placeholder={ task.task.duration + " [Format: 1 month/1week/1 day]"} />
                        </Form.Group>
                        <Form.Group id = "displayName">
                        <Form.Label>Change three relevant skills, Note: Must change all or retype previous skills</Form.Label>
                        <div class="input-group">
                            <InputGroup>
                                <Form.Control ref={skill1Ref}  placeholder={ task.task.skills[0]} type="text" class="form-control"/>
                                <Form.Control ref={skill2Ref}  placeholder={ task.task.skills[1]} type="text" class="form-control"/>
                                <Form.Control ref={skill3Ref}  placeholder={ task.task.skills[2]} type="text" class="form-control"/>
                            </InputGroup>
                        </div>
                        </Form.Group>

                        <br></br>
                        <Button className="button" disabled = {loading} type="submit"> Update</Button>
                        <Button className="button" disabled = {loading} type="submit" onClick={handleDelete}> Delete</Button>
                    </Form>
                </Card.Body>
            </Card>
            </div>
            }
            </>
        )
    }

    return (
        !loaded ? <div></div> : <CreateTask></CreateTask>
    )
}
