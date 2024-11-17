import * as Yup from 'yup';

const MarcaValidator = Yup.object().shape({
    nome: Yup.string()
        .min(3, 'O nome deve ter no mínimo 3 caracteres!')
        .max(50, 'O nome deve ter no máximo 50 caracteres!')
        .required('O campo Nome é obrigatório!'),
    descricao: Yup.string()
        .max(200, 'A descrição deve ter no máximo 200 caracteres!'),
});

export default MarcaValidator;
