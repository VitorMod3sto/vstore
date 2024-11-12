'use client';

import { useState, useEffect } from 'react';
import Pagina2 from "@/app/components/Pagina2";
import { FaSave } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // Para redirecionar após salvar
import apiLocalidade from '@/services/apiLocalidade';
import { BiLogoVuejs } from 'react-icons/bi';
import { GiPartyPopper } from 'react-icons/gi'; // Ícone de festa para a modal

export default function Cadastro() {
    // Estados para armazenar os dados do cliente
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [bairro, setBairro] = useState('');
    const [numero, setNumero] = useState('');
    const [uf, setUf] = useState('');
    const [cidade, setCidade] = useState('');

    const [mensagem, setMensagem] = useState(''); // Mensagem de sucesso/erro
    const [corMensagem, setCorMensagem] = useState('red'); // Cor da mensagem de erro
    const [mostrarModal, setMostrarModal] = useState(false); // Controle da modal de sucesso

    const [ufs, setUfs] = useState([]);
    const [cidades, setCidades] = useState([]);

    const router = useRouter();

    // Carregar dados do cliente logado
    useEffect(() => {
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));

        if (clienteLogado) {
            setNome(clienteLogado.nome);
            setEmail(clienteLogado.email);
            setSenha(clienteLogado.senha);
            setCep(clienteLogado.cep);
            setEndereco(clienteLogado.endereco);
            setBairro(clienteLogado.bairro);
            setNumero(clienteLogado.numero);
            setUf(clienteLogado.uf);
            setCidade(clienteLogado.cidade);
        } else {
            router.push('/paginas/login');
        }
    }, []);

    // Carregar os estados (UFs)
    useEffect(() => {
        apiLocalidade.get('estados?orderBy=nome').then(resultado => {
            setUfs(resultado.data);
        });
    }, []);

    // Atualizar cidades quando o estado mudar
    useEffect(() => {
        if (uf) {
            apiLocalidade.get(`estados/${uf}/municipios`).then(resultado => {
                setCidades(resultado.data);
                setCidade('');
            });
        }
    }, [uf]);

    // Função para salvar os dados
    const salvarEdicao = () => {
        if (!nome || !email || !senha || !endereco || !numero || !cidade || !uf) {
            setMensagem('Todos os campos são obrigatórios!');
            setCorMensagem('red'); // Cor vermelha para erro
            return;
        }

        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));

        if (!clienteLogado) {
            setMensagem('Você não está logado!');
            setCorMensagem('red');
            return;
        }

        const clienteAtualizado = {
            ...clienteLogado,
            nome,
            email,
            senha,
            endereco,
            numero,
            bairro,
            cep,
            cidade,
            uf
        };

        localStorage.setItem('clienteLogado', JSON.stringify(clienteAtualizado));

        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        const indiceCliente = clientes.findIndex(cliente => cliente.email === clienteLogado.email);
        if (indiceCliente !== -1) {
            clientes[indiceCliente] = clienteAtualizado;
            localStorage.setItem('clientes', JSON.stringify(clientes));
        }

        // Exibir mensagem de sucesso e mostrar a modal
        setMensagem('Dados atualizados com sucesso!');
        setCorMensagem('green');
        setMostrarModal(true); // Mostrar modal de sucesso
    };

    return (
        <Pagina2 titulo="Editar Cadastro">
            <div style={{
                padding: '40px',
                width: '400px',
                margin: '50px auto',
                backgroundColor: 'black',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                color: 'white',
                textAlign: 'center',
                height: 'auto',
            }}>

                <h2 style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: '700',
                    fontSize: '24px',
                    marginBottom: '30px',
                    color: 'white'
                }}>
                    EDITAR CADASTRO <BiLogoVuejs style={{ fontSize: '45px' }} />
                </h2>

                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome"
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '15px',
                            borderRadius: '5px',
                            border: '2px solid #333',
                            boxSizing: 'border-box',
                            fontSize: '16px'
                        }}
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '15px',
                            borderRadius: '5px',
                            border: '2px solid #333',
                            boxSizing: 'border-box',
                            fontSize: '16px'
                        }}
                    />
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Senha"
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '15px',
                            borderRadius: '5px',
                            border: '2px solid #333',
                            boxSizing: 'border-box',
                            fontSize: '16px'
                        }}
                    />
                </div>

                <div style={{ marginTop: '30px' }}>
                    <input
                        type="text"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        placeholder="CEP"
                        style={{
                            width: '48%',
                            padding: '12px',
                            marginRight: '4%',
                            borderRadius: '5px',
                            border: '2px solid #333',
                            boxSizing: 'border-box',
                            fontSize: '16px'
                        }}
                    />
                    <select
                        value={uf}
                        onChange={(e) => setUf(e.target.value)}
                        style={{
                            width: '48%',
                            padding: '12px',
                            borderRadius: '5px',
                            border: '2px solid #333',
                            boxSizing: 'border-box',
                            fontSize: '16px'
                        }}
                    >
                        <option value=''>Selecione a UF</option>
                        {ufs.map(uf => (
                            <option key={uf.sigla} value={uf.sigla}>
                                {uf.sigla}
                            </option>
                        ))}
                    </select>
                    <select
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginTop: '15px',
                            marginBottom: '15px',
                            borderRadius: '5px',
                            border: '2px solid #333',
                            boxSizing: 'border-box',
                            fontSize: '16px'
                        }}
                    >
                        <option value=''>Selecione a cidade</option>
                        {cidades.map(cidade => (
                            <option key={cidade.nome} value={cidade.nome}>
                                {cidade.nome}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        placeholder="Endereço"
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '15px',
                            borderRadius: '5px',
                            border: '2px solid #333',
                            boxSizing: 'border-box',
                            fontSize: '16px'
                        }}
                    />

                    <input
                        type="text"
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                        placeholder="Bairro"
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '15px',
                            borderRadius: '5px',
                            border: '2px solid #333',
                            boxSizing: 'border-box',
                            fontSize: '16px'
                        }}
                    />

                    <input
                        type="number"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        placeholder="Número"
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '15px',
                            borderRadius: '5px',
                            border: '2px solid #333',
                            boxSizing: 'border-box',
                            fontSize: '16px'
                        }}
                    />
                </div>

                {mensagem && (
                    <p style={{
                        textAlign: 'center',
                        color: corMensagem,
                        marginTop: '15px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}>
                        {mensagem}
                    </p>
                )}

                <button
                    onClick={salvarEdicao}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginTop: '15px',
                    }}
                >
                    <FaSave style={{ marginRight: '8px' }} /> SALVAR ALTERAÇÕES
                </button>
            </div>

            {/* Modal de Sucesso */}
            {mostrarModal && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'black',
                    padding: '30px 40px',
                    borderRadius: '12px',
                    border: '2px solid #28a745',
                    textAlign: 'center',
                    zIndex: '1000',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                    opacity: 1,
                    transition: 'opacity 1s ease-out',
                    animation: 'fadeIn 1s ease-out',
                }}>
                    <h1 style={{ color: '#28a745' }}>
                        <BiLogoVuejs style={{ fontSize: '40px' }} />
                        <GiPartyPopper style={{ marginBottom: '10px', fontSize: '45px' }} />
                    </h1>
                    <h2 style={{
                        color: '#28a745',
                        fontSize: '24px',
                        fontWeight: '700',
                        marginBottom: '20px',
                        fontFamily: 'Montserrat, sans-serif',
                        textTransform: 'uppercase',
                    }}>
                        Dados atualizados com sucesso!
                    </h2>
                    <p style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: '500',
                        lineHeight: '1.6',
                        marginBottom: '20px',
                    }}>
                        Seus dados foram atualizados corretamente. 
                    </p>
                    <button
                        onClick={() => setMostrarModal(false)}
                        style={{
                            padding: '12px 20px',
                            backgroundColor: '#28a745',
                            color: 'black',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '20px',
                        }}
                    >
                        Fechar
                    </button>
                </div>
            )}
        </Pagina2>
    );
}
