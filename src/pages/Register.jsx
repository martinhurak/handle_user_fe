import React, { useState } from 'react';
import { Form, Button, Alert, Container, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { register } from './../services/authService';
import { calculatePasswordStrength } from '../utils/passwordUtils';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    });
    const [feedback, setFeedback] = useState({ error: null, success: false });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        
        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

   
    const handleRegister = async (e) => {
        e.preventDefault();
        setFeedback({ error: null, success: false });

        if (formData.password !== formData.confirmPassword) {
            setFeedback({ error: "Heslá sa nezhodujú." });
            return;
        }

        try {
            await register(formData.username, formData.password, formData.email);
            setFeedback({ success: true });
            navigate('/account-settings');
        } catch (error) {
            const errorMsg = error.response?.data;
            console.log(error)
            setFeedback({
                error: errorMsg.username || errorMsg.email || 'Registrácia zlyhala.'
            });
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4">Registrácia</h2>
            <Form onSubmit={handleRegister}>
                {feedback.error && <Alert variant="danger">{feedback.error}</Alert>}
                {feedback.success && <Alert variant="success">Registrácia úspešná!</Alert>}
                
                <Form.Group controlId="formUsername" className="mb-3">
                    <Form.Label>Používateľské meno</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Zadajte meno"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Zadajte email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Heslo</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Zadajte heslo"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    <ProgressBar now={passwordStrength} label={`${passwordStrength}%`} className="mt-2" />
                    <small className="text-muted">
                        Silné heslo obsahuje aspoň 8 znakov, veľké písmeno, číslo a špeciálny znak.
                    </small>
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-3">
                    <Form.Label>Potvrďte heslo</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Zadajte heslo znova"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Registrovať
                </Button>
            </Form>
        </Container>
    );
}

export default Register;
