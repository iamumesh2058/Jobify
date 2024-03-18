import React from 'react';

const FormRow = ({ type, name, labelText, defaultValue, onChange }) => {
    return (
        <div className="form-row">
            <label htmlFor={name} className="form-label">
                { labelText || name }
            </label>
            <input
                type={type}
                id={name}
                name={name}
                defaultValue={defaultValue || ''}
                className="form-input"
                required
                onChange={onChange}
            />
        </div>
    )
}

export default FormRow;