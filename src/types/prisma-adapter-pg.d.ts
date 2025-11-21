declare module "@prisma/adapter-pg" {
  export class PrismaPg {
    constructor(options?: { connectionString?: string } | any, settings?: any);
  }
  export default PrismaPg;
}
