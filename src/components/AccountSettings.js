import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import './styles.css'

export default function AccountSettings() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { currentUser, updateEmail, updatePassword } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()

        if(passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError('Passwords do not match')
        }

        const promises = []
        setLoading(true)
        setError('')

        if(emailRef.current.value !== currentUser.email){
            promises.push(updateEmail(emailRef.current.value))
        }
        if(passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        Promise.all(promises).then(()=>{
            navigate('/')
        }).catch((error) =>{
            var errorMessage = error.message
            var str = errorMessage.substr(errorMessage.indexOf(":") + 1);
            str = str.substring(0, str.lastIndexOf(" "));
            
            setError(str)
        }).finally(()=>{
            setLoading(false)
        })
    }

    return (
    <>
    <div className= "Body">
    <Card className ="Card" style ={{padding: "50px 0px 0"}}>
        <Card.Body>
            <h2 className ="text-center mb-4">Account Settings</h2>
            {error && <Alert variant = "danger">{error}</Alert>}
            <Form className = "Form" onSubmit ={handleSubmit}>
                <Form.Group id = "email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required
                    defaultValue={currentUser.email} />
                </Form.Group>
                <Form.Group id = "password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} 
                    placeholder="Leave empty to keep same password"/>
                </Form.Group>
                <Form.Group id = "password-confirm">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control type="password" ref={passwordConfirmRef} 
                    placeholder="Leave empty to keep same password"/>
                </Form.Group>
                <br></br>
                <Button className="button" disabled = {loading}  type="submit">Update</Button>
            </Form>
            <div className='w-100 text-center mt-2'>
                <Link to ="/">Cancel</Link>
            </div>
        </Card.Body>
    </Card>
    </div>

    </>
    )
}
