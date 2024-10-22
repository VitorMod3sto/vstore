import { useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Dropdown, Form, Button, Modal } from "react-bootstrap";
import { BiLogoVuejs } from "react-icons/bi";
import { IoPerson } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import Footer from "./Footer";
import { FaTruckFast } from "react-icons/fa6";
import { IoPersonCircleOutline } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { MdLocalGroceryStore } from "react-icons/md";




export default function Pagina2(props) {
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    return (
        <>
            <div style={{
                backgroundColor: 'white',
                color: '#003366',
                textAlign: 'center',
                padding: '05px 0',
                fontWeight: 'bold'
            }}>
                Frete grátis pra todo Brasil! <FaTruckFast style={{ fontSize: '20px', marginBottom: '02px' }} />
            </div>
            <Navbar style={{ backgroundColor: '#003366' }} variant="dark">
                <Container>
                    <IoMdMenu
                        style={{ color: '#ffffff', fontSize: '30px', cursor: 'pointer' }}
                        onClick={handleShow}
                    />
                    <Navbar.Brand href="/">
                        <BiLogoVuejs style={{ fontSize: '40px', marginLeft: '20' }} />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">

                        {/* Barra de Pesquisa Centralizada e Ampliada */}
                        <div style={{ flexGrow: 1, marginLeft: '220px' }}>
                            <Form className="d-flex" style={{ maxWidth: '600px' }}>
                                <Form.Group controlId="search" className="flex-grow-1">
                                    <Form.Control
                                        type="text"
                                        placeholder="Pesquisar produto..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        style={{ borderRadius: '10px' }}
                                    />
                                </Form.Group>
                                <Button variant="light" style={{ color: '#003366', fontWeight: 'bold', border: '2px solid white' }} className="ms-2">
                                    <FaSearch style={{ marginBottom: '3px' }} /> Buscar
                                </Button>
                            </Form>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            marginLeft: '10px',
                            marginTop: '05px',
                        }}>
                            <FaShoppingCart

                                style={{
                                    color: '#003366',
                                    fontSize: '20px'
                                }}
                            />
                        </div>

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
                                        marginTop: '05px',
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

            {/* Modal */}
            <Modal
                show={showModal}
                onHide={handleClose}
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '0',
                    transform: 'translateY(-50%)',
                    width: '350px'
                }}
                className="custom-modal" // Adicione uma classe personalizada
            >
                <Modal.Header style={{ backgroundColor: '#003366', color: 'white' }}>
                    <Modal.Title> <IoPersonCircleOutline style={{ marginBottom: '05px', marginRight: '02px', fontSize:'35px' }} />Olá, acesse sua conta</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#003366', color: 'white', fontSize: '20px' }}>
                    <ul style={{ padding: 0, listStyleType: 'none' }}>
                        <li> <AiFillHome  style={{ marginBottom: '05px' }} /> Minha Conta</li>
                        <li> <MdLocalGroceryStore style={{ marginBottom: '03px' }} /> Produtos</li>
                    </ul>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#003366', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    
                    <Button
                        variant="light"
                        style={{
                            width: '100%',
                            margin: '10px 0',
                            fontWeight: 'bold',
                            color: '#003366', backgroundColor: 'white'
                        }}
                        href="/login" 
                    >
                        LOGIN
                    </Button>
                    <Button
                        variant="light"
                        style={{
                            width: '100%',
                            margin: '10px 0',
                            fontWeight: 'bold',
                             color: 'white', backgroundColor: '#003366',
                             border:'none'
                        }}
                        href="/cadastro" 
                    >
                        CADASTRE-SE
                    </Button>
                </Modal.Footer>
            </Modal>



            <Container fluid className="my-2">
                {props.children}
            </Container>
            <Footer />
        </>
    );
}
