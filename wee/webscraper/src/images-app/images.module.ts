import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
/**
 * Module for handling scraping-related functionality.
 */
@Module({
    providers: [ImagesService],
    controllers: [ImagesController],
})
export class ImagesModule {}
