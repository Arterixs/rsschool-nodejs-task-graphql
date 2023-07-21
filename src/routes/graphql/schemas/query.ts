import { GraphQLList, GraphQLObjectType } from 'graphql';
import { member, memberEnum } from './memberTypes.js';
import { UUIDType } from '../types/uuid.js';
import { posts } from './posts.js';
import { userType } from './users.js';
import { profiles } from './profiles.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { prismaCopy } from '../index.js';

export const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(member),
      resolve: async (_parent) => {
        return await prismaCopy.memberType.findMany();
      },
    },
    memberType: {
      type: member,
      args: {
        id: {
          type: memberEnum,
        },
      },
      resolve: async (_parent, args: { id: MemberTypeId }) => {
        return await prismaCopy.memberType.findUnique({
          where: { id: args.id },
        });
      },
    },
    posts: {
      type: new GraphQLList(posts),
      resolve: async (_source) => {
        return await prismaCopy.post.findMany();
      },
    },
    post: {
      type: posts,
      args: {
        id: {
          type: UUIDType,
        },
      },
      resolve: async (_parent, args: { id: string }) => {
        return await prismaCopy.post.findUnique({
          where: { id: args.id },
        });
      },
    },
    users: {
      type: new GraphQLList(userType),
      resolve: async (_source) => {
        return await prismaCopy.user.findMany();
      },
    },
    user: {
      type: userType,
      args: {
        id: {
          type: UUIDType,
        },
      },
      resolve: async (_parent, args: { id: string }) => {
        return await prismaCopy.user.findUnique({
          where: { id: args.id },
        });
      },
    },
    profiles: {
      type: new GraphQLList(profiles),
      resolve: async (_source) => {
        return await prismaCopy.profile.findMany();
      },
    },
    profile: {
      type: profiles,
      args: {
        id: {
          type: UUIDType,
        },
      },
      resolve: async (_parent, args: { id: string }) => {
        return await prismaCopy.profile.findUnique({
          where: { id: args.id },
          include: {
            user: true,
            memberType: true,
          },
        });
      },
    },
  }),
});
