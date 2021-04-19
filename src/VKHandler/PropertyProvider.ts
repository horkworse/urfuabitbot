import * as fs from 'fs';

class PropertyProvider{
  private _data: Object;
  private readonly _token: string;


  get token(): string {
    return this._token;
  }

  constructor() {
    this._data = this.readProperty();
    this._token = this._data.ConnectionStrings.token;
  }

  private readProperty(): object {
    const rawData = fs.readFileSync("./src/VKHandler/property.json");
    return JSON.parse(rawData.toString());
  }
}

module.exports = PropertyProvider;
