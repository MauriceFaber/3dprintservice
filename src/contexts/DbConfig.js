export const DBConfig = {
  name: "MyDB",
  version: 1,
  objectStoresMeta: [
    {
      store: "shoppingCart",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "cart_data", keypath: "cart_data", options: { unique: false } },
        // { name: "name", keypath: "name", options: { unique: false } },
        // { name: "email", keypath: "email", options: { unique: false } },
      ],
    },
  ],
};
