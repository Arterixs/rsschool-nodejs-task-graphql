import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { profiles } from './profiles.js';
import { prismaCopy } from '../index.js';

export const memberEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: 'basic',
    },
    businnes: {
      value: 'business',
    },
  },
});

export const member = new GraphQLObjectType({
  name: 'member',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(memberEnum),
    },
    discount: {
      type: GraphQLFloat,
    },
    postsLimitPerMonth: {
      type: GraphQLInt,
    },
    profiles: {
      type: new GraphQLList(profiles),
      resolve(parent: { id: string }) {
        return prismaCopy.profile.findMany({
          where: { memberTypeId: parent.id },
        });
      },
    },
  }),
});
