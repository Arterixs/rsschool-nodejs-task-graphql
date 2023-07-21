import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, Source, GraphQLSchema, GraphQLObjectType } from 'graphql';
import { member, memberEnum } from './schemas/memberTypes.js';
import { getQueryTypes } from './schemas/query.js';
import { posts } from './schemas/posts.js';
import { profiles } from './schemas/profiles.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  const storage = getQueryTypes(prisma);
  const queryType = storage.get(1) as GraphQLObjectType<any, any>;
  const userType = storage.get(2) as GraphQLObjectType<
    {
      id: string;
    },
    any
  >;

  const schema = new GraphQLSchema({
    query: queryType,
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

      return await graphql({
        schema,
        source,
        variableValues: variables,
      });
    },
  });
};

export default plugin;
