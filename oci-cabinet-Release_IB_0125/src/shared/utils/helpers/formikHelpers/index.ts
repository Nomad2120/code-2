export const getFormikHelper = (formik: any, tt: any) => {
  const helper = (name: string) => {
    const { touched, errors } = formik;

    return touched[name] && errors[name] && tt(errors[name].toString());
  };

  return helper;
};
export const getHelperText = (formik: any, name: string, tt: any) => {
  const { touched, errors } = formik;

  return touched.name && errors.name && tt(errors.name.toString());
};
