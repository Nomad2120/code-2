export const instantValidate = (formik: any): void => {
  formik.validateForm().then((errors: any) => {
    Object.keys(errors).forEach((key) => {
      formik.setFieldTouched(key, true, true);
    });
  });
};
