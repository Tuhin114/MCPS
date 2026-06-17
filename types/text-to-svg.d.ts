declare module "text-to-svg" {
  interface TextToSVGOptions {
    fontSize?: number;
    x?: number;
    y?: number;
    anchor?: string;
  }

  class TextToSVG {
    static loadSync(path?: string): TextToSVG;

    getD(text: string, options?: TextToSVGOptions): string;
  }

  export = TextToSVG;
}
