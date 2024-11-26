import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const PrivacySettings = () => {
    const privacySections = [
        {
            title: 'Zber a použitie osobných údajov',
            content: (
                <>
                    <p>Môžeme zhromažďovať a spracovávať nasledujúce typy osobných údajov:</p>
                    <ul>
                        <li><strong>Kontaktné údaje:</strong> meno a e-mailová adresa, ktoré nám poskytnete pri registrácii alebo kontaktovaní.</li>
                        <li><strong>Údaje o používaní:</strong> IP adresa, čas prístupu a aktivita na stránke, ktoré zbierame na analytické účely.</li>
                        <li><strong>Cookies:</strong> Naša stránka využíva cookies na ukladanie informácií o vašich preferenciách.</li>
                    </ul>
                </>
            ),
        },
        {
            title: 'Použitie údajov',
            content: (
                <>
                    <p>Vaše osobné údaje používame na nasledujúce účely:</p>
                    <ul>
                        <li><strong>Poskytovanie a zlepšovanie služieb:</strong> Na lepšie poskytovanie obsahu a funkcií.</li>
                        <li><strong>Odpovedanie na otázky:</strong> Vaše kontaktné údaje používame na zodpovedanie vašich otázok.</li>
                        <li><strong>Analytické a marketingové účely:</strong> Anonymne analyzujeme údaje na zlepšenie služieb.</li>
                    </ul>
                </>
            ),
        },
        {
            title: 'Zdieľanie údajov s tretími stranami',
            content: (
                <>
                    <p>Vaše údaje nezdieľame s tretími stranami, okrem prípadov, keď:</p>
                    <ul>
                        <li>Je to potrebné na poskytovanie služieb (napr. poskytovatelia webových služieb).</li>
                        <li>To vyžaduje zákon alebo súdny príkaz.</li>
                    </ul>
                </>
            ),
        },
        {
            title: 'Súbory cookies',
            content: <p>Používame súbory cookies na zlepšenie používateľského zážitku. Môžete ich spravovať prostredníctvom nastavení prehliadača.</p>,
        },
        {
            title: 'Práva používateľov',
            content: (
                <>
                    <p>Máte nasledujúce práva ohľadom svojich osobných údajov:</p>
                    <ul>
                        <li><strong>Právo na prístup:</strong> Získať kópiu vašich údajov.</li>
                        <li><strong>Právo na opravu:</strong> Požiadavka na opravu nesprávnych údajov.</li>
                        <li><strong>Právo na výmaz:</strong> Požiadavka na vymazanie údajov, ak už nie sú potrebné.</li>
                    </ul>
                </>
            ),
        },
        {
            title: 'Kontakt',
            content: <p>Ak máte otázky o ochrane súkromia, kontaktujte nás na adrese: <strong>mato.hurak@gmail.com</strong></p>,
        },
    ];

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <h1 className="text-center mb-4">Zásady ochrany osobných údajov</h1>
                            <p><strong>Dátum účinnosti:</strong> 4.11.2024</p>
                            {privacySections.map((section, index) => (
                                <div key={index} className="mb-4">
                                    <h2>{section.title}</h2>
                                    {section.content}
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PrivacySettings;
