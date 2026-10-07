import Container from "../components/ui/Container";

export default function Account() {
  return (
    <Container className="py-20">
      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
        Client Portal
      </p>
      <h1 className="mt-2 font-display text-4xl text-[#f4efe6] sm:text-5xl">
        My Account
      </h1>
      <p className="mt-4 text-xs text-[#8e8a82]">
        Account dashboard placeholder.
      </p>
    </Container>
  );
}
