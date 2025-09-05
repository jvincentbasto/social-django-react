import { useMemo, useState } from "react";
import { useUser, useUserHook } from "~/contexts/useUser";

type FormType = { query?: string };

interface FormSearchInterface {
  userHooks: ReturnType<typeof useUserHook>;
}
interface FormCardSearchInterface extends FormSearchInterface {}

const FormSearch = ({ userHooks }: FormSearchInterface) => {
  const { form, setForm } = useUserHook();
  const { loading, setErrors, searchUsers } = userHooks;
  // const {} = useUser();

  const [newForm, setNewForm] = useState<typeof form & FormType>({ query: "" });
  // const newForm = useMemo(() => {
  //   type NewForm = typeof form & FormType;

  //   // const values = { form, query: "" } as NewForm
  //   const values = { form, query: "" };
  //   return values;
  // }, [form]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newForm || !newForm.query) {
      const error = { message: "All fields are required" };
      setErrors((state) => [...state, error]);
      return;
    }

    await searchUsers(newForm.query);
  };
  const handleTextInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof FormType
  ) => {
    const values = { ...(newForm ?? {}), [key]: e.target.value };
    setNewForm(values);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-[10px]">
      <fieldset className="fieldset w-full">
        {/* <legend className="fieldset-legend">Search</legend> */}

        <label htmlFor="query" className="label hidden">
          Search
        </label>
        <input
          type="text"
          placeholder="Search"
          id="query"
          value={newForm?.query}
          onChange={(e) => handleTextInput(e, "query")}
          className="input w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-neutral mt-[15px]"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </fieldset>
    </form>
  );
};

export default FormSearch;

export const FormCardSearch = ({ userHooks }: FormCardSearchInterface) => {
  return (
    <div className="card bg-base-100 w-full min-w-[375px] shadow-lg">
      <div className="card-body w-full">
        <h1 className="card-title font-black text-[20px]">Search</h1>
        {/* <p>card bod</p> */}
        <FormSearch userHooks={userHooks} />
        {/* <div className="card-actions justify-end mt-[10px]">
            <button className="btn btn-primary">Save</button>
          </div> */}
      </div>
    </div>
  );
};

export const FormModalToggleSearch = () => {
  return <></>;
};
export const FormModalSearch = () => {
  return <></>;
};
