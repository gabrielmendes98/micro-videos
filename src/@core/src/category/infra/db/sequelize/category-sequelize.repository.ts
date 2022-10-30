import { Category, CategoryRepository } from '#category/domain';
import { NotFoundError, UniqueEntityId } from '#shared/domain';
import { Op } from 'sequelize';
import { CategoryModel } from './category-model';
import { CategoryModelMapper } from './category-model-mapper';

export class CategorySequelizeRepository
  implements CategoryRepository.Repository
{
  sortableFields: string[] = ['name', 'created_at'];

  constructor(private categoryModel: typeof CategoryModel) {}

  async search(
    searchParams: CategoryRepository.SearchParams,
  ): Promise<CategoryRepository.SearchResult> {
    const limit = searchParams.per_page;
    const offset = (searchParams.page - 1) * limit;

    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(searchParams.filter && {
        where: { name: { [Op.like]: `%${searchParams.filter}%` } },
      }),
      ...(searchParams.sort && this.sortableFields.includes(searchParams.sort)
        ? { order: [[searchParams.sort, searchParams.sort_dir]] }
        : { order: [['created_at', 'DESC']] }),
      offset,
      limit,
    });

    return new CategoryRepository.SearchResult({
      items: models.map((m) => CategoryModelMapper.toEntity(m)),
      current_page: searchParams.page,
      per_page: searchParams.per_page,
      total: count,
      filter: searchParams.filter,
      sort: searchParams.sort,
      sort_dir: searchParams.sort_dir,
    });
  }

  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create(entity.toJSON());
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(entities.map((e) => e.toJSON()));
  }

  async findById(id: string | UniqueEntityId): Promise<Category> {
    const model = await this._get(id.toString());
    return CategoryModelMapper.toEntity(model);
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map((model) => CategoryModelMapper.toEntity(model));
  }

  async update(entity: Category): Promise<void> {
    await this._get(entity.id);
    await this.categoryModel.update(entity.toJSON(), {
      where: { id: entity.id },
    });
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    const _id = id.toString();
    await this._get(_id);
    await this.categoryModel.destroy({ where: { id: _id } });
  }

  private async _get(id: string): Promise<CategoryModel> {
    const model = await this.categoryModel.findByPk(id, {
      rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`),
    });
    return model;
  }
}
