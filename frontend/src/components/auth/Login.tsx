import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/user.api";
import { setCredentials } from "../../store/slices/authSlice";
import { AxiosError } from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import {
  AuthenticateSchema,
  type AuthenticateFormData,
} from "@/types/schema/AuthenticateSchema";

export const Login = () => {
  const [email, setEmail] = useState("afsal@gmail.com");
  const [password, setPassword] = useState("123123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data: AuthenticateFormData = { email, password };
      const result = AuthenticateSchema.safeParse(data);
      if (!result.success) {
        //@ts-ignore
        setError(result.error.errors[0].message);
        setLoading(false);
        return;
      }

      const { user } = await loginUser(email, password);
      dispatch(setCredentials({ user }));
      navigate("/");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md sm:p-8 md:p-10">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
            aria-label="Email address"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Password
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
            aria-label="Password"
          />
        </div>
        <Button
          type="submit"
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
};
