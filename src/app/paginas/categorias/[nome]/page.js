'use client';

import Pagina2 from "@/app/components/Pagina2";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap'; // Certifique-se de ter o Bootstrap instalado

export default function Page({ params }) {
    const [produtos, setProdutos] = useState([]);
    // Estado para armazenar os produtos

    useEffect(() => {
        // useEffect para carregar os produtos do localStorage ao montar o componente
        const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        // Carregando produtos do localStorage (usando JSON parse para converter de string para objeto JavaScript)

        const categoriaNome = decodeURIComponent(params.nome);
        // Armazenando o nome da categoria recebido pelo params

        // Filtrar produtos pela categoria recebida
        const produtosCategoria = produtos.filter(produto => produto.categoria === categoriaNome);

        setProdutos(produtosCategoria);
    }, []);

    return (
        <Pagina2 titulo='Categoria'>
            
            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold', fontWeight: '900',
             textAlign:'center', fontSize:'35px', marginTop:'05px', marginBottom:'20px' }}>
            {decodeURIComponent(params.nome)}
            </h2>
            <Row>
                {produtos.map(produto => (

                    <Col key={produto.id} md={3} className="mb-4">
                        <Link href={`/paginas/produtos/${produto.id}`} style={{ textDecoration: 'none' }}>
                            <Card style={{ border: '2px solid black', height: '415px', textAlign: 'center' }} className="d-flex flex-column justify-content-between">
                                <Card.Img variant="top" src={produto.imagem} alt={produto.nome} style={{ marginTop: '10px' }} />
                                <div style={{ borderBottom: '2px solid black', margin: '0' }} />
                                <Card.Body className="d-flex flex-column align-items-center" style={{backgroundColor:'black',color:'white'}}>
                                    <Card.Title style={{
                                        width: '400px', textAlign: 'center', fontFamily: 'Montserrat , sans-serif',
                                        fontWeight: '900'
                                    }}>
                                        {produto.nome.length > 23 ? `${produto.nome.substring(0, 23)}...` : produto.nome}
                                    </Card.Title>
                                    <div style={{ marginTop: 'auto' }}>
                                        <Card.Text style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            R$ {produto.preco.toFixed(2)}
                                        </Card.Text>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>

        </Pagina2>
    );
}
