import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';

function AccountDetails() {
    const [userDetails, setUserDetails] = useState({
        originalName: '',
        originalEmail: '',
        name: '',
        email: '',
    });
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditable, setIsEditable] = useState({ name: true, email: true });
    const [updateButtonIsActive, setUpdateButtonIsActive] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user-profile/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                const { username, email } = response.data;
                setUserDetails({ originalName: username, originalEmail: email, name: username, email });
                setLoading(false);
            } catch (error) {
                setError('Unable to fetch user data.');
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleInputChange = (field, value) => {
        setUserDetails((prevDetails) => ({ ...prevDetails, [field]: value }));
        setIsEditable((prev) => ({ ...prev, [field === 'name' ? 'email' : 'name']: false }));
        setUpdateButtonIsActive(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const dataToUpdate = { password };
        if (userDetails.name !== userDetails.originalName) dataToUpdate.username = userDetails.name;
        if (userDetails.email !== userDetails.originalEmail) dataToUpdate.email = userDetails.email;

        try {
            const response = await axios.put(
                'http://localhost:8000/api/update-profile/',
                dataToUpdate,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            );
            setSuccess(response.data.success);
            setPassword('');
            setUserDetails((prevDetails) => ({
                ...prevDetails,
                originalName: prevDetails.name,
                originalEmail: prevDetails.email,
            }));
            setIsEditable({ name: true, email: true });
            setUpdateButtonIsActive(true);
        } catch (error) {
            console.log(error.response.data)
            setError(error.response.data.username || error.response.data.email || 'Update failed. Please try again.');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete('http://localhost:8000/api/delete-account/', {
                data: { password: deletePassword },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setSuccess('Váš účet bol úspešne vymazaný.');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setShowDeleteModal(false);
            window.location.href = '/register';
        } catch (error) {
            setError(error.response?.data?.error || 'Vymazanie účtu zlyhalo. Skúste to znova.');
        }
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <Form onSubmit={handleUpdate}>
            <h2>Osobné údaje</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Meno</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Zadajte meno"
                    value={userDetails.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditable.name}
                />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Zadajte email"
                    value={userDetails.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditable.email}
                />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Heslo (potvrdenie zmeny mena alebo emailu)</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Zadajte heslo"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>
            
            <Button variant="primary" className="me-3" type="submit" disabled={updateButtonIsActive}>
                Aktualizovať
            </Button>

            <Button variant="danger"  onClick={() => setShowDeleteModal(true)}>
                Vymazať účet
            </Button>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Potvrdenie vymazania účtu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Na vymazanie účtu zadajte svoje heslo:</p>
                    <Form.Control
                        type="password"
                        placeholder="Zadajte heslo"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Zrušiť
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAccount}>
                        Vymazať účet
                    </Button>
                </Modal.Footer>
            </Modal>
        </Form>
    );
}

export default AccountDetails;
