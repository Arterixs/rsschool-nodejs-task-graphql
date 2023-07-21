import { GraphQLObjectType, GraphQLBoolean, GraphQLInt } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { memberTypeEnum } from './memberTypes.js';

export const profiles = new GraphQLObjectType({
  name: 'profiles',
  fields: () => ({
    id: {
      type: UUIDType,
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
      type: memberTypeEnum,
    },
  }),
});
