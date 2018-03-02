export default `
/**
 * A context that which can be fmapped over.
 */
interface Functor<T> {
  fmap<U>(f: (a:T)=> U): Functor<U>;
}

/**
 * A Functor which further defines how to wrap values into
 * context.
 */
interface Applicative<T> extends Functor<T> {
  /**
   * Introduces value into context.
   */
  pure(a: T): Applicative<T>;

  /**
   * This is the '<*>' function in Haskell, which consists of invalid identifier
   * characters in TypeScript.  Moreover, there is no-pronounceable name for the thing.
   * This is a kind of apply, though.
   */
  ap<U>(f: Functor<U>): Functor<U>;
}

/**
 * Haskell defines 
 */
interface Monad<T> extends Applicative<T> {
  bind<U>(f: (a: T) => Monad<U>): Monad<U>;

  returnz(a: T): Monad<T>;
}


class Just<T> implements Monad<T> {
  constructor(public value: T) { }

  fmap<U>(f: ((a: T) => U)): Maybe<U> {
    // Should we support Just(null)?
    if (!this.value) {
        return Nothing.Instance;
    }
    const x: U = f(this.value);
    return x == null ? Nothing.Instance : new Just(x);
  }

  pure(a: T): Just<T> {
    return new Just(a);
  }

  ap<U>(f: Functor<U>): Functor<U> {
    // This container context type T must be a function. 
    const x: (a: U) => U = <(a: U) => U><any>this.value;
    return f.fmap(x);
  }

  bind<U>(f: (a: T) => Maybe<U>): Maybe<U> {
    return f(this.value);
  }

  returnz(a: T): Just<T> {
    return new Just(a);
  }

  toString() {
    return \`Just(\${this.value.toString()})\`;
  }
}


class Nothing<T> implements Monad<T> {
  private static instance: Nothing<any>;

  private constructor() { }

  fmap<U>(f: (a: T) => U): Maybe<U> {
    return <Nothing<U>><any>this;
  }

  pure(a: T): Nothing<T> {
    return Nothing.Instance;
  }

  ap<U>(f: Functor<U>): Functor<U> {
    return <Nothing<U>><any>this;
  }

  bind<U>(f: (a: T) => Maybe<U>): Maybe<U> {
    return <Nothing<U>><any>this;
  }

  returnz(a: T): Nothing<T> {
    return Nothing.Instance;
  }

  toString(): string {
    return 'Nothing()';
  }

  static get Instance(): Nothing<any> {
    return this.instance || (this.instance = new this<any>());
  }
}

type Maybe<T> = Just<T> | Nothing<T>;
`.split('\n').slice(1, -1).join('\n');