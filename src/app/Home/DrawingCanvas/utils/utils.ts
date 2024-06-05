import { Shape, ShapeInformation } from "@/utils/types";

export const shapes: { [shape in Shape]: ShapeInformation } = {
  square: {
    dimensions: {
      x: 0,
      y: 0,
      width: 200,
      height: 200,
    },
    //color: "red",
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
    },
  },
};
