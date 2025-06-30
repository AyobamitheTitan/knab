import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, _: ArgumentsHost) {
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    let message: string | string[];
    let code: string;

    if (typeof errorResponse === 'string') {
      message = errorResponse;
      code = exception.constructor.name;
    } else if (typeof errorResponse === 'object' && errorResponse !== null) {
      message = (errorResponse as any).message || 'An error occurred';
      code = (errorResponse as any).error || exception.constructor.name;
    } else {
      message = 'Internal server error';
      code = 'INTERNAL_SERVER_ERROR';
    }

    return new ApolloError(message as string, code.toUpperCase(), {
      statusCode: status,
    });
  }
}
