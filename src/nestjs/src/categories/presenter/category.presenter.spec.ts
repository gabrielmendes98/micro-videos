import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './category.presenter';
import { instanceToPlain } from 'class-transformer';
import { Category } from 'core/category/domain';
import { PaginationPresenter } from 'src/@shared/presenters/pagination.presenter';

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

describe('CategoryCollectionPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const category = Category.fake().aCategory().build();
      const presenter = new CategoryCollectionPresenter({
        items: [category],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
      expect(presenter.meta).toEqual(
        new PaginationPresenter({
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        }),
      );
      expect(presenter.data).toStrictEqual([new CategoryPresenter(category)]);
    });
  });

  test('presenter data', () => {
    const category = Category.fake().aCategory().build();
    let presenter = new CategoryCollectionPresenter({
      items: [category],
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      data: [
        {
          ...category.toJSON(),
          created_at: category.created_at.toISOString(),
        },
      ],
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
    });

    presenter = new CategoryCollectionPresenter({
      items: [category],
      current_page: '1' as any,
      per_page: '2' as any,
      last_page: '3' as any,
      total: '4' as any,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
      data: [
        {
          ...category.toJSON(),
          created_at: category.created_at.toISOString(),
        },
      ],
    });
  });
});
