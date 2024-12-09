import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import './NavMenu.css';

const NavMenuModerator = () => {
    return (
        <Navbar bg="dark" expand="lg" className="navbar-custom">
            <Container>
                <Navbar.Brand href="/" className="text-light fw-bold">
                    ABC - Transatibilidad - Moderator
                </Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <NavDropdown title="Municipios" id="municipies-dropdown" className="custom-link">
                            <NavDropdown.Item as={Link} to="/moderator/municipies">Lista de Municipios</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Rutas" id="routes-dropdown" className="custom-link">
                            <NavDropdown.Item as={Link} to="/moderator/routes">Lista de Rutas</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavMenuModerator;