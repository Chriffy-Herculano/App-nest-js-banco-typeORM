import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { getPhoto } from '../testing/get-photo.mock';

describe('FileService', () => {
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    //Extraindo o FileService do module
    fileService = module.get<FileService>(FileService);
  });

  test('Validar a definição', () => {
    expect(fileService).toBeDefined();
  });

  describe('Teste do File Service', () => {
    test('upload method', async () => {
      const photo = await getPhoto();
      const filename = 'photo-teste.png';

      fileService.upload(photo, filename);
    });
  });
});
