import React, { useRef, useState, useEffect } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { doc, updateDoc, getDoc } from "firebase/firestore";
import {db} from "../firebase"

export default function UpdateProfile() {
    const nameRef = useRef()
    const bioRef = useRef()
    const locationRef = useRef()
    const phoneRef = useRef()
    const {currentUser} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [isCompany, setIsCompany] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [message, setMessage] = useState('')

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
            setMessage('')
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
                setMessage('Changes were made successfully.')
            }else{
                await updateDoc(doc(db, "users", currentUser.uid), {
                    name: nameRef.current.value,
                    biography: bioRef.current.value,
                    location: locationRef.current.value,
                });
                setMessage('Changes were made successfully.')
            }
        } catch (error) {
            var errorMessage = error.message
            setError(errorMessage)
        }
        setLoading(false)
    }

    function UpdateProfile() {
        return <>
        <div className= "OnboardingBody">
        <Card className ="OnboardingCard1">
            <Card.Body>
                <h2 className ="Onboarding">{isCompany ? "Edit Company Details": "Edit Profile"}</h2>
                <h3>  Set up your presence and display needs </h3>
                {error && <Alert variant = "danger">{error}</Alert>}
                {message && <Alert variant = "success">{message}</Alert>}
                <Form className ="OnboardingForm" onSubmit ={handleSubmit}>
                    <Form.Group id = "displayName">
                        <Form.Label>{isCompany ? "Edit Company Name": "Change your display name"}</Form.Label>
                        <Form.Control ref={nameRef} placeholder="Enter a display name" required/>
                    </Form.Group>
                    <Form.Group id = "displayName">
                        <Form.Label>{isCompany ? "Edit Company Description": "Change your biography"}</Form.Label>
                        <Form.Control ref={bioRef} placeholder="Enter a biography" required/>
                    </Form.Group>
                    <Form.Group id = "displayName">
                        <Form.Label>Change your location</Form.Label>
                        <Form.Control ref={locationRef} placeholder="Enter a location" required/>
                    </Form.Group>
                    {isCompany ? <Form.Group id = "displayName">
                        <Form.Label>Change your phone number</Form.Label>
                        <Form.Control type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" ref={phoneRef} placeholder="Enter a phone number in this format: 123-456-7890 # Use dashes" required/>
                    </Form.Group> : null}
                    <br></br>
                    <Button className="button" disabled = {loading} type="submit">Update</Button>
                </Form>
            </Card.Body>
        </Card>
        </div>
        </>
    
    }

    return (
         !loaded ? <div></div> : <UpdateProfile></UpdateProfile>
    )
}
