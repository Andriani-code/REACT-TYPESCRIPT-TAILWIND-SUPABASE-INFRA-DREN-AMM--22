import React from 'react';

interface BaseProps {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

interface TextFieldProps extends BaseProps {
  type?: 'text' | 'number' | 'email';
  value: string | number | null;
}

interface CheckboxFieldProps extends BaseProps {
  type: 'checkbox';
  checked: boolean;
}

type FormFieldProps = TextFieldProps | CheckboxFieldProps;

const FormField: React.FC<FormFieldProps> = (props) => {
  const { label, name, onChange, required = false, disabled = false } = props;

  if (props.type === 'checkbox') {
    return (
      <label className="form-control">
        <div className="md:flex md:items-center md:justify-between">
          <span className="label-text font-semibold">{label}</span>
          <input
            name={name}
            type="checkbox"
            checked={props.checked}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className="checkbox checkbox-primary"
          />
        </div>
      </label>
    );
  }

  // par défaut : text/number/email
  return (
    <label className="form-control">
      <div className="md:flex md:items-center md:justify-between">
        <span className="label-text font-semibold">{label}</span>
        <input
          name={name}
          type={props.type ?? 'text'}
          value={props.value ?? ''}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="input input-bordered"
        />
      </div>
    </label>
  );
};

export default FormField;