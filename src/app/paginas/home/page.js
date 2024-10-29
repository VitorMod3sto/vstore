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
    // Estado para armazenar o índice do grupo de produtos no array de grupos de produtos (iniciado em 0)

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
            /* j será a variável que será meu "contador", iniciado em 0 e será incrementado até que J tenha os produtos desejados
            (sendo 8 produtos já que defini produtosPorGrupo = 8 ), ou seja, repete o loop enquanto  j < produtosPorGrupo */
            const index = (i + j) % produtos.length;
            // Garantindo que terá 8 produtos mesmo que tenha que repetir os produtos
            // Index armazena a posição do produto dentro do Array de produtos
            /* i armazena a posição inicial do produto no grupo atual (exemplo: grupo index 0 de produtos contém 8 produtos, sendo 
            produtos do index 0-7, ou seja, se i=8 o produto pertence ao grupo de produtos de indíce (index) 1),
             j armazena a posição do produto dentro do grupo atual (exemplo: se estiver no grupo de index 1, qual posição o produto 
             está dentro desse grupo).
            Já soma i + j resulta em um índice global (do Array produtos).
            O operador de módulo % garante que caso a soma ultrapasse o número de produtos totais (dentro do Array produtos),
            volte pra o ínicio do array, repetindo os produtos  */
            grupo.push(produtos[index]);
            // Adicionando ao grupo, o produto acessado pelo index
        }
        gruposDeProdutos.push(grupo);
        // Adicionando o grupo completo (8 produtos) ao array de grupos de produtos
    }

    const totalGrupos = gruposDeProdutos.length;
    // Armazenando o total de grupos que foi criado


    const handlePrev = () => {
        // Criando função que atualiza o setIndexGrupo pra exibir o grupo de produtos anterior (a partir do índice no array de grupos)
        setIndexGrupo((prev) => (prev === 0 ? totalGrupos - 1 : prev - 1));
        // Definindo que caso já esteja no primeiro grupo, volte pro último
    };

    const handleNext = () => {
        // Criando função que atualiza o setIndexGrupo pra exibir o próximo grupo de produtos 
        setIndexGrupo((prev) => (prev === totalGrupos - 1 ? 0 : prev + 1));
        // Definindo que caso já esteja no último grupo, volte pro primeiro
    };


    // APLICANDO A MESMA LÓGICA ACIMA MAS PRA EXIBIR APENAS BLUSAS DE TIME AGORA
    const [produtosBlusas, setProdutosBlusas] = useState([]);

    const [indexGrupoBlusas, setIndexGrupoBlusas] = useState(0);

    const produtosPorGrupoBlusas = 5;

    useEffect(() => {
        const dados = JSON.parse(localStorage.getItem('produtos')) || [];
        setProdutos(dados);
        setProdutosBlusas(dados.filter(produto => produto.categoria === 'Blusas de time'));
    }, []);


    const gruposDeBlusas = [];
    for (let i = 0; i < produtosBlusas.length; i++) {
        const grupo = [];
        for (let j = 0; j < produtosPorGrupoBlusas; j++) {
            const index = (i + j) % produtosBlusas.length;
            grupo.push(produtosBlusas[index]);
        }
        gruposDeBlusas.push(grupo);
    }

    const totalGruposBlusas = gruposDeBlusas.length;

    const handlePrevBlusas = () => {
        setIndexGrupoBlusas((prev) => (prev === 0 ? totalGruposBlusas - 1 : prev - 1));
    };

    const handleNextBlusas = () => {
        setIndexGrupoBlusas((prev) => (prev === totalGruposBlusas - 1 ? 0 : prev + 1));
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
                > {/* Definindo acima que irá ser exibido cada produto a cada 0.5s e deixando ser exibido o slider inferior
                   indicando qual produto está sendo exibido. Também defini os botões de passar o slide por seta (icons) */}

                    {/* Exibindo apenas os 3 primeiros produtos (Slice) */}
                    {produtos.slice(0, 4).map((produto) => (
                        <Carousel.Item key={produto.id}>
                            <div style={{ padding: '30px' }}>
                                <Link href={`/paginas/produtos/${produto.id}`}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 15px' }}>
                <h2 style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: '900',
                    margin: '0',
                }}>
                    MAIS PRODUTOS
                </h2>

                <Link href={`/paginas/produtos`}>
                    <button style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 'bold',
                        backgroundColor: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        marginLeft: '15px',
                        height: '50px',
                        marginBottom: '5px'
                    }}>
                        Saiba Mais
                    </button>
                </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Carousel data-bs-theme="dark" style={{ width: '100%', height: '220px', marginTop: '0', marginBottom: '0' }} // Remover margens
                    interval={null} indicators={false}
                    prevIcon={
                        <div style={{
                            backgroundColor: 'black',
                            borderRadius: '50%',
                            padding: '10px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                        }} onClick={handlePrev}>
                            <FaChevronLeft style={{ color: 'white', fontSize: '24px' }} />
                        </div>
                    }
                    nextIcon={
                        <div style={{
                            backgroundColor: 'black',
                            borderRadius: '50%',
                            padding: '10px',
                            boxShadow: '0 2px 5px  rgba(0, 0, 0, 0.3)',
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
                                            border: '3px solid black',
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
            </div><br /><br />


            {/* TERCEIRO CARROSSEL (blusas de time sendo exibidos em grupos de 5) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', margin: '0 15px' }}>
                    <Link href={`/paginas/produtos`}>
                        <button style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: 'bold',
                            backgroundColor: 'black',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            height: '50px',
                            marginLeft: '30px',
                            marginBottom: '10px'
                        }}>
                            Saiba Mais
                        </button>
                    </Link>
                    <h2 style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '900',
                        marginTop: '5px',
                        marginRight: '35px',
                        textAlign: 'right', // Alinhamento à direita    
                    }}>
                        BLUSAS DE TIME
                    </h2>
                </div>

                <Carousel
                    data-bs-theme="dark"
                    style={{ width: '100%', height: '320px', marginTop: '0' }}
                    interval={null}
                    indicators={false}
                    prevIcon={
                        <div style={{
                            backgroundColor: 'black',
                            borderRadius: '50%',
                            padding: '10px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                        }} onClick={handlePrevBlusas}>
                            <FaChevronLeft style={{ color: 'white', fontSize: '24px' }} />
                        </div>
                    }
                    nextIcon={
                        <div style={{
                            backgroundColor: 'black',
                            borderRadius: '50%',
                            padding: '10px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                        }} onClick={handleNextBlusas}>
                            <FaChevronRight style={{ color: 'white', fontSize: '24px' }} />
                        </div>
                    }
                >
                    {gruposDeBlusas.map((grupo, index) => (
                        <Carousel.Item key={index} active={index === indexGrupoBlusas}>
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                                {grupo.map(produto => (
                                    <Link key={produto.id} href={`/paginas/produtos/${produto.id}`}>
                                        <div style={{ border: '3px solid black', borderRadius: '8px', padding: '0', textAlign: 'center', flex: '0 0 auto', margin: '0 1px' }}>
                                            <img src={produto.imagem} alt={produto.nome}
                                                style={{ objectFit: 'contain', height: '260px', width: '100%', borderRadius: '5px' }} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>


            {/*  QUARTA SEÇÃO */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '900' }}>
                    COLEÇÃO OAKLEY
                </h2>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    width: '100%',
                    maxWidth: '1000px',
                    marginBottom: '10px',
                }}>
                    {produtos
                        .filter(produto => produto.nome.toLowerCase().includes('oakley'))
                        .slice(-3)
                        .map((produto) => (
                            <div key={produto.id} style={{
                                padding: '20px',
                                textAlign: 'center',
                                border: '2px solid black',
                                borderRadius: '8px',
                                margin: '10px',
                                height: '420px',
                                width: '350px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <Link href={`/paginas/produtos/${produto.id}`}>
                                    <img
                                        src={produto.imagem}
                                        alt={produto.nome}
                                        style={{
                                            objectFit: 'cover',
                                            height: '300px',
                                            width: '100%',
                                        }}
                                    />
                                </Link>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '80px' }}>
                                    <h5 style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        margin: '0',
                                        fontWeight: '900',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {produto.nome.length > 23 ? `${produto.nome.substring(0, 23)}...` : produto.nome}
                                    </h5>
                                    <p style={{ fontFamily: 'Poppins, sans-serif', margin: '0' }}>R$ {produto.preco.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                </div>
                <Link href={`/paginas/produtos`}>
                    <button style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 'bold',
                        backgroundColor: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        height: '50px',
                        marginLeft: '30px',
                        marginBottom: '10px'
                    }}>
                        Saiba Mais
                    </button>
                </Link>
            </div>


        </Pagina2>
    );
}
