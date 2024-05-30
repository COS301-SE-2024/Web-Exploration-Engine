import { Module } from '@nestjs/common';
import { ImagesService } from './scraping.service';
import { ImagesController } from './scraping.controller';
/**
 * Module for handling scraping-related functionality.
 */
@Module({
    providers: [ImagesService],
    controllers: [ImagesController],
})
export class ImagesModule {}
