import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import '../styles.css'
import {ReactComponent as ReactLogo} from '../../assets/add_tasks.svg'
import { doc, setDoc } from "firebase/firestore";  
import {db} from "../../firebase"
import { auth } from "../../firebase"



export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()

        if(passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError('Passwords do not match')
        }

        try{
            setError('')
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                    name: "",
                    biography: "",
                    location: "",
                    profilePic: null,
                    isCompany: false
                  });
            navigate('/get-started')
        } catch (error){
            var errorMessage = error.message
            var str = errorMessage.substr(errorMessage.indexOf(":") + 1);
            str = str.substring(0, str.lastIndexOf(" "));
            setError(str)
        }
        setLoading(false)
    }

    return (
    <>
    <div className= "Wrapper"> 
    <div className="Sidebar" style ={{backgroundColor:'#A7C7E7'}}>
        <header className="Header">
            <h1 style ={{color:'#3D426B '}}>Discover new opportunities with your favorite companies.</h1>
        </header>
        <div className='Artwork'>
            <ReactLogo></ReactLogo>
        </div>

    </div>

    <div className= "Body">
    <Card className ="Card">
        <Card.Body>
            <h2 className ="text-center mb-4 fw-bold">Sign Up for Hatchery</h2>
            {error && <Alert variant = "danger">{error}</Alert>}
            <Form className = "Form" onSubmit ={handleSubmit}>
                <Form.Group id = "email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required/>
                </Form.Group>
                <Form.Group id = "password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required/>
                </Form.Group>
                <Form.Group id = "password-confirm">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control type="password" ref={passwordConfirmRef} required/>
                </Form.Group>
                <Button className="button" disabled = {loading}  type="submit" style ={{backgroundColor:'#52c2f2'}}>Create Account</Button>
            </Form>
            <div className='Link'>
            Already a member? <Link to ="/login">Log in</Link>
            </div>
            <div className='Link'>
            Company Registration: <Link to ="/company-signup"> Add Your Company</Link>
            </div>
        </Card.Body>
    </Card>

    </div>

    </div>
    </>
    )
}
