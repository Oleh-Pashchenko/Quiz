import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class StatusResponse {
  @ApiProperty()
  status: HttpStatus;
}

export class ArrayDataResponse<T> extends StatusResponse {
  @ApiProperty({ isArray: true })
  data: T;

  @ApiProperty()
  amount: number;
}

export class DataResponse<T> extends StatusResponse {
  @ApiProperty()
  data: T;

  @ApiProperty()
  status: HttpStatus;
}

export class MessageResponse extends StatusResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  status: HttpStatus;
}
