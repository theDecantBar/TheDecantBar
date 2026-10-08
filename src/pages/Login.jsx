import { Link } from "react-router-dom";
import Container from "../components/ui/Container";

export default function Login() {
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-md">
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
          Welcome Back
        </p>
        <h1 className="mt-2 font-display text-4xl text-[#f4efe6]">
          Sign In
        </h1>
        <p className="mt-4 text-xs text-[#8e8a82]">
          Authentication placeholder page.
        </p>
        <div className="mt-6 text-xs text-[#c5c1b9]">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#c6a15b] hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </Container>
  );
}
