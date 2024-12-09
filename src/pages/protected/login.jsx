import { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavMenu from "../../components/NavMenu";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorText, setErrorText] = useState('');
    const [validated, setValidated] = useState(false);

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const onLoginClick = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        setErrorText('');

        const credentials = {
            email,
            password,
        };

        axios.post('http://localhost:3000/auth/login', credentials)
            .then(res => {
                const token = res.data.token;
                localStorage.setItem('token', token);
                localStorage.setItem('userId', res.data.userId);
                navigate('/admin/users');
            })
            .catch(error => {
                const errorMsg = error.response?.data?.msg || 'Error al iniciar sesión.';
                setErrorText(errorMsg);
                console.log(error);
            });
    };

    return (
        <>
            <NavMenu />
            <Container>
                <Row className="mt-5">
                    <Col md={6} className="mx-auto">
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Iniciar Sesión</h2>
                                </Card.Title>
                                <Form noValidate validated={validated} onSubmit={onLoginClick}>
                                    {errorText && <Alert variant="danger">{errorText}</Alert>}

                                    <Form.Group className="mb-3">
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control
                                            required
                                            type="email"
                                            value={email}
                                            onChange={onChangeEmail}
                                            placeholder="Ingrese su email"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese un email válido.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Contraseña:</Form.Label>
                                        <Form.Control
                                            required
                                            type="password"
                                            value={password}
                                            onChange={onChangePassword}
                                            placeholder="Ingrese su contraseña"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese su contraseña.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Button type="submit" variant="primary">
                                        Iniciar Sesión
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default LoginPage;
