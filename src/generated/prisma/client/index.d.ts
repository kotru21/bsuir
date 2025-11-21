
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model SurveySubmission
 * 
 */
export type SurveySubmission = $Result.DefaultSelection<Prisma.$SurveySubmissionPayload>
/**
 * Model RecommendationSnapshot
 * 
 */
export type RecommendationSnapshot = $Result.DefaultSelection<Prisma.$RecommendationSnapshotPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model SportSection
 * 
 */
export type SportSection = $Result.DefaultSelection<Prisma.$SportSectionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Gender: {
  male: 'male',
  female: 'female',
  unspecified: 'unspecified'
};

export type Gender = (typeof Gender)[keyof typeof Gender]


export const FitnessLevel: {
  low: 'low',
  medium: 'medium',
  high: 'high'
};

export type FitnessLevel = (typeof FitnessLevel)[keyof typeof FitnessLevel]


export const TrainingFormat: {
  individual: 'individual',
  group: 'group',
  mixed: 'mixed'
};

export type TrainingFormat = (typeof TrainingFormat)[keyof typeof TrainingFormat]


export const GoalTag: {
  strength: 'strength',
  endurance: 'endurance',
  flexibility: 'flexibility',
  teamwork: 'teamwork',
  martialArts: 'martialArts',
  ballSports: 'ballSports',
  aquatic: 'aquatic',
  dance: 'dance',
  coordination: 'coordination',
  rehabilitation: 'rehabilitation',
  weightManagement: 'weightManagement',
  aesthetics: 'aesthetics',
  competition: 'competition'
};

export type GoalTag = (typeof GoalTag)[keyof typeof GoalTag]


export const ContactLevel: {
  nonContact: 'nonContact',
  lightContact: 'lightContact',
  fullContact: 'fullContact'
};

export type ContactLevel = (typeof ContactLevel)[keyof typeof ContactLevel]

}

export type Gender = $Enums.Gender

export const Gender: typeof $Enums.Gender

export type FitnessLevel = $Enums.FitnessLevel

export const FitnessLevel: typeof $Enums.FitnessLevel

export type TrainingFormat = $Enums.TrainingFormat

export const TrainingFormat: typeof $Enums.TrainingFormat

export type GoalTag = $Enums.GoalTag

export const GoalTag: typeof $Enums.GoalTag

export type ContactLevel = $Enums.ContactLevel

export const ContactLevel: typeof $Enums.ContactLevel

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more SurveySubmissions
 * const surveySubmissions = await prisma.surveySubmission.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more SurveySubmissions
   * const surveySubmissions = await prisma.surveySubmission.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.surveySubmission`: Exposes CRUD operations for the **SurveySubmission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SurveySubmissions
    * const surveySubmissions = await prisma.surveySubmission.findMany()
    * ```
    */
  get surveySubmission(): Prisma.SurveySubmissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.recommendationSnapshot`: Exposes CRUD operations for the **RecommendationSnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RecommendationSnapshots
    * const recommendationSnapshots = await prisma.recommendationSnapshot.findMany()
    * ```
    */
  get recommendationSnapshot(): Prisma.RecommendationSnapshotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sportSection`: Exposes CRUD operations for the **SportSection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SportSections
    * const sportSections = await prisma.sportSection.findMany()
    * ```
    */
  get sportSection(): Prisma.SportSectionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.0.0
   * Query Engine version: 0c19ccc313cf9911a90d99d2ac2eb0280c76c513
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    SurveySubmission: 'SurveySubmission',
    RecommendationSnapshot: 'RecommendationSnapshot',
    Session: 'Session',
    SportSection: 'SportSection'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "surveySubmission" | "recommendationSnapshot" | "session" | "sportSection"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      SurveySubmission: {
        payload: Prisma.$SurveySubmissionPayload<ExtArgs>
        fields: Prisma.SurveySubmissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SurveySubmissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SurveySubmissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>
          }
          findFirst: {
            args: Prisma.SurveySubmissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SurveySubmissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>
          }
          findMany: {
            args: Prisma.SurveySubmissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>[]
          }
          create: {
            args: Prisma.SurveySubmissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>
          }
          createMany: {
            args: Prisma.SurveySubmissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SurveySubmissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>[]
          }
          delete: {
            args: Prisma.SurveySubmissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>
          }
          update: {
            args: Prisma.SurveySubmissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>
          }
          deleteMany: {
            args: Prisma.SurveySubmissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SurveySubmissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SurveySubmissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>[]
          }
          upsert: {
            args: Prisma.SurveySubmissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>
          }
          aggregate: {
            args: Prisma.SurveySubmissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSurveySubmission>
          }
          groupBy: {
            args: Prisma.SurveySubmissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SurveySubmissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SurveySubmissionCountArgs<ExtArgs>
            result: $Utils.Optional<SurveySubmissionCountAggregateOutputType> | number
          }
        }
      }
      RecommendationSnapshot: {
        payload: Prisma.$RecommendationSnapshotPayload<ExtArgs>
        fields: Prisma.RecommendationSnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RecommendationSnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationSnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RecommendationSnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationSnapshotPayload>
          }
          findFirst: {
            args: Prisma.RecommendationSnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationSnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RecommendationSnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationSnapshotPayload>
          }
          findMany: {
            args: Prisma.RecommendationSnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationSnapshotPayload>[]
          }
          create: {
            args: Prisma.RecommendationSnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationSnapshotPayload>
          }
          createMany: {
            args: Prisma.RecommendationSnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RecommendationSnapshotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationSnapshotPayload>[]
          }
          delete: {
            args: Prisma.RecommendationSnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationSnapshotPayload>
          }
          update: {
            args: Prisma.RecommendationSnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationSnapshotPayload>
          }
          deleteMany: {
            args: Prisma.RecommendationSnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RecommendationSnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RecommendationSnapshotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationSnapshotPayload>[]
          }
          upsert: {
            args: Prisma.RecommendationSnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationSnapshotPayload>
          }
          aggregate: {
            args: Prisma.RecommendationSnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRecommendationSnapshot>
          }
          groupBy: {
            args: Prisma.RecommendationSnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<RecommendationSnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.RecommendationSnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<RecommendationSnapshotCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      SportSection: {
        payload: Prisma.$SportSectionPayload<ExtArgs>
        fields: Prisma.SportSectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SportSectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SportSectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SportSectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SportSectionPayload>
          }
          findFirst: {
            args: Prisma.SportSectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SportSectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SportSectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SportSectionPayload>
          }
          findMany: {
            args: Prisma.SportSectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SportSectionPayload>[]
          }
          create: {
            args: Prisma.SportSectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SportSectionPayload>
          }
          createMany: {
            args: Prisma.SportSectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SportSectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SportSectionPayload>[]
          }
          delete: {
            args: Prisma.SportSectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SportSectionPayload>
          }
          update: {
            args: Prisma.SportSectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SportSectionPayload>
          }
          deleteMany: {
            args: Prisma.SportSectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SportSectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SportSectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SportSectionPayload>[]
          }
          upsert: {
            args: Prisma.SportSectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SportSectionPayload>
          }
          aggregate: {
            args: Prisma.SportSectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSportSection>
          }
          groupBy: {
            args: Prisma.SportSectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SportSectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SportSectionCountArgs<ExtArgs>
            result: $Utils.Optional<SportSectionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    surveySubmission?: SurveySubmissionOmit
    recommendationSnapshot?: RecommendationSnapshotOmit
    session?: SessionOmit
    sportSection?: SportSectionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type SurveySubmissionCountOutputType
   */

  export type SurveySubmissionCountOutputType = {
    recommendations: number
  }

  export type SurveySubmissionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    recommendations?: boolean | SurveySubmissionCountOutputTypeCountRecommendationsArgs
  }

  // Custom InputTypes
  /**
   * SurveySubmissionCountOutputType without action
   */
  export type SurveySubmissionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmissionCountOutputType
     */
    select?: SurveySubmissionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SurveySubmissionCountOutputType without action
   */
  export type SurveySubmissionCountOutputTypeCountRecommendationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecommendationSnapshotWhereInput
  }


  /**
   * Models
   */

  /**
   * Model SurveySubmission
   */

  export type AggregateSurveySubmission = {
    _count: SurveySubmissionCountAggregateOutputType | null
    _avg: SurveySubmissionAvgAggregateOutputType | null
    _sum: SurveySubmissionSumAggregateOutputType | null
    _min: SurveySubmissionMinAggregateOutputType | null
    _max: SurveySubmissionMaxAggregateOutputType | null
  }

  export type SurveySubmissionAvgAggregateOutputType = {
    age: number | null
  }

  export type SurveySubmissionSumAggregateOutputType = {
    age: number | null
  }

  export type SurveySubmissionMinAggregateOutputType = {
    id: string | null
    telegramUserId: string | null
    chatId: string | null
    age: number | null
    gender: $Enums.Gender | null
    fitnessLevel: $Enums.FitnessLevel | null
    avoidContact: boolean | null
    interestedInCompetition: boolean | null
    aiSummary: string | null
    createdAt: Date | null
  }

  export type SurveySubmissionMaxAggregateOutputType = {
    id: string | null
    telegramUserId: string | null
    chatId: string | null
    age: number | null
    gender: $Enums.Gender | null
    fitnessLevel: $Enums.FitnessLevel | null
    avoidContact: boolean | null
    interestedInCompetition: boolean | null
    aiSummary: string | null
    createdAt: Date | null
  }

  export type SurveySubmissionCountAggregateOutputType = {
    id: number
    telegramUserId: number
    chatId: number
    age: number
    gender: number
    fitnessLevel: number
    preferredFormats: number
    desiredGoals: number
    avoidContact: number
    interestedInCompetition: number
    aiSummary: number
    createdAt: number
    _all: number
  }


  export type SurveySubmissionAvgAggregateInputType = {
    age?: true
  }

  export type SurveySubmissionSumAggregateInputType = {
    age?: true
  }

  export type SurveySubmissionMinAggregateInputType = {
    id?: true
    telegramUserId?: true
    chatId?: true
    age?: true
    gender?: true
    fitnessLevel?: true
    avoidContact?: true
    interestedInCompetition?: true
    aiSummary?: true
    createdAt?: true
  }

  export type SurveySubmissionMaxAggregateInputType = {
    id?: true
    telegramUserId?: true
    chatId?: true
    age?: true
    gender?: true
    fitnessLevel?: true
    avoidContact?: true
    interestedInCompetition?: true
    aiSummary?: true
    createdAt?: true
  }

  export type SurveySubmissionCountAggregateInputType = {
    id?: true
    telegramUserId?: true
    chatId?: true
    age?: true
    gender?: true
    fitnessLevel?: true
    preferredFormats?: true
    desiredGoals?: true
    avoidContact?: true
    interestedInCompetition?: true
    aiSummary?: true
    createdAt?: true
    _all?: true
  }

  export type SurveySubmissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SurveySubmission to aggregate.
     */
    where?: SurveySubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SurveySubmissions to fetch.
     */
    orderBy?: SurveySubmissionOrderByWithRelationInput | SurveySubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SurveySubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SurveySubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SurveySubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SurveySubmissions
    **/
    _count?: true | SurveySubmissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SurveySubmissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SurveySubmissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SurveySubmissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SurveySubmissionMaxAggregateInputType
  }

  export type GetSurveySubmissionAggregateType<T extends SurveySubmissionAggregateArgs> = {
        [P in keyof T & keyof AggregateSurveySubmission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSurveySubmission[P]>
      : GetScalarType<T[P], AggregateSurveySubmission[P]>
  }




  export type SurveySubmissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SurveySubmissionWhereInput
    orderBy?: SurveySubmissionOrderByWithAggregationInput | SurveySubmissionOrderByWithAggregationInput[]
    by: SurveySubmissionScalarFieldEnum[] | SurveySubmissionScalarFieldEnum
    having?: SurveySubmissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SurveySubmissionCountAggregateInputType | true
    _avg?: SurveySubmissionAvgAggregateInputType
    _sum?: SurveySubmissionSumAggregateInputType
    _min?: SurveySubmissionMinAggregateInputType
    _max?: SurveySubmissionMaxAggregateInputType
  }

  export type SurveySubmissionGroupByOutputType = {
    id: string
    telegramUserId: string | null
    chatId: string | null
    age: number
    gender: $Enums.Gender
    fitnessLevel: $Enums.FitnessLevel
    preferredFormats: $Enums.TrainingFormat[]
    desiredGoals: $Enums.GoalTag[]
    avoidContact: boolean
    interestedInCompetition: boolean
    aiSummary: string | null
    createdAt: Date
    _count: SurveySubmissionCountAggregateOutputType | null
    _avg: SurveySubmissionAvgAggregateOutputType | null
    _sum: SurveySubmissionSumAggregateOutputType | null
    _min: SurveySubmissionMinAggregateOutputType | null
    _max: SurveySubmissionMaxAggregateOutputType | null
  }

  type GetSurveySubmissionGroupByPayload<T extends SurveySubmissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SurveySubmissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SurveySubmissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SurveySubmissionGroupByOutputType[P]>
            : GetScalarType<T[P], SurveySubmissionGroupByOutputType[P]>
        }
      >
    >


  export type SurveySubmissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    telegramUserId?: boolean
    chatId?: boolean
    age?: boolean
    gender?: boolean
    fitnessLevel?: boolean
    preferredFormats?: boolean
    desiredGoals?: boolean
    avoidContact?: boolean
    interestedInCompetition?: boolean
    aiSummary?: boolean
    createdAt?: boolean
    recommendations?: boolean | SurveySubmission$recommendationsArgs<ExtArgs>
    _count?: boolean | SurveySubmissionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["surveySubmission"]>

  export type SurveySubmissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    telegramUserId?: boolean
    chatId?: boolean
    age?: boolean
    gender?: boolean
    fitnessLevel?: boolean
    preferredFormats?: boolean
    desiredGoals?: boolean
    avoidContact?: boolean
    interestedInCompetition?: boolean
    aiSummary?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["surveySubmission"]>

  export type SurveySubmissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    telegramUserId?: boolean
    chatId?: boolean
    age?: boolean
    gender?: boolean
    fitnessLevel?: boolean
    preferredFormats?: boolean
    desiredGoals?: boolean
    avoidContact?: boolean
    interestedInCompetition?: boolean
    aiSummary?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["surveySubmission"]>

  export type SurveySubmissionSelectScalar = {
    id?: boolean
    telegramUserId?: boolean
    chatId?: boolean
    age?: boolean
    gender?: boolean
    fitnessLevel?: boolean
    preferredFormats?: boolean
    desiredGoals?: boolean
    avoidContact?: boolean
    interestedInCompetition?: boolean
    aiSummary?: boolean
    createdAt?: boolean
  }

  export type SurveySubmissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "telegramUserId" | "chatId" | "age" | "gender" | "fitnessLevel" | "preferredFormats" | "desiredGoals" | "avoidContact" | "interestedInCompetition" | "aiSummary" | "createdAt", ExtArgs["result"]["surveySubmission"]>
  export type SurveySubmissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    recommendations?: boolean | SurveySubmission$recommendationsArgs<ExtArgs>
    _count?: boolean | SurveySubmissionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SurveySubmissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SurveySubmissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SurveySubmissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SurveySubmission"
    objects: {
      recommendations: Prisma.$RecommendationSnapshotPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      telegramUserId: string | null
      chatId: string | null
      age: number
      gender: $Enums.Gender
      fitnessLevel: $Enums.FitnessLevel
      preferredFormats: $Enums.TrainingFormat[]
      desiredGoals: $Enums.GoalTag[]
      avoidContact: boolean
      interestedInCompetition: boolean
      aiSummary: string | null
      createdAt: Date
    }, ExtArgs["result"]["surveySubmission"]>
    composites: {}
  }

  type SurveySubmissionGetPayload<S extends boolean | null | undefined | SurveySubmissionDefaultArgs> = $Result.GetResult<Prisma.$SurveySubmissionPayload, S>

  type SurveySubmissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SurveySubmissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SurveySubmissionCountAggregateInputType | true
    }

  export interface SurveySubmissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SurveySubmission'], meta: { name: 'SurveySubmission' } }
    /**
     * Find zero or one SurveySubmission that matches the filter.
     * @param {SurveySubmissionFindUniqueArgs} args - Arguments to find a SurveySubmission
     * @example
     * // Get one SurveySubmission
     * const surveySubmission = await prisma.surveySubmission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SurveySubmissionFindUniqueArgs>(args: SelectSubset<T, SurveySubmissionFindUniqueArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SurveySubmission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SurveySubmissionFindUniqueOrThrowArgs} args - Arguments to find a SurveySubmission
     * @example
     * // Get one SurveySubmission
     * const surveySubmission = await prisma.surveySubmission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SurveySubmissionFindUniqueOrThrowArgs>(args: SelectSubset<T, SurveySubmissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SurveySubmission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SurveySubmissionFindFirstArgs} args - Arguments to find a SurveySubmission
     * @example
     * // Get one SurveySubmission
     * const surveySubmission = await prisma.surveySubmission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SurveySubmissionFindFirstArgs>(args?: SelectSubset<T, SurveySubmissionFindFirstArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SurveySubmission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SurveySubmissionFindFirstOrThrowArgs} args - Arguments to find a SurveySubmission
     * @example
     * // Get one SurveySubmission
     * const surveySubmission = await prisma.surveySubmission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SurveySubmissionFindFirstOrThrowArgs>(args?: SelectSubset<T, SurveySubmissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SurveySubmissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SurveySubmissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SurveySubmissions
     * const surveySubmissions = await prisma.surveySubmission.findMany()
     * 
     * // Get first 10 SurveySubmissions
     * const surveySubmissions = await prisma.surveySubmission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const surveySubmissionWithIdOnly = await prisma.surveySubmission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SurveySubmissionFindManyArgs>(args?: SelectSubset<T, SurveySubmissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SurveySubmission.
     * @param {SurveySubmissionCreateArgs} args - Arguments to create a SurveySubmission.
     * @example
     * // Create one SurveySubmission
     * const SurveySubmission = await prisma.surveySubmission.create({
     *   data: {
     *     // ... data to create a SurveySubmission
     *   }
     * })
     * 
     */
    create<T extends SurveySubmissionCreateArgs>(args: SelectSubset<T, SurveySubmissionCreateArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SurveySubmissions.
     * @param {SurveySubmissionCreateManyArgs} args - Arguments to create many SurveySubmissions.
     * @example
     * // Create many SurveySubmissions
     * const surveySubmission = await prisma.surveySubmission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SurveySubmissionCreateManyArgs>(args?: SelectSubset<T, SurveySubmissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SurveySubmissions and returns the data saved in the database.
     * @param {SurveySubmissionCreateManyAndReturnArgs} args - Arguments to create many SurveySubmissions.
     * @example
     * // Create many SurveySubmissions
     * const surveySubmission = await prisma.surveySubmission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SurveySubmissions and only return the `id`
     * const surveySubmissionWithIdOnly = await prisma.surveySubmission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SurveySubmissionCreateManyAndReturnArgs>(args?: SelectSubset<T, SurveySubmissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SurveySubmission.
     * @param {SurveySubmissionDeleteArgs} args - Arguments to delete one SurveySubmission.
     * @example
     * // Delete one SurveySubmission
     * const SurveySubmission = await prisma.surveySubmission.delete({
     *   where: {
     *     // ... filter to delete one SurveySubmission
     *   }
     * })
     * 
     */
    delete<T extends SurveySubmissionDeleteArgs>(args: SelectSubset<T, SurveySubmissionDeleteArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SurveySubmission.
     * @param {SurveySubmissionUpdateArgs} args - Arguments to update one SurveySubmission.
     * @example
     * // Update one SurveySubmission
     * const surveySubmission = await prisma.surveySubmission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SurveySubmissionUpdateArgs>(args: SelectSubset<T, SurveySubmissionUpdateArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SurveySubmissions.
     * @param {SurveySubmissionDeleteManyArgs} args - Arguments to filter SurveySubmissions to delete.
     * @example
     * // Delete a few SurveySubmissions
     * const { count } = await prisma.surveySubmission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SurveySubmissionDeleteManyArgs>(args?: SelectSubset<T, SurveySubmissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SurveySubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SurveySubmissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SurveySubmissions
     * const surveySubmission = await prisma.surveySubmission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SurveySubmissionUpdateManyArgs>(args: SelectSubset<T, SurveySubmissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SurveySubmissions and returns the data updated in the database.
     * @param {SurveySubmissionUpdateManyAndReturnArgs} args - Arguments to update many SurveySubmissions.
     * @example
     * // Update many SurveySubmissions
     * const surveySubmission = await prisma.surveySubmission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SurveySubmissions and only return the `id`
     * const surveySubmissionWithIdOnly = await prisma.surveySubmission.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SurveySubmissionUpdateManyAndReturnArgs>(args: SelectSubset<T, SurveySubmissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SurveySubmission.
     * @param {SurveySubmissionUpsertArgs} args - Arguments to update or create a SurveySubmission.
     * @example
     * // Update or create a SurveySubmission
     * const surveySubmission = await prisma.surveySubmission.upsert({
     *   create: {
     *     // ... data to create a SurveySubmission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SurveySubmission we want to update
     *   }
     * })
     */
    upsert<T extends SurveySubmissionUpsertArgs>(args: SelectSubset<T, SurveySubmissionUpsertArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SurveySubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SurveySubmissionCountArgs} args - Arguments to filter SurveySubmissions to count.
     * @example
     * // Count the number of SurveySubmissions
     * const count = await prisma.surveySubmission.count({
     *   where: {
     *     // ... the filter for the SurveySubmissions we want to count
     *   }
     * })
    **/
    count<T extends SurveySubmissionCountArgs>(
      args?: Subset<T, SurveySubmissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SurveySubmissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SurveySubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SurveySubmissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SurveySubmissionAggregateArgs>(args: Subset<T, SurveySubmissionAggregateArgs>): Prisma.PrismaPromise<GetSurveySubmissionAggregateType<T>>

    /**
     * Group by SurveySubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SurveySubmissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SurveySubmissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SurveySubmissionGroupByArgs['orderBy'] }
        : { orderBy?: SurveySubmissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SurveySubmissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSurveySubmissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SurveySubmission model
   */
  readonly fields: SurveySubmissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SurveySubmission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SurveySubmissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    recommendations<T extends SurveySubmission$recommendationsArgs<ExtArgs> = {}>(args?: Subset<T, SurveySubmission$recommendationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecommendationSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SurveySubmission model
   */
  interface SurveySubmissionFieldRefs {
    readonly id: FieldRef<"SurveySubmission", 'String'>
    readonly telegramUserId: FieldRef<"SurveySubmission", 'String'>
    readonly chatId: FieldRef<"SurveySubmission", 'String'>
    readonly age: FieldRef<"SurveySubmission", 'Int'>
    readonly gender: FieldRef<"SurveySubmission", 'Gender'>
    readonly fitnessLevel: FieldRef<"SurveySubmission", 'FitnessLevel'>
    readonly preferredFormats: FieldRef<"SurveySubmission", 'TrainingFormat[]'>
    readonly desiredGoals: FieldRef<"SurveySubmission", 'GoalTag[]'>
    readonly avoidContact: FieldRef<"SurveySubmission", 'Boolean'>
    readonly interestedInCompetition: FieldRef<"SurveySubmission", 'Boolean'>
    readonly aiSummary: FieldRef<"SurveySubmission", 'String'>
    readonly createdAt: FieldRef<"SurveySubmission", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SurveySubmission findUnique
   */
  export type SurveySubmissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SurveySubmission
     */
    omit?: SurveySubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * Filter, which SurveySubmission to fetch.
     */
    where: SurveySubmissionWhereUniqueInput
  }

  /**
   * SurveySubmission findUniqueOrThrow
   */
  export type SurveySubmissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SurveySubmission
     */
    omit?: SurveySubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * Filter, which SurveySubmission to fetch.
     */
    where: SurveySubmissionWhereUniqueInput
  }

  /**
   * SurveySubmission findFirst
   */
  export type SurveySubmissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SurveySubmission
     */
    omit?: SurveySubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * Filter, which SurveySubmission to fetch.
     */
    where?: SurveySubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SurveySubmissions to fetch.
     */
    orderBy?: SurveySubmissionOrderByWithRelationInput | SurveySubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SurveySubmissions.
     */
    cursor?: SurveySubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SurveySubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SurveySubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SurveySubmissions.
     */
    distinct?: SurveySubmissionScalarFieldEnum | SurveySubmissionScalarFieldEnum[]
  }

  /**
   * SurveySubmission findFirstOrThrow
   */
  export type SurveySubmissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SurveySubmission
     */
    omit?: SurveySubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * Filter, which SurveySubmission to fetch.
     */
    where?: SurveySubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SurveySubmissions to fetch.
     */
    orderBy?: SurveySubmissionOrderByWithRelationInput | SurveySubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SurveySubmissions.
     */
    cursor?: SurveySubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SurveySubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SurveySubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SurveySubmissions.
     */
    distinct?: SurveySubmissionScalarFieldEnum | SurveySubmissionScalarFieldEnum[]
  }

  /**
   * SurveySubmission findMany
   */
  export type SurveySubmissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SurveySubmission
     */
    omit?: SurveySubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * Filter, which SurveySubmissions to fetch.
     */
    where?: SurveySubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SurveySubmissions to fetch.
     */
    orderBy?: SurveySubmissionOrderByWithRelationInput | SurveySubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SurveySubmissions.
     */
    cursor?: SurveySubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SurveySubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SurveySubmissions.
     */
    skip?: number
    distinct?: SurveySubmissionScalarFieldEnum | SurveySubmissionScalarFieldEnum[]
  }

  /**
   * SurveySubmission create
   */
  export type SurveySubmissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SurveySubmission
     */
    omit?: SurveySubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * The data needed to create a SurveySubmission.
     */
    data: XOR<SurveySubmissionCreateInput, SurveySubmissionUncheckedCreateInput>
  }

  /**
   * SurveySubmission createMany
   */
  export type SurveySubmissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SurveySubmissions.
     */
    data: SurveySubmissionCreateManyInput | SurveySubmissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SurveySubmission createManyAndReturn
   */
  export type SurveySubmissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SurveySubmission
     */
    omit?: SurveySubmissionOmit<ExtArgs> | null
    /**
     * The data used to create many SurveySubmissions.
     */
    data: SurveySubmissionCreateManyInput | SurveySubmissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SurveySubmission update
   */
  export type SurveySubmissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SurveySubmission
     */
    omit?: SurveySubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * The data needed to update a SurveySubmission.
     */
    data: XOR<SurveySubmissionUpdateInput, SurveySubmissionUncheckedUpdateInput>
    /**
     * Choose, which SurveySubmission to update.
     */
    where: SurveySubmissionWhereUniqueInput
  }

  /**
   * SurveySubmission updateMany
   */
  export type SurveySubmissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SurveySubmissions.
     */
    data: XOR<SurveySubmissionUpdateManyMutationInput, SurveySubmissionUncheckedUpdateManyInput>
    /**
     * Filter which SurveySubmissions to update
     */
    where?: SurveySubmissionWhereInput
    /**
     * Limit how many SurveySubmissions to update.
     */
    limit?: number
  }

  /**
   * SurveySubmission updateManyAndReturn
   */
  export type SurveySubmissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SurveySubmission
     */
    omit?: SurveySubmissionOmit<ExtArgs> | null
    /**
     * The data used to update SurveySubmissions.
     */
    data: XOR<SurveySubmissionUpdateManyMutationInput, SurveySubmissionUncheckedUpdateManyInput>
    /**
     * Filter which SurveySubmissions to update
     */
    where?: SurveySubmissionWhereInput
    /**
     * Limit how many SurveySubmissions to update.
     */
    limit?: number
  }

  /**
   * SurveySubmission upsert
   */
  export type SurveySubmissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SurveySubmission
     */
    omit?: SurveySubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * The filter to search for the SurveySubmission to update in case it exists.
     */
    where: SurveySubmissionWhereUniqueInput
    /**
     * In case the SurveySubmission found by the `where` argument doesn't exist, create a new SurveySubmission with this data.
     */
    create: XOR<SurveySubmissionCreateInput, SurveySubmissionUncheckedCreateInput>
    /**
     * In case the SurveySubmission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SurveySubmissionUpdateInput, SurveySubmissionUncheckedUpdateInput>
  }

  /**
   * SurveySubmission delete
   */
  export type SurveySubmissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SurveySubmission
     */
    omit?: SurveySubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * Filter which SurveySubmission to delete.
     */
    where: SurveySubmissionWhereUniqueInput
  }

  /**
   * SurveySubmission deleteMany
   */
  export type SurveySubmissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SurveySubmissions to delete
     */
    where?: SurveySubmissionWhereInput
    /**
     * Limit how many SurveySubmissions to delete.
     */
    limit?: number
  }

  /**
   * SurveySubmission.recommendations
   */
  export type SurveySubmission$recommendationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationSnapshot
     */
    select?: RecommendationSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecommendationSnapshot
     */
    omit?: RecommendationSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationSnapshotInclude<ExtArgs> | null
    where?: RecommendationSnapshotWhereInput
    orderBy?: RecommendationSnapshotOrderByWithRelationInput | RecommendationSnapshotOrderByWithRelationInput[]
    cursor?: RecommendationSnapshotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RecommendationSnapshotScalarFieldEnum | RecommendationSnapshotScalarFieldEnum[]
  }

  /**
   * SurveySubmission without action
   */
  export type SurveySubmissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SurveySubmission
     */
    omit?: SurveySubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
  }


  /**
   * Model RecommendationSnapshot
   */

  export type AggregateRecommendationSnapshot = {
    _count: RecommendationSnapshotCountAggregateOutputType | null
    _avg: RecommendationSnapshotAvgAggregateOutputType | null
    _sum: RecommendationSnapshotSumAggregateOutputType | null
    _min: RecommendationSnapshotMinAggregateOutputType | null
    _max: RecommendationSnapshotMaxAggregateOutputType | null
  }

  export type RecommendationSnapshotAvgAggregateOutputType = {
    score: number | null
    rank: number | null
  }

  export type RecommendationSnapshotSumAggregateOutputType = {
    score: number | null
    rank: number | null
  }

  export type RecommendationSnapshotMinAggregateOutputType = {
    id: string | null
    submissionId: string | null
    sectionId: string | null
    sectionName: string | null
    score: number | null
    rank: number | null
    createdAt: Date | null
  }

  export type RecommendationSnapshotMaxAggregateOutputType = {
    id: string | null
    submissionId: string | null
    sectionId: string | null
    sectionName: string | null
    score: number | null
    rank: number | null
    createdAt: Date | null
  }

  export type RecommendationSnapshotCountAggregateOutputType = {
    id: number
    submissionId: number
    sectionId: number
    sectionName: number
    score: number
    rank: number
    reasons: number
    createdAt: number
    _all: number
  }


  export type RecommendationSnapshotAvgAggregateInputType = {
    score?: true
    rank?: true
  }

  export type RecommendationSnapshotSumAggregateInputType = {
    score?: true
    rank?: true
  }

  export type RecommendationSnapshotMinAggregateInputType = {
    id?: true
    submissionId?: true
    sectionId?: true
    sectionName?: true
    score?: true
    rank?: true
    createdAt?: true
  }

  export type RecommendationSnapshotMaxAggregateInputType = {
    id?: true
    submissionId?: true
    sectionId?: true
    sectionName?: true
    score?: true
    rank?: true
    createdAt?: true
  }

  export type RecommendationSnapshotCountAggregateInputType = {
    id?: true
    submissionId?: true
    sectionId?: true
    sectionName?: true
    score?: true
    rank?: true
    reasons?: true
    createdAt?: true
    _all?: true
  }

  export type RecommendationSnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RecommendationSnapshot to aggregate.
     */
    where?: RecommendationSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecommendationSnapshots to fetch.
     */
    orderBy?: RecommendationSnapshotOrderByWithRelationInput | RecommendationSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RecommendationSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecommendationSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecommendationSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RecommendationSnapshots
    **/
    _count?: true | RecommendationSnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RecommendationSnapshotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RecommendationSnapshotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RecommendationSnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RecommendationSnapshotMaxAggregateInputType
  }

  export type GetRecommendationSnapshotAggregateType<T extends RecommendationSnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateRecommendationSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRecommendationSnapshot[P]>
      : GetScalarType<T[P], AggregateRecommendationSnapshot[P]>
  }




  export type RecommendationSnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecommendationSnapshotWhereInput
    orderBy?: RecommendationSnapshotOrderByWithAggregationInput | RecommendationSnapshotOrderByWithAggregationInput[]
    by: RecommendationSnapshotScalarFieldEnum[] | RecommendationSnapshotScalarFieldEnum
    having?: RecommendationSnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RecommendationSnapshotCountAggregateInputType | true
    _avg?: RecommendationSnapshotAvgAggregateInputType
    _sum?: RecommendationSnapshotSumAggregateInputType
    _min?: RecommendationSnapshotMinAggregateInputType
    _max?: RecommendationSnapshotMaxAggregateInputType
  }

  export type RecommendationSnapshotGroupByOutputType = {
    id: string
    submissionId: string
    sectionId: string
    sectionName: string
    score: number
    rank: number
    reasons: JsonValue | null
    createdAt: Date
    _count: RecommendationSnapshotCountAggregateOutputType | null
    _avg: RecommendationSnapshotAvgAggregateOutputType | null
    _sum: RecommendationSnapshotSumAggregateOutputType | null
    _min: RecommendationSnapshotMinAggregateOutputType | null
    _max: RecommendationSnapshotMaxAggregateOutputType | null
  }

  type GetRecommendationSnapshotGroupByPayload<T extends RecommendationSnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RecommendationSnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RecommendationSnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RecommendationSnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], RecommendationSnapshotGroupByOutputType[P]>
        }
      >
    >


  export type RecommendationSnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    sectionId?: boolean
    sectionName?: boolean
    score?: boolean
    rank?: boolean
    reasons?: boolean
    createdAt?: boolean
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recommendationSnapshot"]>

  export type RecommendationSnapshotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    sectionId?: boolean
    sectionName?: boolean
    score?: boolean
    rank?: boolean
    reasons?: boolean
    createdAt?: boolean
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recommendationSnapshot"]>

  export type RecommendationSnapshotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    sectionId?: boolean
    sectionName?: boolean
    score?: boolean
    rank?: boolean
    reasons?: boolean
    createdAt?: boolean
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recommendationSnapshot"]>

  export type RecommendationSnapshotSelectScalar = {
    id?: boolean
    submissionId?: boolean
    sectionId?: boolean
    sectionName?: boolean
    score?: boolean
    rank?: boolean
    reasons?: boolean
    createdAt?: boolean
  }

  export type RecommendationSnapshotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "submissionId" | "sectionId" | "sectionName" | "score" | "rank" | "reasons" | "createdAt", ExtArgs["result"]["recommendationSnapshot"]>
  export type RecommendationSnapshotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
  }
  export type RecommendationSnapshotIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
  }
  export type RecommendationSnapshotIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
  }

  export type $RecommendationSnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RecommendationSnapshot"
    objects: {
      submission: Prisma.$SurveySubmissionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      submissionId: string
      sectionId: string
      sectionName: string
      score: number
      rank: number
      reasons: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["recommendationSnapshot"]>
    composites: {}
  }

  type RecommendationSnapshotGetPayload<S extends boolean | null | undefined | RecommendationSnapshotDefaultArgs> = $Result.GetResult<Prisma.$RecommendationSnapshotPayload, S>

  type RecommendationSnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RecommendationSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RecommendationSnapshotCountAggregateInputType | true
    }

  export interface RecommendationSnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RecommendationSnapshot'], meta: { name: 'RecommendationSnapshot' } }
    /**
     * Find zero or one RecommendationSnapshot that matches the filter.
     * @param {RecommendationSnapshotFindUniqueArgs} args - Arguments to find a RecommendationSnapshot
     * @example
     * // Get one RecommendationSnapshot
     * const recommendationSnapshot = await prisma.recommendationSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RecommendationSnapshotFindUniqueArgs>(args: SelectSubset<T, RecommendationSnapshotFindUniqueArgs<ExtArgs>>): Prisma__RecommendationSnapshotClient<$Result.GetResult<Prisma.$RecommendationSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RecommendationSnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RecommendationSnapshotFindUniqueOrThrowArgs} args - Arguments to find a RecommendationSnapshot
     * @example
     * // Get one RecommendationSnapshot
     * const recommendationSnapshot = await prisma.recommendationSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RecommendationSnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, RecommendationSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RecommendationSnapshotClient<$Result.GetResult<Prisma.$RecommendationSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RecommendationSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationSnapshotFindFirstArgs} args - Arguments to find a RecommendationSnapshot
     * @example
     * // Get one RecommendationSnapshot
     * const recommendationSnapshot = await prisma.recommendationSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RecommendationSnapshotFindFirstArgs>(args?: SelectSubset<T, RecommendationSnapshotFindFirstArgs<ExtArgs>>): Prisma__RecommendationSnapshotClient<$Result.GetResult<Prisma.$RecommendationSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RecommendationSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationSnapshotFindFirstOrThrowArgs} args - Arguments to find a RecommendationSnapshot
     * @example
     * // Get one RecommendationSnapshot
     * const recommendationSnapshot = await prisma.recommendationSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RecommendationSnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, RecommendationSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__RecommendationSnapshotClient<$Result.GetResult<Prisma.$RecommendationSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RecommendationSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RecommendationSnapshots
     * const recommendationSnapshots = await prisma.recommendationSnapshot.findMany()
     * 
     * // Get first 10 RecommendationSnapshots
     * const recommendationSnapshots = await prisma.recommendationSnapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const recommendationSnapshotWithIdOnly = await prisma.recommendationSnapshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RecommendationSnapshotFindManyArgs>(args?: SelectSubset<T, RecommendationSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecommendationSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RecommendationSnapshot.
     * @param {RecommendationSnapshotCreateArgs} args - Arguments to create a RecommendationSnapshot.
     * @example
     * // Create one RecommendationSnapshot
     * const RecommendationSnapshot = await prisma.recommendationSnapshot.create({
     *   data: {
     *     // ... data to create a RecommendationSnapshot
     *   }
     * })
     * 
     */
    create<T extends RecommendationSnapshotCreateArgs>(args: SelectSubset<T, RecommendationSnapshotCreateArgs<ExtArgs>>): Prisma__RecommendationSnapshotClient<$Result.GetResult<Prisma.$RecommendationSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RecommendationSnapshots.
     * @param {RecommendationSnapshotCreateManyArgs} args - Arguments to create many RecommendationSnapshots.
     * @example
     * // Create many RecommendationSnapshots
     * const recommendationSnapshot = await prisma.recommendationSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RecommendationSnapshotCreateManyArgs>(args?: SelectSubset<T, RecommendationSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RecommendationSnapshots and returns the data saved in the database.
     * @param {RecommendationSnapshotCreateManyAndReturnArgs} args - Arguments to create many RecommendationSnapshots.
     * @example
     * // Create many RecommendationSnapshots
     * const recommendationSnapshot = await prisma.recommendationSnapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RecommendationSnapshots and only return the `id`
     * const recommendationSnapshotWithIdOnly = await prisma.recommendationSnapshot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RecommendationSnapshotCreateManyAndReturnArgs>(args?: SelectSubset<T, RecommendationSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecommendationSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RecommendationSnapshot.
     * @param {RecommendationSnapshotDeleteArgs} args - Arguments to delete one RecommendationSnapshot.
     * @example
     * // Delete one RecommendationSnapshot
     * const RecommendationSnapshot = await prisma.recommendationSnapshot.delete({
     *   where: {
     *     // ... filter to delete one RecommendationSnapshot
     *   }
     * })
     * 
     */
    delete<T extends RecommendationSnapshotDeleteArgs>(args: SelectSubset<T, RecommendationSnapshotDeleteArgs<ExtArgs>>): Prisma__RecommendationSnapshotClient<$Result.GetResult<Prisma.$RecommendationSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RecommendationSnapshot.
     * @param {RecommendationSnapshotUpdateArgs} args - Arguments to update one RecommendationSnapshot.
     * @example
     * // Update one RecommendationSnapshot
     * const recommendationSnapshot = await prisma.recommendationSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RecommendationSnapshotUpdateArgs>(args: SelectSubset<T, RecommendationSnapshotUpdateArgs<ExtArgs>>): Prisma__RecommendationSnapshotClient<$Result.GetResult<Prisma.$RecommendationSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RecommendationSnapshots.
     * @param {RecommendationSnapshotDeleteManyArgs} args - Arguments to filter RecommendationSnapshots to delete.
     * @example
     * // Delete a few RecommendationSnapshots
     * const { count } = await prisma.recommendationSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RecommendationSnapshotDeleteManyArgs>(args?: SelectSubset<T, RecommendationSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RecommendationSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RecommendationSnapshots
     * const recommendationSnapshot = await prisma.recommendationSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RecommendationSnapshotUpdateManyArgs>(args: SelectSubset<T, RecommendationSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RecommendationSnapshots and returns the data updated in the database.
     * @param {RecommendationSnapshotUpdateManyAndReturnArgs} args - Arguments to update many RecommendationSnapshots.
     * @example
     * // Update many RecommendationSnapshots
     * const recommendationSnapshot = await prisma.recommendationSnapshot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RecommendationSnapshots and only return the `id`
     * const recommendationSnapshotWithIdOnly = await prisma.recommendationSnapshot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RecommendationSnapshotUpdateManyAndReturnArgs>(args: SelectSubset<T, RecommendationSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecommendationSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RecommendationSnapshot.
     * @param {RecommendationSnapshotUpsertArgs} args - Arguments to update or create a RecommendationSnapshot.
     * @example
     * // Update or create a RecommendationSnapshot
     * const recommendationSnapshot = await prisma.recommendationSnapshot.upsert({
     *   create: {
     *     // ... data to create a RecommendationSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RecommendationSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends RecommendationSnapshotUpsertArgs>(args: SelectSubset<T, RecommendationSnapshotUpsertArgs<ExtArgs>>): Prisma__RecommendationSnapshotClient<$Result.GetResult<Prisma.$RecommendationSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RecommendationSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationSnapshotCountArgs} args - Arguments to filter RecommendationSnapshots to count.
     * @example
     * // Count the number of RecommendationSnapshots
     * const count = await prisma.recommendationSnapshot.count({
     *   where: {
     *     // ... the filter for the RecommendationSnapshots we want to count
     *   }
     * })
    **/
    count<T extends RecommendationSnapshotCountArgs>(
      args?: Subset<T, RecommendationSnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RecommendationSnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RecommendationSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RecommendationSnapshotAggregateArgs>(args: Subset<T, RecommendationSnapshotAggregateArgs>): Prisma.PrismaPromise<GetRecommendationSnapshotAggregateType<T>>

    /**
     * Group by RecommendationSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationSnapshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RecommendationSnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RecommendationSnapshotGroupByArgs['orderBy'] }
        : { orderBy?: RecommendationSnapshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RecommendationSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecommendationSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RecommendationSnapshot model
   */
  readonly fields: RecommendationSnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RecommendationSnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RecommendationSnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    submission<T extends SurveySubmissionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SurveySubmissionDefaultArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RecommendationSnapshot model
   */
  interface RecommendationSnapshotFieldRefs {
    readonly id: FieldRef<"RecommendationSnapshot", 'String'>
    readonly submissionId: FieldRef<"RecommendationSnapshot", 'String'>
    readonly sectionId: FieldRef<"RecommendationSnapshot", 'String'>
    readonly sectionName: FieldRef<"RecommendationSnapshot", 'String'>
    readonly score: FieldRef<"RecommendationSnapshot", 'Float'>
    readonly rank: FieldRef<"RecommendationSnapshot", 'Int'>
    readonly reasons: FieldRef<"RecommendationSnapshot", 'Json'>
    readonly createdAt: FieldRef<"RecommendationSnapshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RecommendationSnapshot findUnique
   */
  export type RecommendationSnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationSnapshot
     */
    select?: RecommendationSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecommendationSnapshot
     */
    omit?: RecommendationSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which RecommendationSnapshot to fetch.
     */
    where: RecommendationSnapshotWhereUniqueInput
  }

  /**
   * RecommendationSnapshot findUniqueOrThrow
   */
  export type RecommendationSnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationSnapshot
     */
    select?: RecommendationSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecommendationSnapshot
     */
    omit?: RecommendationSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which RecommendationSnapshot to fetch.
     */
    where: RecommendationSnapshotWhereUniqueInput
  }

  /**
   * RecommendationSnapshot findFirst
   */
  export type RecommendationSnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationSnapshot
     */
    select?: RecommendationSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecommendationSnapshot
     */
    omit?: RecommendationSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which RecommendationSnapshot to fetch.
     */
    where?: RecommendationSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecommendationSnapshots to fetch.
     */
    orderBy?: RecommendationSnapshotOrderByWithRelationInput | RecommendationSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RecommendationSnapshots.
     */
    cursor?: RecommendationSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecommendationSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecommendationSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecommendationSnapshots.
     */
    distinct?: RecommendationSnapshotScalarFieldEnum | RecommendationSnapshotScalarFieldEnum[]
  }

  /**
   * RecommendationSnapshot findFirstOrThrow
   */
  export type RecommendationSnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationSnapshot
     */
    select?: RecommendationSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecommendationSnapshot
     */
    omit?: RecommendationSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which RecommendationSnapshot to fetch.
     */
    where?: RecommendationSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecommendationSnapshots to fetch.
     */
    orderBy?: RecommendationSnapshotOrderByWithRelationInput | RecommendationSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RecommendationSnapshots.
     */
    cursor?: RecommendationSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecommendationSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecommendationSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecommendationSnapshots.
     */
    distinct?: RecommendationSnapshotScalarFieldEnum | RecommendationSnapshotScalarFieldEnum[]
  }

  /**
   * RecommendationSnapshot findMany
   */
  export type RecommendationSnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationSnapshot
     */
    select?: RecommendationSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecommendationSnapshot
     */
    omit?: RecommendationSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which RecommendationSnapshots to fetch.
     */
    where?: RecommendationSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecommendationSnapshots to fetch.
     */
    orderBy?: RecommendationSnapshotOrderByWithRelationInput | RecommendationSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RecommendationSnapshots.
     */
    cursor?: RecommendationSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecommendationSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecommendationSnapshots.
     */
    skip?: number
    distinct?: RecommendationSnapshotScalarFieldEnum | RecommendationSnapshotScalarFieldEnum[]
  }

  /**
   * RecommendationSnapshot create
   */
  export type RecommendationSnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationSnapshot
     */
    select?: RecommendationSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecommendationSnapshot
     */
    omit?: RecommendationSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationSnapshotInclude<ExtArgs> | null
    /**
     * The data needed to create a RecommendationSnapshot.
     */
    data: XOR<RecommendationSnapshotCreateInput, RecommendationSnapshotUncheckedCreateInput>
  }

  /**
   * RecommendationSnapshot createMany
   */
  export type RecommendationSnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RecommendationSnapshots.
     */
    data: RecommendationSnapshotCreateManyInput | RecommendationSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RecommendationSnapshot createManyAndReturn
   */
  export type RecommendationSnapshotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationSnapshot
     */
    select?: RecommendationSnapshotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RecommendationSnapshot
     */
    omit?: RecommendationSnapshotOmit<ExtArgs> | null
    /**
     * The data used to create many RecommendationSnapshots.
     */
    data: RecommendationSnapshotCreateManyInput | RecommendationSnapshotCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationSnapshotIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RecommendationSnapshot update
   */
  export type RecommendationSnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationSnapshot
     */
    select?: RecommendationSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecommendationSnapshot
     */
    omit?: RecommendationSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationSnapshotInclude<ExtArgs> | null
    /**
     * The data needed to update a RecommendationSnapshot.
     */
    data: XOR<RecommendationSnapshotUpdateInput, RecommendationSnapshotUncheckedUpdateInput>
    /**
     * Choose, which RecommendationSnapshot to update.
     */
    where: RecommendationSnapshotWhereUniqueInput
  }

  /**
   * RecommendationSnapshot updateMany
   */
  export type RecommendationSnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RecommendationSnapshots.
     */
    data: XOR<RecommendationSnapshotUpdateManyMutationInput, RecommendationSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which RecommendationSnapshots to update
     */
    where?: RecommendationSnapshotWhereInput
    /**
     * Limit how many RecommendationSnapshots to update.
     */
    limit?: number
  }

  /**
   * RecommendationSnapshot updateManyAndReturn
   */
  export type RecommendationSnapshotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationSnapshot
     */
    select?: RecommendationSnapshotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RecommendationSnapshot
     */
    omit?: RecommendationSnapshotOmit<ExtArgs> | null
    /**
     * The data used to update RecommendationSnapshots.
     */
    data: XOR<RecommendationSnapshotUpdateManyMutationInput, RecommendationSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which RecommendationSnapshots to update
     */
    where?: RecommendationSnapshotWhereInput
    /**
     * Limit how many RecommendationSnapshots to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationSnapshotIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RecommendationSnapshot upsert
   */
  export type RecommendationSnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationSnapshot
     */
    select?: RecommendationSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecommendationSnapshot
     */
    omit?: RecommendationSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationSnapshotInclude<ExtArgs> | null
    /**
     * The filter to search for the RecommendationSnapshot to update in case it exists.
     */
    where: RecommendationSnapshotWhereUniqueInput
    /**
     * In case the RecommendationSnapshot found by the `where` argument doesn't exist, create a new RecommendationSnapshot with this data.
     */
    create: XOR<RecommendationSnapshotCreateInput, RecommendationSnapshotUncheckedCreateInput>
    /**
     * In case the RecommendationSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RecommendationSnapshotUpdateInput, RecommendationSnapshotUncheckedUpdateInput>
  }

  /**
   * RecommendationSnapshot delete
   */
  export type RecommendationSnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationSnapshot
     */
    select?: RecommendationSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecommendationSnapshot
     */
    omit?: RecommendationSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationSnapshotInclude<ExtArgs> | null
    /**
     * Filter which RecommendationSnapshot to delete.
     */
    where: RecommendationSnapshotWhereUniqueInput
  }

  /**
   * RecommendationSnapshot deleteMany
   */
  export type RecommendationSnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RecommendationSnapshots to delete
     */
    where?: RecommendationSnapshotWhereInput
    /**
     * Limit how many RecommendationSnapshots to delete.
     */
    limit?: number
  }

  /**
   * RecommendationSnapshot without action
   */
  export type RecommendationSnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationSnapshot
     */
    select?: RecommendationSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecommendationSnapshot
     */
    omit?: RecommendationSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationSnapshotInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    key: string | null
    value: string | null
  }

  export type SessionMaxAggregateOutputType = {
    key: string | null
    value: string | null
  }

  export type SessionCountAggregateOutputType = {
    key: number
    value: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    key?: true
    value?: true
  }

  export type SessionMaxAggregateInputType = {
    key?: true
    value?: true
  }

  export type SessionCountAggregateInputType = {
    key?: true
    value?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    key: string
    value: string
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    key?: boolean
    value?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"key" | "value", ExtArgs["result"]["session"]>

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      key: string
      value: string
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `key`
     * const sessionWithKeyOnly = await prisma.session.findMany({ select: { key: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `key`
     * const sessionWithKeyOnly = await prisma.session.createManyAndReturn({
     *   select: { key: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `key`
     * const sessionWithKeyOnly = await prisma.session.updateManyAndReturn({
     *   select: { key: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly key: FieldRef<"Session", 'String'>
    readonly value: FieldRef<"Session", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
  }


  /**
   * Model SportSection
   */

  export type AggregateSportSection = {
    _count: SportSectionCountAggregateOutputType | null
    _min: SportSectionMinAggregateOutputType | null
    _max: SportSectionMaxAggregateOutputType | null
  }

  export type SportSectionMinAggregateOutputType = {
    id: string | null
    title: string | null
    summary: string | null
    format: $Enums.TrainingFormat | null
    contactLevel: $Enums.ContactLevel | null
    intensity: $Enums.FitnessLevel | null
    prerequisites: string | null
    imagePath: string | null
    locationHint: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SportSectionMaxAggregateOutputType = {
    id: string | null
    title: string | null
    summary: string | null
    format: $Enums.TrainingFormat | null
    contactLevel: $Enums.ContactLevel | null
    intensity: $Enums.FitnessLevel | null
    prerequisites: string | null
    imagePath: string | null
    locationHint: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SportSectionCountAggregateOutputType = {
    id: number
    title: number
    summary: number
    focus: number
    format: number
    contactLevel: number
    intensity: number
    recommendedFor: number
    expectedResults: number
    extraBenefits: number
    prerequisites: number
    imagePath: number
    locationHint: number
    similarityVector: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SportSectionMinAggregateInputType = {
    id?: true
    title?: true
    summary?: true
    format?: true
    contactLevel?: true
    intensity?: true
    prerequisites?: true
    imagePath?: true
    locationHint?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SportSectionMaxAggregateInputType = {
    id?: true
    title?: true
    summary?: true
    format?: true
    contactLevel?: true
    intensity?: true
    prerequisites?: true
    imagePath?: true
    locationHint?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SportSectionCountAggregateInputType = {
    id?: true
    title?: true
    summary?: true
    focus?: true
    format?: true
    contactLevel?: true
    intensity?: true
    recommendedFor?: true
    expectedResults?: true
    extraBenefits?: true
    prerequisites?: true
    imagePath?: true
    locationHint?: true
    similarityVector?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SportSectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SportSection to aggregate.
     */
    where?: SportSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SportSections to fetch.
     */
    orderBy?: SportSectionOrderByWithRelationInput | SportSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SportSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SportSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SportSections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SportSections
    **/
    _count?: true | SportSectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SportSectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SportSectionMaxAggregateInputType
  }

  export type GetSportSectionAggregateType<T extends SportSectionAggregateArgs> = {
        [P in keyof T & keyof AggregateSportSection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSportSection[P]>
      : GetScalarType<T[P], AggregateSportSection[P]>
  }




  export type SportSectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SportSectionWhereInput
    orderBy?: SportSectionOrderByWithAggregationInput | SportSectionOrderByWithAggregationInput[]
    by: SportSectionScalarFieldEnum[] | SportSectionScalarFieldEnum
    having?: SportSectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SportSectionCountAggregateInputType | true
    _min?: SportSectionMinAggregateInputType
    _max?: SportSectionMaxAggregateInputType
  }

  export type SportSectionGroupByOutputType = {
    id: string
    title: string
    summary: string
    focus: $Enums.GoalTag[]
    format: $Enums.TrainingFormat
    contactLevel: $Enums.ContactLevel
    intensity: $Enums.FitnessLevel
    recommendedFor: JsonValue
    expectedResults: JsonValue
    extraBenefits: string[]
    prerequisites: string | null
    imagePath: string | null
    locationHint: string | null
    similarityVector: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: SportSectionCountAggregateOutputType | null
    _min: SportSectionMinAggregateOutputType | null
    _max: SportSectionMaxAggregateOutputType | null
  }

  type GetSportSectionGroupByPayload<T extends SportSectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SportSectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SportSectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SportSectionGroupByOutputType[P]>
            : GetScalarType<T[P], SportSectionGroupByOutputType[P]>
        }
      >
    >


  export type SportSectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    summary?: boolean
    focus?: boolean
    format?: boolean
    contactLevel?: boolean
    intensity?: boolean
    recommendedFor?: boolean
    expectedResults?: boolean
    extraBenefits?: boolean
    prerequisites?: boolean
    imagePath?: boolean
    locationHint?: boolean
    similarityVector?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["sportSection"]>

  export type SportSectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    summary?: boolean
    focus?: boolean
    format?: boolean
    contactLevel?: boolean
    intensity?: boolean
    recommendedFor?: boolean
    expectedResults?: boolean
    extraBenefits?: boolean
    prerequisites?: boolean
    imagePath?: boolean
    locationHint?: boolean
    similarityVector?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["sportSection"]>

  export type SportSectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    summary?: boolean
    focus?: boolean
    format?: boolean
    contactLevel?: boolean
    intensity?: boolean
    recommendedFor?: boolean
    expectedResults?: boolean
    extraBenefits?: boolean
    prerequisites?: boolean
    imagePath?: boolean
    locationHint?: boolean
    similarityVector?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["sportSection"]>

  export type SportSectionSelectScalar = {
    id?: boolean
    title?: boolean
    summary?: boolean
    focus?: boolean
    format?: boolean
    contactLevel?: boolean
    intensity?: boolean
    recommendedFor?: boolean
    expectedResults?: boolean
    extraBenefits?: boolean
    prerequisites?: boolean
    imagePath?: boolean
    locationHint?: boolean
    similarityVector?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SportSectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "summary" | "focus" | "format" | "contactLevel" | "intensity" | "recommendedFor" | "expectedResults" | "extraBenefits" | "prerequisites" | "imagePath" | "locationHint" | "similarityVector" | "createdAt" | "updatedAt", ExtArgs["result"]["sportSection"]>

  export type $SportSectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SportSection"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      summary: string
      focus: $Enums.GoalTag[]
      format: $Enums.TrainingFormat
      contactLevel: $Enums.ContactLevel
      intensity: $Enums.FitnessLevel
      recommendedFor: Prisma.JsonValue
      expectedResults: Prisma.JsonValue
      extraBenefits: string[]
      prerequisites: string | null
      imagePath: string | null
      locationHint: string | null
      similarityVector: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["sportSection"]>
    composites: {}
  }

  type SportSectionGetPayload<S extends boolean | null | undefined | SportSectionDefaultArgs> = $Result.GetResult<Prisma.$SportSectionPayload, S>

  type SportSectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SportSectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SportSectionCountAggregateInputType | true
    }

  export interface SportSectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SportSection'], meta: { name: 'SportSection' } }
    /**
     * Find zero or one SportSection that matches the filter.
     * @param {SportSectionFindUniqueArgs} args - Arguments to find a SportSection
     * @example
     * // Get one SportSection
     * const sportSection = await prisma.sportSection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SportSectionFindUniqueArgs>(args: SelectSubset<T, SportSectionFindUniqueArgs<ExtArgs>>): Prisma__SportSectionClient<$Result.GetResult<Prisma.$SportSectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SportSection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SportSectionFindUniqueOrThrowArgs} args - Arguments to find a SportSection
     * @example
     * // Get one SportSection
     * const sportSection = await prisma.sportSection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SportSectionFindUniqueOrThrowArgs>(args: SelectSubset<T, SportSectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SportSectionClient<$Result.GetResult<Prisma.$SportSectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SportSection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SportSectionFindFirstArgs} args - Arguments to find a SportSection
     * @example
     * // Get one SportSection
     * const sportSection = await prisma.sportSection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SportSectionFindFirstArgs>(args?: SelectSubset<T, SportSectionFindFirstArgs<ExtArgs>>): Prisma__SportSectionClient<$Result.GetResult<Prisma.$SportSectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SportSection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SportSectionFindFirstOrThrowArgs} args - Arguments to find a SportSection
     * @example
     * // Get one SportSection
     * const sportSection = await prisma.sportSection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SportSectionFindFirstOrThrowArgs>(args?: SelectSubset<T, SportSectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SportSectionClient<$Result.GetResult<Prisma.$SportSectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SportSections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SportSectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SportSections
     * const sportSections = await prisma.sportSection.findMany()
     * 
     * // Get first 10 SportSections
     * const sportSections = await prisma.sportSection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sportSectionWithIdOnly = await prisma.sportSection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SportSectionFindManyArgs>(args?: SelectSubset<T, SportSectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SportSectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SportSection.
     * @param {SportSectionCreateArgs} args - Arguments to create a SportSection.
     * @example
     * // Create one SportSection
     * const SportSection = await prisma.sportSection.create({
     *   data: {
     *     // ... data to create a SportSection
     *   }
     * })
     * 
     */
    create<T extends SportSectionCreateArgs>(args: SelectSubset<T, SportSectionCreateArgs<ExtArgs>>): Prisma__SportSectionClient<$Result.GetResult<Prisma.$SportSectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SportSections.
     * @param {SportSectionCreateManyArgs} args - Arguments to create many SportSections.
     * @example
     * // Create many SportSections
     * const sportSection = await prisma.sportSection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SportSectionCreateManyArgs>(args?: SelectSubset<T, SportSectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SportSections and returns the data saved in the database.
     * @param {SportSectionCreateManyAndReturnArgs} args - Arguments to create many SportSections.
     * @example
     * // Create many SportSections
     * const sportSection = await prisma.sportSection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SportSections and only return the `id`
     * const sportSectionWithIdOnly = await prisma.sportSection.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SportSectionCreateManyAndReturnArgs>(args?: SelectSubset<T, SportSectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SportSectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SportSection.
     * @param {SportSectionDeleteArgs} args - Arguments to delete one SportSection.
     * @example
     * // Delete one SportSection
     * const SportSection = await prisma.sportSection.delete({
     *   where: {
     *     // ... filter to delete one SportSection
     *   }
     * })
     * 
     */
    delete<T extends SportSectionDeleteArgs>(args: SelectSubset<T, SportSectionDeleteArgs<ExtArgs>>): Prisma__SportSectionClient<$Result.GetResult<Prisma.$SportSectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SportSection.
     * @param {SportSectionUpdateArgs} args - Arguments to update one SportSection.
     * @example
     * // Update one SportSection
     * const sportSection = await prisma.sportSection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SportSectionUpdateArgs>(args: SelectSubset<T, SportSectionUpdateArgs<ExtArgs>>): Prisma__SportSectionClient<$Result.GetResult<Prisma.$SportSectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SportSections.
     * @param {SportSectionDeleteManyArgs} args - Arguments to filter SportSections to delete.
     * @example
     * // Delete a few SportSections
     * const { count } = await prisma.sportSection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SportSectionDeleteManyArgs>(args?: SelectSubset<T, SportSectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SportSections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SportSectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SportSections
     * const sportSection = await prisma.sportSection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SportSectionUpdateManyArgs>(args: SelectSubset<T, SportSectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SportSections and returns the data updated in the database.
     * @param {SportSectionUpdateManyAndReturnArgs} args - Arguments to update many SportSections.
     * @example
     * // Update many SportSections
     * const sportSection = await prisma.sportSection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SportSections and only return the `id`
     * const sportSectionWithIdOnly = await prisma.sportSection.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SportSectionUpdateManyAndReturnArgs>(args: SelectSubset<T, SportSectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SportSectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SportSection.
     * @param {SportSectionUpsertArgs} args - Arguments to update or create a SportSection.
     * @example
     * // Update or create a SportSection
     * const sportSection = await prisma.sportSection.upsert({
     *   create: {
     *     // ... data to create a SportSection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SportSection we want to update
     *   }
     * })
     */
    upsert<T extends SportSectionUpsertArgs>(args: SelectSubset<T, SportSectionUpsertArgs<ExtArgs>>): Prisma__SportSectionClient<$Result.GetResult<Prisma.$SportSectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SportSections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SportSectionCountArgs} args - Arguments to filter SportSections to count.
     * @example
     * // Count the number of SportSections
     * const count = await prisma.sportSection.count({
     *   where: {
     *     // ... the filter for the SportSections we want to count
     *   }
     * })
    **/
    count<T extends SportSectionCountArgs>(
      args?: Subset<T, SportSectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SportSectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SportSection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SportSectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SportSectionAggregateArgs>(args: Subset<T, SportSectionAggregateArgs>): Prisma.PrismaPromise<GetSportSectionAggregateType<T>>

    /**
     * Group by SportSection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SportSectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SportSectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SportSectionGroupByArgs['orderBy'] }
        : { orderBy?: SportSectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SportSectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSportSectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SportSection model
   */
  readonly fields: SportSectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SportSection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SportSectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SportSection model
   */
  interface SportSectionFieldRefs {
    readonly id: FieldRef<"SportSection", 'String'>
    readonly title: FieldRef<"SportSection", 'String'>
    readonly summary: FieldRef<"SportSection", 'String'>
    readonly focus: FieldRef<"SportSection", 'GoalTag[]'>
    readonly format: FieldRef<"SportSection", 'TrainingFormat'>
    readonly contactLevel: FieldRef<"SportSection", 'ContactLevel'>
    readonly intensity: FieldRef<"SportSection", 'FitnessLevel'>
    readonly recommendedFor: FieldRef<"SportSection", 'Json'>
    readonly expectedResults: FieldRef<"SportSection", 'Json'>
    readonly extraBenefits: FieldRef<"SportSection", 'String[]'>
    readonly prerequisites: FieldRef<"SportSection", 'String'>
    readonly imagePath: FieldRef<"SportSection", 'String'>
    readonly locationHint: FieldRef<"SportSection", 'String'>
    readonly similarityVector: FieldRef<"SportSection", 'Json'>
    readonly createdAt: FieldRef<"SportSection", 'DateTime'>
    readonly updatedAt: FieldRef<"SportSection", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SportSection findUnique
   */
  export type SportSectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SportSection
     */
    select?: SportSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SportSection
     */
    omit?: SportSectionOmit<ExtArgs> | null
    /**
     * Filter, which SportSection to fetch.
     */
    where: SportSectionWhereUniqueInput
  }

  /**
   * SportSection findUniqueOrThrow
   */
  export type SportSectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SportSection
     */
    select?: SportSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SportSection
     */
    omit?: SportSectionOmit<ExtArgs> | null
    /**
     * Filter, which SportSection to fetch.
     */
    where: SportSectionWhereUniqueInput
  }

  /**
   * SportSection findFirst
   */
  export type SportSectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SportSection
     */
    select?: SportSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SportSection
     */
    omit?: SportSectionOmit<ExtArgs> | null
    /**
     * Filter, which SportSection to fetch.
     */
    where?: SportSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SportSections to fetch.
     */
    orderBy?: SportSectionOrderByWithRelationInput | SportSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SportSections.
     */
    cursor?: SportSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SportSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SportSections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SportSections.
     */
    distinct?: SportSectionScalarFieldEnum | SportSectionScalarFieldEnum[]
  }

  /**
   * SportSection findFirstOrThrow
   */
  export type SportSectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SportSection
     */
    select?: SportSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SportSection
     */
    omit?: SportSectionOmit<ExtArgs> | null
    /**
     * Filter, which SportSection to fetch.
     */
    where?: SportSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SportSections to fetch.
     */
    orderBy?: SportSectionOrderByWithRelationInput | SportSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SportSections.
     */
    cursor?: SportSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SportSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SportSections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SportSections.
     */
    distinct?: SportSectionScalarFieldEnum | SportSectionScalarFieldEnum[]
  }

  /**
   * SportSection findMany
   */
  export type SportSectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SportSection
     */
    select?: SportSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SportSection
     */
    omit?: SportSectionOmit<ExtArgs> | null
    /**
     * Filter, which SportSections to fetch.
     */
    where?: SportSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SportSections to fetch.
     */
    orderBy?: SportSectionOrderByWithRelationInput | SportSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SportSections.
     */
    cursor?: SportSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SportSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SportSections.
     */
    skip?: number
    distinct?: SportSectionScalarFieldEnum | SportSectionScalarFieldEnum[]
  }

  /**
   * SportSection create
   */
  export type SportSectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SportSection
     */
    select?: SportSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SportSection
     */
    omit?: SportSectionOmit<ExtArgs> | null
    /**
     * The data needed to create a SportSection.
     */
    data: XOR<SportSectionCreateInput, SportSectionUncheckedCreateInput>
  }

  /**
   * SportSection createMany
   */
  export type SportSectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SportSections.
     */
    data: SportSectionCreateManyInput | SportSectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SportSection createManyAndReturn
   */
  export type SportSectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SportSection
     */
    select?: SportSectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SportSection
     */
    omit?: SportSectionOmit<ExtArgs> | null
    /**
     * The data used to create many SportSections.
     */
    data: SportSectionCreateManyInput | SportSectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SportSection update
   */
  export type SportSectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SportSection
     */
    select?: SportSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SportSection
     */
    omit?: SportSectionOmit<ExtArgs> | null
    /**
     * The data needed to update a SportSection.
     */
    data: XOR<SportSectionUpdateInput, SportSectionUncheckedUpdateInput>
    /**
     * Choose, which SportSection to update.
     */
    where: SportSectionWhereUniqueInput
  }

  /**
   * SportSection updateMany
   */
  export type SportSectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SportSections.
     */
    data: XOR<SportSectionUpdateManyMutationInput, SportSectionUncheckedUpdateManyInput>
    /**
     * Filter which SportSections to update
     */
    where?: SportSectionWhereInput
    /**
     * Limit how many SportSections to update.
     */
    limit?: number
  }

  /**
   * SportSection updateManyAndReturn
   */
  export type SportSectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SportSection
     */
    select?: SportSectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SportSection
     */
    omit?: SportSectionOmit<ExtArgs> | null
    /**
     * The data used to update SportSections.
     */
    data: XOR<SportSectionUpdateManyMutationInput, SportSectionUncheckedUpdateManyInput>
    /**
     * Filter which SportSections to update
     */
    where?: SportSectionWhereInput
    /**
     * Limit how many SportSections to update.
     */
    limit?: number
  }

  /**
   * SportSection upsert
   */
  export type SportSectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SportSection
     */
    select?: SportSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SportSection
     */
    omit?: SportSectionOmit<ExtArgs> | null
    /**
     * The filter to search for the SportSection to update in case it exists.
     */
    where: SportSectionWhereUniqueInput
    /**
     * In case the SportSection found by the `where` argument doesn't exist, create a new SportSection with this data.
     */
    create: XOR<SportSectionCreateInput, SportSectionUncheckedCreateInput>
    /**
     * In case the SportSection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SportSectionUpdateInput, SportSectionUncheckedUpdateInput>
  }

  /**
   * SportSection delete
   */
  export type SportSectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SportSection
     */
    select?: SportSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SportSection
     */
    omit?: SportSectionOmit<ExtArgs> | null
    /**
     * Filter which SportSection to delete.
     */
    where: SportSectionWhereUniqueInput
  }

  /**
   * SportSection deleteMany
   */
  export type SportSectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SportSections to delete
     */
    where?: SportSectionWhereInput
    /**
     * Limit how many SportSections to delete.
     */
    limit?: number
  }

  /**
   * SportSection without action
   */
  export type SportSectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SportSection
     */
    select?: SportSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SportSection
     */
    omit?: SportSectionOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SurveySubmissionScalarFieldEnum: {
    id: 'id',
    telegramUserId: 'telegramUserId',
    chatId: 'chatId',
    age: 'age',
    gender: 'gender',
    fitnessLevel: 'fitnessLevel',
    preferredFormats: 'preferredFormats',
    desiredGoals: 'desiredGoals',
    avoidContact: 'avoidContact',
    interestedInCompetition: 'interestedInCompetition',
    aiSummary: 'aiSummary',
    createdAt: 'createdAt'
  };

  export type SurveySubmissionScalarFieldEnum = (typeof SurveySubmissionScalarFieldEnum)[keyof typeof SurveySubmissionScalarFieldEnum]


  export const RecommendationSnapshotScalarFieldEnum: {
    id: 'id',
    submissionId: 'submissionId',
    sectionId: 'sectionId',
    sectionName: 'sectionName',
    score: 'score',
    rank: 'rank',
    reasons: 'reasons',
    createdAt: 'createdAt'
  };

  export type RecommendationSnapshotScalarFieldEnum = (typeof RecommendationSnapshotScalarFieldEnum)[keyof typeof RecommendationSnapshotScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    key: 'key',
    value: 'value'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const SportSectionScalarFieldEnum: {
    id: 'id',
    title: 'title',
    summary: 'summary',
    focus: 'focus',
    format: 'format',
    contactLevel: 'contactLevel',
    intensity: 'intensity',
    recommendedFor: 'recommendedFor',
    expectedResults: 'expectedResults',
    extraBenefits: 'extraBenefits',
    prerequisites: 'prerequisites',
    imagePath: 'imagePath',
    locationHint: 'locationHint',
    similarityVector: 'similarityVector',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SportSectionScalarFieldEnum = (typeof SportSectionScalarFieldEnum)[keyof typeof SportSectionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Gender'
   */
  export type EnumGenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Gender'>
    


  /**
   * Reference to a field of type 'Gender[]'
   */
  export type ListEnumGenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Gender[]'>
    


  /**
   * Reference to a field of type 'FitnessLevel'
   */
  export type EnumFitnessLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FitnessLevel'>
    


  /**
   * Reference to a field of type 'FitnessLevel[]'
   */
  export type ListEnumFitnessLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FitnessLevel[]'>
    


  /**
   * Reference to a field of type 'TrainingFormat[]'
   */
  export type ListEnumTrainingFormatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TrainingFormat[]'>
    


  /**
   * Reference to a field of type 'TrainingFormat'
   */
  export type EnumTrainingFormatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TrainingFormat'>
    


  /**
   * Reference to a field of type 'GoalTag[]'
   */
  export type ListEnumGoalTagFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GoalTag[]'>
    


  /**
   * Reference to a field of type 'GoalTag'
   */
  export type EnumGoalTagFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GoalTag'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'ContactLevel'
   */
  export type EnumContactLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ContactLevel'>
    


  /**
   * Reference to a field of type 'ContactLevel[]'
   */
  export type ListEnumContactLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ContactLevel[]'>
    
  /**
   * Deep Input Types
   */


  export type SurveySubmissionWhereInput = {
    AND?: SurveySubmissionWhereInput | SurveySubmissionWhereInput[]
    OR?: SurveySubmissionWhereInput[]
    NOT?: SurveySubmissionWhereInput | SurveySubmissionWhereInput[]
    id?: StringFilter<"SurveySubmission"> | string
    telegramUserId?: StringNullableFilter<"SurveySubmission"> | string | null
    chatId?: StringNullableFilter<"SurveySubmission"> | string | null
    age?: IntFilter<"SurveySubmission"> | number
    gender?: EnumGenderFilter<"SurveySubmission"> | $Enums.Gender
    fitnessLevel?: EnumFitnessLevelFilter<"SurveySubmission"> | $Enums.FitnessLevel
    preferredFormats?: EnumTrainingFormatNullableListFilter<"SurveySubmission">
    desiredGoals?: EnumGoalTagNullableListFilter<"SurveySubmission">
    avoidContact?: BoolFilter<"SurveySubmission"> | boolean
    interestedInCompetition?: BoolFilter<"SurveySubmission"> | boolean
    aiSummary?: StringNullableFilter<"SurveySubmission"> | string | null
    createdAt?: DateTimeFilter<"SurveySubmission"> | Date | string
    recommendations?: RecommendationSnapshotListRelationFilter
  }

  export type SurveySubmissionOrderByWithRelationInput = {
    id?: SortOrder
    telegramUserId?: SortOrderInput | SortOrder
    chatId?: SortOrderInput | SortOrder
    age?: SortOrder
    gender?: SortOrder
    fitnessLevel?: SortOrder
    preferredFormats?: SortOrder
    desiredGoals?: SortOrder
    avoidContact?: SortOrder
    interestedInCompetition?: SortOrder
    aiSummary?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    recommendations?: RecommendationSnapshotOrderByRelationAggregateInput
  }

  export type SurveySubmissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SurveySubmissionWhereInput | SurveySubmissionWhereInput[]
    OR?: SurveySubmissionWhereInput[]
    NOT?: SurveySubmissionWhereInput | SurveySubmissionWhereInput[]
    telegramUserId?: StringNullableFilter<"SurveySubmission"> | string | null
    chatId?: StringNullableFilter<"SurveySubmission"> | string | null
    age?: IntFilter<"SurveySubmission"> | number
    gender?: EnumGenderFilter<"SurveySubmission"> | $Enums.Gender
    fitnessLevel?: EnumFitnessLevelFilter<"SurveySubmission"> | $Enums.FitnessLevel
    preferredFormats?: EnumTrainingFormatNullableListFilter<"SurveySubmission">
    desiredGoals?: EnumGoalTagNullableListFilter<"SurveySubmission">
    avoidContact?: BoolFilter<"SurveySubmission"> | boolean
    interestedInCompetition?: BoolFilter<"SurveySubmission"> | boolean
    aiSummary?: StringNullableFilter<"SurveySubmission"> | string | null
    createdAt?: DateTimeFilter<"SurveySubmission"> | Date | string
    recommendations?: RecommendationSnapshotListRelationFilter
  }, "id">

  export type SurveySubmissionOrderByWithAggregationInput = {
    id?: SortOrder
    telegramUserId?: SortOrderInput | SortOrder
    chatId?: SortOrderInput | SortOrder
    age?: SortOrder
    gender?: SortOrder
    fitnessLevel?: SortOrder
    preferredFormats?: SortOrder
    desiredGoals?: SortOrder
    avoidContact?: SortOrder
    interestedInCompetition?: SortOrder
    aiSummary?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SurveySubmissionCountOrderByAggregateInput
    _avg?: SurveySubmissionAvgOrderByAggregateInput
    _max?: SurveySubmissionMaxOrderByAggregateInput
    _min?: SurveySubmissionMinOrderByAggregateInput
    _sum?: SurveySubmissionSumOrderByAggregateInput
  }

  export type SurveySubmissionScalarWhereWithAggregatesInput = {
    AND?: SurveySubmissionScalarWhereWithAggregatesInput | SurveySubmissionScalarWhereWithAggregatesInput[]
    OR?: SurveySubmissionScalarWhereWithAggregatesInput[]
    NOT?: SurveySubmissionScalarWhereWithAggregatesInput | SurveySubmissionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SurveySubmission"> | string
    telegramUserId?: StringNullableWithAggregatesFilter<"SurveySubmission"> | string | null
    chatId?: StringNullableWithAggregatesFilter<"SurveySubmission"> | string | null
    age?: IntWithAggregatesFilter<"SurveySubmission"> | number
    gender?: EnumGenderWithAggregatesFilter<"SurveySubmission"> | $Enums.Gender
    fitnessLevel?: EnumFitnessLevelWithAggregatesFilter<"SurveySubmission"> | $Enums.FitnessLevel
    preferredFormats?: EnumTrainingFormatNullableListFilter<"SurveySubmission">
    desiredGoals?: EnumGoalTagNullableListFilter<"SurveySubmission">
    avoidContact?: BoolWithAggregatesFilter<"SurveySubmission"> | boolean
    interestedInCompetition?: BoolWithAggregatesFilter<"SurveySubmission"> | boolean
    aiSummary?: StringNullableWithAggregatesFilter<"SurveySubmission"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SurveySubmission"> | Date | string
  }

  export type RecommendationSnapshotWhereInput = {
    AND?: RecommendationSnapshotWhereInput | RecommendationSnapshotWhereInput[]
    OR?: RecommendationSnapshotWhereInput[]
    NOT?: RecommendationSnapshotWhereInput | RecommendationSnapshotWhereInput[]
    id?: StringFilter<"RecommendationSnapshot"> | string
    submissionId?: StringFilter<"RecommendationSnapshot"> | string
    sectionId?: StringFilter<"RecommendationSnapshot"> | string
    sectionName?: StringFilter<"RecommendationSnapshot"> | string
    score?: FloatFilter<"RecommendationSnapshot"> | number
    rank?: IntFilter<"RecommendationSnapshot"> | number
    reasons?: JsonNullableFilter<"RecommendationSnapshot">
    createdAt?: DateTimeFilter<"RecommendationSnapshot"> | Date | string
    submission?: XOR<SurveySubmissionScalarRelationFilter, SurveySubmissionWhereInput>
  }

  export type RecommendationSnapshotOrderByWithRelationInput = {
    id?: SortOrder
    submissionId?: SortOrder
    sectionId?: SortOrder
    sectionName?: SortOrder
    score?: SortOrder
    rank?: SortOrder
    reasons?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    submission?: SurveySubmissionOrderByWithRelationInput
  }

  export type RecommendationSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RecommendationSnapshotWhereInput | RecommendationSnapshotWhereInput[]
    OR?: RecommendationSnapshotWhereInput[]
    NOT?: RecommendationSnapshotWhereInput | RecommendationSnapshotWhereInput[]
    submissionId?: StringFilter<"RecommendationSnapshot"> | string
    sectionId?: StringFilter<"RecommendationSnapshot"> | string
    sectionName?: StringFilter<"RecommendationSnapshot"> | string
    score?: FloatFilter<"RecommendationSnapshot"> | number
    rank?: IntFilter<"RecommendationSnapshot"> | number
    reasons?: JsonNullableFilter<"RecommendationSnapshot">
    createdAt?: DateTimeFilter<"RecommendationSnapshot"> | Date | string
    submission?: XOR<SurveySubmissionScalarRelationFilter, SurveySubmissionWhereInput>
  }, "id">

  export type RecommendationSnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    submissionId?: SortOrder
    sectionId?: SortOrder
    sectionName?: SortOrder
    score?: SortOrder
    rank?: SortOrder
    reasons?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RecommendationSnapshotCountOrderByAggregateInput
    _avg?: RecommendationSnapshotAvgOrderByAggregateInput
    _max?: RecommendationSnapshotMaxOrderByAggregateInput
    _min?: RecommendationSnapshotMinOrderByAggregateInput
    _sum?: RecommendationSnapshotSumOrderByAggregateInput
  }

  export type RecommendationSnapshotScalarWhereWithAggregatesInput = {
    AND?: RecommendationSnapshotScalarWhereWithAggregatesInput | RecommendationSnapshotScalarWhereWithAggregatesInput[]
    OR?: RecommendationSnapshotScalarWhereWithAggregatesInput[]
    NOT?: RecommendationSnapshotScalarWhereWithAggregatesInput | RecommendationSnapshotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RecommendationSnapshot"> | string
    submissionId?: StringWithAggregatesFilter<"RecommendationSnapshot"> | string
    sectionId?: StringWithAggregatesFilter<"RecommendationSnapshot"> | string
    sectionName?: StringWithAggregatesFilter<"RecommendationSnapshot"> | string
    score?: FloatWithAggregatesFilter<"RecommendationSnapshot"> | number
    rank?: IntWithAggregatesFilter<"RecommendationSnapshot"> | number
    reasons?: JsonNullableWithAggregatesFilter<"RecommendationSnapshot">
    createdAt?: DateTimeWithAggregatesFilter<"RecommendationSnapshot"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    key?: StringFilter<"Session"> | string
    value?: StringFilter<"Session"> | string
  }

  export type SessionOrderByWithRelationInput = {
    key?: SortOrder
    value?: SortOrder
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    key?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    value?: StringFilter<"Session"> | string
  }, "key">

  export type SessionOrderByWithAggregationInput = {
    key?: SortOrder
    value?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    key?: StringWithAggregatesFilter<"Session"> | string
    value?: StringWithAggregatesFilter<"Session"> | string
  }

  export type SportSectionWhereInput = {
    AND?: SportSectionWhereInput | SportSectionWhereInput[]
    OR?: SportSectionWhereInput[]
    NOT?: SportSectionWhereInput | SportSectionWhereInput[]
    id?: StringFilter<"SportSection"> | string
    title?: StringFilter<"SportSection"> | string
    summary?: StringFilter<"SportSection"> | string
    focus?: EnumGoalTagNullableListFilter<"SportSection">
    format?: EnumTrainingFormatFilter<"SportSection"> | $Enums.TrainingFormat
    contactLevel?: EnumContactLevelFilter<"SportSection"> | $Enums.ContactLevel
    intensity?: EnumFitnessLevelFilter<"SportSection"> | $Enums.FitnessLevel
    recommendedFor?: JsonFilter<"SportSection">
    expectedResults?: JsonFilter<"SportSection">
    extraBenefits?: StringNullableListFilter<"SportSection">
    prerequisites?: StringNullableFilter<"SportSection"> | string | null
    imagePath?: StringNullableFilter<"SportSection"> | string | null
    locationHint?: StringNullableFilter<"SportSection"> | string | null
    similarityVector?: JsonNullableFilter<"SportSection">
    createdAt?: DateTimeFilter<"SportSection"> | Date | string
    updatedAt?: DateTimeFilter<"SportSection"> | Date | string
  }

  export type SportSectionOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    focus?: SortOrder
    format?: SortOrder
    contactLevel?: SortOrder
    intensity?: SortOrder
    recommendedFor?: SortOrder
    expectedResults?: SortOrder
    extraBenefits?: SortOrder
    prerequisites?: SortOrderInput | SortOrder
    imagePath?: SortOrderInput | SortOrder
    locationHint?: SortOrderInput | SortOrder
    similarityVector?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SportSectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SportSectionWhereInput | SportSectionWhereInput[]
    OR?: SportSectionWhereInput[]
    NOT?: SportSectionWhereInput | SportSectionWhereInput[]
    title?: StringFilter<"SportSection"> | string
    summary?: StringFilter<"SportSection"> | string
    focus?: EnumGoalTagNullableListFilter<"SportSection">
    format?: EnumTrainingFormatFilter<"SportSection"> | $Enums.TrainingFormat
    contactLevel?: EnumContactLevelFilter<"SportSection"> | $Enums.ContactLevel
    intensity?: EnumFitnessLevelFilter<"SportSection"> | $Enums.FitnessLevel
    recommendedFor?: JsonFilter<"SportSection">
    expectedResults?: JsonFilter<"SportSection">
    extraBenefits?: StringNullableListFilter<"SportSection">
    prerequisites?: StringNullableFilter<"SportSection"> | string | null
    imagePath?: StringNullableFilter<"SportSection"> | string | null
    locationHint?: StringNullableFilter<"SportSection"> | string | null
    similarityVector?: JsonNullableFilter<"SportSection">
    createdAt?: DateTimeFilter<"SportSection"> | Date | string
    updatedAt?: DateTimeFilter<"SportSection"> | Date | string
  }, "id">

  export type SportSectionOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    focus?: SortOrder
    format?: SortOrder
    contactLevel?: SortOrder
    intensity?: SortOrder
    recommendedFor?: SortOrder
    expectedResults?: SortOrder
    extraBenefits?: SortOrder
    prerequisites?: SortOrderInput | SortOrder
    imagePath?: SortOrderInput | SortOrder
    locationHint?: SortOrderInput | SortOrder
    similarityVector?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SportSectionCountOrderByAggregateInput
    _max?: SportSectionMaxOrderByAggregateInput
    _min?: SportSectionMinOrderByAggregateInput
  }

  export type SportSectionScalarWhereWithAggregatesInput = {
    AND?: SportSectionScalarWhereWithAggregatesInput | SportSectionScalarWhereWithAggregatesInput[]
    OR?: SportSectionScalarWhereWithAggregatesInput[]
    NOT?: SportSectionScalarWhereWithAggregatesInput | SportSectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SportSection"> | string
    title?: StringWithAggregatesFilter<"SportSection"> | string
    summary?: StringWithAggregatesFilter<"SportSection"> | string
    focus?: EnumGoalTagNullableListFilter<"SportSection">
    format?: EnumTrainingFormatWithAggregatesFilter<"SportSection"> | $Enums.TrainingFormat
    contactLevel?: EnumContactLevelWithAggregatesFilter<"SportSection"> | $Enums.ContactLevel
    intensity?: EnumFitnessLevelWithAggregatesFilter<"SportSection"> | $Enums.FitnessLevel
    recommendedFor?: JsonWithAggregatesFilter<"SportSection">
    expectedResults?: JsonWithAggregatesFilter<"SportSection">
    extraBenefits?: StringNullableListFilter<"SportSection">
    prerequisites?: StringNullableWithAggregatesFilter<"SportSection"> | string | null
    imagePath?: StringNullableWithAggregatesFilter<"SportSection"> | string | null
    locationHint?: StringNullableWithAggregatesFilter<"SportSection"> | string | null
    similarityVector?: JsonNullableWithAggregatesFilter<"SportSection">
    createdAt?: DateTimeWithAggregatesFilter<"SportSection"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SportSection"> | Date | string
  }

  export type SurveySubmissionCreateInput = {
    id?: string
    telegramUserId?: string | null
    chatId?: string | null
    age: number
    gender: $Enums.Gender
    fitnessLevel: $Enums.FitnessLevel
    preferredFormats?: SurveySubmissionCreatepreferredFormatsInput | $Enums.TrainingFormat[]
    desiredGoals?: SurveySubmissionCreatedesiredGoalsInput | $Enums.GoalTag[]
    avoidContact: boolean
    interestedInCompetition: boolean
    aiSummary?: string | null
    createdAt?: Date | string
    recommendations?: RecommendationSnapshotCreateNestedManyWithoutSubmissionInput
  }

  export type SurveySubmissionUncheckedCreateInput = {
    id?: string
    telegramUserId?: string | null
    chatId?: string | null
    age: number
    gender: $Enums.Gender
    fitnessLevel: $Enums.FitnessLevel
    preferredFormats?: SurveySubmissionCreatepreferredFormatsInput | $Enums.TrainingFormat[]
    desiredGoals?: SurveySubmissionCreatedesiredGoalsInput | $Enums.GoalTag[]
    avoidContact: boolean
    interestedInCompetition: boolean
    aiSummary?: string | null
    createdAt?: Date | string
    recommendations?: RecommendationSnapshotUncheckedCreateNestedManyWithoutSubmissionInput
  }

  export type SurveySubmissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    telegramUserId?: NullableStringFieldUpdateOperationsInput | string | null
    chatId?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    fitnessLevel?: EnumFitnessLevelFieldUpdateOperationsInput | $Enums.FitnessLevel
    preferredFormats?: SurveySubmissionUpdatepreferredFormatsInput | $Enums.TrainingFormat[]
    desiredGoals?: SurveySubmissionUpdatedesiredGoalsInput | $Enums.GoalTag[]
    avoidContact?: BoolFieldUpdateOperationsInput | boolean
    interestedInCompetition?: BoolFieldUpdateOperationsInput | boolean
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recommendations?: RecommendationSnapshotUpdateManyWithoutSubmissionNestedInput
  }

  export type SurveySubmissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    telegramUserId?: NullableStringFieldUpdateOperationsInput | string | null
    chatId?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    fitnessLevel?: EnumFitnessLevelFieldUpdateOperationsInput | $Enums.FitnessLevel
    preferredFormats?: SurveySubmissionUpdatepreferredFormatsInput | $Enums.TrainingFormat[]
    desiredGoals?: SurveySubmissionUpdatedesiredGoalsInput | $Enums.GoalTag[]
    avoidContact?: BoolFieldUpdateOperationsInput | boolean
    interestedInCompetition?: BoolFieldUpdateOperationsInput | boolean
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recommendations?: RecommendationSnapshotUncheckedUpdateManyWithoutSubmissionNestedInput
  }

  export type SurveySubmissionCreateManyInput = {
    id?: string
    telegramUserId?: string | null
    chatId?: string | null
    age: number
    gender: $Enums.Gender
    fitnessLevel: $Enums.FitnessLevel
    preferredFormats?: SurveySubmissionCreatepreferredFormatsInput | $Enums.TrainingFormat[]
    desiredGoals?: SurveySubmissionCreatedesiredGoalsInput | $Enums.GoalTag[]
    avoidContact: boolean
    interestedInCompetition: boolean
    aiSummary?: string | null
    createdAt?: Date | string
  }

  export type SurveySubmissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    telegramUserId?: NullableStringFieldUpdateOperationsInput | string | null
    chatId?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    fitnessLevel?: EnumFitnessLevelFieldUpdateOperationsInput | $Enums.FitnessLevel
    preferredFormats?: SurveySubmissionUpdatepreferredFormatsInput | $Enums.TrainingFormat[]
    desiredGoals?: SurveySubmissionUpdatedesiredGoalsInput | $Enums.GoalTag[]
    avoidContact?: BoolFieldUpdateOperationsInput | boolean
    interestedInCompetition?: BoolFieldUpdateOperationsInput | boolean
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SurveySubmissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    telegramUserId?: NullableStringFieldUpdateOperationsInput | string | null
    chatId?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    fitnessLevel?: EnumFitnessLevelFieldUpdateOperationsInput | $Enums.FitnessLevel
    preferredFormats?: SurveySubmissionUpdatepreferredFormatsInput | $Enums.TrainingFormat[]
    desiredGoals?: SurveySubmissionUpdatedesiredGoalsInput | $Enums.GoalTag[]
    avoidContact?: BoolFieldUpdateOperationsInput | boolean
    interestedInCompetition?: BoolFieldUpdateOperationsInput | boolean
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationSnapshotCreateInput = {
    id?: string
    sectionId: string
    sectionName: string
    score: number
    rank: number
    reasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    submission: SurveySubmissionCreateNestedOneWithoutRecommendationsInput
  }

  export type RecommendationSnapshotUncheckedCreateInput = {
    id?: string
    submissionId: string
    sectionId: string
    sectionName: string
    score: number
    rank: number
    reasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RecommendationSnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: StringFieldUpdateOperationsInput | string
    sectionName?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    rank?: IntFieldUpdateOperationsInput | number
    reasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submission?: SurveySubmissionUpdateOneRequiredWithoutRecommendationsNestedInput
  }

  export type RecommendationSnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    submissionId?: StringFieldUpdateOperationsInput | string
    sectionId?: StringFieldUpdateOperationsInput | string
    sectionName?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    rank?: IntFieldUpdateOperationsInput | number
    reasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationSnapshotCreateManyInput = {
    id?: string
    submissionId: string
    sectionId: string
    sectionName: string
    score: number
    rank: number
    reasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RecommendationSnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: StringFieldUpdateOperationsInput | string
    sectionName?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    rank?: IntFieldUpdateOperationsInput | number
    reasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationSnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    submissionId?: StringFieldUpdateOperationsInput | string
    sectionId?: StringFieldUpdateOperationsInput | string
    sectionName?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    rank?: IntFieldUpdateOperationsInput | number
    reasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    key: string
    value: string
  }

  export type SessionUncheckedCreateInput = {
    key: string
    value: string
  }

  export type SessionUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type SessionUncheckedUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type SessionCreateManyInput = {
    key: string
    value: string
  }

  export type SessionUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type SessionUncheckedUpdateManyInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type SportSectionCreateInput = {
    id: string
    title: string
    summary: string
    focus?: SportSectionCreatefocusInput | $Enums.GoalTag[]
    format: $Enums.TrainingFormat
    contactLevel: $Enums.ContactLevel
    intensity: $Enums.FitnessLevel
    recommendedFor: JsonNullValueInput | InputJsonValue
    expectedResults: JsonNullValueInput | InputJsonValue
    extraBenefits?: SportSectionCreateextraBenefitsInput | string[]
    prerequisites?: string | null
    imagePath?: string | null
    locationHint?: string | null
    similarityVector?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SportSectionUncheckedCreateInput = {
    id: string
    title: string
    summary: string
    focus?: SportSectionCreatefocusInput | $Enums.GoalTag[]
    format: $Enums.TrainingFormat
    contactLevel: $Enums.ContactLevel
    intensity: $Enums.FitnessLevel
    recommendedFor: JsonNullValueInput | InputJsonValue
    expectedResults: JsonNullValueInput | InputJsonValue
    extraBenefits?: SportSectionCreateextraBenefitsInput | string[]
    prerequisites?: string | null
    imagePath?: string | null
    locationHint?: string | null
    similarityVector?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SportSectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    focus?: SportSectionUpdatefocusInput | $Enums.GoalTag[]
    format?: EnumTrainingFormatFieldUpdateOperationsInput | $Enums.TrainingFormat
    contactLevel?: EnumContactLevelFieldUpdateOperationsInput | $Enums.ContactLevel
    intensity?: EnumFitnessLevelFieldUpdateOperationsInput | $Enums.FitnessLevel
    recommendedFor?: JsonNullValueInput | InputJsonValue
    expectedResults?: JsonNullValueInput | InputJsonValue
    extraBenefits?: SportSectionUpdateextraBenefitsInput | string[]
    prerequisites?: NullableStringFieldUpdateOperationsInput | string | null
    imagePath?: NullableStringFieldUpdateOperationsInput | string | null
    locationHint?: NullableStringFieldUpdateOperationsInput | string | null
    similarityVector?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SportSectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    focus?: SportSectionUpdatefocusInput | $Enums.GoalTag[]
    format?: EnumTrainingFormatFieldUpdateOperationsInput | $Enums.TrainingFormat
    contactLevel?: EnumContactLevelFieldUpdateOperationsInput | $Enums.ContactLevel
    intensity?: EnumFitnessLevelFieldUpdateOperationsInput | $Enums.FitnessLevel
    recommendedFor?: JsonNullValueInput | InputJsonValue
    expectedResults?: JsonNullValueInput | InputJsonValue
    extraBenefits?: SportSectionUpdateextraBenefitsInput | string[]
    prerequisites?: NullableStringFieldUpdateOperationsInput | string | null
    imagePath?: NullableStringFieldUpdateOperationsInput | string | null
    locationHint?: NullableStringFieldUpdateOperationsInput | string | null
    similarityVector?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SportSectionCreateManyInput = {
    id: string
    title: string
    summary: string
    focus?: SportSectionCreatefocusInput | $Enums.GoalTag[]
    format: $Enums.TrainingFormat
    contactLevel: $Enums.ContactLevel
    intensity: $Enums.FitnessLevel
    recommendedFor: JsonNullValueInput | InputJsonValue
    expectedResults: JsonNullValueInput | InputJsonValue
    extraBenefits?: SportSectionCreateextraBenefitsInput | string[]
    prerequisites?: string | null
    imagePath?: string | null
    locationHint?: string | null
    similarityVector?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SportSectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    focus?: SportSectionUpdatefocusInput | $Enums.GoalTag[]
    format?: EnumTrainingFormatFieldUpdateOperationsInput | $Enums.TrainingFormat
    contactLevel?: EnumContactLevelFieldUpdateOperationsInput | $Enums.ContactLevel
    intensity?: EnumFitnessLevelFieldUpdateOperationsInput | $Enums.FitnessLevel
    recommendedFor?: JsonNullValueInput | InputJsonValue
    expectedResults?: JsonNullValueInput | InputJsonValue
    extraBenefits?: SportSectionUpdateextraBenefitsInput | string[]
    prerequisites?: NullableStringFieldUpdateOperationsInput | string | null
    imagePath?: NullableStringFieldUpdateOperationsInput | string | null
    locationHint?: NullableStringFieldUpdateOperationsInput | string | null
    similarityVector?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SportSectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    focus?: SportSectionUpdatefocusInput | $Enums.GoalTag[]
    format?: EnumTrainingFormatFieldUpdateOperationsInput | $Enums.TrainingFormat
    contactLevel?: EnumContactLevelFieldUpdateOperationsInput | $Enums.ContactLevel
    intensity?: EnumFitnessLevelFieldUpdateOperationsInput | $Enums.FitnessLevel
    recommendedFor?: JsonNullValueInput | InputJsonValue
    expectedResults?: JsonNullValueInput | InputJsonValue
    extraBenefits?: SportSectionUpdateextraBenefitsInput | string[]
    prerequisites?: NullableStringFieldUpdateOperationsInput | string | null
    imagePath?: NullableStringFieldUpdateOperationsInput | string | null
    locationHint?: NullableStringFieldUpdateOperationsInput | string | null
    similarityVector?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumGenderFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel>
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    not?: NestedEnumGenderFilter<$PrismaModel> | $Enums.Gender
  }

  export type EnumFitnessLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.FitnessLevel | EnumFitnessLevelFieldRefInput<$PrismaModel>
    in?: $Enums.FitnessLevel[] | ListEnumFitnessLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.FitnessLevel[] | ListEnumFitnessLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumFitnessLevelFilter<$PrismaModel> | $Enums.FitnessLevel
  }

  export type EnumTrainingFormatNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.TrainingFormat[] | ListEnumTrainingFormatFieldRefInput<$PrismaModel> | null
    has?: $Enums.TrainingFormat | EnumTrainingFormatFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.TrainingFormat[] | ListEnumTrainingFormatFieldRefInput<$PrismaModel>
    hasSome?: $Enums.TrainingFormat[] | ListEnumTrainingFormatFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumGoalTagNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.GoalTag[] | ListEnumGoalTagFieldRefInput<$PrismaModel> | null
    has?: $Enums.GoalTag | EnumGoalTagFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.GoalTag[] | ListEnumGoalTagFieldRefInput<$PrismaModel>
    hasSome?: $Enums.GoalTag[] | ListEnumGoalTagFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type RecommendationSnapshotListRelationFilter = {
    every?: RecommendationSnapshotWhereInput
    some?: RecommendationSnapshotWhereInput
    none?: RecommendationSnapshotWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RecommendationSnapshotOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SurveySubmissionCountOrderByAggregateInput = {
    id?: SortOrder
    telegramUserId?: SortOrder
    chatId?: SortOrder
    age?: SortOrder
    gender?: SortOrder
    fitnessLevel?: SortOrder
    preferredFormats?: SortOrder
    desiredGoals?: SortOrder
    avoidContact?: SortOrder
    interestedInCompetition?: SortOrder
    aiSummary?: SortOrder
    createdAt?: SortOrder
  }

  export type SurveySubmissionAvgOrderByAggregateInput = {
    age?: SortOrder
  }

  export type SurveySubmissionMaxOrderByAggregateInput = {
    id?: SortOrder
    telegramUserId?: SortOrder
    chatId?: SortOrder
    age?: SortOrder
    gender?: SortOrder
    fitnessLevel?: SortOrder
    avoidContact?: SortOrder
    interestedInCompetition?: SortOrder
    aiSummary?: SortOrder
    createdAt?: SortOrder
  }

  export type SurveySubmissionMinOrderByAggregateInput = {
    id?: SortOrder
    telegramUserId?: SortOrder
    chatId?: SortOrder
    age?: SortOrder
    gender?: SortOrder
    fitnessLevel?: SortOrder
    avoidContact?: SortOrder
    interestedInCompetition?: SortOrder
    aiSummary?: SortOrder
    createdAt?: SortOrder
  }

  export type SurveySubmissionSumOrderByAggregateInput = {
    age?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumGenderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel>
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    not?: NestedEnumGenderWithAggregatesFilter<$PrismaModel> | $Enums.Gender
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGenderFilter<$PrismaModel>
    _max?: NestedEnumGenderFilter<$PrismaModel>
  }

  export type EnumFitnessLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FitnessLevel | EnumFitnessLevelFieldRefInput<$PrismaModel>
    in?: $Enums.FitnessLevel[] | ListEnumFitnessLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.FitnessLevel[] | ListEnumFitnessLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumFitnessLevelWithAggregatesFilter<$PrismaModel> | $Enums.FitnessLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFitnessLevelFilter<$PrismaModel>
    _max?: NestedEnumFitnessLevelFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SurveySubmissionScalarRelationFilter = {
    is?: SurveySubmissionWhereInput
    isNot?: SurveySubmissionWhereInput
  }

  export type RecommendationSnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    sectionId?: SortOrder
    sectionName?: SortOrder
    score?: SortOrder
    rank?: SortOrder
    reasons?: SortOrder
    createdAt?: SortOrder
  }

  export type RecommendationSnapshotAvgOrderByAggregateInput = {
    score?: SortOrder
    rank?: SortOrder
  }

  export type RecommendationSnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    sectionId?: SortOrder
    sectionName?: SortOrder
    score?: SortOrder
    rank?: SortOrder
    createdAt?: SortOrder
  }

  export type RecommendationSnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    sectionId?: SortOrder
    sectionName?: SortOrder
    score?: SortOrder
    rank?: SortOrder
    createdAt?: SortOrder
  }

  export type RecommendationSnapshotSumOrderByAggregateInput = {
    score?: SortOrder
    rank?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type SessionCountOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
  }

  export type EnumTrainingFormatFilter<$PrismaModel = never> = {
    equals?: $Enums.TrainingFormat | EnumTrainingFormatFieldRefInput<$PrismaModel>
    in?: $Enums.TrainingFormat[] | ListEnumTrainingFormatFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrainingFormat[] | ListEnumTrainingFormatFieldRefInput<$PrismaModel>
    not?: NestedEnumTrainingFormatFilter<$PrismaModel> | $Enums.TrainingFormat
  }

  export type EnumContactLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.ContactLevel | EnumContactLevelFieldRefInput<$PrismaModel>
    in?: $Enums.ContactLevel[] | ListEnumContactLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContactLevel[] | ListEnumContactLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumContactLevelFilter<$PrismaModel> | $Enums.ContactLevel
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type SportSectionCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    focus?: SortOrder
    format?: SortOrder
    contactLevel?: SortOrder
    intensity?: SortOrder
    recommendedFor?: SortOrder
    expectedResults?: SortOrder
    extraBenefits?: SortOrder
    prerequisites?: SortOrder
    imagePath?: SortOrder
    locationHint?: SortOrder
    similarityVector?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SportSectionMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    format?: SortOrder
    contactLevel?: SortOrder
    intensity?: SortOrder
    prerequisites?: SortOrder
    imagePath?: SortOrder
    locationHint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SportSectionMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    format?: SortOrder
    contactLevel?: SortOrder
    intensity?: SortOrder
    prerequisites?: SortOrder
    imagePath?: SortOrder
    locationHint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTrainingFormatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TrainingFormat | EnumTrainingFormatFieldRefInput<$PrismaModel>
    in?: $Enums.TrainingFormat[] | ListEnumTrainingFormatFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrainingFormat[] | ListEnumTrainingFormatFieldRefInput<$PrismaModel>
    not?: NestedEnumTrainingFormatWithAggregatesFilter<$PrismaModel> | $Enums.TrainingFormat
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTrainingFormatFilter<$PrismaModel>
    _max?: NestedEnumTrainingFormatFilter<$PrismaModel>
  }

  export type EnumContactLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContactLevel | EnumContactLevelFieldRefInput<$PrismaModel>
    in?: $Enums.ContactLevel[] | ListEnumContactLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContactLevel[] | ListEnumContactLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumContactLevelWithAggregatesFilter<$PrismaModel> | $Enums.ContactLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumContactLevelFilter<$PrismaModel>
    _max?: NestedEnumContactLevelFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type SurveySubmissionCreatepreferredFormatsInput = {
    set: $Enums.TrainingFormat[]
  }

  export type SurveySubmissionCreatedesiredGoalsInput = {
    set: $Enums.GoalTag[]
  }

  export type RecommendationSnapshotCreateNestedManyWithoutSubmissionInput = {
    create?: XOR<RecommendationSnapshotCreateWithoutSubmissionInput, RecommendationSnapshotUncheckedCreateWithoutSubmissionInput> | RecommendationSnapshotCreateWithoutSubmissionInput[] | RecommendationSnapshotUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: RecommendationSnapshotCreateOrConnectWithoutSubmissionInput | RecommendationSnapshotCreateOrConnectWithoutSubmissionInput[]
    createMany?: RecommendationSnapshotCreateManySubmissionInputEnvelope
    connect?: RecommendationSnapshotWhereUniqueInput | RecommendationSnapshotWhereUniqueInput[]
  }

  export type RecommendationSnapshotUncheckedCreateNestedManyWithoutSubmissionInput = {
    create?: XOR<RecommendationSnapshotCreateWithoutSubmissionInput, RecommendationSnapshotUncheckedCreateWithoutSubmissionInput> | RecommendationSnapshotCreateWithoutSubmissionInput[] | RecommendationSnapshotUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: RecommendationSnapshotCreateOrConnectWithoutSubmissionInput | RecommendationSnapshotCreateOrConnectWithoutSubmissionInput[]
    createMany?: RecommendationSnapshotCreateManySubmissionInputEnvelope
    connect?: RecommendationSnapshotWhereUniqueInput | RecommendationSnapshotWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumGenderFieldUpdateOperationsInput = {
    set?: $Enums.Gender
  }

  export type EnumFitnessLevelFieldUpdateOperationsInput = {
    set?: $Enums.FitnessLevel
  }

  export type SurveySubmissionUpdatepreferredFormatsInput = {
    set?: $Enums.TrainingFormat[]
    push?: $Enums.TrainingFormat | $Enums.TrainingFormat[]
  }

  export type SurveySubmissionUpdatedesiredGoalsInput = {
    set?: $Enums.GoalTag[]
    push?: $Enums.GoalTag | $Enums.GoalTag[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type RecommendationSnapshotUpdateManyWithoutSubmissionNestedInput = {
    create?: XOR<RecommendationSnapshotCreateWithoutSubmissionInput, RecommendationSnapshotUncheckedCreateWithoutSubmissionInput> | RecommendationSnapshotCreateWithoutSubmissionInput[] | RecommendationSnapshotUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: RecommendationSnapshotCreateOrConnectWithoutSubmissionInput | RecommendationSnapshotCreateOrConnectWithoutSubmissionInput[]
    upsert?: RecommendationSnapshotUpsertWithWhereUniqueWithoutSubmissionInput | RecommendationSnapshotUpsertWithWhereUniqueWithoutSubmissionInput[]
    createMany?: RecommendationSnapshotCreateManySubmissionInputEnvelope
    set?: RecommendationSnapshotWhereUniqueInput | RecommendationSnapshotWhereUniqueInput[]
    disconnect?: RecommendationSnapshotWhereUniqueInput | RecommendationSnapshotWhereUniqueInput[]
    delete?: RecommendationSnapshotWhereUniqueInput | RecommendationSnapshotWhereUniqueInput[]
    connect?: RecommendationSnapshotWhereUniqueInput | RecommendationSnapshotWhereUniqueInput[]
    update?: RecommendationSnapshotUpdateWithWhereUniqueWithoutSubmissionInput | RecommendationSnapshotUpdateWithWhereUniqueWithoutSubmissionInput[]
    updateMany?: RecommendationSnapshotUpdateManyWithWhereWithoutSubmissionInput | RecommendationSnapshotUpdateManyWithWhereWithoutSubmissionInput[]
    deleteMany?: RecommendationSnapshotScalarWhereInput | RecommendationSnapshotScalarWhereInput[]
  }

  export type RecommendationSnapshotUncheckedUpdateManyWithoutSubmissionNestedInput = {
    create?: XOR<RecommendationSnapshotCreateWithoutSubmissionInput, RecommendationSnapshotUncheckedCreateWithoutSubmissionInput> | RecommendationSnapshotCreateWithoutSubmissionInput[] | RecommendationSnapshotUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: RecommendationSnapshotCreateOrConnectWithoutSubmissionInput | RecommendationSnapshotCreateOrConnectWithoutSubmissionInput[]
    upsert?: RecommendationSnapshotUpsertWithWhereUniqueWithoutSubmissionInput | RecommendationSnapshotUpsertWithWhereUniqueWithoutSubmissionInput[]
    createMany?: RecommendationSnapshotCreateManySubmissionInputEnvelope
    set?: RecommendationSnapshotWhereUniqueInput | RecommendationSnapshotWhereUniqueInput[]
    disconnect?: RecommendationSnapshotWhereUniqueInput | RecommendationSnapshotWhereUniqueInput[]
    delete?: RecommendationSnapshotWhereUniqueInput | RecommendationSnapshotWhereUniqueInput[]
    connect?: RecommendationSnapshotWhereUniqueInput | RecommendationSnapshotWhereUniqueInput[]
    update?: RecommendationSnapshotUpdateWithWhereUniqueWithoutSubmissionInput | RecommendationSnapshotUpdateWithWhereUniqueWithoutSubmissionInput[]
    updateMany?: RecommendationSnapshotUpdateManyWithWhereWithoutSubmissionInput | RecommendationSnapshotUpdateManyWithWhereWithoutSubmissionInput[]
    deleteMany?: RecommendationSnapshotScalarWhereInput | RecommendationSnapshotScalarWhereInput[]
  }

  export type SurveySubmissionCreateNestedOneWithoutRecommendationsInput = {
    create?: XOR<SurveySubmissionCreateWithoutRecommendationsInput, SurveySubmissionUncheckedCreateWithoutRecommendationsInput>
    connectOrCreate?: SurveySubmissionCreateOrConnectWithoutRecommendationsInput
    connect?: SurveySubmissionWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SurveySubmissionUpdateOneRequiredWithoutRecommendationsNestedInput = {
    create?: XOR<SurveySubmissionCreateWithoutRecommendationsInput, SurveySubmissionUncheckedCreateWithoutRecommendationsInput>
    connectOrCreate?: SurveySubmissionCreateOrConnectWithoutRecommendationsInput
    upsert?: SurveySubmissionUpsertWithoutRecommendationsInput
    connect?: SurveySubmissionWhereUniqueInput
    update?: XOR<XOR<SurveySubmissionUpdateToOneWithWhereWithoutRecommendationsInput, SurveySubmissionUpdateWithoutRecommendationsInput>, SurveySubmissionUncheckedUpdateWithoutRecommendationsInput>
  }

  export type SportSectionCreatefocusInput = {
    set: $Enums.GoalTag[]
  }

  export type SportSectionCreateextraBenefitsInput = {
    set: string[]
  }

  export type SportSectionUpdatefocusInput = {
    set?: $Enums.GoalTag[]
    push?: $Enums.GoalTag | $Enums.GoalTag[]
  }

  export type EnumTrainingFormatFieldUpdateOperationsInput = {
    set?: $Enums.TrainingFormat
  }

  export type EnumContactLevelFieldUpdateOperationsInput = {
    set?: $Enums.ContactLevel
  }

  export type SportSectionUpdateextraBenefitsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumGenderFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel>
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    not?: NestedEnumGenderFilter<$PrismaModel> | $Enums.Gender
  }

  export type NestedEnumFitnessLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.FitnessLevel | EnumFitnessLevelFieldRefInput<$PrismaModel>
    in?: $Enums.FitnessLevel[] | ListEnumFitnessLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.FitnessLevel[] | ListEnumFitnessLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumFitnessLevelFilter<$PrismaModel> | $Enums.FitnessLevel
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumGenderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel>
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    not?: NestedEnumGenderWithAggregatesFilter<$PrismaModel> | $Enums.Gender
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGenderFilter<$PrismaModel>
    _max?: NestedEnumGenderFilter<$PrismaModel>
  }

  export type NestedEnumFitnessLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FitnessLevel | EnumFitnessLevelFieldRefInput<$PrismaModel>
    in?: $Enums.FitnessLevel[] | ListEnumFitnessLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.FitnessLevel[] | ListEnumFitnessLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumFitnessLevelWithAggregatesFilter<$PrismaModel> | $Enums.FitnessLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFitnessLevelFilter<$PrismaModel>
    _max?: NestedEnumFitnessLevelFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumTrainingFormatFilter<$PrismaModel = never> = {
    equals?: $Enums.TrainingFormat | EnumTrainingFormatFieldRefInput<$PrismaModel>
    in?: $Enums.TrainingFormat[] | ListEnumTrainingFormatFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrainingFormat[] | ListEnumTrainingFormatFieldRefInput<$PrismaModel>
    not?: NestedEnumTrainingFormatFilter<$PrismaModel> | $Enums.TrainingFormat
  }

  export type NestedEnumContactLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.ContactLevel | EnumContactLevelFieldRefInput<$PrismaModel>
    in?: $Enums.ContactLevel[] | ListEnumContactLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContactLevel[] | ListEnumContactLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumContactLevelFilter<$PrismaModel> | $Enums.ContactLevel
  }

  export type NestedEnumTrainingFormatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TrainingFormat | EnumTrainingFormatFieldRefInput<$PrismaModel>
    in?: $Enums.TrainingFormat[] | ListEnumTrainingFormatFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrainingFormat[] | ListEnumTrainingFormatFieldRefInput<$PrismaModel>
    not?: NestedEnumTrainingFormatWithAggregatesFilter<$PrismaModel> | $Enums.TrainingFormat
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTrainingFormatFilter<$PrismaModel>
    _max?: NestedEnumTrainingFormatFilter<$PrismaModel>
  }

  export type NestedEnumContactLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContactLevel | EnumContactLevelFieldRefInput<$PrismaModel>
    in?: $Enums.ContactLevel[] | ListEnumContactLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContactLevel[] | ListEnumContactLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumContactLevelWithAggregatesFilter<$PrismaModel> | $Enums.ContactLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumContactLevelFilter<$PrismaModel>
    _max?: NestedEnumContactLevelFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type RecommendationSnapshotCreateWithoutSubmissionInput = {
    id?: string
    sectionId: string
    sectionName: string
    score: number
    rank: number
    reasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RecommendationSnapshotUncheckedCreateWithoutSubmissionInput = {
    id?: string
    sectionId: string
    sectionName: string
    score: number
    rank: number
    reasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RecommendationSnapshotCreateOrConnectWithoutSubmissionInput = {
    where: RecommendationSnapshotWhereUniqueInput
    create: XOR<RecommendationSnapshotCreateWithoutSubmissionInput, RecommendationSnapshotUncheckedCreateWithoutSubmissionInput>
  }

  export type RecommendationSnapshotCreateManySubmissionInputEnvelope = {
    data: RecommendationSnapshotCreateManySubmissionInput | RecommendationSnapshotCreateManySubmissionInput[]
    skipDuplicates?: boolean
  }

  export type RecommendationSnapshotUpsertWithWhereUniqueWithoutSubmissionInput = {
    where: RecommendationSnapshotWhereUniqueInput
    update: XOR<RecommendationSnapshotUpdateWithoutSubmissionInput, RecommendationSnapshotUncheckedUpdateWithoutSubmissionInput>
    create: XOR<RecommendationSnapshotCreateWithoutSubmissionInput, RecommendationSnapshotUncheckedCreateWithoutSubmissionInput>
  }

  export type RecommendationSnapshotUpdateWithWhereUniqueWithoutSubmissionInput = {
    where: RecommendationSnapshotWhereUniqueInput
    data: XOR<RecommendationSnapshotUpdateWithoutSubmissionInput, RecommendationSnapshotUncheckedUpdateWithoutSubmissionInput>
  }

  export type RecommendationSnapshotUpdateManyWithWhereWithoutSubmissionInput = {
    where: RecommendationSnapshotScalarWhereInput
    data: XOR<RecommendationSnapshotUpdateManyMutationInput, RecommendationSnapshotUncheckedUpdateManyWithoutSubmissionInput>
  }

  export type RecommendationSnapshotScalarWhereInput = {
    AND?: RecommendationSnapshotScalarWhereInput | RecommendationSnapshotScalarWhereInput[]
    OR?: RecommendationSnapshotScalarWhereInput[]
    NOT?: RecommendationSnapshotScalarWhereInput | RecommendationSnapshotScalarWhereInput[]
    id?: StringFilter<"RecommendationSnapshot"> | string
    submissionId?: StringFilter<"RecommendationSnapshot"> | string
    sectionId?: StringFilter<"RecommendationSnapshot"> | string
    sectionName?: StringFilter<"RecommendationSnapshot"> | string
    score?: FloatFilter<"RecommendationSnapshot"> | number
    rank?: IntFilter<"RecommendationSnapshot"> | number
    reasons?: JsonNullableFilter<"RecommendationSnapshot">
    createdAt?: DateTimeFilter<"RecommendationSnapshot"> | Date | string
  }

  export type SurveySubmissionCreateWithoutRecommendationsInput = {
    id?: string
    telegramUserId?: string | null
    chatId?: string | null
    age: number
    gender: $Enums.Gender
    fitnessLevel: $Enums.FitnessLevel
    preferredFormats?: SurveySubmissionCreatepreferredFormatsInput | $Enums.TrainingFormat[]
    desiredGoals?: SurveySubmissionCreatedesiredGoalsInput | $Enums.GoalTag[]
    avoidContact: boolean
    interestedInCompetition: boolean
    aiSummary?: string | null
    createdAt?: Date | string
  }

  export type SurveySubmissionUncheckedCreateWithoutRecommendationsInput = {
    id?: string
    telegramUserId?: string | null
    chatId?: string | null
    age: number
    gender: $Enums.Gender
    fitnessLevel: $Enums.FitnessLevel
    preferredFormats?: SurveySubmissionCreatepreferredFormatsInput | $Enums.TrainingFormat[]
    desiredGoals?: SurveySubmissionCreatedesiredGoalsInput | $Enums.GoalTag[]
    avoidContact: boolean
    interestedInCompetition: boolean
    aiSummary?: string | null
    createdAt?: Date | string
  }

  export type SurveySubmissionCreateOrConnectWithoutRecommendationsInput = {
    where: SurveySubmissionWhereUniqueInput
    create: XOR<SurveySubmissionCreateWithoutRecommendationsInput, SurveySubmissionUncheckedCreateWithoutRecommendationsInput>
  }

  export type SurveySubmissionUpsertWithoutRecommendationsInput = {
    update: XOR<SurveySubmissionUpdateWithoutRecommendationsInput, SurveySubmissionUncheckedUpdateWithoutRecommendationsInput>
    create: XOR<SurveySubmissionCreateWithoutRecommendationsInput, SurveySubmissionUncheckedCreateWithoutRecommendationsInput>
    where?: SurveySubmissionWhereInput
  }

  export type SurveySubmissionUpdateToOneWithWhereWithoutRecommendationsInput = {
    where?: SurveySubmissionWhereInput
    data: XOR<SurveySubmissionUpdateWithoutRecommendationsInput, SurveySubmissionUncheckedUpdateWithoutRecommendationsInput>
  }

  export type SurveySubmissionUpdateWithoutRecommendationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    telegramUserId?: NullableStringFieldUpdateOperationsInput | string | null
    chatId?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    fitnessLevel?: EnumFitnessLevelFieldUpdateOperationsInput | $Enums.FitnessLevel
    preferredFormats?: SurveySubmissionUpdatepreferredFormatsInput | $Enums.TrainingFormat[]
    desiredGoals?: SurveySubmissionUpdatedesiredGoalsInput | $Enums.GoalTag[]
    avoidContact?: BoolFieldUpdateOperationsInput | boolean
    interestedInCompetition?: BoolFieldUpdateOperationsInput | boolean
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SurveySubmissionUncheckedUpdateWithoutRecommendationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    telegramUserId?: NullableStringFieldUpdateOperationsInput | string | null
    chatId?: NullableStringFieldUpdateOperationsInput | string | null
    age?: IntFieldUpdateOperationsInput | number
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    fitnessLevel?: EnumFitnessLevelFieldUpdateOperationsInput | $Enums.FitnessLevel
    preferredFormats?: SurveySubmissionUpdatepreferredFormatsInput | $Enums.TrainingFormat[]
    desiredGoals?: SurveySubmissionUpdatedesiredGoalsInput | $Enums.GoalTag[]
    avoidContact?: BoolFieldUpdateOperationsInput | boolean
    interestedInCompetition?: BoolFieldUpdateOperationsInput | boolean
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationSnapshotCreateManySubmissionInput = {
    id?: string
    sectionId: string
    sectionName: string
    score: number
    rank: number
    reasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RecommendationSnapshotUpdateWithoutSubmissionInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: StringFieldUpdateOperationsInput | string
    sectionName?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    rank?: IntFieldUpdateOperationsInput | number
    reasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationSnapshotUncheckedUpdateWithoutSubmissionInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: StringFieldUpdateOperationsInput | string
    sectionName?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    rank?: IntFieldUpdateOperationsInput | number
    reasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationSnapshotUncheckedUpdateManyWithoutSubmissionInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: StringFieldUpdateOperationsInput | string
    sectionName?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    rank?: IntFieldUpdateOperationsInput | number
    reasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}