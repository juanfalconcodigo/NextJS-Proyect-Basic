export default function validationCreateProduct(values) {
    const errors = {};
    if (!values.name) {
        errors.name = "En nombre es necesario";
    }
    if (!values.enterprise) {
        errors.enterprise = "La empresa es necesaria";
    }
    if (!values.url) {
        errors.url = "La url es necesario"
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
        errors.url = "Url no válido";
    }

    if (!values.description) {
        errors.description = "La descripción es necesaria";
    } else if (values.description.length < 20) {
        errors.description = "Mínimo 20 caracteres";
    }
    return errors;
}