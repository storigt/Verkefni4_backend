/**
 * Result type. Wraps a call result with either an Ok value or an Error.
 * If the call was successful, `ok` is true and `value` contains the result.
 * If the call failed, `ok` is false and `error` contains the error.
 * Default error type is `Error`.
 */
export type Result<Ok, Err = Error> =
  | { ok: true; value: Ok }
  | { ok: false; error: Err };

export type Paginated<T> = {
  data: T[];
  total: number;
  limit: number;
  offset: number;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type LimitOffset = {
  limit: number;
  offset: number;
};

/** Explicit type for a slug, see how we use it with type guards in slug.ts */
export type Slug = string & { __brand: 'slug' };

export type CategoryToCreate = {
  name: string;
};

export type CategoryCreateResult =
  | {
      created: true;
      category: Category;
    }
  | {
      created: false;
      category: Category;
      reason: 'exists';
    }
  | {
      created: false;
      reason: 'invalid-slug';
    };

export interface ICategory {
  getCategories(limitOffset: LimitOffset): Promise<Result<Paginated<Category>>>;
  getCategoryBySlug(slug: Slug): Promise<Result<Category | null>>;
  createCategory(
    category: CategoryToCreate,
  ): Promise<Result<CategoryCreateResult>>;
  updateCategory(
    slug: Slug,
    category: CategoryToCreate,
  ): Promise<Result<Category | null>>;
  deleteCategory(slug: Slug): Promise<Result<boolean | null>>;
}
