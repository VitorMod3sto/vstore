import { Navbar, Container, Nav, NavDropdown, Dropdown } from "react-bootstrap";
import { BiLogoVuejs } from "react-icons/bi";
import { IoPerson } from "react-icons/io5";
import Footer from "./Footer";

export default function Pagina(props) {
    return (
        <>
            <Navbar style={{ backgroundColor: 'black' }} variant="dark">
                <Container>
                    <Navbar.Brand href="/paginas/home"> <BiLogoVuejs /> </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/produtos" style={{ color: '#ffffff' }}>Estoque</Nav.Link>
                            <NavDropdown title={<span style={{ color: '#ffffff' }}>Controle</span>} id="basic-nav-dropdown">
                                <NavDropdown.Item href="/categorias" style={{ color: 'black' }}>Categorias</NavDropdown.Item>
                                <NavDropdown.Item href="/marcas" style={{ color: 'black' }}>Marcas</NavDropdown.Item>
                                <NavDropdown.Item href="/produtos" style={{ color: 'black' }}>Produtos</NavDropdown.Item>
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
