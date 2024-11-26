// ForgotPassword.js
import React, { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await axios.post('http://localhost:8000/api/password-reset/', { email });
            setSuccess("Na váš e-mail bol odoslaný odkaz na obnovenie hesla.");
        } catch (error) {
            setError("E-mail neexistuje alebo nastala chyba pri odosielaní.");
        }
    };

    return (
        <Container className="mt-5">
            <h2>Obnovenie hesla</h2>
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleForgotPassword}>
                <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Zadajte váš e-mail</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Zadajte e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Odoslať e-mail na obnovu hesla
                </Button>
            </Form>
        </Container>
    );
}

export default ForgotPassword;
