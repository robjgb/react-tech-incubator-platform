import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useNavigate } from "react-router-dom"
import '../styles.css'
import {ReactComponent as ReactLogo} from '../../assets/accept_tasks.svg'
import { doc, setDoc, getDoc } from "firebase/firestore";  
import {db} from "../../firebase"
import { auth } from "../../firebase"

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login, googleSignin} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleGoogleSubmit(e){
        e.preventDefault()

        try{
            setError('')
            setLoading(true)
            await googleSignin()
            const docRef = doc(db, "users", auth.currentUser.uid)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                navigate('/')
              } else {
                await setDoc(doc(db, "users", auth.currentUser.uid), {
                    name: "",
                    biography: "",
                    location: "",   
                    profilePic: null,
                    isCompany: false
                  });
                navigate('/get-started')
              }
        
        }catch(error){
            var errorMessage = error.message
            var str = errorMessage.substr(errorMessage.indexOf(":") + 1);
            str = str.substring(0, str.lastIndexOf(" "));
            
            setError('Failed to sign in: ' + str)
        }

    }

    async function handleSubmit(e){
        e.preventDefault()

        try{
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate('/')
        } catch (error) {
            var errorMessage = error.message
            var str = errorMessage.substr(errorMessage.indexOf(":") + 1);
            str = str.substring(0, str.lastIndexOf(" "));
            
            setError('Failed to sign in: ' + str)
        }
        setLoading(false)
    }

    return (
    <>
    <div className= "Wrapper"> 

    <div className="Sidebar">

        <header className="Header">
            <h1>Discover new opportunities with your favorite companies.</h1>
        </header>
        <div className='Artwork'>
            <ReactLogo></ReactLogo>
        </div>
    </div>

    <div className= "Body">
    <Card className ="Card">
        <Card.Body>
            <h2 className ="text-center mb-4 fw-bold">Log in to Hatchery</h2>
            {error && <Alert variant = "danger">{error}</Alert>}
            <Button className="button-provider" onClick={handleGoogleSubmit}>
            <i className="bi bi-google" width="16" height="16" fill="currentColor"> 
             </i>
               Sign in with <b>Google</b></Button>
              <hr className="hrdivider">
                </hr>
                <p className='w-100 text-center mt-2 fw-bold fst-italic'> Or </p>
            <Form className = "Form" onSubmit ={handleSubmit}>
                <Form.Group id = "email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required/>
                </Form.Group>
                <Form.Group id = "password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required/>
                </Form.Group>
                <Button className="button" disabled = {loading} type="submit" style={{backgroundColor:"#ffa511"}}>Log in</Button>
                <div className='Link'>
                    <Link to="/forgot-password"> Forgot Password ? </Link>
                <div className='Link'>
                        Not a member? <Link to ="/signup">Sign up now</Link>
                </div>
            </div>
            </Form>
        </Card.Body>
    </Card>

    </div>
    </div>
    </>
    )
}
