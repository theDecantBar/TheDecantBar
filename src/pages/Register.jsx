import { Link } from "react-router-dom";
import Container from "../components/ui/Container";

export default function Register() {
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-md">
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
          Join The Decant Bar
        </p>
        <h1 className="mt-2 font-display text-4xl text-[#f4efe6]">
          Create Account
        </h1>
        <p className="mt-4 text-xs text-[#8e8a82]">
          Registration placeholder page.
        </p>
        <div className="mt-6 text-xs text-[#c5c1b9]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#c6a15b] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </Container>
  );
}
