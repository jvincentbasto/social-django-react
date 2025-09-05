import { useEffect, useMemo } from "react";
import type { ApiPost } from "~/api/types";
import envs from "~/constants/envs";
import { usePost, usePostHook } from "~/contexts/usePost";

const { apiUrl } = envs;

const sample = {
  image: "https://m.media-amazon.com/images/I/5132RLcVxhL.jpg",
};

type FormType = ApiPost.Fields["PartialFields"];

const FormPost = ({ navigateTo = "/" }: { navigateTo?: string }) => {
  const {
    form,
    loading,
    setLoading,
    setForm,
    setErrors,
    getPostById,
    updatePost,
  } = usePostHook();
  const {
    isUpdate,
    form: formCtx,
    setForm: setFormCtx,
    createPost,
  } = usePost();

  const bntTitle = useMemo(() => {
    if (loading) {
      return isUpdate ? "Updating..." : "Creating ...";
    } else {
      return isUpdate ? "Update Post" : "Create Post";
    }
  }, [isUpdate, loading]);

  const imageMemo = useMemo(() => {
    if (!form?.image) return null;

    // if form.image is a string (existing URL from API)
    if (typeof form.image === "string") {
      return `${apiUrl}${form.image}`;
    }

    // if form.image is a File (from file input)
    if (form.image instanceof File) {
      return URL.createObjectURL(form.image);
    }

    return null;
  }, [form?.image]);

  useEffect(() => {
    return () => {
      if (form?.image instanceof File) {
        URL.revokeObjectURL(imageMemo!);
      }
    };
  }, [form?.image, imageMemo]);

  // handlers
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form || !form.description) {
      const error = { message: "All fields are required" };
      setErrors((state) => [...state, error]);
      return;
    }

    try {
      setLoading(true);
      setErrors([]);

      if (isUpdate) {
        await updatePost(form);
      } else {
        await createPost(form);
      }
      window.location.href = navigateTo;
    } catch {
      const error = { message: "Failed to get posts" };
      setErrors((state) => [...state, error]);
      return { results: [], next: 0 };
    } finally {
      setLoading(false);
    }
  };
  const handleTextInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof FormType
  ) => {
    const newForm = { ...(form ?? {}), [key]: e.target.value };
    setForm(newForm);
  };
  const handleImageInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof FormType
  ) => {
    const target = e.target ?? {};
    const files = target.files ?? [];
    const file = files.length > 0 ? files[0] : "";

    const newForm = { ...(form ?? {}), [key]: file };
    setForm(newForm);
  };

  useEffect(() => {
    if (isUpdate) {
      setForm((state) => {
        return { ...state, ...formCtx };
      });

      // if (form?.id) {
      //   getPostById(form.id);
      // }
    }
  }, [isUpdate, formCtx]);

  const Media = () => {
    if (!imageMemo) return null;

    return (
      <div className="w-full h-[300px]">
        <div className="min-w-0 w-full h-full bg-gray-50/50">
          <img
            src={imageMemo}
            alt="Post Image"
            className="w-full h-full object-contain max-sm:object-cover lg:object-contain"
          ></img>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-[20px]">
      <fieldset className="fieldset w-full">
        {/* <legend className="fieldset-legend">Post</legend> */}

        {isUpdate ? (
          <div className="w-full">
            <Media />
          </div>
        ) : null}

        <label htmlFor="description" className="label">
          Description
        </label>
        <input
          type="text"
          placeholder="Description"
          id="description"
          value={form?.description}
          onChange={(e) => handleTextInput(e, "description")}
          className="input w-full"
        />
        <label htmlFor="image" className="label">
          Image
        </label>
        <input
          type="file"
          placeholder="Image"
          id="image"
          autoComplete="true"
          onChange={(e) => handleImageInput(e, "image")}
          className="input w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-neutral mt-[15px]"
        >
          {bntTitle}
        </button>
      </fieldset>
    </form>
  );
};

export default FormPost;

export const FormCardPost = ({
  title = "Create Post",
  navigateTo,
}: {
  title?: string;
  navigateTo?: string;
}) => {
  return (
    <div className="card bg-base-100 w-full min-w-[375px] shadow-md">
      <div className="card-body w-full">
        <h1 className="card-title font-black text-[20px]">{title}</h1>
        {/* <p>card bod</p> */}
        <FormPost navigateTo={navigateTo} />
        {/* <div className="card-actions justify-end mt-[10px]">
            <button className="btn btn-primary">Save</button>
          </div> */}
      </div>
    </div>
  );
};

export const FormModalTogglePost = () => {
  return <></>;
};
export const FormModalPost = () => {
  return <></>;
};
