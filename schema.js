const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

// customer type
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    age: {type: GraphQLInt},
  })
});

// root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: {type: GraphQLString},
      },
      async resolve(parent, args) {
        const customerRequest = await axios.get('http://localhost:3000/customers/' + args.id);
        return customerRequest.data;
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      async resolve(parent, args) {
        try {
          const customersRequest = await axios.get('http://localhost:3000/customers');
          return customersRequest.data;
        } catch (error) {
          throw error;
        }
      }
    }
  }
});

// mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)},
      },
      async resolve(parent, args) {
        try {
          const { name, email, age } = args;
          const addCustomerRequest = await axios.post(
            'http://localhost:3000/customers',
            {
              name,
              email,
              age
            }
          );
          return addCustomerRequest.data;
        } catch (error) {
          throw error;
        }
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)},
      },
      async resolve(parent, args) {
        try {
          const { id } = args;
          const deleteCustomerRequest = await axios.delete('http://localhost:3000/customers/' + id);
          return deleteCustomerRequest.data;
        } catch (error) {
          throw error;
        }
      }
    },
    editCustomer: {
      type: CustomerType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt},
      },
      async resolve(parent, args) {
        try {
          const { id } = args;
          const editCustomerRequest = await axios.patch('http://localhost:3000/customers/' + id, args);
          return editCustomerRequest.data;
        } catch (error) {
          throw error;
        }
      }
    },
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
