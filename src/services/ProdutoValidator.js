import * as Yup from 'yup';

const ProdutoValidator = Yup.object().shape({
    nome: Yup.string()
        .min(3, 'O mínimo de caracteres é 3!')
        .max(50, 'O máximo de caracteres é 50!')
        .required('Campo obrigatório'),
    descricao: Yup.string()
        .max(200, 'O máximo de caracteres é 200!'),
    categoria: Yup.string()
        .required('Campo obrigatório'),
    preco: Yup.number()
        .positive('O preço deve ser um número positivo!')
        .required('Campo obrigatório'),
    quantidade: Yup.number()
        .integer('A quantidade deve ser um número inteiro!')
        .min(1, 'A quantidade deve ser pelo menos 1!')
        .required('Campo obrigatório'),
    tamanho: Yup.string()
        .oneOf(['PP', 'P', 'M', 'G', 'GG'], 'Tamanho inválido!')
        .required('Campo obrigatório'),

    cor: Yup.string()
        .required('Campo obrigatório'),
    marca: Yup.string()
        .required('Campo obrigatório'),
        
});

export default ProdutoValidator;
