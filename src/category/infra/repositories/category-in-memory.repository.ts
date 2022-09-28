import { Category } from '#category/domain/entities/category';
import { CategoryRepository } from '#category/domain/repositories/category.repository';
import { InMemorySearchableRepository } from '#shared/domain/repositories/in-memory.repository';
import { SortDirection } from '#shared/domain/repositories/repository-contracts';

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository
{
  sortableFields: string[] = ['name', 'created_at'];

  protected async applyFilter(
    items: Category[],
    filter: CategoryRepository.Filter
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) =>
      item.props.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  protected async applySort(
    items: Category[],
    sort: string | null,
    sort_dir: SortDirection | null
  ): Promise<Category[]> {
    return super.applySort(items, sort ?? 'created_at', sort_dir);
  }
}
