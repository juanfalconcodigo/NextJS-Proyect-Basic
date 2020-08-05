import { useState, useEffect } from 'react';

const useValidation = (initialState, validate, fn) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [submitForm, setSubmitForm] = useState(false);

    useEffect(() => {
        if (submitForm) {
            const notErrors = Object.keys(errors).length === 0;
            if (notErrors) {
                fn()
            }
            setSubmitForm(false);
        }

    }, [errors])

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const errorsValidation = validate(values);
        setErrors(errorsValidation);
        setSubmitForm(true);
    }

    const handleBlur = () => {
        const errorsValidation = validate(values);
        setErrors(errorsValidation);
    }

    return {
        values,
        errors,
        handleChange,
        handleBlur,
        handleSubmit
    }

}

export default useValidation;