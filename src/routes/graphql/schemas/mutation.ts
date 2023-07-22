import { GraphQLObjectType } from 'graphql';
import { posts } from './posts.js';
import { prismaCopy } from '../index.js';
import { userType } from './users.js';
import { profiles } from './profiles.js';
import { PostCreate, ProfileCreate, UserCreate } from '../types/interface.js';
import { postInput } from './mutations/post.js';
import { userInput } from './mutations/user.js';
import { profileInput } from './mutations/profile.js';

export const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: posts,
      args: {
        dto: { type: postInput },
      },
      resolve: async (_parent, args: PostCreate) => {
        return await prismaCopy.post.create({ data: { ...args.dto } });
      },
    },
    createUser: {
      type: userType,
      args: {
        dto: { type: userInput },
      },
      resolve: async (_parent, args: UserCreate) => {
        return await prismaCopy.user.create({ data: { ...args.dto } });
      },
    },
    createProfile: {
      type: profiles,
      args: {
        dto: { type: profileInput },
      },
      resolve: async (_parent, args: ProfileCreate) => {
        return await prismaCopy.profile.create({ data: { ...args.dto } });
      },
    },
  },
});
