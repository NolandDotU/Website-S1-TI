import { success } from "zod";

export class ApiResponse<T = any> {
  constructor(
    public success: boolean,
    public statusCode: number,
    public message: string,
    public data?: T,
    public meta?: any
  ) {}

  static success<T>(
    data: T,
    message = "Success",
    statusCode = 200,
    meta?: any
  ) {
    return new ApiResponse(true, statusCode, message, data, meta);
  }

  static error(message: string, statusCode = 500, errors?: any[]) {
    return {
      success: false,
      statusCode,
      message,
      errors,
    };
  }

  static paginated<T>(
    data: T,
    page: number,
    limit: number,
    total: number,
    message = "Data fetched successfully"
  ) {
    return new ApiResponse(true, 200, message, {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  }
}
