import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, Source, GraphQLSchema, validate, parse } from 'graphql';
import { member, memberEnum } from './schemas/memberTypes.js';
import { posts } from './schemas/posts.js';
import { profiles } from './schemas/profiles.js';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library.js';
import { userType } from './schemas/users.js';
import { queryType } from './schemas/query.js';
import { mutationType } from './schemas/mutation.js';
import depthLimit from 'graphql-depth-limit';

export let prismaCopy = {} as PrismaClient<
  Prisma.PrismaClientOptions,
  never,
  DefaultArgs
>;

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  prismaCopy = prisma;

  const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType,
    types: [member, memberEnum, posts, userType, profiles],
  });

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const source = new Source(query);
      const errors = validate(schema, parse(query), [depthLimit(5)]);
      if (errors.length) {
        return { errors };
      }
      return await graphql({
        schema,
        source,
        variableValues: variables,
      });
    },
  });
};

export default plugin;
