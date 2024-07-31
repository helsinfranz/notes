import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import classes from "@/styles/auth.module.css";
import { signIn } from "next-auth/react";
import Spinner from "@/components/spinner";
import { useSession } from "next-auth/react";
import Loader from "@/components/loader";

export default function Auth() {
  const router = useRouter();
  const authKey = router.query.authKey as string;
  const userName = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const loginEmail = useRef<HTMLInputElement>(null);
  const loginPassword = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (authKey && !["login", "signup"].includes(authKey)) {
      router.push("/auth/login");
    }
  }, [authKey]);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true);
    const name = userName.current?.value ?? "";
    const email = emailRef.current?.value ?? "";
    const password = passwordRef.current?.value ?? "";

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert("Signup successful");
        router.push("/auth/login");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true);
    const email = loginEmail.current?.value ?? "";
    const password = loginPassword.current?.value ?? "";
    const res = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });
    if (res?.error) {
      alert(res.error);
    } else {
      router.push("/");
    }
    setLoading(false);
  }

  if (status === "authenticated") {
    router.push("/");
  } else if (status === "unauthenticated") {
    return (
      <>
        <Head>
          <title>{authKey === "signup" ? "Sign up" : "Login"}</title>
          <meta
            name="description"
            content={
              (authKey === "signup" ? "Sign up" : "Login") + " to Workflo!"
            }
          />
          <style>
            {`body { 
            align-items: center;
            background: linear-gradient(to bottom, #ffffff, #afa3ff);
          }`}
          </style>
        </Head>
        <div className={classes.container}>
          <div className={classes.login_box}>
            <h1 className={classes.h1}>
              Welcome to <span className={classes.highlight}>Workflo</span>!
            </h1>
            {authKey === "signup" ? (
              <form className={classes.form} onSubmit={handleSignup}>
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  className={classes.input}
                  minLength={3}
                  maxLength={20}
                  ref={userName}
                />
                <input
                  type="email"
                  placeholder="Your email"
                  required
                  className={classes.input}
                  ref={emailRef}
                />
                <div className={classes.input_box}>
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    minLength={4}
                    maxLength={20}
                    className={classes.input}
                    ref={passwordRef}
                  />
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() =>
                      passwordRef.current!.type === "password"
                        ? (passwordRef.current!.type = "text")
                        : (passwordRef.current!.type = "password")
                    }
                  >
                    <path
                      d="M3 13C6.6 5 17.4 5 21 13"
                      stroke="#999999"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z"
                      stroke="#999999"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <button
                  type="submit"
                  className={`${classes.active_btn} ${classes.button}`}
                >
                  {loading ? <Spinner /> : "Sign up"}
                </button>
              </form>
            ) : (
              <form className={classes.form} onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Your email"
                  required
                  className={classes.input}
                  ref={loginEmail}
                />
                <div className={classes.input_box}>
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    minLength={4}
                    maxLength={20}
                    className={classes.input}
                    ref={loginPassword}
                  />
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() =>
                      loginPassword.current!.type === "password"
                        ? (loginPassword.current!.type = "text")
                        : (loginPassword.current!.type = "password")
                    }
                  >
                    <path
                      d="M3 13C6.6 5 17.4 5 21 13"
                      stroke="#999999"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z"
                      stroke="#999999"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <button
                  type="submit"
                  className={`${classes.active_btn} ${classes.button}`}
                >
                  {loading ? <Spinner /> : "Login"}
                </button>
              </form>
            )}
            <p className={classes.p}>
              {authKey === "signup" ? (
                <>
                  Already have an account?
                  <a className={classes.a}>
                    <span
                      className={classes.highlight}
                      onClick={() => router.push("/auth/login")}
                    >
                      {" "}
                      Log in
                    </span>
                    .
                  </a>
                </>
              ) : (
                <>
                  Don’t have an account?
                  <a className={classes.a}>
                    {" "}
                    Create a{" "}
                    <span
                      className={classes.highlight}
                      onClick={() => router.push("/auth/signup")}
                    >
                      new account
                    </span>
                    .
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </>
    );
  }
  return <Loader />;
}
