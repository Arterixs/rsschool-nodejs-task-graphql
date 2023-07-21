import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { profiles } from './profiles.js';
import { posts } from './posts.js';
import { prismaCopy } from '../index.js';

export const userType = new GraphQLObjectType({
  name: 'users',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
    profile: {
      type: profiles,
      resolve(parent: { id: string }) {
        return prismaCopy.profile.findUnique({
          where: { userId: parent.id },
        });
      },
    },
    posts: {
      type: new GraphQLList(posts),
      resolve(parent: { id: string }) {
        return prismaCopy.post.findMany({
          where: { authorId: parent.id },
        });
      },
    },
  }),
});
