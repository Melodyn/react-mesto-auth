import { useState } from 'react';

export const useForm = (initValues = {}) => {
  const [values, setValues] = useState(initValues);

  const processValues = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  return [values, processValues, setValues];
};
