export class SequelizeModelFactory {
  private _count = 1;

  constructor(private model, private factoryProps: () => any) {}

  count(count: number) {
    this._count = count;
    return this;
  }

  async create(data?) {
    return this.model.create(data ?? this.factoryProps());
  }

  async bulkCreate(factoryProps?: (index: number) => any) {
    const data = new Array(this._count)
      .fill(factoryProps ?? this.factoryProps)
      .map((factory, index) => factory(index));
    return this.model.bulkCreate(data);
  }

  make(data?) {
    return this.model.build(data ?? this.factoryProps());
  }

  bulkMake(factoryProps?: (index: number) => any) {
    const data = new Array(this._count)
      .fill(factoryProps ?? this.factoryProps)
      .map((factory, index) => factory(index));
    return this.model.bulkBuild(data);
  }
}
