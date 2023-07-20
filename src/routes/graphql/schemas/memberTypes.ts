import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';

export const memberTypeEnum = new GraphQLEnumType({
  name: 'memberTypeEnum',
  values: {
    BASIC: {
      value: 'basic',
    },
    BUSINESS: {
      value: 'business',
    },
  },
});

export const member = new GraphQLObjectType({
  name: 'member',
  fields: () => ({
    id: {
      type: memberTypeEnum,
    },
    discount: {
      type: GraphQLFloat,
    },
    postsLimitPerMonth: {
      type: GraphQLInt,
    },
  }),
});
