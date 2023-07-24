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
import { Context, Id } from '../types/interface.js';
import DataLoader from 'dataloader';

export const userType: GraphQLObjectType<Id, Context> = new GraphQLObjectType({
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
      resolve: async (parent: Id, _args, context: Context, info) => {
        const { dataLoaders, prisma } = context;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let dl: DataLoader<string, unknown, string> = dataLoaders.get(info.fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const profiles = await prisma.profile.findMany({
              where: { userId: { in: ids as string[] } },
              include: {
                memberType: true,
              },
            });
            const sortedInIdsOrder = ids.map((id) =>
              profiles.find((profile) => profile.userId === id),
            );
            return sortedInIdsOrder;
          });
          dataLoaders.set(info.fieldNodes, dl);
        }
        return await dl.load(parent.id);
      },
    },
    posts: {
      type: new GraphQLList(new GraphQLNonNull(posts)),
      resolve: async (parent: Id, _args, context: Context, info) => {
        const { dataLoaders, prisma } = context;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let dl: DataLoader<string, unknown, string> = dataLoaders.get(info.fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const posts = await prisma.post.findMany({
              where: { authorId: { in: ids as string[] } },
            });
            const sortedInIdsOrder = ids.map((id) =>
              posts.filter((post) => post.authorId === id),
            );
            return sortedInIdsOrder;
          });
          dataLoaders.set(info.fieldNodes, dl);
        }
        return await dl.load(parent.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (parent: Id, _args, context: Context, info) => {
        const { dataLoaders, prisma } = context;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let dl: DataLoader<string, unknown, string> = dataLoaders.get(info.fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const users = await prisma.user.findMany({
              where: {
                subscribedToUser: {
                  some: {
                    subscriberId: { in: ids as string[] },
                  },
                },
              },
              include: {
                subscribedToUser: true,
              },
            });
            const sortedInIdsOrder = ids.map((id) =>
              users.filter((user) =>
                user.subscribedToUser.find((subs) => subs.subscriberId === id),
              ),
            );
            return sortedInIdsOrder;
          });
          dataLoaders.set(info.fieldNodes, dl);
        }
        return await dl.load(parent.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (parent: Id, _args, context: Context, info) => {
        const { dataLoaders, prisma } = context;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let dl: DataLoader<string, unknown, string> = dataLoaders.get(info.fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const users = await prisma.user.findMany({
              where: {
                userSubscribedTo: {
                  some: {
                    authorId: { in: ids as string[] },
                  },
                },
              },
              include: {
                userSubscribedTo: true,
              },
            });
            const sortedInIdsOrder = ids.map((id) =>
              users.filter((user) =>
                user.userSubscribedTo.find((subs) => subs.authorId === id),
              ),
            );
            return sortedInIdsOrder;
          });
          dataLoaders.set(info.fieldNodes, dl);
        }
        return await dl.load(parent.id);
      },
    },
  }),
});
