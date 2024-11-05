'use client';

import { useState, useEffect } from 'react';
import Pagina2 from "@/app/components/Pagina2";
import { FaTrashAlt, FaMinus, FaPlus } from 'react-icons/fa'; // Ícones para aumentar/diminuir/remover
import Link from 'next/link';

export default function Page() {
    const [carrinho, setCarrinho] = useState([]);

    useEffect(() => {
        // Carregar os itens do carrinho do localStorage ao carregar a página
        const itensCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        setCarrinho(itensCarrinho);
    }, []);

    // Função para aumentar a quantidade do produto no carrinho
    const aumentarQuantidade = (id) => {
        const novosItens = carrinho.map(item => 
            item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
        setCarrinho(novosItens);
        localStorage.setItem('carrinho', JSON.stringify(novosItens));
    };

    // Função para diminuir a quantidade do produto no carrinho
const diminuirQuantidade = (id) => {
    const novosItens = carrinho.map(item => {
        if (item.id === id && item.quantidade > 1) {
            return { ...item, quantidade: item.quantidade - 1 };
        } else if (item.id === id && item.quantidade === 1) {
            // Se a quantidade chegar a 1, removemos o produto
            return null; // Será removido
        }
        return item;
    }).filter(item => item !== null); // Filtra os itens nulos

    // Atualiza o estado e o localStorage
    setCarrinho(novosItens);
    localStorage.setItem('carrinho', JSON.stringify(novosItens));
};


    // Função para remover o produto do carrinho
    const removerProduto = (id) => {
        const novosItens = carrinho.filter(item => item.id !== id);
        setCarrinho(novosItens);
        localStorage.setItem('carrinho', JSON.stringify(novosItens));
    };

    return (
        <Pagina2 titulo="Seu Carrinho">
            <div style={{ padding: '20px' }}>
                <h2 style={{ textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: '900' }}>
                    Carrinho de Compras
                </h2>
                
                {carrinho.length === 0 ? (
                    <p style={{ textAlign: 'center', fontSize: '18px' }}>O carrinho está vazio.</p>
                ) : (
                    <div>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {carrinho.map((item) => (
                                <li key={item.id} style={{ borderBottom: '1px solid #ddd', padding: '15px 0', display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img src={item.imagem} alt={item.nome} style={{ width: '70px', height: '70px', objectFit: 'contain', marginRight: '15px' }} />
                                        <div>
                                            <h5 style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>{item.nome}</h5>
                                            <p style={{ margin: '5px 0', fontSize: '16px' }}>R$ {item.preco}</p>
                                            <p style={{ margin: '0', fontSize: '16px' }}>Quantidade: {item.quantidade}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <button 
                                            onClick={() => diminuirQuantidade(item.id)} 
                                            style={{ backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 12px', cursor: 'pointer', marginLeft: '10px', fontSize: '16px' }}
                                        >
                                            <FaMinus />
                                        </button>
                                        <button 
                                            onClick={() => aumentarQuantidade(item.id)} 
                                            style={{ backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 12px', cursor: 'pointer', marginLeft: '10px', fontSize: '16px' }}
                                        >
                                            <FaPlus />
                                        </button>
                                        <button 
                                            onClick={() => removerProduto(item.id)} 
                                            style={{ backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 12px', cursor: 'pointer', marginLeft: '10px', fontSize: '16px' }}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div style={{ textAlign: 'center', marginTop: '30px' }}>
                            <Link href="/paginas/checkout">
                                <button 
                                    style={{ backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', padding: '15px 30px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}
                                >
                                    Finalizar Compra
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </Pagina2>
    );
}
