export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(q)}`);
  const data = await res.json();

  return Response.json(data);
}
