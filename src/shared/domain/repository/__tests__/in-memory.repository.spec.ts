import { Entity } from 'shared/domain/entity/entity';
import { NotFoundError } from 'shared/domain/errors/not-found.error';
import { UniqueEntityId } from 'shared/domain/value-objects/unique-entity-id.vo';
import { InMemoryRepository } from '../in-memory.repository';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit tests', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  it('should insert a new entity', async () => {
    const entity = new StubEntity({ name: 'bla bla', price: 10 });
    await repository.insert(entity);
    expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  test('findById should throw error when entity not found', () => {
    expect(repository.findById('fake id')).rejects.toThrow(
      new NotFoundError('Entity not found using ID fake id')
    );

    expect(
      repository.findById(
        new UniqueEntityId('dd2d887b-6403-4519-add4-81575076e105')
      )
    ).rejects.toThrow(
      new NotFoundError(
        `Entity not found using ID dd2d887b-6403-4519-add4-81575076e105`
      )
    );
  });

  it('should find a entity by id', async () => {
    const entity = new StubEntity({ name: 'bla bla', price: 10 });
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entityFound.toJSON()).toStrictEqual(entity.toJSON());

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entityFound.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should return all entities', async () => {
    const entity = new StubEntity({ name: 'bla bla', price: 10 });
    await repository.insert(entity);

    const entities = await repository.findAll();
    expect(entities).toStrictEqual([entity]);
  });

  test('update should throw error when entity not found', () => {
    const entity = new StubEntity({ name: 'bla bla', price: 10 });

    expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it('should update an entity', async () => {
    const entity = new StubEntity({ name: 'bla bla', price: 10 });
    await repository.insert(entity);

    const newEntity = new StubEntity(
      { name: 'name updated', price: 2 },
      entity.uniqueEntityId
    );

    await repository.update(newEntity);
    expect(newEntity).toStrictEqual(repository.items[0]);
  });

  test('delete should throw error when entity not found', () => {
    expect(repository.delete('fake id')).rejects.toThrow(
      new NotFoundError('Entity not found using ID fake id')
    );

    expect(
      repository.delete(
        new UniqueEntityId('dd2d887b-6403-4519-add4-81575076e105')
      )
    ).rejects.toThrow(
      new NotFoundError(
        `Entity not found using ID dd2d887b-6403-4519-add4-81575076e105`
      )
    );
  });

  it('should delete an entity', async () => {
    const entity = new StubEntity({ name: 'bla bla', price: 10 });
    await repository.insert(entity);

    await repository.delete(entity.id);
    expect(repository.items).toHaveLength(0);

    await repository.insert(entity);
    await repository.delete(entity.uniqueEntityId);
    expect(repository.items).toHaveLength(0);
  });
});
