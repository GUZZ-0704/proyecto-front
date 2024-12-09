import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import './NavMenu.css';

const NavMenuAdmin = () => {
    return (
        <Navbar bg="dark" expand="lg" className="navbar-custom">
            <Container>
                <Navbar.Brand href="/" className="text-light fw-bold">
                ABC - Transatibilidad - Admin
                </Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <NavDropdown title="Usuarios" id="users-dropdown" className="custom-link">
                            <NavDropdown.Item as={Link} to="/admin/users">Lista de Usuarios</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/admin/users/create">Crear Usuarios</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Municipios" id="municipies-dropdown" className="custom-link">
                            <NavDropdown.Item as={Link} to="/admin/municipies">Lista de Municipios</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Rutas" id="routes-dropdown" className="custom-link">
                            <NavDropdown.Item as={Link} to="/admin/routes">Lista de Rutas</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Reportes" id="reports-dropdown" className="custom-link">
                            <NavDropdown.Item as={Link} to="/admin/reports">Lista de Reportes</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Incidentes" id="incidents-dropdown" className="custom-link">
                            <NavDropdown.Item as={Link} to="/admin/incidents">Lista de incidentes</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavMenuAdmin;
