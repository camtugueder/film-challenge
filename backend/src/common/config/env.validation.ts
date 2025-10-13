import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Required environment variables
  OMDB_API_KEY: Joi.string().required().messages({
    'any.required': 'OMDB_API_KEY is required. Get your free API key at https://www.omdbapi.com/apikey.aspx',
    'string.empty': 'OMDB_API_KEY cannot be empty',
  }),

  // Optional environment variables with defaults
  PORT: Joi.number().default(3001).messages({
    'number.base': 'PORT must be a number',
  }),

  FRONTEND_URL: Joi.string().default('http://localhost:3000').messages({
    'string.base': 'FRONTEND_URL must be a string',
  }),

  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development')
    .messages({
      'any.only': 'NODE_ENV must be one of: development, production, test',
    }),
});
