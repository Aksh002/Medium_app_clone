import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { loaderAtom } from "../atoms/loaderAt";
import { tokenAtom } from "../atoms/tokenAt";
import { api } from "../lib/api";
import { InputBox } from "./InputBox";
import Submit from "./Submit";

interface Props {
  type: "Signup" | "Signin";
  fxn?: (isSignin: boolean) => void;
}

export const Onboarding = ({ type, fxn }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setLoader = useSetRecoilState(loaderAtom);
  const setToken = useSetRecoilState(tokenAtom);
  const navigate = useNavigate();

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    setError("");
    setIsSubmitting(true);
    setLoader(true);

    try {
      const token =
        type === "Signup"
          ? await api.signup({ email, password, userName, firstName })
          : await api.signin({ email, password });
      setToken(token);
      await api.me();
      navigate("/blogs", { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Authentication failed");
    } finally {
      setIsSubmitting(false);
      setLoader(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md rounded bg-stone-950 p-8 text-stone-50 shadow-2xl shadow-stone-950/30"
    >
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
          {type === "Signup" ? "Start learning in public" : "Welcome back"}
        </p>
        <h2 className="mt-2 text-3xl font-serif">{type === "Signup" ? "Create your desk" : "Open your desk"}</h2>
      </div>

      <div className="space-y-4">
        <InputBox set={setEmail} label="Email" type="email" />
        {type === "Signup" && <InputBox set={setUserName} label="User name" />}
        <InputBox set={setPassword} label="Password" type="password" />
        {type === "Signup" && <InputBox set={setFirstName} label="Display name" />}
      </div>

      {error && <div className="mt-4 rounded border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-100">{error}</div>}

      <div className="mt-6">
        <Submit onClick={() => undefined} disabled={isSubmitting} label={isSubmitting ? "Working..." : type} />
      </div>

      <div className="mt-5 text-sm text-stone-300">
        {type === "Signup" ? "Already have an account? " : "New here? "}
        {fxn ? (
          <button
            type="button"
            className="font-semibold text-amber-300 underline-offset-4 hover:underline"
            onClick={() => fxn(type === "Signup")}
          >
            {type === "Signup" ? "Signin" : "Signup"}
          </button>
        ) : (
          <Link className="font-semibold text-amber-300 underline-offset-4 hover:underline" to={type === "Signup" ? "/signin" : "/signup"}>
            {type === "Signup" ? "Signin" : "Signup"}
          </Link>
        )}
      </div>
    </form>
  );
};
