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
                            <Nav.Link href="/" style={{ color: '#ffffff' }}>Produtos</Nav.Link>
                            <NavDropdown title={<span style={{ color: '#ffffff' }}>Categorias</span>} id="basic-nav-dropdown">
                                <NavDropdown.Item href="#" style={{ color: '#333333' }}>Categoria 1</NavDropdown.Item>
                                <NavDropdown.Item href="#" style={{ color: '#333333' }}>Categoria 2</NavDropdown.Item>
                                <NavDropdown.Item href="#" style={{ color: '#333333' }}>Categoria 3</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav className="ms-auto">
                            <Dropdown>
                                <Dropdown.Toggle
                                    as={Nav.Link}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: 'white',
                                        marginLeft: '10px',
                                        marginTop: '15px',
                                        position: 'relative',
                                    }}
                                >
                                    <IoPerson
                                        style={{
                                            color: '#003366',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    />
                                </Dropdown.Toggle>

                                <Dropdown.Menu align="end">
                                    <Dropdown.Item href="/" style={{ color: '#003366' }}><b>Login</b></Dropdown.Item>
                                    <Dropdown.Item href="/" style={{ color: '#003366' }}><b>Cadastre-se</b></Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
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
