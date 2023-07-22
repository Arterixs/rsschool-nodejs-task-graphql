import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt } from 'graphql';
import { memberEnum } from '../memberTypes.js';
import { UUIDType } from '../../types/uuid.js';

export const profileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: memberEnum },
    userId: { type: UUIDType },
  }),
});
