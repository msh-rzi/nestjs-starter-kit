import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('exchange')
@Controller({
  path: 'exchange',
  version: '1',
})
export class ExchangeController {
  constructor() {}
}
