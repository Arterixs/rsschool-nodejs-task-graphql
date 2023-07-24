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
        let dl = dataLoaders.get(info.fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const rows = await prisma.profile.findMany({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              where: { userId: { in: ids as string[] } },
              include: {
                memberType: true,
              },
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const sortedInIdsOrder = ids.map((id) => rows.find((x) => x.userId === id));
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return sortedInIdsOrder;
          });
          dataLoaders.set(info.fieldNodes, dl);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        return await dl.load(parent.id);
      },
    },
    posts: {
      type: new GraphQLList(new GraphQLNonNull(posts)),
      resolve: async (parent: Id, _args, context: Context, info) => {
        const { dataLoaders, prisma } = context;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let dl = dataLoaders.get(info.fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const rows = await prisma.post.findMany({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              where: { authorId: { in: ids as string[] } },
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const sortedInIdsOrder = ids.map((id) =>
              rows.filter((x) => x.authorId === id),
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return sortedInIdsOrder;
          });
          dataLoaders.set(info.fieldNodes, dl);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        return await dl.load(parent.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (parent: Id, _args, context: Context, info) => {
        const { dataLoaders, prisma } = context;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let dl = dataLoaders.get(info.fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const rows = await prisma.user.findMany({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const sortedInIdsOrder = ids.map((id) =>
              rows.filter((x) =>
                x.subscribedToUser.find((subs) => subs.subscriberId === id),
              ),
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return sortedInIdsOrder;
          });
          dataLoaders.set(info.fieldNodes, dl);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        return await dl.load(parent.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (parent: Id, _args, context: Context, info) => {
        const { dataLoaders, prisma } = context;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let dl = dataLoaders.get(info.fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const rows = await prisma.user.findMany({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const sortedInIdsOrder = ids.map((id) =>
              rows.filter((x) => x.userSubscribedTo.find((subs) => subs.authorId === id)),
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return sortedInIdsOrder;
          });
          dataLoaders.set(info.fieldNodes, dl);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        return await dl.load(parent.id);
      },
    },
  }),
});
