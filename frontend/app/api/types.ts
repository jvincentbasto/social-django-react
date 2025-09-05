import { invertKeys } from "~/utils/utils";

// generic namespace builder
export namespace GenericNamespace {
  // generic pick types 
  export type GenericTypeObjectPick<O, K extends keyof O> = Pick<O, K>;
  export type GenericTypeValuePick<O, K extends keyof O> = O[K];

  // generic key mapper
  export type GenericKeyMapper<T, C extends Record<string, string>> = {
    [K in keyof T as C[K & keyof C]]: T[K];
  };

  // builder
  export type Builder<Main, Custom extends object = {}, K extends ConstantsType = {}> = {
    MainFields: Main;
    CustomFields: Partial<Custom>;

    AllFields: Main & Partial<Custom>
    PartialFields: Partial<Main & Custom>

    Keys: KeyMapper<K>
    Self: GenericSelf<Main, Custom>
    InvertedFields: InverseFieldMapper<Main, Custom, K>
  };

  // NOTE: Generic helpers need to be *separate*

  // generic key mapper
  type ConstantsType = { main: Record<string, string>; custom: Record<string, string> } | Record<string, any>
  export type KeyMapper<K extends ConstantsType> = {
    keys: {
      main: keyof K["main"];
      custom: keyof K["custom"];
      all: keyof (K["main"] & K["custom"]);
    };
    values: {
      main: K["main"][keyof K["main"]];
      custom: K["custom"][keyof K["custom"]];
      all:
      | K["main"][keyof K["main"]]
      | K["custom"][keyof K["custom"]];
    };
    all: {
      keys: KeyMapper<K>["keys"]["all"];
      values: KeyMapper<K>["values"]["all"];
      all: KeyMapper<K>["keys"]["all"] | KeyMapper<K>["values"]["all"];
    }
  };
  // generic self
  type GenericSelf<M, C> = Partial<{
    main: M,
    custom: Partial<C>

    all: M & Partial<C>
    partial: Partial<M & C>

    keyof: keyof Partial<M & C>
  }>
  // generic field mapper
  export type InverseFieldMapper<M, C, K extends ConstantsType> = {
    main: GenericKeyMapper<M, K["main"]>;
    custom: GenericKeyMapper<C, K["custom"]>;

    all: GenericKeyMapper<M, K["main"]> &
    Partial<GenericKeyMapper<C, K["custom"]>>;
    partial: Partial<GenericKeyMapper<M, K["main"]> &
      GenericKeyMapper<C, K["custom"]>>;

    Self: GenericSelf<GenericKeyMapper<M, K["main"]>, GenericKeyMapper<M, K["custom"]>>
  };

  // helper picks
  type HelperPick<M, C, K extends ConstantsType> = Partial<M & C> & GenericSelf<M, C> & InverseFieldMapper<M, C, K>['partial']
  type HelperPickKeys<M, C, K extends ConstantsType> = keyof HelperPick<M, C, K>

  // generic picks
  export type ObjectPick<
    Main,
    Custom extends object,
    K extends ConstantsType,
    T extends HelperPickKeys<Main, Custom, K>
  > = GenericTypeObjectPick<HelperPick<Main, Custom, K>, T>;
  export type ValuePick<
    Main,
    Custom extends object,
    K extends ConstantsType,
    T extends HelperPickKeys<Main, Custom, K>
  > = GenericTypeValuePick<HelperPick<Main, Custom, K>, T>;
}

// register types
export namespace ApiRegister {
  const keys = {
    main: {
      username: "username",
      email: "email",
      firstName: "first_name",
      lastName: "last_name",
      password: "password",
    },
    custom: {
      confirmPassword: "confirm_password",
      profileImage: "profile_image",
    },
  } as const;
  export const constants = {
    ...keys,
    all: { ...keys.main, ...keys.custom },
    inverted: {
      main: invertKeys(keys.main),
      custom: invertKeys(keys.custom),
      all: invertKeys({ ...keys.main, ...keys.custom }),
    }

  } as const;

  type Main = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };
  type Custom = {
    confirmPassword?: string;
    profileImage?: string;
  };

  // 
  export type Fields = GenericNamespace.Builder<Main, Custom, typeof constants>;
  export type Keys = Fields['Keys']
  export type InvertedFields = Fields['InvertedFields']
  // 
  export type ObjectPick<T extends Keys['all']['all']> =
    GenericNamespace.ObjectPick<Main, Custom, typeof constants, T>;
  export type ValuePick<T extends Keys['all']['all']> =
    GenericNamespace.ValuePick<Main, Custom, typeof constants, T>;
  // 
  export type ConvertKeyParams = {
    toDefault: {
      1: InvertedFields["partial"];
      2: typeof constants.inverted.all;
      3: keyof typeof constants.inverted.all;
    }
    toInverse: {
      1: Fields["PartialFields"];
      2: typeof constants.all;
      3: keyof typeof constants.all;
    }
  };

}

// login types
export namespace ApiLogin {
  const keys = {
    main: {
      username: "username",
      password: "password",
    },
    custom: {
      username: "username",
      password: "password",
    },
  } as const;
  export const constants = {
    ...keys,
    all: { ...keys.main, ...keys.custom },
    inverted: {
      main: invertKeys(keys.main),
      custom: invertKeys(keys.custom),
      all: invertKeys({ ...keys.main, ...keys.custom }),
    }

  } as const;

  type Main = {
    username: string;
    password: string;
  };
  type Custom = {
    username?: string;
    email?: string;
  };

  // 
  export type Fields = GenericNamespace.Builder<Main, Custom, typeof constants>;
  export type Keys = Fields['Keys']
  export type InvertedFields = Fields['InvertedFields']
  // 
  export type ObjectPick<T extends Keys['all']['all']> =
    GenericNamespace.ObjectPick<Main, Custom, typeof constants, T>;
  export type ValuePick<T extends Keys['all']['all']> =
    GenericNamespace.ValuePick<Main, Custom, typeof constants, T>;
  // 
  export type ConvertKeyParams = {
    toDefault: {
      1: InvertedFields["partial"];
      2: typeof constants.inverted.all;
      3: keyof typeof constants.inverted.all;
    }
    toInverse: {
      1: Fields["PartialFields"];
      2: typeof constants.all;
      3: keyof typeof constants.all;
    }
  };

}

// user types
export namespace ApiUser {
  const keyUserPost = {
    // user posts
    image: "image",
    liked: "liked",
    likes: "likes",
    likeCount: "like_count",
    likeUsers: "like_users",
    user: "user",
  } as const
  const keys = {
    main: {
      id: "id",
      email: "email",
      username: "username",
      profileImage: "profile_image",
      firstName: "first_name",
      lastName: "last_name",
      bio: "bio",
    },
    custom: {
      following: "following",
      followerCount: "follower_count",
      followingCount: "following_count",
      userFollowers: "user_followers",
      userFollowing: "user_following",
      createdAt: "created_at",
      formattedCreatedAt: "formatted_created_at",
      isOurProfile: "is_our_profile",
      // user posts
      ...keyUserPost
    },
  } as const;
  export const constants = {
    ...keys,
    all: { ...keys.main, ...keys.custom },
    inverted: {
      main: invertKeys(keys.main),
      custom: invertKeys(keys.custom),
      all: invertKeys({ ...keys.main, ...keys.custom }),
    }

  } as const;

  type UserPost = {
    image: string,
    liked: boolean,
    likes: number[],
    likeCount: number,
    likeUsers: Fields['PartialFields'][],
    user: Fields['PartialFields'],
  };
  type Main = {
    id: string,
    email: string,
    username: string,
    profileImage: string,
    firstName: string,
    lastName: string,
    bio: string,
  };
  type Custom = {
    following?: boolean,
    followerCount?: number,
    followingCount?: number,
    userFollowers?: Fields["PartialFields"][],
    userFollowing?: Fields["PartialFields"][],
    isOurProfile?: boolean,
    createdAt?: string,
    formattedCreatedAt?: string,
    // user posts
  } & Partial<UserPost>;

  // 
  export type Fields = GenericNamespace.Builder<Main, Custom, typeof constants>;
  export type Keys = Fields['Keys']
  export type InvertedFields = Fields['InvertedFields']
  // 
  export type ObjectPick<T extends Keys['all']['all']> =
    GenericNamespace.ObjectPick<Main, Custom, typeof constants, T>;
  export type ValuePick<T extends Keys['all']['all']> =
    GenericNamespace.ValuePick<Main, Custom, typeof constants, T>;
  // 
  export type ConvertKeyParams = {
    toDefault: {
      1: InvertedFields["partial"];
      2: typeof constants.inverted.all;
      3: keyof typeof constants.inverted.all;
    }
    toInverse: {
      1: Fields["PartialFields"];
      2: typeof constants.all;
      3: keyof typeof constants.all;
    }
  };

}

// post types
export namespace ApiPost {
  const keys = {
    main: {
      id: "id",
      user: "user",
      username: "username",
      description: "description",
      image: "image",
      liked: "liked",
    },
    custom: {
      likeCount: "like_count",
      likeUsers: "like_users",
      formattedCreatedAt: "formatted_created_at",
    },
  } as const;
  export const constants = {
    ...keys,
    all: { ...keys.main, ...keys.custom },
    inverted: {
      main: invertKeys(keys.main),
      custom: invertKeys(keys.custom),
      all: invertKeys({ ...keys.main, ...keys.custom }),
    }
  } as const;

  type Main = {
    id: string | number;
    user: string | number | ApiUser.Fields['PartialFields'];
    username: string;
    description: string;
    image: string | File;
    liked: boolean;
  };
  type Custom = {
    likeCount: number;
    likeUsers: string[] | number[] | ApiUser.Fields['PartialFields'][];
    formattedCreatedAt: string;
  };

  // Setup
  export type Fields = GenericNamespace.Builder<Main, Custom, typeof constants>;
  export type Keys = Fields['Keys']
  export type InvertedFields = Fields['InvertedFields']
  // 
  export type ObjectPick<T extends Keys['all']['all']> =
    GenericNamespace.ObjectPick<Main, Custom, typeof constants, T>;
  export type ValuePick<T extends Keys['all']['all']> =
    GenericNamespace.ValuePick<Main, Custom, typeof constants, T>;
  // 
  export type ConvertKeyParams = {
    toDefault: {
      1: InvertedFields["partial"];
      2: typeof constants.inverted.all;
      3: keyof typeof constants.inverted.all;
    }
    toInverse: {
      1: Fields["PartialFields"];
      2: typeof constants.all;
      3: keyof typeof constants.all;
    }
  };
}
