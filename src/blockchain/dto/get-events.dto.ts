import { ApiProperty } from '@nestjs/swagger';

// src/blockchain/dto/get-events.dto.ts
export class GetEventsDto {
  @ApiProperty({
    description: 'The starting block number to fetch events from',
    example: '100',
    // Tadi tertulis: (sudah benar tapi pastikan koma di atasnya ada)
  })
  fromBlock: number; // Tadi tertulis: frobtBlock

  @ApiProperty({
    description: 'The ending block number to fetch events to',
    example: '200', // Tadi tertulis: xample
  })
  toBlock: number;
}
