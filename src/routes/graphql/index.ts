import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, Source, GraphQLSchema } from 'graphql';
import { member, memberTypeEnum } from './schemas/memberTypes.js';
import { getQueryTypes } from './schemas/query.js';
import { posts } from './schemas/posts.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  const queryType = getQueryTypes(prisma);

  const schema = new GraphQLSchema({
    query: queryType,
    types: [member, memberTypeEnum, posts],
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

      return await graphql({
        schema,
        source,
        variableValues: variables,
      });
    },
  });
};

export default plugin;
