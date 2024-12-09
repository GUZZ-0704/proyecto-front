import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavMenuAdmin from "../../../../components/NavMenuAdmin";

const ListUserPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
        document.title = "Listado de Usuarios";
    }, []);

    const getUsers = () => {
        axios.get('http://localhost:3000/users')
            .then(res => {
                setUsers(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const deleteUser = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar este usuario?");
        if (!confirm) {
            return;
        }
        axios.delete(`http://localhost:3000/users/${id}`)
            .then(res => {
                console.log(res.data);
                getUsers();
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <>
            <NavMenuAdmin />
            <Container className="mt-3 mb-3">
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Lista de Usuarios</h2>
                                </Card.Title>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th>Rol</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.roleId === 1 ? "Administrador" : "Verificador"}</td>
                                                <td>
                                                    <Link className="btn btn-secondary" to={`/admin/users/${user.id}/password`}>
                                                        Cambiar Contraseña
                                                    </Link>{' '}
                                                    <Link className="btn btn-primary" to={`/admin/users/edit/${user.id}`}>
                                                        Editar
                                                    </Link>{' '}
                                                    <Button variant="danger" onClick={() => deleteUser(user.id)}>
                                                        Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ListUserPage;
