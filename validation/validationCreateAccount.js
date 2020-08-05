export default function validationCreateAccount(values) {
    const errors = {};
    if (!values.name) {
        errors.name = "En nombre es necesario";
    }
    if (!values.email) {
        errors.email = "El correo es necesario"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Email no válido";
    }

    if (!values.password) {
        errors.password = "La contraseña es necesaria";
    } else if (values.password.length < 6) {
        errors.password = "Mínimo 6 caracteres";
    }
    return errors;
}