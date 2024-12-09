import axios from "axios";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import NavMenuAdmin from "../../../../components/NavMenuAdmin";

const PasswordPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validated, setValidated] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [successText, setSuccessText] = useState("");

    const onSubmit = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);
        setErrorText("");
        setSuccessText("");

        if (form.checkValidity() === false) {
            return;
        }

        if (password !== confirmPassword) {
            setErrorText("Las contraseñas no coinciden.");
            return;
        }

        updatePassword();
    };

    const updatePassword = () => {
        axios
            .patch(`http://localhost:3000/users/${id}/change-password`, { password })
            .then((res) => {
                setSuccessText("Contraseña actualizada con éxito.");
                setTimeout(() => {
                    navigate("/admin/users");
                }, 2000);
            })
            .catch((error) => {
                setErrorText(
                    error.response?.data?.msg || "Error al actualizar la contraseña."
                );
                console.error(error);
            });
    };

    return (
        <>
            <NavMenuAdmin />
            <Container className="mt-5">
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Cambiar Contraseña</h2>
                                </Card.Title>
                                <Form noValidate validated={validated} onSubmit={onSubmit}>
                                    {errorText && <Alert variant="danger">{errorText}</Alert>}
                                    {successText && <Alert variant="success">{successText}</Alert>}

                                    <Form.Group className="mb-3">
                                        <Form.Label>Nueva Contraseña:</Form.Label>
                                        <Form.Control
                                            required
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese una nueva contraseña.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Confirmar Contraseña:</Form.Label>
                                        <Form.Control
                                            required
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor confirme su nueva contraseña.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Button type="submit" variant="primary">
                                        Actualizar Contraseña
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

export default PasswordPage;
