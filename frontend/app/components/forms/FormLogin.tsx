import { useNavigate } from "react-router";
import type { ApiLogin } from "~/api/types";
import { useAuth, useAuthHook } from "~/contexts/useAuth";

type FormType = ApiLogin.Fields["PartialFields"];

const FormLogin = () => {
  const navigate = useNavigate();
  const {
    formLogin: form,
    loading,
    setFormLogin: setForm,
    setLoading,
    setErrors,
  } = useAuthHook();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrors([]);

      if (!form || !form.username || !form.password) {
        const error = { message: "All fields are required" };
        setErrors((state) => [...state, error]);
        return;
      }

      await login(form);
      navigate(`/`);
    } catch {
      const error = { message: "Failed to login" };
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
    const newForm = { ...(form ?? {}), [key]: e.target.value };
    setForm(newForm);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-[20px]">
      <fieldset className="fieldset w-full">
        {/* <legend className="fieldset-legend">Login</legend> */}

        <label htmlFor="username" className="label">
          Username
        </label>
        <input
          type="text"
          placeholder="Username"
          id="username"
          value={form?.username}
          onChange={(e) => handleTextInput(e, "username")}
          className="input w-full"
        />
        <label htmlFor="password" className="label mt-[10px]">
          Password
        </label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={form?.password}
          onChange={(e) => handleTextInput(e, "password")}
          className="input w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-neutral mt-[15px]"
        >
          {loading ? "Logging In..." : "Login"}
        </button>
        <p className="text-[14px] text-gray-500 mt-[10px]">
          Don't have an account?
          <a href="/register" className="link link-hover ">
            {" "}
            Sign up now!
          </a>
        </p>
      </fieldset>
    </form>
  );
};

export default FormLogin;

export const FormCardLogin = () => {
  return (
    <div className="card bg-base-100 w-full min-w-[375px] max-w-[500px] shadow-xl mt-[160px]">
      <div className="card-body w-full">
        <h1 className="card-title font-black text-[20px]">Login</h1>
        {/* <p>card bod</p> */}
        <FormLogin />
        {/* <div className="card-actions justify-end mt-[10px]">
            <button className="btn btn-primary">Save</button>
          </div> */}
      </div>
    </div>
  );
};

export const FormModalToggleLogin = () => {
  return <></>;
};
export const FormModalLogin = () => {
  return <></>;
};
