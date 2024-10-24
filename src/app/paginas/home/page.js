'use client'

import Pagina2 from "@/app/components/Pagina2";
import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import Link from 'next/link'; // Certifique-se de importar o Link

export default function Page() {
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        // useEffect para carregar os produtos do localStorage ao montar o componente
        const dados = JSON.parse(localStorage.getItem('produtos')) || [];
        // Carregando produtos do localStorage (usando JSON parse para converter de string para objeto JavaScript)
        setProdutos(dados);
    }, []);

    return (
        <Pagina2 titulo="Produtos">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Carousel data-bs-theme="dark" style={{ marginBottom: '10px', width: '100%', maxWidth: '1000px' }}>
                    {produtos.map(produto => (
                        <Carousel.Item key={produto.id} interval={1000}>
                            <div style={{ border: '3px solid #003366', padding: '30px' }}>
                                <Link href={`/produtos/${produto.id}`}>
                                    <img
                                        src={produto.imagem}
                                        alt={produto.nome}
                                        style={{
                                            objectFit: 'contain',
                                            height: '400px',
                                            width: '100%',
                                        }}
                                    />
                                </Link>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </Pagina2>
    );
}
