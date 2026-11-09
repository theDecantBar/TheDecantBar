import { Link } from "react-router-dom";
import { Compass, ArrowRight } from "lucide-react";
import Container from "../components/ui/Container";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#11110f] text-[#f4efe6] py-16">
      <Container className="text-center max-w-xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#c6a15b]/30 bg-[#c6a15b]/10 text-[#c6a15b]">
          <Compass size={36} strokeWidth={1.5} />
        </div>

        <p className="text-xs uppercase tracking-[0.35em] text-[#c6a15b]">
          404 · Fragrance Not Found
        </p>

        <h1 className="mt-3 font-display text-4xl sm:text-5xl text-[#f4efe6]">
          The Scent has Evaporated
        </h1>

        <p className="mt-4 text-xs sm:text-sm text-[#8e8a82] leading-relaxed max-w-md mx-auto">
          The page or fragrance you are seeking does not exist or may have been relocated in our vault.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-[#c6a15b] bg-[#c6a15b] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#11110f] transition hover:bg-[#d8c08a]"
          >
            <span>Explore Collection</span>
            <ArrowRight size={15} />
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-[#c5c1b9] transition hover:border-[#c6a15b]/60 hover:text-[#f4efe6]"
          >
            Return Home
          </Link>
        </div>
      </Container>
    </div>
  );
}

