import { GraphQLObjectType, GraphQLBoolean, GraphQLInt, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { member, memberEnum } from './memberTypes.js';
import { userType } from './users.js';

export const profiles: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: 'profiles',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    userId: {
      type: UUIDType,
    },
    memberTypeId: {
      type: memberEnum,
    },
    memberType: {
      type: member,
    },
    user: {
      type: userType,
    },
  }),
});
