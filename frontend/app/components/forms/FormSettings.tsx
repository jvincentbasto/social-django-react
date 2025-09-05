import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { ApiUser } from "~/api/types";
import { useAuth } from "~/contexts/useAuth";
import { useUserHook } from "~/contexts/useUser";

type FormType = ApiUser.Fields["PartialFields"];

const FormSettings = () => {
  const navigate = useNavigate();
  const { dataUser } = useAuth();
  const { form, loading, updateUser, setForm, setErrors } = useUserHook();

  const [hydrated, setHydrated] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !form ||
      !form.username ||
      !form.email ||
      !form.firstName ||
      !form.lastName ||
      !form.bio
      // !form.profileImage
    ) {
      const error = { message: "All fields are required" };
      setErrors((state) => [...state, error]);
      return;
    }

    await updateUser(form);
    navigate(`/${form.username}`);
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

  //
  useEffect(() => {
    if (!hydrated) {
      setHydrated(true);
    } else {
      setForm(dataUser ?? {});
    }
  }, [hydrated]);

  return (
    <form onSubmit={handleSubmit} className="w-full mt-[20px]">
      <fieldset className="fieldset w-full">
        {/* <legend className="fieldset-legend">Settings</legend> */}

        <label htmlFor="username" className="label">
          Username
        </label>
        <input
          type="text"
          placeholder="Username"
          id="username"
          autoComplete="true"
          value={form?.username}
          onChange={(e) => handleTextInput(e, "username")}
          className="input w-full"
        />
        <label htmlFor="email" className="label">
          email
        </label>
        <input
          type="email"
          placeholder="Email"
          id="email"
          autoComplete="true"
          value={form?.email}
          onChange={(e) => handleTextInput(e, "email")}
          className="input w-full"
        />
        <label htmlFor="firstName" className="label">
          First Name
        </label>
        <input
          type="text"
          placeholder="First Name"
          id="firstName"
          autoComplete="true"
          value={form?.firstName}
          onChange={(e) => handleTextInput(e, "firstName")}
          className="input w-full"
        />
        <label htmlFor="lastName" className="label">
          Last Name
        </label>
        <input
          type="text"
          placeholder="Last Name"
          id="lastName"
          autoComplete="true"
          value={form?.lastName}
          onChange={(e) => handleTextInput(e, "lastName")}
          className="input w-full"
        />
        <label htmlFor="bio" className="label">
          Bio
        </label>
        <input
          type="text"
          placeholder="Bio"
          id="bio"
          autoComplete="true"
          value={form?.bio}
          onChange={(e) => handleTextInput(e, "bio")}
          className="input w-full"
        />
        <label htmlFor="profileImage" className="label">
          Profile Picture
        </label>
        <input
          type="file"
          placeholder="Profile Image"
          id="profileImage"
          autoComplete="true"
          onChange={(e) => handleImageInput(e, "profileImage")}
          className="input w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-neutral mt-[15px]"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </fieldset>
    </form>
  );
};

export default FormSettings;

export const FormCardSettings = () => {
  return (
    <div className="card bg-base-100 w-full min-w-[375px] shadow-xl">
      <div className="card-body w-full">
        <h1 className="card-title font-black text-[20px]">Settings</h1>
        {/* <p>card bod</p> */}
        <FormSettings />
        {/* <div className="card-actions justify-end mt-[10px]">
            <button className="btn btn-primary">Save</button>
          </div> */}
      </div>
    </div>
  );
};

export const FormModalToggleSettings = () => {
  return <></>;
};
export const FormModalSettings = () => {
  return <></>;
};
