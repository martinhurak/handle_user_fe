import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../services/authService';

// Komponent pre odkazy pre neprihlásených používateľov
const GuestLinks = ({ onClick }) => (
    <>
        <Nav.Link as={Link} to="/login" onClick={onClick}>Prihlásenie</Nav.Link>
        <Nav.Link as={Link} to="/register" onClick={onClick}>Registrácia</Nav.Link>
    </>
);

// Komponent pre odkazy pre prihlásených používateľov
const UserLinks = ({ onLogout, onClick }) => (
    <NavDropdown title="Profil" id="profile-dropdown" align="end">
        <NavDropdown.Item as={Link} to="/account-settings" onClick={onClick}>
            Nastavenie účtu
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/support" onClick={onClick}>
            Pomoc a podpora
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/feedback" onClick={onClick}>
            Poskytnúť odozvu
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={() => {
            onLogout();
            onClick();
        }}>
            Odhlásiť sa
        </NavDropdown.Item>
    </NavDropdown>
);

function NavBar() {
    const navigate = useNavigate();
    const loggedIn = isAuthenticated();
    const [expanded, setExpanded] = useState(false); // Stav menu

    const handleLogout = () => {
        logout();
        navigate('/login');
        setExpanded(false); // Zavretie menu po odhlásení
    };

    const handleToggle = () => setExpanded((prevExpanded) => !prevExpanded);

    const handleLinkClick = (e) => {
        // Ak je kliknutý dropdown (napr. Profil), nezatváraj menu
        if (e.target.closest('#profile-dropdown')) {
            return;
        }
        setExpanded(false);
    };

    return (
        <Navbar bg="light" expand="lg" fixed="top" expanded={expanded}>
            <Container fluid>
                <Navbar.Brand as={Link} to="/">Moja Aplikácia</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto" onClick={handleLinkClick}>
                        <Nav.Link as={Link} to="/">Domov</Nav.Link>
                        <Nav.Link as={Link} to="/shopping">Idem nakupovať</Nav.Link>
                        {loggedIn ? (
                            <UserLinks onLogout={handleLogout} onClick={() => setExpanded(false)} />
                        ) : (
                            <GuestLinks onClick={() => setExpanded(false)} />
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;
