export class CreateShipDto {
  hud: string;
  name: string;
  type: string;
  crew?: number;
  passengers?: number;
  fighters?: number;
}
