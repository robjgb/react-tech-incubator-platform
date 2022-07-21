import React, { useRef, useState, useEffect } from 'react'
import { Form, Button, Card, Alert, InputGroup } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { collection, doc, setDoc, getDoc, serverTimestamp  } from "firebase/firestore";
import {db} from "../firebase"
import { useNavigate } from 'react-router-dom'

export default function CreateTask() {
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
        members[0] = currentUser.uid;
        members[1] = "";
    }

    async function handleSubmit(e){
        e.preventDefault()

        try{
            setError('')
            setLoading(true)
            if(isCompany){
                combineSkills()
                await setDoc(doc(collection(db, "tasks")), {
                    title:nameRef.current.value,
                    description: bioRef.current.value,
                    role: roleRef.current.value,
                    dateCreated: serverTimestamp(),
                    experienceLevel: experienceRef.current.value,
                    duration: durationRef.current.value,
                    skills: skills,
                    members: members,
                    estimatedCompletion: "",
                    isCompleted: false,
                    isTaken: false,
                    url: "",
                    author: user.name
                });
                navigate('/')
            }else{
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
                    <h2 className ="Onboarding"> Enter Task Information</h2>
                    <h3>  Provide the necessary information needed to complete the task </h3>
                    {error && <Alert variant = "danger">{error}</Alert>}
                    <Form className ="OnboardingForm" onSubmit ={handleSubmit}>
                        <Form.Group id = "displayName">
                            <Form.Label>Add a title for the task</Form.Label>
                            <Form.Control ref={nameRef} placeholder="Enter title description" required/>
                        </Form.Group>
                        <Form.Group id = "displayName">
                            <Form.Label> Add a description about the task</Form.Label>
                            <Form.Control ref={bioRef} placeholder="Enter description" required/>
                        </Form.Group>
                        <Form.Group id = "displayName">
                            <Form.Label>Add a role</Form.Label>
                            <Form.Control ref={roleRef} placeholder="Enter the role you desire" required/>
                        </Form.Group>
                        <Form.Group id = "displayName">
                            <Form.Label>Choose an experience level</Form.Label>
                            <select ref={experienceRef} class="form-select form-select-sm">
                            <option selected>Choose level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            </select>
                        </Form.Group>
                      <Form.Group id = "displayName">
                            <Form.Label>Enter estimated duration to finish</Form.Label>
                            <Form.Control ref={durationRef} placeholder="Enter how long the task will take (1 month/1week/1 day)" required/>
                        </Form.Group>
                        <Form.Group id = "displayName">
                        <Form.Label>Enter up to three relevant skills:</Form.Label>
                        <div class="input-group">
                            <InputGroup>
                                <Form.Control ref={skill1Ref}  type="text" class="form-control"/>
                                <Form.Control ref={skill2Ref}  type="text" class="form-control"/>
                                <Form.Control ref={skill3Ref}  type="text" class="form-control"/>
                            </InputGroup>
                        </div>
                        </Form.Group>

                        <br></br>
                        <Button className="button" disabled = {loading} type="submit"> Submit</Button>
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
