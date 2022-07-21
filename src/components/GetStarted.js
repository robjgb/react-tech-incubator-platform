import React, { useRef, useState, useEffect } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { doc, updateDoc, getDoc } from "firebase/firestore";
import {db} from "../firebase"
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
    const nameRef = useRef()
    const bioRef = useRef()
    const phoneRef = useRef()
    const locationRef = useRef()
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
            console.log(user.isCompany)
            setIsCompany(user.isCompany)
            setLoaded(true)
        }
    }, [user]);

    async function handleSubmit(e){
        e.preventDefault()

        try{
            setError('')
            setLoading(true)
            if(isCompany){
                await updateDoc(doc(db, "users", currentUser.uid), {
                    name:nameRef.current.value,
                    description: bioRef.current.value,
                    phone: phoneRef.current.value,
                    location: locationRef.current.value,
                    logo: null,
                    isCompany: true
                });
                navigate('/')
            }else{
                await updateDoc(doc(db, "users", currentUser.uid), {
                    biography: nameRef.current.value,
                    displayName: bioRef.current.value,
                    location: locationRef.current.value,
                });
                navigate('/')
            }
        } catch (error) {
            var errorMessage = error.message
            var str = errorMessage.substr(errorMessage.indexOf(":") + 1);
            str = str.substring(0, str.lastIndexOf(" "));
            setError(str)
        }
        setLoading(false)
    }

    function GetStarted() {
        return (
            <>
            <div className= "OnboardingBody">
            <Card className ="OnboardingCard">
                <Card.Body>
                    <h2 className ="Onboarding"> {isCompany ? "Enter Company Details": "Welcome! Let’s create your profile"}</h2>
                    <h3>  Let others get to know you better! You can also edit these later </h3>
                    {error && <Alert variant = "danger">{error}</Alert>}
                    <Form className ="OnboardingForm" onSubmit ={handleSubmit}>
                        <Form.Group id = "displayName">
                            <Form.Label>{isCompany ? "Add Company Name": "Choose a name to display"}</Form.Label>
                            <Form.Control ref={nameRef} placeholder="Enter a display name" required/>
                        </Form.Group>
                        <Form.Group id = "displayName">
                            <Form.Label>{isCompany ? "Add Company Description": "Add a biography"}</Form.Label>
                            <Form.Control ref={bioRef} placeholder="Enter a biography" required/>
                        </Form.Group>
                        <Form.Group id = "displayName">
                            <Form.Label>Add a location</Form.Label>
                            <Form.Control ref={locationRef} placeholder="Enter a location" required/>
                        </Form.Group>
                        {isCompany ? <Form.Group id = "displayName">
                                <Form.Label>Add a phone number</Form.Label>
                                <Form.Control type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" ref={phoneRef} placeholder="Enter a phone number in this format: 123-456-7890 # Use dashes" required/>
                            </Form.Group> : null}
                        <br></br>
                        <Button className="button" disabled = {loading} type="submit">Next</Button>
                    </Form>
                </Card.Body>
            </Card>
            </div>
            </>
        )
    }

    return (
        !loaded ? <div></div> : <GetStarted></GetStarted>
    )
}
