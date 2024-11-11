import { Navbar, Container, Nav, NavDropdown, Dropdown } from "react-bootstrap";
import { BiLogoVuejs } from "react-icons/bi";
import { IoPerson } from "react-icons/io5";
import Footer from "./Footer";

export default function Pagina(props) {
    return (
        <>
            <Navbar style={{ backgroundColor: '#003366' }} variant="dark">
                <Container>
                    <Navbar.Brand href="/"> <BiLogoVuejs /> </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/" style={{ color: '#ffffff' }}>Início</Nav.Link>
                            <Nav.Link href="/produtos" style={{ color: '#ffffff' }}>Estoque</Nav.Link>
                            <NavDropdown title={<span style={{ color: '#ffffff' }}>Controle</span>} id="basic-nav-dropdown">
                                <NavDropdown.Item href="/categorias" style={{ color: '#333333' }}>Categorias</NavDropdown.Item>
                                <NavDropdown.Item href="/marcas" style={{ color: '#333333' }}>Marcas</NavDropdown.Item>
                                <NavDropdown.Item href="/produtos" style={{ color: '#333333' }}>Produtos</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
    
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-3">
                {props.children}
            </Container>
            <Footer />


        </>
    );
}
