import React, { useState } from 'react';
import { Form, Button, Alert, ProgressBar, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import {calculatePasswordStrength} from '../../../utils/passwordUtils' 
import { changePassword } from '../../../services/authService';

function PasswordChange() {
    const navigate = useNavigate(); // Nastavenie hooku na navigáciu

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

 

    const handleNewPasswordChange = (e) => {
        const password = e.target.value;
        setNewPassword(password);
        setPasswordStrength(calculatePasswordStrength(password));
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
    
        if (newPassword !== confirmPassword) {
            setError("Nové heslo a jeho potvrdenie sa nezhodujú.");
            return;
        }
    
        try {
            await changePassword(oldPassword, newPassword); // Použitie funkcie z authService
            setSuccess("Heslo bolo úspešne zmenené.");
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordStrength(0);
        } catch (error) {
            if (error.response?.status === 400) {
                const errorMessage = error.response.data?.error || 'Nesprávne staré heslo.';
                setError(errorMessage);
            } else {
                setError('Zmena hesla zlyhala. Skúste to znova.');
            }
        }
    };

    return (
        <Form onSubmit={handlePasswordChange}>
            <h2>Zmena hesla</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form.Group controlId="formOldPassword" className="mb-3">
                <Form.Label>Staré heslo</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Zadajte staré heslo"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="formNewPassword" className="mb-3">
                <Form.Label>Nové heslo</Form.Label>
                <InputGroup>
                    <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Zadajte nové heslo"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        required
                    />
                    <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Skryť" : "Zobraziť"}
                    </Button>
                </InputGroup>
                <ProgressBar now={passwordStrength} label={`${passwordStrength}%`} className="mt-2" />
                <small className="text-muted">
                    Heslo musí obsahovať aspoň 8 znakov, veľké písmeno, číslo a špeciálny znak.
                </small>
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="mb-3">
                <Form.Label>Potvrdiť nové heslo</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Zadajte nové heslo znova"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Zmeniť heslo
            </Button>
            <Button variant="link" className="float-end" onClick={() => navigate('/forgot-password')}>
                Zabudol som heslo
            </Button>
        </Form>
    );
}

export default PasswordChange;
