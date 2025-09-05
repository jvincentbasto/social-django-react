import { useNavigate } from "react-router";
import type { ApiRegister } from "~/api/types";
import { useAuth, useAuthHook } from "~/contexts/useAuth";

type FormType = ApiRegister.Fields["PartialFields"];

const FormRegister = () => {
  const navigate = useNavigate();
  const {
    formRegister: form,
    loading,
    register,
    setFormRegister: setForm,
    setLoading,
    setErrors,
  } = useAuthHook();
  // const {} = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrors([]);

      if (
        !form ||
        !form.username ||
        !form.email ||
        !form.firstName ||
        !form.lastName ||
        !form.password ||
        !form.confirmPassword
      ) {
        const error = { message: "All fields are required" };
        setErrors((state) => [...state, error]);
        return;
      }

      if (form.password !== form.confirmPassword) {
        const error = { message: "Passwords are not identical" };
        setErrors((state) => [...state, error]);
        return;
      }

      await register(form);
      navigate(`/login`);
    } catch {
      const error = { message: "Failed to register" };
      setErrors((state) => [...state, error]);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const handleTextInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof FormType
  ) => {
    const newForm = { ...(form ?? {}), [key]: e.target.value } as FormType;
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

  return (
    <form onSubmit={handleSubmit} className="w-full mt-[20px]">
      <fieldset className="fieldset w-full">
        {/* <legend className="fieldset-legend">Register</legend> */}

        <label htmlFor="username" className="label">
          Username
        </label>
        <input
          type="text"
          placeholder="Username"
          id="username"
          value={form?.username}
          autoComplete="true"
          onChange={(e) => handleTextInput(e, "username")}
          className="input w-full"
        />
        <label htmlFor="email" className="label">
          Email
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
          value={form?.lastName}
          onChange={(e) => handleTextInput(e, "lastName")}
          className="input w-full"
        />
        <label htmlFor="password" className="label mt-[10px]">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          onChange={(e) => handleTextInput(e, "password")}
          className="input w-full"
        />
        <label htmlFor="confirmPassword" className="label mt-[10px]">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm Password"
          onChange={(e) => handleTextInput(e, "confirmPassword")}
          className="input w-full"
        />
        <label htmlFor="profileImage" className="label">
          Profile Picture
        </label>
        <input
          type="file"
          placeholder="profileImage"
          onChange={(e) => handleImageInput(e, "profileImage")}
          className="input w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-neutral mt-[15px]"
        >
          {loading ? "Register..." : "Register"}
        </button>
        <p className="text-[14px] text-gray-500 mt-[10px]">
          Already have an account?{" "}
          <a href="/login" className="link link-hover">
            Log in now!
          </a>
        </p>
      </fieldset>
    </form>
  );
};

export default FormRegister;

export const FormCardRegister = () => {
  return (
    <div className="card bg-base-100 w-full min-w-[375px] max-w-[500px] shadow-xl mt-[20px]">
      <div className="card-body w-full">
        <h1 className="card-title font-black text-[20px]">Register</h1>
        {/* <p>card bod</p> */}
        <FormRegister />
        {/* <div className="card-actions justify-end mt-[10px]">
            <button className="btn btn-primary">Save</button>
          </div> */}
      </div>
    </div>
  );
};

export const FormModalToggleRegister = () => {
  return <></>;
};
export const FormModalRegister = () => {
  return <></>;
};
