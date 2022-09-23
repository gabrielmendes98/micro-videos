import { Entity } from '../entity/entity';
import { UniqueEntityId } from '../value-objects/unique-entity-id.vo';

export interface RepositoryInterface<E extends Entity> {
  insert(entity: E): Promise<void>;
  findById(id: string | UniqueEntityId): Promise<E>;
  findAll(): Promise<E[]>;
  update(entity: E): Promise<void>;
  delete(id: string | UniqueEntityId): Promise<void>;
}

export type SortDirection = 'asc' | 'desc';

// this is a value object
export type SearchProps<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams<Filter = string> {
  protected _page: number = 1;
  protected _per_page: number = 15;
  protected _sort: string | null = null;
  protected _sort_dir: SortDirection | null = null;
  protected _filter: Filter | null = null;

  constructor(props: SearchProps = {}) {
    this.page = props.page;
    this.per_page = props.per_page;
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter as Filter | null | undefined;
  }

  get page(): number {
    return this._page;
  }

  private set page(value: number | undefined) {
    let _page = Number(value);

    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = this._page;
    }

    this._page = _page;
  }

  get per_page(): number {
    return this._per_page;
  }

  private set per_page(value: number | undefined) {
    let _per_page = Number.parseFloat(String(value));

    if (
      Number.isNaN(_per_page) ||
      _per_page <= 0 ||
      parseInt(String(_per_page)) !== _per_page
    ) {
      _per_page = this._per_page;
    }

    this._per_page = _per_page;
  }

  get sort(): string | null {
    return this._sort;
  }

  private set sort(value: string | null | undefined) {
    this._sort =
      value === null || value === undefined || value === ''
        ? null
        : String(value);
  }

  get sort_dir(): SortDirection | null {
    return this._sort_dir;
  }

  private set sort_dir(value: string | null | undefined) {
    if (!this.sort) {
      this._sort_dir = null;
      return;
    }
    const dir = String(value).toLowerCase();
    this._sort_dir = dir !== 'asc' && dir !== 'desc' ? 'asc' : dir;
  }

  get filter(): Filter | null {
    return this._filter;
  }

  private set filter(value: Filter | null | undefined) {
    this._filter =
      value === null || value === undefined || value === ''
        ? null
        : (String(value) as Filter);
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchOutput,
  SearchInput = SearchParams
> extends RepositoryInterface<E> {
  search(searchParams: SearchInput): Promise<SearchOutput>;
}
