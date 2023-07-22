import { GraphQLFloat, GraphQLInputObjectType, GraphQLString } from 'graphql';

export const userInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
