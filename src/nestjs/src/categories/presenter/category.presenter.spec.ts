import { CategoryPresenter } from './category.presenter';
import { instanceToPlain } from 'class-transformer';

describe('CategoryPresenter unit tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const id = 'dd2d887b-6403-4519-add4-81575076e105';
      const presenter = new CategoryPresenter({
        created_at,
        description: 'some desc',
        id,
        is_active: true,
        name: 'some name',
      });

      expect(presenter.id).toBe(id);
      expect(presenter.name).toBe('some name');
      expect(presenter.description).toBe('some desc');
      expect(presenter.is_active).toBe(true);
      expect(presenter.created_at).toBe(created_at);
    });

    test('presenter data', () => {
      const created_at = new Date();
      const presenter = new CategoryPresenter({
        id: 'dd2d887b-6403-4519-add4-81575076e105',
        name: 'some name',
        description: 'some desc',
        is_active: true,
        created_at,
      });

      const data = instanceToPlain(presenter);
      expect(data).toStrictEqual({
        id: 'dd2d887b-6403-4519-add4-81575076e105',
        name: 'some name',
        description: 'some desc',
        is_active: true,
        created_at: created_at.toISOString(),
      });
    });
  });
});
