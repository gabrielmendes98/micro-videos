import { Entity } from '../entity/entity';
import { NotFoundError } from '../errors/not-found.error';
import { UniqueEntityId } from '../value-objects/unique-entity-id.vo';
import {
  RepositoryInterface,
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
} from './repository-contracts';

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
  }

  async findById(id: string | UniqueEntityId): Promise<E> {
    return this._get(id.toString());
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id); // check if exists
    const indexFound = this.items.findIndex((item) => item.id === entity.id);
    this.items[indexFound] = entity;
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    await this._get(id.toString()); // check if exists
    const indexFound = this.items.findIndex(
      (item) => item.id === id.toString(),
    );
    this.items.splice(indexFound, 1);
  }

  protected async _get(id: string): Promise<E> {
    const item = this.items.find((item) => item.id === id.toString());
    if (!item) {
      throw new NotFoundError(`Entity not found using ID ${id}`);
    }
    return item;
  }
}

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E>
{
  sortableFields: string[] = [];

  async search(searchParams: SearchParams): Promise<SearchResult<E>> {
    const filteredItems = await this.applyFilter(
      this.items,
      searchParams.filter,
    );
    const sortedItems = await this.applySort(
      filteredItems,
      searchParams.sort,
      searchParams.sort_dir,
    );
    const paginatedItems = await this.applyPaginate(
      sortedItems,
      searchParams.page,
      searchParams.per_page,
    );

    return new SearchResult({
      items: paginatedItems,
      total: filteredItems.length,
      current_page: searchParams.page,
      per_page: searchParams.per_page,
      sort: searchParams.sort,
      sort_dir: searchParams.sort_dir,
      filter: searchParams.filter,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: SearchParams['filter'],
  ): Promise<E[]>;

  protected async applySort(
    items: E[],
    sort: SearchParams['sort'],
    sort_dir: SearchParams['sort_dir'],
  ): Promise<E[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    const sorted = [...items].sort((a, b) => {
      if (a.props[sort] < b.props[sort]) {
        return sort_dir === 'asc' ? -1 : 1;
      }

      if (a.props[sort] > b.props[sort]) {
        return sort_dir === 'asc' ? 1 : -1;
      }

      return 0;
    });

    return sorted;
  }

  protected async applyPaginate(
    items: E[],
    page: SearchParams['page'],
    per_page: SearchParams['per_page'],
  ): Promise<E[]> {
    const start = ((page || 1) - 1) * per_page;
    const limit = start + per_page;
    return items.slice(start, limit);
  }
}
