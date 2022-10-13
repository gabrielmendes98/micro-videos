export class SequelizeModelFactory {
  constructor(private model, private factoryProps: () => any) {}

  async create(data?) {
    return this.model.create(data ?? this.factoryProps());
  }

  async bulkCreate() {}

  make() {}

  bulkMake() {}
}
