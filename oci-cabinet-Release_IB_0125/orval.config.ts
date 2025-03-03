module.exports = {
  osi: {
    input: {
      target: 'http://10.1.1.125:5656/swagger/v1/swagger.json',
      override: {
        transformer: 'src/shared/api/transformer.js'
      }
    },
    output: {
      mode: 'tags-split',
      target: 'src/shared/api/orval/api.ts',
      schemas: 'src/shared/api/orval/models',
      client: 'react-query',
      mock: false,
      prettier: true,
      clean: true,
      override: {
        mutator: {
          path: 'src/shared/api/reactQuery.ts',
          name: 'axiosForReactQueryInstance'
        }
      }
    }
  }
};
