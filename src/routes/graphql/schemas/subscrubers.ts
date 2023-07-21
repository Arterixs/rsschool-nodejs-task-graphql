import { GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { userType } from './users.js';

export const SubscribersOnAuthors = new GraphQLObjectType({
  name: 'SubscribersOnAuthors',
  fields: () => ({
    subscriber: {
      type: userType,
    },
    subscriberId: {
      type: UUIDType,
    },
    author: {
      type: userType,
    },
    authorId: {
      type: UUIDType,
    },
  }),
});

export const subscribedToUser = new GraphQLObjectType({
  name: 'subscribedToUser',
  fields: () => ({
    subscriber: {
      type: userType,
    },
    subscriberId: {
      type: UUIDType,
    },
    author: {
      type: userType,
    },
    authorId: {
      type: UUIDType,
    },
  }),
});
