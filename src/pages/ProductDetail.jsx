import { useParams } from "react-router-dom";
import Container from "../components/ui/Container";

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <Container className="py-20">
      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
        Product Detail
      </p>
      <h1 className="mt-2 font-display text-4xl text-[#f4efe6] sm:text-5xl">
        Fragrance #{id}
      </h1>
      <p className="mt-4 text-xs text-[#8e8a82]">
        Product details placeholder — will showcase sizes (2ml, 5ml, 10ml), scent notes, and dynamic pricing.
      </p>
    </Container>
  );
}
