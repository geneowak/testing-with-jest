import Model from '../model';

function createModel(data = [], options = {}) {
  return new Model({
    ...options,
    data,
  });
}
test('can be instantiated', () => {
  expect(createModel()).toBeInstanceOf(Model);
});

test('model structure', () => {
  expect(createModel()).toEqual(
    expect.objectContaining({
      $collection: expect.any(Array),
      $options: expect.objectContaining({ primaryKey: 'id' }),
      record: expect.any(Function),
      all: expect.any(Function),
      find: expect.any(Function),
      update: expect.any(Function),
      remove: expect.any(Function),
    }),
  );
});

describe('customizations', () => {
  test('can customize the primary key', () => {
    const model = createModel([], { primaryKey: 'name' });
    expect(model.$options.primaryKey).toBe('name');
  });
});

describe('record', () => {
  const data = [{ id: 1, name: 'Batman' }, { name: 'Green Arrow' }];

  test('can add data to the collection', () => {
    const model = createModel();
    model.record(data);
    expect(model.$collection).toEqual([
      data[0],
      {
        id: expect.any(Number),
        name: data[1].name,
      },
    ]);
  });

  test('gets called when data is passed to Model', () => {
    const spy = jest.spyOn(Model.prototype, 'record');
    createModel(data);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('all', () => {
  test('returns empty array when there is no data', () => {
    const model = createModel();
    expect(model.all()).toEqual([]);
  });

  const data = [{ name: 'Batman' }, { name: 'Green Arrow' }];

  test('it returns all the data in the collection', () => {
    const model = createModel(data);
    expect(model.all()).toEqual(data);
  });

  test('original data remains intact', () => {
    const model = createModel(data);
    const info = model.all();
    info[0].name = 'hero';

    expect(model.$collection[0].name).toBe('Batman');
  });
});

describe('find', () => {
  const heroes = [
    { id: 1, name: 'Batman' },
    { id: 2, name: 'Green Arrow' },
  ];

  test('returns null if nothing matches', () => {
    const model = createModel();
    expect(model.find('Batman')).toEqual(null);
  });

  test('find returns a matching entry', () => {
    const model = createModel(heroes);
    expect(model.find(2)).toEqual(heroes[1]);
  });
});

describe('update', () => {
  const heroesAndVillains = [{ id: 1, name: 'Riddler' }];
  let model;

  beforeEach(() => {
    const dataset = JSON.parse(JSON.stringify(heroesAndVillains));
    model = createModel(dataset);
  });

  test('an entry by id', () => {
    model.update(1, { name: 'Clay Face' });
    expect(model.find(1).name).toBe('Clay Face');
  });

  test('extend an entry by id', () => {
    model.update(1, { cape: false });
    expect(model.find(1)).toEqual(
      expect.objectContaining({
        name: 'Riddler',
        cape: false,
      }),
    );
  });

  test('return false if no entry matches', () => {
    expect(model.update(2, {})).toBe(false);
  });
});

describe('remove', () => {
  const xMen = [
    { id: 1, name: 'Ice Man' },
    { id: 2, name: 'Wolverine' },
  ];
  let model;

  beforeEach(() => {
    const dataset = JSON.parse(JSON.stringify(xMen));
    model = createModel(dataset);
  });

  test('removes item by id', () => {
    model.remove(1);
    expect(model.$collection.length).toBe(1);
    expect(model.find(1)).toBe(null);
  });
});
