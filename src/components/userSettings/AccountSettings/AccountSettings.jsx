import React, { useState } from 'react';
import { Container, Row, Col, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import AccountDetails from './AccountDetails';
import ChangePassword from './ChangePassword';
import PrivacySettings from './PrivacySettings';

const SECTIONS = {
    ACCOUNT_DETAILS: 'accountDetails',
    CHANGE_PASSWORD: 'changePassword',
    PRIVACY_SETTINGS: 'privacySettings',
};

function AccountSettings() {
    const [activeSection, setActiveSection] = useState(SECTIONS.ACCOUNT_DETAILS);

    // Mapa na jednoduchšie spravovanie sekcií
    const sectionComponents = {
        [SECTIONS.ACCOUNT_DETAILS]: <AccountDetails />,
        [SECTIONS.CHANGE_PASSWORD]: <ChangePassword />,
        [SECTIONS.PRIVACY_SETTINGS]: <PrivacySettings />,
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md={12} className="d-flex justify-content-center mb-4">
                    <ToggleButtonGroup
                        type="radio"
                        name="account-options"
                        value={activeSection}
                        onChange={(val) => setActiveSection(val)}
                        aria-label="Account Settings Options"
                    >
                        <ToggleButton id="tbg-radio-1" value={SECTIONS.ACCOUNT_DETAILS} variant="primary">
                            Osobné údaje
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-2" value={SECTIONS.CHANGE_PASSWORD} variant="primary">
                            Zmena hesla
                        </ToggleButton>
                        <ToggleButton id="tbg-radio-3" value={SECTIONS.PRIVACY_SETTINGS} variant="primary">
                            Ochrana súkromia
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Col>
                <Col md={12}>
                    {sectionComponents[activeSection] || <AccountDetails />}
                </Col>
            </Row>
        </Container>
    );
}

export default AccountSettings;

