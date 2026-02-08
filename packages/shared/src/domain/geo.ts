export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface GeoPlace extends GeoPoint {
  address?: string;
  placeId?: string;
}
