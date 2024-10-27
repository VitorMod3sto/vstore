'use client'

import Pagina2 from "@/app/components/Pagina2";
import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight, FaFireAlt, FaStar } from "react-icons/fa";



export default function Page() {
    const [produtos, setProdutos] = useState([]);
    // Estado para armazenar os produtos

    useEffect(() => {
        // useEffect para carregar os produtos do localStorage ao montar o componente
        const dados = JSON.parse(localStorage.getItem('produtos')) || [];
        // Carregando produtos do localStorage (usando JSON parse para converter de string para objeto JavaScript)
        setProdutos(dados);
        // Atualizando o estado dos produtos
    }, []);


    const [indexGrupo, setIndexGrupo] = useState(0);
    // Estado para armazenar os produtos que serão visiveis no Carrossel

    const produtosPorGrupo = 8;
    // Definindo que devem ser exibidos 8 produtos no Carrossel na variável produtosPorGrupo


    const gruposDeProdutos = [];
    // Criando variável pra armazenar os grupos de produtos
    for (let i = 0; i < produtos.length; i += produtosPorGrupo) {
        //Iterando todos os produtos em incrementos de 8 (definidos em produtosPorGrupo)
        const grupo = [];
        // Armazenando na variável grupo os produtos que serão exibidos
        for (let j = 0; j < produtosPorGrupo; j++) {
            // Criando grupo de 8 produtos
            const index = (i + j) % produtos.length;
            // Garantindo que terá 8 produtos mesmo que tenha que repetir os produtos
            grupo.push(produtos[index]);
        }
        gruposDeProdutos.push(grupo);
    }

    const totalGrupos = gruposDeProdutos.length;
    // Armazenando o total de grupos que foi criado


    const handlePrev = () => {
        // Criando função que atualiza o setIndexGrupo pra exibir o grupo de produtos anterior
        setIndexGrupo((prev) => (prev === 0 ? totalGrupos - 1 : prev - 1));
        // Definindo que caso já esteja no primeiro grupo, volte pro último
    };

    const handleNext = () => {
        // Criando função que atualiza o setIndexGrupo pra exibir o próximo grupo de produtos 
        setIndexGrupo((prev) => (prev === totalGrupos - 1 ? 0 : prev + 1));
        // Definindo que caso já esteja no último grupo, volte pro primeiro
    };

    return (
        <Pagina2 titulo="Home">
            {/* PRIMEIRO CARROSSEL (produtos únicos sendo exibidos) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold', fontWeight: '900' }}>OS MAIS VENDIDOS</h2>

                <Carousel data-bs-theme="dark" style={{ marginBottom: '10px', width: '100%', maxWidth: '1000px' }}
                    interval={500} indicators={true}
                    prevIcon={
                        <div style={{ color: 'black' }}>
                            <FaChevronLeft style={{ color: 'black', fontSize: '24px' }} />
                        </div>
                    }
                    nextIcon={
                        <div style={{ color: 'black' }}>
                            <FaChevronRight style={{ color: 'black', fontSize: '24px' }} />
                        </div>
                    }
                >
                    {/* Exibindo apenas os 3 primeiros produtos (Slice) */}
                    {produtos.slice(0, 4).map((produto) => (
                        <Carousel.Item key={produto.id}>
                            <div style={{ padding: '30px' }}>
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
                                <div style={{ textAlign: 'center', marginTop: '10px', color: 'black', fontWeight: 'bold' }}>
                                    <h5 style={{ fontFamily: 'Poppins, sans-serif' }}>{produto.nome}</h5>
                                    <p style={{ fontFamily: 'Poppins, sans-serif' }}> R$ {produto.preco.toFixed(2)} </p>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div><br />


            {/* SEGUNDO CARROSSEL (produtos sendo exibidos em grupos de 8) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 15px' }}>

                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold', margin: 0, fontWeight: '900' }}>
                    MAIS PRODUTOS
                </h2>

                <Link href={`/paginas/produtos`}>
                    <button style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '900',
                        fontWeight: 'bold',
                        backgroundColor: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        marginLeft: '10px',
                        height: '50px'
                    }}>
                        Saiba Mais
                    </button>
                    </Link>
            </div>



            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Carousel data-bs-theme="dark" style={{ width: '100%', height: '200px' }}
                    interval={null} indicators={false}
                    prevIcon={
                        <div style={{
                            backgroundColor: '#003366',
                            borderRadius: '50%',
                            padding: '10px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                        }} onClick={handlePrev}>
                            <FaChevronLeft style={{ color: 'white', fontSize: '24px' }} />
                        </div>
                    }
                    nextIcon={
                        <div style={{
                            backgroundColor: '#003366',
                            borderRadius: '50%',
                            padding: '10px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                        }} onClick={handleNext}>
                            <FaChevronRight style={{ color: 'white', fontSize: '24px' }} />
                        </div>
                    }
                >
                    {/* Definindo abaixo que os produtos (suas imagens com Link) serão exibidos em grupos de 8 (gruposDeProdutos) */}
                    {/* Definindo a key = index porque os grupos não possuem id, então usamos a posição no array*/}
                    {gruposDeProdutos.map((grupo, index) => (
                        <Carousel.Item key={index} active={index === indexGrupo}>
                            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
                                {grupo.map(produto => (
                                    <Link key={produto.id} href={`/produtos/${produto.id}`}>
                                        <div style={{
                                            border: '3px solid #003366',
                                            borderRadius: '8px',
                                            padding: '10px',
                                            textAlign: 'center',
                                            flex: '0 0 auto',
                                            margin: '5px'
                                        }}>
                                            <img
                                                src={produto.imagem}
                                                alt={produto.nome}
                                                style={{
                                                    objectFit: 'contain',
                                                    height: '150px',
                                                    width: '100%',
                                                    borderRadius: '5px',
                                                }}
                                            />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </Pagina2>
    );
}
