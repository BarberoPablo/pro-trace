export type NativeMouseEvent = React.MouseEvent<HTMLCanvasElement, MouseEvent>;

export type Shape = "square";

export type ShapeInformation = {
  dimensions: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  draw: (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, strokeColor: string) => void;
};

export type ShapeDetails = {
  type: Shape;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};
