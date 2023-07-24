import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { profiles } from './profiles.js';
import { Context, Id } from '../types/interface.js';

export const memberEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: 'basic',
    },
    business: {
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
      resolve(parent: Id, _args, { prisma }: Context) {
        return prisma.profile.findMany({
          where: { memberTypeId: parent.id },
        });
      },
    },
  }),
});
