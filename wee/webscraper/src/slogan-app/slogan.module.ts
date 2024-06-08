import { Module } from '@nestjs/common';
import { SloganController } from './slogan.controller';
import { SloganService } from './slogan.service';

@Module({
    controllers: [SloganController],
    providers: [SloganService],
})
export class SloganModule {}