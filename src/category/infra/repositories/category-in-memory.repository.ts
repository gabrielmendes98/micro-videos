import { Category } from 'category/domain/entities/category';
import { CategoryRepository } from 'category/domain/repositories/category.repository';
import { InMemorySearchableRepository } from 'shared/domain/repositories/in-memory.repository';

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository {}
