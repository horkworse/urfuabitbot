import * as fs from 'fs';

class PropertyProvider{
  private _data: object;
  private readonly _token: string;
  private _baseUrl: string;


  get token(): string {
    return this._token;
  }

  get baseUrl(): string{
    return this._baseUrl;
  }

  constructor() {
    this._data = this.readProperty();
    // @ts-ignore
    this._token = this._data.ConnectionStrings.token;
    // @ts-ignore
    this._baseUrl = this._data.ConnectionStrings.url;
  }

  private readProperty(): object {
    const rawData = fs.readFileSync("./src/VKHandler/property.json");
    return JSON.parse(rawData.toString());
  }
}


module.exports = PropertyProvider;
