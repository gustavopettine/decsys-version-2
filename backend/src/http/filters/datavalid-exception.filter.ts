import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'
import { getDatavalidError } from '../../utils/datavalidErrors'

@Catch()
export class DatavalidExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    // Trata erros específicos do Datavalid
    if (error.response?.status === 422) {
      const errorCode = error.response.data.code
      const errorDetails = getDatavalidError(errorCode)

      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        error: errorDetails,
        timestamp: new Date().toISOString(),
      })
    }

    // Trata outros erros HTTP
    if (error instanceof HttpException) {
      const status = error.getStatus()
      return response.status(status).json({
        success: false,
        error: {
          message: error.message,
          statusCode: status,
        },
        timestamp: new Date().toISOString(),
      })
    }

    // Trata erros internos não esperados
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        message: 'Internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      timestamp: new Date().toISOString(),
    })
  }
}
