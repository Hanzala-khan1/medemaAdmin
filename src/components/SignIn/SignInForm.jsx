import { useMutation } from "@tanstack/react-query";
import { Form, notification } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

const SignInForm = () => {
  const router = useRouter();
  const { mutate: login, isLoading } = useMutation(
    async (values) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        console.log("res", response);
        console.log("error", await response.text());
        throw new Error(await response.text());
      }

      return response.json();
    },
    {
      onSuccess: (data) => {
        // Handle successful login, e.g., store the token in local storage
        console.log("Login successful!", data);
        router.push("/");
      },
    }
  );

  const handleSubmit = (values) => {
    console.log("values", values);
    login(values);
  };
  return (
    <div className="w-full">
      <div className="bg-white shadow-form rounded-[43px] md:px-8 pt-14 pb-10 mb-4 flex flex-col md:space-y-8">
        <h2 className="text-xl md:text-[2.813rem] leading-[2.75rem] text-center font-semibold mb-4 font-[Montserrat]">
          Login
        </h2>
        <Form
          onFinish={handleSubmit}
          className="mx-auto md:w-1/2 flex flex-col space-y-2 md:px-12"
        >
          <div className="mb-4">
            <label
              className="block font-medium mb-2 text-sm md:text-xl"
              htmlFor="name"
            >
              Email
            </label>
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <input
                className="text-sm md:text-lg border-2 border-black opacity-40 rounded-xl w-full py-3 md:py-4 px-3 leading-tight focus:outline-none text-black"
                id="email"
                type="email"
                placeholder="Enter your email.."
              />
            </Form.Item>
          </div>
          <div className="mb-4">
            <label
              className="block font-medium mb-2 text-sm md:text-xl"
              htmlFor="email"
            >
              Password
            </label>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <input
                className="text-sm md:text-lg border-2 border-black opacity-40 rounded-xl w-full py-3 md:py-4 px-3 leading-tight focus:outline-none focus:shadow-outline text-black"
                id="password"
                type="password"
                placeholder="Enter your password.."
              />
            </Form.Item>
          </div>
          <div className="flex items-center justify-end">
            <Link
              href={"#"}
              className="text-orange text-sm md:text-xl font-normal"
            >
              Forgot password?
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="text-sm md:text-lg bg-primary rounded-xl text-white font-medium py-3 lg:py-4 px-4 focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignInForm;
