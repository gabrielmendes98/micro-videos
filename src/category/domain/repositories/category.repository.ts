import {
  RepositoryInterface,
  SearchableRepositoryInterface,
} from 'shared/domain/repositories/repository-contracts';
import { Category } from '../entities/category';

export interface CategoryRepository
  extends SearchableRepositoryInterface<Category, any, any> {}
