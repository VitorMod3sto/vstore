'use client';

import Pagina2 from "@/app/components/Pagina2";
import { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap'; // Certifique-se de ter o Bootstrap instalado

export default function Page({ params }) {
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        const categoriaNome = decodeURIComponent(params.nome);

        // Filtrar produtos pela categoria recebida
        const produtosCategoria = produtos.filter(produto => produto.categoria === categoriaNome);

        setProdutos(produtosCategoria);
    }, []);

    return (
        <Pagina2 titulo='Categoria'>
            <h1>{decodeURIComponent(params.nome)}</h1>
            <Row>
                {produtos.map(produto => (
                        <Col key={produto.id} md={4} className="mb-4">
                            <Card>
                                <Card.Img variant="top" src={produto.imagem} alt={produto.nome}/>
                                <Card.Body>
                                    <Card.Title>{produto.nome}</Card.Title>
                                    <Card.Text>
                                        Preço: R$ {produto.preco.toFixed(2)}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
            </Row>
        </Pagina2>
    );
}
