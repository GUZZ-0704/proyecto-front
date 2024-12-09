import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import NavMenuAdmin from "../../../../components/NavMenuAdmin";

const FormUser = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState([]);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (id) {
            getUserById();
        }
        getRoles();
    }, [id]);

    const getUserById = () => {
        axios.get(`http://localhost:3000/users/${id}`)
            .then(res => {
                const user = res.data;
                setName(user.name);
                setEmail(user.email);
                setRoleId(user.roleId);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const getRoles = () => {
        axios.get('http://localhost:3000/roles')
            .then(res => {
                setRoles(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const onGuardarClick = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        const user = {
            name,
            email,
            roleId,
        };

        if (!id) {
            user.password = password;
            insertUser(user);
        } else {
            editUser(user);
        }
    };

    const editUser = (user) => {
        axios.put(`http://localhost:3000/users/${id}`, user)
            .then(res => {
                console.log(res.data);
                navigate('/admin/users');
            })
            .catch(error => {
                console.log(error);
            });
    };

    const insertUser = (user) => {
        axios.post('http://localhost:3000/users/register', user)
            .then(res => {
                console.log(res.data);
                navigate('/admin/users');
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <>
            <NavMenuAdmin />
            <Container>
                <Row className="mt-3 mb-3">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>{id ? 'Editar Usuario' : 'Crear Usuario'}</h2>
                                </Card.Title>
                                <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombre:</Form.Label>
                                        <Form.Control
                                            required
                                            value={name}
                                            type="text"
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese un nombre.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control
                                            required
                                            value={email}
                                            type="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese un email válido.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {!id && (
                                        <Form.Group className="mb-3">
                                            <Form.Label>Contraseña:</Form.Label>
                                            <Form.Control
                                                required
                                                value={password}
                                                type="password"
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Por favor ingrese una contraseña.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    )}

                                    <Form.Group className="mb-3">
                                        <Form.Label>Rol:</Form.Label>
                                        <Form.Select
                                            required
                                            value={roleId}
                                            onChange={(e) => setRoleId(e.target.value)}
                                        >
                                            <option value="">Seleccione un Rol...</option>
                                            {roles.map(role => (
                                                <option key={`role-${role.id}`} value={role.id}>
                                                    {role.type}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            Por favor seleccione un rol.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mt-3">
                                        <Button type="submit">Guardar Usuario</Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default FormUser;
