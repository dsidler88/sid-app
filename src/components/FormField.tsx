import { FC } from "react";

//just mixing and matching different component types
//eg. this one is FC<> but accomplishes the same as rafce's
type FormFieldProps = {
  type?: string;
  title: string;
  state: string;
  placeholder: string;
  isTextArea?: boolean;
  setState: (value: string) => void;
};

const FormField: FC<FormFieldProps> = ({
  type,
  title,
  state,
  placeholder,
  isTextArea,
  setState,
}: FormFieldProps) => {
  return (
    <div className="flexStart flex-col w-full gap-2">
      <label htmlFor="" className="w-full text-gray-100">
        {title}
      </label>
      {isTextArea ? (
        <textarea
          placeholder={placeholder}
          value={state}
          required
          className="form_field-input"
          onChange={(e) => setState(e.target.value)}
        />
      ) : (
        <input
          placeholder={placeholder}
          value={state}
          required
          className="form_field-input"
          onChange={(e) => setState(e.target.value)}
        />
      )}
    </div>
  );
};

export default FormField;
